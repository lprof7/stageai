import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import Company from '../models/Company';

export async function listPendingCompanies(req: Request, res: Response, next: NextFunction) {
  try {
    const companies = await Company.find({ status: 'pending' }).select('-passwordHash');
    res.json(companies);
  } catch (err) {
    next(err);
  }
}

export async function updateCompanyStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const { status } = req.body;
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Status must be "approved" or "rejected"' });
    }
    if (!Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid company ID' });
    }
    const company = await Company.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).select('-passwordHash');
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    res.json(company);
  } catch (err) {
    next(err);
  }
}
