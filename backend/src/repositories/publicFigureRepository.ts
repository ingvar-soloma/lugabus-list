import { Status, Person, Revision, Evidence } from '@prisma/client';
import { BaseRepository } from './baseRepository';

type PersonWithRevisions = Person & {
  revisions: (Revision & {
    evidences: Evidence[];
  })[];
};

interface MappedProof {
  id: string;
  text: string;
  sourceUrl: string | null;
  type: string;
  date: string;
  likes: number;
  dislikes: number;
  status: string;
}

interface MappedHistory {
  id: string;
  date: string;
  title: string;
  description: string;
  position: string;
}

export class PublicFigureRepository extends BaseRepository {
  async getAll(options: { where?: object; orderBy?: object }) {
    const figures = await this.prisma.person.findMany({
      ...options,
      include: {
        revisions: {
          where: { status: Status.APPROVED },
          include: { evidences: true },
        },
      },
    });

    return (figures as PersonWithRevisions[]).map((f) => this.mapToPerson(f));
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
    return figure ? this.mapToPerson(figure as PersonWithRevisions) : null;
  }

  async getRawById(id: string) {
    return this.prisma.person.findUnique({
      where: { id },
    });
  }

  private mapToPerson(figure: PersonWithRevisions) {
    let position = 'NEUTRAL';
    if (figure.reputation > 0) {
      position = 'SUPPORT';
    } else if (figure.reputation < 0) {
      position = 'BETRAYAL';
    }

    // Collect all evidences from all approved revisions
    const allEvidences: MappedProof[] =
      figure.revisions?.flatMap((rev) =>
        (rev.evidences || []).map((ev) => ({
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
    const history: MappedHistory[] =
      figure.revisions?.map((rev) => ({
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
      history: history.sort((a, b) => b.date.localeCompare(a.date)),
    };
  }

  async updateStatus(id: string, status: Status) {
    return this.prisma.person.update({
      where: { id },
      data: { status },
    });
  }

  async create(data: {
    fullName: string;
    currentRole: string;
    bio: string;
    reputation?: number;
    status?: Status;
  }) {
    return this.prisma.person.create({
      data: {
        fullName: data.fullName,
        currentRole: data.currentRole,
        bio: data.bio,
        reputation: data.reputation || 0,
        status: data.status || Status.PENDING,
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
