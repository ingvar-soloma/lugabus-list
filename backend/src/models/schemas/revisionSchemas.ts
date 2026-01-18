import { z } from 'zod';
import { EvidenceType, Polarity } from '@prisma/client';

export const createRevisionSchema = z.object({
  body: z.object({
    personId: z.string().min(1),
    proposedData: z.record(z.string(), z.any()),
    reason: z.string().max(1000).optional(),
    evidences: z
      .array(
        z.object({
          url: z.string().url(),
          title: z.string().max(255).optional(),
          type: z.nativeEnum(EvidenceType).default(EvidenceType.LINK),
          polarity: z.nativeEnum(Polarity).default(Polarity.SUPPORT),
        }),
      )
      .optional(),
  }),
});

export const getRevisionByIdSchema = z.object({
  params: z.object({
    revisionId: z.string().uuid(),
  }),
});

export const getHistorySchema = z.object({
  params: z.object({
    personId: z.string().min(1),
  }),
});

export const approveRevisionSchema = z.object({
  params: z.object({
    revisionId: z.string().uuid(),
  }),
  body: z.object({
    aiScore: z.number().min(0).max(100).optional(),
    comment: z.string().max(500).optional(),
  }),
});

export const rejectRevisionSchema = z.object({
  params: z.object({
    revisionId: z.string().uuid(),
  }),
  body: z.object({
    reason: z.string().min(1).max(500),
  }),
});
export const voteSchema = z.object({
  params: z.object({
    revisionId: z.string().uuid(),
  }),
});

export const processBatchSchema = z.object({
  body: z.object({
    limit: z.number().int().positive().default(10),
  }),
});
