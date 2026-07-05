import express from 'express';
import cors from 'cors';
import { env } from './config/env';
import { errorHandler } from './middlewares/errorHandler';
import authRoutes from './routes/authRoutes';
import onboardingRoutes from './routes/onboardingRoutes';
import cvRoutes from './routes/cvRoutes';
import offerRoutes from './routes/offerRoutes';
import companyOfferRoutes from './routes/companyOfferRoutes';
import applicationRoutes from './routes/applicationRoutes';
import companyApplicationRoutes from './routes/companyApplicationRoutes';
import studentProfileRoutes from './routes/studentProfileRoutes';
import companyProfileRoutes from './routes/companyProfileRoutes';
import aiRoutes from './routes/aiRoutes';
import adminRoutes from './routes/adminRoutes';

const app = express();

app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/ai', onboardingRoutes);
app.use('/api/cvs', cvRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/company/offers', companyOfferRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/company', companyApplicationRoutes);
app.use('/api/students', studentProfileRoutes);
app.use('/api/companies', companyProfileRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/admin', adminRoutes);

app.use(errorHandler);

export default app;
