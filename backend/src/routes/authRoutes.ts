import { Router } from 'express';
import { AuthController } from '../controllers/authController';

import { validate } from '../middlewares/validate';
import { authLimiter } from '../middlewares/rateLimiter';
import { registerSchema, loginSchema } from '../models/schemas/authSchemas';

const router = Router();
const authController = new AuthController();

router.post('/telegram', authController.telegramLogin);
router.post('/register', authLimiter, validate(registerSchema), authController.register);
router.post('/login', authLimiter, validate(loginSchema), authController.login);

export default router;
