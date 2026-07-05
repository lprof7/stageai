import { Router } from 'express';
import { auth } from '../middlewares/auth';
import { requireRole } from '../middlewares/requireRole';
import * as companyApplicationController from '../controllers/companyApplicationController';

const router = Router();
router.use(auth, requireRole('company'));

router.get('/offers/:id/applications', companyApplicationController.listOfferApplications);
router.get('/applications/:id', companyApplicationController.getApplicationDetail);
router.put('/applications/:id/status', companyApplicationController.updateApplicationStatus);

export default router;
