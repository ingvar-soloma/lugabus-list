import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PublicFigureService } from '../services/publicFigureService';
import { GetPublicFiguresQuery } from '../models/types/publicFigureTypes';
import { OgImageService } from '../services/ogImageService';
import { UserPayload } from '../middlewares/authMiddleware';

export class PublicFigureController {
  private readonly service = new PublicFigureService();

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader?.split(' ')[1];
      let isAdmin = false;

      if (token) {
        try {
          const secret = process.env.JWT_SECRET;
          if (secret) {
            const decoded = jwt.verify(token, secret) as UserPayload;
            isAdmin = decoded.role === 'ADMIN';
          }
        } catch {
          // Ignore
        }
      }

      const figures = await this.service.getAll(req.query as GetPublicFiguresQuery, isAdmin);
      res.json(figures);
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader?.split(' ')[1];
      let isAdmin = false;

      if (token) {
        try {
          const secret = process.env.JWT_SECRET;
          if (secret) {
            const decoded = jwt.verify(token, secret) as UserPayload;
            isAdmin = decoded.role === 'ADMIN';
          }
        } catch {
          // Ignore
        }
      }

      const figure = await this.service.getById(req.params.id, isAdmin);
      if (figure) {
        res.json(figure);
      } else {
        res.status(404).json({ message: 'Public figure not found' });
      }
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const figure = await this.service.update(req.params.id, req.body);
      res.json(figure);
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.service.delete(req.params.id);
      res.status(204).send();
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
