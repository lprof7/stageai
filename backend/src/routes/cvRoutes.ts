import { Router } from 'express';
import { auth } from '../middlewares/auth';
import { requireRole } from '../middlewares/requireRole';
import { upload, handleMulterError } from '../middlewares/upload';
import * as cvController from '../controllers/cvController';

const router = Router();
router.use(auth, requireRole('student'));

router.get('/', cvController.listCvs);
router.post('/', upload.single('pdf'), cvController.createCv, handleMulterError);
router.get('/:id', cvController.getCv);
router.put('/:id', cvController.updateCv);
router.delete('/:id', cvController.deleteCv);

export default router;
