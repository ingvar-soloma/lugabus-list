import { z } from 'zod';

export const createProofSchema = z.object({
  body: z.object({
    fileUrl: z.string().url(),
    figureId: z.string().uuid(),
  }),
});
