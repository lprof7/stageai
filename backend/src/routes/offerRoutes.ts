import { Router } from 'express';
import { auth } from '../middlewares/auth';
import { requireRole } from '../middlewares/requireRole';
import * as offerController from '../controllers/offerController';

const router = Router();
router.use(auth, requireRole('student'));

router.get('/', offerController.listOffers);
router.get('/:id', offerController.getOffer);

export default router;
