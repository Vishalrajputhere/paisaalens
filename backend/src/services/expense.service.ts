import { Expense, IExpense } from '../models/expense.model';
import mongoose from 'mongoose';

export class ExpenseService {
  static async createExpense(userId: string, data: Partial<IExpense>): Promise<IExpense> {
    const expense = new Expense({
      ...data,
      userId: new mongoose.Types.ObjectId(userId),
    });
    return expense.save();
  }

  static async getExpenses(
    userId: string,
    filter: any = {},
    options: { page?: number; limit?: number; sort?: any } = {}
  ): Promise<{ items: IExpense[]; total: number; page: number; limit: number }> {
    const page = options.page || 1;
    const limit = options.limit || 50;
    const skip = (page - 1) * limit;

    const query = { ...filter, userId: new mongoose.Types.ObjectId(userId) };

    const [items, total] = await Promise.all([
      Expense.find(query)
        .sort(options.sort || { date: -1 })
        .skip(skip)
        .limit(limit),
      Expense.countDocuments(query),
    ]);

    return { items, total, page, limit };
  }

  static async getExpenseById(userId: string, expenseId: string): Promise<IExpense | null> {
    return Expense.findOne({
      _id: new mongoose.Types.ObjectId(expenseId),
      userId: new mongoose.Types.ObjectId(userId)
    });
  }

  static async updateExpense(userId: string, expenseId: string, data: Partial<IExpense>): Promise<IExpense | null> {
    return Expense.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(expenseId), userId: new mongoose.Types.ObjectId(userId) },
      { $set: data },
      { new: true, runValidators: true }
    );
  }

  static async deleteExpense(userId: string, expenseId: string): Promise<boolean> {
    const result = await Expense.deleteOne({
      _id: new mongoose.Types.ObjectId(expenseId),
      userId: new mongoose.Types.ObjectId(userId)
    });
    return result.deletedCount > 0;
  }
}
