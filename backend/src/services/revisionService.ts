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
   * Vote for a revision to be processed by AI
   */
  async voteForRevision(revisionId: string, userPHash: string) {
    return this.repository.voteForRevision(revisionId, userPHash);
  }

  /**
   * Process a batch of queued revisions (Admin Action)
   */
  async processAdminBatch(limit: number) {
    // 1. Get top prioritized revisions
    const revisions = await this.repository.getQueuedForBatch(limit);
    const ids = revisions.map((r) => r.id);

    if (ids.length === 0) {
      return { processed: 0, results: [] };
    }

    // 2. Lock them for processing
    await this.repository.updateStatus(ids, Status.PROCESSING);

    const results = [];
    for (const revision of revisions) {
      try {
        // Here we simulate AI scoring logic
        // In a real app, this might call an external LLM/AI API
        const aiScore = Math.floor(Math.random() * 100);

        // Use existing logic to finalize (auto-approve or queue for manual)
        await this.processWithAiScore(revision.id, aiScore);
        results.push({ id: revision.id, success: true, aiScore });
      } catch {
        // If it fails, revert status to QUEUED_FOR_AI so it can be retried
        await this.repository.updateStatus([revision.id], Status.QUEUED_FOR_AI);
        results.push({ id: revision.id, success: false, error: 'AI processing failed' });
      }
    }

    return {
      processed: results.length,
      successCount: results.filter((r) => r.success).length,
      errorCount: results.filter((r) => !r.success).length,
      results,
    };
  }

  /**
   * Process revision with AI scoring
   * If AI score > threshold, auto-approve; otherwise, queue for moderation
   */
  async processWithAiScore(revisionId: string, aiScore: number, autoApprove = true) {
    // Update the AI score
    await this.repository.updateAiScore(revisionId, aiScore);

    // If auto-approve enabled and score exceeds threshold, approve automatically
    if (autoApprove && aiScore >= AI_AUTO_APPROVE_THRESHOLD) {
      return this.approveRevision(revisionId, aiScore);
    }

    // If not auto-approved, it stays in PENDING or REJECTED depending on scoring logic
    // For now, if it fails AI, we mark it as PENDING (manual review)
    return this.repository.updateStatus([revisionId], Status.PENDING);
  }

  /**
   * Toggle AI vs Manual moderation mode
   */
  async setModerationMode(_revisionId: string, _mode: 'AI' | 'MANUAL', _reason?: string) {
    // TODO: Implement moderation mode toggle
    throw new Error('Not implemented yet');
  }
}
