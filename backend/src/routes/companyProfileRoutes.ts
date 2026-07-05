import { Router } from 'express';
import { auth } from '../middlewares/auth';
import { requireRole } from '../middlewares/requireRole';
import * as companyProfileController from '../controllers/companyProfileController';

const router = Router();

// Protected /me routes must come before :id so "me" isn't captured as an id
router.get('/me', auth, requireRole('company'), companyProfileController.getMyProfile);
router.put('/me', auth, requireRole('company'), companyProfileController.updateMyProfile);

// Public route - anyone can view a company's public profile
router.get('/:id', companyProfileController.getPublicProfile);

export default router;
