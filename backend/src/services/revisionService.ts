import { EvidenceRepository, CreateRevisionData } from '../repositories/evidenceRepository';
import { BaseService } from './baseService';

export class RevisionService extends BaseService {
  private repository = new EvidenceRepository();

  async createRevision(data: CreateRevisionData) {
    // Here we can add business logic, e.g., checking if user is allowed to edit
    // or validating the proposedData against schema

    return this.repository.createRevision(data);
  }

  async getHistory(personId: string) {
    return this.repository.getRevisionsByPerson(personId);
  }
}
