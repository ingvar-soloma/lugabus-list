import { z } from 'zod';
import { createProofSchema } from '../schemas/proofSchemas';

export type CreateProofBody = z.infer<typeof createProofSchema>['body'];
