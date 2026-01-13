import { Router } from 'express';
import { AuthController } from '../controllers/authController';

import { validate } from '../middlewares/validate';
import { registerSchema, loginSchema } from '../models/schemas/authSchemas';

const router = Router();
const authController = new AuthController();

router.post('/telegram', authController.telegramLogin);
router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);

export default router;
