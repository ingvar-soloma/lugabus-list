import { Request, Response, NextFunction } from 'express';
import { z, AnyZodObject } from 'zod';

export const validate = (schema: AnyZodObject) => (req: Request, res: Response, next: NextFunction) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (e) {
    if (e instanceof z.ZodError) {
      return res.status(400).json(e.errors);
    }
    next(e);
  }
};
