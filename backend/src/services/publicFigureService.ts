import { PublicFigureRepository } from '../repositories/publicFigureRepository';
import { GetPublicFiguresQuery } from '../models/types/publicFigureTypes';
import { BaseService } from './baseService';

export class PublicFigureService extends BaseService {
  private readonly repository = new PublicFigureRepository();

  async getAll(query: GetPublicFiguresQuery) {
    const { sortBy = 'fullName', sortOrder = 'asc', filter = '' } = query;
    const where = filter
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

  async getRawById(id: string) {
    return this.repository.getRawById(id);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async create(data: any) {
    // Map request body (name, role, statement, rating) to database fields (fullName, currentRole, bio, reputation)
    const personData = {
      fullName: data.name,
      currentRole: data.role,
      bio: data.statement,
      reputation: data.rating || 0,
    };

    // Explicitly set status to PENDING for user submissions
    return this.repository.create({
      ...personData,
      status: 'PENDING',
    });
  }

  async getStats() {
    return this.repository.getStats();
  }
}
