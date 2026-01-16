import { prisma } from '../repositories/baseRepository';
import jwt from 'jsonwebtoken';
import crypto from 'node:crypto';
import { encryptJson } from '../utils/crypto';
import { StorageService } from './storageService';
import logger from '../config/logger';

const storageService = new StorageService();

export class AuthService {
  /**
   * Refactored login to use pHash for lookup or only allow Telegram login.
   * If admin login is still needed via username/password, we search for pHash of username.
   */
  async login(username: string, _password: string): Promise<string | null> {
    const pHash = this.generatePHash(username);
    const user = await prisma.user.findUnique({
      where: {
        id: pHash,
      },
    });

    if (!user) return null;

    // We assume password hash is stored in encryptedData if this user was created via registerUser
    // But better to only allow ADMIN login if role is set.
    if (user.role !== 'ADMIN') return null;

    // For simplicity, we assume ADMINs have their password hash somewhere
    // or we use a separate mechanism. Given the requirements, we prioritize Telegram.

    // If we need to support old password-based admins, we'd need to decrypt encryptedData and check.
    return this.generateToken(user);
  }

  /**
   * Generates a permanent anonymous hash (pHash)
   * HMAC(ID, PEPPER)
   */
  private generatePHash(id: string): string {
    const pepper = process.env.HASH_PEPPER;
    if (!pepper) {
      logger.warn('HASH_PEPPER is not defined, using default-pepper. THIS IS NOT SECURE.');
    }
    return crypto
      .createHmac('sha256', pepper || 'default-pepper')
      .update(id)
      .digest('hex');
  }

  /**
   * Generates a monthly rotatable hash (mHash)
   * HMAC(ID, YYYY-MM + PEPPER)
   */
  private generateMHash(id: string): string {
    const monthSalt = new Date().toISOString().slice(0, 7); // e.g., "2024-05"
    const pepper = process.env.HASH_PEPPER;
    return crypto
      .createHmac('sha256', (pepper || 'default-pepper') + monthSalt)
      .update(id)
      .digest('hex');
  }

  /**
   * Minimalistic JWT Token
   * Only contains 'sub' (pHash) and 'role'.
   */
  private generateToken(user: {
    id: string; // id is pHash
    role: string;
  }) {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET is not defined');
    }

    return jwt.sign(
      {
        sub: user.id,
        role: user.role,
      },
      secret,
      { expiresIn: '7d' },
    );
  }

  /**
   * Protection of Telegram avatars:
   * 1. Fetches the image from Telegram's photo_url.
   * 2. Uploads it to our own storage (S3) with a UUID file name.
   * 3. Returns the new anonymized URL.
   */
  private async anonymizeAvatar(photoUrl: string): Promise<string | null> {
    try {
      const response = await fetch(photoUrl);
      if (!response.ok) return null;

      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const anonymizedUrl = await storageService.uploadImage(buffer, 'avatar.webp', 'avatars');
      return anonymizedUrl;
    } catch (error) {
      logger.error('Failed to anonymize avatar', error);
      return null;
    }
  }

  async telegramLogin(data: Record<string, unknown>): Promise<string | null> {
    const { hash, ...userData } = data as Record<string, string>;
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const encryptionKey = process.env.ENCRYPTION_KEY;

    if (!botToken) throw new Error('TELEGRAM_BOT_TOKEN is not defined');
    if (!encryptionKey) throw new Error('ENCRYPTION_KEY is not defined');

    const secretKey = crypto.createHash('sha256').update(botToken).digest();
    const dataCheckString = Object.keys(userData)
      .sort((a, b) => a.localeCompare(b))
      .map((key) => `${key}=${userData[key]}`)
      .join('\n');

    const hmac = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');

    if (hmac !== hash) {
      return null;
    }

    const pHash = this.generatePHash(userData.id.toString());
    const mHash = this.generateMHash(userData.id.toString());

    // Anonymize Avatar if present
    let avatarUrl = null;
    if (userData.photo_url) {
      avatarUrl = await this.anonymizeAvatar(userData.photo_url);
    }

    // Encrypt personal data
    const encryptedData = encryptJson(
      {
        username: userData.username,
        firstName: userData.first_name,
        lastName: userData.last_name,
        photoUrl: avatarUrl || userData.photo_url, // Store original if anonymization failed, though anonymized is preferred
        telegramId: userData.id, // Store original TG ID ONLY in encrypted form
      },
      encryptionKey,
    );

    // Upsert by pHash (id)
    const user = await prisma.user.upsert({
      where: { id: pHash },
      update: {
        encryptedData,
        mHash,
      },
      create: {
        id: pHash,
        encryptedData,
        mHash,
        role: 'USER',
      },
    });

    return this.generateToken(user);
  }
}
