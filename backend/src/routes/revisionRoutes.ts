import { Router } from 'express';
import { RevisionController } from '../controllers/revisionController';

const router = Router();
const controller = new RevisionController();

router.post('/', controller.create);
router.get('/:personId', controller.getHistory);

export default router;
