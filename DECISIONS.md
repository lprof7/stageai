# StageAI (InternMatch AI) — Decisions Log

This file documents technical and design decisions made during implementation where the spec was ambiguous or allowed flexibility.

## Decisions

1. **TypeScript strict mode** — Enabled on both frontend and backend (matches spec Section 15 #1).

2. **ImageKit stores CV PDFs** — Used as the single storage provider for all files including PDFs (per Section 15 #2).

3. **Matching algorithm is deterministic** — Skill-set overlap (Jaccard-like) computed on normalized strings, no AI call (per Section 15 #3).

4. **Admin role** — Created a minimal admin screen at `/admin` that lists pending companies with approve/reject buttons. The admin is stored as a Student with a hardcoded check in the auth system (Section 15 #4). Admin login uses the student login endpoint but is seeded separately.

5. **Groq model** — Using `llama3-70b-8192` as the default model. This should be confirmed against Groq's live model list at deployment time (Section 3).

6. **All AI output in Arabic** — System prompts instruct Groq to output in Arabic by default, with the actual language following the source document language for extraction calls (per Section 6.2).

7. **Rate limiting** — Not yet implemented for `/ai/*` routes. Should be added before production using a simple in-memory limiter or a library like `express-rate-limit`.

8. **CSS approach** — Using inline styles with CSS custom properties (variables). No CSS-in-JS library to keep dependencies minimal. The theme can be changed entirely via `theme.css` and `tokens.ts`.

9. **Router setup** — Frontend uses `react-router-dom` v6 with `createBrowserRouter`. Auth state is managed via React Context (not a state management library).

10. **Seed data** — Uses `@faker-js/faker` locally installed. All names, universities, and companies are realistic Algerian examples. Passwords for seeded accounts:
    - Admin: `admin@stageai.dz` / `admin123`
    - Students: `password123`
    - Companies: `company123`

11. **CV file naming** — ImageKit uploads use the pattern `${studentId}_${cvName}.pdf` with `useUniqueFileName: true` to prevent collisions.

12. **Application deduplication** — Students cannot apply to the same offer twice (409 Conflict response).

13. **Company pending gate** — Companies with `status: "pending"` can log in but receive an error message instead of accessing the dashboard. The admin must approve them first.
