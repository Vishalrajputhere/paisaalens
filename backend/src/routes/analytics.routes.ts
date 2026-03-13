import { Router } from 'express';
import { AnalyticsController } from '../controllers/analytics.controller';
import { verifyToken } from '../middlewares/auth.middleware';

const router = Router();
router.use(verifyToken);

router.get('/summary', AnalyticsController.getSummary);
router.get('/categories', AnalyticsController.getCategoryDistribution);
router.get('/trend', AnalyticsController.getSpendingTrend);
router.get('/recent', AnalyticsController.getRecentTransactions);

export default router;
