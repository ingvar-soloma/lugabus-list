import { StorageService } from './storageService';
import logger from '../config/logger';
import bcrypt from 'bcrypt';
import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';
import { prisma } from '../repositories/baseRepository';
import { encryptJson, decryptJson } from '../utils/crypto';
import { generateUsername, getAvatarColor } from '../utils/usernames';

const storageService = new StorageService();

export class AuthService {
  /**
   * Refactored login to use pHash for lookup or only allow Telegram login.
   * If admin login is still needed via username/password, we search for pHash of username.
   */
  async login(username: string, password: string): Promise<string | null> {
    const pHash = this.generatePHash(username);
    const user = await prisma.user.findUnique({
      where: { id: pHash },
    });

    if (!user || !user.encryptedData) return null;

    const encryptionKey = process.env.ENCRYPTION_KEY;
    if (!encryptionKey) throw new Error('ENCRYPTION_KEY is not defined');

    try {
      const decrypted = decryptJson(user.encryptedData, encryptionKey) as {
        username?: string;
        firstName?: string;
        lastName?: string;
        passwordHash?: string;
      };

      if (!decrypted.passwordHash || typeof decrypted.passwordHash !== 'string') return null;

      const isMatch = await bcrypt.compare(password, decrypted.passwordHash);
      if (!isMatch) return null;

      return this.generateToken(user);
    } catch (error) {
      logger.error('Login failed during decryption or comparison', error);
      return null;
    }
  }

  async register(data: {
    username: string;
    password?: string;
    firstName?: string;
    lastName?: string;
  }): Promise<string> {
    const pHash = this.generatePHash(data.username);
    const mHash = this.generateMHash(data.username);
    const encryptionKey = process.env.ENCRYPTION_KEY;
    if (!encryptionKey) throw new Error('ENCRYPTION_KEY is not defined');

    // Check if user already exists
    const existing = await prisma.user.findUnique({ where: { id: pHash } });
    if (existing) throw new Error('User already exists');

    const passwordHash = data.password ? await bcrypt.hash(data.password, 10) : null;

    const encryptedData = encryptJson(
      {
        username: data.username,
        firstName: data.firstName,
        lastName: data.lastName,
        passwordHash,
      },
      encryptionKey,
    );

    const user = await prisma.user.create({
      data: {
        id: pHash,
        mHash,
        encryptedData,
        role: 'USER',
      },
    });

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

    if (!botToken) {
      logger.error('TELEGRAM_BOT_TOKEN is not defined in environment variables');
      throw new Error('TELEGRAM_BOT_TOKEN is not defined');
    }

    // Log token info for debugging (masked for security)
    logger.info('Telegram Auth Attempt', {
      tokenLength: botToken.length,
      tokenStart: botToken.substring(0, 4),
      tokenEnd: botToken.substring(botToken.length - 4),
      envVarSource: process.env.TELEGRAM_BOT_TOKEN ? 'process.env' : 'missing',
    });

    if (!encryptionKey) throw new Error('ENCRYPTION_KEY is not defined');

    const secretKey = crypto.createHash('sha256').update(botToken).digest();
    const dataCheckString = Object.keys(userData)
      .sort((a, b) => a.localeCompare(b))
      .map((key) => `${key}=${userData[key]}`)
      .join('\n');

    const hmac = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');

    if (hmac !== hash) {
      logger.warn('Telegram hash verification failed', {
        receivedHash: hash,
        calculatedHmac: hmac,
        dataCheckString,
        botTokenHint: botToken.substring(0, 5) + '...',
        keys: Object.keys(userData),
      });
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
        // displayName: generateUsername(),
        // avatarColor: getAvatarColor(pHash),
        role: 'USER',
      },
    });

    return this.generateToken(user);
  }
}
