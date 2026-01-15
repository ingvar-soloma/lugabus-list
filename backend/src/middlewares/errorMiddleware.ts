import { Request, Response, NextFunction } from 'express';
import logger from '../config/logger';

export const errorHandler = (err: Error, req: Request, res: Response, _next: NextFunction) => {
  logger.error(err.stack);

  res.status(500).send({
    status: 'error',
    message: 'Something broke!',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
