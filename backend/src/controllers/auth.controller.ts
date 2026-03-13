import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { AuthRequest } from '../middlewares/auth.middleware';

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, password, currency, monthlyIncome } = req.body;
      const { user, token } = await AuthService.registerUser({
        name,
        email,
        passwordHash: password,
        currency,
        monthlyIncome,
      });

      res.status(201).json({
        message: 'User registered successfully',
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          currency: user.currency,
          monthlyIncome: user.monthlyIncome
        },
        token,
      });
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const { user, token } = await AuthService.loginUser(email, password);

      res.status(200).json({
        message: 'Login successful',
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          currency: user.currency,
          monthlyIncome: user.monthlyIncome
        },
        token,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getMe(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      if (!userId) throw { statusCode: 401, message: 'Unauthorized' };

      const user = await AuthService.getUserById(userId);
      if (!user) throw { statusCode: 404, message: 'User not found' };

      res.status(200).json({ user });
    } catch (error) {
      next(error);
    }
  }
}
