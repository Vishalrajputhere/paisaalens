import { Router } from 'express';
import { z } from 'zod';
import { SettingsController } from '../controllers/settings.controller';
import { validateRequest } from '../middlewares/validate.middleware';
import { verifyToken } from '../middlewares/auth.middleware';

const router = Router();
router.use(verifyToken);

const updateSettingsSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').optional(),
    monthlyIncome: z.number().positive('Income must be a positive number').optional(),
    currency: z.string().min(1).optional()
  })
});

router.get('/', SettingsController.getSettings);
router.patch('/', validateRequest(updateSettingsSchema), SettingsController.updateSettings);

export default router;
