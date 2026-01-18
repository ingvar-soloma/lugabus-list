import { PublicFigureRepository } from '../repositories/publicFigureRepository';
import { GetPublicFiguresQuery } from '../models/types/publicFigureTypes';
import { BaseService } from './baseService';

interface CreatePersonDTO {
  name: string;
  role: string;
  statement: string;
  rating?: number;
}

export class PublicFigureService extends BaseService {
  private readonly repository = new PublicFigureRepository();

  async getAll(query: GetPublicFiguresQuery, isAdmin = false) {
    const { sortBy = 'fullName', sortOrder = 'asc', filter = '' } = query;
    const where = filter
      ? {
          OR: [
            { fullName: { contains: filter, mode: 'insensitive' } },
            { currentRole: { contains: filter, mode: 'insensitive' } },
          ],
        }
      : {};

    return this.repository.getAll(
      {
        where,
        orderBy: {
          [sortBy]: sortOrder,
        },
      },
      isAdmin,
    );
  }

  async getById(id: string, isAdmin = false) {
    return this.repository.getById(id, isAdmin);
  }

  async getRawById(id: string) {
    return this.repository.getRawById(id);
  }

  async create(data: CreatePersonDTO) {
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

  async update(
    id: string,
    data: {
      fullName?: string;
      currentRole?: string;
      bio?: string;
      photoUrl?: string;
      reputation?: number;
      status?: import('@prisma/client').Status;
    },
  ) {
    return this.repository.update(id, data);
  }

  async delete(id: string) {
    return this.repository.delete(id);
  }

  async getStats() {
    return this.repository.getStats();
  }
}
