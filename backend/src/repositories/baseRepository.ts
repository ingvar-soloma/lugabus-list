import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

export class BaseRepository {
  protected readonly prisma: PrismaClient;

  constructor() {
    this.prisma = prisma;
  }
}
