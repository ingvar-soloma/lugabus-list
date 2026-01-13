import { ProofRepository } from '../repositories/proofRepository';
import { CreateProofBody } from '../models/types/proofTypes';
import { BaseService } from './baseService';

export class ProofService extends BaseService {
  private repository = new ProofRepository();

  async create(data: CreateProofBody) {
    return this.repository.createWithAuditLog(data);
  }
}
