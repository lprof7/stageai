import { Router } from 'express';
import { auth } from '../middlewares/auth';
import { requireRole } from '../middlewares/requireRole';
import * as applicationController from '../controllers/applicationController';

const router = Router();
router.use(auth, requireRole('student'));

router.post('/', applicationController.createApplication);
router.get('/', applicationController.listApplications);
router.get('/:id', applicationController.getApplication);

export default router;
