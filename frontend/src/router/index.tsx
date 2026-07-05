import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AuthLayout } from '../view/shared/layouts/AuthLayout';
import { StudentLayout } from '../view/shared/layouts/StudentLayout';
import { CompanyLayout } from '../view/shared/layouts/CompanyLayout';
import { StudentLoginPage } from '../view/auth/student/LoginPage';
import { StudentSignupPage } from '../view/auth/student/SignupPage';
import { CompanyLoginPage } from '../view/auth/company/LoginPage';
import { CompanySignupPage } from '../view/auth/company/SignupPage';
import { PendingApprovalPage } from '../view/auth/company/PendingApprovalPage';
import { OnboardingChoicePage } from '../view/student/onboarding/OnboardingChoicePage';
import { UploadReviewPage } from '../view/student/onboarding/UploadReviewPage';
import { ManualFormPage } from '../view/student/onboarding/ManualFormPage';
import { CVListPage } from '../view/student/cv-management/CVListPage';
import { CVDetailPage } from '../view/student/cv-management/CVDetailPage';
import { BrowseOffersPage } from '../view/student/offers/BrowseOffersPage';
import { OfferDetailPage } from '../view/student/offers/OfferDetailPage';
import { CompanyPublicProfilePage } from '../view/student/offers/CompanyPublicProfilePage';
import { ApplicationListPage } from '../view/student/applications/ApplicationListPage';
import { ApplicationDetailPage } from '../view/student/applications/ApplicationDetailPage';
import { ApplyFlowPage } from '../view/student/applications/ApplyFlowPage';
import { StudentProfilePage } from '../view/student/profile/ProfilePage';
import { CompanyOfferListPage } from '../view/company/offers/OfferListPage';
import { OfferCreatePage } from '../view/company/offers/OfferCreatePage';
import { CompanyOfferDetailPage } from '../view/company/offers/OfferDetailPage';
import { CompanyApplicationsPage } from '../view/company/applications/CompanyApplicationsPage';
import { OfferApplicationsPage } from '../view/company/applications/OfferApplicationsPage';
import { ApplicationReviewPage } from '../view/company/applications/ApplicationReviewPage';
import { CompanyProfilePage } from '../view/company/profile/ProfilePage';
import { PendingCompaniesPage } from '../view/admin/PendingCompaniesPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/auth/student/login" replace />,
  },
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      { path: 'student/login', element: <StudentLoginPage /> },
      { path: 'student/signup', element: <StudentSignupPage /> },
      { path: 'company/login', element: <CompanyLoginPage /> },
      { path: 'company/signup', element: <CompanySignupPage /> },
      { path: 'company/pending', element: <PendingApprovalPage /> },
    ],
  },
  {
    path: '/student/onboarding',
    element: <AuthLayout />,
    children: [
      { path: 'choice', element: <OnboardingChoicePage /> },
      { path: 'upload', element: <UploadReviewPage /> },
      { path: 'manual', element: <ManualFormPage /> },
    ],
  },
  {
    path: '/student',
    element: <StudentLayout />,
    children: [
      { path: 'cvs', element: <CVListPage /> },
      { path: 'cvs/:id', element: <CVDetailPage /> },
      { path: 'offers', element: <BrowseOffersPage /> },
      { path: 'offers/:id', element: <OfferDetailPage /> },
      { path: 'companies/:id', element: <CompanyPublicProfilePage /> },
      { path: 'applications', element: <ApplicationListPage /> },
      { path: 'applications/:id', element: <ApplicationDetailPage /> },
      { path: 'applications/apply', element: <ApplyFlowPage /> },
      { path: 'profile', element: <StudentProfilePage /> },
    ],
  },
  {
    path: '/company',
    element: <CompanyLayout />,
    children: [
      { path: 'offers', element: <CompanyOfferListPage /> },
      { path: 'offers/create', element: <OfferCreatePage /> },
      { path: 'offers/:id', element: <CompanyOfferDetailPage /> },
      { path: 'offers/:id/applications', element: <OfferApplicationsPage /> },
      { path: 'applications', element: <CompanyApplicationsPage /> },
      { path: 'applications/:id', element: <ApplicationReviewPage /> },
      { path: 'profile', element: <CompanyProfilePage /> },
    ],
  },
  {
    path: '/admin',
    element: <PendingCompaniesPage />,
  },
]);
