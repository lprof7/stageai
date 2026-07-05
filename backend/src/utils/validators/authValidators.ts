import { z } from 'zod';

export const registerStudentSchema = z.object({
  fullName: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(6).max(100),
  onboardingMethod: z.enum(['upload', 'manual']),
  phone: z.string().optional(),
  location: z.string().optional(),
  education: z.string().optional(),
  bio: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const registerCompanySchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(6).max(100),
  description: z.string().optional(),
  location: z.string().optional(),
});
