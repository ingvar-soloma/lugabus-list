import {Prisma, Status} from '@prisma/client';
import {BaseRepository} from './baseRepository';

export class PublicFigureRepository extends BaseRepository {
  async getAll(options: { where?: Prisma.PublicFigureWhereInput; orderBy?: Prisma.PublicFigureOrderByWithRelationInput }) {
    const figures = await this.prisma.publicFigure.findMany({
      ...options,
      include: {
        proofs: true
      }
    });

    return figures.map(this.mapToPerson);
  }

  async getById(id: string) {
    const figure = await this.prisma.publicFigure.findUnique({ 
      where: { id },
      include: { proofs: true }
    });
    return figure ? this.mapToPerson(figure) : null;
  }

  private mapToPerson(figure: any) {
    let position = 'NEUTRAL';
    if (figure.rating > 0) {
      position = 'SUPPORT';
    } else if (figure.rating < 0) {
      position = 'BETRAYAL';
    }

    return {
      id: figure.id,
      name: figure.name,
      description: figure.statement,
      avatar: `https://picsum.photos/seed/${figure.id}/200/200`, // Placeholder
      category: figure.role,
      position,
      score: figure.rating,
      proofsCount: figure.proofs?.length || 0,
      lastUpdated: figure.updatedAt.toISOString().split('T')[0],
      proofs: figure.proofs || [],
      history: [] // Mock for now
    };
  }

  async updateStatus(id: string, status: Status) {
    return this.prisma.publicFigure.update({
      where: { id },
      data: { status },
    });
  }

  async create(data: Prisma.PublicFigureCreateInput) {
    return this.prisma.publicFigure.create({
      data,
    });
  }

  async getStats() {
    const [total, pending] = await Promise.all([
      this.prisma.publicFigure.count(),
      this.prisma.proof.count({ where: { figure: { status: 'PENDING' } } })
    ]);

    return {
      totalMonitored: total,
      betrayalCount: await this.prisma.publicFigure.count({where: {rating: {lt: 0}}}),
      supportCount: await this.prisma.publicFigure.count({where: {rating: {gt: 0}}}),
      pendingProofs: pending,
      weeklyActivity: 12 // Mock
    };
  }
}
