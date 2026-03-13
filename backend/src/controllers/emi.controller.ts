import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { EmiService } from '../services/emi.service';

export class EmiController {
  static async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const emi = await EmiService.createEmi(userId, req.body);
      res.status(201).json({ message: 'EMI added successfully', emi });
    } catch (error) {
      next(error);
    }
  }

  static async list(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const emis = await EmiService.getEmis(userId);
      res.status(200).json(emis);
    } catch (error) {
      next(error);
    }
  }

  static async recordPayment(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const emi = await EmiService.recordPayment(userId, req.params.id as string);
      
      if (!emi) throw { statusCode: 400, message: 'Invalid EMI or already completed' };
      
      res.status(200).json({ message: 'EMI payment recorded successfully', emi });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const success = await EmiService.deleteEmi(userId, req.params.id as string);
      if (!success) throw { statusCode: 404, message: 'EMI not found' };
      res.status(200).json({ message: 'EMI deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}
