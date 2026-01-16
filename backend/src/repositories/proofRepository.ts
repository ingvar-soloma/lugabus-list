import { BaseRepository } from './baseRepository';
import { CreateProofBody } from '../models/types/proofTypes';

export class ProofRepository extends BaseRepository {
  async createWithAuditLog(data: CreateProofBody) {
    throw new Error('Method not implemented compatible with new Schema (Person/Revision/Evidence)');
    /*
    return this.prisma.$transaction(async (tx) => {
      const proof = await tx.proof.create({
        data: {
          fileUrl: data.fileUrl,
          figureId: data.figureId,
        },
      });

      await tx.auditLog.create({
        data: {
          action: 'PROOF_UPLOADED',
          proofId: proof.id,
          details: {
            figureId: data.figureId,
            fileUrl: data.fileUrl,
          },
        },
      });

      return proof;
    });
    */
  }
}
