import { Status } from '@prisma/client';
import { RevisionRepository } from '../repositories/revisionRepository';
import { EvidenceRepository, CreateRevisionData } from '../repositories/evidenceRepository';
import { BaseService } from './baseService';

// AI auto-approval threshold
const AI_AUTO_APPROVE_THRESHOLD = 85;

export class RevisionService extends BaseService {
  private readonly repository = new RevisionRepository();
  private readonly evidenceRepository = new EvidenceRepository();

  /**
   * Create a new revision with evidence
   */
  async createRevision(data: CreateRevisionData) {
    // 1. Check user status (Shadow Ban Logic)
    const user = await this.prisma.user.findUnique({
      where: { id: data.authorId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // If shadow-banned, mark revision as REJECTED immediately, but return success to user
    const status = user.isShadowBanned ? Status.REJECTED : Status.PENDING;

    return this.evidenceRepository.createRevision({
      ...data,
      status,
    });
  }

  /**
   * Get revision history for a person
   */
  async getHistory(personId: string) {
    return this.repository.getByPersonId(personId);
  }

  /**
   * Get a single revision by ID
   */
  async getById(revisionId: string) {
    return this.repository.getById(revisionId);
  }

  /**
   * Get all pending revisions (moderation queue)
   */
  async getPendingRevisions(options?: { limit?: number; offset?: number }) {
    return this.repository.getPending(options);
  }

  /**
   * Approve a revision - applies proposedData to Person snapshot
   * @param revisionId - ID of the revision to approve
   * @param aiScore - Optional AI score (if AI-verified)
   */
  async approveRevision(revisionId: string, aiScore?: number) {
    return this.repository.approveRevision(revisionId, aiScore);
  }

  /**
   * Reject a revision
   * @param revisionId - ID of the revision to reject
   * @param reason - Reason for rejection
   */
  async rejectRevision(revisionId: string, reason?: string) {
    return this.repository.rejectRevision(revisionId, reason);
  }

  /**
   * Process revision with AI scoring
   * If AI score > threshold, auto-approve; otherwise, queue for moderation
   * @param revisionId - ID of the revision to process
   * @param aiScore - AI-generated score (0-100)
   * @param autoApprove - Whether to auto-approve if score > threshold
   */
  async processWithAiScore(revisionId: string, aiScore: number, autoApprove = true) {
    // Update the AI score
    await this.repository.updateAiScore(revisionId, aiScore);

    // If auto-approve enabled and score exceeds threshold, approve automatically
    if (autoApprove && aiScore >= AI_AUTO_APPROVE_THRESHOLD) {
      return this.approveRevision(revisionId, aiScore);
    }

    // Otherwise, return the revision for manual moderation
    return this.getById(revisionId);
  }

  /**
   * Toggle AI vs Manual moderation mode
   */
  async setModerationMode(_revisionId: string, _mode: 'AI' | 'MANUAL', _reason?: string) {
    // TODO: Implement moderation mode toggle
    // This would store the mode choice and reason in AuditLog
    throw new Error('Not implemented yet');
  }
}
