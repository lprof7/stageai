# StageAI (InternMatch AI) — Full Build Specification for an AI Coding Agent

> **How to use this file:** This is a single, self-contained instruction set for an autonomous AI coding agent. Read it in full before writing any code. It is organized so you can build in the order given in Section 13. If anything is ambiguous, make the most reasonable decision consistent with the principles in this document, note the decision in a `DECISIONS.md` file at the project root, and continue — do not stall waiting for clarification unless the ambiguity blocks a whole module.

---

## 1. Project Identity & Vision

**Name:** StageAI (also referred to as InternMatch AI)

**One-line pitch:** An AI-native platform that connects students with companies for internships (*stages*) by replacing manual, unstructured CV screening and blind mass-applications with automated, explainable, skill-based matching.

**The problem this solves (two-sided):**
- **Companies** are flooded with unstructured, inconsistent resumes, must sort them manually and slowly, waste HR time, and frequently make imprecise or delayed hiring decisions.
- **Students** send dozens of speculative applications, rarely get a response, don't know if they're actually eligible for a given offer, and get no guidance on which skills they're missing.

**The solution flow:**
`Input (PDF resume, zero manual typing) → AI Processing (extract skills/experience/education) → Structuring (clean, unified digital profile) → Matching (automatic, explainable link between candidate profile and company requirement)`

**Differentiator — explainability:** Every match is not just a percentage. The system must always be able to show *which* required skills are matched and *which* are missing, so the percentage is never a black box.

Keep this vision in mind for every UI and AI-copy decision: the product should always feel like it is *removing guesswork*, not adding another generic job board.

---

## 2. Agent Role & Operating Instructions

You are acting as a senior full-stack engineer responsible for delivering a production-quality MVP of this platform. Rules of engagement:

1. **Section 7 (Functional Requirements) is the contract.** It is the literal, detailed specification provided by the product owner and takes precedence over every other section if there is ever a conflict.
2. Sections 3–6, 8–12 are *implementation guidance* meant to help you execute Section 7 correctly and consistently — follow them unless they conflict with Section 7.
3. Section 15 lists assumptions made while writing this spec, where the original requirements were silent. These are defaults, not hard requirements — apply them, but flag them in `DECISIONS.md` so the product owner can override any of them later.
4. Write clean, commented, idiomatic TypeScript. No dead code, no placeholder TODOs left unresolved in delivered phases.
5. Build incrementally following the phase order in Section 13. Do not jump ahead to polish/theming before the functional core of a phase works end-to-end.
6. Every screen must work correctly in **Arabic with full RTL layout** — this is not an afterthought, it is the primary language of the product.

---

## 3. Tech Stack (Non-Negotiable)

| Layer | Technology |
|---|---|
| Frontend | React (Vite) + TypeScript |
| Backend | Node.js + Express + TypeScript |
| Database | MongoDB Atlas (Mongoose ODM) |
| Resume text extraction | `pdf-parse` (or `pdfjs-dist`) — extracts raw text from uploaded PDF before any AI call |
| AI engine | **Groq API** (Llama 3.x family — use the current best "versatile"-class instruct model available on Groq; confirm exact model name against Groq's live model list at build time) for: structured data extraction, skill extraction, advice generation, motivation letter generation |
| Media & file storage | **ImageKit** — used for company logos, student profile pictures, **and** the original uploaded CV PDF files (ImageKit accepts arbitrary file uploads, not just images, so it is the single storage service for the whole project — do not introduce a second storage provider) |
| Auth | JWT (access token) + `bcrypt` for password hashing |
| Hosting | Vercel (frontend as a Vite static build; backend as Vercel serverless functions wrapping the Express app — see Section 14 for constraints) |

Do not substitute any of these (e.g. no SQL database, no OpenAI/Gemini, no Azure/AWS storage) even if you encounter other architecture diagrams referencing them — this table is authoritative for this project.

---

## 4. Project Structure

### 4.1 Frontend (`/frontend`)

Two explicit layers, as required by the product owner: a **feature-based view layer** and an **entity-based data layer** with a *simplified* repository pattern (a thin wrapper per entity around HTTP calls — no interfaces, no dependency injection, no over-abstraction).

```
/frontend
  /src
    /view                          <- feature-based
      /auth
        /student                   (login, signup, onboarding choice, onboarding form)
        /company                   (login, signup)
      /student
        /cv-management             (CV list, add/edit CV modal, CV detail)
        /offers                    (browse/search/filter, offer detail, apply flow)
        /applications              (list, detail/status)
        /profile
      /company
        /offers                    (list, create/edit, offer detail)
        /applications              (offers list -> applicants list -> applicant detail)
        /profile
      /shared                      <- reusable, NOT feature-specific
        /components                (Button, Input, Modal, Card, MatchGauge, Badge,
                                     SkillChip, EmptyState, Toast, Loader, FilterBar...)
        /layouts                   (AuthLayout, StudentLayout, CompanyLayout)
    /data                          <- entity-based, repository pattern
      /repositories
        authRepository.ts
        studentRepository.ts
        companyRepository.ts
        cvRepository.ts
        offerRepository.ts
        applicationRepository.ts
      /models                      (TS types/interfaces mirroring backend schemas)
      /api
        httpClient.ts              (axios instance: base URL, auth header injection, error interceptor)
    /i18n
      ar.json                      (default / primary)
      fr.json                      (scaffold, can stay partial)
      en.json                      (scaffold, can stay partial)
      index.ts                     (i18n setup, RTL/LTR switch tied to active language)
    /themes
      tokens.ts                    (color, spacing, radius, font tokens as CSS variables)
      theme.css
    /hooks
    /utils
    /router
    /context (or a tiny store)     (auth state: token, role, current user)
    App.tsx
    main.tsx
```

**Why this split matters:** changing the visual identity should only ever require touching `/themes`; changing copy/language only `/i18n`; swapping the backend or API shape should only ever require touching `/data`, never `/view`.

### 4.2 Backend (`/backend`)

```
/backend
  /src
    /config
      db.ts                       (Mongoose connection)
      groq.ts                     (Groq client instance)
      imagekit.ts                 (ImageKit client instance)
      env.ts                      (typed access to process.env, fails fast if a required var is missing)
    /models                       (Mongoose schemas — see Section 5)
      Student.ts
      Company.ts
      Cv.ts
      Offer.ts
      Application.ts
    /controllers
    /routes
    /services
      authService.ts
      pdfExtractionService.ts     (pdf-parse wrapper)
      aiService.ts                (all Groq prompt calls live here — see Section 6.2)
      matchingService.ts          (see Section 6.1)
      uploadService.ts            (ImageKit upload wrapper)
    /middlewares
      auth.ts                     (verifies JWT, attaches req.user)
      requireRole.ts               (guards student-only / company-only / admin-only routes)
      upload.ts                   (multer, memory storage)
      errorHandler.ts             (centralized error -> JSON response)
    /utils
      skillNormalizer.ts          (lowercasing/trimming/synonym mapping — see Section 6.1)
      validators/                 (zod schemas per route)
    /seed
      seed.ts                     (see Section 12)
    app.ts
    server.ts
  vercel.json
```

---

## 5. Data Models

All `_id` fields are MongoDB ObjectIds. Timestamps (`createdAt`, `updatedAt`) on every collection via Mongoose's `timestamps: true`.

**Student**
- `fullName: string`
- `email: string` (unique, lowercase)
- `passwordHash: string`
- `phone?: string`
- `location?: string`
- `education?: string`
- `bio?: string`
- `profilePictureUrl?: string` (ImageKit)
- `onboardingMethod: "upload" | "manual"`

> This is the **base profile**, filled once at signup (via PDF extraction or manual form) and editable later from "Profile Management." It is distinct from CVs below.

**Cv** (a student can have many)
- `studentId: ObjectId` (ref Student)
- `name: string` (the label the student gives it, e.g. "CV - Backend Focus")
- `fileUrl: string` (ImageKit URL of the uploaded PDF)
- `extractedSkills: string[]`
- `improvementTips: string` (AI-generated, regenerated whenever skills change)

**Company**
- `name: string`
- `email: string` (unique, lowercase)
- `passwordHash: string`
- `description?: string`
- `location?: string`
- `logoUrl?: string` (ImageKit)
- `status: "pending" | "approved" | "rejected"` (default `"pending"`)

**Offer**
- `companyId: ObjectId` (ref Company)
- `title: string`
- `description: string`
- `paymentType: "paid" | "unpaid"`
- `employmentType: "full_time" | "part_time" | "remote" | "hybrid"` (extend as needed)
- `requiredSkills: string[]`
- `durationMonths?: number`
- `location?: string`
- `isActive: boolean` (default `true`)

**Application**
- `studentId: ObjectId`
- `cvId: ObjectId` (which CV was used for this application)
- `offerId: ObjectId`
- `motivationLetter: string`
- `matchPercentageSnapshot: number` (computed at apply-time, stored so history doesn't shift if the CV or offer later changes)
- `status: "pending" | "accepted" | "rejected"` (default `"pending"`)

---

## 6. Core Business Logic

### 6.1 Matching Engine

The matching percentage **must be a fast, deterministic calculation**, not a Groq call — students will browse lists of dozens of offers, and you cannot afford an AI round-trip per card.

Algorithm:
1. Normalize every skill string on both sides (lowercase, trim, strip punctuation) via `skillNormalizer.ts`. Maintain a small synonym map there (e.g. `"reactjs"`, `"react.js"`, `"react"` → `"react"`) so trivial wording differences don't break a match. Expand this map as you discover offers/CVs that should match but don't.
2. `matchedSkills = intersection(normalizedCvSkills, normalizedOfferSkills)`
3. `missingSkills = offerSkills - matchedSkills`
4. `matchPercentage = round( (matchedSkills.length / offerSkills.length) * 100 )` — guard against division by zero (offer with no required skills = 100%).
5. Always return `{ matchPercentage, matchedSkills, missingSkills }` together from any endpoint that returns a match — the UI must always be able to show the explainable breakdown (matched ✅ vs missing ❌), never just the bare number.
6. Sorting offer lists "by match" = sort by `matchPercentage` descending.
7. Color the match indicator on a green→red gradient as percentage goes 100→0 (e.g. interpolate HSL hue 120°→0°).

Reserve actual Groq calls for the *qualitative* layer on top of this number (the human-readable advice — see 6.2c), not for computing the number itself.

### 6.2 AI Integration (Groq)

Every Groq call lives in `aiService.ts`. Define a strict expected JSON shape for every extraction call and use Groq's JSON/structured output mode where the SDK supports it, validating the response with `zod` before trusting it (LLMs occasionally return malformed JSON — always wrap in try/catch with a sane fallback, e.g. an empty skills array, never crash the request).

**a) Onboarding profile extraction** (signup, PDF path)
- Input: raw text extracted from the uploaded PDF via `pdf-parse`.
- Output JSON: `{ fullName, phone, location, education, bio }` (whatever subset is confidently extractable — leave fields empty rather than hallucinating).
- This pre-fills the editable onboarding form; nothing is saved until the student confirms.

**b) CV skill extraction** (CV Management feature)
- Input: raw text from the CV PDF.
- Output JSON: `{ skills: string[] }` — be generous but realistic; this list is what feeds the matching engine, so prefer well-known, normalized skill names.

**c) CV improvement tips** (CV Management feature)
- Input: the CV's current skill list (and optionally the raw text).
- Output: free-text advice (a short paragraph or 3–5 bullet points) on how to generally strengthen this CV.
- Regenerate whenever the student edits the skill list and re-saves.

**d) Offer-specific match advice** (Offer Detail page)
- Input: the selected CV's skills, the offer's required skills + description, and the `missingSkills` from the matching engine.
- Output: free-text, personalized advice on how this specific student could become a stronger fit for this specific offer (referencing the actual missing skills, not generic platitudes).
- Call on-demand only (when the student opens the offer detail page with a CV selected), not on every list render.

**e) Motivation letter generation** (Apply flow)
- Input: student profile + selected CV skills + offer title/description.
- Output: a draft cover letter the student can edit before submitting. Always present it as an editable draft, never auto-submit it.

For all text-generation calls, write the system prompt to explicitly require **Arabic output by default** (matching the platform's primary language), with the actual generated language following whatever language the source CV/offer text is in if it's clearly not Arabic.

---

## 7. Functional Requirements

*(This section restates the product owner's specification precisely. Treat every bullet as a literal acceptance criterion.)*

### 7.1 Student

**Authentication**
- Login via email + password.
- Sign up: enter email + password → redirected to a choice screen: *"Upload your CV as PDF"* or *"Fill in your information manually."*
  - If **upload**: extract text from the PDF and use AI (6.2a) to pre-fill a form with the extracted profile info; the student can review and edit every field before confirming.
  - If **manual**: show the exact same form, empty.

**Main Interface**

1. **CV Management**
   - A list of the student's CVs; can add, delete, or edit any of them.
   - **Add a CV:** prompt for a unique name → upload a PDF → AI (6.2b) extracts skills → a review modal shows the extracted skills with the ability to add or remove individual skills before saving → AI-generated improvement-tips text (6.2c) is shown alongside.
   - **Open an existing CV:** shows the uploaded file, the extracted skills (editable: add/remove), the CV's name (editable), the improvement tips text, and a delete icon that removes the entire CV.

2. **Browse Offers**
   - A list of company offers with search, and filters: employment type (full/part-time, etc.), paid/unpaid, and — critically — a **"filter by CV"** selector (each CV has its own skill set, so the match percentage shown depends entirely on which CV is selected).
   - Every offer card shows its match percentage *relative to the CV currently selected in the filter*. Offers are sorted highest-match-first.
   - **Offer card contents:** company logo, company name (small text), offer title (large text), employment type, paid/unpaid badge, and a circular match-percentage gauge colored green→red by percentage.
   - **Offer detail page:** company name + logo, offer title, full description, other details (duration, location, etc.), the match-percentage gauge, and AI-generated advice (6.2d) on how to improve the *selected* CV specifically for this offer. An **"Apply"** button leads to a motivation-letter page with an **"AI Generate"** button (6.2e) plus a final **"Confirm Submission"** button.
   - Clicking the company's name or logo opens that **company's public profile**: name, description, location, image, and the list of all offers that company has posted.

3. **My Applications**
   - A list view; clicking an application opens its offer details plus the application's current status: *pending*, *accepted*, or *rejected*.

4. **Profile Management**
   - Edit base profile information manually at any time.

### 7.2 Company

**Authentication**
- Login via email + password.
- If the company's account has not yet been approved, show a *"Your request is under review"* message instead of the dashboard (see Section 7.3 — this implies a minimal approval mechanism).
- Sign up: name, description, location, logo image.

1. **Offer Management**
   - A list of the company's own offers.
   - **Add an offer:** form for title, description, type (paid/unpaid; full-time/part-time/etc.), and the list of required skills → submit to create.
   - **Open an offer:** view details with the ability to edit title, description, or skills; also includes a button that navigates to that offer's applications list.

2. **Application Management**
   - A list of the company's offers → selecting one shows the list of applications submitted to it.
   - **Application card:** applicant name, applicant description/summary, and match percentage — list sorted by match percentage descending.
   - **Opening an application:** shows its full detail (motivation letter, etc.) with **Accept** / **Reject** actions.
   - Applications can be filtered by status: accepted / rejected / pending.

3. **Profile Management**
   - Edit the company's own info.

### 7.3 Admin (minimal — inferred, see Section 15 #4)

Company sign-up requires approval before the account becomes usable (per 7.2), so *something* must be able to approve or reject a pending company. For the MVP, build the smallest viable version of this:
- A protected route/role (`admin`) with two endpoints: list pending companies, and approve/reject a given company (Section 8).
- A minimal internal screen (does not need company-grade polish) listing pending companies with Approve/Reject buttons.
- Seed one admin user (see Section 12) so this is testable immediately.

---

## 8. API Reference

All routes under `/api`. Protected routes require `Authorization: Bearer <token>`.

| Method | Route | Who | Purpose |
|---|---|---|---|
| POST | `/auth/student/register` | public | create student account (manual or post-extraction confirm) |
| POST | `/auth/student/login` | public | student login |
| POST | `/auth/company/register` | public | create company account (status: pending) |
| POST | `/auth/company/login` | public | company login (blocked dashboard data if pending) |
| POST | `/ai/extract-onboarding-profile` | student | upload PDF, returns pre-filled profile JSON (6.2a) |
| GET/PUT | `/students/me` | student | view/update base profile |
| GET | `/cvs` | student | list own CVs |
| POST | `/cvs` | student | upload PDF + name → extract skills (6.2b) + tips (6.2c) → create |
| GET/PUT/DELETE | `/cvs/:id` | student | view/edit (name, skills)/delete a CV |
| GET | `/offers` | student | list/search/filter offers; query params: `search, paymentType, employmentType, cvId, sort` |
| GET | `/offers/:id` | student | offer detail; if `?cvId=` provided, include match breakdown |
| POST | `/ai/match-advice` | student | given cvId + offerId, return advice text (6.2d) |
| POST | `/ai/motivation-letter` | student | given cvId + offerId, return draft letter (6.2e) |
| POST | `/applications` | student | submit application (cvId, offerId, motivationLetter) |
| GET | `/applications` | student | list own applications |
| GET | `/applications/:id` | student | application detail + status |
| GET | `/companies/:id` | public/student | public company profile + its active offers |
| GET/PUT | `/companies/me` | company | view/update own profile |
| GET | `/company/offers` | company | list own offers |
| POST | `/company/offers` | company | create offer |
| GET/PUT | `/company/offers/:id` | company | view/edit own offer |
| GET | `/company/offers/:id/applications` | company | list applicants for one offer; `?status=` filter; sorted by match % |
| GET | `/company/applications/:id` | company | application detail |
| PUT | `/company/applications/:id/status` | company | accept/reject |
| GET | `/admin/companies/pending` | admin | list pending companies |
| PUT | `/admin/companies/:id/status` | admin | approve/reject |

---

## 9. UI/UX & Design System Guidelines

- **Language & direction:** Arabic is the default and primary language; the entire layout must mirror correctly in RTL (use logical CSS properties — `margin-inline-start` etc. — not hardcoded `left`/`right`). French/English locale files can stay scaffolded but partial.
- **Suggested default theme** (inspired by the product's pitch deck — treat as a starting point, the `/themes` folder must make it trivial to replace):
  - Primary (deep navy): `#1E2347`
  - Accent — success / high match (sage green): `#8FAE85`
  - Accent — warning / gap (terracotta): `#C77B4D`
  - Background (warm off-white): `#F4F1EA`
  - Neutral borders/text: standard grayscale
- **Match gauge:** a circular progress ring, green at 100% smoothly interpolating to terracotta/red near 0%, with the percentage number centered inside.
- **Offer card hierarchy:** logo → small company name → large offer title → meta badges (employment type, paid/unpaid) → gauge in a corner.
- Always pair a percentage with its explainable breakdown somewhere reachable in the same view (matched skills with a check, missing skills with an X) — this is a core trust feature of the product, not a nice-to-have.
- Use skeleton/loading states for every AI call (extraction, advice, letter generation) since Groq calls, while fast, are not instant — never let a button look "stuck."

---

## 10. Non-Functional Requirements & Security

- Validate every request body with `zod` schemas in `/utils/validators`; reject invalid input with 400 before touching the DB or calling Groq.
- Hash passwords with `bcrypt` (cost factor ≥ 10); never store or log plaintext passwords.
- JWT payload should include `{ id, role }` where role ∈ `student | company | admin`; `requireRole` middleware enforces route access.
- Centralize error handling (`errorHandler.ts`) so every failure returns a consistent `{ message }` JSON shape and an appropriate status code — never leak stack traces to the client.
- Rate-limit the `/ai/*` routes per user (even a simple in-memory limiter is fine for MVP) to control Groq usage cost and abuse.
- Sanitize/limit uploaded file size and type (PDF only for CVs, common image types for logos/profile pictures) before sending to ImageKit or `pdf-parse`.
- CORS: restrict to the deployed frontend origin in production.

---

## 11. Environment Variables

`.env.example` (backend):
```
PORT=5000
MONGODB_URI=
JWT_SECRET=
GROQ_API_KEY=
IMAGEKIT_PUBLIC_KEY=
IMAGEKIT_PRIVATE_KEY=
IMAGEKIT_URL_ENDPOINT=
CLIENT_URL=
```
`.env.example` (frontend):
```
VITE_API_BASE_URL=
```

---

## 12. Seed Data Requirements (Algerian Context)

Write `backend/src/seed/seed.ts` (runnable via `npm run seed`) that wipes and repopulates the database with **realistic Algerian fake data** (use `@faker-js/faker` with `localized` first/last names where convenient, plus hand-written realistic Algerian entries where faker's locale support is insufficient):

- **1 admin** account (e.g. `admin@stageai.dz`, a fixed known password printed to the console after seeding).
- **~15–20 students**, with Algerian-sounding full names (mix of Arabic/French transliterations — e.g. Yasmine Belkacem, Omar Cherif, Imene Boudiaf, Riadh Mansouri), realistic Algerian universities (USTHB Alger, ENSIA, Université Badji Mokhtar Annaba, Université 8 Mai 1945 Guelma, ESI Alger, Université Constantine 2, etc.), and locations across Algerian cities (Alger, Oran, Constantine, Annaba, Guelma, Sétif, Tlemcen, Béjaïa).
- Each student gets **1–3 CVs** with realistic skill sets relevant to common Algerian student fields — software/web/mobile dev (React, Node.js, Flutter, Laravel, Spring Boot, Django), but also some non-tech tracks (marketing, finance/comptabilité, graphic design) for variety.
- **~8–10 companies**, Algerian-sounding business names (real or plausible local startups/SMEs/agencies — avoid using real existing trademarked company names; invent plausible ones, e.g. "DZ Soft Solutions", "Atlas Digital Agency", "NovaTech Alger"), with locations matching the cities above, most set to `status: "approved"` and 1–2 left `"pending"` to make the admin/approval flow testable.
- Each company gets **2–4 offers**, mixing paid/unpaid and full/part-time, with required skill lists that overlap partially with the seeded students' skills (so the matching engine has something meaningful to show — don't make every match 0% or 100%).
- A handful of **applications** across different students/offers, with a realistic spread of `pending`/`accepted`/`rejected` statuses.

---

## 13. Recommended Build Order (Phases)

1. **Scaffolding** — both project skeletons (Section 4), env config, DB connection, ImageKit + Groq client setup, base layouts/routing.
2. **Authentication** — student & company register/login, JWT issuance, role middleware, the pending-approval gate for companies.
3. **Student onboarding** — manual-vs-upload choice screen, PDF text extraction, AI profile extraction (6.2a), editable confirm form.
4. **CV Management** — full CRUD, skill extraction (6.2b), improvement tips (6.2c).
5. **Company Offer Management** — full CRUD on offers.
6. **Browse Offers + Matching Engine** — search/filters, CV-aware match percentage and sorting (6.1), offer detail page, AI match advice (6.2d).
7. **Applications flow** — apply page with AI-generated motivation letter (6.2e), student application list/status, company application review (accept/reject, status filter).
8. **Profile Management** — both student and company self-edit screens, company public profile page.
9. **Admin minimal approval flow** (7.3).
10. **Seed script** (Section 12) — build this early enough to use as you test, finalize once all models are stable.
11. **Polish** — Arabic RTL pass on every screen, theming pass, loading/empty/error states, responsive/mobile pass.
12. **Deployment configuration** (Section 14).

---

## 14. Deployment Notes (Vercel)

- Frontend deploys as a standard Vite static build on Vercel.
- The Express backend needs to run as Vercel serverless functions — either restructure routes under `/api` as individual serverless handlers, or wrap the whole Express app with a single catch-all serverless function (commonly done via `serverless-http` or Vercel's native Express support pattern). Document whichever approach you choose in `vercel.json` and a short `DEPLOYMENT.md`.
- Be mindful of serverless execution time limits when calling Groq — Groq is generally fast, but always set a reasonable request timeout and a clear loading/error UI state in case of a slow/failed AI call.
- MongoDB Atlas connection should reuse a cached connection across invocations (standard serverless Mongoose pattern) rather than reconnecting on every request.

---

## 15. Assumptions Made by This Spec (Please Review)

These were not explicitly specified by the product owner; they are reasonable defaults chosen to keep the build unblocked. Flag any of these in `DECISIONS.md` and adjust freely if the product owner disagrees:

1. **TypeScript** on both frontend and backend (rather than plain JS) — matches the owner's usual stack; trivially reversible by dropping types.
2. **ImageKit also stores the raw CV PDFs**, not only images — avoids introducing a second storage provider, since ImageKit accepts arbitrary file types.
3. **Matching percentage is computed deterministically** (skill-set overlap, normalized) rather than via an AI call, with AI reserved only for the qualitative advice layer — this is a performance/cost decision, not a product decision; verify it matches the intended feel of "92% match" shown in the product's pitch materials.
4. **A minimal Admin role/screen exists** purely to approve/reject pending companies, since the spec requires a pending-approval gate for companies but never names who performs the approval.
5. **Default brand color palette** in Section 9 is inspired by the pitch deck's visual identity but is an approximation, not exact extracted hex values.
6. **Skill suggestions / learning resources (e.g. linking out to Coursera/Udemy/YouTube for missing skills)** appear in the product's pitch deck as a future-facing idea but are **not** part of the literal functional requirements in Section 7 — treat as an optional, clearly-separate enhancement to add only after the full MVP (Section 7) is complete and working, not as part of the matching engine or offer detail page in the MVP itself.

---

## 16. Final Directive

Build Section 7 exactly as specified, using Sections 3–12 to make every implementation decision consistent and production-grade. Work phase by phase (Section 13). Keep the codebase clean enough that a human engineer could open any feature folder and immediately understand it without reading this whole document again. When in doubt between "more clever" and "simpler and obvious," choose simpler — this matches the product owner's explicit instruction for the repository pattern, and it's the right call for the rest of the codebase too.