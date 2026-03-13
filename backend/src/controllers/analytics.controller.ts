import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { Expense } from '../models/expense.model';
import mongoose from 'mongoose';

export class AnalyticsController {
  static async getSummary(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = new mongoose.Types.ObjectId(req.user!.userId);
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

      const [monthlyExpenses] = await Expense.aggregate([
        { $match: { userId, date: { $gte: startOfMonth, $lte: endOfMonth } } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]);

      res.status(200).json({
        totalSpent: monthlyExpenses?.total || 0,
        period: { start: startOfMonth, end: endOfMonth }
      });
    } catch (error) {
      next(error);
    }
  }

  static async getCategoryDistribution(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = new mongoose.Types.ObjectId(req.user!.userId);
      const { start, end } = req.query;

      const dateFilter: any = {};
      if (start) dateFilter.$gte = new Date(start as string);
      if (end) dateFilter.$lte = new Date(end as string);

      const matchStage: any = { userId };
      if (Object.keys(dateFilter).length > 0) {
        matchStage.date = dateFilter;
      }

      const distribution = await Expense.aggregate([
        { $match: matchStage },
        { $group: { _id: '$category', total: { $sum: '$amount' } } },
        { $sort: { total: -1 } }
      ]);

      const formatted = distribution.map(d => ({
        name: d._id,
        value: d.total
      }));

      res.status(200).json(formatted);
    } catch (error) {
      next(error);
    }
  }

  static async getSpendingTrend(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = new mongoose.Types.ObjectId(req.user!.userId);
      const now = new Date();
      // Last 7 days trend if unspecified
      const start = req.query.start ? new Date(req.query.start as string) : new Date(now.setDate(now.getDate() - 7));
      const end = req.query.end ? new Date(req.query.end as string) : new Date();

      const trend = await Expense.aggregate([
        { $match: { userId, date: { $gte: start, $lte: end } } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
            amount: { $sum: '$amount' }
          }
        },
        { $sort: { _id: 1 } }
      ]);

      const formatted = trend.map(t => ({
        date: t._id,
        amount: t.amount
      }));

      res.status(200).json(formatted);
    } catch (error) {
      next(error);
    }
  }

  static async getRecentTransactions(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = new mongoose.Types.ObjectId(req.user!.userId);
      const limit = parseInt((req.query.limit as string) || '10');

      const transactions = await Expense.find({ userId })
        .sort({ date: -1 })
        .limit(limit);

      res.status(200).json(transactions);
    } catch (error) {
      next(error);
    }
  }
}
