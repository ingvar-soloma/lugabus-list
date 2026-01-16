import { Router } from 'express';
import { AdminController } from '../controllers/adminController';
import { RevisionController } from '../controllers/revisionController';
import { validate } from '../middlewares/validate';
import { loginSchema, updateStatusSchema } from '../models/schemas/adminSchemas';
import { processBatchSchema } from '../models/schemas/revisionSchemas';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();
const controller = new AdminController();
const revisionController = new RevisionController();

router.post('/login', validate(loginSchema), controller.login);
router.patch(
  '/figures/:id/status',
  authMiddleware,
  validate(updateStatusSchema),
  controller.updateStatus,
);

/**
 * @swagger
 * /admin/revisions/process-batch:
 *   post:
 *     summary: Manually trigger AI processing for top-prioritized revisions (Admin Only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               limit:
 *                 type: integer
 *                 default: 10
 *     responses:
 *       200:
 *         description: Batch processing completed
 */
router.post(
  '/revisions/process-batch',
  authMiddleware,
  validate(processBatchSchema),
  revisionController.processBatch,
);

export default router;
