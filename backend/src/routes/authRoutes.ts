import { Router } from 'express';
import { AuthController } from '../controllers/authController';

import { validate } from '../middlewares/validate';
import { authLimiter } from '../middlewares/rateLimiter';
import { loginSchema, registerSchema } from '../models/schemas/authSchemas';

import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();
const authController = new AuthController();

router.get('/me', authMiddleware, authController.me);
router.post('/register', validate(registerSchema), authController.register);
router.post('/telegram', authController.telegramLogin);
router.post('/login', authLimiter, validate(loginSchema), authController.login);

export default router;
