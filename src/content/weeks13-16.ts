import type { Lesson, Resource } from "./types";
import { U } from "./unis";

// Agent track, Month 4: context and memory.
// Week 13 context engineering and memory · Week 14 embeddings, vector databases, first RAG ·
// Week 15 better retrieval · Week 16 exam: the document assistant.
// Every video was checked on YouTube (channel, length, embeddable) on 10 Nov 2026 and appears nowhere else in the course.
// Videos with `src` go into "Go deep". h`...` keeps backslashes for maths.
const h = String.raw;
const yt = (id: string, title: string, len: string, src?: string): Resource =>
  ({ title, len, url: `https://www.youtube.com/watch?v=${id}`, ...(src ? { src } : {}) });

const V = {
  ctxGoogle: yt("BBPQYtR7oUk", "Context engineering explained: what every AI developer should know — Google Cloud Tech", "10 min"),
  ctxVsPrompt: yt("vD0E3EUb8-8", "Context engineering vs prompt engineering — IBM Technology", "8 min"),
  ctxFailures: yt("BwXremQ-i6I", "Context engineering for AI agents: 4 failure modes to avoid — IBM Technology", "10 min"),
  memoryTypes: yt("BacJ6sEhqMo", "The four types of memory every AI agent needs — IBM Technology", "11 min"),
  memory5: yt("0P-ACuHyu-0", "Agent memory explained in 5 minutes — KodeKloud", "5 min"),
  memoryHf: yt("aYfZN8t6AQs", "Agent memory explained: the complete architecture", "29 min", "Hugging Face"),
  wordEmb: yt("wgfSDrqYMJ4", "What are word embeddings? — IBM Technology", "9 min"),
  embGuide: yt("NEreO2zlXDk", "A beginner's guide to vector embeddings — Colin Talks Tech", "8 min"),
  vectorVsSemantic: yt("BKbScJ2P2P0", "What is vector search? Vector vs semantic search — Elastic", "2 min"),
  semantic: yt("o3XN4dImESE", "What is semantic search? — Redis", "3 min"),
  vdbIbm: yt("gl1r1XV0SLw", "What is a vector database? — IBM Technology", "10 min"),
  vdbFireship: yt("klTvEwg3oJ4", "Vector databases are so hot right now. WTF are they? — Fireship", "3 min"),
  pgvector: yt("j1QcPSLj7u0", "PGVector: turn PostgreSQL into a vector database — NeuralNine", "20 min"),
  ragIbm: yt("T-D1OfcDW1M", "What is retrieval-augmented generation (RAG)? — IBM Technology", "7 min"),
  rag50: yt("f9uAG3AQGWM", "How to build RAG from scratch in 50 lines of Python — Tech With Tim", "27 min"),
  ragFcc: yt("sVcwVQRHIc8", "Learn RAG from scratch, from a LangChain engineer", "2 hr 33 min", "freeCodeCamp"),
  docling: yt("zSA7ylHP6AY", "What is Docling? Turning documents into data for RAG — IBM Technology", "8 min"),
  chunking: yt("pIGRwMjhMaQ", "Chunking strategies in RAG — Mervin Praison", "14 min"),
  bm25: yt("lD3_VF5bmWg", "The BM25 algorithm and hybrid search — Tejas Kumar", "10 min"),
  rerank: yt("K1F8BIgcoNk", "Rerank for better RAG, explained — vectorize", "14 min"),
  hybridGuide: yt("XvKiTfd6Xvo", "The complete guide to hybrid search in RAG (BM25, embeddings, reranker)", "59 min", "Dave Ebbelaar"),
  ragStrategies: yt("tLMViADvSNE", "Every RAG strategy explained in 13 minutes — Cole Medin", "13 min"),
  kg: yt("y7sXDpffzQQ", "What is a knowledge graph? — IBM Technology", "6 min"),
  graphRag: yt("Aw7iQjKAX2k", "GraphRAG vs traditional RAG — IBM Technology", "4 min"),
  graphRagTalk: yt("knDDGYHnnSI", "GraphRAG: the marriage of knowledge graphs and RAG — Emil Eifrem, Neo4j", "19 min", "AI Engineer conference"),
  doclingRedHat: yt("BWxdLm1KqTU", "How Docling turns documents into usable AI data — Red Hat", "12 min"),
  ragBeginners: yt("_HQ2H_0Ayy0", "RAG explained for beginners — KodeKloud", "10 min"),
  ragCodebasics: yt("dDkynerzV-Q", "RAG explained: all about retrieval-augmented generation — codebasics", "15 min"),
  ragMetrics: yt("cRz0BWkuwHg", "Key metrics and evaluation methods for RAG — What's AI by Louis-François Bouchard", "11 min"),
  ragEval: yt("7_LTU0LA374", "RAG evaluation: precision, recall, faithfulness — Logical Lenses", "12 min"),
  ragas: yt("5fp6e5nhJRk", "RAGAS: how to evaluate a RAG application, for beginners — Mervin Praison", "9 min"),
  ragCrash: yt("swvzKSOEluc", "RAG crash course for beginners — KodeKloud", "59 min"),
};

const R: Record<string, Resource> = {
  context: { title: "Effective context engineering for AI agents — Anthropic", url: "https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents" },
  memory: { title: "Manage Claude's memory (CLAUDE.md) — Claude Code docs", url: "https://code.claude.com/docs/en/memory" },
  chroma: { title: "Chroma documentation (open source, runs locally)", url: "https://docs.trychroma.com/docs/overview/introduction" },
  vectorize: { title: "Cloudflare Vectorize pricing (included in the Workers Free plan)", url: "https://developers.cloudflare.com/vectorize/platform/pricing/" },
  bge: { title: "bge-base-en-v1.5 embedding model on Cloudflare Workers AI", url: "https://developers.cloudflare.com/workers-ai/models/bge-base-en-v1.5/" },
  neon: { title: "Neon pricing: free Postgres plan, no credit card", url: "https://neon.com/pricing" },
  qdrant: { title: "Qdrant documentation", url: "https://qdrant.tech/documentation/" },
  graphrag: { title: "GraphRAG — Microsoft Research", url: "https://microsoft.github.io/graphrag/" },
  ragPaper: { title: "Retrieval-augmented generation for knowledge-intensive NLP tasks (2020), the original RAG paper", url: "https://arxiv.org/abs/2005.11401" },
};

// ---------------------------------------------------------------- Week 13
export const week13: Lesson[] = [
{
  id: "13-1", title: "Context engineering: deciding what the model sees", mins: 14,
  objectives: [
    "Explain context engineering and how it differs from prompt engineering",
    "List everything that ends up in a model's context window, and its cost",
    "Arrange context so the important parts get attention",
  ],
  prereqs: "<p>Lesson 1.2 (tokens and the context window), Week 2 (prompting) and Week 9 (calling models from code).</p>",
  body: `
<p>In Week 2 you learned to write a good prompt. But in real apps and agents, your prompt is a small part of what the model sees. <b>Context engineering</b> is the skill of deciding <em>everything</em> that goes into the context window, in what order, and what stays out.</p>
<h3>What's actually in the window</h3>
<ul>
<li>The <b>system prompt</b> and your project memory (Week 5).</li>
<li><b>Tool descriptions</b> (Week 9): every tool you offer costs tokens on every call.</li>
<li>The <b>conversation so far</b>, growing every turn (lesson 9.2).</li>
<li><b>Tool results</b>: search results, file contents, logs. Often the biggest part.</li>
<li><b>Retrieved documents</b> from your own data (Weeks 14–15).</li>
<li>The user's <b>current message</b>.</li>
</ul>
<p>The model treats all of it as one long text. It can't tell "important" from "noise" unless you make that easy.</p>
<h3>Four principles</h3>
<ol>
<li><b>Relevant beats complete.</b> A focused page beats 50 pages with the answer buried (lesson 1.2). Fetch what the task needs, not everything you have.</li>
<li><b>Structure it.</b> Label each part with tags (lesson 2.5): <code>&lt;policy&gt;</code>, <code>&lt;customer_history&gt;</code>, <code>&lt;search_results&gt;</code>. The model then knows what each part is.</li>
<li><b>Order matters.</b> Put long reference material first and the question and instructions last, closest to where the model starts writing (lesson 2.2). Models tend to pay less attention to the middle of very long contexts.</li>
<li><b>Trim tool output.</b> Instead of pasting a 5,000-line log, return the 20 lines around the error. Instead of a whole web page, return the relevant section.</li>
</ol>
<h3>Just in time vs up front</h3>
<p>You can load context <b>up front</b> (paste the whole policy every time) or <b>just in time</b> (give the agent a search tool and let it fetch what it needs). Up front is simple and predictable for small, stable material. Just in time scales to large libraries and keeps the window clean, but depends on good search, which is exactly what Weeks 14–15 teach.</p>
<div class="callout"><b>Stuck on where to start?</b> Print the full context of one real request (everything sent to the model) and read it as if you were the model. You'll usually spot noise to cut and missing information to add within a minute.</div>`,
  watch: [V.ctxGoogle, V.ctxVsPrompt],
  read: [R.context],
  exercise: `<p>Take one AI feature you've built. Log the full context of three real requests and measure each part in tokens (system prompt, tools, history, tool results, user message). Then cut at least 30% of the tokens without losing anything needed: trim tool output, drop unused tools, summarise old history. Run your eval set (Week 11) before and after to check quality held.</p>`,
  problems: [
    {q: `<p>A support agent's context per request is: system prompt 1,500 tokens, 12 tool descriptions 4,000, history 6,000, search results 9,000, user message 100. Which two parts would you cut first, and how?</p>`,
     a: `<p><b>Search results (9,000):</b> return the top 3 relevant passages instead of whole pages, maybe 1,500 tokens. <b>Tool descriptions (4,000):</b> offer only the tools this kind of request needs, or merge similar ones. That can save around 10,000 of the 20,600 tokens, roughly halving cost and usually improving accuracy.</p>`},
    {q: `<p>When would you load a 2-page refund policy up front rather than give the agent a search tool?</p>`,
     a: `<p>When it's short, stable and relevant to most requests. Two pages (about 1,000 tokens) can simply be included every time, and prompt caching (lesson 9.5) makes the repeat cheap. A search tool adds complexity and a chance of missing the right section, which isn't worth it for so little text.</p>`},
  ],
  quiz: [
    {q: "Context engineering is about:", o: ["Only wording the prompt", "Choosing everything that goes into the context window, and its order", "Training models", "Buying more tokens"], a: 1, why: "The prompt is just one part of the context."},
    {q: "Where should a long reference document usually go?", o: ["After the question", "Before the question and instructions", "In the middle of the instructions", "It doesn't matter"], a: 1, why: "Questions near the end get the most attention."},
    {q: "Which part of an agent's context is often largest?", o: ["The user's message", "Tool results such as search output and file contents", "The model's name", "The temperature setting"], a: 1, why: "Tool output grows quickly, so trim it."},
  ],
},
{
  id: "13-2", title: "When context goes wrong: long sessions, compaction and fresh starts", mins: 13,
  objectives: [
    "Recognise the four common ways context fails",
    "Choose between compaction, a fresh session and a subagent",
    "Write a handover summary that keeps what matters",
  ],
  prereqs: "<p>Lesson 13.1 and lesson 6.2 (subagents).</p>",
  body: `
<h3>Four ways context fails</h3>
<ol>
<li><b>Poisoning:</b> a wrong fact gets into the context (a hallucination, a bad search result) and the model keeps building on it.</li>
<li><b>Distraction:</b> so much material that the model loses track of the task.</li>
<li><b>Confusion:</b> irrelevant tools or documents lead it to use the wrong one.</li>
<li><b>Clash:</b> two parts of the context contradict each other (an old policy and a new one), and the model picks the wrong one.</li>
</ol>
<p>All four get worse as sessions grow. Long-running agents and long chats are where context discipline matters most.</p>
<h3>Three tools for long work</h3>
<ul>
<li><b>Compaction:</b> replace old history with a summary, keeping the recent turns in full. Coding agents do this automatically when the window fills. It's convenient but lossy: details you didn't think mattered disappear.</li>
<li><b>Fresh session with a handover:</b> start clean and paste a short, deliberate summary. More reliable for a new phase of work, because <em>you</em> decide what carries over.</li>
<li><b>Subagents</b> (lesson 6.2): send noisy sub-tasks (searching, reading logs) to a separate window and bring back only the answer.</li>
</ul>
<h3>A good handover summary</h3>
<pre>Goal: add refunds to the shop API.
Done: refund table and migration (tested); request endpoint (tested).
Decisions: refunds over ₦50,000 need manager approval; store amounts in kobo.
Open: confirm endpoint not started; test for expired requests failing.
Files: src/refunds/*, tests/refunds.test.js
Don't: change the payments module.</pre>
<p>Goal, what's done, decisions with reasons, what's open, where things are, and what not to touch. Under 200 words.</p>
<div class="callout"><b>Agent going round in circles?</b> That's usually a poisoned or overloaded context. Stop, write a handover summary yourself (correcting anything wrong), and start a fresh session with it. It's faster than arguing with a confused session.</div>`,
  watch: [V.ctxFailures],
  read: [R.context],
  exercise: `<p>Run one long task (an hour or more) with your coding agent. At the halfway point, write a handover summary in the format above, start a fresh session with it, and finish the task. Note what you had to re-explain and what the summary saved. Add one line to your failure log about any confusion you saw before the fresh start.</p>`,
  problems: [
    {q: `<p>Early in a session the agent misread a requirement ("discount is 15%" instead of "1.5%") and every later step used it. Which failure is this, and what's the fix?</p>`,
     a: `<p>Context <b>poisoning</b>. Correcting it mid-session often fails because the wrong value appears many times in the history. Start a fresh session with a handover that states the correct value clearly, and add a test that checks the 1.5% discount so the mistake can't return unnoticed.</p>`},
    {q: `<p>Your RAG system returns both the 2024 and the 2026 delivery policy for the same question. What kind of failure is this and how do you prevent it?</p>`,
     a: `<p>A context <b>clash</b>. Prevent it at the data level: remove or mark superseded documents, and store an effective date as metadata so retrieval filters to the current version (lesson 15.2). As a backstop, tell the model to prefer the most recent dated document and to mention the date it used.</p>`},
  ],
  quiz: [
    {q: "A wrong fact entering the context and being built on is called:", o: ["Distraction", "Poisoning", "Compaction", "Caching"], a: 1, why: "Poisoned context spreads errors through later steps."},
    {q: "Compaction's main risk is:", o: ["It's slow", "Details you needed may be lost in the summary", "It costs more", "It deletes files"], a: 1, why: "Summaries are lossy."},
    {q: "A good handover summary includes:", o: ["The whole transcript", "Goal, what's done, decisions, what's open, files and what not to touch", "Only the last message", "Nothing; start blank"], a: 1, why: "It carries what matters and nothing else."},
  ],
},
{
  id: "13-3", title: "Memory: helping agents remember across sessions", mins: 14,
  objectives: [
    "Describe the four kinds of agent memory",
    "Design simple file-based memory for an agent",
    "Decide what an agent should remember, and what it must forget",
  ],
  prereqs: "<p>Lessons 13.1–13.2 and Week 5 (project memory files).</p>",
  body: `
<p>Models remember nothing between calls (lesson 9.2). Every kind of "memory" is something you store and put back into the context at the right moment. In Week 5 you built the simplest version: a project memory file.</p>
<h3>Four kinds of memory</h3>
<ul>
<li><b>Short-term (working) memory:</b> the current conversation. Lives in the context window; managed with lesson 13.2's tools.</li>
<li><b>Long-term facts and preferences:</b> "This customer prefers Pidgin", "Our VAT rate is 7.5%". Stored and recalled when relevant.</li>
<li><b>Episodic memory:</b> what happened before. "Last week this customer's order was delayed and we gave a voucher."</li>
<li><b>Procedural memory:</b> how to do things: your skills and runbooks (Week 6).</li>
</ul>
<h3>File-based memory: the simplest design that works</h3>
<p>Give the agent a folder of small notes, one fact per file, plus an index file listing them with a one-line description. At the start of a task the agent reads the index and opens only the notes that look relevant. A tool lets it add or update notes when it learns something important.</p>
<pre>memory/
  INDEX.md                  - customer-ada.md: prefers WhatsApp, Pidgin, Yaba deliveries
  customer-ada.md           - vat-rate.md: VAT is 7.5% (from 2026 policy)
  vat-rate.md</pre>
<p>It's readable by people, easy to correct, and works with any model. For thousands of memories you'd search them with embeddings (Week 14), but the idea is the same.</p>
<h3>What to remember, and what to forget</h3>
<ul>
<li><b>Remember</b> stable, useful facts the user would expect you to know next time.</li>
<li><b>Don't remember</b> secrets, passwords or sensitive personal data unless there's a clear need and consent (lesson 1.6).</li>
<li><b>Update, don't duplicate:</b> if a fact changes, edit the note.</li>
<li><b>Let people see and delete</b> what's remembered about them. Under the NDPA, people have rights over their personal data.</li>
</ul>
<div class="callout"><b>Not sure if you need memory at all?</b> Many apps don't. Start without it, then add memory only for the specific things users are annoyed to repeat ("I told you last time I'm in Abuja").</div>`,
  watch: [V.memoryTypes, V.memory5, V.memoryHf],
  read: [R.memory, R.context],
  exercise: `<p>Add file-based memory to one of your agents: a memory folder with an index, a tool to save a note, and an instruction to read the index at the start of each task. Have three conversations across separate sessions where something learned in the first is used in the third. Add a way to list and delete memories, and test it.</p>`,
  problems: [
    {q: `<p>Which kind of memory is each? (a) "Ada prefers deliveries after 4pm." (b) "On 3 Nov, Ada's order arrived damaged and we refunded ₦5,000." (c) "How to process a refund: steps 1–5."</p>`,
     a: `<p>(a) <b>Long-term preference</b>. (b) <b>Episodic</b>: something that happened. (c) <b>Procedural</b>: how to do a task, best kept as a skill or runbook.</p>`},
    {q: `<p>A customer types their card number into your support chat. Should your agent store it in memory? What should happen instead?</p>`,
     a: `<p>No. Never store card numbers, passwords or similar secrets in memory or logs. The agent should not repeat it back, should tell the customer not to share card details in chat, and your logging should mask anything that looks like a card number (lesson 7.5).</p>`},
  ],
  quiz: [
    {q: "Where does agent 'memory' actually live?", o: ["Inside the model's weights after each chat", "In storage you control, put back into the context when relevant", "In the user's browser only", "Nowhere"], a: 1, why: "Models don't remember; you store and recall."},
    {q: "'Last week we gave this customer a voucher' is:", o: ["Procedural memory", "Episodic memory", "Working memory", "Not memory"], a: 1, why: "Episodic memory records past events."},
    {q: "What should an agent never store in memory?", o: ["Preferred language", "Passwords and card numbers", "Delivery area", "Order history"], a: 1, why: "Secrets don't belong in memory or logs."},
  ],
},
];

// ---------------------------------------------------------------- Week 14
export const week14: Lesson[] = [
{
  id: "14-1", title: "Embeddings: turning meaning into numbers", mins: 14,
  objectives: [
    "Explain what an embedding is and why similar meanings get similar numbers",
    "Create embeddings for free on your own computer",
    "Measure how similar two texts are with cosine similarity",
  ],
  prereqs: "<p>Lesson 1.5 (how transformers turn words into numbers) and Week 9 (Python and APIs).</p>",
  body: h`
<p>Searching documents by keyword fails all the time: a customer asks "can I get my money back?" and your policy says "refunds". An <b>embedding</b> fixes this by turning text into a list of numbers that captures its <em>meaning</em>, so texts that mean similar things get similar numbers, whatever words they use.</p>
<h3>The idea in one picture</h3>
<p>Imagine every sentence as a point on a map. "Can I get my money back?" and "How do refunds work?" land close together; "What time do you open?" lands far away. Real embeddings use hundreds of dimensions instead of two (384 or 768 are common), but the idea is the same: <b>closeness means similar meaning</b>.</p>
<h3>Making embeddings for free</h3>
<p>You don't need a paid API. The <code>sentence-transformers</code> library runs a small embedding model on your own computer:</p>
<pre>pip install sentence-transformers

from sentence_transformers import SentenceTransformer
model = SentenceTransformer("all-MiniLM-L6-v2")      # small, fast, free; 384 numbers per text
vectors = model.encode([
    "Can I get my money back?",
    "How do refunds work?",
    "What time do you open?",
])
print(vectors.shape)   # (3, 384)</pre>
<p>Other free routes: an embedding model in Ollama (Week 10), or Cloudflare Workers AI's embedding model within the free daily allowance.</p>
<h3>Measuring similarity</h3>
<p>To compare two embeddings, use <b>cosine similarity</b>: it measures the angle between the two lists of numbers. 1 means the same direction (same meaning), 0 means unrelated.</p>
\[\text{cosine}(a, b) = \frac{a \cdot b}{\|a\|\,\|b\|}\]
<p>In plain words: multiply the matching numbers and add them up (the top), then divide by the two lengths (the bottom) so long and short texts compare fairly. You don't need to do this by hand:</p>
<pre>from sentence_transformers import util
print(util.cos_sim(vectors[0], vectors[1]))   # high, around 0.6+
print(util.cos_sim(vectors[0], vectors[2]))   # low, near 0.1</pre>
<h3>Things to know</h3>
<ul>
<li><b>Use the same model</b> for your documents and your questions. Embeddings from different models can't be compared.</li>
<li><b>Language matters:</b> small English models handle Pidgin, Yoruba, Igbo or Hausa less well. Test on your real text, and consider multilingual embedding models.</li>
<li><b>Embeddings capture topic, not truth:</b> "refunds take 5 days" and "refunds take 30 days" are very similar to an embedding.</li>
</ul>
<div class="callout"><b>Stuck on the maths?</b> You only need the idea: every text becomes a point, and close points mean similar meaning. Libraries do the arithmetic. The "Go deep" section has the Stanford lecture if you want the full story.</div>`,
  watch: [V.wordEmb, V.embGuide, U.cs224n_wv],
  read: [R.bge],
  exercise: `<p>Embed 20 short texts from a business you know (FAQ questions, product names, policy lines), including a few in Pidgin or another Nigerian language. For five questions a customer might ask, find the most similar text by cosine similarity. Where does it work, and where does it fail? Note one fix for each failure.</p>`,
  problems: [
    {q: h`<p>Two tiny 3-number embeddings: \(a = (1, 2, 2)\) and \(b = (2, 1, 2)\). Compute their cosine similarity.</p>`,
     a: h`<ol><li><b>Top (dot product):</b> \(1\times2 + 2\times1 + 2\times2 = 2 + 2 + 4 = 8\).</li><li><b>Lengths:</b> \(\|a\| = \sqrt{1+4+4} = 3\) and \(\|b\| = \sqrt{4+1+4} = 3\).</li><li><b>Cosine:</b> \(8 / (3 \times 3) = 8/9 \approx 0.89\).</li></ol><p>Very similar directions, so these would count as close in meaning.</p>`},
    {q: `<p>You embedded your documents with model A, then switched to model B for questions to save money. Search results became nonsense. Why?</p>`,
     a: `<p>Each model places texts on its own "map". Coordinates from model A and model B mean different things, so comparing them is meaningless. Use one model for both, and if you switch models, re-embed all your documents.</p>`},
  ],
  quiz: [
    {q: "An embedding is:", o: ["A compressed file", "A list of numbers that represents a text's meaning", "A type of database", "An encryption key"], a: 1, why: "Similar meanings get similar numbers."},
    {q: "Cosine similarity close to 1 means:", o: ["The texts are unrelated", "The texts point the same way: similar meaning", "The texts are long", "An error"], a: 1, why: "1 is the most similar."},
    {q: "Which is a known weakness of embeddings?", o: ["They can't handle synonyms", "Texts on the same topic look similar even if their facts differ", "They only work in Python", "They need a GPU"], a: 1, why: "They capture topic, not truth."},
  ],
},
{
  id: "14-2", title: "Semantic search from scratch", mins: 13,
  objectives: [
    "Build a working semantic search over your own documents in under 30 lines",
    "Explain why searching by meaning beats searching by keywords, and when it doesn't",
    "Estimate how search speed and memory grow with more documents",
  ],
  prereqs: "<p>Lesson 14.1.</p>",
  body: `
<p><b>Semantic search</b> finds documents by meaning: embed every document once, embed the question, and return the documents whose embeddings are closest. You can build it with what you learned in 14.1.</p>
<pre>from sentence_transformers import SentenceTransformer, util

model = SentenceTransformer("all-MiniLM-L6-v2")
docs = [
    "Refunds are paid within 5 working days to the original payment method.",
    "We deliver across Lagos in 1-2 days; other states take 3-5 days.",
    "Our Ikeja shop opens 9am to 7pm, Monday to Saturday.",
    "Phones have a 6-month warranty covering manufacturing faults.",
]
doc_vectors = model.encode(docs)                     # do this once and save it

def search(question, k=2):
    q = model.encode(question)
    scores = util.cos_sim(q, doc_vectors)[0]
    best = scores.argsort(descending=True)[:k]
    return [(docs[i], float(scores[i])) for i in best]

print(search("Can I get my money back?"))           # finds the refunds line first</pre>
<p>That's a complete search engine for small collections.</p>
<h3>Meaning vs keywords</h3>
<ul>
<li><b>Semantic search wins</b> when people use different words from the documents ("money back" vs "refunds"), or ask in a different style.</li>
<li><b>Keyword search wins</b> for exact things: product codes ("iPhone 15 Pro Max 256GB"), names, order numbers and rare terms that embeddings blur together.</li>
</ul>
<p>Real systems often use both. That's <b>hybrid search</b>, in lesson 15.2.</p>
<h3>How it grows</h3>
<p>This simple version compares the question with every document. With 10,000 documents of 384 numbers that's fast. With millions, comparing everything gets slow, and you need a <b>vector database</b> with an index that finds close points without checking them all (lesson 14.3).</p>
<div class="callout"><b>Results look random?</b> Check three things: you used the same model for documents and questions; each "document" is a sensible size (a paragraph, not a whole book; see chunking in lesson 15.1); and the right answer actually exists in your documents.</div>`,
  watch: [V.vectorVsSemantic, V.semantic],
  read: [R.chroma],
  exercise: `<p>Build semantic search over at least 50 real text snippets (a business's FAQ, a policy split into paragraphs, or your own notes). Write 10 test questions with the snippet that should come first. Measure how often the right snippet is in the top 1 and the top 3. Keep this: it's the start of your Month 4 project.</p>`,
  problems: [
    {q: `<p>Searching for "SKU-44917" returns unrelated phones. Why, and what fixes it?</p>`,
     a: `<p>Codes like SKU-44917 carry no meaning an embedding can capture, so similar-looking codes blur together. Use keyword or exact-match search for codes and names (or hybrid search, lesson 15.2), and keep semantic search for questions in normal language.</p>`},
    {q: `<p>You have 50,000 snippets, each embedded as 384 numbers stored as 4-byte floats. How much memory do the embeddings need?</p>`,
     a: `<p>50,000 × 384 × 4 bytes = 76,800,000 bytes, about <b>77 MB</b>. Small enough to keep in memory and search directly on a laptop; you don't need a vector database yet at this size, though one adds convenience (lesson 14.3).</p>`},
  ],
  quiz: [
    {q: "Semantic search finds documents by:", o: ["Exact keywords", "Closeness of their embeddings to the question's", "Alphabetical order", "File size"], a: 1, why: "Close embeddings mean similar meaning."},
    {q: "Where does keyword search beat semantic search?", o: ["Questions in casual language", "Exact codes, names and order numbers", "Synonyms", "Translations"], a: 1, why: "Embeddings blur exact identifiers."},
    {q: "Why save document embeddings instead of recomputing them?", o: ["They expire", "Embedding is the slow part, and documents rarely change", "It's required", "To save the model"], a: 1, why: "Embed once, search many times."},
  ],
},
{
  id: "14-3", title: "Vector databases: choosing one you can afford", mins: 14,
  objectives: [
    "Explain what a vector database adds beyond a list of embeddings",
    "Store and search documents with Chroma (local) and pgvector (Postgres)",
    "Choose a free or cheap option that fits your project",
  ],
  prereqs: "<p>Lessons 14.1–14.2.</p>",
  body: `
<h3>What a vector database adds</h3>
<ul>
<li><b>Fast approximate search:</b> an index that finds the closest vectors among millions without comparing every one.</li>
<li><b>Storage with metadata:</b> keep the text, its source, date and category next to each vector, and filter on them ("only 2026 policies").</li>
<li><b>Updates:</b> add, change and delete documents without rebuilding everything.</li>
</ul>
<h3>Option 1: Chroma (free, on your computer)</h3>
<pre>pip install chromadb

import chromadb
client = chromadb.PersistentClient(path="./db")
col = client.get_or_create_collection("shop_policies")
col.add(
    ids=["refunds-1", "delivery-1"],
    documents=["Refunds are paid within 5 working days...", "We deliver across Lagos in 1-2 days..."],
    metadatas=[{"source": "refunds.md", "year": 2026}, {"source": "delivery.md", "year": 2026}],
)
print(col.query(query_texts=["can I get my money back?"], n_results=2))</pre>
<p>Chroma creates the embeddings for you with a small built-in model. Perfect for learning and small projects.</p>
<h3>Option 2: pgvector (Postgres, which you may already use)</h3>
<p>If your app already uses PostgreSQL, the <code>pgvector</code> extension adds vectors to it, so your data and search live in one place:</p>
<pre>CREATE EXTENSION vector;
CREATE TABLE chunks (id bigserial PRIMARY KEY, content text, source text, embedding vector(384));
-- find the 5 closest chunks to a question's embedding (&lt;=&gt; is cosine distance)
SELECT content, source FROM chunks ORDER BY embedding &lt;=&gt; $1 LIMIT 5;</pre>
<h3>Free and cheap ways to host it</h3>
<ul>
<li><b>Chroma on your own machine:</b> free, no account.</li>
<li><b>Neon (Postgres with pgvector):</b> a permanent free plan that doesn't need a credit card.</li>
<li><b>Cloudflare Vectorize:</b> included in the free Workers plan, pairs with Workers AI's free embedding model, also no card needed.</li>
<li><b>Qdrant, Pinecone and others</b> have free tiers too; check whether they need a card.</li>
</ul>
<p>Free tiers change, so check the limits on the provider's own page before you build on one.</p>
<div class="callout"><b>Which should I pick?</b> Learning or a small project: Chroma. An app that already uses Postgres: pgvector, for example on Neon. An app you'll deploy on Cloudflare (Month 6): Vectorize. You can switch later; the ideas are identical.</div>`,
  watch: [V.vdbIbm, V.vdbFireship, V.pgvector],
  read: [R.chroma, R.neon, R.vectorize, R.qdrant],
  exercise: `<p>Move your 50+ snippets from lesson 14.2 into Chroma, with metadata for source and date. Repeat your 10 test questions and confirm the top-3 hit rate matches. Then add a metadata filter (for example, only documents from one source) and test that it works. Optional: load the same data into pgvector on Neon's free plan and compare.</p>`,
  problems: [
    {q: `<p>Your shop's policy changed in 2026. How do you make sure search never returns the 2024 version?</p>`,
     a: `<p>Either delete the old chunks when the new policy is added, or store a <code>year</code> (or <code>valid_from</code>) field and filter queries to current documents. Deleting is simplest; filtering keeps history if you need it for disputes.</p>`},
    {q: `<p>A learner in Ibadan has no card that works for international sign-ups. Which vector database options can they still use?</p>`,
     a: `<p>Chroma on their own computer (no account at all), Neon's free Postgres with pgvector (no credit card needed), and Cloudflare Vectorize on the free Workers plan (no card needed). Check each provider's current terms, since free tiers change.</p>`},
  ],
  quiz: [
    {q: "A vector database mainly adds:", o: ["Better embeddings", "Fast search at scale, metadata filtering and updates", "A chat interface", "Free GPUs"], a: 1, why: "It stores, indexes and filters vectors efficiently."},
    {q: "pgvector is:", o: ["A cloud provider", "An extension that adds vector search to PostgreSQL", "An embedding model", "A Python library for charts"], a: 1, why: "It brings vectors into Postgres."},
    {q: "Metadata lets you:", o: ["Make embeddings bigger", "Filter results, for example to current policies only", "Skip embeddings", "Translate documents"], a: 1, why: "Filters keep irrelevant or outdated chunks out."},
  ],
},
{
  id: "14-4", title: "Your first RAG system: search, then answer", mins: 15,
  objectives: [
    "Explain retrieval-augmented generation (RAG) and when to use it",
    "Build a complete RAG pipeline: retrieve, build context, answer with sources",
    "Make the model say \"I don't know\" when the documents don't cover a question",
  ],
  prereqs: "<p>Lessons 14.1–14.3, Week 9 (API calls) and lesson 2.5 (grounding).</p>",
  body: h`
<p><b>Retrieval-augmented generation (RAG)</b> combines everything this week: search your documents for the parts relevant to a question, put them in the context, and ask the model to answer <em>only from them</em>. The model brings language skills; your documents bring the facts.</p>
<h3>Why RAG</h3>
<ul>
<li>The model doesn't know your prices, policies or last month's changes (lesson 1.1).</li>
<li>Updating documents takes minutes; retraining a model doesn't (lesson 10.6).</li>
<li>Answers can show their sources, so people can check them (lesson 1.4).</li>
</ul>
<h3>The pipeline</h3>
<pre>def answer(question):
    hits = col.query(query_texts=[question], n_results=4)           # 1. retrieve
    sources = "\n\n".join(
        f'&lt;doc id="{i}" source="{m["source"]}"&gt;{d}&lt;/doc&gt;'
        for i, (d, m) in enumerate(zip(hits["documents"][0], hits["metadatas"][0]))
    )                                                                # 2. build context
    prompt = f"""Answer the customer's question using ONLY the documents below.
Cite the document ids you used, like [0]. If the documents don't contain the
answer, say "I don't have that information" and suggest contacting the shop.

&lt;documents&gt;
{sources}
&lt;/documents&gt;

&lt;question&gt;{question}&lt;/question&gt;"""
    reply = client.messages.create(model="claude-sonnet-5-5", max_tokens=400,
                                   messages=[{"role": "user", "content": prompt}])
    return reply.content[0].text                                     # 3. answer</pre>
<p>Every part is something you already know: retrieval (14.3), delimiters and grounding (2.5), the API call (9.1). If you're on the free route, swap the API call for your local Ollama model (Week 10).</p>
<h3>The two things that go wrong</h3>
<ol>
<li><b>Retrieval misses:</b> the right passage wasn't in the top results, so the model can't answer well. Fixes are in Week 15.</li>
<li><b>Generation drifts:</b> the passage was there, but the model ignored it, added outside "knowledge" or mixed sources up. Fixed with stricter grounding and citations (lesson 15.3).</li>
</ol>
<p>Always test these separately: did search find the right passage? Then, given that passage, was the answer right? You'll measure both in Week 16.</p>
<div class="callout"><b>Answers ignore your documents?</b> Make the instruction explicit ("using ONLY the documents"), put the documents before the question, and ask for citations. If it still answers from general knowledge, add an example of a correct "I don't have that information" reply.</div>`,
  watch: [V.ragIbm, V.rag50, V.ragFcc],
  read: [R.ragPaper, R.chroma],
  exercise: `<p>This is the Week 14 build, project "Ask the shop": a RAG assistant over at least 50 snippets of a real business's public information (FAQ, policies, price list). It must cite sources and say "I don't have that information" when it can't answer. Test with 15 questions: 10 answerable, 5 not. Record retrieval hits and answer correctness separately.</p>`,
  problems: [
    {q: `<p>A customer asks "Do you deliver to Port Harcourt?" The documents only say "Lagos in 1–2 days; other states 3–5 days." What's the ideal answer?</p>`,
     a: `<p>"Yes, we deliver to other states, including Port Harcourt, in 3–5 days [0]." The documents cover it ("other states"), so the assistant should answer and cite, not refuse. That's why test cases need care: answerable questions aren't always word-for-word in the documents.</p>`},
    {q: `<p>In testing, search finds the right passage for 9 of 10 answerable questions, but only 6 answers are correct. Where's the problem?</p>`,
     a: `<p>Mostly in <b>generation</b>: for at least 3 questions, the right passage was in the context but the answer was still wrong. Read those cases. Common causes are mixing two passages, ignoring a condition ("only for phones"), or adding outside knowledge. Tighten the grounding instructions and require citations. Then fix the 1 retrieval miss separately.</p>`},
  ],
  quiz: [
    {q: "RAG stands for:", o: ["Random answer generation", "Retrieval-augmented generation", "Rapid API gateway", "Real AI grounding"], a: 1, why: "Retrieve relevant documents, then generate from them."},
    {q: "Why is RAG better than fine-tuning for a changing price list?", o: ["It's more fun", "Documents update in minutes and answers can cite sources", "Fine-tuning is illegal", "RAG needs no documents"], a: 1, why: "Facts that change belong in retrieval."},
    {q: "To debug a wrong RAG answer, first check:", o: ["The model's age", "Whether search returned the right passage", "The font", "The temperature only"], a: 1, why: "Separate retrieval failures from generation failures."},
  ],
},
];

// ---------------------------------------------------------------- Week 15
export const week15: Lesson[] = [
{
  id: "15-1", title: "Preparing documents: parsing and chunking", mins: 14,
  objectives: [
    "Turn PDFs, Word files, web pages and chat exports into clean text",
    "Split documents into chunks that keep their meaning",
    "Choose chunk sizes and overlap by testing, not guessing",
  ],
  prereqs: "<p>Week 14.</p>",
  body: `
<p>RAG quality is decided before any question is asked: by how well your documents are turned into searchable pieces. Bad input in, bad answers out.</p>
<h3>Step 1: parse into clean text</h3>
<ul>
<li><b>PDFs and Word files:</b> tools such as <b>Docling</b> (free, open source) convert them to clean Markdown, keeping headings and tables:
<pre>pip install docling
from docling.document_converter import DocumentConverter
md = DocumentConverter().convert("delivery-policy.pdf").document.export_to_markdown()</pre></li>
<li><b>Scanned documents and photos:</b> need text recognition (OCR) or a vision model (lesson 9.6 and 15.5).</li>
<li><b>Web pages:</b> keep the main text, drop menus and footers.</li>
<li><b>WhatsApp chat exports</b> (a common source of business knowledge in Nigeria): remove personal phone numbers, keep the useful questions and answers (lesson 1.6).</li>
</ul>
<h3>Step 2: chunk</h3>
<p>A <b>chunk</b> is one searchable piece. Too big, and the embedding becomes a blur of several topics and wastes context. Too small, and a chunk loses the information needed to make sense ("It takes 5 days" — what does?).</p>
<ul>
<li><b>Split on structure first:</b> headings, sections, paragraphs. A section of a policy is a natural chunk.</li>
<li><b>Then by size:</b> a few hundred words (roughly 200–500 tokens) is a common starting point.</li>
<li><b>Add overlap:</b> repeat a sentence or two between neighbouring chunks so meaning at the edges isn't cut.</li>
<li><b>Add context to each chunk:</b> prefix the document title and section heading: "Delivery policy &gt; Other states: …". This one trick often improves retrieval a lot.</li>
</ul>
<h3>Test, don't guess</h3>
<p>Try two or three chunk sizes with your test questions from Week 14 and keep the one with the best top-3 hit rate. The best size depends on your documents.</p>
<div class="callout"><b>Tables coming out as gibberish?</b> Tables are the hardest part of parsing. Convert them to Markdown tables (Docling does this) or turn each row into a sentence ("iPhone 15, 128GB: ₦1,250,000"), which embeds and retrieves much better.</div>`,
  watch: [V.docling, V.chunking],
  read: [R.chroma],
  exercise: `<p>Take three real documents of different types (a PDF, a web page and a chat export or FAQ). Parse them to clean text, then chunk them three ways: by paragraph, by ~300 tokens with overlap, and by section with a title prefix. Load each version into Chroma and compare top-3 hit rates on your test questions. Keep the winner.</p>`,
  problems: [
    {q: `<p>This chunk was retrieved for "How long do refunds take?": <i>"It usually takes 5 working days, but up to 10 during holidays."</i> What's wrong with the chunk and how do you fix it?</p>`,
     a: `<p>It doesn't say <em>what</em> takes 5 days, so the model (and the reader) can't be sure it's about refunds, and it might match delivery questions too. Fix by adding the document and section as a prefix ("Refund policy &gt; Timing: It usually takes…") or by chunking by section so the heading stays with the text.</p>`},
    {q: `<p>A 40-page policy is chunked into 400-token pieces with 50 tokens of overlap. Roughly how many chunks is that, if the policy is about 20,000 tokens?</p>`,
     a: `<p>Each new chunk adds 400 − 50 = 350 new tokens. 20,000 ÷ 350 ≈ 57, so about <b>57–58 chunks</b>. That's tiny for a vector database; the hard part is making each chunk meaningful, not storing them.</p>`},
  ],
  quiz: [
    {q: "Why add overlap between chunks?", o: ["To use more storage", "So meaning at chunk edges isn't cut off", "It's required by vector databases", "To slow down search"], a: 1, why: "Overlap keeps boundary sentences with their context."},
    {q: "A simple trick that often improves retrieval is:", o: ["Removing all headings", "Prefixing each chunk with its document and section title", "Making chunks one word long", "Using capital letters"], a: 1, why: "The title gives the chunk context."},
    {q: "The best chunk size is found by:", o: ["Always using 1,000 tokens", "Testing a few sizes on your own questions", "Asking the model", "Using the smallest possible"], a: 1, why: "It depends on your documents, so measure."},
  ],
},
{
  id: "15-2", title: "Better retrieval: hybrid search, reranking and filters", mins: 15,
  objectives: [
    "Combine keyword and semantic search (hybrid search)",
    "Use a reranker to put the best results first",
    "Filter results with metadata",
  ],
  prereqs: "<p>Lesson 15.1.</p>",
  body: h`
<h3>Hybrid search: the best of both</h3>
<p>Semantic search understands meaning; keyword search catches exact codes and names (lesson 14.2). <b>Hybrid search</b> runs both and merges the results. The classic keyword method is <b>BM25</b>, which scores documents by how often the question's words appear in them, giving more weight to rare words.</p>
<pre>pip install rank-bm25
from rank_bm25 import BM25Okapi
bm25 = BM25Okapi([doc.lower().split() for doc in docs])
keyword_scores = bm25.get_scores("iphone 15 pro max price".split())</pre>
<p>To merge two ranked lists, a simple, robust method is <b>reciprocal rank fusion</b>: each document gets points from its position in each list, and the totals decide the order.</p>
\[\text{score}(d) = \sum_{\text{lists}} \frac{1}{k + \text{rank}(d)}, \qquad k = 60 \text{ is the usual choice}\]
<p>In plain words: being near the top of either list earns a lot; being near the top of both earns the most.</p>
<h3>Reranking: a second, smarter look</h3>
<p>Search is fast but rough. A <b>reranker</b> is a model that reads the question and each candidate together and scores how well they match, which is slower but more accurate. The pattern: retrieve 20–30 candidates quickly, rerank them, keep the top 3–5 for the context.</p>
<pre>from sentence_transformers import CrossEncoder
reranker = CrossEncoder("cross-encoder/ms-marco-MiniLM-L-6-v2")   # free, runs locally
scores = reranker.predict([(question, c) for c in candidates])</pre>
<h3>Metadata filters</h3>
<p>Filter before or during search: only the current year's policies, only the product category the customer is asking about, only documents this user is allowed to see. That last one matters: in a multi-business app, <b>never</b> let one customer's search return another business's private documents.</p>
<div class="callout"><b>Which should I add first?</b> Measure first (your top-3 hit rate). If exact names and codes are failing, add hybrid search. If the right chunk is found but often not first, add a reranker. If outdated or wrong-category chunks appear, add filters. Fix what's actually failing.</div>`,
  watch: [V.bm25, V.rerank, V.hybridGuide],
  read: [R.qdrant],
  exercise: `<p>Add hybrid search (BM25 plus embeddings, merged with reciprocal rank fusion) and a reranker to your "Ask the shop" project. Measure the top-1 and top-3 hit rates on your test questions for: semantic only, hybrid, and hybrid plus reranker. Include at least three questions with product codes or names. Keep the best setup and write down the numbers.</p>`,
  problems: [
    {q: h`<p>A document is ranked 1st by keyword search and 4th by semantic search. Another is 2nd and 2nd. Using reciprocal rank fusion with \(k = 60\), which comes first?</p>`,
     a: h`<p>First document: \(1/61 + 1/64 \approx 0.01639 + 0.01563 = 0.03202\).<br>Second document: \(1/62 + 1/62 \approx 0.01613 + 0.01613 = 0.03226\).</p><p>The second edges ahead: consistently near the top of both lists beats first in one and fourth in the other. The differences are small, which is why a reranker often makes the final call.</p>`},
    {q: `<p>Your app serves 30 small shops, each with its own documents in one vector database. What must every search include, and why?</p>`,
     a: `<p>A filter on the shop (for example <code>shop_id = current user's shop</code>), applied on the server, not trusted from the browser. Without it, one shop's customers could get answers drawn from another shop's private price lists, a serious data leak (lesson 7.5).</p>`},
  ],
  quiz: [
    {q: "Hybrid search combines:", o: ["Two vector databases", "Keyword search (like BM25) and semantic search", "Text and images", "Two models answering"], a: 1, why: "Each catches what the other misses."},
    {q: "A reranker is used to:", o: ["Embed documents faster", "Re-score a short list of candidates more accurately", "Delete old documents", "Translate questions"], a: 1, why: "Retrieve many quickly, then rerank carefully."},
    {q: "In a multi-business app, every search must:", o: ["Return as many results as possible", "Filter to documents the current user is allowed to see", "Skip metadata", "Use the largest model"], a: 1, why: "Otherwise private data leaks between customers."},
  ],
},
{
  id: "15-3", title: "Trustworthy answers: citations and \"I don't know\"", mins: 13,
  objectives: [
    "Make every answer cite the sources it used",
    "Check citations automatically",
    "Handle questions the documents don't cover, safely",
  ],
  prereqs: "<p>Lessons 14.4 and 15.1–15.2.</p>",
  body: `
<p>A RAG answer is only as useful as people's ability to trust it. Two habits make answers trustworthy: <b>show where each fact came from</b>, and <b>refuse to guess</b>.</p>
<h3>Citations</h3>
<p>Give each chunk an id in the context (lesson 14.4) and require the model to cite ids after each claim: "Refunds take 5 working days [2]." Then show the user the source next to the answer (the document name, section, or a link). Ask for citations in a structured format if your code needs to check them:</p>
<pre>{"answer": "Refunds take 5 working days.", "citations": [2]}</pre>
<h3>Check citations automatically</h3>
<ul>
<li><b>Every cited id must exist</b> in the retrieved set. A citation to [7] when you only sent [0]–[3] means the model invented it.</li>
<li><b>Key facts must appear in the cited chunk:</b> numbers, dates and prices in the answer should be found in the cited text. A simple check in code catches many errors.</li>
<li><b>Spot-check with a judge</b> (lesson 11.4): "Is every claim in the answer supported by the cited documents? Answer yes or no and list unsupported claims."</li>
</ul>
<h3>"I don't know" done well</h3>
<p>When the documents don't cover a question, a confident guess is the worst outcome. Make the safe path explicit:</p>
<ul>
<li>Instruct: "If the documents don't contain the answer, say so."</li>
<li>Give a helpful next step: "I don't have that information. You can call the shop on … or I can ask a staff member."</li>
<li>Include unanswerable questions in your eval set (lesson 11.2) and count how often the system wrongly answers them.</li>
<li>For high-stakes topics (health, money, legal), route uncertain cases to a person.</li>
</ul>
<div class="callout"><b>Model still "helpfully" guesses?</b> Show it an example in the prompt of a question the documents don't cover and the exact refusal you want. Few-shot examples of refusing work better than instructions alone (lesson 2.5).</div>`,
  watch: [V.ragStrategies, U.cs25rag],
  read: [R.ragPaper],
  exercise: `<p>Upgrade "Ask the shop" to return structured answers with citations, show the source next to each answer, and add two automatic checks: cited ids exist, and any number in the answer appears in a cited chunk. Add 5 more unanswerable questions to your test set and measure how often the system correctly says it doesn't know.</p>`,
  problems: [
    {q: `<p>Answer: "Delivery to Abuja costs ₦4,500 [1]." Chunk [1] says: "Delivery outside Lagos: ₦3,500 for orders under ₦50,000." What does your automatic check do, and what's the likely cause?</p>`,
     a: `<p>The number check fails: ₦4,500 doesn't appear in chunk [1]. The model probably mixed up a figure from another chunk or invented it. Flag the answer (don't show it, or show it with a warning), log the case, and add it to your eval set. Common fixes: fewer, more relevant chunks, and an instruction to quote prices exactly as written.</p>`},
    {q: `<p>Of 20 unanswerable questions, your assistant correctly refuses 14 and confidently answers 6. Why is this worse than it sounds, and what's the target?</p>`,
     a: `<p>30% of the time, a customer who asks something you don't cover gets a made-up answer delivered with the same confidence as a real one, so people can't tell which answers to trust. For customer-facing use, aim for near 100% correct refusals on your test set, and route uncovered topics to a person.</p>`},
  ],
  quiz: [
    {q: "A citation to a document id that wasn't retrieved means:", o: ["The answer is extra good", "The model invented the citation", "The database is slow", "Nothing"], a: 1, why: "Cited ids must come from the retrieved set."},
    {q: "The best response when the documents don't cover a question is:", o: ["A confident guess", "Saying so, with a helpful next step", "Silence", "A random fact"], a: 1, why: "Honest refusals keep trust."},
    {q: "Unanswerable questions should be:", o: ["Left out of the eval set", "Included in the eval set and measured", "Answered from general knowledge", "Ignored"], a: 1, why: "You can only improve what you measure."},
  ],
},
{
  id: "15-4", title: "When RAG isn't enough: knowledge graphs", mins: 13,
  objectives: [
    "Explain what a knowledge graph is, in plain words",
    "Recognise questions that need several connected facts (multi-hop questions)",
    "Decide when GraphRAG is worth the extra effort",
  ],
  prereqs: "<p>Lessons 14.4 and 15.1–15.3.</p>",
  body: `
<p>Normal RAG finds passages that <em>look like</em> the question. That fails when the answer needs facts connected across several documents.</p>
<h3>A question normal RAG struggles with</h3>
<p>"Which of our suppliers deliver products that are under warranty recalls?" The answer needs three linked facts: which products have recalls (one document), which supplier provides each product (another), and which suppliers are active (a third). No single chunk looks like the question.</p>
<h3>Knowledge graphs in plain words</h3>
<p>A <b>knowledge graph</b> stores facts as <b>things</b> (nodes) and <b>relationships</b> (edges): <em>Supplier A</em> —supplies→ <em>Phone X</em> —has→ <em>Recall 2026-03</em>. Questions become walks through the graph, following connections, which is exactly what multi-hop questions need.</p>
<h3>GraphRAG</h3>
<p><b>GraphRAG</b> uses a language model to <em>extract</em> things and relationships from your documents into a graph, then answers questions by searching the graph (and often the original text too). It also helps with "big picture" questions, such as "What are the main complaints across all reviews?", by summarising clusters of the graph.</p>
<h3>Is it worth it?</h3>
<ul>
<li><b>Use plain RAG</b> (Weeks 14–15) for most question-answering over documents: FAQs, policies, manuals. It's simpler and cheaper.</li>
<li><b>Consider a graph</b> when many questions connect several facts, when your data is naturally about relationships (suppliers, products, customers, people), or when you need whole-collection summaries.</li>
<li><b>Costs:</b> extracting a graph means many model calls over every document, and the graph needs maintaining as documents change.</li>
</ul>
<div class="callout"><b>Not sure if you need it?</b> Look at your eval failures from lesson 15.3. If the failing questions need two or three facts from different documents, try a graph. If they fail for other reasons (bad chunks, missing documents), fix those first.</div>`,
  watch: [V.kg, V.graphRag, V.graphRagTalk],
  read: [R.graphrag],
  exercise: `<p>Pick 10 documents from your project. Ask a model to extract things and relationships from them as a list of triples (thing, relationship, thing), check 20 of them by hand for accuracy, and draw the graph (on paper is fine). Write two multi-hop questions and answer them by following the graph. Would your current RAG system answer them? Test it.</p>`,
  problems: [
    {q: `<p>Which questions are multi-hop? (a) "What's the return window?" (b) "Which customers bought products from suppliers who missed deliveries last month?" (c) "What time does the Ikeja shop open?"</p>`,
     a: `<p><b>(b)</b> only: it connects customers → products → suppliers → missed deliveries. (a) and (c) are single facts that plain RAG handles well.</p>`},
    {q: `<p>A model extracted 500 triples from your documents. You check 50 and find 6 wrong. What does that mean for answers built on the graph?</p>`,
     a: `<p>About 12% of facts in the graph may be wrong, and multi-hop answers multiply errors: a 3-hop answer with 88% accurate links is fully right only about 0.88³ ≈ 68% of the time. Improve extraction (better prompt, examples, a review step), keep links to the source text for checking, and evaluate graph answers like any other (lesson 11.3).</p>`},
  ],
  quiz: [
    {q: "A knowledge graph stores:", o: ["Only images", "Things and the relationships between them", "Embeddings only", "Passwords"], a: 1, why: "Nodes and edges, things and relationships."},
    {q: "A multi-hop question needs:", o: ["A longer prompt", "Several connected facts, often from different documents", "Two models", "Voice input"], a: 1, why: "It chains facts together."},
    {q: "For a simple FAQ assistant, you should usually use:", o: ["A knowledge graph", "Plain RAG", "Fine-tuning", "No retrieval"], a: 1, why: "Graphs add cost that simple Q&A doesn't need."},
  ],
},
{
  id: "15-5", title: "Documents beyond text: images, scans and voice notes", mins: 13,
  objectives: [
    "Add scanned documents and photos to your knowledge base",
    "Let users ask questions with photos and voice notes",
    "Keep sensitive images and audio safe",
  ],
  prereqs: "<p>Lesson 9.6 (images, voice and moderation) and lessons 15.1–15.3.</p>",
  body: `
<p>A lot of real business knowledge isn't typed: price lists photographed on a wall, scanned delivery notes, product photos, and voice notes explaining how things work. Customers ask questions the same way.</p>
<h3>Getting images and scans into the knowledge base</h3>
<ul>
<li><b>Scanned documents:</b> parsers like Docling can run text recognition (OCR) on scans. Check the output: blurry scans produce errors, especially in numbers.</li>
<li><b>Photos of price lists, menus or signs:</b> send them to a vision model (lesson 9.6) with "Transcribe this price list as a Markdown table". Review the result once, then chunk and index the text like any document.</li>
<li><b>Keep a link to the original image</b> in the chunk's metadata so answers can show it as the source.</li>
</ul>
<h3>Voice notes into the knowledge base</h3>
<p>Transcribe with Whisper (lesson 9.6), clean the transcript (remove filler and personal details), and index it with metadata: who recorded it, when, and the topic. A shop owner's 3-minute voice note explaining the warranty process becomes searchable knowledge.</p>
<h3>Questions as photos and voice notes</h3>
<ul>
<li><b>A photo question</b> ("Do you have this in black?" with a product photo): first ask a vision model to describe the product, then use that description as the search query.</li>
<li><b>A voice question:</b> transcribe it, then treat the text like a typed question. Show the user the transcript so they can correct it.</li>
<li>Moderate inputs before processing (lesson 9.6).</li>
</ul>
<h3>Privacy</h3>
<p>Photos and voice notes often contain more than intended: faces, addresses on parcels, other people talking in the background. Store only what you need, remove personal details from transcripts, and don't keep raw audio longer than necessary (lesson 1.6).</p>
<div class="callout"><b>Transcripts full of errors?</b> Accents, Pidgin and noisy markets make transcription harder. Try a larger Whisper model, ask people to record in a quieter place, and always show the transcript back to the user before acting on it.</div>`,
  watch: [V.doclingRedHat],
  read: [R.chroma],
  exercise: `<p>Add three non-text sources to "Ask the shop": a photographed price list (vision transcription), a scanned document (OCR), and a voice note (Whisper). Index them with metadata linking to the original. Then support one photo question and one voice question end to end, and add four such cases to your test set.</p>`,
  problems: [
    {q: `<p>A photographed price list was transcribed as "Samsung A15 — ₦185,000" but the photo says ₦165,000. How should your pipeline catch errors like this before they reach customers?</p>`,
     a: `<p>Review vision transcriptions of price lists once by a person before indexing (they change rarely, so it's quick), keep a link to the original photo as the citation so customers and staff can check, and for prices above a threshold, show the source image with the answer.</p>`},
    {q: `<p>A customer sends a voice note: "abeg how much be the A15 for black?" Write the steps your assistant takes.</p>`,
     a: `<ol><li>Moderate the audio's transcript after transcribing with Whisper.</li><li>Show the transcript to the customer ("Did you ask: how much is the A15 in black?").</li><li>Search the knowledge base with the transcript (hybrid search catches "A15").</li><li>Answer from the price list chunk with a citation, in the customer's style if appropriate.</li><li>If the black version isn't listed, say so and offer to ask staff.</li></ol>`},
  ],
  quiz: [
    {q: "How do you add a photographed price list to RAG?", o: ["Embed the raw image file", "Transcribe it with a vision model, review it, then index the text", "Ignore images", "Store it as a password"], a: 1, why: "Turn it into checked text, then treat it like any document."},
    {q: "For a voice question, you should:", o: ["Answer without transcribing", "Transcribe it and show the transcript back before acting", "Delete it", "Store the raw audio forever"], a: 1, why: "Showing the transcript catches recognition errors."},
    {q: "A privacy risk with photos and voice notes is:", o: ["They're too small", "They can contain faces, addresses or other people's voices", "They can't be searched", "There's no risk"], a: 1, why: "Keep only what you need."},
  ],
},
];

// ---------------------------------------------------------------- Week 16 (exam)
export const week16: Lesson[] = [
{
  id: "16-1", title: "Planning your document assistant", mins: 12,
  objectives: [
    "Scope a document assistant for a real business, including privacy",
    "Decide which documents, inputs and channels to support",
    "Choose a free or cheap technical setup",
  ],
  prereqs: "<p>Weeks 13–15.</p>",
  body: `
<p>This month's exam brings everything together: <b>"Ask the shop", a WhatsApp-style assistant that answers from a real business's documents, reads photos and understands voice notes</b>, with its accuracy measured. Pick a real business you know (a family shop, a clinic's public information, a church, your employer with permission).</p>
<h3>Scope it</h3>
<ul>
<li><b>Who uses it</b> and for what: customers asking about prices, delivery and opening hours; staff looking up procedures.</li>
<li><b>Documents:</b> what you'll include, who owns them, how often they change, and who updates them.</li>
<li><b>Out of scope:</b> what it must not do (take payments, give medical or legal advice, promise refunds), and what it does instead (hand over to a person).</li>
<li><b>Privacy:</b> only public or approved documents; no customer personal data in the knowledge base (lesson 1.6).</li>
</ul>
<h3>The channel</h3>
<p>A real WhatsApp integration goes through WhatsApp's official business platform, which needs business verification and can charge per conversation. For this exam, a <b>WhatsApp-style web chat</b> is enough (a free Telegram bot is another option if you'd like a real messaging app). You can add WhatsApp later once the assistant is proven.</p>
<h3>A free or cheap setup</h3>
<ul>
<li><b>Embeddings:</b> sentence-transformers locally, or Workers AI's free embedding model.</li>
<li><b>Storage:</b> Chroma locally, Neon's free Postgres with pgvector, or Cloudflare Vectorize.</li>
<li><b>Model:</b> a hosted model's free or low-cost tier, or a small open model via Ollama.</li>
<li><b>Transcription:</b> Whisper locally.</li>
</ul>
<div class="callout"><b>Can't think of a business?</b> Use the public information of an organisation you know well: a school's admissions FAQ, a hospital's visiting rules and services, or a government office's published requirements. Public information keeps privacy simple.</div>`,
  watch: [V.ragBeginners, V.ragCodebasics],
  read: [R.neon, R.vectorize],
  exercise: `<p>Write a one-page plan: the business, users and top 10 questions they ask; the documents (with owner and update frequency); what's out of scope and the handover message; the channel; and your free or cheap setup with estimated monthly cost (in naira). Collect the documents and get permission where needed.</p>`,
  problems: [
    {q: `<p>The shop owner wants the assistant to "handle complaints and give refunds". What do you put in scope, and what do you hand to a person?</p>`,
     a: `<p><b>In scope:</b> explaining the complaints and refund policy, collecting the order number and problem, and telling the customer what happens next. <b>Handed to a person:</b> actually approving refunds and resolving disputes. Money decisions shouldn't be made by the assistant (lesson 7.5's "excessive agency").</p>`},
    {q: `<p>Why is "a WhatsApp-style web chat first, real WhatsApp later" a sensible plan?</p>`,
     a: `<p>The hard part is answering accurately, which a web chat proves just as well, for free and without business verification. Once accuracy is measured and the owner trusts it, the extra cost and setup of the official WhatsApp platform is justified.</p>`},
  ],
  quiz: [
    {q: "Which document is fine for a customer-facing knowledge base?", o: ["A customer list with phone numbers", "The public delivery and refund policy", "Staff salaries", "Bank login details"], a: 1, why: "Only public or approved information."},
    {q: "Official WhatsApp integration usually needs:", o: ["Nothing", "Business verification and possibly per-conversation fees", "A GPU", "A knowledge graph"], a: 1, why: "It's a business platform with its own requirements."},
    {q: "What should the assistant do with out-of-scope requests?", o: ["Guess", "Hand over to a person with a clear message", "Ignore them", "Make a promise"], a: 1, why: "A clean handover keeps trust."},
  ],
},
{
  id: "16-2", title: "Measuring a RAG system: retrieval and answers", mins: 14,
  objectives: [
    "Measure retrieval (did we find the right source?) separately from answers",
    "Compute recall@k and answer accuracy on a test set",
    "Measure citation accuracy and refusal accuracy",
  ],
  prereqs: "<p>Week 11 (evals) and lessons 14.4–15.3.</p>",
  body: h`
<p>A RAG system can fail in two places (lesson 14.4), so you measure both.</p>
<h3>1. Retrieval: did search find the right source?</h3>
<p>For each test question, record which chunk (or chunks) contains the answer. Then measure <b>recall@k</b>: the share of questions where at least one right chunk appears in the top \(k\) results.</p>
\[\text{recall@}k = \frac{\text{questions with a right chunk in the top } k}{\text{all answerable questions}}\]
<p>Check \(k = 1\), \(3\) and \(5\). If recall@5 is low, no prompt can save the answers: fix chunking and search first (Week 15).</p>
<h3>2. Answers: given the sources, was the answer right?</h3>
<ul>
<li><b>Answer accuracy:</b> graded with your Week 11 methods (exact match for facts like prices, a rubric or calibrated judge for explanations).</li>
<li><b>Faithfulness:</b> is everything in the answer supported by the retrieved chunks? (lesson 15.3's checks and a judge)</li>
<li><b>Citation accuracy:</b> do the cited chunks actually contain the cited facts?</li>
<li><b>Refusal accuracy:</b> on unanswerable questions, how often does it correctly say it doesn't know?</li>
</ul>
<p>Libraries such as <b>RAGAS</b> package these measurements, often using a model as judge. Useful, but calibrate any judge against your own grades first (lesson 11.4).</p>
<h3>A test set for the exam</h3>
<p>At least 40 questions: 25 answerable from text, 5 from images or voice notes, and 10 unanswerable. For each answerable one, record the right chunk and the right answer.</p>
<div class="callout"><b>Numbers disagree?</b> High recall but low accuracy means the problem is generation (grounding, mixing sources). Low recall means the problem is retrieval. This split tells you exactly where to spend your time.</div>`,
  watch: [V.ragMetrics, V.ragEval, V.ragas],
  read: [R.ragPaper],
  exercise: `<p>Build the 40-question exam test set described above and write a script that reports recall@1, recall@3 and recall@5; answer accuracy; citation accuracy; and refusal accuracy. Run it on your assistant and record the baseline. Then make one improvement guided by the numbers and run it again.</p>`,
  problems: [
    {q: h`<p>Of 30 answerable questions, a right chunk is ranked 1st for 18, in positions 2–3 for 7, in positions 4–5 for 2, and not in the top 5 for 3. Compute recall@1, recall@3 and recall@5.</p>`,
     a: h`<p><b>recall@1</b> = 18/30 = <b>60%</b>. <b>recall@3</b> = (18 + 7)/30 = 25/30 ≈ <b>83%</b>. <b>recall@5</b> = (25 + 2)/30 = 27/30 = <b>90%</b>.</p><p>A reranker could lift recall@1 (the right chunk is often found but not first). The 3 complete misses need chunking or search fixes.</p>`},
    {q: h`<p>Recall@5 is 93%, but answer accuracy is only 70%. Where do you look first?</p>`,
     a: h`<p>At generation: for most wrong answers, the right chunk was retrieved. Read those cases and categorise them (lesson 11.5): ignoring the chunk, mixing two chunks, adding outside knowledge, misreading numbers. Then fix grounding and citations (lesson 15.3), and consider passing fewer, better-ranked chunks.</p>`},
  ],
  quiz: [
    {q: "recall@3 measures:", o: ["How fast search is", "How often a right chunk appears in the top 3 results", "Answer length", "Model accuracy"], a: 1, why: "It's a retrieval measure."},
    {q: "Low recall@5 means you should first fix:", o: ["The prompt wording", "Chunking and search", "The font", "The model's temperature"], a: 1, why: "If the source isn't retrieved, the answer can't be right."},
    {q: "Refusal accuracy is measured on:", o: ["Answerable questions", "Questions the documents don't cover", "Image questions only", "Nothing"], a: 1, why: "It checks the assistant doesn't guess."},
  ],
},
{
  id: "16-3", title: "Shipping the assistant and the exam write-up", mins: 12,
  objectives: [
    "Put the assistant in front of real users safely",
    "Keep documents up to date without breaking quality",
    "Publish a write-up with honest numbers",
  ],
  prereqs: "<p>Lessons 16.1–16.2.</p>",
  body: `
<h3>Before real users</h3>
<ul>
<li><b>Run the full test set</b> and check critical cases (wrong prices, invented policies) pass.</li>
<li><b>Show sources</b> with every answer, and a clear "talk to a person" option.</li>
<li><b>Log questions and answers</b> (without personal data) so you can read real usage weekly (lesson 22.4).</li>
<li><b>Start small:</b> a handful of real customers or staff for a week before sharing widely.</li>
</ul>
<h3>Keeping documents fresh</h3>
<p>Most RAG systems decay because documents go stale, not because the model changes. Agree with the owner who updates which document and how often. When a document changes: re-parse, re-chunk, re-index, and rerun your test set. Add a test question for anything that changed, like a new price.</p>
<h3>The write-up</h3>
<ol>
<li><b>What it does</b>, for whom, in two sentences, with a short demo video or screenshots.</li>
<li><b>The setup</b> and its monthly cost (₦ and $).</li>
<li><b>Results table:</b> recall@1/3/5, answer accuracy, citation accuracy, refusal accuracy, before and after your improvements.</li>
<li><b>Three real failures</b> and what you changed.</li>
<li><b>What real users asked</b> that you didn't expect.</li>
<li><b>Next steps:</b> what you'd improve with more time.</li>
</ol>
<div class="callout"><b>Numbers not as high as you'd like?</b> Publish them anyway, with the failures and fixes. A write-up showing 78% accuracy with a clear plan to improve is far more credible than one claiming 100% with no evidence.</div>`,
  watch: [V.ragCrash],
  read: [R.context],
  exercise: `<p>This is the Month 4 exam. Ship "Ask the shop" to at least 5 real users for a week, with sources shown and a handover option. Rerun your 40-question test set at the end, add 5 new questions from real usage, and publish the write-up described above with your numbers, failures and a demo.</p>`,
  problems: [
    {q: `<p>Two weeks after launch, answers about delivery fees are wrong. Nothing in your code changed. What's the likely cause and the long-term fix?</p>`,
     a: `<p>The delivery fees changed and the document wasn't updated (or was updated without re-indexing). Fix the document and re-index now. Long term: agree who owns each document, re-index automatically when a document changes, and add a test question for each price so stale answers fail the test set.</p>`},
    {q: `<p>Your write-up says "the assistant is 95% accurate". What's missing?</p>`,
     a: `<p>Accurate at what, measured how, on how many questions? Report retrieval and answer metrics separately, the test-set size and mix (answerable, image and voice, unanswerable), refusal accuracy, and real failure examples. "95% answer accuracy on 25 answerable text questions; 8 of 10 correct refusals" is honest and useful.</p>`},
  ],
  quiz: [
    {q: "The most common reason RAG answers degrade over time is:", o: ["The model gets tired", "Documents go stale or aren't re-indexed", "Too many users", "The font"], a: 1, why: "Knowledge changes; the index must follow."},
    {q: "Before sharing widely, you should:", o: ["Remove the handover option", "Test with a small group of real users first", "Hide the sources", "Skip the test set"], a: 1, why: "Small real trials catch real problems."},
    {q: "A credible write-up includes:", o: ["Only the best number", "Separate metrics, test-set details and real failures", "No numbers", "Marketing language"], a: 1, why: "Evidence and honesty build trust."},
  ],
},
];
