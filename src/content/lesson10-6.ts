import type { Lesson, Resource } from "./types";

// Lesson 10.6: how LLMs are trained end to end. Follows 10.5 (LoRA), before Week 11 (evals).
// Core videos are short and beginner-level; the Stanford and Karpathy lectures (with `src`) go into Go deep.
// h`...` (String.raw) keeps backslashes for maths.
const h = String.raw;

const V: Record<string, Resource> = {
  howLlms: { title: "How large language models work — IBM Technology", len: "6 min", url: "https://www.youtube.com/watch?v=5sLYAQS9sWQ" },
  rlhf: { title: "Reinforcement learning from human feedback (RLHF) explained — IBM Technology", len: "11 min", url: "https://www.youtube.com/watch?v=T_X4XFwKX8k" },
  cme295Training: {
    title: "LLM training, full lecture. Opens at the Pretraining chapter (3:36); rewind to watch from the start",
    url: "https://www.youtube.com/watch?v=S3bCDcJhz4s&t=216s",
    src: "Stanford CME295 · Autumn 2026 · Lecture 3", len: "1 hr 45 min", embed: false,
  },
  karpathyDeep: { title: "Deep dive into LLMs like ChatGPT — Andrej Karpathy", src: "Andrej Karpathy", len: "3 hr 31 min", url: "https://www.youtube.com/watch?v=7xTGNNLPyMI" },
};

const R: Record<string, Resource> = {
  rlhfBlog: { title: "Illustrating reinforcement learning from human feedback (RLHF) — Hugging Face", url: "https://huggingface.co/blog/rlhf" },
  sft: { title: "Supervised fine-tuning — Hugging Face LLM Course, chapter 11", url: "https://huggingface.co/learn/llm-course/en/chapter11/1" },
  cme295: { title: "Stanford CME295 Transformers & LLMs — syllabus and slides", url: "https://cme295.stanford.edu/syllabus/" },
};

export const lesson10_6: Lesson = {
  id: "10-6", title: "How LLMs are trained: from raw text to a helpful assistant", mins: 15,
  objectives: [
    "Describe the main training stages of a modern LLM and what each one adds",
    "Explain why a model that has only read the internet isn't a helpful assistant yet",
    "Decide which kind of training, if any, would fix a problem you have with a model",
  ],
  prereqs: "<p>Lesson 1.1 (what a language model is) and lesson 10.5 (fine-tuning with LoRA). No maths needed.</p>",
  body: `
<p>In lesson 1.1 you met the three stages of training in one paragraph each. Now that you've run open models yourself and seen fine-tuning in 10.5, it's worth knowing the whole journey properly, because every model card, release note and "this model is better at reasoning" claim refers to it.</p>
<h3>Stage 1: pre-training (reading everything)</h3>
<p>The model reads an enormous amount of text: web pages, books, code, papers. Today's large models see somewhere around <b>tens of trillions of tokens</b>. The task is always the same: guess the next token, check the real one, and adjust slightly. The adjustment is driven by the <b>loss</b>, a number that says how surprised the model was by the real next token. Training simply pushes the loss down, a tiny bit at a time, billions of times.</p>
<p>This is by far the most expensive stage: thousands of GPUs running for weeks or months. Teams spend a lot of effort on the <b>data mix</b>: how much code, how much maths, which languages, and how to remove junk and duplicates. The data mix is a big reason one model is better at, say, Yoruba or Python than another.</p>
<p>The result is a <b>base model</b>. It knows a lot, but it only continues text. Ask it a question and it may just write more questions (lesson 1.1).</p>
<h3>Stage 1½: mid-training (topping up)</h3>
<p>Many labs add a shorter extra round of training on carefully chosen data, for example more maths and code, or very long documents so the model can handle a bigger <b>context window</b> (lesson 1.2). You'll see this called mid-training or long-context training.</p>
<h3>Stage 2: supervised fine-tuning (learning by example)</h3>
<p>Next the model is shown tens of thousands to millions of <b>example conversations</b>: a question and a good answer, written or checked by people (and increasingly by other models). Now it learns the <em>shape</em> of being an assistant: answer the question, follow instructions, use a sensible format. This is called <b>SFT</b>. The LoRA fine-tuning you saw in lesson 10.5 is a cheap way to do this same kind of training on your own examples.</p>
<h3>Stage 3: preference tuning (learning what people prefer)</h3>
<p>Examples teach the format, but not which of two decent answers is <em>better</em>. So people are shown two answers to the same question and asked which they prefer. With enough of these comparisons, the model can be nudged towards the kind of answers people like: clearer, more helpful, more honest, safer.</p>
<ul>
<li><b>RLHF</b> (reinforcement learning from human feedback) first trains a separate "judge" model on the comparisons, then lets the main model practise and rewards it when the judge scores it highly.</li>
<li><b>DPO</b> (direct preference optimisation) skips the judge and learns directly from the pairs. It's simpler and cheaper, which is why many open models use it.</li>
</ul>
<h3>Stage 4: reasoning training (practising problems with checkable answers)</h3>
<p>The newest stage gives the model maths problems, coding tasks and puzzles where the answer can be <b>checked automatically</b>: does the code pass the tests? Is the number right? The model tries, gets rewarded for correct answers, and gradually learns to think step by step before answering. This is where "thinking" or "reasoning" models come from, and it's why they improved fastest at maths and code (remember the problem in lesson 1.1).</p>
<h3>A shortcut: distillation</h3>
<p>Once a big model is trained, its answers can be used to train a much smaller one. The small model learns to imitate the big one. This is a big reason the small open models you ran in week 10 are surprisingly good.</p>
<h3>What this means for you</h3>
<p>You will almost never pre-train a model yourself. But knowing the stages tells you what to reach for when a model falls short:</p>
<ul>
<li><b>It doesn't know your facts</b> (prices, policies, last month's news): give it the facts with retrieval (RAG, Month 4). Training is the wrong tool.</li>
<li><b>It knows the facts but answers in the wrong style or format</b>: try a better prompt first; if that isn't enough, fine-tune on examples (SFT, lesson 10.5).</li>
<li><b>Its answers are correct but people don't like them</b>: that's what preference tuning is for. It's advanced, so most teams only reach for it with plenty of comparison data.</li>
</ul>
<div class="callout"><b>Too many acronyms?</b> You only need three ideas: models first learn by <b>predicting the next word</b> on huge amounts of text, then <b>learn from examples</b> of good answers, then <b>learn from people's preferences</b> (and, for reasoning, from problems with checkable answers). Every acronym in this lesson is a version of one of those three.</div>`,
  watch: [V.howLlms, V.rlhf, V.cme295Training, V.karpathyDeep],
  read: [R.rlhfBlog, R.sft, R.cme295],
  exercise: `<p>Open Hugging Face and find one open model family that publishes both a <b>base</b> and an <b>instruct</b> version (most of the families from lesson 10.1 do). Read both model cards and write down: (1) roughly how much data it was pre-trained on, if stated; (2) which later stages they mention (SFT, preference tuning such as RLHF or DPO, reasoning training, distillation); (3) one thing the instruct version can do that the base version can't. Then draw the four training stages as a simple diagram, with one example of the training data used at each stage.</p>`,
  problems: [
    {q: h`<p>A model is pre-trained on 15 trillion tokens. Roughly how long would it take one person to read that much, at 250 words a minute for 8 hours a day? (Use about 0.75 words per token.)</p>`,
     a: h`<ol><li><b>Words:</b> 15 trillion × 0.75 ≈ 11 trillion words.</li><li><b>Reading per day:</b> 250 words × 60 minutes × 8 hours = 120,000 words.</li><li><b>Days:</b> 11 trillion ÷ 120,000 ≈ 94 million days, which is about <b>250,000 years</b>.</li></ol><p>That scale is why a base model "knows" so much, and why pre-training costs so much.</p>`},
    {q: h`<p>For each problem, which fix fits best? (a) A support bot gives correct answers but in long essays; the company wants two lines. (b) The bot doesn't know this month's prices. (c) The bot's answers are accurate, but customers rate them as cold and unhelpful.</p>`,
     a: h`<p><b>(a)</b> Prompt first ("answer in at most two lines"). If that's not reliable enough, fine-tune on examples of two-line answers (SFT).</p><p><b>(b)</b> Retrieval: give it the current price list at question time. Training would be out of date next month.</p><p><b>(c)</b> This is what preference tuning is for: collect pairs of answers, mark the ones customers prefer, and train on them (DPO is the simpler route). A better system prompt about tone is worth trying first.</p>`},
    {q: h`<p>Why do many open models use DPO rather than RLHF?</p>`,
     a: h`<p>RLHF needs two extra pieces: a separate judge model trained on the comparisons, and a reinforcement-learning loop where the main model practises against that judge. That's complex and expensive to get right. DPO learns straight from the pairs of preferred and rejected answers, in one ordinary training run, and often works about as well.</p>`},
  ],
  quiz: [
    {q: "What does a base model (pre-training only) mostly do?", o: ["Follows instructions perfectly", "Continues text in the style it has read", "Searches the web", "Refuses to answer"], a: 1, why: "Pre-training teaches next-token prediction; following instructions comes later, from fine-tuning."},
    {q: "Which stage teaches the model which of two good answers people prefer?", o: ["Pre-training", "Supervised fine-tuning", "Preference tuning (RLHF or DPO)", "Tokenization"], a: 2, why: "Preference tuning learns from comparisons between answers."},
    {q: "Your model doesn't know your company's new policy. The best fix is usually:", o: ["Pre-train a new model", "Fine-tune it on the policy", "Give it the policy at question time (retrieval)", "Raise the temperature"], a: 2, why: "Facts that change belong in retrieval, not in training."},
  ],
};
