import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { ReportService } from '../services/report.service';

export class ReportsController {
  static async exportMonthlyPdf(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const period = (req.query.period as string) || new Date().toISOString().slice(0, 7);
      
      const fileName = `PaisaaLens_Report_${period}.pdf`;

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);

      // Stream the PDF directly to the client response
      await ReportService.generateMonthlyPdf(userId, period, res);
      
    } catch (error) {
      next(error);
    }
  }
}
