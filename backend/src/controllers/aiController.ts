import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import Cv from '../models/Cv';
import Offer from '../models/Offer';
import Student from '../models/Student';
import { generateMatchAdvice, generateMotivationLetter } from '../services/aiService';
import { computeMatch } from '../services/matchingService';

const matchAdviceSchema = z.object({
  cvId: z.string().min(1, 'cvId is required'),
  offerId: z.string().min(1, 'offerId is required'),
});
const motivationLetterSchema = z.object({
  cvId: z.string().min(1, 'cvId is required'),
  offerId: z.string().min(1, 'offerId is required'),
});

export async function getMatchAdvice(req: Request, res: Response, next: NextFunction) {
  try {
    const { cvId, offerId } = matchAdviceSchema.parse(req.body);
    const cv = await Cv.findOne({ _id: cvId, studentId: req.user!.id });
    if (!cv) return res.status(404).json({ message: 'CV not found' });
    const offer = await Offer.findById(offerId);
    if (!offer) return res.status(404).json({ message: 'Offer not found' });
    const advice = await generateMatchAdvice(
      cv.extractedSkills,
      offer.requiredSkills,
      offer.description
    );
    res.json({ advice });
  } catch (err: any) {
    if (err.issues) return res.status(400).json({ message: 'Validation error', details: err.issues });
    next(err);
  }
}

export async function getMotivationLetter(req: Request, res: Response, next: NextFunction) {
  try {
    const { cvId, offerId } = motivationLetterSchema.parse(req.body);
    console.log('[aiController] getMotivationLetter: cvId=%s, offerId=%s', cvId, offerId);
    const cv = await Cv.findOne({ _id: cvId, studentId: req.user!.id });
    if (!cv) {
      console.warn('[aiController] CV not found for cvId=%s, studentId=%s', cvId, req.user!.id);
      return res.status(404).json({ message: 'CV not found' });
    }
    console.log('[aiController] CV found: extractedSkills=%s', JSON.stringify(cv.extractedSkills));
    const offer = await Offer.findById(offerId).populate('companyId');
    if (!offer) {
      console.warn('[aiController] Offer not found for offerId=%s', offerId);
      return res.status(404).json({ message: 'Offer not found' });
    }
    console.log('[aiController] Offer found: title=%s, description length=%d', offer.title, offer.description?.length);
    const student = await Student.findById(req.user!.id);
    if (!student) {
      console.warn('[aiController] Student not found for id=%s', req.user!.id);
      return res.status(404).json({ message: 'Student not found' });
    }
    console.log('[aiController] Student found: fullName=%s, bio=%s', student.fullName, student.bio || '(empty)');
    const company = (offer as any).companyId || {};
    console.log('[aiController] Company name=%s', company.name || '(empty)');
    const letter = await generateMotivationLetter(
      student.fullName,
      student.bio || '',
      cv.extractedSkills,
      offer.title,
      offer.description,
      company.name || ''
    );
    console.log('[aiController] generateMotivationLetter returned letter length=%d, first 100 chars=%s', letter?.length || 0, (letter || '').substring(0, 100));
    res.json({ letter });
  } catch (err: any) {
    console.error('[aiController] getMotivationLetter error:', err);
    if (err.issues) return res.status(400).json({ message: 'Validation error', details: err.issues });
    next(err);
  }
}
