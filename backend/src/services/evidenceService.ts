import { EvidenceRepository } from '../repositories/evidenceRepository';
import { BaseService } from './baseService';

export class EvidenceService extends BaseService {
  private readonly repository = new EvidenceRepository();

  async vote(evidenceId: string, userId: string, type: 'LIKE' | 'DISLIKE') {
    const isUpvote = type === 'LIKE';
    return this.repository.vote(evidenceId, userId, isUpvote);
  }
}
