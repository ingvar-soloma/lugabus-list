import { Router } from 'express';
import { RevisionController } from '../controllers/revisionController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();
const controller = new RevisionController();

/**
 * @swagger
 * /revisions:
 *   post:
 *     summary: Create a new revision for a person
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - personId
 *               - proposedData
 *             properties:
 *               personId:
 *                 type: string
 *                 format: uuid
 *               proposedData:
 *                 type: object
 *               reason:
 *                 type: string
 *               evidences:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     url:
 *                       type: string
 *                     title:
 *                       type: string
 *                     type:
 *                       type: string
 *                       enum: [LINK, IMAGE, DOCUMENT, VIDEO, VOTE_RECORD]
 *                     polarity:
 *                       type: string
 *                       enum: [SUPPORT, REFUTE]
 *     responses:
 *       201:
 *         description: Revision created
 *       401:
 *         description: Unauthorized
 */
router.post('/', authMiddleware, controller.create);

/**
 * @swagger
 * /revisions/pending:
 *   get:
 *     summary: Get all pending revisions for moderation
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of pending revisions
 */
router.get('/pending', authMiddleware, controller.getPending);

/**
 * @swagger
 * /revisions/detail/{revisionId}:
 *   get:
 *     summary: Get a single revision by ID
 *     parameters:
 *       - in: path
 *         name: revisionId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Revision details
 *       404:
 *         description: Revision not found
 */
router.get('/detail/:revisionId', controller.getById);

/**
 * @swagger
 * /revisions/{revisionId}/approve:
 *   patch:
 *     summary: Approve a revision (applies changes to Person snapshot)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: revisionId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               aiScore:
 *                 type: number
 *                 description: Optional AI score (0-100)
 *     responses:
 *       200:
 *         description: Revision approved
 *       404:
 *         description: Revision not found
 */
router.patch('/:revisionId/approve', authMiddleware, controller.approve);

/**
 * @swagger
 * /revisions/{revisionId}/reject:
 *   patch:
 *     summary: Reject a revision
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: revisionId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reason:
 *                 type: string
 *     responses:
 *       200:
 *         description: Revision rejected
 */
router.patch('/:revisionId/reject', authMiddleware, controller.reject);

/**
 * @swagger
 * /revisions/{revisionId}/ai-score:
 *   post:
 *     summary: Process a revision with AI scoring (may auto-approve if score >= 85)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: revisionId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - aiScore
 *             properties:
 *               aiScore:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 100
 *               autoApprove:
 *                 type: boolean
 *                 default: true
 *     responses:
 *       200:
 *         description: Revision processed
 */
router.post('/:revisionId/ai-score', authMiddleware, controller.processWithAi);

/**
 * @swagger
 * /revisions/{personId}:
 *   get:
 *     summary: Get revision history for a person
 *     parameters:
 *       - in: path
 *         name: personId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: List of revisions for the person
 */
router.get('/:personId', controller.getHistory);

export default router;
