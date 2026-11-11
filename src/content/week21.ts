import type { Lesson, Resource } from "./types";

// Agent track, Week 21: deploy your agent, free or cheap.
// Free-tier facts re-checked on providers' own pages on 11 Nov 2026: Cloudflare Workers Free (100,000 requests/day,
// up to 5 cron triggers, short CPU time; waiting on network doesn't count), Workers AI (10,000 neurons/day free,
// [ai] binding, env.AI.run), `wrangler secret put`, GitHub Actions schedules (UTC by default, every 5 minutes at most),
// Oracle Always Free Arm (Ampere A1) servers, OpenRouter `:free` models with daily limits, Gemini API free tier.
// Every video was checked on YouTube (channel, length, embeddable) and appears nowhere else in the course.
// Videos with `src` go into "Go deep". "&#36;" renders as "$" (avoids JS template interpolation in YAML samples).
const yt = (id: string, title: string, len: string, src?: string): Resource =>
  ({ title, len, url: `https://www.youtube.com/watch?v=${id}`, ...(src ? { src } : {}) });

const V = {
  docker100: yt("Gjnup-PuquQ", "Docker in 100 seconds — Fireship", "2 min"),
  dockerSloth: yt("DQdB7wFEygo", "The only Docker tutorial you need to get started — The Coding Sloth", "12 min"),
  dockerNana: yt("pg19Z8LL06w", "Docker crash course for absolute beginners", "1 hr 8 min", "TechWorld with Nana"),
  workers: yt("WDhruDqb5nM", "Cloudflare Workers explained — Cloudflare Developers", "5 min"),
  ghaSecrets: yt("dPLPSaFqJmY", "Secrets and environment variables in your GitHub Action — Dev Leonardo", "8 min"),
  workers101: yt("H7Qe96fqg1M", "Learn Cloudflare Workers 101: full course for beginners", "1 hr", "Cloudflare Developers"),
  cron: yt("qzX9tpNNFJ0", "Cron jobs explained, with an example in production — Ben Davis", "5 min"),
  webhooks: yt("x_jjhcDrISk", "Top 3 things you should know about webhooks — ByteByteGo", "4 min"),
  freeApis: yt("VvJvJ0uXiVQ", "How to use AI model APIs for free with OpenRouter — The Coding Koala", "6 min"),
  oracle: yt("uyuHSFo0QQo", "Always free VM on Oracle Cloud — Rishab in Cloud", "14 min"),
  vllm: yt("q5IF2PHA5SA", "vLLM: easily deploying and serving LLMs — NeuralNine", "15 min"),
  vllmCloud: yt("rNtoDOtmoHQ", "Run any open-source LLM on the cloud with vLLM (full guide)", "7 min", "Crusoe AI"),
};

const R: Record<string, Resource> = {
  workersLimits: { title: "Cloudflare Workers limits (free plan: 100,000 requests a day)", url: "https://developers.cloudflare.com/workers/platform/limits/" },
  cronTriggers: { title: "Cron triggers — Cloudflare Workers docs", url: "https://developers.cloudflare.com/workers/configuration/cron-triggers/" },
  secrets: { title: "Secrets — Cloudflare Workers docs", url: "https://developers.cloudflare.com/workers/configuration/secrets/" },
  workersAiPricing: { title: "Workers AI pricing (10,000 neurons a day free)", url: "https://developers.cloudflare.com/workers-ai/platform/pricing/" },
  pythonWorkers: { title: "Python Workers — Cloudflare docs", url: "https://developers.cloudflare.com/workers/languages/python/" },
  ghaEvents: { title: "Events that trigger workflows, including schedule — GitHub docs", url: "https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows" },
  ghaBilling: { title: "GitHub Actions billing (free for standard runners in public repositories)", url: "https://docs.github.com/en/billing/concepts/product-billing/github-actions" },
  openrouterLimits: { title: "OpenRouter limits, including free (:free) models", url: "https://openrouter.ai/docs/api/reference/limits" },
  geminiLimits: { title: "Gemini API rate limits and free tier", url: "https://ai.google.dev/gemini-api/docs/rate-limits" },
  oracleFree: { title: "Oracle Cloud Free Tier (Always Free Arm servers)", url: "https://www.oracle.com/cloud/free/" },
  vllmDocs: { title: "vLLM documentation", url: "https://docs.vllm.ai" },
  caching: { title: "Prompt caching — Claude docs", url: "https://platform.claude.com/docs/en/build-with-claude/prompt-caching" },
};

export const week21: Lesson[] = [
{
  id: "21-1", title: "From your laptop to the internet: what deploying really means", mins: 14,
  objectives: [
    "Explain where code runs once it's deployed, and the three ways an agent gets started",
    "Keep secrets, logs and health checks right on a server",
    "Package an app with Docker so it runs the same everywhere",
  ],
  prereqs: "<p>Week 9 (calling models from code), Week 17 (an agent loop) and lesson 22.2 (versioning config).</p>",
  body: `
<p>Until now your agents have run when you typed a command on your own computer. <b>Deploying</b> means putting them on a computer that's always on and reachable, so they work while you sleep. Your aim this week: get one agent live for ₦0 a month, or very close.</p>
<h3>Three ways an agent gets started</h3>
<ul>
<li><b>On request:</b> someone sends a message or opens a page, and your code answers (a chat assistant, an API).</li>
<li><b>On a schedule:</b> it runs at set times, for example a sales summary every morning at 7am (lesson 21.3).</li>
<li><b>On an event:</b> another system tells it something happened, such as a payment arriving or a pull request opening (a webhook, lesson 21.3).</li>
</ul>
<p>Scheduled and event-driven agents are often the cheapest to run: they only use compute when there's work to do.</p>
<h3>Four things every deployment needs</h3>
<ol>
<li><b>Secrets on the server, not in code:</b> API keys go into the host's secret settings, which your code reads as environment variables (lesson 9.1).</li>
<li><b>Logs:</b> you can't see the server's screen, so write what happened, without personal data (lesson 22.4).</li>
<li><b>A health check:</b> a simple address such as <code>/health</code> that answers "ok", so you (or a free monitoring service) can tell it's alive.</li>
<li><b>A way to update and roll back:</b> deploy from git so every version is known (lesson 22.4).</li>
</ol>
<h3>Docker in plain words</h3>
<p>"It works on my machine" happens because servers have different software installed. <b>Docker</b> packages your app together with everything it needs (the right Python version, libraries, settings) into an <b>image</b>. Anywhere Docker runs, the image runs the same. Many hosts accept a Docker image directly.</p>
<pre># Dockerfile for a small Python agent
FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["python", "main.py"]</pre>
<pre>docker build -t shop-agent .
docker run --env-file .env shop-agent      # secrets come from a file that is NOT in git</pre>
<div class="callout"><b>Docker won't install on your laptop?</b> That's common on older or low-memory Windows machines. You don't need it for the free route in lesson 21.2 (Cloudflare Workers and GitHub Actions don't use your own Docker). Learn the ideas now, and use Docker when a host needs it.</div>`,
  watch: [V.docker100, V.dockerSloth, V.dockerNana],
  read: [R.secrets],
  exercise: `<p>Pick the agent you'll deploy this week (your Week 17 shop agent, Week 20 MCP morning summary, or "Ask the shop" from Month 4). Decide how it gets started (request, schedule or event), list its secrets, add a <code>/health</code> check or a clear log line, and write a Dockerfile for it. If Docker runs on your machine, build and run the image with an <code>.env</code> file.</p>`,
  problems: [
    {q: `<p>Which way of starting fits each? (a) A WhatsApp-style shop assistant. (b) "Email me failed payments every evening." (c) "When a customer pays, send them a thank-you note with delivery details."</p>`,
     a: `<p>(a) <b>On request</b>: it answers when someone messages. (b) <b>On a schedule</b>: once every evening. (c) <b>On an event</b>: the payment provider calls your webhook when a payment succeeds.</p>`},
    {q: `<p>A learner's Dockerfile contains <code>ENV ANTHROPIC_API_KEY=sk-ant-…</code> and they push the image to a public registry. What's wrong, and what should they do now?</p>`,
     a: `<p>The key is baked into the image, and anyone who downloads it can read it. Delete the key in the provider's console immediately and create a new one; remove the line; pass secrets at run time (<code>--env-file</code> or the host's secret settings) instead.</p>`},
  ],
  quiz: [
    {q: "Which start mode is usually cheapest?", o: ["Always-on servers", "Scheduled or event-driven runs that only work when needed", "Running on your laptop forever", "It makes no difference"], a: 1, why: "You only use compute when there's work."},
    {q: "Docker solves:", o: ["Model accuracy", "Differences between machines, by packaging the app with what it needs", "Internet speed", "Prompt injection"], a: 1, why: "Same image, same behaviour everywhere."},
    {q: "Where do API keys go in a deployment?", o: ["In the Dockerfile", "In the host's secret settings, read as environment variables", "In the README", "In the image name"], a: 1, why: "Never bake secrets into code or images."},
  ],
},
{
  id: "21-2", title: "Free hosting that needs no card: Cloudflare Workers and GitHub Actions", mins: 16,
  objectives: [
    "Deploy a scheduled agent on GitHub Actions for free",
    "Deploy an on-request or scheduled agent on Cloudflare Workers for free",
    "Know the limits of each free plan, and when you'd outgrow them",
  ],
  prereqs: "<p>Lesson 21.1 and lesson 7.2 (GitHub Actions basics).</p>",
  body: `
<p>Many learners in Nigeria can't sign up for hosting that asks for an international card, even on "free" plans. These two options are free and don't need one. Check the current limits on their pages before you rely on them.</p>
<h3>Option 1: GitHub Actions, for scheduled agents in Python</h3>
<p>You already used GitHub Actions for CI (lesson 7.2). It can also run your agent on a schedule. Standard runners are free for public repositories (private repositories get a monthly allowance).</p>
<pre># .github/workflows/morning-summary.yml
name: morning-summary
on:
  schedule:
    - cron: "0 6 * * *"          # 06:00 UTC = 7:00 in Lagos (WAT is UTC+1)
  workflow_dispatch:              # also lets you run it by hand
jobs:
  run:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: "3.12"
      - run: pip install -r requirements.txt
      - run: python summary.py
        env:
          ANTHROPIC_API_KEY: &#36;{{ secrets.ANTHROPIC_API_KEY }}</pre>
<p>Add the key under <b>Settings → Secrets and variables → Actions</b> in your repository. Things to know: schedules use UTC unless you set a timezone; the shortest interval is every 5 minutes; runs can start a little late at busy times; and GitHub may switch off schedules in public repositories that have had no activity for a long time, so check yours is still enabled.</p>
<h3>Option 2: Cloudflare Workers, for on-request and scheduled agents</h3>
<p>Workers run your code on Cloudflare's network, close to users, with no server to manage. The free plan allows 100,000 requests a day and a few scheduled triggers. CPU time per request is short, but time spent <em>waiting</em> for a model's reply doesn't count, which suits agents that mostly call APIs.</p>
<pre>// src/index.js
export default {
  async fetch(request, env) {                 // on request: e.g. a chat endpoint or a webhook
    if (new URL(request.url).pathname === "/health") return new Response("ok");
    const { message } = await request.json();
    return Response.json({ reply: await ask(env, message) });
  },
  async scheduled(controller, env, ctx) {     // on a schedule
    ctx.waitUntil(sendMorningSummary(env));
  },
};

async function ask(env, text) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "x-api-key": env.ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01", "content-type": "application/json" },
    body: JSON.stringify({ model: "claude-sonnet-5-5", max_tokens: 500, messages: [{ role: "user", content: text }] }),
  });
  return (await res.json()).content[0].text;
}</pre>
<pre># wrangler.toml
name = "shop-agent"
main = "src/index.js"
compatibility_date = "2026-10-01"
[triggers]
crons = ["0 6 * * *"]</pre>
<pre>npx wrangler secret put ANTHROPIC_API_KEY
npx wrangler deploy                 # gives you a free *.workers.dev address</pre>
<p>Workers are mostly JavaScript or TypeScript; Python Workers also exist (see the docs). This course's own website runs on Cloudflare, the same way.</p>
<h3>Which one?</h3>
<ul>
<li>A Python job that runs a few times a day: <b>GitHub Actions</b>.</li>
<li>Something people or other systems call (a chat endpoint, a webhook): <b>Cloudflare Workers</b>.</li>
<li>Need a database or vector search too? Workers pair with Cloudflare's free D1, KV and Vectorize (lesson 14.3).</li>
</ul>
<div class="callout"><b>Stuck deploying?</b> GitHub Actions: open the run in the Actions tab and read the first red step (lesson 7.2); a "secret not found" error usually means the secret name doesn't match. Workers: run <code>npx wrangler dev</code> to test locally first, and <code>npx wrangler tail</code> to watch live logs after deploying.</div>`,
  watch: [V.workers, V.ghaSecrets, V.workers101],
  read: [R.ghaEvents, R.ghaBilling, R.workersLimits, R.cronTriggers, R.secrets, R.pythonWorkers],
  exercise: `<p>This is the start of the Week 21 build, project "Live on a budget". Deploy your chosen agent with one of the two options: a GitHub Actions schedule for a daily job, or a Cloudflare Worker with a <code>/health</code> check (and a cron trigger if it's scheduled). Store the key as a secret, trigger it by hand once, and confirm it works from the logs.</p>`,
  problems: [
    {q: `<p>You want a summary at 8:00am Lagos time every weekday. Write the cron expression for a host that uses UTC.</p>`,
     a: `<p>Lagos is UTC+1, so 8:00 WAT is 7:00 UTC. Weekdays are 1–5 (Monday–Friday): <code>0 7 * * 1-5</code> (minute 0, hour 7, any day of the month, any month, Monday to Friday).</p>`},
    {q: `<p>Your Worker's shop assistant gets about 2,000 messages a day. Does it fit the free plan's 100,000 requests a day? What might run out first?</p>`,
     a: `<p>Yes: 2,000 is far below 100,000. What's more likely to run out is the <b>model</b> budget (API costs, or a free model's daily limit, lesson 21.4) and the short CPU time if you do heavy processing inside the Worker. Keep heavy work out of the Worker, and watch model costs.</p>`},
  ],
  quiz: [
    {q: "Which needs no international card for its free plan?", o: ["Only paid servers", "Cloudflare Workers and GitHub Actions", "Every cloud provider", "None"], a: 1, why: "Both have free plans without a card."},
    {q: "GitHub Actions schedules use which timezone by default?", o: ["Lagos time", "UTC", "Your laptop's time", "New York time"], a: 1, why: "Convert to UTC, or set a timezone."},
    {q: "On Cloudflare Workers, time spent waiting for a model's reply:", o: ["Counts fully against CPU time", "Doesn't count as CPU time", "Is not allowed", "Costs extra"], a: 1, why: "CPU time measures computing, not waiting."},
  ],
},
{
  id: "21-3", title: "Scheduled and event-driven agents: cron, webhooks and CI", mins: 14,
  objectives: [
    "Write cron schedules confidently",
    "Receive webhooks safely: verify them, respond fast, avoid double-processing",
    "Add an AI reviewer to your CI pipeline",
  ],
  prereqs: "<p>Lessons 21.1–21.2.</p>",
  body: `
<h3>Cron in five fields</h3>
<p>A cron expression is five fields: <code>minute hour day-of-month month day-of-week</code>. A star means "any".</p>
<ul>
<li><code>0 6 * * *</code>: every day at 06:00.</li>
<li><code>*/30 * * * *</code>: every 30 minutes.</li>
<li><code>0 17 * * 1-5</code>: weekdays at 17:00.</li>
<li><code>0 9 1 * *</code>: the 1st of every month at 09:00.</li>
</ul>
<p>Always check the host's timezone (usually UTC) and test with a manual run before relying on it.</p>
<h3>Webhooks: the other system calls you</h3>
<p>A <b>webhook</b> is a web address you give another service, which it calls when something happens: Paystack when a payment succeeds, GitHub when a pull request opens. Three rules:</p>
<ol>
<li><b>Verify it's genuine.</b> Services sign webhooks with a secret (Paystack, for example, sends a signature header you check with your secret key). Reject anything that fails the check; otherwise anyone could fake a "payment successful".</li>
<li><b>Respond fast, work later.</b> Reply "200 OK" quickly, then do the slow AI work afterwards (on Workers, <code>ctx.waitUntil</code>). Slow replies make services retry.</li>
<li><b>Handle repeats.</b> Services retry, so the same event can arrive twice. Record each event's id and skip ones you've already processed, so a customer isn't thanked, or refunded, twice (lesson 9.5).</li>
</ol>
<h3>AI review in CI</h3>
<p>A practical event-driven agent: on every pull request, an AI reviews the diff against your checklist (lesson 5.4) and security rules (lesson 7.5), and posts comments. Several coding agents provide a GitHub Action for this; Claude Code's is set up from the docs. Keep it as an <em>advisor</em>: humans still approve merges, and the AI's review gets the same scepticism as any reviewer's.</p>
<div class="callout"><b>Webhook never arrives?</b> Check the address is public (a <code>*.workers.dev</code> URL is fine; <code>localhost</code> isn't), look at the sending service's webhook log (most show delivery attempts and errors), and log every incoming request while testing.</div>`,
  watch: [V.cron, V.webhooks],
  read: [R.cronTriggers, R.ghaEvents],
  exercise: `<p>Add one schedule and one webhook to your deployed agent. For the webhook, use a service you have (Paystack test mode, GitHub) or a free webhook-testing site: verify the signature, reply fast, do the work afterwards, and skip duplicate event ids. Send the same test event twice and confirm it's processed once. Optional: add an AI review step to a repository's pull requests.</p>`,
  problems: [
    {q: `<p>Write cron expressions for: (a) every 15 minutes; (b) 18:00 Lagos time every Friday, on a UTC host.</p>`,
     a: `<p>(a) <code>*/15 * * * *</code>. (b) 18:00 WAT is 17:00 UTC, and Friday is 5: <code>0 17 * * 5</code>.</p>`},
    {q: `<p>Your "payment received" webhook calls the model and sends a WhatsApp-style thank-you, which takes 12 seconds. Paystack retries because it didn't get a quick reply, and the customer gets three messages. Fix it.</p>`,
     a: `<p>Reply 200 immediately after verifying the signature, then do the slow work in the background (<code>ctx.waitUntil</code> on Workers, or a queue). Store each event's reference and skip any you've already handled, so retries are harmless.</p>`},
  ],
  quiz: [
    {q: "The cron expression \"0 6 * * *\" means:", o: ["Every 6 minutes", "Every day at 06:00", "On the 6th of each month", "6 times a day"], a: 1, why: "Minute 0, hour 6, every day."},
    {q: "The first thing to do with an incoming webhook is:", o: ["Call the model", "Verify its signature", "Send an email", "Ignore it"], a: 1, why: "Otherwise anyone can fake events."},
    {q: "Why record webhook event ids?", o: ["For fun", "So retried events aren't processed twice", "To save money on storage", "Webhooks require it"], a: 1, why: "Retries happen; make them harmless."},
  ],
},
{
  id: "21-4", title: "Free and very cheap models", mins: 14,
  objectives: [
    "Find free model options that fit your agent",
    "Cut paid model costs with caching, batching, smaller models and shorter context",
    "Estimate an agent's monthly cost in naira",
  ],
  prereqs: "<p>Lessons 9.5 (cost), 11.5 (batch processing), 12.1 (choosing models) and Week 10 (open models).</p>",
  body: `
<p>Hosting can be free, but every model call costs someone something. Here's how to keep the model bill at zero or close to it.</p>
<h3>Free options (check current limits)</h3>
<ul>
<li><b>Cloudflare Workers AI:</b> runs open models on Cloudflare with a free daily allowance (10,000 "neurons" a day), right next to your Worker:
<pre># wrangler.toml
[ai]
binding = "AI"

// in your Worker
const out = await env.AI.run("@cf/meta/llama-3.3-70b-instruct-fp8-fast", {
  messages: [{ role: "user", content: "Summarise these orders: ..." }],
});</pre>
Bigger models use the allowance faster, so test how many requests a day you actually get.</li>
<li><b>Free model variants through OpenRouter:</b> some models are offered free (their ids end in <code>:free</code>), with per-minute and per-day request limits.</li>
<li><b>Provider free tiers,</b> such as Google's Gemini API free tier, with rate limits.</li>
<li><b>Your own small open model</b> (Week 10), on your computer or a free cloud server (lesson 21.5).</li>
</ul>
<p><b>Read the terms:</b> free tiers may use what you send to improve their products. Don't send customers' personal data through them (lesson 1.6).</p>
<h3>Making paid models cheap</h3>
<ul>
<li><b>Route by difficulty</b> (lesson 17.3): a small, cheap model for easy requests; the big one only when needed.</li>
<li><b>Shorter context</b> (lesson 13.1): every token you don't send is money saved.</li>
<li><b>Prompt caching</b> (lesson 9.5): the repeated system prompt costs much less.</li>
<li><b>Batch</b> non-urgent work (lesson 11.5): about half price.</li>
<li><b>Set a spend limit</b> in your provider's console, so a bug can't empty your account.</li>
</ul>
<h3>Monthly cost in naira</h3>
<p>Requests per day × average cost per request × 30, then convert at the day's exchange rate. Do it before launch, and compare with real usage after a week.</p>
<div class="callout"><b>Free model not good enough?</b> Run your eval set (Week 11) on it. Often a free or small model handles 80% of requests well; route only the hard 20% to a paid model. That mix can cut costs dramatically without hurting quality.</div>`,
  watch: [V.freeApis],
  read: [R.workersAiPricing, R.openrouterLimits, R.geminiLimits, R.caching],
  exercise: `<p>Run your agent's eval set (or 20 real tasks) on two free options (for example Workers AI and an OpenRouter <code>:free</code> model) and one paid model. Compare quality, speed and daily limits. Choose a setup (free, paid or routed) and estimate its monthly cost in naira at your expected volume. Set a spend limit on any paid account.</p>`,
  problems: [
    {q: `<p>Your agent handles 300 requests a day at about $0.004 each. Estimate the monthly cost in dollars and in naira at ₦1,500 to the dollar.</p>`,
     a: `<p>300 × $0.004 = $1.20 a day; × 30 = <b>$36 a month</b>; × ₦1,500 = <b>₦54,000 a month</b>. Routing easy requests to a free model could cut that sharply, so test it with your evals before launch.</p>`},
    {q: `<p>A free model handles 85% of your eval cases correctly; a paid model handles 95%. The failures on the free model are all multi-step questions. What setup would you choose?</p>`,
     a: `<p>Route: send simple questions to the free model and multi-step ones (detected by a quick classifier, lesson 17.3) to the paid model. Most traffic costs nothing, quality stays near the paid model's on the hard cases, and you confirm it with your eval set before switching.</p>`},
  ],
  quiz: [
    {q: "A free model tier's main catch is usually:", o: ["It's illegal", "Rate limits, and your data may be used to improve the product", "It needs a GPU", "It only speaks French"], a: 1, why: "Check limits and data terms."},
    {q: "The safest protection against a surprise model bill is:", o: ["Hoping", "A spend limit in the provider's console", "Using longer prompts", "Turning off logs"], a: 1, why: "A bug can't spend past the limit."},
    {q: "Routing by difficulty means:", o: ["Sending everything to the biggest model", "Easy requests to a cheap model, hard ones to a stronger model", "Random choice", "Using one model forever"], a: 1, why: "Pay for strength only where needed."},
  ],
},
{
  id: "21-5", title: "Self-hosting an open model: free servers and rented GPUs", mins: 14,
  objectives: [
    "Run a small open model on a free cloud server",
    "Serve a larger model on a rented GPU with vLLM",
    "Decide when self-hosting beats an API, with numbers",
  ],
  prereqs: "<p>Week 10 (open models, Ollama, vLLM) and lessons 21.1–21.4.</p>",
  body: `
<p>Sometimes you need the model on infrastructure you control: patient data that must not leave your servers (lesson 10.1), very high volumes, or a fine-tuned model of your own (lesson 10.5).</p>
<h3>Option 1: a free cloud server, CPU only</h3>
<p>Oracle Cloud's Always Free tier includes Arm-based servers that can run small open models with Ollama on CPU, slowly but for free. Sign-up usually needs a card for identity checks, even though the server is free, so this may not work for everyone. Once you have a server:</p>
<pre>curl -fsSL https://ollama.com/install.sh | sh
ollama pull qwen2.5:3b          # small models suit CPU-only servers
ollama serve                    # then call it from your agent (lesson 10.4)</pre>
<p>Never expose Ollama's port to the whole internet without protection; put it behind your own API with a key, or allow only your agent's address.</p>
<h3>Option 2: rent a GPU by the hour</h3>
<p>For bigger models or many users, rent a GPU from a cloud provider and serve it with <b>vLLM</b> (lesson 10.4), which handles many requests efficiently. You pay by the hour whether or not it's busy, so:</p>
<ul>
<li>Turn it off when you're not using it (for example, overnight batch jobs).</li>
<li>Pick the smallest GPU that fits your model (lesson 10.3 has the memory maths).</li>
<li>Compare prices across providers: they vary a lot and change often.</li>
</ul>
<h3>When does self-hosting win?</h3>
<p>Compare monthly costs honestly:</p>
<ul>
<li><b>API:</b> requests × cost per request (lesson 21.4). Zero when idle.</li>
<li><b>Self-hosted:</b> hours running × price per hour, plus your time to maintain it. The same cost whether busy or idle.</li>
</ul>
<p>At low volume, APIs (or free tiers) almost always win. Self-hosting wins when volume is high and steady, or when data rules require it.</p>
<div class="callout"><b>Is this lesson necessary for my capstone?</b> Probably not. Most capstones run perfectly well on free hosting with a free or cheap API model. Learn this so you can make the decision with numbers when a client asks "can we run it ourselves?".</div>`,
  watch: [V.oracle, V.vllm, V.vllmCloud],
  read: [R.oracleFree, R.vllmDocs],
  exercise: `<p>This completes the Week 21 build. Make the decision for your deployed agent with numbers: estimate monthly cost with (a) your current API or free model, (b) a free CPU server running a small model, and (c) a rented GPU running a larger one. If you can, try option (b) for real and compare quality on 10 eval cases. Publish your "Live on a budget" write-up: what's deployed, how it's started, its monthly cost in naira, and your self-hosting decision.</p>`,
  problems: [
    {q: `<p>A rented GPU costs $0.80 an hour. Running it 24/7 for a month costs how much? If your API bill for the same work is $36 a month, which do you choose?</p>`,
     a: `<p>$0.80 × 24 × 30 = <b>$576 a month</b>, 16 times the API bill. Choose the API. Self-hosting would only win at much higher volume, if you could switch it off most of the time, or if data rules required it.</p>`},
    {q: `<p>A clinic's patient notes must stay on hardware it controls, at about 300 notes a day. What do you recommend?</p>`,
     a: `<p>A small or mid-sized open model on the clinic's own computer or a server it controls (Week 10), chosen with your Month 3 eval method, not a public API. 300 notes a day is light work, so modest hardware may be enough; measure speed and accuracy first (lesson 12.2), and keep a human checking critical cases.</p>`},
  ],
  quiz: [
    {q: "A free CPU-only server is best for:", o: ["Very large models at high speed", "Small open models at low volume", "Training models", "Video generation"], a: 1, why: "CPU is slow; keep models small."},
    {q: "A rented GPU's cost is mainly driven by:", o: ["Number of users", "Hours it's running, busy or not", "Prompt length", "The day of the week"], a: 1, why: "You pay for time, so turn it off when idle."},
    {q: "Self-hosting usually beats APIs when:", o: ["Volume is tiny", "Volume is high and steady, or data must stay with you", "You want it set up in 5 minutes", "Never"], a: 1, why: "Fixed costs pay off only at scale or for compliance."},
  ],
},
];
