import { Request, Response, NextFunction } from 'express';
import Application from '../models/Application';
import Offer from '../models/Offer';
import { updateApplicationStatusSchema } from '../utils/validators/applicationValidators';

export async function listOfferApplications(req: Request, res: Response, next: NextFunction) {
  try {
    const { status } = req.query;
    const offer = await Offer.findOne({ _id: req.params.id, companyId: req.user!.id });
    if (!offer) {
      return res.status(404).json({ message: 'Offer not found' });
    }
    const filter: any = { offerId: req.params.id };
    if (status) filter.status = status;
    const apps = await Application.find(filter)
      .populate('studentId', 'fullName email bio location education')
      .sort({ matchPercentageSnapshot: -1 });
    res.json(apps);
  } catch (err) {
    next(err);
  }
}

export async function getApplicationDetail(req: Request, res: Response, next: NextFunction) {
  try {
    const app = await Application.findById(req.params.id)
      .populate('studentId', 'fullName email bio location education profilePictureUrl')
      .populate('cvId', 'name extractedSkills')
      .populate('offerId', 'title description requiredSkills');
    if (!app) {
      return res.status(404).json({ message: 'Application not found' });
    }
    const offer = await Offer.findOne({ _id: app.offerId, companyId: req.user!.id });
    if (!offer) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    res.json(app);
  } catch (err) {
    next(err);
  }
}

export async function updateApplicationStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const { status } = updateApplicationStatusSchema.parse(req.body);
    const app = await Application.findById(req.params.id);
    if (!app) {
      return res.status(404).json({ message: 'Application not found' });
    }
    const offer = await Offer.findOne({ _id: app.offerId, companyId: req.user!.id });
    if (!offer) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    app.status = status;
    await app.save();
    res.json(app);
  } catch (err: any) {
    if (err.issues) return res.status(400).json({ message: 'Validation error', details: err.issues });
    next(err);
  }
}
