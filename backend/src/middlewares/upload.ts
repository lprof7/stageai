import multer from 'multer';

const MB = 1024 * 1024;

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * MB },
  fileFilter: (_req, file, cb) => {
    const allowed = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', file.fieldname));
    }
  },
});

export function handleMulterError(err: any, _req: any, res: any, next: any) {
  if (err instanceof multer.MulterError) {
    const message = err.code === 'LIMIT_FILE_SIZE'
      ? 'حجم الملف يتجاوز 10 ميغابايت'
      : err.code === 'LIMIT_UNEXPECTED_FILE'
        ? 'نوع الملف غير مسموح. يُقبل PDF والصور فقط'
        : 'خطأ في رفع الملف';
    return res.status(400).json({ message });
  }
  next(err);
}
