import { PublicFigureRepository } from '../repositories/publicFigureRepository';
import { Status, UserRole } from '@prisma/client';
import { BaseService } from './baseService';
import { generateIdentity } from '../utils/identityGenerator';

interface AuditLogDetails {
  targetId?: string;
  targetName?: string;
}

interface UserWithNames {
  username?: string;
}

export class AdminService extends BaseService {
  private readonly repository = new PublicFigureRepository();

  async updateFigureStatus(id: string, status: Status) {
    return this.repository.updateStatus(id, status);
  }

  async getUsers() {
    const users = await this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return users.map((u) => {
      const fallbackIdentity = generateIdentity(u.id);

      return {
        ...u,
        nickname: u.displayName ?? fallbackIdentity.nickname,
        avatarSvg: fallbackIdentity.svg,
      };
    });
  }

  async getAuditLogs() {
    const logs = await this.prisma.auditLog.findMany({
      include: { user: true },
      orderBy: { timestamp: 'desc' },
      take: 50,
    });

    return logs.map((log) => {
      const details = log.details as unknown as AuditLogDetails;
      const user = log.user as unknown as UserWithNames;
      return {
        id: log.id,
        adminId: log.userId || 'system',
        adminName: user?.username || 'System',
        action: log.action,
        targetId: details?.targetId || '',
        targetName: details?.targetName || '',
        timestamp: log.timestamp.toISOString(),
      };
    });
  }

  async getAIInsights() {
    // For now, return AI scores from revisions as insights
    const revisionsWithAi = await this.prisma.revision.findMany({
      where: { aiScore: { not: null } },
      take: 20,
      orderBy: { createdAt: 'desc' },
    });

    return revisionsWithAi.map((r) => ({
      id: r.id,
      targetId: r.personId,
      confidence: r.aiScore,
      sentiment: r.aiScore && r.aiScore > 50 ? 'POSITIVE' : 'NEGATIVE',
      summary: `AI analysis of revision ${r.id}`,
    }));
  }

  // ===== QUEUE MANAGEMENT (Revisions) =====

  async getRevisionQueue(params?: { status?: Status; limit?: number; offset?: number }) {
    const { status, limit = 50, offset = 0 } = params || {};

    const revisions = await this.prisma.revision.findMany({
      where: status ? { status } : undefined,
      include: {
        person: { select: { id: true, fullName: true } },
        author: { select: { id: true } },
        evidences: true,
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });

    return revisions.map((rev) => {
      const identity = generateIdentity(rev.authorId);
      return {
        ...rev,
        authorIdentity: {
          nickname: identity.nickname,
          avatarSvg: identity.svg,
        },
      };
    });
  }

  async approveRevision(revisionId: string, adminId: string) {
    const revision = await this.prisma.revision.findUnique({
      where: { id: revisionId },
      include: { person: true },
    });

    if (!revision) throw new Error('Revision not found');

    // Apply proposed changes to person
    const proposedData = revision.proposedData as Record<string, unknown>;
    await this.prisma.person.update({
      where: { id: revision.personId },
      data: proposedData,
    });

    // Update revision status
    await this.prisma.revision.update({
      where: { id: revisionId },
      data: { status: Status.APPROVED },
    });

    // Log action
    await this.prisma.auditLog.create({
      data: {
        userId: adminId,
        action: 'APPROVE_REVISION',
        details: {
          revisionId,
          personId: revision.personId,
          personName: revision.person.fullName,
        },
      },
    });

    return revision;
  }

  async rejectRevision(revisionId: string, adminId: string, reason?: string) {
    const revision = await this.prisma.revision.findUnique({
      where: { id: revisionId },
      include: { person: true },
    });

    if (!revision) throw new Error('Revision not found');

    await this.prisma.revision.update({
      where: { id: revisionId },
      data: {
        status: Status.REJECTED,
        reason: reason || revision.reason,
      },
    });

    await this.prisma.auditLog.create({
      data: {
        userId: adminId,
        action: 'REJECT_REVISION',
        details: {
          revisionId,
          personId: revision.personId,
          personName: revision.person.fullName,
          reason,
        },
      },
    });

    return revision;
  }

  // ===== EVIDENCE MANAGEMENT =====

  async getEvidence(params?: { limit?: number; offset?: number }) {
    const { limit = 50, offset = 0 } = params || {};

    return this.prisma.evidence.findMany({
      include: {
        revision: {
          include: {
            person: { select: { id: true, fullName: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });
  }

  async deleteEvidence(evidenceId: string, adminId: string) {
    const evidence = await this.prisma.evidence.findUnique({
      where: { id: evidenceId },
      include: { revision: { include: { person: true } } },
    });

    if (!evidence) throw new Error('Evidence not found');

    await this.prisma.evidence.delete({
      where: { id: evidenceId },
    });

    await this.prisma.auditLog.create({
      data: {
        userId: adminId,
        action: 'DELETE_EVIDENCE',
        details: {
          evidenceId,
          evidenceUrl: evidence.url,
          revisionId: evidence.revisionId,
        },
      },
    });

    return evidence;
  }

  // ===== PERSON MANAGEMENT =====

  async getPersons(params?: { status?: Status; limit?: number; offset?: number }) {
    const { status, limit = 50, offset = 0 } = params || {};

    return this.prisma.person.findMany({
      where: status ? { status } : undefined,
      include: {
        revisions: { take: 5, orderBy: { createdAt: 'desc' } },
        _count: { select: { revisions: true, votes: true } },
      },
      orderBy: { updatedAt: 'desc' },
      take: limit,
      skip: offset,
    });
  }

  async updatePersonStatus(personId: string, status: Status, adminId: string) {
    const person = await this.prisma.person.update({
      where: { id: personId },
      data: { status },
    });

    await this.prisma.auditLog.create({
      data: {
        userId: adminId,
        action: 'UPDATE_PERSON_STATUS',
        details: {
          personId,
          personName: person.fullName,
          newStatus: status,
        },
      },
    });

    return person;
  }

  async deletePerson(personId: string, adminId: string) {
    const person = await this.prisma.person.findUnique({
      where: { id: personId },
    });

    if (!person) throw new Error('Person not found');

    // Use repository's cascade delete
    await this.repository.delete(personId);

    await this.prisma.auditLog.create({
      data: {
        userId: adminId,
        action: 'DELETE_PERSON',
        details: {
          personId,
          personName: person.fullName,
        },
      },
    });

    return person;
  }

  async generateRandomPerson(adminId: string) {
    const firstNames = ['Іван', 'Олександр', 'Микола', 'Дмитро', 'Сергій', 'Андрій', 'Юрій'];
    const lastNames = ['Коваленко', 'Мельник', 'Ткаченко', 'Бойко', 'Шевченко', 'Кравченко'];
    const roles = ['Депутат', 'Мер міста', 'Бізнесмен', 'Прокурор', 'Суддя', 'Блогер'];
    const bios = [
      'Підозрюється у співпраці з окупаційною владою.',
      'Активно підтримує Збройні Сили України.',
      'Виїхав за кордон на початку повномасштабного вторгнення за підробленими документами.',
      'Займається волонтерством та гуманітарною допомогою.',
    ];

    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const role = roles[Math.floor(Math.random() * roles.length)];
    const bio = bios[Math.floor(Math.random() * bios.length)];
    const reputation = Math.random() > 0.5 ? Math.random() * 10 : -Math.random() * 10;

    return this.prisma.person.create({
      data: {
        fullName: `${firstName} ${lastName}`,
        currentRole: role,
        bio: bio,
        reputation: reputation,
        status: Status.APPROVED,
        revisions: {
          create: {
            authorId: adminId,
            status: Status.APPROVED,
            proposedData: {
              fullName: `${firstName} ${lastName}`,
              currentRole: role,
              bio: bio,
            },
            reason: 'Generated by admin for testing',
          },
        },
      },
    });
  }

  // ===== USER MANAGEMENT =====

  async updateUserRole(userId: string, role: UserRole, adminId: string) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { role },
    });

    await this.prisma.auditLog.create({
      data: {
        userId: adminId,
        action: 'UPDATE_USER_ROLE',
        details: {
          targetUserId: userId,
          newRole: role,
        },
      },
    });

    return user;
  }

  async shadowBanUser(userId: string, adminId: string, reason?: string) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { isShadowBanned: true },
    });

    await this.prisma.auditLog.create({
      data: {
        userId: adminId,
        action: 'SHADOW_BAN_USER',
        details: {
          targetUserId: userId,
          reason,
        },
      },
    });

    return user;
  }

  async unshadowBanUser(userId: string, adminId: string) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { isShadowBanned: false, violationCount: 0 },
    });

    await this.prisma.auditLog.create({
      data: {
        userId: adminId,
        action: 'UNSHADOW_BAN_USER',
        details: {
          targetUserId: userId,
        },
      },
    });

    return user;
  }

  async updateUserReputation(userId: string, reputation: number, adminId: string) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { reputation },
    });

    await this.prisma.auditLog.create({
      data: {
        userId: adminId,
        action: 'UPDATE_USER_REPUTATION',
        details: {
          targetUserId: userId,
          newReputation: reputation,
        },
      },
    });

    return user;
  }
}
