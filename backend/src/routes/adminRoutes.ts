import { Router } from 'express';
import { AdminController } from '../controllers/adminController';
import { validate } from '../middlewares/validate';
import { loginSchema, updateStatusSchema } from '../models/schemas/adminSchemas';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();
const controller = new AdminController();

router.post('/login', validate(loginSchema), controller.login);
router.patch(
  '/figures/:id/status',
  authMiddleware,
  validate(updateStatusSchema),
  controller.updateStatus,
);

export default router;
