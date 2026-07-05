import { Request, Response, NextFunction } from 'express';
import Company from '../models/Company';
import Offer from '../models/Offer';
import { z } from 'zod';

const updateProfileSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  description: z.string().optional(),
  location: z.string().optional(),
  logoUrl: z.string().optional(),
});

export async function getMyProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const company = await Company.findById(req.user!.id).select('-passwordHash');
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    res.json(company);
  } catch (err) {
    next(err);
  }
}

export async function updateMyProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const data = updateProfileSchema.parse(req.body);
    const company = await Company.findByIdAndUpdate(req.user!.id, { $set: data }, { new: true }).select('-passwordHash');
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    res.json(company);
  } catch (err: any) {
    if (err.issues) return res.status(400).json({ message: 'Validation error', details: err.issues });
    next(err);
  }
}

export async function getPublicProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const company = await Company.findById(req.params.id).select('name description location logoUrl');
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    const offers = await Offer.find({ companyId: company._id, isActive: true });
    res.json({ company, offers });
  } catch (err) {
    next(err);
  }
}
