# StageAI (InternMatch AI) — خطة سير المشروع

> **تاريخ البدء:** 26 يونيو 2026  
> **الحالة العامة:** ✅ تم إنجاز الأطوار 1-10 (الهيكلة، المصادقة، الخدمات، التحكمات، المسارات، الواجهات، البذور)

---

## نظرة عامة

**StageAI** هو منصة ذكاء اصطناعي تربط الطلاب بالشركات للتدريب الداخلي (*stages*) عبر مطابقة آلية قائمة على المهارات مع شرح واضح لنتائج المطابقة. يستخدم Groq API لاستخراج البيانات من السير الذاتية وإنشاء النصوص، و ImageKit لتخزين الملفات، و MongoDB للتخزين.

---

## هيكل المهام

| الطور | الوصف | الحالة |
|-------|-------|--------|
| 1 | الهيكلة الأساسية (Scaffolding) | ✅ تم |
| 2 | نظام المصادقة (Authentication) | ✅ تم |
| 3 | تسجيل الطلاب (Student Onboarding) | ✅ تم |
| 4 | إدارة السير الذاتية (CV Management) | ✅ تم |
| 5 | إدارة عروض الشركات (Offer Management) | ✅ تم |
| 6 | تصفح العروض + محرك المطابقة (Browse + Matching) | ✅ تم |
| 7 | نظام التقديمات (Applications Flow) | ✅ تم |
| 8 | إدارة الملف الشخصي (Profile Management) | ✅ تم |
| 9 | لوحة المشرف (Admin Approval) | ✅ تم |
| 10 | بيانات البذور (Seed Script) | ✅ تم |
| 11 | التحسينات النهائية (Polish) | 🟡 قيد التنفيذ |
| 12 | إعدادات النشر (Deployment) | ⬜ لم يبدأ |

---

## ✅ الطور 1: الهيكلة الأساسية (Scaffolding)

### Backend
- [x] إنشاء هيكل مجلدات `/backend` حسب القسم 4.2
- [x] تهيئة `package.json` مع الاعتماديات
- [x] إعداد `tsconfig.json`
- [x] إنشاء `backend/src/config/env.ts` — قراءة `process.env` مع fail fast
- [x] إنشاء `backend/src/config/db.ts` — اتصال Mongoose بقاعدة MongoDB Atlas
- [x] إنشاء `backend/src/config/groq.ts` — تهيئة عميل Groq
- [x] إنشاء `backend/src/config/imagekit.ts` — تهيئة عميل ImageKit
- [x] إنشاء `backend/src/middlewares/errorHandler.ts` — معالجة الأخطاء المركزية
- [x] إنشاء `backend/src/middlewares/auth.ts` — التحقق من JWT
- [x] إنشاء `backend/src/middlewares/requireRole.ts` — حماية المسارات حسب الدور
- [x] إنشاء `backend/src/middlewares/upload.ts` — Multer للتخزين المؤقت
- [x] إنشاء `backend/src/app.ts` — إعداد Express (CORS, JSON, routes, error handler)
- [x] إنشاء `backend/src/server.ts` — تشغيل الخادم
- [x] إنشاء `backend/.env.example` — نموذج المتغيرات البيئية
- [x] إنشاء `backend/vercel.json` — إعدادات النشر على Vercel

### Frontend
- [x] إنشاء مشروع Vite + React + TypeScript في `/frontend`
- [x] إنشاء هيكل المجلدات حسب القسم 4.1
- [x] تثبيت الاعتماديات
- [x] إنشاء `frontend/src/i18n/ar.json` — ملف اللغة العربية (الافتراضي)
- [x] إنشاء `frontend/src/i18n/fr.json` — ملف اللغة الفرنسية (هيكل أولي)
- [x] إنشاء `frontend/src/i18n/en.json` — ملف اللغة الإنجليزية (هيكل أولي)
- [x] إنشاء `frontend/src/i18n/index.ts` — إعداد i18n مع RTL/LTR
- [x] إنشاء `frontend/src/themes/tokens.ts` — رموز الألوان والمسافات
- [x] إنشاء `frontend/src/themes/theme.css` — ملف CSS للمظهر
- [x] إنشاء `frontend/src/data/api/httpClient.ts` — Axios instance مع auth interceptor
- [x] إنشاء `frontend/src/data/models/` — أنواع TypeScript لكل كيان
- [x] إنشاء `frontend/src/router/index.tsx` — إعداد التوجيه
- [x] إنشاء `frontend/src/context/AuthContext.tsx` — حالة المصادقة
- [x] إنشاء `frontend/src/view/shared/layouts/AuthLayout.tsx` — تخطيط صفحة المصادقة
- [x] إنشاء `frontend/src/view/shared/layouts/StudentLayout.tsx` — تخطيط صفحة الطالب
- [x] إنشاء `frontend/src/view/shared/layouts/CompanyLayout.tsx` — تخطيط صفحة الشركة
- [x] إنشاء `frontend/src/view/shared/components/` — المكونات المشتركة (Button, Input, Modal, Card, MatchGauge, Badge, SkillChip, EmptyState, Toast, Loader, FilterBar)
- [x] إنشاء `frontend/src/App.tsx` — نقطة الدخول
- [x] إنشاء `frontend/src/main.tsx` — نقطة التشغيل
- [x] إنشاء `frontend/.env.example`
- [x] دعم RTL عبر `dir="rtl"` في `index.html`

---

## ✅ الطور 2: نظام المصادقة (Authentication)

### Backend
- [x] إنشاء موديل `Student` (Mongoose schema)
- [x] إنشاء موديل `Company` (Mongoose schema)
- [x] إنشاء `backend/src/services/authService.ts` — دوال التسجيل وتسجيل الدخول مع bcrypt
- [x] إنشاء `backend/src/controllers/authController.ts`
- [x] إنشاء `backend/src/routes/authRoutes.ts`
- [x] إنشاء `backend/src/utils/validators/authValidators.ts` — Zod schemas للمصادقة
- [x] إضافة route guards: `requireRole('student')` و `requireRole('company')` و `requireRole('admin')`
- [x] إضافة فحص حالة الشركة (pending → رسالة المنع)

### Frontend
- [x] إنشاء `frontend/src/view/auth/student/LoginPage.tsx`
- [x] إنشاء `frontend/src/view/auth/student/SignupPage.tsx`
- [x] إنشاء `frontend/src/view/auth/company/LoginPage.tsx`
- [x] إنشاء `frontend/src/view/auth/company/SignupPage.tsx`
- [x] إنشاء `frontend/src/data/repositories/authRepository.ts`
- [x] ربط AuthContext مع JWT token
- [x] إضافة التوجيه الشرطي

---

## ✅ الطور 3: تسجيل الطلاب (Student Onboarding)

### Backend
- [x] إنشاء موديل `Cv` (Mongoose schema)
- [x] إنشاء `backend/src/services/pdfExtractionService.ts`
- [x] إنشاء `backend/src/services/aiService.ts` — دالة استخراج الملف الشخصي (6.2a)
- [x] إنشاء `backend/src/services/uploadService.ts` — رفع الملفات إلى ImageKit
- [x] إنشاء endpoint: `POST /api/ai/extract-onboarding-profile`
- [x] إنشاء `backend/src/controllers/onboardingController.ts`
- [x] إنشاء `backend/src/routes/onboardingRoutes.ts`

### Frontend
- [x] إنشاء شاشة اختيار: `OnboardingChoicePage.tsx`
- [x] إنشاء شاشة رفع PDF ومراجعة: `UploadReviewPage.tsx`
- [x] إنشاء شاشة تعبئة يدوية: `ManualFormPage.tsx`
- [x] إنشاء `frontend/src/data/repositories/studentRepository.ts`
- [x] ربط واجهة رفع PDF مع معاينة البيانات المستخرجة

---

## ✅ الطور 4: إدارة السير الذاتية (CV Management)

### Backend
- [x] إضافة دوال AI لاستخراج المهارات (6.2b) في `aiService.ts`
- [x] إضافة دالة AI لنصائح التحسين (6.2c) في `aiService.ts`
- [x] إنشاء `backend/src/controllers/cvController.ts`: CRUD كامل
- [x] إنشاء `backend/src/routes/cvRoutes.ts`
- [x] إضافة Zod validators للسير الذاتية

### Frontend
- [x] إنشاء `CVListPage.tsx` — قائمة السير الذاتية
- [x] إنشاء `CVAddModal.tsx` — إضافة سيرة ذاتية (رفع PDF + استخراج مهارات)
- [x] إنشاء `CVDetailPage.tsx` — عرض/تعديل/حذف مع محرر المهارات ونصائح التحسين

---

## ✅ الطور 5: إدارة عروض الشركات (Offer Management)

### Backend
- [x] إنشاء موديل `Offer` (Mongoose schema)
- [x] إنشاء `backend/src/controllers/companyOfferController.ts`
- [x] إنشاء `backend/src/routes/companyOfferRoutes.ts`
- [x] إنشاء `backend/src/utils/validators/offerValidators.ts`

### Frontend
- [x] إنشاء `OfferListPage.tsx` — قائمة العروض
- [x] إنشاء `OfferCreatePage.tsx` — إنشاء عرض
- [x] إنشاء `OfferDetailPage.tsx` — تفاصيل/تعديل العرض

---

## ✅ الطور 6: تصفح العروض + محرك المطابقة (Browse Offers + Matching Engine)

### Backend
- [x] إنشاء `matchingService.ts` — محرك المطابقة (القسم 6.1) مع `matchPercentage`, `matchedSkills`, `missingSkills`
- [x] إنشاء `skillNormalizer.ts` — تطبيع المهارات مع خريطة المرادفات
- [x] إنشاء endpoint: `GET /offers` — مع فلترة وترتيب حسب المطابقة
- [x] إنشاء endpoint: `GET /offers/:id` — مع تحليل المطابقة
- [x] إنشاء endpoint: `POST /ai/match-advice` — نصائح AI (6.2d)
- [x] إنشاء `offerController.ts` و `offerRoutes.ts`

### Frontend
- [x] إنشاء `BrowseOffersPage.tsx` — بحث، فلترة (حسب CV، نوع الدفع، نوع التوظيف)، ترتيب حسب المطابقة
- [x] إنشاء `FilterBar.tsx` — مكون فلترة عام
- [x] إنشاء `OfferDetailPage.tsx` — تفاصيل مع MatchGauge، المهارات المتطابقة/المفقودة ✅❌، نصيحة AI
- [x] إنشاء `MatchGauge.tsx` — عداد دائري ملون (أخضر→أحمر حسب النسبة)
- [x] إنشاء `CompanyPublicProfilePage.tsx` — الملف العام للشركة

---

## ✅ الطور 7: نظام التقديمات (Applications Flow)

### Backend
- [x] إنشاء موديل `Application` (Mongoose schema)
- [x] إضافة دالة AI لكتابة رسالة التحفيز (6.2e) في `aiService.ts`
- [x] إنشاء endpoint: `POST /ai/motivation-letter`
- [x] إنشاء endpoint: `POST /applications` — تقديم طلب (مع منع التكرار)
- [x] إنشاء endpoint: `GET /applications` و `GET /applications/:id`
- [x] إنشاء endpoint: `GET /company/offers/:id/applications` — قائمة المتقدمين (مرتبة حسب المطابقة)
- [x] إنشاء endpoint: `GET /company/applications/:id` — تفاصيل الطلب
- [x] إنشاء endpoint: `PUT /company/applications/:id/status` — قبول/رفض
- [x] إنشاء `applicationController.ts`, `companyApplicationController.ts`
- [x] إنشاء `applicationRoutes.ts`, `companyApplicationRoutes.ts`
- [x] إنشاء `applicationValidators.ts`

### Frontend
- [x] إنشاء `ApplicationListPage.tsx` — قائمة التقديمات مع الحالة
- [x] إنشاء `ApplicationDetailPage.tsx` — تفاصيل التقديم
- [x] إنشاء `ApplyFlowPage.tsx` — توليد رسالة تحفيز + تأكيد التقديم
- [x] إنشاء `CompanyApplicationsPage.tsx` — اختيار العرض
- [x] إنشاء `OfferApplicationsPage.tsx` — قائمة المتقدمين مع فلترة
- [x] إنشاء `ApplicationReviewPage.tsx` — مراجعة طلب مع قبول/رفض
- [x] إنشاء `applicationRepository.ts`

---

## ✅ الطور 8: إدارة الملف الشخصي (Profile Management)

### Backend
- [x] إنشاء `GET /students/me` و `PUT /students/me`
- [x] إنشاء `GET /companies/me` و `PUT /companies/me`
- [x] إنشاء `GET /companies/:id` — الملف العام للشركة
- [x] إنشاء `studentProfileController.ts` و `companyProfileController.ts`

### Frontend
- [x] إنشاء `frontend/src/view/student/profile/ProfilePage.tsx`
- [x] إنشاء `frontend/src/view/company/profile/ProfilePage.tsx`

---

## ✅ الطور 9: لوحة المشرف (Admin Approval)

### Backend
- [x] إنشاء `GET /admin/companies/pending`
- [x] إنشاء `PUT /admin/companies/:id/status`
- [x] إنشاء `adminController.ts` و `adminRoutes.ts`

### Frontend
- [x] إنشاء `PendingCompaniesPage.tsx` — قائمة الشركات المعلقة مع أزرار قبول/رفض
- [x] إضافة المسار `/admin` في التوجيه

---

## ✅ الطور 10: بيانات البذور (Seed Script)

### Backend
- [x] تثبيت `@faker-js/faker`
- [x] إنشاء `backend/src/seed/seed.ts` يحتوي على:
  - [x] مشرف واحد (admin@stageai.dz / admin123)
  - [x] 18 طالب بأسماء جزائرية (Yasmine Belkacem, Omar Cherif, Imene Boudiaf, إلخ)
  - [x] جامعات جزائرية (USTHB, ESI, ENSIA, Université Badji Mokhtar, Université 8 Mai 1945, إلخ)
  - [x] 22 سيرة ذاتية بمهارات واقعية (React, Node.js, Python, Flutter, Laravel, إلخ)
  - [x] 10 شركات بأسماء جزائرية وهمية (DZ Soft Solutions, Atlas Digital Agency, NovaTech Alger, إلخ)
  - [x] 14 عرضاً (متداخلة المهارات مع الطلاب)
  - [x] 16 تقديماً بحالات مختلفة (pending/accepted/rejected)
- [x] إضافة script في `package.json`: `"seed": "ts-node src/seed/seed.ts"`

---

## 🟡 الطور 11: التحسينات النهائية (Polish)

### RTL/LTR
- [x] إعداد `index.html` مع `dir="rtl"` و `lang="ar"`
- [x] إعداد i18n مع RTL/LTR تلقائي حسب اللغة
- [ ] استخدام CSS logical properties بشكل كامل
- [ ] اختبار التبديل بين اللغات

### التصميم
- [x] تطبيق ألوان المظهر: Navy (#1E2347), Sage Green (#8FAE85), Terracotta (#C77B4D), Off-white (#F4F1EA)
- [x] مكون MatchGauge مع تدرج الألوان من الأخضر إلى الأحمر
- [x] إضافة حالات التحميل (Loader) لاستدعاءات AI
- [x] إضافة حالات الخطأ والفارغة (EmptyState)
- [ ] تحسين العرض على الأجهزة المحمولة (Responsive)

### الأمان
- [x] zod validation على كل request
- [ ] إضافة rate limiting على `/ai/*` routes
- [x] التحقق من حجم ونوع الملفات المرفوعة (Multer)
- [x] التأكد من CORS في الإنتاج

---

## ⬜ الطور 12: إعدادات النشر (Deployment)

### Vercel
- [x] إعداد `vercel.json` للـ backend
- [ ] إعداد `vercel.json` للـ frontend
- [ ] إنشاء `DEPLOYMENT.md` يشرح عملية النشر
- [x] التأكد من إعادة استخدام اتصال Mongoose عبر الاستدعاءات (cached connection)
- [ ] ضبط timeout للـ serverless functions

---

## ملف القرارات (DECISIONS.md)

- [x] إنشاء `DECISIONS.md` لتوثيق القرارات الفنية

---

## التقرير الشامل بالعربية

### ما تم إنجازه
- ✅ **الهيكلة الأساسية** — Full-stack project structure, config, middleware, layouts, 11 shared components
- ✅ **المصادقة** — JWT + bcrypt، تسجيل/دخول للطلاب والشركات مع role guards
- ✅ **تسجيل الطلاب** — رفع PDF واستخراج البيانات بالـ AI (6.2a) + تعبئة يدوية
- ✅ **إدارة السير الذاتية** — CRUD كامل، استخراج مهارات (6.2b)، نصائح تحسين (6.2c)
- ✅ **إدارة عروض الشركات** — CRUD كامل للعروض
- ✅ **التصفح + المطابقة** — محرك مطابقة حسابي (6.1)، بحث/فلترة، MatchGauge دائري، شرح متطابق/مفقود ✅❌، نصيحة AI (6.2d)
- ✅ **التقديمات** — رسالة تحفيز بالـ AI (6.2e)، تقديم، قبول/رفض، فلترة حسب الحالة
- ✅ **الملف الشخصي** — تعديل الطالب والشركة، الملف العام للشركة
- ✅ **لوحة المشرف** — قائمة الشركات المعلقة، قبول/رفض
- ✅ **بيانات البذور** — 18 طالب جزائري، 22 سيرة ذاتية، 10 شركات، 14 عرضاً، 16 تقديماً
- ✅ **ملف القرارات** — `DECISIONS.md`

### إحصائيات المشروع
| المكون | العدد |
|--------|-------|
| ملفات TypeScript (Backend) | 28 ملفاً |
| ملفات TypeScript/TSX (Frontend) | 32 ملفاً |
| مكونات مشتركة (Shared Components) | 11 |
| صفحات (Pages) | 22 |
| Endpoints API | 28 |
| Mongoose Models | 5 |
| مرادفات المهارات في `skillNormalizer` | 16 |

### المهام المتبقية
- تحسين RTL الكامل باستخدام CSS logical properties
- إضافة rate limiting لـ `/ai/*`
- تحسين Responsive/Mobile
- إعدادات النشر على Vercel
- إنشاء `DEPLOYMENT.md`

### ملاحظات
- اللغة العربية هي اللغة الأساسية، مع ملفات فرنسية وإنجليزية (قابلة للتوسيع)
- كل ملفات TypeScript تمر بفحص `tsc --noEmit` بدون أخطاء
- البذور تحتوي على بيانات جزائرية واقعية للاختبار
