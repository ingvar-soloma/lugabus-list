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
      // include: { proofs: true }, // Person does not have proofs directly in new schema
    });

    return figures.map(this.mapToPerson);
  }

  async getById(id: string) {
    const figure = await this.prisma.person.findUnique({
      where: { id },
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

    return {
      id: figure.id,
      name: figure.fullName,
      description: figure.bio,
      avatar: figure.photoUrl || `https://picsum.photos/seed/${figure.id}/200/200`,
      category: figure.currentRole,
      position,
      score: figure.reputation,
      proofsCount: 0, // figure.proofs?.length || 0,
      lastUpdated: figure.updatedAt.toISOString().split('T')[0],
      proofs: [], // figure.proofs || [],
      history: [],
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
    const [total] = await Promise.all([
      // , pending
      this.prisma.person.count(),
      // this.prisma.proof.count({ where: { figure: { status: 'PENDING' } } }),
    ]);

    return {
      totalMonitored: total,
      betrayalCount: await this.prisma.person.count({ where: { reputation: { lt: 0 } } }),
      supportCount: await this.prisma.person.count({ where: { reputation: { gt: 0 } } }),
      pendingProofs: 0, // pending,
      weeklyActivity: 12, // Mock
    };
  }
}
