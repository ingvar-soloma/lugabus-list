import { z } from 'zod';
import { loginSchema, updateStatusSchema } from '../schemas/adminSchemas';

export type LoginBody = z.infer<typeof loginSchema>['body'];
export type UpdateStatusBody = z.infer<typeof updateStatusSchema>['body'];
