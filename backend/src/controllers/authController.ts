import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService';

interface AuthRequest extends Request {
  user?: unknown;
}

export class AuthController {
  private readonly authService = new AuthService();

  telegramLogin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = await this.authService.telegramLogin(req.body);
      if (token) {
        res.json({ token });
      } else {
        res.status(401).json({ message: 'Invalid Telegram hash' });
      }
    } catch (error) {
      next(error);
    }
  };

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = await this.authService.registerUser(req.body);
      res.status(201).json({ token });
    } catch (error) {
      // Check if error is "Username already exists" and return 400 or 409
      if (error instanceof Error && error.message === 'Username already exists') {
        res.status(409).json({ message: error.message });
      } else {
        next(error);
      }
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = await this.authService.userLogin(req.body);
      if (token) {
        res.json({ token });
      } else {
        res.status(401).json({ message: 'Invalid credentials' });
      }
    } catch (error) {
      next(error);
    }
  };

  me = async (req: Request, res: Response) => {
    // This assumes user is attached to req by an auth middleware
    res.json((req as AuthRequest).user);
  };
}
