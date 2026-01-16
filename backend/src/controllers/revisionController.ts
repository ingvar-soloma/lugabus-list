import { Request, Response, NextFunction } from 'express';
import { RevisionService } from '../services/revisionService';
import { CreateRevisionData } from '../repositories/evidenceRepository';

export class RevisionController {
  private service = new RevisionService();

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // TODO: Extract authorId from auth middleware
      const authorId = '00000000-0000-0000-0000-000000000000'; // Mock for now

      const revisionData: CreateRevisionData = {
        ...req.body,
        authorId,
      };

      const revision = await this.service.createRevision(revisionData);
      res.status(201).json(revision);
    } catch (error) {
      next(error);
    }
  };

  getHistory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { personId } = req.params;
      const history = await this.service.getHistory(personId);
      res.json(history);
    } catch (error) {
      next(error);
    }
  };
}
