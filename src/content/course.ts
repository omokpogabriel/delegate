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
  exam:"Project \"Which model for the clinic?\": a report comparing four or more models, hosted and open, on sorting a Lagos clinic's (synthetic) triage notes, with a recommendation backed by numbers on accuracy, critical misses, speed, cost and privacy.",
  weeks:[
   ["Calling models directly","Project \"Receipt reader\": turn WhatsApp order messages, receipt photos and voice notes into clean JSON using the API, with validation, retries and cost tracking.",
    ["Use system prompts and multi-turn messages","Get reliable structured (JSON) output","Implement basic tool calling"]],
   ["Local and open models","Project \"Offline assistant\": run an open model on your own computer as a custom Ollama model, and compare it with a hosted model on the same 10 inputs for accuracy, speed and cost.",
    ["Shortlist three models on Hugging Face and check their licences","Work out what fits your hardware at 4-bit and 8-bit","Run your chosen model with Ollama and call it from code","Compare local vs hosted on accuracy, speed and cost","Optional: fine-tune a small model with LoRA"]],
   ["Building evals","Project \"Eval kit\": a 30-case eval set with scoring, a calibrated model-as-judge and an eval script for a feature you built, run before and after one fix guided by error analysis.",
    ["Collect 30 real examples with known-good answers","Score with exact match, rubrics and model-as-judge","Re-run after every prompt change and track the score","Run a large eval with the batch API and compare its cost"]],
   ["Exam week: model report","Project \"Which model for the clinic?\": compare 4+ models on 50 synthetic triage notes and publish a recommendation.",
    ["Run your eval set across all models","Chart cost, latency and accuracy","Publish a recommendation with the numbers"]]
  ]},
 {t:"Context and memory", s:"What the model sees, what it remembers, and how it finds things.", reads:["qdrant","graphrag"],
  exam:"Project \"Ask the shop\": a WhatsApp-style assistant that answers from a real business's documents, reads photos and understands voice notes, cites its sources, says when it doesn't know, and is measured on retrieval and answer accuracy with real users.",
  weeks:[
   ["Context engineering and memory","Project \"Lean context\": cut one AI feature's context by 30%+ without losing quality, practise a fresh-session handover, and give an agent file-based memory.",
    ["Decide what goes in context and in what order","Compare compaction against starting a fresh session","Use subagents to isolate noisy work","Give an agent file-based memory it can read, update and forget"]],
   ["Embeddings, vector databases and your first RAG","Project \"Ask the shop\" v1: semantic search and a RAG assistant over 50+ snippets of a real business's public information, citing its sources.",
    ["Split documents into chunks and test chunk sizes","Store embeddings in a vector database","Add hybrid search and reranking, and measure the difference","Build semantic search from scratch with free, local embeddings","Choose a free vector database (Chroma, pgvector on Neon, or Cloudflare Vectorize)"]],
   ["Better retrieval: chunking, hybrid search, citations, graphs and images","Project \"Ask the shop\" v2: better parsing and chunking, hybrid search with reranking, checked citations, honest refusals, and photos, scans and voice notes in the knowledge base.",
    ["Extract entities and relations with a model","Answer a question that needs several hops through the graph","Design file-based memory for an agent across sessions","Parse PDFs, scans and chat exports into clean chunks","Check citations automatically and measure correct refusals","Add photos, scans and voice notes to the knowledge base"]],
   ["Exam week: document assistant","Project \"Ask the shop\": ship it to real users and prove its accuracy.",
    ["Build the assistant end to end","Write 30 eval questions with answers","Publish accuracy, failure cases and fixes","Measure recall@k, answer, citation and refusal accuracy on 40 questions","Run it with at least 5 real users for a week"]]
  ]},
 {t:"Harnesses and MCP", s:"Build the loop yourself, then plug real systems into it.", reads:["agents","codex","mcp","spring"],
  exam:"Project \"Plug it in\": an MCP server for a real system (for example Paystack in test mode, a bank-statement CSV or a shop's inventory), used by an agent to do real work, with measured success, a security review and a public demo.",
  weeks:[
   ["An agent loop from scratch","Project \"Shop agent\": a support agent built from scratch with three tools, error handling, step/time/cost limits, routing and a self-check, evaluated on 20 tasks × 3 runs.",
    ["Implement the tool-call loop","Add stop conditions and step limits","Handle tool errors so the agent can recover","Add routing and a self-check, and compare steps and cost","Evaluate on 20 tasks by final state, steps, cost and safety"]],
   ["Frameworks and real harnesses","Project \"Same agent, three ways\": rebuild your shop agent with the Claude Agent SDK and LangChain (or Spring AI), compare them, and read a real open-source harness.",
    ["Rebuild with a framework and compare","Read the source of an open-source harness","Write up three design choices you'd copy","Run the same agent on a hosted and a local model through LangChain"]],
   ["MCP servers","Project \"Shop server\": an MCP server for a real system with task-shaped tools and a resource, tested in the MCP Inspector, used from Claude Code and security-reviewed.",
    ["Learn MCP tools, resources and prompts","Design tool names and descriptions an agent understands","Test it from Claude and fix what confuses it","Connect an existing MCP server before building your own","Security-review it: least privilege, limits in code, injection test"]],
   ["Exam week: MCP in use","Project \"Plug it in\": connect a real system through MCP, prove it works on real tasks, and publish it.",
    ["Complete a real multi-step task via your MCP server","Add auth and rate limits","Publish the server and a demo","Write a skill that uses your server for the most common request"]]
  ]},
 {t:"Agents that run without you", k:"Autonomous agents", s:"Deploy agents for free or cheap, keep them reliable, then a capstone that proves it.", reads:["agents","docs"],
  exam:"Capstone: an agent system deployed on a free or low-cost setup that runs unattended for two weeks with real users, with metrics on accuracy, cost per month and how often a human had to step in. Finish with a public demo and write-up.",
  weeks:[
   ["Deploy your agent, free or cheap","Project \"Live on a budget\": put one of your agents on the internet for ₦0 a month (or close to it), running on a schedule and from a webhook, with secrets stored safely, a health check, and a free web address (or your own domain if you already have one).",
    ["Run an agent on a schedule and from a webhook","Add AI review to your CI pipeline","Package the agent so it runs the same anywhere (Docker basics)","Deploy on a free tier that needs no card (Cloudflare Workers or GitHub Actions), with secrets stored on the server","Use free or very cheap models: free API tiers, Cloudflare Workers AI, or a small open model","Self-hosting: when a free cloud server or a rented GPU makes sense for an open model, and what it costs per month"]],
   ["LLMOps: running AI apps reliably and safely","Put one of your AI apps under LLMOps: versioned prompts and models, evals on every change, tracing with cost, a canary and a practised rollback.",
    ["Log and trace every run, with cost","Set permissions and spend limits","Test against prompt injection","Decide where a human must approve","Version prompts, models and settings, and run evals on every change","Roll out changes to a small share first, and practise a rollback"]],
   ["Capstone: build and deploy","Capstone project: choose a real problem with real users, build the simplest thing that works, launch with monitoring and a real human handover, and start a two-week unattended run.",
    ["Pick a real problem with real users","Deploy with monitoring from day one","Start the two-week run","Keep the running cost within a budget you set, and write it down per month","Write the spec, eval set, budget and risk list before code","Soft-launch to 1-2 users and read every conversation"]],
   ["Capstone: measure and demo","Capstone project: measure accuracy, cost and human interventions on real use, fix the top three failure modes, then demo it and publish the final write-up.",
    ["Track accuracy, cost and human interventions","Fix the top three failure modes","Give a public demo and publish the final write-up","Interview your users and the business owner about the results","Plan your next three months: a job, clients or the AI engineer track"]]
  ]}
];
