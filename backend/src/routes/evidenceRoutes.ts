import { Router } from 'express';
import { EvidenceController } from '../controllers/evidenceController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();
const controller = new EvidenceController();

// POST /api/evidence/:id/vote
router.post('/:id/vote', authMiddleware, controller.vote);

export default router;
