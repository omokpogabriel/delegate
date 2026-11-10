import type { Month } from "./types";

// Course outline: months, weeks, tasks, exams and reading links.
export const LINKS: Record<string, [string, string]> = {
  prompt:["Prompt engineering overview (Claude docs)","https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview"],
  docs:["Claude Code docs","https://code.claude.com/docs/en/quickstart"],
  agents:["Building effective agents (Anthropic)","https://www.anthropic.com/research/building-effective-agents"],
  codex:["Codex CLI source","https://github.com/openai/codex"],
  ollama:["Ollama","https://ollama.com"],
  evals:["Hamel Husain on evals","https://hamel.dev"],
  qdrant:["Qdrant docs","https://qdrant.tech/documentation/"],
  graphrag:["GraphRAG","https://microsoft.github.io/graphrag/"],
  mcp:["Model Context Protocol","https://modelcontextprotocol.io"],
  spring:["Spring AI","https://spring.io/projects/spring-ai"]
};
export const MONTHS: Month[] = [
 {t:"Foundations", s:"How models work, and prompting as writing a spec.", reads:["docs","prompt"],
  exam:"Build a small full-stack app where the agent writes at least 80% of the code. You review every line and can explain every line.",
  weeks:[
   ["How models actually work","Project \"How chatbots think\": run the temperature experiment, then publish a one-page explainer (with a timeline of AI and your own AI-use policy) for a non-technical friend.",
    ["Learn tokens, context windows and next-token prediction","Learn why models hallucinate and when it's most likely","Run the temperature experiment and record results","Write a one-page explainer in your own words"]],
   ["Prompting as specification","Project \"Prompt makeover\": take five vague prompts from your real work, rebuild each with the prompt toolkit, and publish the before-and-after results.",
    ["Practise role, context, constraints, examples and output format","Rewrite five real prompts from your own work","Compare before/after outputs and note what changed","Publish your first weekly write-up"]],
   ["Your first coding agent","Project \"naira-cli\": have a coding agent build a small command-line tool (for example a naira VAT and currency calculator) from a written spec, then try the same task in an AI editor.",
    ["Install and configure a coding agent","Give it a written spec, not a one-liner","Read every diff before accepting it","Start your failure log"]],
   ["Exam week","Project \"Queue\": a small full-stack app such as a walk-in patient queue for a clinic, with the agent writing 80%+ of the code and you able to explain every line.",
    ["Write the spec before any code","Build the app with the agent writing 80%+ of the code","Explain every file in a short walkthrough","Publish the write-up with your failure-log highlights"]]
  ]},
 {t:"Coding agents in depth", s:"Project memory, skills, subagents, hooks and parallel work.", reads:["docs","agents"],
  exam:"In one day, run three agents in parallel that ship three features, all with passing tests.",
  weeks:[
   ["Project memory","Project \"Agent-ready repo\": give one real project a memory file, a plan-mode workflow and a review checklist, and measure how much less you repeat yourself.",
    ["Document conventions, commands and architecture for the agent","Use plan mode before large changes","Review diffs like a senior reviewer"]],
   ["Skills, subagents and hooks","Project \"My agent toolkit\": one skill for a task you repeat, one subagent brief for research, and one hook that enforces a rule, all used on real work.",
    ["Write a reusable skill for a task you do often","Use subagents to keep research out of the main context","Add a hook that runs the formatter or linter automatically"]],
   ["Verification loops","Project \"Bug hunt\": fix three real bugs test-first, add CI with lint, tests and security scanners, and run a security audit on the project.",
    ["Have the agent write failing tests before the fix","Enforce type checks and lint on every change","Let the agent run the app and check its own output","Log every case where it 'passed' but was wrong"]],
   ["Exam week: parallel agents","Project \"Three at once\": three agents in three git worktrees ship three features of one app in one day, all with passing tests.",
    ["Learn git worktrees","Write three specs before starting","Run all three sessions at once and review in turn","Write up where your time actually went"]]
  ]},
 {t:"Models and evals", s:"APIs, open models, and evidence over hype.", reads:["ollama","evals"],
  exam:"An eval report comparing four or more models, open and closed, on one real task, with a recommendation backed by numbers.",
  weeks:[
   ["Calling models directly","Project \"Receipt reader\": turn WhatsApp order messages, receipt photos and voice notes into clean JSON using the API, with validation, retries and cost tracking.",
    ["Use system prompts and multi-turn messages","Get reliable structured (JSON) output","Implement basic tool calling"]],
   ["Local and open models","Project \"Offline assistant\": run an open model on your own computer as a custom Ollama model, and compare it with a hosted model on the same 10 inputs for accuracy, speed and cost.",
    ["Shortlist three models on Hugging Face and check their licences","Work out what fits your hardware at 4-bit and 8-bit","Run your chosen model with Ollama and call it from code","Compare local vs hosted on accuracy, speed and cost","Optional: fine-tune a small model with LoRA"]],
   ["Building evals","Create a 30-case eval set for a task you actually do.",
    ["Collect 30 real examples with known-good answers","Score with exact match, rubrics and model-as-judge","Re-run after every prompt change and track the score"]],
   ["Exam week: model report","Compare 4+ models on accuracy, cost and speed.",
    ["Run your eval set across all models","Chart cost, latency and accuracy","Publish a recommendation with the numbers"]]
  ]},
 {t:"Context and memory", s:"What the model sees, what it remembers, and how it finds things.", reads:["qdrant","graphrag"],
  exam:"An assistant that answers questions over a real set of documents, with its accuracy measured by your month-three eval method.",
  weeks:[
   ["Context engineering","Run the same long task with and without context discipline and compare.",
    ["Decide what goes in context and in what order","Compare compaction against starting a fresh session","Use subagents to isolate noisy work"]],
   ["Retrieval (RAG)","Build search over 100+ real documents.",
    ["Split documents into chunks and test chunk sizes","Store embeddings in a vector database","Add hybrid search and reranking, and measure the difference"]],
   ["Knowledge graphs and agent memory","Model one domain as entities and relationships.",
    ["Extract entities and relations with a model","Answer a question that needs several hops through the graph","Design file-based memory for an agent across sessions"]],
   ["Exam week: document assistant","Ship it and prove its accuracy.",
    ["Build the assistant end to end","Write 30 eval questions with answers","Publish accuracy, failure cases and fixes"]]
  ]},
 {t:"Harnesses and MCP", s:"Build the loop yourself, then plug real systems into it.", reads:["agents","codex","mcp","spring"],
  exam:"An MCP server for a real API, used successfully by Claude to complete real work.",
  weeks:[
   ["An agent loop from scratch","Write a working agent in about 150 lines: call model, run tool, feed back, repeat.",
    ["Implement the tool-call loop","Add stop conditions and step limits","Handle tool errors so the agent can recover"]],
   ["Frameworks and real harnesses","Rebuild your agent with the Claude Agent SDK or Spring AI.",
    ["Rebuild with a framework and compare","Read the source of an open-source harness","Write up three design choices you'd copy"]],
   ["MCP servers","Expose one real API as MCP tools.",
    ["Learn MCP tools, resources and prompts","Design tool names and descriptions an agent understands","Test it from Claude and fix what confuses it"]],
   ["Exam week: MCP in use","Have Claude do a real job through your server.",
    ["Complete a real multi-step task via your MCP server","Add auth and rate limits","Publish the server and a demo"]]
  ]},
 {t:"Agents that run without you", k:"Autonomous agents", s:"Production agents, then a capstone that proves it.", reads:["agents","docs"],
  exam:"Capstone: an agent system that runs unattended in production for two weeks, with metrics on accuracy, cost and how often a human had to step in. Finish with a public demo and write-up.",
  weeks:[
   ["Scheduled and event-driven agents","Put an agent in CI to review every pull request.",
    ["Run an agent on a schedule","Trigger one from a webhook or event","Add AI review to your CI pipeline"]],
   ["LLMOps: running AI apps reliably and safely","Put one of your AI apps under LLMOps: versioned prompts and models, evals on every change, tracing with cost, a canary and a practised rollback.",
    ["Log and trace every run, with cost","Set permissions and spend limits","Test against prompt injection","Decide where a human must approve","Version prompts, models and settings, and run evals on every change","Roll out changes to a small share first, and practise a rollback"]],
   ["Capstone: build and deploy","Ship the capstone and start the two-week unattended run.",
    ["Pick a real problem with real users","Deploy with monitoring from day one","Start the two-week run"]],
   ["Capstone: measure and demo","Let it run, measure everything, then show it.",
    ["Track accuracy, cost and human interventions","Fix the top three failure modes","Give a public demo and publish the final write-up"]]
  ]}
];
