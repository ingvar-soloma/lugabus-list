import { Prisma, Status } from '@prisma/client';
import { BaseRepository } from './baseRepository';

export class PublicFigureRepository extends BaseRepository {
  async getAll(options: { where?: Prisma.PublicFigureWhereInput; orderBy?: Prisma.PublicFigureOrderByWithRelationInput }) {
    return this.prisma.publicFigure.findMany(options);
  }

  async getById(id: string) {
    return this.prisma.publicFigure.findUnique({ where: { id } });
  }

  async updateStatus(id: string, status: Status) {
    return this.prisma.publicFigure.update({
      where: { id },
      data: { status },
    });
  }
}
