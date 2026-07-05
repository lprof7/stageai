import { Router } from 'express';
import { auth } from '../middlewares/auth';
import { requireRole } from '../middlewares/requireRole';
import * as adminController from '../controllers/adminController';

const router = Router();
router.use(auth, requireRole('admin'));

router.get('/companies/pending', adminController.listPendingCompanies);
router.put('/companies/:id/status', adminController.updateCompanyStatus);

export default router;
