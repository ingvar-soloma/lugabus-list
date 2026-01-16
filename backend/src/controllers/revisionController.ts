import { Request, Response, NextFunction } from 'express';
import { RevisionService } from '../services/revisionService';
import { CreateRevisionData } from '../repositories/evidenceRepository';

export class RevisionController {
  private readonly service = new RevisionService();

  /**
   * POST /revisions
   * Create a new revision for a person
   */
  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = (req as any).user;
      const authorId = user?.sub;

      if (!authorId) {
        res.status(401).json({ message: 'Unauthorized: User ID (sub) missing from token' });
        return;
      }

      const pepper = process.env.IP_PEPPER || 'default-ip-pepper';
      const ip = req.ip || 'unknown';
      const { hashIp } = await import('../utils/crypto');
      const hashedIp = hashIp(ip, pepper);

      const revisionData: CreateRevisionData = {
        ...req.body,
        authorId,
        hashedIp,
      };

      const revision = await this.service.createRevision(revisionData);
      res.status(201).json(revision);
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /revisions/:personId
   * Get revision history for a person
   */
  getHistory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { personId } = req.params;
      const history = await this.service.getHistory(personId);
      res.json(history);
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /revisions/detail/:revisionId
   * Get a single revision by ID
   */
  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { revisionId } = req.params;
      const revision = await this.service.getById(revisionId);

      if (!revision) {
        res.status(404).json({ error: 'Revision not found' });
        return;
      }

      res.json(revision);
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /revisions/pending
   * Get all pending revisions for moderation
   */
  getPending = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const limit = req.query.limit ? Number.parseInt(req.query.limit as string, 10) : undefined;
      const offset = req.query.offset ? Number.parseInt(req.query.offset as string, 10) : undefined;

      const pendingRevisions = await this.service.getPendingRevisions({ limit, offset });
      res.json(pendingRevisions);
    } catch (error) {
      next(error);
    }
  };

  /**
   * PATCH /revisions/:revisionId/approve
   * Approve a revision - applies changes to Person snapshot
   */
  approve = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { revisionId } = req.params;
      const { aiScore } = req.body;

      const approvedRevision = await this.service.approveRevision(revisionId, aiScore);
      res.json({
        message: 'Revision approved and changes applied to person',
        revision: approvedRevision,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * PATCH /revisions/:revisionId/reject
   * Reject a revision
   */
  reject = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { revisionId } = req.params;
      const { reason } = req.body;

      const rejectedRevision = await this.service.rejectRevision(revisionId, reason);
      res.json({
        message: 'Revision rejected',
        revision: rejectedRevision,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /revisions/:revisionId/ai-score
   * Process a revision with AI scoring (may auto-approve if score >= 85)
   */
  processWithAi = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { revisionId } = req.params;
      const { aiScore, autoApprove = true } = req.body;

      if (typeof aiScore !== 'number' || aiScore < 0 || aiScore > 100) {
        res.status(400).json({ error: 'aiScore must be a number between 0 and 100' });
        return;
      }

      const result = await this.service.processWithAiScore(revisionId, aiScore, autoApprove);

      const wasAutoApproved = result && (result as any).status === 'APPROVED';
      res.json({
        message: wasAutoApproved
          ? 'Revision auto-approved by AI'
          : 'Revision scored, pending manual review',
        revision: result,
        autoApproved: wasAutoApproved,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /revisions/:revisionId/vote
   * Vote to increase AI processing priority for a revision
   */
  vote = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { revisionId } = req.params;
      const user = (req as any).user;
      const userPHash = user?.sub;

      if (!userPHash) {
        res.status(401).json({ error: 'Unauthorized: User sub missing' });
        return;
      }

      const result = await this.service.voteForRevision(revisionId, userPHash);
      res.json({
        message: 'Vote recorded successfully',
        priorityScore: (result as any).priorityScore,
      });
    } catch (error) {
      if ((error as any).code === 'P2002') {
        res.status(400).json({ error: 'You have already voted for this revision' });
        return;
      }
      next(error);
    }
  };

  /**
   * POST /admin/revisions/process-batch
   * Manually trigger AI processing for top-prioritized revisions (Admin Only)
   */
  processBatch = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = (req as any).user;
      if (user?.role !== 'ADMIN') {
        res.status(403).json({ error: 'Forbidden: Admin role required' });
        return;
      }

      const limit = req.body.limit || 10;
      const report = await this.service.processAdminBatch(limit);

      res.json({
        message: `Processed batch of ${report.processed} revisions`,
        report,
      });
    } catch (error) {
      next(error);
    }
  };
}
