import { Router } from 'express';
import { PublicFigureController } from '../controllers/publicFigureController';
import { RevisionController } from '../controllers/revisionController';
import { validate } from '../middlewares/validate';
import {
  getPublicFigureByIdSchema,
  createPublicFigureSchema,
} from '../models/schemas/publicFigureSchemas';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();
const figureController = new PublicFigureController();
const revisionController = new RevisionController();

/**
 * @swagger
 * /persons:
 *   get:
 *     summary: Retrieve a list of all persons (public figures)
 *     responses:
 *       200:
 *         description: A list of persons
 */
router.get('/', figureController.getAll);

/**
 * @swagger
 * /persons:
 *   post:
 *     summary: Create a new person
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Person created
 */
router.post('/', authMiddleware, validate(createPublicFigureSchema), figureController.create);

/**
 * @swagger
 * /persons/stats:
 *   get:
 *     summary: Retrieve statistics for persons
 *     responses:
 *       200:
 *         description: Statistics object
 */
router.get('/stats', figureController.getStats);

/**
 * @swagger
 * /persons/{id}:
 *   get:
 *     summary: Retrieve a single person by ID (current snapshot state)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: A single person with current state
 *       404:
 *         description: Person not found
 */
router.get('/:id', validate(getPublicFigureByIdSchema), figureController.getById);

/**
 * @swagger
 * /persons/{id}/history:
 *   get:
 *     summary: Retrieve the revision history for a person
 *     description: Returns all revisions (approved, pending, rejected) for the person
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: List of revisions for the person
 */
router.get('/:id/history', revisionController.getHistory);
router.get('/:id/og', figureController.getOgImage);

export default router;
