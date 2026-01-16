import { PublicFigureRepository } from '../repositories/publicFigureRepository';
import { GetPublicFiguresQuery } from '../models/types/publicFigureTypes';
import { Prisma } from '@prisma/client';
import { BaseService } from './baseService';

export class PublicFigureService extends BaseService {
  private readonly repository = new PublicFigureRepository();

  async getAll(query: GetPublicFiguresQuery) {
    const { sortBy = 'fullName', sortOrder = 'asc', filter = '' } = query;
    const where: Prisma.PersonWhereInput = filter
      ? {
          OR: [
            { fullName: { contains: filter, mode: 'insensitive' } },
            { currentRole: { contains: filter, mode: 'insensitive' } },
          ],
        }
      : {};

    return this.repository.getAll({
      where,
      orderBy: {
        [sortBy]: sortOrder,
      },
    });
  }

  async getById(id: string) {
    return this.repository.getById(id);
  }

  async create(data: Prisma.PersonCreateInput) {
    // Explicitly set status to PENDING for user submissions
    // Admin submissions could be APPROVED automatically, but for now, everything is PENDING
    return this.repository.create({
      ...data,
      status: 'PENDING',
    });
  }

  async getStats() {
    return this.repository.getStats();
  }
}
