# دليل النشر على Vercel

## المتطلبات الأساسية

1. حساب على **GitHub** (مع رفع الكود إليه)
2. حساب على **Vercel** (يربط مع GitHub)
3. حساب على **MongoDB Atlas** (قاعدة بيانات مجانية)
4. حساب على **ImageKit** (رفع الملفات)
5. مفتاح **Groq API** (للذكاء الاصطناعي)

---

## 1. إنشاء قاعدة بيانات MongoDB Atlas

1. ادخل إلى [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) وسجل الدخول
2. اضغط **Create** → اختار **M0 (Free)** → اختار أي منطقة (مثل `aws-eu-west-1`)
3. في **Security Quickstart**:
   - اسم المستخدم وكلمة السر (احفظهم)
   - IP: اكتب `0.0.0.0/0` (للسماح لـ Vercel بالاتصال)
4. بعد الإنشاء، اضغط **Connect** → **Drivers** → انسخ رابط الاتصال
5. استبدل `<password>` بكلمة سر المستخدم، و`myFirstDatabase` بـ `stageai`

مثال للرابط:
```
mongodb+srv://admin:<password>@cluster0.xxxxx.mongodb.net/stageai?retryWrites=true&w=majority
```

---

## 2. إنشاء حساب ImageKit

1. ادخل إلى [ImageKit.io](https://imagekit.io/) وسجل الدخول
2. من Dashboard، اذهب إلى **Developer Options**
3. انسخ القيم التالية:
   - `Public Key`
   - `Private Key`
   - `URL Endpoint` (مثل `https://ik.imagekit.io/yourid`)

---

## 3. الحصول على مفتاح Groq API

1. ادخل إلى [console.groq.com](https://console.groq.com/keys)
2. اضغط **Create API Key**
3. انسخ المفتاح

---

## 4. إنشاء مشروع Backend على Vercel

1. اذهب إلى [vercel.com](https://vercel.com/) وسجل الدخول بـ GitHub
2. اضغط **Add New → Project**
3. اختر مستودع `stageai`
4. في **Configure Project**:
   - **Root Directory**: اكتب `backend`
   - **Framework Preset**: اختر `Other`
   - **Build Command**: اتركه فارغًا (Vercel سيكتشف `vercel.json`)
   - **Output Directory**: اتركه فارغًا
5. أضف **Environment Variables**:

| الاسم | القيمة |
|-------|--------|
| `MONGODB_URI` | رابط MongoDB Atlas من الخطوة 1 |
| `JWT_SECRET` | نص عشوائي طويل (مثل `stageai_jwt_secret_2024_xyz...`) |
| `GROQ_API_KEY` | مفتاح Groq من الخطوة 3 |
| `IMAGEKIT_PUBLIC_KEY` | المفتاح العام من ImageKit |
| `IMAGEKIT_PRIVATE_KEY` | المفتاح الخاص من ImageKit |
| `IMAGEKIT_URL_ENDPOINT` | رابط ImageKit (مثل `https://ik.imagekit.io/yourid`) |
| `CLIENT_URL` | رابط الواجهة بعد نشرها (مثل `https://stageai-frontend.vercel.app`) |

> **ملاحظة:** `PORT` لست بحاجة لإضافتها — Vercel يضبط المنفذ تلقائيًا.

6. اضغط **Deploy**

بعد النشر، ستحصل على رابط مثل: `https://stageai-backend.vercel.app`

---

## 5. إنشاء مشروع Frontend على Vercel

1. في Vercel، اضغط **Add New → Project**
2. اختر نفس المستودع `stageai`
3. في **Configure Project**:
   - **Root Directory**: اكتب `frontend`
   - **Framework Preset**: سيتم الكشف تلقائيًا عن `Vite` (تأكد من ظهوره)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. أضف **Environment Variable**:
   - `VITE_API_BASE_URL` ← `https://stageai-backend.vercel.app/api`
   (استخدم رابط الباكند الفعلي بعد نشره)
5. اضغط **Deploy**

بعد النشر، ستحصل على رابط مثل: `https://stageai-frontend.vercel.app`

---

## 6. تحديث `CLIENT_URL` في Backend

1. اذهب إلى مشروع الباكند في Vercel
2. **Settings → Environment Variables**
3. جدّد `CLIENT_URL` بقيمة رابط الفرونتند (مثل `https://stageai-frontend.vercel.app`)
4. اذهب إلى **Deployments**، واخر آخر deploy، واضغط **Redeploy**

---

## 7. تشغيل Seed Data

لتعبئة قاعدة البيانات ببيانات اختبارية:

### الخيار الأول — عبر Terminal محلي
```bash
cd backend
npm install
npm run seed
```
> تأكد من وجود ملف `backend/.env` بنفس المتغيرات المستخدمة في Vercel.

### الخيار الثاني — عبر Vercel CLI
```bash
npm i -g vercel
vercel pull --prod
vercel env pull
npx ts-node src/seed/seed.ts
```

### بيانات الاختبار بعد التشغيل:
| الدور | البريد الإلكتروني | كلمة السر |
|-------|-------------------|-----------|
| Admin | `admin@stageai.dz` | `admin123` |
| Student (18 مستخدم) | `student1@test.dz` ... `student18@test.dz` | `password123` |
| Company (10 شركات) | `company1@test.dz` ... `company10@test.dz` | `company123` |

---

## 8. التحقق من النشر

### تحقق من الباكند:
افتح الرابط التالي في المتصفح:
```
https://stageai-backend.vercel.app/api/auth/login
```
يجب أن يعيد `404` (لأنها POST) أو `{}` — المهم عدم ظهور `503` أو `502`.

### تحقق من الفرونتند:
افتح رابط الفرونتند — يجب أن تظهر صفحة تسجيل الدخول.

### اختبار تسجيل الدخول:
- استخدم `admin@stageai.dz` / `admin123`
- يجب أن يتم توجيهك إلى لوحة تحكم Admin
- اذهب إلى **الشركات المعلقة** ووافق على شركة
- سجل الدخول كـ `company1@test.dz` / `company123`
- أنشئ عرض تدريب
- سجل الدخول كـ `student1@test.dz` / `password123`
- تصفح العروض وقدم طلبًا

---

## 9. استكشاف الأخطاء وحلّها

### 9.1. خطأ `503` أو `502` (Serverless Error)
- السبب: الباكند لم يستطع الوصول إلى قاعدة البيانات
- الحل: تأكد من `MONGODB_URI` في Vercel Environment Variables
- تأكد من أن IP `0.0.0.0/0` مضاف في MongoDB Atlas Network Access

### 9.2. خطأ `CORS`
- السبب: `CLIENT_URL` غير صحيح أو غير مضبوط
- الحل: تأكد من أن قيمة `CLIENT_URL` تطابق رابط الفرونتند بالضبط (بدون `/` في النهاية)

### 9.3. خطأ `401 Unauthorized` في كل الطلبات
- السبب: `JWT_SECRET` مختلف بين البيئة المحلية و Vercel
- الحل: استخدم نفس `JWT_SECRET` في كل مكان

### 9.4. خطأ `ECONNREFUSED` في MongoDB
- السبب: MongoDB Atlas يمنع الاتصال
- الحل: اذهب إلى Network Access وأضف `0.0.0.0/0`

### 9.5. الصور لا تظهر
- السبب: ImageKit misconfiguration
- الحل: تأكد من `IMAGEKIT_URL_ENDPOINT`, `IMAGEKIT_PUBLIC_KEY`, `IMAGEKIT_PRIVATE_KEY`

### 9.6. الذكاء الاصطناعي لا يعمل
- السبب: مفتاح Groq غير صحيح أو انتهت صلاحيته
- الحل: جدّد المفتاح من [console.groq.com](https://console.groq.com/keys)

---

## 10. هيكل المتغيرات البيئية

### `backend/.env`
```env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/stageai
JWT_SECRET=<your-secret-key>
GROQ_API_KEY=<your-groq-api-key>
IMAGEKIT_PUBLIC_KEY=<your-imagekit-public-key>
IMAGEKIT_PRIVATE_KEY=<your-imagekit-private-key>
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/<your-id>
CLIENT_URL=https://stageai-frontend.vercel.app
```

### `frontend/.env`
```env
VITE_API_BASE_URL=https://stageai-backend.vercel.app/api
```

---

## 11. نصائح مهمة

- **Vercel Free Tier**: مدة تنفيذ الطلب محددة بـ 10 ثوانٍ للـ Hobby plan. الباكند يستخدم `connectDB` المخبأ (cached connection) لتسريع الاتصال بقاعدة البيانات.
- **Serverless Cold Start**: أول طلب بعد فترة خمول قد يستغرق 2-3 ثوانٍ أطول.
- **ملفات الرفع**: ImageKit يقبل PDF أيضًا، وليس الصور فقط.
- **التطوير المحلي**: شغّل `npm run dev` في `backend/` و `frontend/` مع ملفات `.env` محلية.
- **تحديث الكود**: فقط ادفع للتغييرات إلى GitHub، و Vercel سيعيد النشر تلقائيًا.
