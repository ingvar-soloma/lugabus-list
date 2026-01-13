import { Router } from 'express';
import publicFigureRoutes from './publicFigureRoutes';
import proofRoutes from './proofRoutes';
import adminRoutes from './adminRoutes';
import authRoutes from './authRoutes';

const router = Router();

router.use('/figures', publicFigureRoutes);
router.use('/proofs', proofRoutes);
router.use('/admin', adminRoutes);
router.use('/auth', authRoutes);

export default router;
