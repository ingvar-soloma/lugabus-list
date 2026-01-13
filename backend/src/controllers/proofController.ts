import { Request, Response, NextFunction } from 'express';
import { ProofService } from '../services/proofService';
import { CreateProofBody } from '../models/types/proofTypes';

export class ProofController {
  private service = new ProofService();

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const proof = await this.service.create(req.body as CreateProofBody);
      res.status(201).json(proof);
    } catch (error) {
      next(error);
    }
  };
}
