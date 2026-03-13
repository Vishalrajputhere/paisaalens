import { Router } from 'express';
import { z } from 'zod';
import { EmiController } from '../controllers/emi.controller';
import { validateRequest } from '../middlewares/validate.middleware';
import { verifyToken } from '../middlewares/auth.middleware';

const router = Router();
router.use(verifyToken);

const createEmiSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    principalAmount: z.number().positive('Amount must be positive'),
    interestRate: z.number().min(0, 'Interest rate cannot be negative'),
    tenureMonths: z.number().int().positive('Tenure must be a positive integer in months'),
    startDate: z.coerce.date(),
    bankName: z.string().min(1, 'Bank name is required'),
    autoDeduct: z.boolean().optional()
  })
});

router.post('/', validateRequest(createEmiSchema), EmiController.create);
router.get('/', EmiController.list);
router.post('/:id/pay', EmiController.recordPayment);
router.delete('/:id', EmiController.delete);

export default router;
