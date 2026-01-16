import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService';

interface AuthRequest extends Request {
  user?: {
    sub: string;
    role: string;
  };
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

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { username, password } = req.body;
      const token = await this.authService.login(username, password);
      if (token) {
        res.json({ token });
      } else {
        res.status(401).json({ message: 'Invalid credentials' });
      }
    } catch (error) {
      next(error);
    }
  };

  me = async (req: AuthRequest, res: Response) => {
    // Return minimalistic user info from token payload attached by middleware
    const user = req.user;
    if (!user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    res.json({
      id: user.sub,
      role: user.role,
    });
  };
}
