import { Router } from 'express';
import { z } from 'zod';
import { SubscriptionsController } from '../controllers/subscriptions.controller';
import { validateRequest } from '../middlewares/validate.middleware';
import { verifyToken } from '../middlewares/auth.middleware';

const router = Router();
router.use(verifyToken);

const subscriptionSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    amount: z.number().positive('Amount must be positive'),
    billingCycle: z.enum(['monthly', 'yearly', 'weekly']),
    startDate: z.coerce.date(),
    category: z.string().min(1, 'Category is required'),
    status: z.enum(['active', 'cancelled']).optional(),
    autoRenew: z.boolean().optional(),
    notes: z.string().optional()
  })
});

const updateSubscriptionSchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    amount: z.number().positive().optional(),
    billingCycle: z.enum(['monthly', 'yearly', 'weekly']).optional(),
    startDate: z.coerce.date().optional(),
    category: z.string().min(1).optional(),
    status: z.enum(['active', 'cancelled']).optional(),
    autoRenew: z.boolean().optional(),
    notes: z.string().optional()
  })
});

router.post('/', validateRequest(subscriptionSchema), SubscriptionsController.create);
router.get('/', SubscriptionsController.list);
router.get('/upcoming', SubscriptionsController.getUpcoming);
router.patch('/:id', validateRequest(updateSubscriptionSchema), SubscriptionsController.update);
router.delete('/:id', SubscriptionsController.delete);

export default router;
