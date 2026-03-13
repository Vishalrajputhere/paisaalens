import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { BudgetService } from '../services/budget.service';

export class BudgetsController {
  static async setBudget(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const budget = await BudgetService.upsertBudget(userId, req.body);
      res.status(200).json({ message: 'Budget saved successfully', budget });
    } catch (error) {
      next(error);
    }
  }

  static async getBudgets(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const period = (req.query.period as string) || new Date().toISOString().slice(0, 7);
      
      const budgets = await BudgetService.getBudgetsWithProgress(userId, period);
      res.status(200).json(budgets);
    } catch (error) {
      next(error);
    }
  }

  static async deleteBudget(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const success = await BudgetService.deleteBudget(userId, req.params.id as string);
      
      if (!success) {
        throw { statusCode: 404, message: 'Budget not found' };
      }
      
      res.status(200).json({ message: 'Budget removed successfully' });
    } catch (error) {
      next(error);
    }
  }
}
