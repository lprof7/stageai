import { Request, Response, NextFunction } from 'express';
import https from 'https';
import Cv from '../models/Cv';
import { extractTextFromPdf } from '../services/pdfExtractionService';
import { extractSkillsFromText, generateImprovementTips } from '../services/aiService';
import { uploadFile, deleteFile } from '../services/uploadService';
import { createCvSchema, updateCvSchema } from '../utils/validators/cvValidators';

function downloadFile(url: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      const chunks: Buffer[] = [];
      res.on('data', (chunk: Buffer) => chunks.push(chunk));
      res.on('end', () => resolve(Buffer.concat(chunks)));
      res.on('error', reject);
    }).on('error', reject);
  });
}

export async function listCvs(req: Request, res: Response, next: NextFunction) {
  try {
    const cvs = await Cv.find({ studentId: req.user!.id }).sort({ createdAt: -1 });
    res.json(cvs);
  } catch (err) {
    console.error('[cvController] listCvs error:', err);
    next(err);
  }
}

export async function createCv(req: Request, res: Response, next: NextFunction) {
  try {
    const { name } = createCvSchema.parse(req.body);
    if (!req.file) {
      return res.status(400).json({ message: 'PDF file is required' });
    }
    const { url: fileUrl, fileId } = await uploadFile(req.file.buffer, `${req.user!.id}_${name}.pdf`, 'cvs');

    const text = await extractTextFromPdf(req.file.buffer);

    const skills = text ? await extractSkillsFromText(text) : [];
    const tips = skills.length > 0 ? await generateImprovementTips(skills, text) : '';

    if (text && skills.length === 0) {
      await deleteFile(fileId);
      return res.status(400).json({ message: 'فشل استخراج المهارات بواسطة الذكاء الاصطناعي. حاول مرة أخرى.' });
    }

    const cvDoc = await Cv.create({
      studentId: req.user!.id,
      name,
      fileUrl,
      fileId,
      extractedSkills: skills,
      improvementTips: tips,
    });

    const cv = cvDoc.toObject();
    res.status(201).json(cv);
  } catch (err: any) {
    console.error('[cvController] createCv error:', err);
    if (err.issues) return res.status(400).json({ message: 'Validation error', details: err.issues });
    next(err);
  }
}

export async function reprocessCv(req: Request, res: Response, next: NextFunction) {
  try {
    const cv = await Cv.findOne({ _id: req.params.id, studentId: req.user!.id });
    if (!cv) {
      return res.status(404).json({ message: 'CV not found' });
    }
    const buffer = await downloadFile(cv.fileUrl);
    const text = await extractTextFromPdf(buffer);
    if (!text) {
      return res.status(400).json({ message: 'تعذر استخراج النص من ملف PDF. حاول رفع الملف مرة أخرى.' });
    }
    const skills = await extractSkillsFromText(text);
    if (skills.length === 0) {
      return res.status(400).json({ message: 'فشل استخراج المهارات بواسطة الذكاء الاصطناعي. حاول مرة أخرى.' });
    }
    const tips = await generateImprovementTips(skills, text);
    cv.extractedSkills = skills;
    cv.improvementTips = tips;
    await cv.save();
    res.json(cv);
  } catch (err) {
    console.error('[cvController] reprocessCv error:', err);
    next(err);
  }
}

export async function getCv(req: Request, res: Response, next: NextFunction) {
  try {
    const cv = await Cv.findOne({ _id: req.params.id, studentId: req.user!.id });
    if (!cv) {
      return res.status(404).json({ message: 'CV not found' });
    }
    res.json(cv);
  } catch (err) {
    console.error('[cvController] getCv error:', err);
    next(err);
  }
}

export async function updateCv(req: Request, res: Response, next: NextFunction) {
  try {
    const data = updateCvSchema.parse(req.body);
    const cv = await Cv.findOne({ _id: req.params.id, studentId: req.user!.id });
    if (!cv) {
      return res.status(404).json({ message: 'CV not found' });
    }
    if (data.name !== undefined) cv.name = data.name;
    if (data.extractedSkills !== undefined) {
      cv.extractedSkills = data.extractedSkills;
      cv.improvementTips = await generateImprovementTips(data.extractedSkills);
    }
    await cv.save();
    res.json(cv);
  } catch (err: any) {
    console.error('[cvController] updateCv error:', err);
    if (err.issues) return res.status(400).json({ message: 'Validation error', details: err.issues });
    next(err);
  }
}

export async function deleteCv(req: Request, res: Response, next: NextFunction) {
  try {
    const cv = await Cv.findOne({ _id: req.params.id, studentId: req.user!.id });
    if (!cv) {
      return res.status(404).json({ message: 'CV not found' });
    }
    if (cv.fileId) {
      await deleteFile(cv.fileId);
    } else {
      console.warn('[cvController] deleteCv: no fileId stored for CV, skipping ImageKit deletion');
    }
    await Cv.deleteOne({ _id: cv._id });
    res.json({ message: 'CV deleted' });
  } catch (err) {
    console.error('[cvController] deleteCv error:', err);
    next(err);
  }
}
