import { Expense } from '../models/expense.model';
import { Subscription } from '../models/subscription.model';
import { Budget } from '../models/budget.model';
import mongoose from 'mongoose';

export interface Insight {
  id: string;
  type: 'warning' | 'info' | 'success';
  title: string;
  message: string;
  actionRequired?: boolean;
}

export class InsightService {
  static async generateInsights(userId: string): Promise<Insight[]> {
    const userObjId = new mongoose.Types.ObjectId(userId);
    const insights: Insight[] = [];
    const now = new Date();
    
    // 1. Subscription Renewals
    const futureDate = new Date();
    futureDate.setDate(now.getDate() + 7);
    const upcomingSubs = await Subscription.find({
      userId: userObjId,
      status: 'active',
      nextBillingDate: { $gte: now, $lte: futureDate }
    });
    
    if (upcomingSubs.length > 0) {
      insights.push({
        id: `subs_${now.getTime()}`,
        type: 'warning',
        title: 'Upcoming Renewals',
        message: `You have ${upcomingSubs.length} subscription(s) renewing in the next 7 days totaling ₹${upcomingSubs.reduce((a, b) => a + b.amount, 0).toFixed(0)}.`,
        actionRequired: true
      });
    }

    // 2. Budget Alerts
    const period = now.toISOString().slice(0, 7);
    const budgets = await Budget.find({ userId: userObjId, period, alertsEnabled: true }).lean();
    
    if (budgets.length > 0) {
      // Calculate current month expenses
      const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
      
      const expenses = await Expense.aggregate([
        { $match: { userId: userObjId, date: { $gte: startDate, $lte: endDate } } },
        { $group: { _id: '$category', totalSpent: { $sum: '$amount' } } }
      ]);
      const expenseMap = new Map(expenses.map(e => [e._id, e.totalSpent]));

      for (const b of budgets) {
        const spent = expenseMap.get(b.categoryId) || 0;
        const progressPct = (spent / b.monthlyLimit) * 100;

        if (progressPct >= 100) {
          insights.push({
            id: `budget_exceeded_${b.categoryId}_${period}`,
            type: 'warning',
            title: `Budget Exceeded: ${b.categoryId}`,
            message: `You have exceeded your ₹${b.monthlyLimit} budget for ${b.categoryId} by ₹${(spent - b.monthlyLimit).toFixed(0)}.`
          });
        } else if (progressPct >= b.alertThreshold) {
          insights.push({
            id: `budget_warning_${b.categoryId}_${period}`,
            type: 'info',
            title: `Nearing Budget Limit: ${b.categoryId}`,
            message: `You have used ${progressPct.toFixed(0)}% of your ${b.categoryId} budget.`
          });
        }
      }
    }

    // 3. Month over Month Spike Detection
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const prevMonthCategories = await Expense.aggregate([
      { $match: { userId: userObjId, date: { $gte: lastMonthStart, $lte: lastMonthEnd } } },
      { $group: { _id: '$category', totalSpent: { $sum: '$amount' } } }
    ]);

    const currMonthCategories = await Expense.aggregate([
      { $match: { userId: userObjId, date: { $gte: currentMonthStart, $lte: now } } },
      { $group: { _id: '$category', totalSpent: { $sum: '$amount' } } }
    ]);

    const prevMap = new Map(prevMonthCategories.map(e => [e._id, e.totalSpent]));

    for (const curr of currMonthCategories) {
      const prevSpent = prevMap.get(curr._id) || 0;
      if (prevSpent > 0) {
        // Correcting partial month overlap is complex, but simple heuristic:
        // if curr spent > prev spent * 1.5, flag it.
        if (curr.totalSpent > prevSpent * 1.5 && curr.totalSpent > 1000) { // arbitrary threshold to ignore micro-expenses
           insights.push({
             id: `spike_${curr._id}_${period}`,
             type: 'warning',
             title: `Spending Spike Detected`,
             message: `You spent 50% more on ${curr._id} this month (₹${curr.totalSpent.toFixed(0)}) compared to all of last month.`
           });
        }
      }
    }

    return insights;
  }
}
