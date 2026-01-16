import crypto from 'node:crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12;

export function encrypt(text: string, key: string): string {
  if (!key || key.length !== 64) {
    throw new Error('Encryption key must be a 64-character hex string (32 bytes)');
  }

  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(key, 'hex'), iv);

  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag().toString('hex');

  return `${iv.toString('hex')}:${authTag}:${encrypted}`;
}

export function decrypt(encryptedText: string, key: string): string {
  if (!key || key.length !== 64) {
    throw new Error('Encryption key must be a 64-character hex string (32 bytes)');
  }

  const [ivHex, authTagHex, encrypted] = encryptedText.split(':');
  if (!ivHex || !authTagHex || !encrypted) {
    throw new Error('Invalid encrypted text format');
  }

  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');
  const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(key, 'hex'), iv);

  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}

export function encryptJson(data: Record<string, unknown>, key: string): string {
  return encrypt(JSON.stringify(data), key);
}

export function decryptJson(encryptedText: string, key: string): Record<string, unknown> {
  return JSON.parse(decrypt(encryptedText, key));
}

export function hashIp(ip: string, pepper: string): string {
  if (!pepper) {
    throw new Error('IP_PEPPER is required for IP hashing');
  }
  return crypto.createHmac('sha256', pepper).update(ip).digest('hex');
}
