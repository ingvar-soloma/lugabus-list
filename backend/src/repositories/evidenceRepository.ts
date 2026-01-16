import { BaseRepository } from './baseRepository';
import { Status, Polarity, EvidenceType, Prisma } from '@prisma/client';

export interface CreateRevisionData {
  personId: string;
  authorId: string;
  // JSON data for the revision
  proposedData: Prisma.InputJsonValue;
  reason?: string;
  evidences?: {
    url: string;
    title?: string;
    type?: EvidenceType;
    polarity?: Polarity;
  }[];
}

export class EvidenceRepository extends BaseRepository {
  /**
   * Create a new revision with attached evidence
   */
  async createRevision(data: CreateRevisionData) {
    return this.prisma.$transaction(async (tx) => {
      // 1. Create the revision
      const revision = await tx.revision.create({
        data: {
          personId: data.personId,
          authorId: data.authorId,
          proposedData: data.proposedData,
          reason: data.reason,
          status: Status.PENDING,

          // 2. Create nested evidences
          evidences: {
            create:
              data.evidences?.map((e) => ({
                url: e.url,
                title: e.title,
                type: e.type || EvidenceType.LINK,
                polarity: e.polarity || Polarity.SUPPORT,
              })) || [],
          },
        },
        include: {
          evidences: true,
        },
      });

      // 3. Log potential audit/activity if needed (optional)
      /*
      await tx.auditLog.create({
        data: {
          action: 'CREATE_REVISION',
          userId: data.authorId,
          details: { revisionId: revision.id }
        }
      });
      */

      return revision;
    });
  }

  async getRevisionsByPerson(personId: string) {
    return this.prisma.revision.findMany({
      where: { personId },
      include: {
        evidences: true,
        author: {
          select: {
            id: true,
            username: true,
            reputation: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
