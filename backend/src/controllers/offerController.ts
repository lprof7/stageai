import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import Offer from '../models/Offer';
import Cv from '../models/Cv';
import { computeMatch } from '../services/matchingService';

const listOffersQuerySchema = z.object({
  search: z.string().optional(),
  paymentType: z.enum(['paid', 'unpaid']).optional(),
  employmentType: z.enum(['full-time', 'part-time', 'remote']).optional(),
  cvId: z.string().optional(),
});

export async function listOffers(req: Request, res: Response, next: NextFunction) {
  try {
    const query = listOffersQuerySchema.parse(req.query);
    const { search, paymentType, employmentType, cvId } = query;
    const filter: any = { isActive: true };

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }
    if (paymentType) filter.paymentType = paymentType;
    if (employmentType) filter.employmentType = employmentType;

    let offers = await Offer.find(filter).populate('companyId', 'name logoUrl location').lean();

    if (cvId) {
      const cv = await Cv.findById(cvId);
      if (cv) {
        offers = offers.map((offer: any) => {
          const match = computeMatch(cv.extractedSkills, offer.requiredSkills || []);
          return { ...offer, ...match };
        });
        offers.sort((a: any, b: any) => b.matchPercentage - a.matchPercentage);
      }
    }

    res.json(offers);
  } catch (err) {
    next(err);
  }
}

export async function getOffer(req: Request, res: Response, next: NextFunction) {
  try {
    const { cvId } = req.query;
    const offer = await Offer.findById(req.params.id).populate('companyId', 'name logoUrl description location').lean();
    if (!offer) {
      return res.status(404).json({ message: 'Offer not found' });
    }
    const result: any = { ...offer };
    if (cvId) {
      const cv = await Cv.findById(cvId);
      if (cv) {
        const match = computeMatch(cv.extractedSkills, (offer as any).requiredSkills || []);
        Object.assign(result, match);
      }
    }
    res.json(result);
  } catch (err) {
    next(err);
  }
}
