import { Router } from 'express';
import { PublicFigureController } from '../controllers/publicFigureController';
import { validate } from '../middlewares/validate';
import { getPublicFiguresSchema, getPublicFigureByIdSchema } from '../models/schemas/publicFigureSchemas';

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
