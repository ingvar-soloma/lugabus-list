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

router.get('/users', authMiddleware, controller.getUsers);
router.get('/logs', authMiddleware, controller.getAuditLogs);
router.get('/ai-insights', authMiddleware, controller.getAIInsights);

// ===== QUEUE MANAGEMENT =====
router.get('/queue', authMiddleware, controller.getRevisionQueue);
router.post('/queue/:id/approve', authMiddleware, controller.approveRevision);
router.post('/queue/:id/reject', authMiddleware, controller.rejectRevision);

// ===== EVIDENCE MANAGEMENT =====
router.get('/evidence', authMiddleware, controller.getEvidence);
router.delete('/evidence/:id', authMiddleware, controller.deleteEvidence);

// ===== PERSON MANAGEMENT =====
router.get('/persons', authMiddleware, controller.getPersons);
router.patch('/persons/:id/status', authMiddleware, controller.updatePersonStatus);
router.delete('/persons/:id', authMiddleware, controller.deletePerson);

// ===== USER MANAGEMENT =====
router.patch('/users/:id/role', authMiddleware, controller.updateUserRole);
router.post('/users/:id/shadow-ban', authMiddleware, controller.shadowBanUser);
router.post('/users/:id/unshadow-ban', authMiddleware, controller.unshadowBanUser);
router.patch('/users/:id/reputation', authMiddleware, controller.updateUserReputation);

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
