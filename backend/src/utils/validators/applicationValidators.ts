import { z } from 'zod';

export const createApplicationSchema = z.object({
  cvId: z.string(),
  offerId: z.string(),
  motivationLetter: z.string().min(10),
});

export const updateApplicationStatusSchema = z.object({
  status: z.enum(['accepted', 'rejected']),
});
