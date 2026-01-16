import { BaseRepository } from './baseRepository';
import { Status, Prisma } from '@prisma/client';

export class RevisionRepository extends BaseRepository {
  /**
   * Get a revision by ID with related data
   */
  async getById(id: string) {
    return this.prisma.revision.findUnique({
      where: { id },
      include: {
        evidences: true,
        author: {
          select: {
            id: true,
            reputation: true,
          },
        },
        person: true,
      },
    });
  }

  /**
   * Get all revisions for a person
   */
  async getByPersonId(personId: string) {
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

  /**
   * Get pending revisions (for moderation queue)
   */
  async getPending(options?: { limit?: number; offset?: number }) {
    return this.prisma.revision.findMany({
      where: { status: Status.PENDING },
      include: {
        evidences: true,
        author: {
          select: { id: true, reputation: true },
        },
        person: {
          select: { id: true, fullName: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: options?.limit,
      skip: options?.offset,
    });
  }

  /**
   * Approve a revision and apply changes to Person snapshot
   * This is the core "Event Sourcing Lite" mechanism
   */
  async approveRevision(revisionId: string, aiScore?: number) {
    return this.prisma.$transaction(async (tx) => {
      // 1. Get the revision with its proposed data
      const revision = await tx.revision.findUnique({
        where: { id: revisionId },
        include: { person: true },
      });

      if (!revision) {
        throw new Error(`Revision not found: ${revisionId}`);
      }

      if (revision.status !== Status.PENDING) {
        throw new Error(`Revision is not pending: ${revision.status}`);
      }

      // 2. Parse proposed data and build update object
      const proposedData = revision.proposedData as Prisma.JsonObject;
      const updateData: Prisma.PersonUpdateInput = {};

      // Map allowed fields from proposedData to Person model
      if (proposedData.fullName !== undefined) {
        updateData.fullName = proposedData.fullName as string;
      }
      if (proposedData.currentRole !== undefined) {
        updateData.currentRole = proposedData.currentRole as string;
      }
      if (proposedData.bio !== undefined) {
        updateData.bio = proposedData.bio as string;
      }
      if (proposedData.photoUrl !== undefined) {
        updateData.photoUrl = proposedData.photoUrl as string;
      }
      if (proposedData.reputation !== undefined) {
        updateData.reputation = proposedData.reputation as number;
      }
      if (proposedData.influence !== undefined) {
        updateData.influence = proposedData.influence as number;
      }

      // 3. Apply the snapshot update to Person
      await tx.person.update({
        where: { id: revision.personId },
        data: updateData,
      });

      // 4. Mark revision as approved
      const approvedRevision = await tx.revision.update({
        where: { id: revisionId },
        data: {
          status: Status.APPROVED,
          aiScore: aiScore ?? revision.aiScore,
        },
        include: {
          evidences: true,
          person: true,
        },
      });

      // 5. Create audit log - store only primitive values
      const appliedChanges: Record<string, string | number | boolean | null> = {};
      for (const [key, value] of Object.entries(updateData)) {
        if (
          typeof value === 'string' ||
          typeof value === 'number' ||
          typeof value === 'boolean' ||
          value === null
        ) {
          appliedChanges[key] = value;
        }
      }

      await tx.auditLog.create({
        data: {
          action: 'APPROVE_REVISION',
          userId: revision.authorId,
          details: {
            revisionId: revision.id,
            personId: revision.personId,
            appliedChanges,
          },
        },
      });

      return approvedRevision;
    });
  }

  /**
   * Reject a revision
   */
  async rejectRevision(revisionId: string, reason?: string) {
    return this.prisma.$transaction(async (tx) => {
      const revision = await tx.revision.findUnique({
        where: { id: revisionId },
      });

      if (!revision) {
        throw new Error(`Revision not found: ${revisionId}`);
      }

      if (revision.status !== Status.PENDING) {
        throw new Error(`Revision is not pending: ${revision.status}`);
      }

      // Mark revision as rejected
      const rejectedRevision = await tx.revision.update({
        where: { id: revisionId },
        data: {
          status: Status.REJECTED,
          reason: reason || revision.reason,
        },
      });

      // Anti-Abuse: Progressive Tracking & Shadow Ban Logic
      const author = await tx.user.findUnique({
        where: { id: revision.authorId },
      });

      if (author) {
        const newViolationCount = author.violationCount + 1;
        const shouldShadowBan = newViolationCount >= 3;

        await tx.user.update({
          where: { id: author.id },
          data: {
            violationCount: newViolationCount,
            isShadowBanned: author.isShadowBanned || shouldShadowBan,
            flaggedIp: revision.clientIp || author.flaggedIp,
          },
        });
      }

      // Create audit log
      await tx.auditLog.create({
        data: {
          action: 'REJECT_REVISION',
          userId: revision.authorId,
          details: {
            revisionId: revision.id,
            personId: revision.personId,
            rejectionReason: reason,
            violationCount: (author?.violationCount || 0) + 1,
            shadowBanned: (author?.violationCount || 0) + 1 >= 3,
          },
        },
      });

      return rejectedRevision;
    });
  }

  /**
   * Update AI score for a revision
   */
  async updateAiScore(revisionId: string, aiScore: number) {
    return this.prisma.revision.update({
      where: { id: revisionId },
      data: { aiScore },
    });
  }
}
