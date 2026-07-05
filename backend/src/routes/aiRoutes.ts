import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { auth } from '../middlewares/auth';
import { requireRole } from '../middlewares/requireRole';
import * as aiController from '../controllers/aiController';

const router = Router();

const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: { message: 'لقد تجاوزت الحد المسموح من الطلبات. حاول بعد دقيقة.' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.use(auth, requireRole('student'));
router.use(aiLimiter);

router.post('/match-advice', aiController.getMatchAdvice);
router.post('/motivation-letter', aiController.getMotivationLetter);

export default router;
