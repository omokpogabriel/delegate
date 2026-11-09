import type { Resource } from "./types";

// Core-lesson videos for the agent track, by lesson id. Short, beginner-friendly and on the lesson's topic.
// Each was checked on YouTube on 9 Nov 2026: channel, title, length, and that it can be embedded.
// Rule: no video appears in more than one lesson (core or Go deep). Lessons whose own file already
// lists a core video (1-1 to 1-4) aren't repeated here.
const v = (id: string, title: string, len: string): Resource => ({ title, len, url: `https://www.youtube.com/watch?v=${id}` });

export const CORE_VIDEOS: Record<string, Resource[]> = {
  "2-1": [v("OfUn6HjwXhI", "Behind the prompt: prompting tips — Anthropic", "4 min"), v("1c9iyoVIwDs", "4 methods of prompt engineering — IBM Technology", "13 min")],
  "2-2": [v("ysPbXH0LpIE", "Prompting 101 — Anthropic", "25 min")],
  "2-3": [v("9qdgEBVkWR4", "Discover few-shot prompting — Google AI Essentials", "5 min"), v("Fp-ue4UCE3s", "What is chain-of-thought prompting? — Eye on Tech", "3 min")],
  "2-4": [v("KIGBsQqZcNA", "Evaluate prompts in the Anthropic Console — Anthropic", "3 min")],
  "3-1": [v("F8NKVhkZZWI", "What are AI agents? — IBM Technology", "12 min")],
  "3-2": [v("eMZmDH3T2bY", "Claude Code tutorial for beginners — Kevin Stratvert", "15 min")],
  "3-3": [v("mViFYTwWvcM", "Spec-driven development: AI-assisted coding explained — IBM Technology", "9 min")],
  "3-4": [v("b2QkhmQ0sT0", "How I review AI code — John Kim", "21 min")],
  "4-1": [v("zZV6FeJ3BtE", "What is acceptance criteria? — ProductPlan", "4 min")],
  "4-2": [v("e9lnsKot_SQ", "How Git works, explained in 4 minutes — ByteByteGo", "4 min")],
  "4-3": [v("E6NO0rgFub4", "How to write a useful README on GitHub — Learn Fast Make Things", "8 min"), v("z8UPAVTh2aE", "How to make your GitHub stand out — Miraya", "8 min")],
  "5-1": [v("O0FGCxkHM-U", "The CLAUDE.md file — Claude", "3 min")],
  "5-2": [v("TC7dK0gwgg0", "AGENTS.md explained: one file for all agents — proflead", "3 min")],
  "5-3": [v("xJQuF02NAK8", "The explore → plan → code → commit workflow in Claude Code — Claude", "3 min"), v("FoRIj5qcslg", "Why you need plan mode in Claude Code — GritAI Studio", "7 min")],
  "5-4": [v("vXN50AmJjgY", "Git diff, explained — A shot of code", "9 min")],
  "6-1": [v("bjdBVZa66oU", "What are skills? — Claude", "3 min"), v("fOxC44g8vig", "Claude Agent Skills explained — Anthropic", "3 min")],
  "6-2": [v("Phr7vBx9yFQ", "Claude Code tutorial: subagents — Net Ninja", "11 min")],
  "6-3": [v("IkaPHiMDazM", "Hooks in Claude Code — Claude", "3 min")],
  "7-1": [v("H4Hf3pji7Fw", "What is test-driven development? — Development That Pays", "5 min"), v("3kzHmaeozDI", "What is unit testing? With easy examples — Andy Sterkowitz", "11 min")],
  "7-2": [v("BQrohJ3PT7I", "How to use GitHub Actions — GitHub", "8 min")],
  "7-3": [v("wGr5rz8WGCE", "What is Playwright? Introduction and demo — Testopic", "12 min")],
  "7-4": [v("nKJlF-olKmg", "9 examples of specification gaming — Robert Miles AI Safety", "10 min")],
  "8-1": [v("QV0kVNvkMxc", "Git and GitHub for beginners: branches — Net Ninja", "10 min"), v("dtCgEwRpJl8", "Git worktrees explained simply — Codevolution", "11 min")],
  "8-2": [v("z_VI51k-tn0", "Claude Code worktrees in 7 minutes — Developers Digest", "7 min")],
  "8-3": [v("xNVM5UxlFSA", "How to resolve merge conflicts in Git — Ihatetomatoes", "7 min")],
  "9-1": [v("bxuYDT-BWaI", "APIs explained in 4 minutes — Exponent", "4 min"), v("IolxqkL7cD8", "Hiding passwords and secret keys in environment variables (Windows) — Corey Schafer", "5 min"), v("H7LZb20-fUY", "Claude API crash course: introduction and setup — Net Ninja", "9 min")],
  "9-2": [v("RMR0Y8esSmE", "System prompt fundamentals — Cline", "3 min")],
  "9-3": [v("CllLqPwCjD4", "Getting structured output in JSON format — Telusko", "9 min")],
  "9-4": [v("h8gMhXYAv1k", "What is tool calling? Connecting LLMs to your data — IBM Technology", "5 min")],
  "9-5": [v("u57EnkQaUTY", "What is prompt caching? — IBM Technology", "9 min")],
  "10-1": [v("y9k-U9AuDeM", "Should you use open-source large language models? — IBM Technology", "7 min"), v("KL_hBC3XcrY", "Open source vs open weight AI models explained — KodeKloud", "8 min")],
  "10-2": [v("qP9mbY3wuWk", "What is Hugging Face? Models, datasets and Spaces — Hugging Face", "20 min"), v("w4YIkrECELo", "Which GGUF should you download? — Next Tech and AI", "12 min")],
  "10-3": [v("qqN63hbziaI", "What is LLM quantization? — Airtrain AI", "5 min"), v("186J_yNEamg", "Local AI: how much VRAM do you need? — Locally", "17 min")],
  "10-4": [v("5RIOQuHOihY", "What is Ollama? Running local LLMs made simple — IBM Technology", "7 min"), v("UtSSMs6ObqY", "Learn Ollama in 15 minutes — Tech With Tim", "14 min"), v("McLdlg5Gc9s", "What is vLLM? — IBM Technology", "5 min")],
  "10-5": [v("DhRoTONcyZE", "What is LoRA? Explained by its inventor — Edward Hu", "7 min"), v("00Q0G84kq3M", "RAG vs fine-tuning — IBM Technology", "9 min")],
};
