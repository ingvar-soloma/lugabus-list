import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

export const validate =
  (schema: z.ZodTypeAny) => (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (e) {
      if (e instanceof z.ZodError) {
        return res.status(400).json({
          status: 'error',
          message: 'Validation failed',
          errors: e.issues.map((err: z.ZodIssue) => ({
            field: err.path.slice(1).join('.'), // Remove 'body', 'query', or 'params'
            message: err.message,
          })),
        });
      }
      next(e);
    }
  };
