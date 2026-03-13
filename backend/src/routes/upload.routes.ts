import { Router } from 'express';
import multer from 'multer';
import { UploadController } from '../controllers/upload.controller';
import { verifyToken } from '../middlewares/auth.middleware';

const router = Router();
router.use(verifyToken);

// Use memory storage since we just parse the CSV directly
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
  }
});

router.post('/headers', upload.single('file'), UploadController.getHeaders);
router.post('/import', upload.single('file'), UploadController.importCsv);

export default router;
