import { Router } from 'express';
import { InsightsController } from '../controllers/insights.controller';
import { verifyToken } from '../middlewares/auth.middleware';

const router = Router();
router.use(verifyToken);

router.get('/', InsightsController.getInsights);

export default router;
