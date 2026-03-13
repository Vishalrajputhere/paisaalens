import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { SubscriptionService } from '../services/subscription.service';

export class SubscriptionsController {
  static async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const subscription = await SubscriptionService.createSubscription(userId, req.body);
      res.status(201).json({ message: 'Subscription added successfully', subscription });
    } catch (error) {
      next(error);
    }
  }

  static async list(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const subscriptions = await SubscriptionService.getSubscriptions(userId);
      res.status(200).json(subscriptions);
    } catch (error) {
      next(error);
    }
  }

  static async getUpcoming(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const days = parseInt((req.query.days as string) || '7');
      const upcoming = await SubscriptionService.getUpcomingRenewals(userId, days);
      res.status(200).json(upcoming);
    } catch (error) {
      next(error);
    }
  }

  static async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const subscription = await SubscriptionService.updateSubscription(userId, req.params.id as string, req.body);
      if (!subscription) throw { statusCode: 404, message: 'Subscription not found' };
      res.status(200).json({ message: 'Subscription updated successfully', subscription });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const success = await SubscriptionService.deleteSubscription(userId, req.params.id as string);
      if (!success) throw { statusCode: 404, message: 'Subscription not found' };
      res.status(200).json({ message: 'Subscription deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}
