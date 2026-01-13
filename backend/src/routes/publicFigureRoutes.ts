import { Router } from 'express';
import { PublicFigureController } from '../controllers/publicFigureController';
import { validate } from '../middlewares/validate';
import { getPublicFiguresSchema, getPublicFigureByIdSchema, createPublicFigureSchema } from '../models/schemas/publicFigureSchemas';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();
const controller = new PublicFigureController();

/**
 * @swagger
 * /figures:
 *   get:
 *     summary: Retrieve a list of public figures
 *     responses:
 *       200:
 *         description: A list of public figures.
 */
router.get('/', validate(getPublicFiguresSchema), controller.getAll);

/**
 * @swagger
 * /figures:
 *   post:
 *     summary: Create a new public figure
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - role
 *               - statement
 *             properties:
 *               name:
 *                 type: string
 *               role:
 *                 type: string
 *               statement:
 *                 type: string
 *               rating:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Created
 *       401:
 *         description: Unauthorized
 */
router.post('/', authMiddleware, validate(createPublicFigureSchema), controller.create);

/**
 * @swagger
 * /figures/stats:
 *   get:
 *     summary: Retrieve statistics for public figures
 *     responses:
 *       200:
 *         description: Statistics object.
 */
router.get('/stats', controller.getStats);

/**
 * @swagger
 * /figures/{id}:
 *   get:
 *     summary: Retrieve a single public figure by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: A single public figure.
 *       404:
 *         description: Public figure not found.
 */
router.get('/:id', validate(getPublicFigureByIdSchema), controller.getById);

export default router;
