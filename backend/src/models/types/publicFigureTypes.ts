import { z } from 'zod';
import { getPublicFiguresSchema } from '../schemas/publicFigureSchemas';

export type GetPublicFiguresQuery = z.infer<typeof getPublicFiguresSchema>['query'];
