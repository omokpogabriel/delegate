# Delegate: project brief for Claude

Delegate is a free, self-paced 24-week course that takes a novice to a top-tier user of AI agents.
Owner: Gabriel Omokpo (ISUX Technologies). Live at https://learnai.isuxtech.com

## Stack
- Frontend: React 19 + TypeScript + Vite + React Router (`src/`)
- Backend: Cloudflare Pages Functions (`functions/api/`), file-path routing
- Storage: the learner's browser (localStorage) is the main copy. Each learner is backed up to
  Cloudflare R2 as one JSON file: `learners/<sha256(email)>.json` (bucket `delegate-learners`, binding `LEARNERS`)
- No database, no passwords. Identity = email + a secret question (answer stored as a PBKDF2 hash,
  5 wrong tries → 15-minute lock). Each browser gets a save token; only its SHA-256 is stored.
- Hosting: Cloudflare Pages project `delegate` (delegate-2w6.pages.dev). DNS for isuxtech.com is in
  Spaceship; `learnai` is a CNAME to delegate-2w6.pages.dev. The root domain is hosted on AWS: don't touch it.
- Repo: github.com/omokpogabriel/delegate

## Commands
- `npm run dev`: frontend only (API unreachable → welcome form offers "continue in this browser")
- `npm run pages:dev`: full stack locally with a local R2, at http://localhost:8788
- `npm run build`: type-check + build to `dist/`
- `npm run typecheck:functions`: type-check the API
- `npm run deploy`: build and deploy to Cloudflare Pages (needs `wrangler login`)

## Where things live
- Course content: `src/content/`
  - `course.ts`: outline (6 months × 4 weeks: title, build, tasks, exam, reading links)
  - `month1.ts` (weeks 1–4), `month3.ts` (week 10): full lessons (body HTML, videos, reading, exercise, 3-question quiz)
  - `index.ts`: registers lessons by week number + progress helpers
- Learner state, local storage and background sync: `src/lib/store.tsx`
- API client: `src/lib/api.ts`
- First-visit form and secret question: `src/components/Welcome.tsx`
- Pages: `src/pages/Home.tsx`, `src/pages/Lesson.tsx`
- Styles: `src/styles.css` (colour tokens at the top; dark mode below)
- API: `functions/api/{lookup,register,restore,save}.ts`, `functions/api/admin/subscribers.ts` (CSV, needs `ADMIN_KEY`)
- Shared server logic and the R2 record schema: `functions/_shared.ts`

## Progress keys
`L<lessonId>` for lessons (e.g. `L1-2`), `t<week>_<index>` for weekly tasks (e.g. `t3_0`). Don't rename these:
learners' saved progress depends on them.

## Status
- Lessons written: weeks 1–4 and week 10. Other weeks show build + tasks with "lessons in production".
- Next likely work: lessons for Month 2 (weeks 5–8), then weeks 9 and 11–12.

## Conventions
- Lesson writing: plain, direct, practical. Each lesson: ~10–15 min read, real exercise, 3 quiz questions
  with explanations. Only link resources that have been verified to exist.
- Lesson HTML is trusted author content rendered with dangerouslySetInnerHTML: never put user input there.
- Keep the browser-first design: the site must work if the API is down.
- Verify changes with `npm run build` and `npm run typecheck:functions` before handing over.
