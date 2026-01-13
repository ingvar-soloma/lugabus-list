import { z } from 'zod';
import { Status } from '@prisma/client';

export const loginSchema = z.object({
  body: z.object({
    username: z.string(),
    password: z.string(),
  }),
});

export const updateStatusSchema = z.object({
  body: z.object({
    status: z.nativeEnum(Status),
  }),
  params: z.object({
    id: z.string().uuid(),
  }),
});
