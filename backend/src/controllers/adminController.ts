import { Response, NextFunction } from 'express';
import { AuthService } from '../services/authService';
import { LoginBody, UpdateStatusBody } from '../models/types/adminTypes';
import { AdminService } from '../services/adminService';
import { AuthRequest } from '../middlewares/authMiddleware';
import { Status, UserRole } from '@prisma/client';

export class AdminController {
  private authService = new AuthService();
  private adminService = new AdminService();

  login = async (req: AuthRequest, res: Response, next: NextFunction) => {
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

  updateStatus = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { status } = req.body as UpdateStatusBody;
      const updatedFigure = await this.adminService.updateFigureStatus(id, status);
      res.json(updatedFigure);
    } catch (error) {
      next(error);
    }
  };

  getUsers = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const users = await this.adminService.getUsers();
      res.json(users);
    } catch (error) {
      next(error);
    }
  };

  getAuditLogs = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const logs = await this.adminService.getAuditLogs();
      res.json(logs);
    } catch (error) {
      next(error);
    }
  };

  getAIInsights = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const insights = await this.adminService.getAIInsights();
      res.json(insights);
    } catch (error) {
      next(error);
    }
  };

  // ===== QUEUE MANAGEMENT =====

  getRevisionQueue = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { status, limit, offset } = req.query;
      const queue = await this.adminService.getRevisionQueue({
        status: status as Status,
        limit: limit ? parseInt(limit as string) : undefined,
        offset: offset ? parseInt(offset as string) : undefined,
      });
      res.json(queue);
    } catch (error) {
      next(error);
    }
  };

  approveRevision = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const adminId = req.user?.sub;
      if (!adminId) return res.status(401).json({ message: 'Unauthorized' });
      const revision = await this.adminService.approveRevision(id, adminId);
      res.json(revision);
    } catch (error) {
      next(error);
    }
  };

  rejectRevision = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { reason } = req.body;
      const adminId = req.user?.sub;
      if (!adminId) return res.status(401).json({ message: 'Unauthorized' });
      const revision = await this.adminService.rejectRevision(id, adminId, reason);
      res.json(revision);
    } catch (error) {
      next(error);
    }
  };

  // ===== EVIDENCE MANAGEMENT =====

  getEvidence = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { limit, offset } = req.query;
      const evidence = await this.adminService.getEvidence({
        limit: limit ? parseInt(limit as string) : undefined,
        offset: offset ? parseInt(offset as string) : undefined,
      });
      res.json(evidence);
    } catch (error) {
      next(error);
    }
  };

  deleteEvidence = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const adminId = req.user?.sub;
      if (!adminId) return res.status(401).json({ message: 'Unauthorized' });
      const evidence = await this.adminService.deleteEvidence(id, adminId);
      res.json(evidence);
    } catch (error) {
      next(error);
    }
  };

  // ===== PERSON MANAGEMENT =====

  getPersons = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { status, limit, offset } = req.query;
      const persons = await this.adminService.getPersons({
        status: status as Status,
        limit: limit ? parseInt(limit as string) : undefined,
        offset: offset ? parseInt(offset as string) : undefined,
      });
      res.json(persons);
    } catch (error) {
      next(error);
    }
  };

  updatePersonStatus = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const adminId = req.user?.sub;
      if (!adminId) return res.status(401).json({ message: 'Unauthorized' });
      const person = await this.adminService.updatePersonStatus(id, status, adminId);
      res.json(person);
    } catch (error) {
      next(error);
    }
  };

  deletePerson = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const adminId = req.user?.sub;
      if (!adminId) return res.status(401).json({ message: 'Unauthorized' });
      const person = await this.adminService.deletePerson(id, adminId);
      res.json(person);
    } catch (error) {
      next(error);
    }
  };

  generateRandomPerson = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const adminId = req.user?.sub;
      if (!adminId) return res.status(401).json({ message: 'Unauthorized' });
      const person = await this.adminService.generateRandomPerson(adminId);
      res.json(person);
    } catch (error) {
      next(error);
    }
  };

  // ===== USER MANAGEMENT =====

  updateUserRole = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { role } = req.body;
      const adminId = req.user?.sub;
      if (!adminId) return res.status(401).json({ message: 'Unauthorized' });
      const user = await this.adminService.updateUserRole(id, role as UserRole, adminId);
      res.json(user);
    } catch (error) {
      next(error);
    }
  };

  shadowBanUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { reason } = req.body;
      const adminId = req.user?.sub;
      if (!adminId) return res.status(401).json({ message: 'Unauthorized' });
      const user = await this.adminService.shadowBanUser(id, adminId, reason);
      res.json(user);
    } catch (error) {
      next(error);
    }
  };

  unshadowBanUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const adminId = req.user?.sub;
      if (!adminId) return res.status(401).json({ message: 'Unauthorized' });
      const user = await this.adminService.unshadowBanUser(id, adminId);
      res.json(user);
    } catch (error) {
      next(error);
    }
  };

  updateUserReputation = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { reputation } = req.body;
      const adminId = req.user?.sub;
      if (!adminId) return res.status(401).json({ message: 'Unauthorized' });
      const user = await this.adminService.updateUserReputation(id, reputation, adminId);
      res.json(user);
    } catch (error) {
      next(error);
    }
  };
}
