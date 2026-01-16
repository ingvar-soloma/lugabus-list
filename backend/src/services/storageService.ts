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
   * Sanitizes and uploads an image to S3
   * Roadmap: Sanitization/Sharp (clearing metadata)
   */
  async uploadImage(buffer: Buffer, originalName: string, folder = 'uploads'): Promise<string> {
    try {
      // 1. Sanitize image with Sharp
      // - Convert to WebP for better compression
      // - Strip metadata (EXIF, etc.) to ensure privacy
      // - Resize if needed (e.g., max 1200px width/height)
      const sanitizedBuffer = await sharp(buffer)
        .rotate() // Auto-rotate based on EXIF before stripping it
        .resize(1200, 1200, {
          fit: 'inside',
          withoutEnlargement: true,
        })
        .webp({ quality: 80 })
        .toBuffer();

      // 2. Generate unique filename
      const hash = crypto.randomBytes(16).toString('hex');
      const filename = `${hash}.webp`;
      const key = `${folder}/${filename}`;

      // 3. Upload to S3
      const upload = new Upload({
        client: this.client,
        params: {
          Bucket: this.bucket,
          Key: key,
          Body: sanitizedBuffer,
          ContentType: 'image/webp',
          ACL: 'public-read', // Depends on your S3 config
        },
      });

      await upload.done();

      // 4. Return the public URL
      // If using Minio locally, this needs to be accessible from frontend
      // In prod, this would be a CloudFront/CDN URL
      const publicUrl = `${process.env.S3_PUBLIC_URL || process.env.S3_ENDPOINT}/${this.bucket}/${key}`;
      return publicUrl;
    } catch (error) {
      logger.error('Failed to upload image', error);
      throw new Error('Image upload failed');
    }
  }

  async uploadFile(
    buffer: Buffer,
    filename: string,
    contentType: string,
    folder = 'documents',
  ): Promise<string> {
    const ext = path.extname(filename);
    const hash = crypto.randomBytes(16).toString('hex');
    const safeName = `${hash}${ext}`;
    const key = `${folder}/${safeName}`;

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    });

    await this.client.send(command);
    return `${process.env.S3_PUBLIC_URL || process.env.S3_ENDPOINT}/${this.bucket}/${key}`;
  }
}
