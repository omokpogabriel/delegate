# Delegate

A six-month course on becoming a top-tier user of AI agents.

- **Frontend:** React 19, TypeScript, Vite, React Router
- **Hosting:** Cloudflare Pages
- **Storage:** the learner's browser first, backed up to Cloudflare R2 as one JSON file per learner
- **API:** four small Cloudflare Pages Functions in `functions/api/`

No database and no passwords.

## How it works

1. **First visit:** the site asks for full name and email, plus an opt-in for updates and reminders.
2. **New learner:** they pick a secret question and answer. The site saves a JSON record to R2 and gives the browser a private save token.
3. **Returning learner on a new device:** they enter the same email, answer their secret question, and their progress and failure log are loaded and merged with anything already in that browser.
4. **While learning:** progress is saved in the browser immediately and backed up to R2 in the background, about a second after each change.
5. **If the server can't be reached:** the learner can still continue. Everything stays in the browser, and they can back it up later from the account menu.

The account menu also has **Download my progress (JSON)** and **Import a progress file**.

### Security

- The secret answer is never stored. It's lowercased and trimmed, then hashed with PBKDF2-SHA256 (100,000 iterations, random salt).
- After 5 wrong answers, restoring is locked for 15 minutes.
- Saves need the browser's save token, so knowing someone's email isn't enough to overwrite their data. Only a SHA-256 hash of each token is stored.
- R2 files are named by a SHA-256 hash of the email, not the email itself.
- The R2 bucket stays private. Only the functions can read or write it.

Secret questions are weaker than real passwords, which is fine for course progress. Don't use this pattern to protect anything sensitive.

## Data format (R2)

`learners/<sha256(email)>.json`:

```json
{
  "version": 1,
  "name": "Ada Obi",
  "email": "ada@example.com",
  "consent": { "updates": true, "at": "2026-10-28T09:00:00.000Z" },
  "createdAt": "…", "updatedAt": "…",
  "question": "What was your childhood nickname?",
  "answer": { "salt": "…", "hash": "…", "iterations": 100000 },
  "tokens": ["sha256 of each device's save token"],
  "failed": { "count": 0, "lockedUntil": null },
  "data": {
    "progress": { "L1-1": true, "t1_0": true },
    "logs": [{ "id": "…", "what": "…", "tool": "…", "why": "…", "createdAt": "…" }]
  }
}
```

Progress keys: `L<lesson id>` for lessons (e.g. `L1-2`), `t<week>_<index>` for weekly tasks (e.g. `t3_0`).

## API

| Endpoint | Body | Returns |
|---|---|---|
| `POST /api/lookup` | `{ email }` | `{ exists, question? }` |
| `POST /api/register` | `{ name, email, question, answer, updates, data }` | learner data and a save token, or `409` if the email exists |
| `POST /api/restore` | `{ email, answer }` | learner data and a save token, `401` for a wrong answer, `423` when locked |
| `PUT /api/save` | `{ email, token, data }` | `{ updatedAt }`, or `401` for a bad token |
| `GET /api/admin/subscribers` | header `Authorization: Bearer <ADMIN_KEY>` | CSV of learners who opted in to updates |

## Run locally

```bash
npm install
npm run dev          # site only; the welcome form offers "continue in this browser"
npm run pages:dev    # site + API + a local R2 bucket, at http://localhost:8788
```

To try the subscriber export locally, copy `.dev.vars.example` to `.dev.vars` and set a key.

## Deploy to Cloudflare

You need a free Cloudflare account.

**1. Create the R2 bucket**

In the Cloudflare dashboard go to **R2 → Create bucket** and name it `delegate-learners`. Or from this folder:

```bash
npx wrangler login
npx wrangler r2 bucket create delegate-learners
```

**2. Deploy the site**

*Option A, from your computer:*

```bash
npm run deploy
```

The first run asks you to create the Pages project. Accept the name `delegate`.

*Option B, from GitHub (redeploys on every push):* push this folder to a GitHub repo. In the dashboard go to **Workers & Pages → Create → Pages → Connect to Git**, pick the repo, and set:

- Build command: `npm run build`
- Build output directory: `dist`

The R2 binding (`LEARNERS` → `delegate-learners`) is read from `wrangler.toml`. If the dashboard doesn't show it under **Settings → Bindings**, add it there by hand.

**3. Turn on the subscriber export (optional)**

```bash
npx wrangler pages secret put ADMIN_KEY
```

Then download the list:

```bash
curl -H "Authorization: Bearer <your key>" https://<your-site>/api/admin/subscribers -o subscribers.csv
```

**4. Custom domain: learnai.isuxtech.com**

`isuxtech.com` stays where it is. Only the `learnai` subdomain points to Cloudflare.

1. In Cloudflare, open the Pages project, then **Custom domains → Set up a domain**. Enter `learnai.isuxtech.com` and continue. Do this before step 2: a DNS record added first returns a 522 error.
2. Find out who runs DNS for `isuxtech.com`: in Spaceship, open the domain and look at **Nameservers**.
   - Names like `ns-123.awsdns-45.com` mean DNS is on AWS Route 53. Add the record in **Route 53 → Hosted zones → isuxtech.com**.
   - Spaceship's own nameservers mean you add it in Spaceship's **Advanced DNS**.
3. Add one record:

   | Type | Name | Value | TTL |
   |---|---|---|---|
   | CNAME | `learnai` | `<your-project>.pages.dev` | Auto / 300 |

4. Back in Cloudflare, the domain shows **Active** once the record is visible, and Cloudflare issues the HTTPS certificate automatically. This usually takes minutes, occasionally a few hours.

Nothing else on `isuxtech.com` changes. Your main site on AWS keeps working.

Links like `/lesson/1-2` work on refresh with no extra setup. Cloudflare Pages serves `index.html` for unknown paths when the site has no `404.html`.

## Adding lessons

1. Write lessons in a file under `src/content/` (copy the shape of `month3.ts`).
2. Register them in `src/content/index.ts` under their week number.

Lesson bodies and exercises are HTML strings written by the course author and rendered as HTML, so only put trusted content there.

## Project layout

```
functions/
  _shared.ts                 hashing, tokens, R2 read/write, validation
  api/lookup.ts, register.ts, restore.ts, save.ts
  api/admin/subscribers.ts
src/
  content/                   all course content (outline, lessons, quizzes)
  lib/store.tsx              learner state: browser first, background backup
  lib/api.ts                 calls to the API
  components/Welcome.tsx     first-visit form and secret question
  components/Nav.tsx         account menu: backup status, download, import
  pages/                     Home, Lesson
wrangler.toml                Pages config and the R2 binding
```
