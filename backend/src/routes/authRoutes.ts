import { Router } from 'express';
import * as authController from '../controllers/authController';

const router = Router();

router.post('/student/register', authController.registerStudent);
router.post('/student/login', authController.loginStudent);
router.post('/company/register', authController.registerCompany);
router.post('/company/login', authController.loginCompany);

export default router;
