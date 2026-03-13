import { Router } from 'express';
import { z } from 'zod';
import { BudgetsController } from '../controllers/budgets.controller';
import { validateRequest } from '../middlewares/validate.middleware';
import { verifyToken } from '../middlewares/auth.middleware';

const router = Router();

router.use(verifyToken);

const upsertBudgetSchema = z.object({
  body: z.object({
    categoryId: z.string().min(1, 'Category is required'),
    monthlyLimit: z.number().positive('Limit must be positive'),
    period: z.string().regex(/^\d{4}-\d{2}$/, 'Period must be YYYY-MM format').optional(),
    alertsEnabled: z.boolean().optional(),
    alertThreshold: z.number().min(1).max(100).optional(),
  })
});

const getBudgetsQuerySchema = z.object({
  query: z.object({
    period: z.string().regex(/^\d{4}-\d{2}$/, 'Period must be YYYY-MM format').optional(),
  })
});

router.post('/', validateRequest(upsertBudgetSchema), BudgetsController.setBudget);
router.get('/', validateRequest(getBudgetsQuerySchema), BudgetsController.getBudgets);
router.delete('/:id', BudgetsController.deleteBudget);

export default router;
