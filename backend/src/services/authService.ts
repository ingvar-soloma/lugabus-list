import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export class AuthService {
  async login(username: string, password: string): Promise<string | null> {
    const admin = await prisma.admin.findUnique({ where: { username } });

    if (admin && await bcrypt.compare(password, admin.password)) {
      const secret = process.env.JWT_SECRET;
      if (!secret) {
        throw new Error('JWT_SECRET is not defined');
      }
      return jwt.sign({ id: admin.id, username: admin.username }, secret, { expiresIn: '1h' });
    }
    return null;
  }
}
