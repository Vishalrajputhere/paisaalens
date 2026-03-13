import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { InsightService } from '../services/insight.service';

export class InsightsController {
  static async getInsights(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const insights = await InsightService.generateInsights(userId);
      res.status(200).json(insights);
    } catch (error) {
      next(error);
    }
  }
}
