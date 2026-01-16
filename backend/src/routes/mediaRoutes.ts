import { Router } from 'express';
import multer from 'multer';
import { MediaController } from '../controllers/mediaController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();
const controller = new MediaController();

// Use memory storage for multer as we'll pass buffers to StorageService
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

/**
 * @swagger
 * /media/upload:
 *   post:
 *     summary: Upload a file (image/document) to S3
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: File uploaded successfully
 *       400:
 *         description: No file uploaded or invalid file
 *       401:
 *         description: Unauthorized
 */
router.post('/upload', authMiddleware, upload.single('file'), controller.upload);

export default router;
