import { Request, Response, NextFunction } from 'express';
import { z, ZodObject } from 'zod';

export const validate = (schema: ZodObject<any>) => (req: Request, res: Response, next: NextFunction) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (e) {
    if (e instanceof z.ZodError) {
      return res.status(400).json((e as z.ZodError).issues);
    }
    next(e);
  }
};
