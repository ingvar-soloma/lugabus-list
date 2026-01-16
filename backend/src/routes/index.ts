import { Router } from 'express';
import publicFigureRoutes from './publicFigureRoutes';
import revisionRoutes from './revisionRoutes';
import adminRoutes from './adminRoutes';
import authRoutes from './authRoutes';

const router = Router();

router.use('/figures', publicFigureRoutes);
router.use('/revisions', revisionRoutes);
router.use('/admin', adminRoutes);
router.use('/auth', authRoutes);

export default router;
