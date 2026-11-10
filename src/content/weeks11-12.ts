import type { Lesson, Resource } from "./types";
import { U } from "./unis";

// Agent track, Month 3 continued: Week 11 (building evals, incl. batch processing) and Week 12 (exam: the model report).
// Every video was checked on YouTube (channel, length, embeddable) on 10 Nov 2026 and appears nowhere else in the course.
// Videos with `src` go into "Go deep". h`...` keeps backslashes for maths.
const h = String.raw;
const yt = (id: string, title: string, len: string, src?: string): Resource =>
  ({ title, len, url: `https://www.youtube.com/watch?v=${id}`, ...(src ? { src } : {}) });

const V = {
  whyEvals: yt("MltkRz94SWA", "The most important skill for AI engineers: evals explained — Aish Reganti", "18 min"),
  evalBasics: yt("1jReCwBgM84", "LLM evaluation basics: datasets and metrics — Generative AI at MIT", "5 min"),
  hamelCourse: yt("uiza7wp1KrE", "AI evaluations clearly explained, with a real example — Hamel Husain with Peter Yang", "52 min", "Hamel Husain · interview"),
  understandEvals: yt("12WN6u2DrBk", "You'll finally understand AI evals after watching this — Mastra", "17 min"),
  metrics: yt("6eOcgYP5D4Q", "LLM evaluation methods and metrics — Evidently AI", "5 min"),
  judge: yt("trfUBIDeI1Y", "LLM as a judge: scaling AI evaluation strategies — IBM Technology", "6 min"),
  errorAnalysis: yt("e2i6JbU2R-s", "Error analysis: the highest-ROI technique in AI engineering — Hamel Husain", "12 min"),
  systematic: yt("a3SMraZWNNs", "How to systematically set up LLM evals — Dave Ebbelaar", "55 min"),
  chooseLlm: yt("pYax2rupKEY", "How to choose large language models: a developer's guide — IBM Technology", "7 min"),
  chooseModel: yt("aqWXSShwGO0", "Choose the right AI model for your use case — IBM Technology", "4 min"),
  benchmarks: yt("kDY4TodQwbg", "What are LLM benchmarks? — IBM Technology", "6 min"),
  latency: yt("X0bnN8oBxeI", "Latency versus throughput — ByteMonk", "4 min"),
  ownBenchmark: yt("1JaL5eVqFq0", "What do LLM benchmarks actually tell us? (and how to run your own) — Adam Lucek", "31 min"),
};

const R: Record<string, Resource> = {
  hamel: { title: "Your AI product needs evals — Hamel Husain", url: "https://hamel.dev/blog/posts/evals/" },
  anthropicEvals: { title: "Demystifying evals for AI agents — Anthropic", url: "https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents" },
  batch: { title: "Batch processing — Claude docs", url: "https://platform.claude.com/docs/en/build-with-claude/batch-processing" },
};

export const week11: Lesson[] = [
{
  id: "11-1", title: "Why evals: from \"it seems fine\" to evidence", mins: 13,
  objectives: [
    "Explain what an eval is and why one good answer proves little",
    "Describe the parts of an eval: cases, expected results, scoring and a score",
    "Decide what to evaluate first in one of your own AI features",
  ],
  prereqs: "<p>Lessons 1.3 (why answers vary) and 2.4 (iterating against test cases), and Week 9 (calling models from code).</p>",
  body: `
<p>In lesson 2.4 you tested a prompt against a handful of cases. That instinct is the most valuable habit in AI work, and this week you turn it into a proper tool: an <b>eval</b>.</p>
<h3>What an eval is</h3>
<p>An eval is a repeatable test of an AI system's quality. It has four parts:</p>
<ol>
<li><b>Cases:</b> realistic inputs, such as customer messages, receipts or clinic notes.</li>
<li><b>Expected results:</b> what a good answer looks like for each case. Sometimes an exact answer ("urgent"), sometimes a description ("mentions the refund policy, under 4 sentences").</li>
<li><b>Scoring:</b> how you decide whether each answer passed: an exact comparison, a rule, a rubric, a person or another model (lessons 11.3–11.4).</li>
<li><b>A score:</b> the share of cases that passed, plus the list of failures to read.</li>
</ol>
<p>It's the AI version of the unit tests you met in Week 7, with one big difference: answers vary from run to run (lesson 1.3), so you measure a <em>success rate</em> rather than pass or fail.</p>
<h3>Why "it seems fine" isn't enough</h3>
<ul>
<li><b>Variation:</b> a prompt that works 70% of the time looks perfect in a quick try.</li>
<li><b>Changes:</b> every prompt edit, model update or new feature can fix one thing and break another. Without an eval, you only find out from users.</li>
<li><b>Decisions:</b> "Should we use the cheaper model?" "Is the new prompt better?" An eval turns opinions into numbers you can compare.</li>
</ul>
<h3>Where to start</h3>
<p>Don't try to evaluate everything. Start with the one behaviour that would hurt most if it went wrong (wrong dosage advice, a wrong price, a missed urgent case) and the one that happens most often. Thirty well-chosen cases on those beat 500 random ones.</p>
<div class="callout"><b>Feels like extra work?</b> It is, once. After that, every change takes a minute to check instead of an anxious afternoon. Teams that ship AI successfully almost always have evals; teams that don't, find their bugs through customer complaints.</div>`,
  watch: [V.whyEvals, V.evalBasics, V.hamelCourse],
  read: [R.hamel, R.anthropicEvals],
  exercise: `<p>Pick the AI feature you'll evaluate this week (your Week 9 receipt reader is a good choice, or something from your real work). Write down: what a good answer looks like, the single most harmful mistake it could make, the most common kind of input, and how you'd currently know if it got worse. That's the plan for your eval.</p>`,
  problems: [
    {q: `<p>A colleague says: "I tried the new prompt on three messages and it was better, so let's ship it." What's wrong with that, and what would convince you?</p>`,
     a: `<p>Three tries can't separate a real improvement from normal variation (lessons 1.3 and 2.4). Convincing evidence: both prompts run on the same 30+ realistic cases, with the new one scoring higher, no critical case newly failing, and the changed cases read to see <em>why</em> it's better.</p>`},
    {q: `<p>For a clinic triage assistant, which should your first eval cases focus on, and why?</p>`,
     a: `<p>Cases where a wrong answer is dangerous, especially <b>urgent symptoms</b> that must never be marked routine (chest pain, difficulty breathing, signs of severe illness in children), plus the <b>most common</b> everyday messages. Missing an urgent case is the worst error, so it must be measured first.</p>`},
  ],
  quiz: [
    {q: "An eval measures:", o: ["How fast you type", "An AI system's quality on a set of realistic cases, repeatably", "The model's size", "Your internet speed"], a: 1, why: "It's a repeatable quality test."},
    {q: "Why do AI evals report a success rate instead of pass/fail?", o: ["It looks nicer", "Answers vary from run to run, so one result proves little", "Rates are required by law", "Models can't fail"], a: 1, why: "Variation means you measure how often it succeeds."},
    {q: "The best first eval cases are:", o: ["Random internet questions", "The most harmful mistakes and the most common inputs", "Only easy cases", "Cases the model already gets right"], a: 1, why: "Start where errors cost most and happen most."},
  ],
},
{
  id: "11-2", title: "Building your eval set: real cases and good answers", mins: 15,
  objectives: [
    "Collect realistic cases and cover typical, edge, tricky and critical inputs",
    "Write expected results that are specific enough to grade",
    "Keep a separate held-out set so you don't fool yourself",
  ],
  prereqs: "<p>Lesson 11.1.</p>",
  body: `
<h3>Where cases come from</h3>
<ul>
<li><b>Real inputs</b> are best: actual customer messages, actual receipts, actual questions, with personal details removed (lesson 1.6).</li>
<li><b>Your own failure log</b>: every past mistake is a ready-made case.</li>
<li><b>Written by hand</b> for situations you haven't seen yet but expect.</li>
<li><b>Generated with AI</b> to add variety: "write 10 messages a frustrated customer might send about a late delivery, in a mix of English and Pidgin". Always read and fix generated cases; never let them be the majority.</li>
</ul>
<h3>Cover four kinds of case</h3>
<ol>
<li><b>Typical:</b> the everyday inputs that make up most traffic.</li>
<li><b>Edge:</b> unusual but legitimate: empty fields, very long messages, two questions in one, mixed languages.</li>
<li><b>Tricky:</b> inputs designed to mislead: questions that assume something false, or instructions hidden in pasted text (lesson 7.5).</li>
<li><b>Critical:</b> the mistakes that must never happen (lesson 22.3). Mark them so one failure stands out.</li>
</ol>
<h3>Writing expected results</h3>
<p>Each case needs an answer that someone else could grade consistently.</p>
<ul>
<li><b>Exact where possible:</b> <code>{"category": "urgent"}</code>, <code>{"total_naira": 8500}</code>.</li>
<li><b>Criteria where not:</b> "Must: apologise, give the 5-day refund window, not promise a date. Must not: mention competitors."</li>
</ul>
<p>Store cases in a simple file, one per line (JSON Lines), so code can read them:</p>
<pre>{"id": "rcpt-014", "input": "receipts/014.jpg", "expected": {"total_naira": 8500}, "kind": "typical"}
{"id": "chat-031", "input": "Abeg una go refund my money?", "criteria": ["apologises", "states 5-day refund window"], "kind": "edge"}</pre>
<h3>Don't fool yourself: keep a held-out set</h3>
<p>If you tweak your prompt until it passes all 30 cases, it may simply be tuned to those 30. Keep about a third of your cases aside as a <b>held-out set</b> that you only run at the end, to check the improvement is real. Same idea as the test set in machine learning.</p>
<div class="callout"><b>How many cases?</b> Start with 30 (about 20 to work with and 10 held out). That's enough to catch big problems and track progress. Grow it from real failures over time; mature products often have hundreds.</div>`,
  watch: [V.understandEvals],
  read: [R.hamel],
  exercise: `<p>This is the start of the Week 11 build. Create 30 cases for your chosen feature in a JSON Lines file, with at least 15 typical, 6 edge, 4 tricky and 3 critical cases, each with an exact expected result or clear criteria. Mark 10 of them as held-out. Have someone else read 5 of your expected results: could they grade an answer the same way you would?</p>`,
  problems: [
    {q: `<p>Improve this expected result so it can be graded: "A good, helpful reply."</p>`,
     a: `<p>For example: "Must: greet the customer, confirm the order number, give the delivery window (2–3 working days in Lagos), offer the tracking link. Must not: promise a specific date or time. Length: under 80 words." Each point can be checked as yes or no.</p>`},
    {q: `<p>After a week of prompt tweaks, your working set score rises from 60% to 95%, but the held-out set only rises from 58% to 66%. What does that tell you?</p>`,
     a: `<p>Much of the "improvement" is the prompt being tuned to the specific working cases (overfitting), not a general improvement. Read the held-out failures, look for patterns your working set doesn't cover, add similar cases to the working set, and make more general fixes.</p>`},
  ],
  quiz: [
    {q: "The best source of eval cases is:", o: ["Only AI-generated examples", "Real inputs with personal details removed, plus your failure log", "Questions from a quiz website", "Whatever is quickest"], a: 1, why: "Real inputs reflect what your users actually send."},
    {q: "A held-out set is for:", o: ["Speeding up evals", "Checking at the end that improvements are real, not tuned to the working cases", "Storing failures", "Training the model"], a: 1, why: "It guards against fooling yourself."},
    {q: "Which expected result is gradeable?", o: ["'A nice answer'", "'Under 80 words, gives the 5-day refund window, doesn't promise a date'", "'Whatever seems right'", "'Better than before'"], a: 1, why: "Each criterion can be checked yes or no."},
  ],
},
{
  id: "11-3", title: "Scoring answers: exact match, rules and rubrics", mins: 14,
  objectives: [
    "Choose the right scoring method for each kind of answer",
    "Write rule-based checks in code",
    "Design a rubric a person (or model) can apply consistently",
  ],
  prereqs: "<p>Lessons 11.1–11.2.</p>",
  body: `
<p>Scoring is where an eval becomes a number. Use the simplest method that fits the answer.</p>
<h3>1. Exact match</h3>
<p>For answers with one right value: a category, a yes/no, a number, a field in JSON. Compare directly in code. Normalise first so harmless differences don't fail: lowercase, trim spaces, compare numbers as numbers (<code>8500</code> equals <code>8,500.00</code>).</p>
<h3>2. Rules (checks in code)</h3>
<p>For answers that vary in wording but must meet clear conditions:</p>
<pre>def check_reply(text):
    return {
        "mentions_refund_window": "5 days" in text or "five days" in text,
        "under_80_words": len(text.split()) &lt;= 80,
        "no_date_promise": not any(w in text.lower() for w in ["tomorrow", "by monday", "guaranteed"]),
    }</pre>
<p>Rules are fast, free and consistent, but brittle: "within a working week" fails the "5 days" check even though it may be fine. Read failures before trusting the score.</p>
<h3>3. Rubrics</h3>
<p>For open answers (summaries, advice, explanations), write a <b>rubric</b>: a short list of criteria, each scored on a simple scale.</p>
<pre>Accuracy:   2 = all facts correct · 1 = minor slip · 0 = any wrong fact
Complete:   2 = answers every part · 1 = misses a minor part · 0 = misses the main question
Tone:       2 = clear and polite · 1 = awkward · 0 = rude or confusing
Pass if total ≥ 5 and Accuracy = 2</pre>
<p>Keep scales small (0–2 beats 1–10: people agree more), and write one example answer for each score. A rubric can be applied by a person or by a model (next lesson).</p>
<h3>Metrics beyond "share passed"</h3>
<p>When one kind of error matters more, measure it separately. For triage, count <b>missed urgent cases</b> on their own: 95% accuracy is not acceptable if the 5% are all urgent patients sent home.</p>
<div class="callout"><b>Not sure which method to use?</b> Ask: "Is there one right answer?" Use exact match. "Can I write the conditions as yes/no checks?" Use rules. "Does judging it need understanding?" Use a rubric. Many evals mix all three.</div>`,
  watch: [V.metrics],
  read: [R.anthropicEvals],
  exercise: `<p>Write the scoring for your 30 cases: exact-match checks where there's one right answer, rule checks for clear conditions, and a 3-criterion rubric (0–2 scale, with an example per score) for open answers. Grade 5 answers yourself with the rubric, then ask someone else to grade the same 5 and compare.</p>`,
  problems: [
    {q: `<p>Your exact-match check fails the answer <code>"Urgent"</code> when the expected value is <code>"urgent"</code>, and fails <code>"₦8,500"</code> against <code>8500</code>. Fix both.</p>`,
     a: `<p>Normalise before comparing: lowercase and trim text (<code>"urgent" == "urgent"</code>), and for numbers, strip currency symbols and commas then compare as numbers (<code>float("8,500".replace(",", "")) == 8500</code>). Better still, ask for numbers as plain numbers in your output format (lesson 9.3).</p>`},
    {q: `<p>Two people grade 20 answers with your 1–10 "quality" score and often differ by 3 or more points. How do you fix the scoring?</p>`,
     a: `<p>Replace the single 1–10 score with a rubric of 2–4 specific criteria on a 0–2 scale, each with written descriptions and an example answer per score. Then have both people grade 10 answers again, discuss disagreements, and tighten the wording until they mostly agree.</p>`},
  ],
  quiz: [
    {q: "Which scoring fits a category label like 'urgent'?", o: ["A rubric", "Exact match after normalising", "Model-as-judge", "Counting words"], a: 1, why: "One right value means a direct comparison."},
    {q: "A weakness of rule-based checks is that they:", o: ["Cost a lot", "Can wrongly fail answers worded differently", "Are slow", "Need a GPU"], a: 1, why: "Rules are brittle, so read the failures."},
    {q: "Why prefer a 0–2 scale over 1–10 in a rubric?", o: ["It's shorter to type", "People apply it more consistently", "Models can't count to 10", "It always gives higher scores"], a: 1, why: "Fewer, well-described levels mean better agreement."},
  ],
},
{
  id: "11-4", title: "Model-as-judge: using AI to grade AI", mins: 14,
  objectives: [
    "Write a judge prompt that applies your rubric",
    "Check a judge against your own grades before trusting it",
    "Avoid the common biases of AI judges",
  ],
  prereqs: "<p>Lessons 11.1–11.3.</p>",
  body: `
<p>Grading 200 open answers by hand every time you change a prompt isn't realistic. A <b>model-as-judge</b> (also called LLM-as-a-judge) is a second model call that grades the first model's answer against your rubric.</p>
<h3>A judge prompt</h3>
<pre>You are grading a customer-support reply against a rubric.

&lt;question&gt;{customer_message}&lt;/question&gt;
&lt;policy&gt;{relevant_policy}&lt;/policy&gt;
&lt;reply&gt;{model_reply}&lt;/reply&gt;

Score each criterion 0, 1 or 2:
- accuracy: every fact matches the policy (2), minor slip (1), any wrong fact (0)
- complete: answers every part (2), misses a minor part (1), misses the main question (0)
- tone: clear and polite (2), awkward (1), rude or confusing (0)

Think briefly, then reply with JSON only:
{"reason": "...", "accuracy": n, "complete": n, "tone": n}</pre>
<p>Notice the techniques from Week 2: delimiters, a precise rubric, a short reason before the scores, and a strict output format your code can read (lesson 9.3).</p>
<h3>Trust, but check: calibrate the judge</h3>
<p>A judge is only useful if it agrees with you. Grade 20–30 answers yourself, run the judge on the same answers, and measure how often you agree. If agreement is low, read the disagreements and fix the rubric wording or the judge prompt, then measure again. Re-check whenever you change the judge prompt or model.</p>
<h3>Known judge biases</h3>
<ul>
<li><b>Length:</b> judges tend to prefer longer answers. Put length limits in the rubric.</li>
<li><b>Position:</b> when comparing two answers side by side, judges often favour the first one. Run each comparison twice with the order swapped.</li>
<li><b>Self-preference:</b> a model may favour answers in its own style. Where possible, judge with a different model from the one being tested.</li>
<li><b>Leniency:</b> judges are often too generous. Ask for the reason <em>before</em> the score, and include a clear example of a 0.</li>
</ul>
<h3>Pointwise or pairwise?</h3>
<p><b>Pointwise</b> grades one answer against the rubric, which is good for tracking a score over time. <b>Pairwise</b> asks "which of these two answers is better?", which is good for choosing between two prompts or models. Use pairwise with swapped order.</p>
<div class="callout"><b>Is a judge "cheating"?</b> No, as long as you've checked it agrees with you, and you still read a sample of answers yourself every week. A judge scales your judgement; it doesn't replace it.</div>`,
  watch: [V.judge],
  read: [R.anthropicEvals, R.hamel],
  exercise: `<p>Write a judge prompt for your rubric from lesson 11.3. Grade 20 answers yourself, run the judge on the same 20, and calculate your agreement on pass/fail. Improve the judge until you agree on at least 17 of 20, keeping notes on what you changed.</p>`,
  problems: [
    {q: `<p>You and your judge grade 25 answers as pass or fail. You agree on 19. What's the agreement rate, and is the judge ready?</p>`,
     a: `<p>19 ÷ 25 = <b>76%</b>. That's not good enough to rely on alone. Read the 6 disagreements: if the judge is too lenient, add a clear 0-score example; if it misreads a criterion, reword it. Aim for at least 85–90% agreement before you let it gate releases.</p>`},
    {q: `<p>In a pairwise comparison, answer A beats B when A is shown first, but B beats A when B is shown first. What's happening, and what do you report?</p>`,
     a: `<p>Position bias: the judge prefers whichever answer comes first, so this pair is effectively a <b>tie</b>. That's exactly why you run both orders. Count a win only when the same answer wins in both orders.</p>`},
  ],
  quiz: [
    {q: "Before trusting a model-as-judge you should:", o: ["Use the biggest model", "Check it agrees with your own grades on a sample", "Ask it if it's accurate", "Nothing; judges are always right"], a: 1, why: "Calibration against human grades is essential."},
    {q: "To avoid position bias in pairwise judging:", o: ["Use longer answers", "Run each comparison twice with the order swapped", "Use temperature 1", "Only show one answer"], a: 1, why: "A real win holds in both orders."},
    {q: "Asking the judge for a reason before the score helps because:", o: ["It's required by the API", "It makes the judge consider the rubric before deciding", "It's cheaper", "It hides the score"], a: 1, why: "Reasoning first tends to make scores more careful."},
  ],
},
{
  id: "11-5", title: "Running evals at scale: scripts, batches, cost and error analysis", mins: 15,
  objectives: [
    "Write an eval script that runs every case and saves results you can compare",
    "Use batch processing to run large evals at about half the cost",
    "Read failures systematically and turn them into fixes",
  ],
  prereqs: "<p>Lessons 11.1–11.4 and lesson 9.5 (errors, retries and cost).</p>",
  body: h`
<h3>The eval script</h3>
<p>Everything this week comes together in one script you can run any time:</p>
<pre>for case in load_jsonl("evals/cases.jsonl"):
    answer = run_my_feature(case["input"])          # the system you're testing
    result = score(case, answer)                    # exact match, rules or judge
    save_row(run_id, case["id"], answer, result, tokens, cost, seconds)
print_summary(run_id)   # pass rate, critical failures, cost, slowest cases</pre>
<p>Save every run's results (a CSV file is fine) with the prompt version and model name (lesson 22.2). Then you can compare any two runs: which cases changed, which got better, which got worse.</p>
<h3>Batch processing: big runs for less</h3>
<p>Evals don't need instant answers. Many providers offer a <b>batch API</b>: you submit hundreds or thousands of requests at once and collect the results later. With Claude's Message Batches API, batch requests cost about <b>half</b> the normal price, and results usually arrive well within 24 hours. That's ideal for running a 1,000-case eval, comparing four models overnight, or processing a month of receipts.</p>
<p>When to use it: large, non-urgent jobs. When not to: anything a user is waiting for. Combine it with prompt caching for the shared system prompt to save even more (lesson 9.5).</p>
<h3>Error analysis: where the real improvements come from</h3>
<p>A score tells you <em>how much</em> is wrong; only reading failures tells you <em>what</em>. After each run:</p>
<ol>
<li>Read every failure (or 30 if there are many) and write a one-line note on each.</li>
<li>Group the notes into categories: "missed Pidgin phrasing", "wrong date format", "invented a policy".</li>
<li>Count them. Fix the biggest category first, then rerun.</li>
</ol>
<p>Teams that do this weekly improve fastest, because they fix the problems that actually happen rather than guessing.</p>
<div class="callout"><b>Overwhelmed by tooling?</b> A Python script, a JSON Lines file of cases and a CSV of results is a complete eval system. Tools add dashboards and collaboration later; the habit of running it and reading failures is what matters.</div>`,
  watch: [V.errorAnalysis, V.systematic, U.cs336_eval],
  read: [R.batch, R.hamel],
  exercise: `<p>This completes the Week 11 build. Write your eval script: run all 30 cases, score them, save a CSV with prompt version, model, tokens, cost and time per case, and print a summary. Run it twice: before and after one prompt improvement guided by error analysis (categorise every failure first). Report the change on the working set and the held-out set.</p>`,
  problems: [
    {q: `<p>A full eval run is 1,000 cases × 2,000 input tokens and 300 output tokens, at $3 / $15 per million. What does it cost normally, and with a batch API at half price?</p>`,
     a: `<p><b>Input:</b> 1,000 × 2,000 = 2 million tokens × $3 = $6. <b>Output:</b> 1,000 × 300 = 0.3 million × $15 = $4.50. <b>Normal: $10.50.</b> <b>Batch at half price: about $5.25.</b> Over 20 runs a month that saves over $100, which matters for a small team.</p>`},
    {q: `<p>Your 40 failures break down as: 18 "misread Pidgin", 9 "wrong date format", 7 "too long", 6 other. Where do you start, and why?</p>`,
     a: `<p>Start with <b>Pidgin</b>: 18 of 40 failures (45%) share one cause, so fixing it could lift the score most. Add Pidgin examples to the prompt (few-shot, lesson 2.5) and more Pidgin cases to the eval set, then rerun. The date format is likely a quick second fix in the output format.</p>`},
  ],
  quiz: [
    {q: "What should every eval run save?", o: ["Only the final score", "Each case's answer and result, plus prompt version, model, tokens, cost and time", "Nothing", "Only the failures"], a: 1, why: "Saved detail lets you compare runs case by case."},
    {q: "A batch API is best for:", o: ["Live chat replies", "Large, non-urgent jobs like overnight evals, at lower cost", "Streaming", "Image generation"], a: 1, why: "You trade waiting time for a lower price."},
    {q: "Error analysis means:", o: ["Counting errors only", "Reading failures, grouping them into causes and fixing the biggest group first", "Ignoring errors", "Retrying until it passes"], a: 1, why: "It tells you what to fix, not just how much is wrong."},
  ],
},
];

export const week12: Lesson[] = [
{
  id: "12-1", title: "Planning the comparison: the question, the candidates and the budget", mins: 13,
  objectives: [
    "Turn \"which model is best?\" into a decision you can answer with numbers",
    "Choose 4+ candidate models, hosted and open",
    "Pick metrics for quality, cost, speed and privacy, with a budget",
  ],
  prereqs: "<p>Week 11 (your eval set and script) and Week 10 (open models).</p>",
  body: `
<p>This month's exam is a real professional task: <b>"Which model should a Lagos clinic use to sort patients' triage notes?"</b> You'll compare at least four models with your own evals and write a recommendation backed by numbers. Clinics, banks and startups pay consultants for exactly this.</p>
<div class="callout"><b>Use synthetic notes, not real patient data.</b> Write realistic but invented notes (or generate and then carefully edit them), covering typical, edge, tricky and critical cases. Real health data needs consent and strong protection (lesson 1.6), and you don't need it to do this well.</div>
<h3>Turn the question into a decision</h3>
<p>"Best" means nothing until you say for what. Write the decision down:</p>
<pre>Decide which model sorts walk-in triage notes into urgent / soon / routine
for a 40-bed Lagos clinic, handling ~300 notes a day, with:
- no urgent case marked routine (critical),
- answers in under 5 seconds,
- under ₦X a month, and
- patient data either staying on the clinic's computers or covered by a
  provider agreement the clinic accepts.</pre>
<h3>Choose candidates</h3>
<p>Pick at least four that differ in useful ways:</p>
<ul>
<li>A large hosted model (best quality, highest cost).</li>
<li>A small or fast hosted model (much cheaper; is it good enough?).</li>
<li>An open model running locally with Ollama (data stays on site, Week 10).</li>
<li>A second family or size, for contrast.</li>
</ul>
<h3>Choose metrics</h3>
<ul>
<li><b>Quality:</b> overall accuracy <em>and</em> critical misses (urgent marked routine), from your Week 11 scoring.</li>
<li><b>Speed:</b> typical response time and the slowest 5% (lesson 12.2).</li>
<li><b>Cost:</b> cost per 1,000 notes and per month at expected volume (in dollars and naira).</li>
<li><b>Privacy and practicality:</b> where data goes, the hardware needed, licence (lesson 10.1).</li>
</ul>
<h3>Set a budget</h3>
<p>Estimate the eval cost before running: cases × models × runs × cost per call. Use the batch API (lesson 11.5) for the big runs.</p>`,
  watch: [V.chooseLlm, V.chooseModel],
  read: [R.anthropicEvals],
  exercise: `<p>Write your one-page plan: the decision statement, four or more candidates with a reason for each, your metrics with pass thresholds, and an estimated eval budget. Build (or extend) a 50-case synthetic triage-note eval set, with at least 8 critical urgent cases and 15 held out.</p>`,
  problems: [
    {q: `<p>You'll run 50 cases × 5 models × 3 runs each. Average cost is $0.002 per call for three of the models and $0.02 for the two largest. Estimate the total.</p>`,
     a: `<p>Calls per model: 50 × 3 = 150. Small models: 3 × 150 × $0.002 = $0.90. Large models: 2 × 150 × $0.02 = $6.00. <b>Total ≈ $6.90</b> (about half with a batch API). Cheap compared with the cost of picking the wrong model for a clinic.</p>`},
    {q: `<p>Why include a local open model even if a hosted model will probably score higher?</p>`,
     a: `<p>Because quality isn't the only requirement. If the clinic can't send patient notes off-site, the local model may be the only acceptable option, and the question becomes "is it good enough?". Including it gives the clinic real numbers for that trade-off instead of an assumption.</p>`},
  ],
  quiz: [
    {q: "The first step in comparing models is:", o: ["Run every model you can find", "Write down the decision, constraints and what 'good enough' means", "Pick the newest model", "Check social media"], a: 1, why: "Without a decision, 'best' has no meaning."},
    {q: "For clinic triage, which metric must be tracked separately?", o: ["Word count", "Urgent cases marked routine (critical misses)", "Number of emojis", "Model release date"], a: 1, why: "The most dangerous error must never hide in an average."},
    {q: "Why use synthetic notes for this exam?", o: ["They're more accurate", "Real patient data needs consent and protection you don't have", "Models prefer them", "They're shorter"], a: 1, why: "You can do the comparison well without real health data."},
  ],
},
{
  id: "12-2", title: "Running the comparison fairly", mins: 14,
  objectives: [
    "Give every model a fair, equal chance",
    "Measure accuracy, speed and cost correctly",
    "Tell a real difference between models from noise",
  ],
  prereqs: "<p>Lesson 12.1.</p>",
  body: h`
<h3>Keep it fair</h3>
<ul>
<li><b>Same cases, same scoring</b> for every model, run by the same script.</li>
<li><b>Same instructions</b>, adapted only where a model needs it (for example a local model's chat format). Record any adaptation.</li>
<li><b>Same settings:</b> low temperature for a classification task, same output format, same <code>max_tokens</code>.</li>
<li><b>Several runs:</b> run each model 3 times and report the average and the spread, because answers vary (lesson 1.3).</li>
<li><b>Held-out cases</b> count for the final numbers; don't tune prompts on them.</li>
</ul>
<h3>Measure speed properly</h3>
<p><b>Latency</b> is how long one answer takes. Record it for every call and report two numbers: the <b>median</b> (half the answers are faster) and the <b>95th percentile</b> ("p95": only 5% are slower). Users feel the slow ones. For local models, note the hardware, since speed depends heavily on it. <b>Throughput</b> (answers per minute) matters if many notes arrive at once.</p>
<h3>Measure cost properly</h3>
<p>Use the real token counts from each response (lesson 9.1) to compute <b>cost per 1,000 notes</b>, then multiply up to a month at the clinic's volume. For local models, include an estimate of the hardware and electricity, not "free".</p>
<h3>Is the difference real?</h3>
<p>With 50 cases, a model scoring 88% isn't clearly better than one scoring 84%: that's 2 cases. Two simple checks:</p>
<ul>
<li><b>Standard error</b> (lesson 2.4 "Go deep"): about \(\sqrt{p(1-p)/n}\). At \(p = 0.86\) and \(n = 50\) that's about 5 points, so differences smaller than about 10 points are within noise.</li>
<li><b>Look at the disagreements:</b> count the cases where one model was right and the other wrong. If it's 6 vs 4, that's weak evidence; 15 vs 2 is strong.</li>
</ul>
<p>And critical misses are judged on their own: one model with zero critical misses can beat one with higher overall accuracy.</p>
<div class="callout"><b>Results look too close to call?</b> That's a valid finding. Say so, and let cost, speed or privacy decide. Then add cases where the models disagree to sharpen the comparison next time.</div>`,
  watch: [V.benchmarks, V.latency],
  read: [R.batch],
  exercise: `<p>Run your comparison: every candidate on all 50 cases, 3 runs each (use the batch API for hosted models where possible). Save a results table per model: accuracy, critical misses, median and p95 latency, cost per 1,000 notes and per month, with the spread across runs.</p>`,
  problems: [
    {q: `<p>Model A: 90% accuracy, 1 critical miss. Model B: 86% accuracy, 0 critical misses. 50 cases. Which is safer for the clinic, and is A really more accurate?</p>`,
     a: `<p><b>B is safer</b>: it never marked an urgent case routine, which is the requirement that matters most. A's 4-point lead (2 cases) is well within the noise for 50 cases (standard error about 4–5 points), so it isn't convincingly more accurate either.</p>`},
    {q: `<p>A model takes these times in seconds on 20 notes: eighteen take about 1.5s, one takes 7s and one takes 12s. Report the median and the p95, and say why the p95 matters here.</p>`,
     a: `<p>Median ≈ <b>1.5s</b> (most notes are fast). p95 ≈ <b>7s</b> (with 20 notes, the 95th percentile falls at the 19th fastest time; only 1 in 20 is slower). The p95 breaks the "under 5 seconds" requirement, so a nurse would sometimes wait 7–12 seconds. Investigate the slow cases (long notes? cold start?) before recommending it.</p>`},
  ],
  quiz: [
    {q: "A fair comparison uses:", o: ["Different cases per model", "The same cases, scoring and settings for every model", "Only the cheapest model's prompt", "One run each"], a: 1, why: "Anything else compares the setup, not the model."},
    {q: "p95 latency means:", o: ["The average time", "The time only 5% of answers are slower than", "The fastest answer", "95 seconds"], a: 1, why: "It shows the slow tail users actually feel."},
    {q: "With 50 cases, a 3-point accuracy difference is:", o: ["Proof one model is better", "Likely within normal noise", "Impossible", "Always significant"], a: 1, why: "Small samples give wide uncertainty."},
  ],
},
{
  id: "12-3", title: "Writing the model report and recommendation", mins: 13,
  objectives: [
    "Structure a report a non-technical decision-maker can act on",
    "Present results with clear charts and honest caveats",
    "Make a recommendation with conditions and a plan to re-check",
  ],
  prereqs: "<p>Lessons 12.1–12.2.</p>",
  body: `
<p>Your comparison is only useful if the clinic's director can read it in five minutes and decide. This is the Month 3 exam deliverable.</p>
<h3>A structure that works</h3>
<ol>
<li><b>Recommendation first</b>, in two sentences: "Use Model B for triage notes. It caught every urgent case in our tests, answers in about 2 seconds, and costs about ₦X a month at 300 notes a day."</li>
<li><b>The decision and requirements</b> from lesson 12.1.</li>
<li><b>Results table</b>: one row per model with accuracy (and spread), critical misses, median and p95 latency, monthly cost, where data goes.</li>
<li><b>Two charts:</b> accuracy against monthly cost (which shows the "good enough and cheap" sweet spot), and critical misses per model.</li>
<li><b>What the failures looked like</b>: 3–5 real examples from error analysis, in plain words.</li>
<li><b>Caveats</b>: synthetic data, 50 cases, the hardware used, the test date. Models and prices change.</li>
<li><b>Conditions and next steps</b>: "Start with a 2-week trial where a nurse checks every 'routine' decision; re-run this eval monthly and whenever the model version changes."</li>
</ol>
<h3>Honesty makes it credible</h3>
<p>Don't hide the close calls or the weaknesses of your pick. A report that says "B and C are statistically tied on accuracy; we chose B because it keeps data on site" is more trustworthy, and more useful, than one that crowns a winner by 2 points.</p>
<div class="callout"><b>Never written a report like this?</b> Write the two-sentence recommendation first and the table second. If those two are clear, the rest is supporting detail. Have a friend who isn't technical read the first half page and tell you what they'd decide.</div>`,
  watch: [V.ownBenchmark],
  read: [R.anthropicEvals],
  exercise: `<p>This is the Month 3 exam. Publish your model report for the Lagos clinic, using the structure above: recommendation, requirements, results table, two charts, failure examples, caveats, and conditions with a re-check plan. Include your eval cases (synthetic), scripts and raw results so anyone can reproduce your numbers.</p>`,
  problems: [
    {q: `<p>Rewrite this recommendation to be useful: "Model C is the best because it scored highest."</p>`,
     a: `<p>For example: "Use Model C, run locally on the clinic's computer. It marked no urgent case as routine in 50 test notes, answered in a median of 2.1 seconds (p95: 3.8s), costs nothing per note after a ₦X hardware upgrade, and keeps patient data on site. A nurse should check its 'routine' decisions for the first two weeks."</p>`},
    {q: `<p>Six months after your report, the provider retires your recommended model. What should your report already have said about this?</p>`,
     a: `<p>The conditions section should say the eval must be re-run whenever the model version changes, and that the scripts and cases are included to make that quick. Switching then takes an afternoon: run the replacement through the same eval, compare, and update the recommendation (lesson 22.2).</p>`},
  ],
  quiz: [
    {q: "A model report should start with:", o: ["The history of AI", "A short, clear recommendation", "Raw data", "The author's CV"], a: 1, why: "Decision-makers need the answer first."},
    {q: "Which caveat belongs in the report?", o: ["None; caveats look weak", "The tests used 50 synthetic notes on a specific date and hardware", "The font used", "Your favourite model"], a: 1, why: "Honest limits make the findings credible."},
    {q: "A good recommendation includes:", o: ["Only the winner's name", "Conditions and a plan to re-check", "A guarantee it will never fail", "Every number you measured"], a: 1, why: "Conditions keep the decision safe as things change."},
  ],
},
];
