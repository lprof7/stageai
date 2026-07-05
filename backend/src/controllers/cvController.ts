import { Request, Response, NextFunction } from 'express';
import Cv from '../models/Cv';
import { extractTextFromPdf } from '../services/pdfExtractionService';
import { extractSkillsFromText, generateImprovementTips } from '../services/aiService';
import { uploadFile, deleteFile } from '../services/uploadService';
import { createCvSchema, updateCvSchema } from '../utils/validators/cvValidators';

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
    console.log(`[cvController] createCv: file uploaded to ImageKit: ${fileUrl} (fileId=${fileId})`);

    const text = await extractTextFromPdf(req.file.buffer);
    console.log(`[cvController] createCv: PDF text extracted, length=${text.length} chars`);
    if (!text) {
      console.error('[cvController] createCv: PDF text extraction returned empty — check pdf-parse or file content');
    }

    const skills = text ? await extractSkillsFromText(text) : [];
    console.log(`[cvController] createCv: AI extracted ${skills.length} skills: [${skills.join(', ')}]`);
    if (text && skills.length === 0) {
      console.error('[cvController] createCv: AI returned empty skills array — check Groq API key, model, or prompt');
    }

    const tips = skills.length > 0 ? await generateImprovementTips(skills, text) : '';
    console.log(`[cvController] createCv: AI tips generated, length=${tips.length} chars`);

    const warnings: string[] = [];
    if (!text) warnings.push('تعذر استخراج النص من ملف PDF — قد لا تكون المهارات مستخرجة');
    if (text && skills.length === 0) warnings.push('تعذر استخراج المهارات بواسطة الذكاء الاصطناعي — يمكنك إضافتها يدوياً');

    const cvDoc = await Cv.create({
      studentId: req.user!.id,
      name,
      fileUrl,
      fileId,
      extractedSkills: skills,
      improvementTips: tips,
    });
    console.log(`[cvController] createCv: CV saved to MongoDB, id=${cvDoc._id}${warnings.length ? `, warnings=${JSON.stringify(warnings)}` : ''}`);

    const cv = cvDoc.toObject();
    res.status(201).json({ ...cv, warnings });
  } catch (err: any) {
    console.error('[cvController] createCv error:', err);
    if (err.issues) return res.status(400).json({ message: 'Validation error', details: err.issues });
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
