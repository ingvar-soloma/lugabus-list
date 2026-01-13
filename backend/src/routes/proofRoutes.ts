import { Router } from 'express';
import { ProofController } from '../controllers/proofController';
import { validate } from '../middlewares/validate';
import { createProofSchema } from '../models/schemas/proofSchemas';

const router = Router();
const controller = new ProofController();

router.post('/', validate(createProofSchema), controller.create);

export default router;
