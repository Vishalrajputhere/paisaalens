import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

// App initialization
const app: Express = express();

// Middlewares
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Basic Health Check Route
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', message: 'PaisaaLens server is running' });
});

import authRoutes from './routes/auth.routes';
import expensesRoutes from './routes/expenses.routes';
import analyticsRoutes from './routes/analytics.routes';
import budgetsRoutes from './routes/budgets.routes';
import subscriptionsRoutes from './routes/subscriptions.routes';
import emiRoutes from './routes/emi.routes';
import uploadRoutes from './routes/upload.routes';
import insightsRoutes from './routes/insights.routes';
import reportsRoutes from './routes/reports.routes';
import settingsRoutes from './routes/settings.routes';
import { errorHandler } from './middlewares/error.middleware';

// Routes will be added here
app.use('/v1/auth', authRoutes);
app.use('/v1/expenses', expensesRoutes);
app.use('/v1/analytics', analyticsRoutes);
app.use('/v1/budgets', budgetsRoutes);
app.use('/v1/subscriptions', subscriptionsRoutes);
app.use('/v1/emi', emiRoutes);
app.use('/v1/upload', uploadRoutes);
app.use('/v1/insights', insightsRoutes);
app.use('/v1/reports', reportsRoutes);
app.use('/v1/settings', settingsRoutes);

// Error Handler
app.use(errorHandler);

export default app;
