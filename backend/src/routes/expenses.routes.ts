import { Router } from 'express';
import { z } from 'zod';
import { ExpensesController } from '../controllers/expenses.controller';
import { validateRequest } from '../middlewares/validate.middleware';
import { verifyToken } from '../middlewares/auth.middleware';

const router = Router();

// Validation Schemas
const expenseSchema = z.object({
  body: z.object({
    amount: z.number().positive('Amount must be positive'),
    category: z.string().min(1, 'Category is required'),
    paymentMethod: z.string().min(1, 'Payment method is required'),
    description: z.string().min(1, 'Description is required'),
    date: z.coerce.date(),
    merchant: z.string().optional(),
    tags: z.array(z.string()).optional(),
  })
});

const getExpensesQuerySchema = z.object({
  query: z.object({
    start: z.string().optional(),
    end: z.string().optional(),
    category: z.string().optional(),
    page: z.string().regex(/^\d+$/).transform(Number).optional(),
    limit: z.string().regex(/^\d+$/).transform(Number).optional(),
  })
});

// All expense routes require authentication
router.use(verifyToken);

// Routes
router.post('/', validateRequest(expenseSchema), ExpensesController.create);
router.get('/', validateRequest(getExpensesQuerySchema), ExpensesController.list);
router.get('/:id', ExpensesController.getOne);
router.patch('/:id', validateRequest(expenseSchema), ExpensesController.update);
router.delete('/:id', ExpensesController.delete);

export default router;
