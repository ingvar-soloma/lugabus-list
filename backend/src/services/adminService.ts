import { PublicFigureRepository } from '../repositories/publicFigureRepository';
import { Status } from '@prisma/client';

export class AdminService {
  private repository = new PublicFigureRepository();

  async updateFigureStatus(id: string, status: Status) {
    return this.repository.updateStatus(id, status);
  }
}
