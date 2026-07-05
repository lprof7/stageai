import { Request, Response, NextFunction } from 'express';
import Application from '../models/Application';
import Offer from '../models/Offer';
import Cv from '../models/Cv';
import { computeMatch } from '../services/matchingService';
import { createApplicationSchema } from '../utils/validators/applicationValidators';

export async function createApplication(req: Request, res: Response, next: NextFunction) {
  try {
    const data = createApplicationSchema.parse(req.body);
    const offer = await Offer.findById(data.offerId);
    if (!offer || !offer.isActive) {
      return res.status(404).json({ message: 'Offer not found or inactive' });
    }
    const cv = await Cv.findOne({ _id: data.cvId, studentId: req.user!.id });
    if (!cv) {
      return res.status(404).json({ message: 'CV not found' });
    }
    const existing = await Application.findOne({
      studentId: req.user!.id,
      offerId: data.offerId,
    });
    if (existing) {
      return res.status(409).json({ message: 'You have already applied to this offer' });
    }
    const match = computeMatch(cv.extractedSkills, offer.requiredSkills);
    const application = await Application.create({
      studentId: req.user!.id,
      cvId: data.cvId,
      offerId: data.offerId,
      motivationLetter: data.motivationLetter,
      matchPercentageSnapshot: match.matchPercentage,
    });
    res.status(201).json(application);
  } catch (err: any) {
    if (err.issues) return res.status(400).json({ message: 'Validation error', details: err.issues });
    next(err);
  }
}

export async function listApplications(req: Request, res: Response, next: NextFunction) {
  try {
    const apps = await Application.find({ studentId: req.user!.id })
      .populate('offerId', 'title companyId paymentType employmentType')
      .populate('cvId', 'name')
      .sort({ createdAt: -1 });
    res.json(apps);
  } catch (err) {
    next(err);
  }
}

export async function getApplication(req: Request, res: Response, next: NextFunction) {
  try {
    const app = await Application.findOne({ _id: req.params.id, studentId: req.user!.id })
      .populate('offerId')
      .populate('cvId', 'name');
    if (!app) {
      return res.status(404).json({ message: 'Application not found' });
    }
    res.json(app);
  } catch (err) {
    next(err);
  }
}
