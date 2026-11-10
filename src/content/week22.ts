import type { Lesson, Resource } from "./types";
import { U } from "./unis";

// Agent track, Week 22: LLMOps — running AI apps reliably and safely.
// The beginner version of MLOps (engineer track Week 21) for apps built on hosted or open models.
// Every video was checked on YouTube (channel, length, embeddable) on 10 Nov 2026 and appears nowhere else in the course.
const h = String.raw;
const yt = (id: string, title: string, len: string): Resource => ({ title, len, url: `https://www.youtube.com/watch?v=${id}` });

const V = {
  llmops: yt("cvPEiPt7HXo", "Large language model operations (LLMOps) explained — IBM Technology", "7 min"),
  azure: yt("ZVWg18AXXuE", "MLOps explained — Microsoft Azure", "14 min"),
  prompts: yt("KGyj_NJgKDY", "Prompt management deep dive — Langfuse", "6 min"),
  cicd: yt("ddDJxFnv-qs", "CI/CD explained in 5 minutes — TechWorld with Nana", "5 min"),
  langfuse: yt("2E8iTvGo9Hs", "10-minute walkthrough of Langfuse: open-source LLM observability — Langfuse", "10 min"),
  observability: yt("CAQ_a2-9UOI", "Observability vs APM vs monitoring — IBM Technology", "10 min"),
};

const R: Record<string, Resource> = {
  google: { title: "MLOps: continuous delivery and automation pipelines in machine learning — Google Cloud", url: "https://cloud.google.com/architecture/mlops-continuous-delivery-and-automation-pipelines-in-machine-learning" },
  mlopsOrg: { title: "ml-ops.org — principles and the MLOps lifecycle", url: "https://ml-ops.org" },
  actions: { title: "GitHub Actions documentation", url: "https://docs.github.com/en/actions" },
  caching: { title: "Prompt caching — Claude docs", url: "https://platform.claude.com/docs/en/build-with-claude/prompt-caching" },
};

export const week22: Lesson[] = [
{
  id: "22-1", title: "From MLOps to LLMOps: running AI apps like a professional", mins: 14,
  objectives: [
    "Explain what MLOps and LLMOps are, in plain words",
    "Name the things that change in an AI app even when your code doesn't",
    "Set up the four habits of LLMOps for one of your own apps",
  ],
  prereqs: "<p>Week 9 (calling models from code), Week 11 (evals) and Week 21 (agents running on a schedule).</p>",
  body: `
<p>You've built AI features and agents that work. The next question is the one every business asks: <em>will they keep working next month?</em></p>
<h3>Two words first</h3>
<ul>
<li><b>MLOps</b> (machine-learning operations): the practices that keep machine-learning models working in real use: tracking data, versioning models, testing before release and watching them once they're live. Teams that train their own models use it.</li>
<li><b>LLMOps</b>: the same idea for apps built on large language models. You usually don't train the model yourself, but you still have lots of moving parts to manage.</li>
</ul>
<h3>Things that change even when your code doesn't</h3>
<ul>
<li><b>The model:</b> providers release new versions and retire old ones. A newer model can be better overall and still worse at your task.</li>
<li><b>The prompt:</b> someone "improves" the system prompt on Friday and support complaints rise on Monday.</li>
<li><b>Your data:</b> the documents your RAG system reads (Month 4) change every week.</li>
<li><b>Your users:</b> they start asking things nobody tested, in new languages or formats.</li>
<li><b>Prices and limits:</b> costs and rate limits change, and a busy week can blow your budget.</li>
</ul>
<h3>The four habits of LLMOps</h3>
<ol>
<li><b>Version everything</b>: prompts, model names, settings (lesson 22.2).</li>
<li><b>Test every change</b> with your eval set before it reaches users (lesson 22.3).</li>
<li><b>Watch it live</b>: trace each request, its cost and its quality (lesson 22.4).</li>
<li><b>Be able to undo</b>: roll back to the last good version in minutes (lesson 22.4).</li>
</ol>
<p>None of this needs a big team. A solo developer with these four habits will catch problems before customers do.</p>
<div class="callout"><b>Feels like a lot?</b> Start with one app and one habit: write down today's prompt, model name and settings in a file in your repo. That alone answers "what changed?" the next time something breaks.</div>`,
  watch: [V.llmops, V.azure, U.llmops],
  read: [R.mlopsOrg, R.google],
  exercise: `<p>Pick one AI feature or agent you've built in this course. List every part of it that could change without a code change (model, prompt, settings, documents, users, prices). For each, write who would notice if it changed, and how quickly. Keep this list: you'll fix the gaps this week.</p>`,
  problems: [
    {q: h`<p>Your support bot used a model that the provider is retiring next month. The new recommended model scores higher on public benchmarks. Can you just switch?</p>`,
     a: h`<p>Not safely without testing. Public benchmarks measure general skills, not your task. Run your own eval set (Week 11) on both models, compare accuracy, cost and speed, read the failures, and then switch, ideally to a small share of users first (lesson 22.4).</p>`},
    {q: h`<p>Which of these is an LLMOps problem, not a coding bug? (a) A typo crashes the app. (b) Answers got worse after a colleague edited the system prompt. (c) The monthly bill tripled after a marketing campaign.</p>`,
     a: h`<p><b>(b) and (c).</b> Neither involves broken code: one is an untested prompt change, the other is unwatched cost. Versioning and evals catch (b); cost tracking and spend limits catch (c). (a) is an ordinary bug that tests should catch.</p>`},
  ],
  quiz: [
    {q: "LLMOps is mainly about:", o: ["Training models from scratch", "Keeping AI apps reliable as models, prompts, data and users change", "Writing prompts faster", "Buying GPUs"], a: 1, why: "It's the operating discipline for AI apps, most of which use models someone else trained."},
    {q: "Which can break your AI app without any code change?", o: ["A provider model update", "An edited system prompt", "New kinds of user questions", "All of these"], a: 3, why: "All of them change behaviour without touching your code."},
    {q: "The simplest first LLMOps habit is:", o: ["Buy a monitoring tool", "Record your prompt, model name and settings in version control", "Retrain the model", "Ignore it"], a: 1, why: "Knowing exactly what's running is the base for everything else."},
  ],
},
{
  id: "22-2", title: "Version everything: prompts, models and settings", mins: 13,
  objectives: [
    "Keep prompts, model names and settings in version control, not in code strings or a dashboard",
    "Pin model versions and plan for model retirements",
    "Link every answer to the exact version that produced it",
  ],
  prereqs: "<p>Lesson 22.1.</p>",
  body: `
<h3>Treat prompts like code</h3>
<p>Your system prompt decides your app's behaviour as much as your code does, so it deserves the same care. Move it out of a string buried in the code and into its own file, for example <code>prompts/support.v3.md</code>, committed to git. Now every change has an author, a date and a reason, and you can see exactly what changed between "it worked" and "it broke".</p>
<h3>A config file for everything else</h3>
<pre># ai-config.yaml
support_bot:
  prompt: prompts/support.v3.md
  model: claude-sonnet-5-5        # an exact model name, never "latest"
  temperature: 0.2
  max_tokens: 600
  eval_set: evals/support-cases.jsonl</pre>
<p>Your code reads this file. Changing the model or prompt is now a one-line, reviewable change, and the same file tells you what was running on any date.</p>
<h3>Pin your model</h3>
<p>Use an exact model name, not a moving alias, so the model can't change under you. Then put model retirement dates in your calendar: when a provider announces one, you have time to run your evals on the replacement (lesson 22.3).</p>
<h3>Tag every answer</h3>
<p>Log the prompt version and model name with every request, for example <code>prompt=support.v3 model=claude-sonnet-5-5</code>. When a customer complains about an answer, you can see exactly which version produced it. Tools such as Langfuse (in the video) do this and add a prompt library with history, but a file in git plus one log line is enough to start.</p>
<div class="callout"><b>Stuck on where prompts should live?</b> If non-developers (a support lead, a doctor) need to edit prompts, a prompt-management tool with history and approvals helps. If only developers edit them, files in git with pull-request review are simpler and just as safe.</div>`,
  watch: [V.prompts],
  read: [R.caching],
  exercise: `<p>For the app you chose in 22.1: move its prompt into a versioned file, create a config file with the exact model name and settings, make the code read from it, and add the prompt version and model name to your request logs. Commit with a message that explains the setup.</p>`,
  problems: [
    {q: h`<p>Your code calls the model with a name that always points to the provider's newest version. Why is that risky, and what's the fix?</p>`,
     a: h`<p>When the provider moves the alias to a new model, your app's behaviour changes overnight with no test and no record. Pin the exact model name in your config, and upgrade deliberately after your evals pass.</p>`},
    {q: h`<p>A customer complains about an answer from 12 days ago. What do you need in order to reproduce it?</p>`,
     a: h`<p>The exact prompt version, model name and settings that were live then (from git history and your config), plus the request itself and any documents retrieved (from your logs). With those you can rerun the same request and see whether the current version still gives that answer.</p>`},
  ],
  quiz: [
    {q: "Where should a production system prompt live?", o: ["Pasted inside a function", "In its own versioned file or prompt-management tool with history", "In a chat message to a colleague", "Nowhere; write it fresh each time"], a: 1, why: "Versioned prompts can be reviewed, compared and rolled back."},
    {q: "Why pin an exact model name?", o: ["It's cheaper", "So the model can't change under you without testing", "It's required by law", "It makes answers longer"], a: 1, why: "Moving aliases change behaviour without warning."},
    {q: "What should every request log include?", o: ["The user's password", "The prompt version and model name", "Nothing", "Only the time"], a: 1, why: "That lets you trace any answer back to what produced it."},
  ],
},
{
  id: "22-3", title: "Evals on every change: CI for AI apps", mins: 14,
  objectives: [
    "Run your eval set automatically on every pull request",
    "Set release gates that block a change when quality drops",
    "Grow the eval set from real failures",
  ],
  prereqs: "<p>Lessons 22.1–22.2, Week 7 (CI) and Week 11 (evals).</p>",
  body: `
<p>In Week 7 you made CI run tests on every change. In Week 11 you built an eval set. Now put them together: <b>every change to a prompt, model or setting runs the evals automatically</b>, and a bad change can't be merged.</p>
<h3>The pipeline</h3>
<ol>
<li>Someone opens a pull request that edits <code>prompts/support.v4.md</code> or the config file.</li>
<li>CI runs your eval set against the new version and the current one.</li>
<li>It posts a short report on the pull request: score before and after, cases that changed, and cost per request.</li>
<li>A <b>gate</b> decides: block the merge if the score drops by more than an agreed margin, or if any <b>critical case</b> fails.</li>
</ol>
<h3>Critical cases</h3>
<p>Some mistakes are never acceptable, whatever the average score: giving a dosage, leaking another customer's data, promising a refund the policy doesn't allow. Mark those cases as critical. One failure blocks the release, even if the overall score went up.</p>
<h3>Keep cost under control</h3>
<p>Running 200 eval cases on every small change costs money. Common tricks: run a fast subset of 30 cases on every push and the full set before merging; cache results for cases whose inputs didn't change; use prompt caching (linked below) for the shared system prompt.</p>
<h3>Grow it from real failures</h3>
<p>Every time a real user hits a bad answer, add that case (anonymised) to the eval set with the correct answer. Your evals then track the problems your users actually have, and the same failure can't come back unnoticed.</p>
<div class="callout"><b>Stuck setting this up?</b> Start without CI: a script <code>npm run evals</code> or <code>python run_evals.py</code> that prints the score and lists failures. Once it works on your machine, the CI step is just "run that script and fail if the score is below X".</div>`,
  watch: [V.cicd],
  read: [R.actions],
  exercise: `<p>For your app: write an eval script that runs your Week 11 eval set and prints the score and failures; mark at least three critical cases; then add a CI workflow that runs it on every pull request and fails if the score drops by more than 3 points or any critical case fails. Test it by opening a pull request with a deliberately worse prompt.</p>`,
  problems: [
    {q: h`<p>Prompt v4 scores 47/50 (94%) versus v3's 45/50 (90%), but one critical case ("never give a dosage") now fails. Ship it?</p>`,
     a: h`<p><b>No.</b> A critical-case failure blocks the release whatever the average says. Fix v4 so it passes the critical case too, then rerun. With only 50 cases, a 2-case improvement is also within normal noise (lesson 2.4), so it isn't strong evidence on its own.</p>`},
    {q: h`<p>Running your 200-case eval set costs about $1.20. Your team opens about 15 pull requests a week, each pushed about 4 times. Compare running the full set on every push with running 30 cases per push plus the full set once per pull request.</p>`,
     a: h`<p><b>Full set every push:</b> 15 × 4 = 60 runs × $1.20 = <b>$72 a week</b>.</p><p><b>Subset per push plus full set per PR:</b> 30 cases cost about $1.20 × 30/200 = $0.18. That's 60 × $0.18 = $10.80, plus 15 full runs × $1.20 = $18, so about <b>$29 a week</b>, less than half, with the same protection before merging.</p>`},
  ],
  quiz: [
    {q: "What should run when someone edits a production prompt?", o: ["Nothing", "The eval set, with a gate that can block the change", "Only a spell check", "A full model retrain"], a: 1, why: "Prompt changes change behaviour, so they're tested like code."},
    {q: "A critical case is:", o: ["The hardest question", "A mistake that's never acceptable, so one failure blocks release", "A case that costs the most tokens", "Any case that fails"], a: 1, why: "Some errors matter more than the average score."},
    {q: "Where do the best new eval cases come from?", o: ["Random internet questions", "Real failures from your users, anonymised", "The model itself", "Nowhere; eval sets shouldn't change"], a: 1, why: "They target the problems your users actually have."},
  ],
},
{
  id: "22-4", title: "Watching it live: tracing, cost, drift and rollbacks", mins: 15,
  objectives: [
    "Trace each request with its prompt version, tokens, cost and latency",
    "Notice drift in what users ask and how the app answers",
    "Roll out changes gradually and roll back in minutes",
  ],
  prereqs: "<p>Lessons 22.1–22.3.</p>",
  body: `
<h3>Tracing: a receipt for every request</h3>
<p>A <b>trace</b> records one request from start to finish: the user's input, the prompt version and model, any documents retrieved or tools called, the answer, the tokens used, the cost and the time taken. For agents, each step of the loop is part of the trace. With traces you can answer "why did it say that?" and "why was Tuesday so expensive?" in minutes. Tools like Langfuse (in the video) collect and display traces; a structured log line per request is enough to start.</p>
<h3>Dashboards worth having</h3>
<ul>
<li><b>Cost per day and per feature</b>, with a spend limit and an alert before you hit it.</li>
<li><b>Latency</b>: the typical time and the slowest 5%. Users feel the slow tail.</li>
<li><b>Errors and retries</b>: rate limits, timeouts and failed tool calls (lesson 9.5).</li>
<li><b>Quality signals</b>: thumbs up/down, complaints, and a weekly sample of answers scored by a person or an LLM judge.</li>
</ul>
<h3>Drift: when users change</h3>
<p>Watch what people ask, not just how you answer. If a new topic suddenly makes up 20% of questions (a new product, a policy change), your eval set probably doesn't cover it. Group questions by topic each week (an LLM can label them cheaply) and add cases for anything new.</p>
<h3>Rolling out and rolling back</h3>
<ul>
<li><b>Canary:</b> send a new prompt or model to a small share of users first (say 10%), compare their metrics with everyone else's, then increase.</li>
<li><b>Rollback:</b> because your prompt and model are in config (22.2), going back is a one-line change and a redeploy. Practise it once before you need it.</li>
<li><b>Kill switch:</b> a setting that turns the AI feature off and shows a fallback ("A person will reply soon") if something goes badly wrong.</li>
</ul>
<div class="callout"><b>Overwhelmed by dashboards?</b> Start with one log line per request (time, prompt version, model, tokens, cost, latency, outcome) and one weekly review where you read 20 random answers. That catches most problems early. Add tools later.</div>`,
  watch: [V.langfuse, V.observability],
  read: [R.google],
  exercise: `<p>This is the Week 22 build. For your app: log a trace for every request (with prompt version, model, tokens, cost, latency and outcome); set a daily spend alert; add a kill switch with a friendly fallback; then roll out a small prompt change to 10% of users (or 10% of test traffic), compare metrics, and practise a rollback. Write up what you'd watch every week.</p>`,
  problems: [
    {q: h`<p>Traces show an average of 3,000 input and 500 output tokens per request, at 2,000 requests a day, priced at $3 / $15 per million tokens. What's the daily cost, and which single change would cut it most?</p>`,
     a: h`<p><b>Input:</b> 3,000 × 2,000 = 6 million tokens × $3 = $18. <b>Output:</b> 500 × 2,000 = 1 million × $15 = $15. <b>Total about $33 a day</b>, roughly $1,000 a month.</p><p>Input is the larger share, and most of it is usually the same system prompt and context on every request, so <b>prompt caching</b> is likely the biggest single saving. Trimming retrieved documents is next.</p>`},
    {q: h`<p>You canary a new prompt to 10% of users. After two days its thumbs-down rate is 9% against 6% for everyone else. What do you do?</p>`,
     a: h`<p>Roll the canary back (one config change), then read the traces of the thumbs-down answers from the new prompt to find the pattern. Add those cases to the eval set, fix the prompt, pass the evals, and canary again. With a 10% share, also check that you had enough requests for the difference to be real, but a rise this size is worth acting on.</p>`},
  ],
  quiz: [
    {q: "A trace records:", o: ["Only errors", "One request end to end: input, versions, tool calls, answer, tokens, cost and time", "The model's training data", "User passwords"], a: 1, why: "It's the full receipt for a request."},
    {q: "A canary rollout means:", o: ["Releasing to everyone at once", "Releasing to a small share of users first and comparing", "Testing only on your laptop", "Turning the feature off"], a: 1, why: "Problems show up on a small group before everyone is affected."},
    {q: "A kill switch is for:", o: ["Deleting the database", "Turning the AI feature off quickly and showing a safe fallback", "Ending a user's session", "Speeding up the model"], a: 1, why: "It limits the damage while you fix a serious problem."},
  ],
},
];
