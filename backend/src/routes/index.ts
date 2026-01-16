import { Router } from 'express';
import publicFigureRoutes from './publicFigureRoutes';
import personRoutes from './personRoutes';
import revisionRoutes from './revisionRoutes';
import adminRoutes from './adminRoutes';
import authRoutes from './authRoutes';
import mediaRoutes from './mediaRoutes';

const router = Router();

router.use('/figures', publicFigureRoutes);
router.use('/persons', personRoutes);
router.use('/revisions', revisionRoutes);
router.use('/admin', adminRoutes);
router.use('/auth', authRoutes);
router.use('/media', mediaRoutes);

export default router;
