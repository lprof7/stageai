import { z } from 'zod';

export const createCvSchema = z.object({
  name: z.string().min(1).max(100),
});

export const updateCvSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  extractedSkills: z.array(z.string()).optional(),
});
