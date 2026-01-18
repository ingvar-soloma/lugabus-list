import { Request, Response, NextFunction } from 'express';
import { EvidenceService } from '../services/evidenceService';

interface UserPayload {
  sub: string;
  role: string;
}

interface AuthRequest extends Request {
  user?: UserPayload;
}

export class EvidenceController {
  private readonly service = new EvidenceService();

  vote = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id: evidenceId } = req.params;
      const { type } = req.body;
      const user = req.user;

      if (!user?.sub) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      if (!['LIKE', 'DISLIKE'].includes(type)) {
        res.status(400).json({ message: 'Invalid vote type' });
        return;
      }

      await this.service.vote(evidenceId, user.sub, type as 'LIKE' | 'DISLIKE');
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
