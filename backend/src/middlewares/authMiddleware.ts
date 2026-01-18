import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import logger from '../config/logger';

export interface UserPayload {
  sub: string; // This is the pHash
  role: string;
}

export interface AuthRequest extends Request {
  user?: UserPayload;
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];

  if (token) {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      logger.error('JWT_SECRET is not defined');
      return res.status(500).json({ message: 'JWT_SECRET is not defined' });
    }
    jwt.verify(token, secret, (err, user) => {
      if (err) {
        logger.warn('JWT verification failed', { error: err.message });
        return res.sendStatus(403);
      }
      (req as AuthRequest).user = user as UserPayload;
      next();
    });
  } else {
    logger.warn('Missing Authorization token', {
      path: req.path,
      method: req.method,
      hasHeader: !!authHeader,
    });
    res.sendStatus(401);
  }
};
