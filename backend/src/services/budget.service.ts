import { Budget, IBudget } from '../models/budget.model';
import { Expense } from '../models/expense.model';
import mongoose from 'mongoose';

export class BudgetService {
  static async upsertBudget(userId: string, data: Partial<IBudget>): Promise<IBudget> {
    const period = data.period || new Date().toISOString().slice(0, 7); // Defaults to current YYYY-MM
    
    return Budget.findOneAndUpdate(
      { 
        userId: new mongoose.Types.ObjectId(userId), 
        categoryId: data.categoryId, 
        period: period 
      },
      { $set: { ...data, userId: new mongoose.Types.ObjectId(userId), period } },
      { new: true, upsert: true, runValidators: true }
    );
  }

  static async getBudgetsWithProgress(userId: string, period: string) {
    const userObjId = new mongoose.Types.ObjectId(userId);
    
    // First find all budgets for this period
    const budgets = await Budget.find({ userId: userObjId, period }).lean();
    if (budgets.length === 0) return [];

    // Then find all expenses in this period to calculate actual spent
    const [year, month] = period.split('-');
    const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
    const endDate = new Date(parseInt(year), parseInt(month), 0, 23, 59, 59);

    const expenses = await Expense.aggregate([
      { 
        $match: { 
          userId: userObjId, 
          date: { $gte: startDate, $lte: endDate } 
        } 
      },
      { 
        $group: { 
          _id: '$category', 
          totalSpent: { $sum: '$amount' } 
        } 
      }
    ]);

    const expenseMap = new Map(expenses.map(e => [e._id, e.totalSpent]));

    return budgets.map(b => {
      const spent = expenseMap.get(b.categoryId) || 0;
      const progress = (spent / b.monthlyLimit) * 100;
      
      return {
        ...b,
        spent,
        progress: Math.min(100, progress),
        isExceeded: spent > b.monthlyLimit,
        isAlertTriggered: b.alertsEnabled && progress >= b.alertThreshold
      };
    });
  }

  static async deleteBudget(userId: string, budgetId: string) {
    const result = await Budget.deleteOne({
      _id: new mongoose.Types.ObjectId(budgetId),
      userId: new mongoose.Types.ObjectId(userId)
    });
    return result.deletedCount > 0;
  }
}
