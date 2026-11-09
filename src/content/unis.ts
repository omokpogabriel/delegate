import type { Resource } from "./types";

// University and university-grade lectures. Every entry was checked on YouTube (channel, title, length)
// on 9 Nov 2026. embed:false = the publisher has switched off embedding, so the site links out instead.
const yt = (id: string) => `https://www.youtube.com/watch?v=${id}`;
const u = (id: string, title: string, src: string, len: string, embed = true): Resource =>
  ({ title, url: yt(id), src, len, ...(embed ? {} : { embed: false }) });

export const U = {
  // Maths
  strang1: u("J7DzL2_Na80", "The geometry of linear equations — Gilbert Strang", "MIT 18.06 Linear Algebra · Lecture 1", "39 min"),
  strang2: u("QVKj3LADCnA", "Elimination with matrices — Gilbert Strang", "MIT 18.06 Linear Algebra · Lecture 2", "47 min"),
  vectors3b1b: u("fNk_zzaMoSs", "Vectors — Essence of linear algebra, chapter 1", "3Blue1Brown", "9 min"),
  stat110: u("KbB0FjPg0mw", "Probability and counting — Joe Blitzstein", "Harvard Stat 110 · Lecture 1", "46 min"),
  // Machine learning
  cs229_1: u("jGwO_UgTS7I", "Introduction to machine learning — Andrew Ng", "Stanford CS229 · Autumn 2018 · Lecture 1", "75 min", false),
  cs229_2: u("4b4MUYve_U8", "Linear regression and gradient descent — Andrew Ng", "Stanford CS229 · Autumn 2018 · Lecture 2", "78 min", false),
  cs229_3: u("het9HFqo1TQ", "Locally weighted and logistic regression — Andrew Ng", "Stanford CS229 · Autumn 2018 · Lecture 3", "79 min", false),
  cs229llm: u("9vM4p9NN0Ts", "Building large language models — Yann Dubois", "Stanford CS229 · Guest lecture", "1 hr 44 min", false),
  gd3b1b: u("IHZwWFHWa-w", "Gradient descent, how neural networks learn", "3Blue1Brown · Deep learning, chapter 2", "20 min"),
  // Deep learning
  mit191intro: u("alfdI7S6wCY", "Introduction to deep learning — Alexander Amini", "MIT 6.S191 · 2025 · Lecture 1", "69 min"),
  mit191rnn: u("GvezxUdLrEk", "Recurrent neural networks, transformers and attention", "MIT 6.S191 · 2025 · Lecture 2", "61 min"),
  mit191llm: u("ZNodOsz94cc", "Large language models (Google guest lecture)", "MIT 6.S191 · 2025", "55 min"),
  cs230: u("_NLHFoVNlbg", "Introduction to deep learning", "Stanford CS230 · Autumn 2025 · Lecture 1", "60 min"),
  micrograd: u("VMj-3S1tku0", "Neural networks and backpropagation, spelled out: building micrograd — Andrej Karpathy", "Karpathy · Neural Networks: Zero to Hero", "2 hr 25 min"),
  backprop3b1b: u("tIeHLnjs5U8", "Backpropagation calculus", "3Blue1Brown · Deep learning, chapter 4", "10 min"),
  // Language models
  cs336_1: u("SQ3fZ1sAqXI", "Overview and tokenization — Percy Liang", "Stanford CS336 · Spring 2025 · Lecture 1", "78 min"),
  cs336_2: u("msHyYioAyNE", "PyTorch and resource accounting — Percy Liang", "Stanford CS336 · Spring 2025 · Lecture 2", "79 min", false),
  cs336_3: u("ptFiH_bHnJw", "Architectures and hyperparameters", "Stanford CS336 · Spring 2025 · Lecture 3", "87 min", false),
  cs336_10: u("fcgPYo3OtV0", "Inference", "Stanford CS336 · Spring 2025 · Lecture 10", "82 min", false),
  cs336_15: u("Dfu7vC9jo4w", "Alignment: SFT and RLHF", "Stanford CS336 · Spring 2025 · Lecture 15", "74 min", false),
  cs336_eval: u("JpAxdTWQJxM", "Evaluation", "Stanford CS336 · Spring 2026 · Lecture 12", "78 min", false),
  cs224n_wv: u("nBor4jfWetQ", "Word vectors and language models", "Stanford CS224N · Spring 2024 · Lecture 2", "79 min", false),
  cs224n_attn: u("LWMzyfvuehA", "Self-attention and transformers — John Hewitt", "Stanford CS224N · 2023 · Lecture 8", "77 min", false),
  cs224n_prompt: u("SXpJ9EmG3s4", "Prompting and reinforcement learning from human feedback — Jesse Mu", "Stanford CS224N · 2023 · Lecture 10", "76 min", false),
  cs224n_nlg: u("N9L32bFieEY", "Natural language generation (decoding and sampling)", "Stanford CS224N · 2023 · Lecture 11", "78 min", false),
  cs224n_post: u("35X6zlhoCy4", "Post-training — Archit Sharma", "Stanford CS224N · Spring 2024 · Lecture 10", "79 min", false),
  cs224n_bench: u("TO0CqzqiArM", "Benchmarking and evaluation — Yann Dubois", "Stanford CS224N · Spring 2024 · Lecture 11", "84 min", false),
  cs224n_agents: u("I0tj4Y7xaOQ", "Reasoning and agents — Shikhar Murty", "Stanford CS224N · Spring 2024 · Lecture 14", "63 min", false),
  cs25rag: u("mE7IDf2SmJg", "Retrieval-augmented language models — Douwe Kiela", "Stanford CS25 Transformers United · V3", "79 min"),
  gpt: u("kCc8FmEb1nY", "Let's build GPT: from scratch, in code, spelled out — Andrej Karpathy", "Karpathy · Neural Networks: Zero to Hero", "1 hr 56 min"),
  tokenizer: u("zduSFxRajkE", "Let's build the GPT tokenizer — Andrej Karpathy", "Karpathy · Neural Networks: Zero to Hero", "2 hr 13 min"),
  // Efficiency, agents, production
  quant: u("TSc_BibWRhM", "Quantization, part 1 — Song Han", "MIT 6.5940 EfficientML · Fall 2023 · Lecture 5", "75 min"),
  agenticWebinar: u("kJLiOGle3Lw", "Agentic AI: a progression of language model usage", "Stanford Online webinar", "57 min"),
  berkeleyAgents: u("r1qZpYAmqmg", "LLM agents overview — Yann Dubois", "UC Berkeley CS294-196 · Fall 2025", "1 hr 58 min"),
  berkeleySwe: u("f9L9Fkq-8K4", "Agents for software development — Graham Neubig", "UC Berkeley CS294-196 · Fall 2024", "60 min"),
  llmops: u("Fquj2u7ay40", "LLMOps", "Full Stack Deep Learning · LLM Bootcamp", "49 min"),
} satisfies Record<string, Resource>;
