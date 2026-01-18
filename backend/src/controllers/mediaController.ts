import { Request, Response } from 'express';
import { StorageService } from '../services/storageService';
import logger from '../config/logger';

export class MediaController {
  private readonly storageService: StorageService;

  constructor() {
    this.storageService = new StorageService();
  }

  upload = async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      const { buffer, originalname, mimetype } = req.file;
      let url: string;

      if (mimetype.startsWith('image/')) {
        url = await this.storageService.uploadImage(buffer, originalname);
      } else {
        url = await this.storageService.uploadFile(buffer, originalname, mimetype);
      }

      return res.status(201).json({ url });
    } catch (error) {
      logger.error('Upload handler error', error);
      return res.status(500).json({ message: 'Internal server error during upload' });
    }
  };
}
