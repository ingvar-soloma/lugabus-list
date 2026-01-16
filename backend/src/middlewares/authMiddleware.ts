import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface UserPayload {
  sub: string; // This is the pHash
  role: string;
}

export interface AuthRequest extends Request {
  user?: UserPayload;
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (token) {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res.status(500).json({ message: 'JWT_SECRET is not defined' });
    }
    jwt.verify(token, secret, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      (req as AuthRequest).user = user as UserPayload;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};
