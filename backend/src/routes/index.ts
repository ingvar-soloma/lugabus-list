import { Router } from 'express';
import publicFigureRoutes from './publicFigureRoutes';
import personRoutes from './personRoutes';
import revisionRoutes from './revisionRoutes';
import adminRoutes from './adminRoutes';
import authRoutes from './authRoutes';

const router = Router();

router.use('/figures', publicFigureRoutes);
router.use('/persons', personRoutes); // New! GET /persons/:id & GET /persons/:id/history
router.use('/revisions', revisionRoutes);
router.use('/admin', adminRoutes);
router.use('/auth', authRoutes);

export default router;
