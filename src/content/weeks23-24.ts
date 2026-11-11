import type { Lesson, Resource } from "./types";

// Agent track, Weeks 23–24: the capstone. Pick a real problem with real users, deploy on a budget, run it
// unattended for at least two weeks, measure, fix, demo. Draws on every month of the course.
// Every video was checked on YouTube (channel, length, embeddable) on 11 Nov 2026 and appears nowhere else in the course.
// Videos with `src` go into "Go deep".
const yt = (id: string, title: string, len: string, src?: string): Resource =>
  ({ title, len, url: `https://www.youtube.com/watch?v=${id}`, ...(src ? { src } : {}) });

const V = {
  talkUsers: yt("z1iF1c8w5Lg", "How to talk to users — Y Combinator Startup School", "18 min"),
  testIdea: yt("sxD67gRYguY", "How to test any business or product idea with real customers — Rick Kettner", "11 min"),
  userInterview: yt("qAws7eXItMk", "How to run a user interview — Emmett Shear", "46 min", "Y Combinator · Startup School lecture"),
  mvp: yt("YwEEV0wHnaA", "How to create an MVP, step by step — Rob Walling", "10 min"),
  smallBiz: yt("z8cwJhwKoNk", "How AI agents for small businesses actually work (and how to offer them) — Jason Wardrop", "16 min"),
  hitlIbm: yt("9iS-YYLIXiw", "What is human in the loop with AI? — IBM Technology", "11 min"),
  hitlGoogle: yt("qeuRQAityB8", "What is human-in-the-loop? — Google Cloud Tech", "5 min"),
  hitlAgents: yt("cmEJ-5zYKHA", "Why AI agents need a human in the loop now — IBM Technology", "7 min"),
  feedback: yt("MT4Ig2uqjTc", "How to talk to users — Eric Migicovsky, Y Combinator", "32 min"),
  pivot: yt("kmfC-i9WgH0", "Minimum viable product and pivoting — CrashCourse Business", "11 min"),
  demo: yt("Cxl_3ANnE0A", "How to give a kick-ass demo — Stephen Lead, Ignite Sydney", "5 min"),
  freelance: yt("CRYea6gFWgk", "If I started AI/ML freelancing in 2026, I'd do this — Dave Ebbelaar", "16 min"),
  aiEngineer: yt("oHu_xWe0agI", "A practical guide to becoming an AI engineer — CodeHead", "5 min"),
};

const R: Record<string, Resource> = {
  effective: { title: "Building effective agents — Anthropic", url: "https://www.anthropic.com/research/building-effective-agents" },
  agentEvals: { title: "Demystifying evals for AI agents — Anthropic", url: "https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents" },
  hamel: { title: "Your AI product needs evals — Hamel Husain", url: "https://hamel.dev/blog/posts/evals/" },
  workersLimits: { title: "Cloudflare Workers limits (free plan)", url: "https://developers.cloudflare.com/workers/platform/limits/" },
};

export const week23: Lesson[] = [
{
  id: "23-1", title: "Choosing your capstone: a real problem for real people", mins: 14,
  objectives: [
    "Find a problem worth solving by talking to the people who have it",
    "Scope a capstone you can ship in two weeks and run for two more",
    "Get consent and set expectations with your users",
  ],
  prereqs: "<p>Months 1–5 and week 21. This is where everything comes together.</p>",
  body: `
<p>Five months ago you learned what a language model is. Now you'll build something real people use, run it without you watching, and prove what it does with numbers. That's the capstone, and it's what employers and clients will ask about.</p>
<h3>Start with people, not technology</h3>
<p>The most common capstone mistake is starting with "I want to build an agent with RAG and MCP" and then looking for a use. Start instead with a person who has a repetitive, annoying problem. Talk to three or four of them. Ask about the last time the problem happened, what they did, and what it cost them, not "would you use my app?" (people say yes to be polite).</p>
<h3>Ideas that fit this course and Nigeria</h3>
<ul>
<li><b>A shop's customer assistant</b> that answers prices, stock and delivery questions from the shop's own documents (Month 4), handing complex cases to staff.</li>
<li><b>A morning business summary</b>: yesterday's sales and failed payments from Paystack (test mode first) or a sales sheet, sent every day (weeks 20–21).</li>
<li><b>A clinic or school front desk helper</b> for public information: opening hours, fees, requirements, what to bring.</li>
<li><b>An invoice and receipt reader</b> for a small business's bookkeeping (week 9), with a person checking anything above a threshold.</li>
<li><b>A code-review or documentation agent</b> for a development team you're part of (Months 2 and 6).</li>
</ul>
<h3>Scope it to ship</h3>
<p>One user group, one job, done well. You'll have about two weeks to build and two to run and improve. "Answer the shop's 20 most common questions accurately, with a handover for everything else" is a capstone. "Automate the whole business" is not.</p>
<h3>Consent and expectations</h3>
<ul>
<li>Users should know they're talking to an AI, what it can and can't do, and how to reach a person.</li>
<li>Get the business owner's agreement for the documents and data you use, in writing (a WhatsApp message is fine).</li>
<li>Handle personal data under lesson 1.6's rules and the NDPA.</li>
</ul>
<div class="callout"><b>Can't find users?</b> Look closer to home: a relative's shop, your church or mosque's office, a student association, your current team at work. Real users who know you are easier to recruit and give honest feedback. Three engaged users beat thirty indifferent ones.</div>`,
  watch: [V.talkUsers, V.testIdea, V.userInterview],
  read: [R.effective],
  exercise: `<p>Talk to at least three people who have the problem you're considering, using the advice in the videos. Write a one-page capstone brief: the problem in their words, who your users are (named, with their agreement), the one job your agent will do, what's out of scope, how you'll get consent, and what "success after two weeks" means in numbers.</p>`,
  problems: [
    {q: `<p>Rewrite this capstone idea so it's shippable: "An AI that runs my uncle's provisions shop."</p>`,
    a: `<p>For example: "A WhatsApp-style assistant for my uncle's provisions shop in Surulere that answers customers' price, stock and opening-hours questions from his price list, and passes orders and complaints to him. Success: 80% of customer questions answered correctly without him, measured over two weeks." One user group, one job, a measurable goal.</p>`},
    {q: `<p>In interviews, you ask shop owners "Would you use an AI assistant for customer questions?" and everyone says yes. Why isn't that evidence, and what should you ask instead?</p>`,
     a: `<p>People are polite and hypothetical questions cost them nothing. Ask about past behaviour: "How many customer messages did you answer yesterday? Which questions come up most? How long does it take? What happens when you're busy?" Real numbers and frustrations show whether the problem is worth solving.</p>`},
  ],
  quiz: [
    {q: "The best starting point for a capstone is:", o: ["The newest technology", "A real person with a repetitive, costly problem", "Whatever is trending online", "The biggest model"], a: 1, why: "Real problems make real projects."},
    {q: "A good capstone scope is:", o: ["Automate an entire business", "One user group, one job, done well", "As many features as possible", "No users, just a demo"], a: 1, why: "Narrow and finished beats broad and broken."},
    {q: "Users of your agent should know:", o: ["Nothing", "That it's AI, what it can do, and how to reach a person", "Only your name", "The model's size"], a: 1, why: "Honesty builds trust and is often required."},
  ],
},
{
  id: "23-2", title: "Designing and building it: the simplest thing that works", mins: 14,
  objectives: [
    "Choose an architecture from the course's building blocks",
    "Write evals before code, and a budget before launch",
    "Build in slices with your agent workflow",
  ],
  prereqs: "<p>Lesson 23.1.</p>",
  body: `
<p>You now have a toolbox. The skill is choosing the <em>fewest</em> tools that solve the problem (lesson 17.1).</p>
<h3>Pick the building blocks</h3>
<ul>
<li><b>Answering from documents?</b> RAG with citations and refusals (Month 4).</li>
<li><b>Fixed steps on a schedule?</b> A workflow, not an agent (lessons 17.1 and 21.3).</li>
<li><b>Investigating or acting across systems?</b> An agent loop with limits (week 17), tools via MCP if several apps need them (Month 5).</li>
<li><b>Mixed requests?</b> Routing first (lesson 17.3), with a human handover for anything risky.</li>
</ul>
<h3>Write these before any code</h3>
<ol>
<li><b>A spec</b> (Week 3): what it does, what it never does, the handover rules.</li>
<li><b>An eval set</b> (Week 11): 30–50 realistic cases from your user interviews, including critical cases and things it should refuse.</li>
<li><b>A budget</b> (lesson 21.4): expected requests per day, cost per request, monthly total in naira, and a spend limit.</li>
<li><b>A risk list</b>: the three worst things it could do (a wrong price, leaking a customer's details, promising a refund) and the control for each, in code, not just the prompt (lesson 17.2).</li>
</ol>
<h3>Build in slices</h3>
<p>Use your Month 2 workflow: plan mode, small slices, tests, commits, your project memory file, and your eval set run after every meaningful change (lesson 22.3). Deploy the first working slice early (week 21), even to just yourself, so deployment surprises appear in week 1, not on launch day.</p>
<div class="callout"><b>Tempted to add one more feature?</b> Write it on a "later" list. A capstone that does one job reliably for two weeks is far more impressive, and far more useful to its users, than one with five half-working features.</div>`,
  watch: [V.mvp, V.smallBiz],
  read: [R.effective, R.hamel],
  exercise: `<p>Write your spec, 30+ case eval set, budget and risk list. Choose and sketch your architecture (boxes and arrows). Build the first slice and deploy it somewhere real (week 21), even if only you can reach it yet. Run your evals on it and record the baseline.</p>`,
  problems: [
    {q: `<p>A capstone answers a clinic's public questions (hours, fees, requirements). A learner plans: an agent loop, three MCP servers, a knowledge graph and fine-tuning. What would you suggest?</p>`,
     a: `<p>Much simpler: RAG over the clinic's public documents with citations and honest refusals (Month 4), plus routing that sends anything medical to a person. No agent loop, MCP, graph or fine-tuning is needed for answering public FAQs. Add complexity only if evals show a gap.</p>`},
    {q: `<p>Write a risk-list entry for "the assistant quotes a wrong price".</p>`,
     a: `<p><b>Risk:</b> a customer is quoted the wrong price and disputes the charge. <b>Controls:</b> prices come only from the indexed price list with a citation (lesson 15.3); an automatic check that any price in the answer appears in the cited chunk; re-index and rerun price test cases whenever the list changes (lesson 16.3); the reply says "prices confirmed at checkout".</p>`},
  ],
  quiz: [
    {q: "When choosing architecture, prefer:", o: ["The most advanced techniques", "The fewest building blocks that solve the problem", "Whatever is newest", "Fine-tuning first"], a: 1, why: "Simple systems are cheaper and more reliable."},
    {q: "What should exist before you write code?", o: ["A logo", "A spec, an eval set, a budget and a risk list", "A pitch deck", "Nothing"], a: 1, why: "They define success, cost and safety up front."},
    {q: "Why deploy the first slice early?", o: ["To impress people", "So deployment problems show up early, not at launch", "It's required", "To save electricity"], a: 1, why: "Surprises are cheaper early."},
  ],
},
{
  id: "23-3", title: "Launching with monitoring from day one", mins: 13,
  objectives: [
    "Run a pre-launch checklist that covers quality, safety, cost and recovery",
    "Design the human handover so it's genuinely safe",
    "Do a small soft launch before the real one",
  ],
  prereqs: "<p>Lessons 23.1–23.2 and week 22 (LLMOps).</p>",
  body: `
<h3>Pre-launch checklist</h3>
<ul>
<li><b>Quality:</b> eval set passes your threshold; zero critical failures (lesson 22.3).</li>
<li><b>Tracing:</b> every request logged with prompt version, model, tokens, cost, latency and outcome, without personal data (lesson 22.4).</li>
<li><b>Cost:</b> spend limit set; a daily cost alert (lesson 21.4).</li>
<li><b>Safety:</b> risky actions limited in code; prompt-injection test passed (lessons 7.5 and 19.4).</li>
<li><b>Recovery:</b> rollback practised; a kill switch with a friendly fallback message (lesson 22.4).</li>
<li><b>Health:</b> a health check you (or a free uptime monitor) can see (lesson 21.1).</li>
<li><b>Honesty:</b> users told it's AI, what it does, and how to reach a person (lesson 23.1).</li>
</ul>
<h3>The human in the loop</h3>
<p>Decide exactly when a person takes over: money above a threshold, complaints, anything medical or legal, low-confidence answers, and whenever the user asks. Then make the handover real: the person is notified (an email, a message), the user is told who will reply and roughly when, and you check how many handovers were answered.</p>
<h3>Soft launch</h3>
<p>Before announcing it, run it for 2–3 days with one or two friendly users who know it's new. Read <em>every</em> conversation. You'll find surprises that no eval caught: questions in unexpected formats, a document you forgot, a handover that went nowhere. Fix them, then launch to your full group.</p>
<div class="callout"><b>Nervous about launching?</b> That's normal and healthy. Your checklist exists so that when something goes wrong (it will), it's small, you see it quickly, and you can switch it off or roll back in minutes. That's what professional launches look like.</div>`,
  watch: [V.hitlIbm, V.hitlGoogle],
  read: [R.agentEvals],
  exercise: `<p>Work through the checklist and fix every gap. Define your handover rules in writing and test each one (send a complaint, a high-value request and "I want a person"). Soft-launch to 1–2 users for 2–3 days, read every conversation, fix what you find, then launch to your full user group and start the two-week run.</p>`,
  problems: [
    {q: `<p>During the soft launch, three users asked for a person, and the assistant said "A staff member will reply soon", but nobody was notified. What's wrong, and how do you fix it?</p>`,
     a: `<p>The handover only existed in the reply text, not in reality. Fix it in code: a handover triggers a real notification to a named person (email or message) with the conversation, and the user gets a realistic time ("within 2 hours during shop hours"). Add a test and track handovers answered vs not.</p>`},
    {q: `<p>Why read every conversation during the soft launch, when you'll only sample later?</p>`,
     a: `<p>Early on, volume is tiny and surprises are most likely: new phrasing, missing documents, broken handovers. Reading everything finds them fast and cheaply. Once the obvious problems are fixed and volume grows, a weekly sample plus your metrics is enough.</p>`},
  ],
  quiz: [
    {q: "A kill switch is for:", o: ["Deleting data", "Turning the AI off quickly and showing a safe fallback", "Restarting the server daily", "Ending conversations early"], a: 1, why: "It limits damage while you fix things."},
    {q: "A real human handover requires:", o: ["A nice message only", "Notifying a named person and telling the user when they'll hear back", "Ignoring the request", "A bigger model"], a: 1, why: "The handover must actually reach someone."},
    {q: "A soft launch means:", o: ["Launching quietly to everyone", "Running with 1–2 friendly users first and reading every conversation", "Not launching", "Launching without monitoring"], a: 1, why: "Small, close, early learning."},
  ],
},
{
  id: "23-4", title: "Running it unattended: routines, incidents and rollbacks", mins: 13,
  objectives: [
    "Keep a light daily and weekly routine for a live AI system",
    "Handle an incident calmly, from detection to write-up",
    "Make changes during the run without breaking it",
  ],
  prereqs: "<p>Lessons 23.1–23.3.</p>",
  body: `
<p>"Unattended" doesn't mean ignored. It means the system works without you <em>doing</em> its job, while you keep an eye on it.</p>
<h3>A light routine</h3>
<ul>
<li><b>Daily (5 minutes):</b> check the health check, yesterday's cost, errors, and handovers that weren't answered.</li>
<li><b>Weekly (30–60 minutes):</b> read 20 random conversations; label them right or wrong; update your running accuracy; add new failure cases to the eval set (lesson 22.3).</li>
</ul>
<h3>When something goes wrong</h3>
<ol>
<li><b>Contain:</b> if users are being harmed (wrong prices, leaked data), use the kill switch or roll back first, investigate second.</li>
<li><b>Tell people:</b> let the business owner know what happened and what you did.</li>
<li><b>Find the cause</b> from traces and logs (lesson 22.4).</li>
<li><b>Fix and prove it:</b> add a test case that reproduces it, fix, run evals, release with a canary.</li>
<li><b>Write a short incident note:</b> what happened, impact, cause, fix, and what will stop it recurring. No blame; just learning.</li>
</ol>
<h3>Changing it during the run</h3>
<p>You'll want to fix things mid-run. That's fine, but every change goes through your LLMOps habits: versioned, evaluated, rolled out carefully, and recorded with its date so you can see its effect in the numbers (lesson 22.2). Don't change several things at once (lesson 2.4).</p>
<div class="callout"><b>Something broke at night?</b> That's exactly what the kill switch and fallback message are for. Switch it off, let the fallback tell users a person will reply, sleep, and investigate in the morning with fresh eyes. A calm, well-handled incident is a strong story for your write-up.</div>`,
  watch: [V.hitlAgents],
  read: [R.agentEvals],
  exercise: `<p>Run your capstone for at least two weeks (it's fine if this continues past week 24). Keep a daily log (cost, errors, unanswered handovers) and do the weekly review. Record every change with its date, and write an incident note for anything that went wrong.</p>`,
  problems: [
    {q: `<p>On day 6 you see the assistant has been quoting last month's delivery fees since a price change two days ago. Walk through your response.</p>`,
     a: `<ol><li><b>Contain:</b> update and re-index the delivery document now (or switch the feature off if you can't immediately).</li><li><b>Tell</b> the owner which customers may have been quoted wrong fees.</li><li><b>Cause:</b> the document changed but wasn't re-indexed.</li><li><b>Fix and prove:</b> add a test case per fee, automate re-indexing on document changes.</li><li><b>Note:</b> write the incident up for your final report.</li></ol>`},
    {q: `<p>Your weekly sample shows accuracy dropped from 88% to 79%, and you changed both the prompt and the model on the same day. What lesson does this teach, and what do you do now?</p>`,
     a: `<p>Two changes at once hide which one caused the drop (lesson 2.4). Roll back one change (start with the model), rerun your evals, and compare. Then reapply changes one at a time with an eval run between them, each with a dated record.</p>`},
  ],
  quiz: [
    {q: "The first step in an incident that's harming users is:", o: ["Find the root cause", "Contain it: kill switch or rollback", "Write the report", "Wait and see"], a: 1, why: "Stop the harm, then investigate."},
    {q: "A good weekly review includes:", o: ["Nothing if there were no complaints", "Reading a random sample of conversations and updating accuracy", "Changing the model every week", "Deleting logs"], a: 1, why: "Silent failures only show up when you look."},
    {q: "Incident notes should be:", o: ["Blame-focused", "Blameless: what happened, cause, fix, prevention", "Secret", "Skipped if the fix was quick"], a: 1, why: "The goal is learning, not blame."},
  ],
},
];

export const week24: Lesson[] = [
{
  id: "24-1", title: "Measuring the run: accuracy, cost and human interventions", mins: 13,
  objectives: [
    "Compute accuracy, cost and intervention rates from two weeks of real use",
    "Combine numbers with what users actually said",
    "Present results honestly, including uncertainty",
  ],
  prereqs: "<p>Week 23, and your two-week run under way.</p>",
  body: `
<h3>The four numbers</h3>
<ol>
<li><b>Accuracy on real traffic:</b> from your weekly labelled samples (lesson 23.4). With 40 labelled conversations, report it with its uncertainty (lesson 2.4).</li>
<li><b>Cost:</b> total and per conversation, in naira and dollars, and projected per month.</li>
<li><b>Human interventions:</b> how often a person had to step in (handovers plus corrections), and why. This shows how much work the agent really saved.</li>
<li><b>Safety:</b> incidents and critical errors, with what you did about each.</li>
</ol>
<h3>What users said</h3>
<p>Numbers tell you what happened; people tell you why it mattered. Talk to two or three users at the end of the run: what did they use it for, what annoyed them, would they keep it? The business owner's answer to "would you keep paying for this, or keep using it?" is the most honest success measure there is.</p>
<h3>Honest framing</h3>
<p>"87% of a random sample of 40 conversations were answered correctly (roughly ±10 points), 12% needed a person, 0 critical errors after day 6's fix, ₦2,300 for two weeks" is a strong, credible result, more convincing than "it works great".</p>
<div class="callout"><b>Numbers lower than you hoped?</b> Report them anyway, with what you learned and changed. A clear before-and-after (for example, 71% in week one and 87% in week two after fixing the top failure modes) is exactly the evidence that shows you can run AI in the real world.</div>`,
  watch: [V.feedback],
  read: [R.hamel],
  exercise: `<p>At the end of your two-week run, compute the four numbers, with accuracy from at least 40 labelled real conversations. Interview two or three users and the business owner. Write a one-page results summary with numbers, uncertainty and quotes.</p>`,
  problems: [
    {q: `<p>Over two weeks: 520 conversations, 61 handed to a person, total model cost $3.10. You labelled 40 random conversations and 34 were right. Compute the intervention rate, cost per conversation and sampled accuracy.</p>`,
     a: `<p><b>Intervention rate:</b> 61 / 520 ≈ <b>11.7%</b>. <b>Cost per conversation:</b> $3.10 / 520 ≈ <b>$0.006</b> (well under ₦10). <b>Accuracy:</b> 34 / 40 = <b>85%</b>, with a standard error of about √(0.85 × 0.15 / 40) ≈ 5.6 points, so roughly 74–96%.</p>`},
    {q: `<p>The owner says "It's nice, but I still answer most customers myself." Your numbers say 88% of conversations needed no person. How do you reconcile these?</p>`,
     a: `<p>Look closer: maybe most customers still message the owner directly instead of the assistant (an adoption problem, not an accuracy one), or the 12% handed over are the time-consuming ones. Ask which conversations he still handles and why. The answer tells you whether to improve the agent or how customers find it.</p>`},
  ],
  quiz: [
    {q: "Accuracy on real traffic comes from:", o: ["Your original eval set only", "Labelling a random sample of real conversations", "Asking the model", "Counting messages"], a: 1, why: "Real traffic differs from test cases."},
    {q: "The intervention rate shows:", o: ["Server speed", "How often a person had to step in", "Model size", "Number of users"], a: 1, why: "It measures the work actually saved."},
    {q: "Which result is most credible?", o: ["'It works great'", "A sampled accuracy with uncertainty, costs, interventions and incidents", "A single headline number", "A screenshot"], a: 1, why: "Specific, honest evidence."},
  ],
},
{
  id: "24-2", title: "Fixing the top three failure modes", mins: 12,
  objectives: [
    "Find your three most costly failure modes from real usage",
    "Fix them safely and prove the fix with evals",
    "Decide what to improve next, or whether to change direction",
  ],
  prereqs: "<p>Lesson 24.1 and lesson 11.5 (error analysis).</p>",
  body: `
<h3>Find the top three</h3>
<p>Go through every wrong answer, handover and incident from the run. Write a one-line note for each, group them into categories, and rank the categories by <b>cost</b> (how many times × how bad), not just count. Ten wrong opening-hours answers may matter less than one wrong price on a large order.</p>
<h3>Fix each properly</h3>
<ol>
<li>Turn real examples into eval cases (anonymised).</li>
<li>Fix the cause, not the symptom: missing documents, a confusing tool description, a missing handover rule, a weak chunk (Months 4–5).</li>
<li>Run the full eval set to check you didn't break anything else.</li>
<li>Release with a canary or a short trial (lesson 22.4), and note the date.</li>
</ol>
<h3>Improve, or change direction?</h3>
<p>Sometimes the run shows the real problem is different from the one you solved: customers mostly want to <em>order</em>, not ask questions; staff want a summary, not a chatbot. That's a valuable finding. In your write-up, say what you'd build next and why. Changing direction based on evidence is what good product builders do.</p>
<div class="callout"><b>Can't decide which failures matter most?</b> Ask the business owner to rank your list. They know which mistakes cost money or customers. Their ranking plus your counts gives you the top three.</div>`,
  watch: [V.pivot],
  read: [R.hamel, R.agentEvals],
  exercise: `<p>Rank all failures from your run by cost, pick the top three, and fix each with new eval cases, a full eval run and a careful release. Record before-and-after numbers for each fix. Write two paragraphs on what you'd build next, and whether the run suggests a change of direction.</p>`,
  problems: [
    {q: `<p>Failures over two weeks: 14 "didn't understand Pidgin", 2 "quoted wrong price", 9 "gave up on long messages", 5 "handover not answered". Rank the top three by cost and explain.</p>`,
     a: `<p>A reasonable ranking: <b>(1) wrong prices</b>: only 2, but each can cost money and trust; <b>(2) handovers not answered</b>: customers were promised a person and got nobody; <b>(3) Pidgin</b>: frequent, and it affects many customers. Long messages come fourth. Confirm with the owner's own ranking.</p>`},
    {q: `<p>You fix the Pidgin problem by adding examples. Your Pidgin cases improve, but two English price questions now fail. What happened, and what do you do?</p>`,
     a: `<p>The change had a side effect your full eval run caught, exactly why you run all cases, not only the new ones. Adjust the fix (for example, add the Pidgin examples to a routing step or a separate prompt section), rerun everything, and release only when both groups pass.</p>`},
  ],
  quiz: [
    {q: "Failures should be ranked by:", o: ["Count only", "Count × how much each one costs", "Alphabetical order", "Which is easiest to fix"], a: 1, why: "Rare but costly errors can matter most."},
    {q: "After fixing one problem you should:", o: ["Ship immediately", "Run the full eval set to catch side effects", "Only test the fixed case", "Change the model too"], a: 1, why: "Fixes can break other things."},
    {q: "If the run shows users want something different, you should:", o: ["Ignore it", "Report it and propose what to build next", "Hide it from the write-up", "Delete the project"], a: 1, why: "Evidence-based change is a strength."},
  ],
},
{
  id: "24-3", title: "The demo, the final write-up, and what comes next", mins: 14,
  objectives: [
    "Give a short, convincing demo of your capstone",
    "Publish a final write-up that works as a portfolio piece",
    "Plan your next steps: a job, clients, or deeper study",
  ],
  prereqs: "<p>Lessons 24.1–24.2.</p>",
  body: `
<h3>The demo (3–5 minutes)</h3>
<ol>
<li><b>The problem,</b> in the user's words (one sentence, maybe a quote).</li>
<li><b>A real interaction,</b> live or recorded: a typical request answered well, with its source.</li>
<li><b>A hard case handled well:</b> a refusal, a handover, or a caught mistake.</li>
<li><b>The numbers:</b> accuracy, interventions, cost per month in naira.</li>
<li><b>What you learned</b> and what's next.</li>
</ol>
<p>Practise it twice. Have a recorded backup in case the live demo fails; that's what professionals do.</p>
<h3>The final write-up</h3>
<ul>
<li>The problem and users, with the owner's permission to name them.</li>
<li>Architecture (one diagram) and why you kept it simple.</li>
<li>Evals, launch checklist, and how you ran it unattended.</li>
<li>Results: the four numbers, user quotes, before and after for your top-three fixes.</li>
<li>An incident and how you handled it.</li>
<li>Cost, and how you kept it low (week 21).</li>
<li>Links: repository (no secrets or real customer data), demo video, live link if it's public.</li>
</ul>
<p>Together with your monthly write-ups and your failure log, this is six months of public evidence: stronger than any certificate.</p>
<h3>What comes next</h3>
<ul>
<li><b>Jobs:</b> lead with the capstone and its numbers. "I ran an AI assistant for a real business for two weeks: 85% accuracy, 12% handovers, ₦X a month" answers the questions interviewers actually have.</li>
<li><b>Clients:</b> small businesses everywhere need exactly what you just built. Your capstone is your first case study; offer the same thing to similar businesses.</li>
<li><b>Deeper study:</b> the <b>AI engineer track</b> on this site teaches the maths, training and MLOps underneath everything you've used, built around Stanford and MIT lectures.</li>
</ul>
<div class="callout"><b>You made it.</b> Six months ago, "agent" and "context window" were new words. Now you've built, measured, deployed and run AI for real people. Keep your failure log going, keep writing up what you build, and keep going deeper. The field changes fast, and the habits you've built here are what let you keep up.</div>`,
  watch: [V.demo, V.freelance, V.aiEngineer],
  read: [R.effective],
  exercise: `<p>This is the capstone exam. Record a 3–5 minute demo following the structure above, publish your final write-up with links, and share it publicly (LinkedIn, X, your blog, or the course community). Then write a short plan for the next three months: a job, clients, or the AI engineer track.</p>`,
  problems: [
    {q: `<p>Turn this into a strong one-line portfolio summary: "I built a chatbot for a shop using RAG."</p>`,
     a: `<p>For example: "Built and ran an AI customer assistant for a Surulere provisions shop for two weeks: 520 conversations, 85% correct on a random sample, 12% handed to the owner, about ₦5,000 a month to run, with source-cited answers and a working human handover." Specific, measured and about real users.</p>`},
    {q: `<p>Your live demo's internet connection fails in the middle. What should you have prepared?</p>`,
     a: `<p>A recorded version of the same demo, ready to play, plus screenshots of the key moments. Switch to it calmly and carry on; the audience cares about what you built and learned, not about the venue's internet.</p>`},
  ],
  quiz: [
    {q: "A strong demo includes:", o: ["Only the best case", "A typical case, a hard case handled well, and the numbers", "Code scrolling", "No users"], a: 1, why: "Real behaviour plus evidence."},
    {q: "What's the most persuasive thing in a portfolio?", o: ["A certificate", "Real projects with measured results and honest write-ups", "A list of tools", "A long CV"], a: 1, why: "Evidence beats claims."},
    {q: "To keep up as the field changes, keep:", o: ["One model forever", "Your habits: failure log, evals, write-ups and learning", "Away from new tools", "Your old prompts unchanged"], a: 1, why: "Habits outlast any tool."},
  ],
},
];
