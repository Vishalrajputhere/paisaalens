import { Request, Response, NextFunction } from 'express';
import { ExpenseService } from '../services/expense.service';
import { AuthRequest } from '../middlewares/auth.middleware';

export class ExpensesController {
  static async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const expense = await ExpenseService.createExpense(userId, req.body);
      res.status(201).json({ message: 'Expense created successfully', expense });
    } catch (error) {
      next(error);
    }
  }

  static async list(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { start, end, category, page, limit } = req.query;

      const filter: any = {};
      if (start || end) {
        filter.date = {};
        if (start) filter.date.$gte = new Date(start as string);
        if (end) filter.date.$lte = new Date(end as string);
      }
      if (category) filter.category = category;

      const options = {
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 50,
      };

      const result = await ExpenseService.getExpenses(userId, filter, options);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async getOne(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const expense = await ExpenseService.getExpenseById(userId, req.params.id as string);
      if (!expense) throw { statusCode: 404, message: 'Expense not found' };
      res.status(200).json({ expense });
    } catch (error) {
      next(error);
    }
  }

  static async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const expense = await ExpenseService.updateExpense(userId, req.params.id as string, req.body);
      if (!expense) throw { statusCode: 404, message: 'Expense not found' };
      res.status(200).json({ message: 'Expense updated successfully', expense });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const success = await ExpenseService.deleteExpense(userId, req.params.id as string);
      if (!success) throw { statusCode: 404, message: 'Expense not found' };
      res.status(200).json({ message: 'Expense deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}
