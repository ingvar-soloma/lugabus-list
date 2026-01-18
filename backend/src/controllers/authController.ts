import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService';
import { prisma } from '../repositories/baseRepository';
import { decryptJson } from '../utils/crypto';
import { generateIdentity } from '../utils/identityGenerator';

interface AuthRequest extends Request {
  user?: {
    sub: string;
    role: string;
  };
}

interface UserProfile {
  username: string;
  firstName?: string;
  first_name?: string;
  lastName?: string;
  last_name?: string;
  photoUrl?: string;
  photo_url?: string;
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

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = await this.authService.register(req.body);
      res.status(201).json({ token });
    } catch (error: unknown) {
      const err = error as Error;
      if (err.message === 'User already exists') {
        res.status(409).json({ message: err.message });
      } else {
        next(error);
      }
    }
  };

  me = async (req: AuthRequest, res: Response) => {
    const userPayload = req.user;
    if (!userPayload) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    try {
      const user = await prisma.user.findUnique({
        where: { id: userPayload.sub },
      });

      if (!user?.encryptedData) {
        // Fallback to token payload if no data found
        res.json({
          id: userPayload.sub,
          role: userPayload.role,
        });
        return;
      }

      const encryptionKey = process.env.ENCRYPTION_KEY;
      if (!encryptionKey) throw new Error('ENCRYPTION_KEY is not defined');

      const decrypted = decryptJson(user.encryptedData, encryptionKey) as unknown as UserProfile;
      const identity = generateIdentity(user.id);

      res.json({
        id: user.id,
        role: user.role,
        username: decrypted.username,
        firstName: decrypted.firstName || decrypted.first_name,
        lastName: decrypted.lastName || decrypted.last_name,
        avatar: decrypted.photoUrl || decrypted.photo_url,
        nickname: identity.nickname,
        avatarSvg: identity.svg,
      });
    } catch (error) {
      console.error('Error fetching user profile:', error);
      res.status(500).json({ message: 'Failed to fetch user profile' });
    }
  };
}
