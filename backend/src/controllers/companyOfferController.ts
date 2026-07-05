import { Request, Response, NextFunction } from 'express';
import Offer from '../models/Offer';
import { createOfferSchema, updateOfferSchema } from '../utils/validators/offerValidators';

export async function listCompanyOffers(req: Request, res: Response, next: NextFunction) {
  try {
    const offers = await Offer.find({ companyId: req.user!.id }).sort({ createdAt: -1 });
    res.json(offers);
  } catch (err) {
    next(err);
  }
}

export async function createOffer(req: Request, res: Response, next: NextFunction) {
  try {
    const data = createOfferSchema.parse(req.body);
    const offer = await Offer.create({ ...data, companyId: req.user!.id });
    res.status(201).json(offer);
  } catch (err: any) {
    if (err.issues) return res.status(400).json({ message: 'Validation error', details: err.issues });
    next(err);
  }
}

export async function getCompanyOffer(req: Request, res: Response, next: NextFunction) {
  try {
    const offer = await Offer.findOne({ _id: req.params.id, companyId: req.user!.id });
    if (!offer) {
      return res.status(404).json({ message: 'Offer not found' });
    }
    res.json(offer);
  } catch (err) {
    next(err);
  }
}

export async function updateCompanyOffer(req: Request, res: Response, next: NextFunction) {
  try {
    const data = updateOfferSchema.parse(req.body);
    const offer = await Offer.findOneAndUpdate(
      { _id: req.params.id, companyId: req.user!.id },
      { $set: data },
      { new: true }
    );
    if (!offer) {
      return res.status(404).json({ message: 'Offer not found' });
    }
    res.json(offer);
  } catch (err: any) {
    if (err.issues) return res.status(400).json({ message: 'Validation error', details: err.issues });
    next(err);
  }
}
