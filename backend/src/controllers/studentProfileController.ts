import { Request, Response, NextFunction } from 'express';
import Student from '../models/Student';
import { z } from 'zod';

const updateProfileSchema = z.object({
  fullName: z.string().min(2).max(100).optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
  education: z.string().optional(),
  bio: z.string().optional(),
  profilePictureUrl: z.string().optional(),
});

export async function getProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const student = await Student.findById(req.user!.id).select('-passwordHash');
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(student);
  } catch (err) {
    next(err);
  }
}

export async function updateProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const data = updateProfileSchema.parse(req.body);
    const student = await Student.findByIdAndUpdate(req.user!.id, { $set: data }, { new: true }).select('-passwordHash');
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(student);
  } catch (err: any) {
    if (err.issues) return res.status(400).json({ message: 'Validation error', details: err.issues });
    next(err);
  }
}
