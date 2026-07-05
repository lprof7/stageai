import { Request, Response, NextFunction } from 'express';
import { extractTextFromPdf } from '../services/pdfExtractionService';
import { extractProfileFromText } from '../services/aiService';

export async function extractOnboardingProfile(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'PDF file is required' });
    }
    const text = await extractTextFromPdf(req.file.buffer);
    const profile = await extractProfileFromText(text);
    res.json(profile);
  } catch (err) {
    next(err);
  }
}
