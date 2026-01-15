import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import crypto from 'node:crypto';

const prisma = new PrismaClient();

export class AuthService {
  async login(username: string, password: string): Promise<string | null> {
    const admin = await prisma.admin.findUnique({ where: { username } });

    if (admin && (await bcrypt.compare(password, admin.password))) {
      const secret = process.env.JWT_SECRET;
      if (!secret) {
        throw new Error('JWT_SECRET is not defined');
      }
      return jwt.sign({ id: admin.id, username: admin.username, role: 'ADMIN' }, secret, {
        expiresIn: '1h',
      });
    }
    return null;
  }

  async registerUser(data: {
    username: string;
    password?: string;
    firstName?: string;
    lastName?: string;
  }) {
    if (await prisma.user.findUnique({ where: { username: data.username } })) {
      throw new Error('Username already exists');
    }

    const hashedPassword = data.password ? await bcrypt.hash(data.password, 10) : undefined;
    if (!hashedPassword) throw new Error('Password required');

    const user = await prisma.user.create({
      data: {
        username: data.username,
        password: hashedPassword,
        firstName: data.firstName,
        lastName: data.lastName,
        role: 'USER',
      },
    });

    return this.generateToken(user);
  }

  async userLogin(data: { username: string; password?: string }) {
    const user = await prisma.user.findUnique({ where: { username: data.username } });

    if (user?.password && data.password && (await bcrypt.compare(data.password, user.password))) {
      return this.generateToken(user);
    }
    return null;
  }

  private generateToken(user: {
    id: string;
    telegramId?: bigint | string;
    username?: string | null;
    role: string;
    photoUrl?: string | null;
  }) {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET is not defined');
    }

    return jwt.sign(
      {
        id: user.id,
        telegramId: user.telegramId ? user.telegramId.toString() : undefined,
        username: user.username,
        role: user.role,
        avatar: user.photoUrl,
      },
      secret,
      { expiresIn: '7d' },
    );
  }

  async telegramLogin(data: Record<string, unknown>): Promise<string | null> {
    const { hash, ...userData } = data as Record<string, string>;
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    if (!botToken) {
      throw new Error('TELEGRAM_BOT_TOKEN is not defined');
    }

    const secretKey = crypto.createHash('sha256').update(botToken).digest();
    const dataCheckString = Object.keys(userData)
      .sort((a, b) => a.localeCompare(b))
      .map((key) => `${key}=${userData[key]}`)
      .join('\n');

    const hmac = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');

    if (hmac !== hash) {
      return null;
    }

    // Convert auth_date to Date object
    const _authDate = new Date(Number.parseInt(userData.auth_date) * 1000);

    const user = await prisma.user.upsert({
      where: { telegramId: BigInt(userData.id) },
      update: {
        username: userData.username,
        firstName: userData.first_name,
        lastName: userData.last_name,
        photoUrl: userData.photo_url,
      },
      create: {
        telegramId: BigInt(userData.id),
        username: userData.username,
        firstName: userData.first_name,
        lastName: userData.last_name,
        photoUrl: userData.photo_url,
      },
    });

    return this.generateToken(user);
  }
}
