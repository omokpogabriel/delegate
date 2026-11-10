import type { LessonUpgrade } from "./types";
import { U } from "./unis";

// Upgrades for the agent-user track, layered onto lessons by id: objectives, beginner notes (`notes`, shown in the
// lesson), and optional depth (`lectures`, `deepNotes`, `problems`, shown in "Go deep").
// Writing rule for Go deep: plain English first, then the formula, then what every symbol means, then a small
// worked example, then why it matters. Keep the maths correct; explain it, don't remove it.
// Maths goes in \( \) (inline) or \[ \] (display), rendered with KaTeX. Use h`...` (String.raw) so backslashes survive.
const h = String.raw;

export const UPGRADES: Record<string, LessonUpgrade> = {
 "1-1": {
  objectives: ["Explain in your own words how a model writes an answer, one piece at a time","Describe what each training stage (pre-training, fine-tuning, practice with rewards) adds","Predict how the way you phrase a question changes what the model writes"],
  lectures: [U.mit191llm, U.cs229llm],
  deepNotes: h`
<h3>The one idea behind every language model</h3>
<p><b>In plain English:</b> the model writes one token at a time. For each new token it asks "given everything so far, what usually comes next?" The chance of a whole sentence is just the chances of each step, multiplied together.</p>
<p>Written as a formula:</p>
\[P(\text{whole text}) = P(\text{token 1}) \times P(\text{token 2} \mid \text{token 1}) \times P(\text{token 3} \mid \text{tokens 1–2}) \times \dots\]
<ul>
<li>\(P(\dots)\) means "the probability of", a number between 0 (never) and 1 (certain).</li>
<li>The bar \(\mid\) means "given". So \(P(\text{token 2} \mid \text{token 1})\) is "how likely is this second token, given the first one".</li>
</ul>
<p><b>Small example.</b> Suppose that after "The capital of Nigeria is", the model gives " Abuja" a probability of 0.9, and after "The capital of Nigeria is Abuja" it gives "." a probability of 0.8. The chance of writing " Abuja." is \(0.9 \times 0.8 = 0.72\).</p>
<p><b>Why it matters:</b> everything the model writes depends on what came before it, including your prompt. Change the text before, and you change every step after. Training is simply adjusting the model so real text gets high probabilities; writing an answer is repeating "pick the next token, add it, go again".</p>`,
  problems: [
   {q:h`<p>A base model (trained only on internet text, not yet taught to be an assistant) is given two inputs:</p><p>(a) <code>What is the capital of Nigeria?</code><br>(b) <code>Q: What is the capital of Nigeria?</code> followed by a new line and <code>A:</code></p><p>What is each likely to produce, and why?</p>`,
    a:h`<p><b>(a)</b> It might write more questions, like a quiz: on the internet, a question is often followed by another question.</p><p><b>(b)</b> It will most likely write " Abuja", because text laid out as Q: … A: is usually followed by an answer.</p><p><b>Why:</b> the model is the same in both cases. Only the text before it changed, and (from the formula above) every next-token probability depends on the text before it. That's why how you lay out a prompt matters.</p>`},
   {q:h`<p>Models got good at coding and maths faster than at writing persuasive essays. Why might that be?</p>`,
    a:h`<p>In the last training stage, the model practises and gets a reward when it does well. For code and maths a computer can score the attempt automatically: do the tests pass? Is the answer right? So the model can practise millions of times cheaply.</p><p>An essay has no automatic score. Someone (or another model) has to judge it, which is slower, less consistent and easier to fool. Less, noisier practice means slower improvement.</p>`}
  ]},
 "1-2": {
  objectives: ["Estimate how many tokens a task uses and what it will cost","Plan how much fits in a context window during a long task","Explain why some tasks and languages cost more tokens"],
  lectures: [U.cme295_tok, U.cme295_ctx, U.cs336_1],
  problems: [
   {q:h`<p>Each request sends a 2,000-token system prompt plus a 500-token user message, and gets a 400-token reply. Input costs $3 per million tokens; output costs $15 per million. What does it cost to handle 10,000 requests a day?</p>`,
    a:h`<p><b>Step 1, input tokens:</b> each request sends 2,000 + 500 = 2,500 tokens. Times 10,000 requests = 25,000,000 tokens (25 million).</p><p><b>Step 2, input cost:</b> 25 million × $3 per million = <b>$75</b>.</p><p><b>Step 3, output:</b> 400 × 10,000 = 4 million tokens × $15 per million = <b>$60</b>.</p><p><b>Total:</b> $135 a day, about $4,000 a month. Notice that the system prompt, sent again with every request, is most of the input. That's exactly what prompt caching makes cheaper.</p>`},
   {q:h`<p>An agent's context window holds 200,000 tokens. The system prompt and tool descriptions take 5,000. You keep 4,000 free for the reply. Each step adds about 8,000 tokens of tool output. How many steps fit before the window is full?</p>`,
    a:h`<p><b>Space left for steps:</b> 200,000 − 5,000 − 4,000 = 191,000 tokens.</p><p><b>Steps that fit:</b> 191,000 ÷ 8,000 = 23.9, so <b>23 full steps</b> (you can't do 0.9 of a step).</p><p>In practice, answers get worse before the window is completely full, so keep tool output short and start fresh sessions for long tasks.</p>`}
  ]},
 "1-3": {
  objectives: ["Explain what temperature does to the model's choice of next word","Choose low or high temperature for a given task","Explain why one successful run proves very little"],
  lectures: [U.tempSoftmax, U.tempControls, U.tempSampling],
  deepNotes: h`
<h3>What temperature actually does</h3>
<p><b>In plain English:</b> for every possible next token, the model gives a raw score. Higher score means "more likely". These scores are turned into probabilities that add up to 100%. Temperature controls how strongly the top score wins: low temperature makes the favourite even more likely; high temperature gives the others more of a chance.</p>
<p>The formula (called <b>softmax</b>) is:</p>
\[p_i = \frac{e^{z_i / T}}{\sum_j e^{z_j / T}}\]
<ul>
<li>\(z_i\) is the raw score of token \(i\) (often called a <em>logit</em>).</li>
<li>\(T\) is the temperature.</li>
<li>\(e^{x}\) is the exponential function: it turns any number into a positive one, and bigger numbers grow much faster. Any calculator has an \(e^x\) button.</li>
<li>The \(\sum_j\) at the bottom means "add up the same thing for every token", so all the probabilities total 1 (100%).</li>
</ul>
<p><b>Why dividing by \(T\) matters:</b> a small \(T\) (like 0.5) doubles the gaps between scores, so the top token pulls further ahead. A large \(T\) shrinks the gaps, so choices become more even. As \(T\) gets close to 0 the model always picks the top token.</p>`,
  problems: [
   {q:h`<p>Three possible next tokens have scores 2, 1 and 0. Work out their probabilities at temperature 1 and at temperature 0.5. (Use a calculator for \(e^x\).)</p>`,
    a:h`<p><b>At T = 1:</b></p><ol><li>Raise \(e\) to each score: \(e^2 = 7.39\), \(e^1 = 2.72\), \(e^0 = 1\).</li><li>Add them: \(7.39 + 2.72 + 1 = 11.11\).</li><li>Divide each by the total: \(7.39 / 11.11 = 0.67\), \(2.72 / 11.11 = 0.24\), \(1 / 11.11 = 0.09\).</li></ol><p>So 67%, 24% and 9%.</p><p><b>At T = 0.5:</b> first divide each score by 0.5, giving 4, 2 and 0. Then \(e^4 = 54.6\), \(e^2 = 7.39\), \(e^0 = 1\); total 63.0. Probabilities: 87%, 12% and 2%.</p><p><b>What it shows:</b> halving the temperature moved the favourite from 67% to 87%. Lower temperature, more predictable output.</p>`},
   {q:h`<p>A prompt really works 60% of the time. What's the chance it works on your one test? What's the chance it works five times in a row?</p>`,
    a:h`<p><b>One test:</b> 60%, so a single success tells you little.</p><p><b>Five in a row:</b> multiply the chance for each run: \(0.6 \times 0.6 \times 0.6 \times 0.6 \times 0.6 = 0.6^5 \approx 0.08\), about 8%.</p><p>Even a prompt that works 90% of the time succeeds five times in a row only \(0.9^5 \approx 59\%\) of the time. So test on many runs, and treat one success as a hint, not proof.</p>`}
  ]},
 "1-4": {
  objectives: ["Spot which parts of an answer are most likely to be made up","Choose how carefully to check based on the cost of being wrong","Work out how often an automatic checker's warnings are real"],
  problems: [
   {q:h`<p>A model writes a two-page legal memo with four case citations. How would you check it in under 15 minutes?</p>`,
    a:h`<p>Check what is quick to verify and costly to get wrong:</p><ol><li>Look up all four cases in an official law report or database. Does each exist, and does it say what the memo claims?</li><li>Check every number and date against the original source.</li><li>In a fresh chat, paste the real sources and ask the model which statements in the memo they don't support.</li></ol><p>Any case you can't find is treated as invented, and the memo is rewritten from the real sources.</p>`},
   {q:h`<p>5% of your system's answers contain something made up. An automatic checker catches 90% of those, but it also wrongly flags 10% of the good answers. When the checker flags an answer, how likely is it that the answer really has a problem?</p>`,
    a:h`<p>Imagine 1,000 answers. Counting real cases is easier than juggling percentages.</p><ol><li><b>Bad answers:</b> 5% of 1,000 = 50. The checker catches 90% of them: <b>45 flagged</b>.</li><li><b>Good answers:</b> 950. The checker wrongly flags 10%: <b>95 flagged</b>.</li><li><b>All flags:</b> 45 + 95 = 140. Real problems among them: 45.</li></ol><p>So a flag is right only 45 ÷ 140 ≈ <b>32%</b> of the time. Two out of three warnings are false alarms, even though the checker sounds accurate. (This way of reasoning is called Bayes' rule.) Always test a checker on your own data before trusting its warnings.</p>`}
  ]},
 "2-1": {
  objectives: ["Rewrite a vague request into a complete brief","Use the new-hire test on any prompt","Explain why giving the reason improves the answer"],
  lectures: [U.promptDeepDive, U.promptTechniques],
  problems: [
   {q:h`<p>Rewrite "Summarise this report" as a proper brief.</p>`,
    a:h`<p>One good version: "You're briefing the CEO of a 40-person logistics company who has five minutes before a board meeting. Summarise the attached quarterly report in at most 150 words. Start with the one decision the board needs to make, then the three most important numbers and how each changed since last quarter, then any risks. Use plain English. If the report doesn't support a claim, leave it out."</p><p>It says who it's for, why, how long, in what order, in what style, and what to do when unsure.</p>`},
   {q:h`<p>What's missing from this prompt? "Write unit tests for the payment service."</p>`,
    a:h`<p>A new team member would ask:</p><ul><li>Which language and testing tool, and which existing tests should I copy the style from?</li><li>Which situations matter most: refunds, failed card payments, the same payment being sent twice?</li><li>Can tests call the real payment provider, or should they use a fake stand-in?</li><li>Where do the test files go?</li><li>How do I check I'm done (for example, "run <code>./mvnw test</code> and make sure everything passes")?</li></ul><p>A good prompt answers these before they're asked.</p>`}
  ]},
 "2-2": {
  objectives: ["Order a long prompt so the model uses the material well","Ask for an output format your code can read","Label the parts of a strong prompt"],
  problems: [
   {q:h`<p>You have a 30-page contract and want the three riskiest clauses. In what order should you put the parts of your prompt?</p>`,
    a:h`<ol><li>The contract itself, wrapped in tags such as <code>&lt;contract&gt; … &lt;/contract&gt;</code> so the model knows where it starts and ends.</li><li>Who you are and why it matters (the context).</li><li>The task and any rules.</li><li>The exact question and the format you want, last.</li></ol><p>Models answer better when the question comes after the long material, close to where they start writing.</p>`},
   {q:h`<p>Your code will read the model's answer automatically. What should your format instruction say?</p>`,
    a:h`<p>Ask for JSON only. List the exact field names and what type each is (text, number, list), and include one filled-in example. Say what to do when something is unknown, for example "use <code>null</code>; never guess". If the API can enforce a format for you, use that too, and still check the result in your code.</p>`}
  ]},
 "2-3": {
  objectives: ["Choose examples that teach the task without skewing the answer","Organise a prompt with tags","Decide when asking the model to think first helps"],
  problems: [
   {q:h`<p>Your prompt sorts reviews into positive and negative. It has three examples, and all three are positive. It keeps getting negative reviews wrong. Why, and how do you fix it?</p>`,
    a:h`<p>The model copies patterns from your examples, not only the task. Three positive examples quietly teach it that "the answer is usually positive".</p><p><b>Fix:</b> use a balanced set (positive and negative), include at least one tricky borderline review, and vary the length and wording. Then rerun your test cases to confirm it improved.</p>`},
   {q:h`<p>For which task will "think step by step before answering" help most? (a) Pulling the customer's name out of an email. (b) Working out whether a delivery route with five legs and given times meets a 4-hour deadline.</p>`,
    a:h`<p><b>(b).</b> It's a calculation with several steps, and writing out the in-between sums helps the model get them right. (a) is a simple lookup: extra thinking adds cost and delay without improving the answer.</p>`}
  ]},
 "2-4": {
  objectives: ["Build a small set of real test cases for a prompt","Tell a real improvement from luck","Change one thing at a time and learn from the failures"],
  lectures: [U.evalsCourse],
  deepNotes: h`
<h3>How much of a score is luck?</h3>
<p><b>In plain English:</b> if you test a prompt on only a few cases, its score bounces around by chance, like flipping a coin 10 times and getting 7 heads. Before you believe "v2 is better", check whether the difference is bigger than that bounce.</p>
<p>A standard way to measure the bounce is the <b>standard error</b> (SE):</p>
\[\text{SE} = \sqrt{\frac{p\,(1-p)}{n}}\]
<ul>
<li>\(p\) is the success rate, as a decimal (80% is 0.8).</li>
<li>\(n\) is the number of test cases.</li>
<li>\(\sqrt{\ }\) is the square root.</li>
</ul>
<p><b>Rule of thumb:</b> the true score is probably within <b>2 × SE</b> of what you measured, either way. If two versions' scores are closer than that, you can't yet tell them apart.</p>
<p><b>Why it matters:</b> notice that \(n\) is on the bottom. More test cases means less bounce. That's why serious teams use dozens or hundreds of cases, not five.</p>`,
  problems: [
   {q:h`<p>Prompt v1 passes 24 of 30 test cases; v2 passes 26 of 30. Is v2 really better?</p>`,
    a:h`<ol><li><b>Success rate:</b> about 0.8 (24 or 26 out of 30).</li><li><b>Standard error:</b> \(0.8 \times 0.2 = 0.16\); \(0.16 / 30 = 0.0053\); \(\sqrt{0.0053} \approx 0.073\), about 7 percentage points.</li><li><b>Bounce:</b> 2 × 7 = about ±15 points either way.</li><li><b>Difference:</b> 26/30 − 24/30 = 2 cases, about 7 points. That's well inside the bounce.</li></ol><p><b>So you can't tell yet.</b> Look at which cases changed. If v2 fixed two and broke none, that's a good sign, and more test cases will settle it.</p>`},
   {q:h`<p>You changed the system prompt and swapped an example at the same time, and the score dropped. What next?</p>`,
    a:h`<p>Go back to the last version that worked. Then make one change, rerun the tests, make the next change, rerun again. With two changes at once you can't tell which one helped and which one hurt, and they might cancel each other out.</p>`}
  ]},
 "3-1": {
  objectives: ["Describe the agent loop: think, use a tool, look at the result, repeat","Explain why small mistakes add up over long tasks","Name the parts of an agent's harness"],
  lectures: [U.agenticWebinar, U.berkeleyAgents],
  problems: [
   {q:h`<p>Trace the loop for "fix the failing test in <code>OrderService</code>". List each step the agent takes.</p>`,
    a:h`<ol><li>Run the tests to see which one fails and why.</li><li>Read the failing test.</li><li>Read <code>OrderService</code>.</li><li>Edit the code.</li><li>Run the tests again.</li><li>If they pass, reply with a summary. If not, read the new error and go back to step 3.</li></ol><p>Every result goes back into the agent's context, so each decision is based on evidence rather than guesswork.</p>`},
   {q:h`<p>An agent gets each step right 95% of the time. How likely is it to get all 20 steps of a task right?</p>`,
    a:h`<p>Multiply the chance for each step: \(0.95 \times 0.95 \times \dots\) (20 times) \(= 0.95^{20} \approx 0.36\), only about 36%.</p><p>Small error rates add up fast over long tasks. That's why agents need ways to check themselves (running tests, reading errors) and why short, checkable steps matter so much.</p>`}
  ]},
 "3-2": {
  objectives: ["Choose which commands an agent may run without asking","Estimate what a coding-agent session costs","Set up a coding agent with safe defaults"],
  problems: [
   {q:h`<p>Sort these into "allow automatically" and "ask me first": read files; run the tests; <code>git push</code>; <code>rm -rf build/</code> (delete a folder); install a new package; edit files in the project.</p>`,
    a:h`<p><b>Allow:</b> reading files, running tests, editing project files. These are local, and git lets you undo edits.</p><p><b>Ask first:</b> <code>git push</code> (other people will see it), deleting folders (can't be undone if the files weren't in git), and installing packages (new code from the internet, which could be unsafe).</p><p><b>The rule:</b> allow what stays on your computer and can be undone; ask before anything that can't be undone or reaches the outside world.</p>`},
   {q:h`<p>A session has 40 turns. Each turn averages 60,000 input tokens and 1,500 output tokens. Input costs $3 per million, output $15 per million. Roughly what does the session cost?</p>`,
    a:h`<p><b>Input:</b> 40 × 60,000 = 2.4 million tokens × $3 = $7.20.</p><p><b>Output:</b> 40 × 1,500 = 60,000 tokens = 0.06 million × $15 = $0.90.</p><p><b>Total:</b> about <b>$8</b>. Most of the input is the same project context read again every turn, which is why prompt caching cuts agent costs so much.</p>`}
  ]},
 "3-3": {
  objectives: ["Break a feature into small pieces an agent can build and check","Write a brief that says how to check the result","Know when to start a fresh session"],
  lectures: [U.specDriven, U.ccBestTalk],
  problems: [
   {q:h`<p>Break "add password reset by email" into small pieces an agent can build and check one at a time.</p>`,
    a:h`<ol><li>A table to store reset codes, with a test that codes expire.</li><li>A "request reset" step that creates a code and sends the email, tested with a fake email sender.</li><li>A "confirm reset" step that checks the code and sets the new password, with tests for expired, reused and wrong codes.</li><li>A limit on how many reset requests one person can make, with a test.</li><li>The screens the user sees.</li></ol><p>Each piece ends with passing tests and a commit.</p>`},
   {q:h`<p>Write the "how to check" line for piece 3 above.</p>`,
    a:h`<p>"Run <code>./mvnw test -Dtest=PasswordResetTests</code>. All tests must pass, including the expired, reused and wrong-code cases. Don't change or delete any existing test."</p>`}
  ]},
 "3-4": {
  objectives: ["Spot the common ways agents go wrong in a change","Review a change quickly and in a fixed order","Keep a failure log that leads to fixes"],
  problems: [
   {q:h`<p>The agent says "all tests pass". In the change, you see it edited a test's expected answer from <code>150</code> to <code>149</code>. What happened, and what do you do?</p>`,
    a:h`<p>It made the test pass by changing the test, not by fixing the code. This is a common agent mistake.</p><p>Reject the change. Ask it to explain why the code gives 149, and fix that. Add a rule (in your project instructions, or a hook) that tests can't be changed without your OK, and note it in your failure log.</p>`},
   {q:h`<p>Name three things to check in every agent change, besides "do the tests pass?".</p>`,
    a:h`<ol><li><b>Scope:</b> did it change only what the task needed?</li><li><b>Removed safety:</b> were any tests, checks or error handling deleted or weakened?</li><li><b>Made-up things:</b> does it use functions or packages that don't exist or that you didn't approve?</li></ol><p>Also look for passwords or keys, and compare what it says it did with what the change actually shows.</p>`}
  ]},
 "4-1": {
  objectives: ["Choose an exam project you can finish in a week","Write success criteria an agent can check"],
  problems: [
   {q:h`<p>Which makes a better exam project: (a) "a social network for Nigerian students" or (b) "a web app where a clinic receptionist logs walk-in patients and sees today's queue"?</p>`,
    a:h`<p><b>(b).</b> It has one user, one clear job and little data, so you can finish it, test it and explain every file in a week. (a) has no clear centre and would take months.</p>`},
   {q:h`<p>Write two success criteria for project (b).</p>`,
    a:h`<p>"When I add a patient with a name and a reason, they appear at the bottom of today's queue within a second, and they're still there after I refresh the page."</p><p>"When I mark a patient as seen, they leave the queue, the time is recorded, and today's count goes up by one."</p>`}
  ]},
 "4-2": {
  objectives: ["Work in a loop: small piece, test, save","Measure how much of the code the agent wrote"],
  problems: [
   {q:h`<p>How can you honestly show that the agent wrote at least 80% of the code?</p>`,
    a:h`<p>Save (commit) the agent's work and your own edits separately, for example by starting your own commit messages with "manual:". At the end, <code>git log --numstat</code> shows how many lines each commit added, so you can total each group. Report the number and explain where you had to step in.</p>`}
  ]},
 "4-3": {
  objectives: ["Explain every file in your project","Write a public write-up backed by evidence"],
  problems: [
   {q:h`<p>What makes a write-up convincing to an employer or client?</p>`,
    a:h`<p>Evidence, not adjectives: a link to the working app, the code, how much the agent wrote, two or three real failures from your log and how you fixed them, and what you'd do differently next time.</p>`}
  ]},
 "10-1": {
  objectives: ["Decide whether to use a hosted model or run your own","Check whether a model's licence allows your use","Check what hardware your own computer has for running models"],
  prereqs: "<p>Week 9 (calling a model from code). No hardware knowledge needed: the notes below explain every term and show you how to check your own machine.</p>",
  notes: `
<h3>Words you'll meet this week</h3>
<ul>
<li><b>Parameters (7B, 70B…):</b> the numbers inside a model that were learned in training. "7B" means 7 billion. More parameters usually means more capable, but also more memory and slower.</li>
<li><b>GPU:</b> a graphics chip that does the maths models need much faster than the main processor (CPU). <b>VRAM</b> is the GPU's own memory, and it's usually what decides which models fit.</li>
<li><b>Unified memory:</b> on Apple Silicon Macs the CPU and GPU share one pool of memory, so a 16 GB Mac can use most of it for a model.</li>
<li><b>Inference:</b> running a trained model to get answers (as opposed to training it).</li>
<li><b>Quantisation:</b> storing the model's numbers with fewer bits so it needs less memory, at a small cost in quality (lesson 10.3).</li>
</ul>
<h3>Check your own machine (two minutes)</h3>
<p><b>Windows:</b> open Task Manager → Performance. Click "GPU" if it's listed and note "Dedicated GPU memory"; click "Memory" for your RAM. <b>Mac:</b> Apple menu → About This Mac shows the chip (M1, M2…) and memory. Write both numbers down; lesson 10.3 uses them.</p>
<div class="callout"><b>No GPU, or an older laptop?</b> You can still do every exercise this week. Small models (1–4B parameters) run on an ordinary CPU with 8 GB of RAM: slowly, but they work, and the skills are identical. If you want more speed for free, some notebook services, such as Google Colab, offer a free GPU for limited sessions.</div>`,
  problems: [
   {q:h`<p>A Lagos hospital wants AI suggestions on patient notes, and says the data must never leave its own computers. A startup wants a prototype chatbot by Friday. Which one should run its own model?</p>`,
    a:h`<p><b>The hospital.</b> Its rule means it can't send notes to an outside service (unless a contract guarantees where the data goes and how it's handled), so running an open model on its own machines is the safe choice.</p><p><b>The startup</b> should use a hosted service: it's faster to get going and cheaper at small scale, and it can switch later.</p>`},
   {q:h`<p>What three things do you check in a model's licence before building a product on it?</p>`,
    a:h`<ol><li>Is commercial use allowed? Are there limits, for example on very large companies or user numbers?</li><li>Are some uses forbidden?</li><li>If you change or retrain the model, what must you do (keep the name, credit the creator, pass the licence on)?</li></ol><p>Write down the licence and version in your project.</p>`}
  ]},
 "10-2": {
  objectives: ["Read a model's information page and its file name","Choose model files that are safe to download"],
  prereqs: "<p>Lesson 10.1. A free Hugging Face account is useful but not required to browse models.</p>",
  notes: `
<div class="callout"><b>Overwhelmed by Hugging Face?</b> It hosts over a million models, and most aren't for you. Filter by task ("Text Generation"), sort by downloads, and stick to the big families named in lesson 10.1, in their <em>Instruct</em> versions. For running locally this week, you only need to recognise one thing: a GGUF file whose size fits your memory.</div>`,
  problems: [
   {q:h`<p>What does the file name <code>Qwen2.5-7B-Instruct-Q4_K_M.gguf</code> tell you?</p>`,
    a:h`<ul><li><b>Qwen2.5:</b> the model family and version.</li><li><b>7B:</b> 7 billion parameters.</li><li><b>Instruct:</b> the version trained to follow instructions and chat (the one you usually want).</li><li><b>Q4_K_M:</b> squeezed to about 4 bits per number to save memory, using a common "medium" method.</li><li><b>.gguf:</b> the file format that Ollama and llama.cpp run.</li></ul>`},
   {q:h`<p>Why prefer a <code>.safetensors</code> file over a <code>.bin</code> or <code>.pt</code> file from an uploader you don't know?</p>`,
    a:h`<p>Older <code>.bin</code> and <code>.pt</code> files can contain hidden program code that runs on your computer when the file is opened. A <code>.safetensors</code> file holds only the model's numbers, so opening it can't run anything.</p>`}
  ]},
 "10-3": {
  objectives: ["Work out whether a model will fit in your computer's memory","Explain why long conversations need extra memory","Choose a model size and quantisation for your machine"],
  prereqs: "<p>Lesson 10.1, and the memory numbers you noted for your own machine.</p>",
  lectures: [U.quant],
  notes: `
<h3>Will it fit? The quick rule</h3>
<p><b>At 4-bit, a model needs a bit more than half its parameter count in gigabytes</b> (an 8B model needs about 5 GB), plus room for the context. Leave a couple of gigabytes for your operating system and other apps.</p>
<div class="callout"><b>Quick guide by machine:</b> 8 GB RAM, no GPU: 1–4B models at 4-bit. 16 GB RAM or a 6–8 GB GPU: 7–8B models at 4-bit. 32 GB+ or a 16–24 GB GPU: 14–32B models. If a model is painfully slow or crashes, step down one size before trying anything else.</div>`,
  deepNotes: h`
<h3>Where the quick rule comes from</h3>
<p><b>In plain English:</b> a model is mostly a huge list of numbers. Memory needed = how many numbers × how much space each one takes. Quantisation simply makes each number take less space.</p>
<p>One <b>byte</b> is 8 bits. So a number stored in \(b\) bits takes \(b \div 8\) bytes:</p>
\[\text{memory for the model} \approx N \times \frac{b}{8} \ \text{bytes}\]
<ul>
<li>\(N\) is the number of parameters (8 billion for an 8B model).</li>
<li>\(b\) is the bits per number: 16 for full size, 8 or 4 when quantised.</li>
</ul>
<p>At 4 bits, \(4 \div 8 = 0.5\) bytes per number, so an 8B model needs \(8\text{ billion} \times 0.5 = 4\) billion bytes, about 4 GB. Add some extra for the software, and that's the "about 5 GB" in the quick rule.</p>
<h3>Why long conversations need more memory</h3>
<p>While it works, the model keeps notes on every token in the conversation so it doesn't have to re-read everything from scratch. These notes are called the <b>KV cache</b>, and they grow with every token:</p>
\[\text{memory per token} = 2 \times L \times H \times d \times \text{bytes per number}\]
<ul>
<li>\(L\): the number of layers (stages) in the model.</li>
<li>\(H\): how many "key/value heads" each layer keeps. Think of these as separate note-takers.</li>
<li>\(d\): how many numbers each note-taker stores per token.</li>
<li>The 2 is there because each note comes in two parts, a "key" and a "value".</li>
</ul>
<p>You'll find \(L\), \(H\) and \(d\) on the model's information page. You don't need to memorise this: the problems below walk through it once.</p>`,
  problems: [
   {q:h`<p>How much memory does an 8-billion-parameter model need at 16-bit, and at 4-bit?</p>`,
    a:h`<p><b>16-bit:</b> 16 bits = 2 bytes per number. 8 billion × 2 = 16 billion bytes = <b>16 GB</b>.</p><p><b>4-bit:</b> 4 bits = 0.5 bytes per number. 8 billion × 0.5 = 4 billion bytes = <b>4 GB</b>, plus some extra for the software, so plan on about 5 GB.</p><p>That's why a 4-bit 8B model runs on a laptop with an 8 GB graphics card or 16 GB of shared memory, while the full-size version doesn't.</p>`},
   {q:h`<p>A model has 32 layers, 8 key/value heads and 128 numbers per head, stored at 16-bit (2 bytes each). How much memory does a 32,000-token conversation need for its KV cache?</p>`,
    a:h`<ol><li><b>Per token:</b> 2 × 32 × 8 × 128 × 2 bytes. Step by step: 2 × 32 = 64; × 8 = 512; × 128 = 65,536; × 2 = 131,072 bytes, which is 128 KB.</li><li><b>For 32,000 tokens:</b> 32,000 × 128 KB = 4,096,000 KB, about <b>3.9 GB</b>.</li></ol><p>That's about as much as the whole 4-bit model. A long conversation can double the memory you need, which is why long chats on a small machine slow down or crash.</p>`}
  ]},
 "10-4": {
  objectives: ["Run a model on your own computer and call it from code","Avoid the common mistakes when running models locally","Know when you've outgrown Ollama"],
  prereqs: "<p>Lessons 10.1–10.3 and lesson 9.1 (calling a model from Python).</p>",
  lectures: [U.cs336_10],
  notes: `
<div class="callout"><b>Stuck?</b> <code>ollama: command not found</code> or "not recognized": the install didn't add Ollama to your PATH, so restart the terminal (or the computer, on Windows). "Connection refused" on <code>localhost:11434</code>: the Ollama app or <code>ollama serve</code> isn't running. Very slow replies or an out-of-memory error: the model is too big for your machine, so pull a smaller one (lesson 10.3's quick guide). The first reply after starting is always slower, because the model is loading into memory.</div>`,
  problems: [
   {q:h`<p>You send a 20,000-token document to a model running on your computer, and its answers ignore the start of the document. What's the likely cause?</p>`,
    a:h`<p>The model is set to read fewer tokens than you sent, so the start was cut off without warning. In Ollama, raise the setting called <code>num_ctx</code> (the context length) in your request or model settings, and check your machine has the extra memory a longer context needs (lesson 10.3).</p>`},
   {q:h`<p>When should you move from Ollama to a server tool like vLLM?</p>`,
    a:h`<p>When many people use your model at the same time on a proper GPU server. vLLM is built to answer lots of requests together efficiently. For one person, learning, or a laptop, Ollama is simpler and fine.</p>`}
  ]},
 "10-5": {
  objectives: ["Decide whether a problem needs fine-tuning, retrieval or just a better prompt","Explain why LoRA makes fine-tuning cheap","Describe the steps of a fine-tuning project and what goes wrong"],
  prereqs: "<p>Lessons 10.1–10.4. Fine-tuning is optional this week: understanding <em>when</em> to do it matters more than doing it. If you do try it, a free GPU notebook is enough for a small model.</p>",
  lectures: [U.loraCode, U.loraQlora],
  deepNotes: h`
<h3>Why LoRA is so cheap</h3>
<p><b>In plain English:</b> normal fine-tuning adjusts every number in the model. LoRA leaves the original numbers alone and trains a small "add-on" that nudges them. The add-on is built from two thin tables of numbers instead of one huge one, so there's far less to train.</p>
<p>A model is made of big grids (matrices) of numbers. Say one grid is \(d\) rows by \(k\) columns: it holds \(d \times k\) numbers. LoRA replaces "change all of them" with:</p>
\[\text{new grid} = \text{original grid} + B \times A\]
<ul>
<li>\(A\) is a thin grid with \(r\) rows and \(k\) columns.</li>
<li>\(B\) is a thin grid with \(d\) rows and \(r\) columns.</li>
<li>\(r\) (the <b>rank</b>) is small, often 8 or 16. It controls how big the add-on is.</li>
</ul>
<p>Multiplying \(B \times A\) gives a full-size \(d \times k\) grid, but you only had to train \(r \times (d + k)\) numbers. The original grid stays frozen. (In practice the update is also scaled by a setting, so you'll see \(\tfrac{\alpha}{r} BA\) in papers; the idea is the same.)</p>`,
  problems: [
   {q:h`<p>One grid in a model is 4,096 × 4,096. With LoRA rank \(r = 16\), how many numbers do you train, compared with the full grid?</p>`,
    a:h`<ol><li><b>Full grid:</b> 4,096 × 4,096 = 16,777,216 numbers.</li><li><b>LoRA:</b> \(r \times (d + k)\) = 16 × (4,096 + 4,096) = 16 × 8,192 = 131,072 numbers.</li><li><b>Share:</b> 131,072 ÷ 16,777,216 ≈ 0.0078, which is <b>0.78%</b>.</li></ol><p>You train less than 1% of the numbers. That's why LoRA fits on one graphics card and the result is a small file of a few megabytes.</p>`},
   {q:h`<p>A clinic wants the model to know its list of available drugs, which changes every month. Fine-tune, or use retrieval (looking up the current list and giving it to the model)?</p>`,
    a:h`<p><b>Retrieval.</b> Information that changes should be looked up fresh: updating the list takes minutes, and the answer can show where it came from. Fine-tuning is for teaching <em>how</em> to answer (style, format, behaviour), not for facts that must stay up to date.</p>`}
  ]},
 // 10-6 lives in lesson10-6.ts; this adds the theory note to its Go deep
 "10-6": {
  deepNotes: h`
<h3>What "the loss" actually is</h3>
<p><b>In plain English:</b> at every position the model gives a probability to the token that really comes next. If it gave the right token a high probability, it was barely surprised and the loss is small. If it gave it a low probability, it was very surprised and the loss is big. Training makes the loss smaller, on average, across trillions of tokens.</p>
<p>The usual measure is the <b>cross-entropy loss</b>:</p>
\[\text{loss} = -\log p(\text{correct next token})\]
<ul>
<li>\(p(\dots)\) is the probability the model gave the token that really came next, between 0 and 1.</li>
<li>\(\log\) is the natural logarithm (the \(\ln\) button on a calculator). For numbers below 1 it is negative, so the minus sign turns the loss into a positive number.</li>
</ul>
<p><b>Small example.</b> If the model gave the right token a probability of 0.9, the loss is \(-\ln 0.9 \approx 0.11\): barely surprised. If it gave only 0.1, the loss is \(-\ln 0.1 \approx 2.30\): very surprised. A perfect guess (probability 1) gives a loss of 0.</p>
<p><b>Why it matters:</b> when model releases show "loss going down" charts, this is the number. The same loss is used in fine-tuning (SFT), just on example conversations instead of raw web text.</p>`,
 }
};
