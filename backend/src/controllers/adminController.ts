import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService';
import { LoginBody, UpdateStatusBody } from '../models/types/adminTypes';
import { AdminService } from '../services/adminService';

export class AdminController {
  private authService = new AuthService();
  private adminService = new AdminService();

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { username, password } = req.body as LoginBody;
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

  updateStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { status } = req.body as UpdateStatusBody;
      const updatedFigure = await this.adminService.updateFigureStatus(id, status);
      res.json(updatedFigure);
    } catch (error) {
      next(error);
    }
  };
}
