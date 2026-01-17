import {
  S3Client,
  PutObjectCommand,
  CreateBucketCommand,
  HeadBucketCommand,
  PutBucketPolicyCommand,
} from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import sharp from 'sharp';
import crypto from 'node:crypto';
import logger from '../config/logger';

export class StorageService {
  private readonly client: S3Client;
  private readonly bucket: string;
  private isInitialized = false;

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
   * lazy initializes the bucket and policy
   */
  private async initialize(): Promise<void> {
    if (this.isInitialized) return;
    await this.ensureBucketExists();
    this.isInitialized = true;
  }

  /**
   * Checks if the bucket exists and creates it if not.
   * Also sets a public read policy for the bucket.
   */
  async ensureBucketExists(): Promise<void> {
    try {
      await this.client.send(new HeadBucketCommand({ Bucket: this.bucket }));
      logger.info(`Bucket "${this.bucket}" already exists`);
    } catch (error: unknown) {
      const err = error as { name?: string; $metadata?: { httpStatusCode?: number } };
      if (err.name === 'NotFound' || err.$metadata?.httpStatusCode === 404) {
        logger.info(`Bucket "${this.bucket}" does not exist, creating...`);
        try {
          await this.client.send(new CreateBucketCommand({ Bucket: this.bucket }));

          // Set public policy so images are accessible via Browser
          const policy = {
            Version: '2012-10-17',
            Statement: [
              {
                Sid: 'PublicRead',
                Effect: 'Allow',
                Principal: '*',
                Action: ['s3:GetObject'],
                Resource: [`arn:aws:s3:::${this.bucket}/*`],
              },
            ],
          };

          await this.client.send(
            new PutBucketPolicyCommand({
              Bucket: this.bucket,
              Policy: JSON.stringify(policy),
            }),
          );

          logger.info(`Bucket "${this.bucket}" created with public-read policy`);
        } catch (createError) {
          logger.error(`Failed to create bucket "${this.bucket}"`, createError);
        }
      } else {
        logger.error(`Unexpected error checking bucket "${this.bucket}"`, error);
      }
    }
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
      await this.initialize();
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
      await this.initialize();
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
