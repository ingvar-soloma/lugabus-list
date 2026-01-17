import { Request, Response, NextFunction } from 'express';
import { PublicFigureService } from '../services/publicFigureService';
import { GetPublicFiguresQuery } from '../models/types/publicFigureTypes';
import { OgImageService } from '../services/ogImageService';

export class PublicFigureController {
  private readonly service = new PublicFigureService();

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

  getStats = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const stats = await this.service.getStats();
      res.json(stats);
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const figure = await this.service.create(req.body);
      res.status(201).json(figure);
    } catch (error) {
      next(error);
    }
  };

  getOgImage = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const person = await this.service.getRawById(req.params.id);
      if (!person) {
        res.status(404).json({ message: 'Person not found' });
        return;
      }

      const ogImageService = new OgImageService();
      const buffer = await ogImageService.generatePersonCard(person);

      res.set('Content-Type', 'image/png');
      res.set('Cache-Control', 'public, max-age=86400'); // Cache for 1 day
      res.send(buffer);
    } catch (error) {
      next(error);
    }
  };

  trackVisit = async (req: Request, res: Response) => {
    // Placeholder for analytics logic
    res.status(204).send();
  };
}
