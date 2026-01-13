import { Request, Response, NextFunction } from 'express';
import { PublicFigureService } from '../services/publicFigureService';
import { GetPublicFiguresQuery } from '../models/types/publicFigureTypes';

export class PublicFigureController {
  private service = new PublicFigureService();

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const figures = await this.service.getAll(req.query as GetPublicFiguresQuery);
      res.json(figures);
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const figure = await this.service.getById(req.params.id);
      if (figure) {
        res.json(figure);
      } else {
        res.status(404).json({ message: 'Public figure not found' });
      }
    } catch (error) {
      next(error);
    }
  };
}
