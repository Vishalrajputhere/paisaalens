import { Router } from 'express';
import { z } from 'zod';
import { ReportsController } from '../controllers/reports.controller';
import { validateRequest } from '../middlewares/validate.middleware';
import { verifyToken } from '../middlewares/auth.middleware';

const router = Router();
router.use(verifyToken);

const exportQuerySchema = z.object({
  query: z.object({
    period: z.string().regex(/^\d{4}-\d{2}$/, 'Period must be YYYY-MM format').optional(),
  })
});

router.get('/monthly', validateRequest(exportQuerySchema), ReportsController.exportMonthlyPdf);

export default router;
