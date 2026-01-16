import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import sharp from 'sharp';
import crypto from 'node:crypto';
import path from 'node:path';
import logger from '../config/logger';

export class StorageService {
  private client: S3Client;
  private bucket: string;

  constructor() {
    this.bucket = process.env.S3_BUCKET || 'lugabus-media';
    this.client = new S3Client({
      endpoint: process.env.S3_ENDPOINT || 'http://minio:9000',
      region: process.env.S3_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY || 'admin',
        secretAccessKey: process.env.S3_SECRET_KEY || 'admin123',
      },
      forcePathStyle: process.env.S3_FORCE_PATH_STYLE === 'true',
    });
  }

  /**
   * Validates file buffer using file-type
   */
  private async validateMimeType(
    buffer: Buffer,
    expectedCategory: 'image' | 'any',
  ): Promise<{ mime: string; ext: string }> {
    const { fromBuffer } = await import('file-type');
    const type = await fromBuffer(buffer);

    if (!type) {
      throw new Error('Could not determine file type');
    }

    if (expectedCategory === 'image' && !type.mime.startsWith('image/')) {
      throw new Error('File is not a valid image');
    }

    return type;
  }

  /**
   * Sanitizes and uploads an image to S3
   */
  async uploadImage(buffer: Buffer, _originalName: string, folder = 'uploads'): Promise<string> {
    try {
      // 1. Validate real MIME type
      await this.validateMimeType(buffer, 'image');

      // 2. Sanitize image with Sharp
      // - rotate() saves orientation before stripping EXIF
      // - webp() strips metadata and compresses
      const sanitizedBuffer = await sharp(buffer)
        .rotate()
        .resize(1200, 1200, {
          fit: 'inside',
          withoutEnlargement: true,
        })
        .webp({ quality: 80 })
        .toBuffer();

      // 3. Generate unique anonymized filename
      const hash = crypto.randomBytes(16).toString('hex');
      const filename = `${hash}.webp`;
      const key = `${folder}/${filename}`;

      // 4. Upload to S3
      const upload = new Upload({
        client: this.client,
        params: {
          Bucket: this.bucket,
          Key: key,
          Body: sanitizedBuffer,
          ContentType: 'image/webp',
          ACL: 'public-read',
        },
      });

      await upload.done();
      return `${process.env.S3_PUBLIC_URL || process.env.S3_ENDPOINT}/${this.bucket}/${key}`;
    } catch (error) {
      logger.error('Failed to upload image', error);
      throw new Error(error instanceof Error ? error.message : 'Image upload failed');
    }
  }

  async uploadFile(
    buffer: Buffer,
    _filename: string, // Unused for security (we anonymize)
    _claimedContentType: string, // Unused for security (we validate)
    folder = 'documents',
  ): Promise<string> {
    try {
      const type = await this.validateMimeType(buffer, 'any');

      const hash = crypto.randomBytes(16).toString('hex');
      const safeName = `${hash}.${type.ext}`;
      const key = `${folder}/${safeName}`;

      const command = new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: buffer,
        ContentType: type.mime,
      });

      await this.client.send(command);
      return `${process.env.S3_PUBLIC_URL || process.env.S3_ENDPOINT}/${this.bucket}/${key}`;
    } catch (error) {
      logger.error('Failed to upload file', error);
      throw new Error(error instanceof Error ? error.message : 'File upload failed');
    }
  }
}
