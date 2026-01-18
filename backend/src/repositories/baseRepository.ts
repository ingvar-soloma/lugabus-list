import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import dotenv from 'dotenv';

dotenv.config();

dotenv.config();

let dbUrl = process.env.DATABASE_URL;

if (!dbUrl && process.env.DB_USER && process.env.DB_PASSWORD) {
  try {
    const host = process.env.DB_HOST || 'db';
    const name = process.env.DB_NAME || 'lugabus';
    const url = new URL(`postgresql://${host}:5432/${name}`);
    url.username = process.env.DB_USER!;
    url.password = process.env.DB_PASSWORD!;
    dbUrl = url.toString();
  } catch (err) {
    console.error('Failed to construct DATABASE_URL:', err);
  }
}

const adapter = new PrismaPg({ connectionString: dbUrl! });
export const prisma = new PrismaClient({ adapter });

export class BaseRepository {
  protected readonly prisma: PrismaClient;

  constructor() {
    this.prisma = prisma;
  }
}
