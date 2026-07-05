import { Router } from 'express';
import { auth } from '../middlewares/auth';
import { requireRole } from '../middlewares/requireRole';
import * as companyOfferController from '../controllers/companyOfferController';

const router = Router();
router.use(auth, requireRole('company'));

router.get('/', companyOfferController.listCompanyOffers);
router.post('/', companyOfferController.createOffer);
router.get('/:id', companyOfferController.getCompanyOffer);
router.put('/:id', companyOfferController.updateCompanyOffer);

export default router;
