import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { User } from '../models/user.model';

export class SettingsController {
  static async getSettings(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const user = await User.findById(req.user!.userId).select('-password');
      if (!user) throw { statusCode: 404, message: 'User not found' };
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }

  static async updateSettings(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { name, monthlyIncome, currency } = req.body;
      
      const user = await User.findByIdAndUpdate(
        req.user!.userId,
        { $set: { name, monthlyIncome, currency } },
        { new: true, runValidators: true }
      ).select('-password');
      
      if (!user) throw { statusCode: 404, message: 'User not found' };
      
      res.status(200).json({ message: 'Settings updated successfully', user });
    } catch (error) {
      next(error);
    }
  }
}
