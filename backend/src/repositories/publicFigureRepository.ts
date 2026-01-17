import { Status } from '@prisma/client';
import { BaseRepository } from './baseRepository';

export class PublicFigureRepository extends BaseRepository {
  async getAll(options: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    where?: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    orderBy?: any;
  }) {
    const figures = await this.prisma.person.findMany({
      ...options,
      include: {
        revisions: {
          where: { status: Status.APPROVED },
          include: { evidences: true },
        },
      },
    });

    return figures.map((f) => this.mapToPerson(f));
  }

  async getById(id: string) {
    const figure = await this.prisma.person.findUnique({
      where: { id },
      include: {
        revisions: {
          where: { status: Status.APPROVED },
          include: { evidences: true },
        },
      },
    });
    return figure ? this.mapToPerson(figure) : null;
  }

  async getRawById(id: string) {
    return this.prisma.person.findUnique({
      where: { id },
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private mapToPerson(figure: any) {
    let position = 'NEUTRAL';
    if (figure.reputation > 0) {
      position = 'SUPPORT';
    } else if (figure.reputation < 0) {
      position = 'BETRAYAL';
    }

    // Collect all evidences from all approved revisions
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const allEvidences =
      figure.revisions?.flatMap((rev: any) =>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (rev.evidences || []).map((ev: any) => ({
          id: ev.id,
          text: ev.title || rev.reason || 'Доказ без опису',
          sourceUrl: ev.url,
          type: ev.type,
          date: rev.createdAt.toISOString().split('T')[0],
          likes: 0,
          dislikes: 0,
          status: 'APPROVED',
        })),
      ) || [];

    // Map revisions to history timeline
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const history =
      figure.revisions?.map((rev: any) => ({
        id: rev.id,
        date: rev.createdAt.toISOString().split('T')[0],
        title: rev.reason || 'Оновлення профілю',
        description: 'Інформація була оновлена та верифікована модераторами.',
        position: position, // Use the person's position for the event
      })) || [];

    return {
      id: figure.id,
      name: figure.fullName,
      description: figure.bio,
      avatar: figure.photoUrl || `https://picsum.photos/seed/${figure.id}/200/200`,
      category: figure.currentRole,
      position,
      score: figure.reputation,
      proofsCount: allEvidences.length,
      lastUpdated: figure.updatedAt.toISOString().split('T')[0],
      proofs: allEvidences,
      history: history.sort((a: any, b: any) => b.date.localeCompare(a.date)),
    };
  }

  async updateStatus(id: string, status: Status) {
    return this.prisma.person.update({
      where: { id },
      data: { status },
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async create(data: any) {
    return this.prisma.person.create({
      data: {
        fullName: data.fullName,
        currentRole: data.currentRole,
        bio: data.bio,
        reputation: data.reputation || 0,
        status: data.status || 'PENDING',
      },
    });
  }

  async getStats() {
    const total = await this.prisma.person.count();

    return {
      totalMonitored: total,
      betrayalCount: await this.prisma.person.count({ where: { reputation: { lt: 0 } } }),
      supportCount: await this.prisma.person.count({ where: { reputation: { gt: 0 } } }),
      pendingProofs: 0, // pending,
      weeklyActivity: 12, // Mock
    };
  }
}
