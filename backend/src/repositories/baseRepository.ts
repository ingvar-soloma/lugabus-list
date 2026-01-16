import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import dotenv from 'dotenv';

dotenv.config();

const adapter = new PrismaPg({ connectionString: process.env['DATABASE_URL'] });
export const prisma = new PrismaClient({ adapter });

export class BaseRepository {
  protected readonly prisma: PrismaClient;

  constructor() {
    this.prisma = prisma;
  }
}
