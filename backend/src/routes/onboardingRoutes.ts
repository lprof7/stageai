import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { upload } from '../middlewares/upload';
import * as onboardingController from '../controllers/onboardingController';

const router = Router();

const onboardingLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: { message: 'لقد تجاوزت الحد المسموح من الطلبات. حاول بعد دقيقة.' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post(
  '/extract-onboarding-profile',
  onboardingLimiter,
  upload.single('pdf'),
  onboardingController.extractOnboardingProfile
);

export default router;
