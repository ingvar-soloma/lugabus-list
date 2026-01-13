import { Router } from 'express';
import publicFigureRoutes from './publicFigureRoutes';
import proofRoutes from './proofRoutes';
import adminRoutes from './adminRoutes';

const router = Router();

router.use('/figures', publicFigureRoutes);
router.use('/proofs', proofRoutes);
router.use('/admin', adminRoutes);

export default router;
