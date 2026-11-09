import type { LessonUpgrade } from "./types";
import { U } from "./unis";

// Lecture upgrades for the agent-user track: university lectures, learning objectives,
// extra notes and problem sets with worked solutions, layered onto the lessons by id.
// Maths goes in \( \) (inline) or \[ \] (display) and is rendered with KaTeX. Use h`...` (String.raw) so backslashes survive.
const h = String.raw;

export const UPGRADES: Record<string, LessonUpgrade> = {
 "1-1": {
  objectives: ["Explain next-token prediction and write down the probability a model assigns to a whole sequence","Describe what pre-training, fine-tuning and reinforcement learning each add","Predict how a base model and an assistant model will respond differently to the same input"],
  lectures: [U.mit191llm, U.cs229llm],
  notes: h`
<h3>The one equation</h3>
<p>A language model assigns a probability to every possible sequence of tokens by breaking it into one prediction per position:</p>
\[P(x_1, x_2, \dots, x_T) = \prod_{t=1}^{T} P(x_t \mid x_1, \dots, x_{t-1})\]
<p>Training makes the model assign high probability to real text; generation samples one token at a time from \(P(x_t \mid x_{\lt t})\) and feeds it back in. Everything in this course, including agents, is this loop with more machinery around it.</p>`,
  problems: [
   {q:h`<p>A base model (pre-trained only) is given two inputs: (a) <code>What is the capital of Nigeria?</code> and (b) <code>Q: What is the capital of Nigeria?\nA:</code>. Predict what each is likely to produce, and explain using the equation above.</p>`,
    a:h`<p>(a) may continue with more quiz-style questions, because on the web a question is often followed by another question. (b) is likely to produce <code> Abuja</code>, because text in a Q/A format is usually followed by an answer. The model is the same; only the conditioning text \(x_{\lt t}\) changed, and that changes the distribution over the next token. That is why the format of your input matters.</p>`},
   {q:h`<p>Why did models improve so quickly at writing code that passes tests and at maths with checkable answers, faster than at writing persuasive essays?</p>`,
    a:h`<p>Reinforcement learning needs a reward. For code and maths the reward can be computed automatically (do the tests pass? does the answer match?), so you can generate millions of practice attempts cheaply. Essays need human or model judgement, which is slower, noisier and easier to game.</p>`}
  ]},
 "1-2": {
  objectives: ["Estimate token counts and API cost for a workload","Budget a context window for a multi-step task","Explain why tokenization makes some tasks and languages harder or more expensive"],
  lectures: [U.cs336_1],
  problems: [
   {q:h`<p>Each request sends a 2,000-token system prompt and a 500-token user message and gets a 400-token reply. Input costs $3 per million tokens and output $15 per million. What does it cost to serve 10,000 requests a day?</p>`,
    a:h`<p>Input: \(10{,}000 \times 2{,}500 = 25\text{M}\) tokens, so \(25 \times \$3 = \$75\). Output: \(10{,}000 \times 400 = 4\text{M}\) tokens, so \(4 \times \$15 = \$60\). Total <b>$135 a day</b>, about $4,000 a month. More than half of it is the system prompt sent again on every request, which is exactly what prompt caching is for.</p>`},
   {q:h`<p>An agent has a 200,000-token window. The system prompt and tools take 5,000 tokens, you reserve 4,000 for the reply, and each step adds about 8,000 tokens of tool output. How many steps fit before it must compact or drop history?</p>`,
    a:h`<p>\(\lfloor (200{,}000 - 5{,}000 - 4{,}000) / 8{,}000 \rfloor = \lfloor 23.9 \rfloor = 23\) steps. In practice quality drops before the window is full, so long tasks should keep tool output short and split work across fresh contexts.</p>`}
  ]},
 "1-3": {
  objectives: ["Compute next-token probabilities from logits at different temperatures","Choose sampling settings for extraction vs creative tasks","Explain why one successful run is weak evidence"],
  lectures: [U.cs224n_nlg],
  notes: h`
<h3>The maths of temperature</h3>
<p>The model outputs a score (a <em>logit</em>) \(z_i\) for each token. Sampling turns scores into probabilities with a softmax divided by the temperature \(T\):</p>
\[p_i = \frac{e^{z_i / T}}{\sum_j e^{z_j / T}}\]
<p>As \(T \to 0\) all the probability goes to the largest logit (greedy decoding). At \(T = 1\) you sample from the model's own distribution. Larger \(T\) flattens the distribution towards uniform.</p>`,
  problems: [
   {q:h`<p>Three candidate tokens have logits \(z = (2, 1, 0)\). Compute their probabilities at \(T = 1\) and \(T = 0.5\).</p>`,
    a:h`<p>\(T=1\): \(e^2, e^1, e^0 = 7.389, 2.718, 1\); sum \(11.107\); probabilities \((0.665, 0.245, 0.090)\).<br>\(T=0.5\): logits become \((4, 2, 0)\); \(e^4, e^2, e^0 = 54.60, 7.389, 1\); sum \(62.99\); probabilities \((0.867, 0.117, 0.016)\). Halving the temperature moved the top token from 67% to 87%.</p>`},
   {q:h`<p>A prompt really succeeds 60% of the time. What is the chance it works on your one test run? On five runs in a row?</p>`,
    a:h`<p>One run: \(0.6\), so a single success tells you little. Five in a row: \(0.6^5 \approx 0.078\). Even a prompt that works 90% of the time passes five in a row only \(0.9^5 \approx 59\%\) of the time. Judge prompts on many runs, and treat one success as a hint, not a result.</p>`}
  ]},
 "1-4": {
  objectives: ["Identify which claims in an answer are most likely to be hallucinated","Design a verification step proportional to the cost of being wrong","Reason about a hallucination checker's precision using Bayes' rule"],
  lectures: [U.cs25rag],
  problems: [
   {q:h`<p>A model writes a two-page legal memo with four case citations. Design a check that takes under 15 minutes.</p>`,
    a:h`<p>Check the claims that are cheap to verify and expensive to get wrong: (1) look up all four citations in the official law report or database and confirm each exists and says what is claimed; (2) check every number and date against the source; (3) ask the model, in a fresh session with the sources pasted in, which statements are not supported by them. Any citation that cannot be found is treated as invented, and the memo is reworked from the sources.</p>`},
   {q:h`<p>5% of answers from your system contain a hallucination. An automatic checker catches 90% of them but also flags 10% of correct answers. When it flags an answer, how likely is that answer to really contain a hallucination?</p>`,
    a:h`<p>Out of 1,000 answers: 50 are hallucinated and 45 of those are flagged. 950 are fine and 95 of those are flagged. So \(P(\text{hallucinated} \mid \text{flagged}) = 45 / (45 + 95) \approx 0.32\). Two-thirds of the flags are false alarms. This is Bayes' rule, and it is why a checker's precision must be measured on your own data.</p>`}
  ]},
 "2-1": {
  objectives: ["Rewrite a vague request into a complete specification","Apply the new-hire test to any prompt","Explain why stating the reason improves model output"],
  lectures: [U.cs224n_prompt],
  problems: [
   {q:h`<p>Rewrite "Summarise this report" as a spec.</p>`,
    a:h`<p>One good version: "You're briefing the CEO of a 40-person logistics company who has five minutes before a board meeting. Summarise the attached quarterly report in at most 150 words: lead with the one decision the board needs to make, then the three numbers that matter most and how each changed since last quarter, then any risks. Plain English and no jargon. If the report doesn't support a claim, leave it out." It names the reader, the purpose, the length, the structure, the tone and what to do when unsure.</p>`},
   {q:h`<p>What is missing from this prompt? "Write unit tests for the payment service."</p>`,
    a:h`<p>Which language and test framework to use, and which existing tests to copy the style from. Which behaviours matter (refunds, failed charges, idempotency). Whether real network calls are allowed or the Stripe client must be mocked. Where the files go. How to check the result (for example "run <code>./mvnw test</code> and make sure everything passes"). A new hire would ask all of these, so the prompt should answer them.</p>`}
  ]},
 "2-2": {
  objectives: ["Order a long prompt so the model uses the material well","Specify an output format that code can parse","Annotate a prompt with role, context, task, constraints and format"],
  problems: [
   {q:h`<p>You have a 30-page contract and want three risky clauses identified. In what order should the parts of the prompt go?</p>`,
    a:h`<p>Put the contract first, wrapped in tags such as <code>&lt;contract&gt;</code>. Then give the role and context (who you are and why it matters), then the task and constraints, and put the exact question and output format last. Models answer better when the question comes after the long material, close to where they start writing.</p>`},
   {q:h`<p>Your code will parse the model's answer. What should the format instruction say?</p>`,
    a:h`<p>Ask for JSON only, give the exact schema with field names and types and one filled-in example, and say what to return when a field is unknown (for example <code>null</code>, never a guess). Where the API supports structured outputs or tool schemas, use them so the format is enforced instead of hoped for. Always validate the result in code anyway.</p>`}
  ]},
 "2-3": {
  objectives: ["Choose few-shot examples that cover the range of inputs without biasing the output","Structure prompts with tags","Decide when asking the model to reason first improves accuracy"],
  lectures: [U.cs224n_agents],
  problems: [
   {q:h`<p>Your sentiment-classification prompt has three examples, all labelled "positive". Accuracy on negative reviews is poor. Why, and how do you fix it?</p>`,
    a:h`<p>The examples act as a prior: the model copies their labels and style as well as the task. Use examples that are balanced across labels, include at least one hard or borderline case, and vary length and wording so the model doesn't learn surface features. Then re-run your test set to confirm the fix.</p>`},
   {q:h`<p>For which of these will "think step by step before answering" help most: (a) extracting the customer's name from an email, (b) working out whether a delivery route meets a 4-hour deadline given five legs with times?</p>`,
    a:h`<p>(b). It is a multi-step calculation, and writing out the intermediate sums gives the model room to compute them. (a) is a lookup, so extra reasoning adds cost and delay without improving accuracy.</p>`}
  ]},
 "2-4": {
  objectives: ["Build a test set of real cases for a prompt","Tell a real improvement from noise using a standard error","Change one variable at a time and read the failures"],
  lectures: [U.cs224n_bench],
  notes: h`
<h3>How big is the noise?</h3>
<p>If a prompt's true success rate is \(p\) and you test it on \(n\) cases, the measured rate has a standard error of about</p>
\[\text{SE} = \sqrt{\frac{p(1-p)}{n}}\]
<p>and a rough 95% interval is the measured rate \(\pm 2\,\text{SE}\). Small test sets give wide intervals.</p>`,
  problems: [
   {q:h`<p>Prompt v1 passes 24 of 30 cases; v2 passes 26 of 30. Is v2 better?</p>`,
    a:h`<p>At \(p \approx 0.8\) and \(n = 30\): \(\text{SE} = \sqrt{0.8 \times 0.2 / 30} \approx 0.073\), so each score is uncertain by about ±15 percentage points. A 6.7-point difference is well within the noise. Look at the cases that changed. If v2 fixed two and broke none, that is encouraging, and adding more cases will settle it. If it fixed four and broke two, you have learned what each version is weak at.</p>`},
   {q:h`<p>You changed the system prompt and swapped an example at the same time, and the score dropped. What next?</p>`,
    a:h`<p>Revert to the last known-good version, then apply one change at a time and re-run the test set after each one. With two changes at once you can't tell which one helped or hurt, and they may cancel each other out.</p>`}
  ]},
 "3-1": {
  objectives: ["Describe the agent loop: model, tool call, result, repeat","Explain why errors compound over long tasks","Identify the parts of a harness"],
  lectures: [U.agenticWebinar, U.berkeleyAgents],
  problems: [
   {q:h`<p>Trace the loop for "fix the failing test in <code>OrderService</code>": list each model turn and tool call.</p>`,
    a:h`<p>1. The model calls a tool to run the tests and sees which one fails and why. 2. It reads the test file. 3. It reads <code>OrderService</code>. 4. It edits the method. 5. It runs the tests again. 6. If they pass, it replies with a summary; if not, it reads the new failure and goes back to step 3. Every tool result goes back into the context, so the model's next decision is based on evidence rather than guesses.</p>`},
   {q:h`<p>If each step of an agent is right 95% of the time, independently, how likely is a 20-step task to finish with no errors?</p>`,
    a:h`<p>\(0.95^{20} \approx 0.36\). That is why agents need ways to check and recover (running tests, reading errors, retrying), and why breaking work into short, verifiable slices matters so much.</p>`}
  ]},
 "3-2": {
  objectives: ["Choose which commands an agent may run without approval","Estimate the cost of a coding-agent session","Set up a coding agent with safe defaults"],
  problems: [
   {q:h`<p>Sort these into "allow automatically" and "ask first": read files, run the test suite, <code>git push</code>, <code>rm -rf build/</code>, <code>npm install</code> of a new package, edit files in the repo.</p>`,
    a:h`<p><b>Allow:</b> read files, run tests, edit files in the repo (git lets you undo edits). <b>Ask first:</b> <code>git push</code> (others can see it), <code>rm -rf</code> (can't be undone outside git), and installing new packages (supply-chain risk and network access). Allow what is reversible and local; ask for anything that is irreversible or reaches the outside world.</p>`},
   {q:h`<p>A session has 40 turns, averaging 60,000 input tokens and 1,500 output tokens per turn, at $3 / $15 per million. Estimate the cost.</p>`,
    a:h`<p>Input: \(40 \times 60{,}000 = 2.4\text{M}\) tokens, so $7.20. Output: \(40 \times 1{,}500 = 60{,}000\) tokens, so $0.90. About <b>$8</b>. Most of the input is the same context re-read on every turn, which is why prompt caching cuts agent costs so much.</p>`}
  ]},
 "3-3": {
  objectives: ["Split a feature into small slices an agent can verify","Write a spec that includes how to check the result","Know when to clear context between tasks"],
  lectures: [U.berkeleySwe],
  problems: [
   {q:h`<p>Split "add password reset by email" into slices an agent can build and check one at a time.</p>`,
    a:h`<p>1. Create a reset-token table and a migration, with a test that tokens expire. 2. Add a "request reset" endpoint that creates a token and sends an email, tested against a fake mailer. 3. Add a "confirm reset" endpoint that checks the token and sets the new password, with tests for expired, reused and wrong tokens. 4. Add rate limiting, with a test. 5. Build the UI screens. Each slice ends with passing tests and a commit.</p>`},
   {q:h`<p>Write the "how to check" line for slice 3 above.</p>`,
    a:h`<p>"Run <code>./mvnw test -Dtest=PasswordResetTests</code>. All tests must pass, including expired-token, reused-token and wrong-token cases, and no existing test may be changed or deleted."</p>`}
  ]},
 "3-4": {
  objectives: ["Spot the common ways agents fail in a diff","Review a diff efficiently","Keep a failure log that leads to fixes"],
  problems: [
   {q:h`<p>The agent says "all tests pass". In the diff, it changed a test's expected value from <code>150</code> to <code>149</code>. What happened, and what do you do?</p>`,
    a:h`<p>The agent made the test pass by changing the test instead of fixing the code, which is a common failure. Reject the change, ask it to explain why the code returns 149, and add a rule (in the project instructions or a hook) that tests can't be changed without your approval. Log it in your failure log.</p>`},
   {q:h`<p>Name three things to check in every agent diff, beyond "do the tests pass".</p>`,
    a:h`<p>(1) Scope: it changed only what the task needed, with no unrelated rewrites. (2) Deleted or weakened checks: tests, validation or error handling removed. (3) Invented APIs or dependencies: calls to functions or packages that don't exist or weren't approved. Also check secrets, and compare its summary against what the diff actually does.</p>`}
  ]},
 "4-1": {
  objectives: ["Choose an exam project you can finish in a week","Write acceptance criteria an agent can check"],
  problems: [
   {q:h`<p>Which is the better exam project: (a) "a social network for Nigerian students" or (b) "a web app where a clinic receptionist logs walk-in patients and sees today's queue"?</p>`,
    a:h`<p>(b). It has one user, one clear job and a small data model, so you can finish it, test it and explain every file in a week. (a) has no clear core and would take months.</p>`},
   {q:h`<p>Write two acceptance criteria for project (b).</p>`,
    a:h`<p>"Adding a patient with a name and reason makes them appear at the bottom of today's queue within one second, and they are still there after a page reload." "Marking a patient as seen removes them from the queue and records the time; the daily count on the dashboard goes up by one."</p>`}
  ]},
 "4-2": {
  objectives: ["Run a build loop of slice, test, commit","Measure how much of the code the agent wrote"],
  problems: [
   {q:h`<p>How can you measure honestly that the agent wrote at least 80% of the code?</p>`,
    a:h`<p>Commit the agent's work and your own edits separately (for example, by tagging your commits "manual"). At the end, total the lines added in each group with <code>git log --numstat</code>. Report the number, and explain where you had to step in and why.</p>`}
  ]},
 "4-3": {
  objectives: ["Explain every file in your project in a walkthrough","Write a public write-up that shows your evidence"],
  problems: [
   {q:h`<p>What makes a write-up convincing to an employer or client?</p>`,
    a:h`<p>Evidence rather than adjectives: a link to the running app, the repository, the share of code the agent wrote, two or three real failures from your log and how you fixed them, and what you would do differently next time.</p>`}
  ]},
 "10-1": {
  objectives: ["Decide between hosted and self-hosted models for a given product","Check a model's licence for commercial use"],
  problems: [
   {q:h`<p>A Lagos hospital wants triage suggestions on patient notes and says the data must not leave its servers. A startup wants a prototype chatbot by Friday. Which should self-host?</p>`,
    a:h`<p>The hospital: its data-residency requirement rules out sending notes to a hosted API unless a contract and region meet the requirement, so an open model on its own hardware is the safe default. The startup should use a hosted API: it's faster to ship and cheaper at low volume, and it can switch later.</p>`},
   {q:h`<p>What three things do you check in a model's licence before building a product on it?</p>`,
    a:h`<p>(1) Whether commercial use is allowed, and any limit on company size or user numbers. (2) Restrictions on how it may be used. (3) Obligations on derived models (naming, attribution, passing on the licence). Record the licence and version in your project.</p>`}
  ]},
 "10-2": {
  objectives: ["Read a model card and a GGUF file name","Choose safe file formats"],
  problems: [
   {q:h`<p>Decode the file name <code>Qwen2.5-7B-Instruct-Q4_K_M.gguf</code>.</p>`,
    a:h`<p>The Qwen 2.5 family, 7 billion parameters, the instruction-tuned (chat) variant, quantised to about 4 bits per weight with the K-quant "medium" mix, in the GGUF format used by llama.cpp and Ollama.</p>`},
   {q:h`<p>Why prefer <code>.safetensors</code> over a <code>.bin</code> or <code>.pt</code> pickle file from an unknown uploader?</p>`,
    a:h`<p>Pickle files can run arbitrary code when they are loaded. Safetensors stores only tensors, so loading one can't run code.</p>`}
  ]},
 "10-3": {
  objectives: ["Estimate the memory needed for a model at a given precision","Compute the KV-cache size for a context length","Choose a quantisation level for your hardware"],
  lectures: [U.quant],
  notes: h`
<h3>The two numbers that decide whether it fits</h3>
<p>The weights of a model with \(N\) parameters stored at \(b\) bits each take about</p>
\[\text{weights} \approx N \times \frac{b}{8} \ \text{bytes}\]
<p>On top of that, every token in the context stores keys and values for each layer (the KV cache):</p>
\[\text{KV per token} = 2 \times L \times H_{kv} \times d_{head} \times \text{bytes per value}\]
<p>where \(L\) is the number of layers, \(H_{kv}\) the number of key/value heads and \(d_{head}\) the head dimension.</p>`,
  problems: [
   {q:h`<p>How much memory do the weights of an 8-billion-parameter model need at 16-bit and at 4-bit precision?</p>`,
    a:h`<p>16-bit: \(8 \times 10^9 \times 2 = 16\) GB. 4-bit: \(8 \times 10^9 \times 0.5 = 4\) GB, plus some overhead (quantisation scales and runtime buffers), so plan for about 5 GB. This is why a 4-bit 8B model runs on a laptop with 8 GB of VRAM or 16 GB of unified memory.</p>`},
   {q:h`<p>A model has 32 layers, 8 KV heads and a head dimension of 128, with a 16-bit cache. How much memory does a 32,000-token context need?</p>`,
    a:h`<p>Per token: \(2 \times 32 \times 8 \times 128 \times 2 = 131{,}072\) bytes \(= 128\) KiB. For 32,000 tokens: \(32{,}000 \times 128\ \text{KiB} \approx 3.9\) GiB. That's as much as the 4-bit weights themselves, which is why long contexts run out of memory.</p>`}
  ]},
 "10-4": {
  objectives: ["Run a model locally and call it from code","Avoid the common local-serving mistakes","Know when to move from Ollama to vLLM"],
  lectures: [U.cs336_10],
  problems: [
   {q:h`<p>Your 20,000-token prompt to a local model gets answers that ignore the start of the document. What's the likely cause?</p>`,
    a:h`<p>The runtime's context length is set lower than your prompt, so the start was cut off. In Ollama, raise <code>num_ctx</code> (in the request options or a Modelfile), and check you have memory for the larger KV cache.</p>`},
   {q:h`<p>When does it make sense to move from Ollama to vLLM?</p>`,
    a:h`<p>When you serve many users at once on a GPU server: vLLM's continuous batching and paged KV cache give much higher throughput. Ollama is best for one user, development and laptops.</p>`}
  ]},
 "10-5": {
  objectives: ["Decide whether a problem needs fine-tuning, RAG or a better prompt","Compute how many parameters LoRA trains","Describe the LoRA workflow and its common failures"],
  lectures: [U.cs224n_post],
  notes: h`
<h3>LoRA in one equation</h3>
<p>Instead of updating a weight matrix \(W \in \mathbb{R}^{d \times k}\), LoRA freezes it and learns a low-rank update:</p>
\[W' = W + \frac{\alpha}{r} B A, \qquad B \in \mathbb{R}^{d \times r},\ A \in \mathbb{R}^{r \times k},\ r \ll \min(d, k)\]
<p>Only \(A\) and \(B\) are trained: \(r(d + k)\) parameters instead of \(dk\).</p>`,
  problems: [
   {q:h`<p>For a \(4096 \times 4096\) projection and rank \(r = 16\), how many parameters does LoRA train, as a share of the full matrix?</p>`,
    a:h`<p>\(16 \times (4096 + 4096) = 131{,}072\) against \(4096^2 = 16{,}777{,}216\): about <b>0.78%</b>. That is why LoRA fits on one GPU and the adapter file is only megabytes.</p>`},
   {q:h`<p>A clinic wants the model to know its drug formulary, which changes every month. Fine-tune or RAG?</p>`,
    a:h`<p>RAG. Facts that change belong in retrieval, where an update takes minutes and answers can cite the source. Fine-tuning is for behaviour and format (how to answer), not for knowledge that has to stay current.</p>`}
  ]}
};
