import { Router } from 'express';
import { auth } from '../middlewares/auth';
import { requireRole } from '../middlewares/requireRole';
import * as studentProfileController from '../controllers/studentProfileController';

const router = Router();
router.use(auth, requireRole('student'));

router.get('/me', studentProfileController.getProfile);
router.put('/me', studentProfileController.updateProfile);

export default router;
