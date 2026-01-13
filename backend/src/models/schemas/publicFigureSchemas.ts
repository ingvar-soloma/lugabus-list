import { z } from 'zod';

export const getPublicFiguresSchema = z.object({
  query: z.object({
    sortBy: z.string().optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
    filter: z.string().optional(),
  }),
});

export const getPublicFigureByIdSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});
