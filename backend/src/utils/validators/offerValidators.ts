import { z } from 'zod';

export const createOfferSchema = z.object({
  title: z.string().min(2).max(200),
  description: z.string().min(10),
  paymentType: z.enum(['paid', 'unpaid']),
  employmentType: z.enum(['full_time', 'part_time', 'remote', 'hybrid']),
  requiredSkills: z.array(z.string()).default([]),
  durationMonths: z.number().int().positive().optional(),
  location: z.string().optional(),
});

export const updateOfferSchema = createOfferSchema.partial();
