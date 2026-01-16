import { prisma } from '../repositories/baseRepository';

export class BaseService {
  protected readonly prisma = prisma;
}
