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
- Two tracks, each a 24-week course built by `makeTrack()` in `src/content/index.ts`; `useTrack()` picks one from the URL:
  - **Agent user** (`/`, `/lesson/:id`): `course.ts` outline, lessons in `month1.ts` (weeks 1–4) and `month3.ts` (week 10)
  - **AI engineer** (`/engineer`, `/engineer/lesson/:id`): `engineer/course.ts` outline, lessons in `engineer/week1.ts` (registered in `engineer/index.ts`)
- `unis.ts`: verified university lectures (Stanford, MIT, Harvard, Berkeley). `embed:false` = publisher disabled embedding, so the page links out
- `lectures.ts`: upgrades for agent-track lessons, merged by lesson id. On the agent track, university lectures (any video with `src`), `deepNotes` and problem sets go into the collapsed "Go deep" section before the exercise; `notes` (beginner help) stays in the lesson. Go deep is optional and never counts towards progress (key `D<id>`)
- Maths: write `\( \)` / `\[ \]` inside `String.raw` (h`...`) strings; rendered with KaTeX by `src/lib/math.ts`
- Learner state, local storage and background sync: `src/lib/store.tsx`
- API client: `src/lib/api.ts`
- First-visit form and secret question: `src/components/Welcome.tsx`
- Pages: `src/pages/Home.tsx`, `src/pages/Lesson.tsx`
- Help button and panel (quick answers + message form): `src/components/Help.tsx`; answers and reply-time text in `src/content/help.ts`
- Styles: `src/styles.css`. Dark "studio" theme is the default (tokens in `:root`); light theme lives in `:root[data-theme="light"]`.
  The final "Studio theme" block adds glass cards, the hero grid and light beam. Fonts: Geist + Geist Mono, self-hosted via @fontsource-variable.
- API: `functions/api/{lookup,register,restore,save}.ts`, `functions/api/admin/subscribers.ts` (CSV, needs `ADMIN_KEY`)
- Feedback: `functions/api/feedback.ts` saves to R2 `feedback/` and emails learn@isuxtech.com via Resend (`RESEND_API_KEY`); UI in `src/components/Feedback.tsx` and `/feedback`. Setup in README.
- Help messages: `functions/api/help.ts` saves to R2 `messages/<iso>-<id>.json` (honeypot + 5/hour per IP);
  `functions/api/admin/messages.ts` lists them (JSON, or `?format=csv`; needs `ADMIN_KEY`)
- Shared server logic and the R2 record schema: `functions/_shared.ts`

## Progress keys
`L<lessonId>` for lessons (e.g. `L1-2`), `t<week>_<index>` for weekly tasks (e.g. `t3_0`). Don't rename these:
learners' saved progress depends on them. The AI engineer track adds an `e` prefix (`Le1-2`, `te3_0`).

## Status
- Agent track: lessons for weeks 1–10 (39 lessons), all with objectives and problem sets; weeks 5–10 also have "Stuck?" callouts and plain-English explanations of new terms.
- AI engineer track: outline for all 24 weeks, each anchored to a named lecture; full lecture notes for Week 1 only.
- Next likely work: AI engineer weeks 2–4 (probability, gradient descent, logistic regression), then agent-track weeks 11–12.

## Lecture standard
Each lecture: learning objectives, prerequisites, rigorous notes with worked examples and the maths written out,
a university lecture (verify channel, title, length and embeddability before adding), an exercise,
2–4 problems with worked solutions (check the arithmetic), and a 3-question quiz.

## Conventions
- Lesson writing: plain, direct, practical. Each lesson: ~10–15 min read, real exercise, 3 quiz questions
  with explanations. Only link resources that have been verified to exist.
- Lesson HTML is trusted author content rendered with dangerouslySetInnerHTML: never put user input there.
- Keep the browser-first design: the site must work if the API is down.
- Verify changes with `npm run build` and `npm run typecheck:functions` before handing over.

## Go deep writing rule
Plain English first, then the formula, then what every symbol means, then a small worked example, then why it matters.
Worked solutions go step by step with the numbers shown. Keep the maths correct: explain it, never drop it.

## Videos
- Agent-track core videos live in `src/content/videos.ts` (by lesson id). Every lesson must have at least one, on its topic.
- No video may appear in more than one lesson, core or Go deep. Check channel, length and embedding before adding one.
