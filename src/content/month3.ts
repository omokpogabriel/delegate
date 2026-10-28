import type { Lesson, Resource } from "./types";
// Month 3 lessons (Week 10: local and open models).

const R: Record<string, Resource> = {
  hfCards: {title:"Model cards — Hugging Face Hub docs", url:"https://huggingface.co/docs/hub/en/model-cards"},
  hfGguf: {title:"GGUF — Hugging Face Hub docs", url:"https://huggingface.co/docs/hub/en/gguf"},
  hfOllama: {title:"Use Ollama with any GGUF model on Hugging Face", url:"https://huggingface.co/docs/hub/en/ollama"},
  ollamaOpenAI: {title:"OpenAI compatibility — Ollama docs", url:"https://docs.ollama.com/openai"},
  lmstudio: {title:"LM Studio docs", url:"https://lmstudio.ai/docs/app"},
  llamacpp: {title:"llama.cpp (GitHub)", url:"https://github.com/ggml-org/llama.cpp"},
  vllm: {title:"vLLM docs", url:"https://docs.vllm.ai"},
  springOllama: {title:"Ollama chat — Spring AI reference", url:"https://docs.spring.io/spring-ai/reference/api/chat/ollama-chat.html"},
  peft: {title:"PEFT quicktour — Hugging Face", url:"https://huggingface.co/docs/peft/main/en/quicktour"},
  loraCourse: {title:"LoRA fine-tuning — Hugging Face LLM Course", url:"https://huggingface.co/learn/llm-course/en/chapter11/4"}
};

export const week10: Lesson[] = [
{
  id:"10-1", title:"Open models and when to run them yourself", mins:12,
  body:`
<p>So far you've used <b>hosted</b> models: Claude, GPT and Gemini run on the provider's servers, and you send them your data over an API. <b>Open-weight</b> models are different: the trained model file itself is published, so you can download it and run it on your own laptop, server or cloud GPU.</p>
<h3>Open weights is not the same as open source</h3>
<p>"Open" covers a range. Some models are released under permissive licences (Apache 2.0, MIT) that let you do almost anything, including commercial use. Others have custom licences with conditions: usage limits for very large companies, restrictions on certain uses, or rules about naming derived models. Almost none publish their full training data. <b>Always read the licence before building a product on a model.</b></p>
<h3>The landscape</h3>
<p>Several organisations release strong open models, typically as a <em>family</em> in several sizes, for example 1B, 8B, 30B and 70B+ parameters (B = billion). Well-known families include Llama (Meta), Qwen (Alibaba), Mistral, Gemma (Google), DeepSeek and gpt-oss (OpenAI). The rankings change every few months, so don't memorise a "best model"; learn how to evaluate one for your task (Week 11).</p>
<p>Within a family you'll usually see:</p>
<ul>
<li><b>Base</b> models: raw next-token predictors. Useful for fine-tuning, not for chat.</li>
<li><b>Instruct</b> or <b>chat</b> models: fine-tuned to follow instructions. This is what you want almost every time.</li>
<li>Specialised variants: coding, reasoning ("thinking"), vision, embedding models.</li>
</ul>
<h3>When local or self-hosted makes sense</h3>
<ul>
<li><b>Data can't leave your control.</b> Health records, KYC documents, client source code under strict contracts. Running the model yourself means the data never goes to a third party.</li>
<li><b>Cost at high volume.</b> For simple, repetitive tasks (classification, extraction, tagging) at millions of calls, a small self-hosted model can be far cheaper than per-token API pricing.</li>
<li><b>Offline or unreliable connectivity.</b> Edge devices, field work, places where the internet drops.</li>
<li><b>Control.</b> No surprise model changes, rate limits or deprecations; you pin the exact version.</li>
<li><b>Fine-tuning.</b> You can adapt the weights to your task (lesson 10.5).</li>
</ul>
<h3>When it doesn't</h3>
<p>The best hosted models are still ahead on hard reasoning, long agentic tasks and complex coding. Running your own GPUs also has real costs: hardware, power, maintenance and your time. A common professional pattern is <b>hybrid</b>: hosted frontier models for hard tasks, small local models for high-volume simple ones and anything sensitive. Learning to make that split well is the real skill this week.</p>`,
  watch:[],
  read:[R.hfCards],
  exercise:`<p>List three tasks from your own work or clients. For each, decide: hosted, local, or hybrid? Write one line of reasoning per task covering data sensitivity, volume, quality needed and cost. Keep this; you'll test one of them in lesson 10.4.</p>`,
  quiz:[
    {q:"What does 'open-weight' mean?", o:["The training data is public","The trained model file is published for you to run","The model is free to use via API","The code is on GitHub"], a:1, why:"Open weights means you can download and run the model. Training data is usually not released."},
    {q:"Which variant do you want for a chat or instruction-following app?", o:["Base","Instruct / chat","Embedding","Any of them"], a:1, why:"Instruct models are fine-tuned to follow instructions; base models just continue text."},
    {q:"A clinic wants AI triage notes but patient data must not leave their servers. Best starting point?", o:["Send it to the strongest hosted API","A self-hosted open model","No AI at all","Paste it into a chat app"], a:1, why:"Self-hosting keeps the data under the clinic's control, which is the hard requirement here."}
  ]
},
{
  id:"10-2", title:"Finding and judging models on Hugging Face", mins:14,
  body:`
<p><b>Hugging Face</b> is where open models are published and shared, like GitHub for model files. Hundreds of thousands of models are there, most of them low quality or experimental. Knowing how to filter is the skill.</p>
<h3>Read the model card</h3>
<p>Every model repo has a <b>model card</b> (its README). Before downloading anything, check:</p>
<ol>
<li><b>Who published it.</b> Prefer the original organisation (for example <code>meta-llama</code>, <code>Qwen</code>, <code>mistralai</code>, <code>google</code>) or well-known community packagers. An unknown account re-uploading a popular model is a risk.</li>
<li><b>Licence.</b> Shown in the sidebar. Some models are <em>gated</em>: you must accept the licence on the website before you can download.</li>
<li><b>Intended use and limitations.</b> Languages supported, context length, what it's bad at.</li>
<li><b>Prompt format.</b> Instruct models expect a specific chat template. Tools like Ollama and LM Studio usually handle this for you, but if output looks garbled, the template is the first suspect.</li>
<li><b>Signals of quality.</b> Downloads, likes, recent updates, and whether people discuss it in the Community tab.</li>
</ol>
<h3>File formats</h3>
<ul>
<li><b>safetensors</b>: the standard format for full-precision weights, used by Python libraries such as Transformers and by vLLM. Large: an 8B model is about 16 GB.</li>
<li><b>GGUF</b>: a single-file format designed for running on ordinary computers with llama.cpp, Ollama and LM Studio. Usually <em>quantised</em> (compressed), so much smaller. This is what you'll use on a laptop.</li>
</ul>
<p>Original publishers often release only safetensors. Community packagers then publish GGUF versions in several quantisation levels. Search for the model name plus "GGUF".</p>
<h3>Reading a GGUF repo</h3>
<p>A GGUF repo usually contains many files of the same model at different quantisation levels, named like <code>Q8_0</code>, <code>Q6_K</code>, <code>Q4_K_M</code>, <code>Q3_K_S</code>. The number is roughly bits per weight. Lower means smaller and faster, with some loss of quality. <code>Q4_K_M</code> is a common default balance. Lesson 10.3 explains how to choose.</p>
<h3>Downloading</h3>
<p>You rarely need to download files by hand. Ollama can pull a GGUF straight from Hugging Face:</p>
<pre>ollama run hf.co/{username}/{repository}:{quantization}

# example
ollama run hf.co/bartowski/Llama-3.2-3B-Instruct-GGUF:Q4_K_M</pre>
<p>LM Studio has a built-in Hugging Face search. For Python work, the <code>huggingface_hub</code> library and its command-line tool download whole repos.</p>
<h3>Security</h3>
<p>Model files can carry risks. Prefer safetensors and GGUF over older pickle-based formats (<code>.bin</code>, <code>.pt</code>, <code>.pkl</code>), which can run arbitrary code when loaded. Stick to reputable publishers.</p>`,
  watch:[],
  read:[R.hfCards, R.hfGguf, R.hfOllama],
  exercise:`<p>Pick a task from lesson 10.1. On Hugging Face, find three candidate instruct models of 8B parameters or less that could do it. For each, record: publisher, licence (and whether commercial use is allowed), context length, languages, and whether a GGUF version exists from a reputable packager. Choose one to run in 10.4 and write down why.</p>`,
  quiz:[
    {q:"Which format is designed for running quantised models on ordinary computers?", o:["safetensors","GGUF","CSV","pickle"], a:1, why:"GGUF is the single-file format used by llama.cpp, Ollama and LM Studio."},
    {q:"In a file named Q4_K_M, what does the 4 roughly indicate?", o:["Version 4","About 4 bits per weight","4 GB exactly","4 languages"], a:1, why:"The number is roughly bits per weight. Lower is smaller and faster, with some quality loss."},
    {q:"Why prefer safetensors or GGUF over .pt or .pkl files?", o:["They're newer","Pickle-based formats can execute code when loaded","They're always smaller","Hugging Face requires it"], a:1, why:"Pickle files can run arbitrary code on load, which is a security risk."}
  ]
},
{
  id:"10-3", title:"Hardware, memory and quantisation", mins:12,
  body:`
<p>The first question with any local model is: <b>will it fit?</b> The answer depends almost entirely on memory.</p>
<h3>The rule of thumb</h3>
<p>Model memory ≈ <b>number of parameters × bytes per parameter</b>, plus overhead.</p>
<ul>
<li>16-bit (unquantised): 2 bytes per parameter. An 8B model needs about <b>16 GB</b>.</li>
<li>8-bit: 1 byte. The same model needs about <b>8 GB</b>.</li>
<li>4-bit: half a byte. About <b>4.5–5 GB</b>.</li>
</ul>
<p>Then add headroom: roughly 10–20% for the runtime, plus memory for the <b>context</b>. Every token in the context window uses memory (the "KV cache"), so a long context on a big model can need several extra gigabytes. The file size of a GGUF is a good first estimate of how much memory the weights need.</p>
<h3>Where the memory comes from</h3>
<ul>
<li><b>NVIDIA GPU:</b> the fastest option. The model must fit in the GPU's VRAM (often 8–24 GB on consumer cards). Tools can split a model between GPU and system RAM, but it slows down sharply.</li>
<li><b>Apple Silicon Macs:</b> CPU and GPU share "unified memory", so a 32 GB or 64 GB Mac can run surprisingly large models at usable speed.</li>
<li><b>CPU only, with system RAM:</b> works, but slowly. Fine for small models (1–4B) and for testing.</li>
</ul>
<h3>Choosing a quantisation</h3>
<p>Quantisation stores weights with fewer bits. Quality drops gradually from 8-bit down to about 4-bit, then faster below that. Practical guidance:</p>
<ul>
<li>Start with <b>Q4_K_M</b>. It's the usual sweet spot.</li>
<li>If you have spare memory, try <b>Q6_K</b> or <b>Q8_0</b> and see whether quality improves on <em>your</em> task.</li>
<li>Generally, a bigger model at 4-bit beats a smaller model at 8-bit, if it fits.</li>
<li>Below 3-bit, expect noticeable damage, especially on reasoning, maths and code.</li>
</ul>
<h3>Speed</h3>
<p>Speed is measured in tokens per second. For interactive chat, around 10+ tokens per second feels usable; below 5 is painful. Speed falls as the model gets bigger and as context grows. Measure on your own machine; published numbers rarely match your setup.</p>
<h3>Context length settings</h3>
<p>Local runtimes often default to a much shorter context window than the model supports, to save memory. If a model seems to "forget" the start of a long document, check the context length setting before blaming the model.</p>`,
  watch:[],
  read:[R.hfGguf],
  exercise:`<p>Write down your machine's RAM, GPU and VRAM (or unified memory on a Mac). Using the rule of thumb, calculate the largest model you could run at 4-bit and at 8-bit, leaving 25% headroom. Then check: of the three models you shortlisted in 10.2, which fit?</p>`,
  quiz:[
    {q:"Roughly how much memory do the weights of an 8B model need at 4-bit?", o:["About 1 GB","About 4.5–5 GB","About 16 GB","About 64 GB"], a:1, why:"8 billion parameters × 0.5 bytes ≈ 4 GB, plus some overhead."},
    {q:"Why can a long context need extra memory?", o:["It doesn't","Every token in context uses memory in the KV cache","Longer prompts are stored twice","The model re-downloads"], a:1, why:"The KV cache grows with context length, so long contexts need more memory."},
    {q:"Which is usually better if both fit in memory?", o:["A small model at 8-bit","A larger model at 4-bit","They're always equal","Neither works"], a:1, why:"A bigger model at 4-bit generally outperforms a smaller one at 8-bit."}
  ]
},
{
  id:"10-4", title:"Running models: Ollama, LM Studio, llama.cpp and vLLM", mins:15,
  body:`
<p>Several tools run open models. They differ in who they're for.</p>
<ul>
<li><b>Ollama</b>: command-line tool and background server. Simple to install, pulls models with one command, and exposes an API your code can call. The default choice for developers.</li>
<li><b>LM Studio</b>: desktop app with a graphical interface, built-in model search, a chat window and a local API server. Good for exploring and comparing models quickly.</li>
<li><b>llama.cpp</b>: the C/C++ engine that many tools (including Ollama and LM Studio) build on. Use it directly when you want maximum control or a lean server (<code>llama-server</code>).</li>
<li><b>vLLM</b>: a high-throughput server for GPUs, built to serve many users at once in production. Uses safetensors models, not GGUF. Use it when you're deploying to a cloud GPU for real traffic.</li>
</ul>
<h3>The quick start with Ollama</h3>
<pre># pull and chat with a model from Ollama's library
ollama run llama3.2

# or any GGUF from Hugging Face
ollama run hf.co/bartowski/Llama-3.2-3B-Instruct-GGUF:Q4_K_M

# see what's downloaded
ollama list</pre>
<h3>Calling it from code</h3>
<p>Ollama runs a local server and offers an <b>OpenAI-compatible API</b> at <code>http://localhost:11434/v1/</code>. That means most code written for the OpenAI API works by changing the base URL:</p>
<pre>from openai import OpenAI

client = OpenAI(base_url="http://localhost:11434/v1/", api_key="ollama")  # key ignored locally
resp = client.chat.completions.create(
    model="llama3.2",
    messages=[{"role": "user", "content": "Extract the plate number: 'Car LND-123-AB was flagged'"}],
)
print(resp.choices[0].message.content)</pre>
<p>LM Studio, llama.cpp's server and vLLM offer the same kind of OpenAI-compatible endpoint. Design your code against that interface and you can swap between local and hosted models with configuration, not rewrites.</p>
<h3>From Java</h3>
<p>Spring AI has a dedicated Ollama integration: add the Ollama starter, set the base URL and model name in <code>application.properties</code>, and use the same <code>ChatClient</code> you'd use with a hosted model. That makes it easy to run the same service against a local model in development and a hosted one in production, or the other way round.</p>
<h3>Things that trip people up</h3>
<ul>
<li><b>First request is slow</b> while the model loads into memory. Later requests are faster.</li>
<li><b>Short default context.</b> Raise it if you're sending long documents (see 10.3).</li>
<li><b>Structured output and tool calling</b> are less reliable on small models. Test them; don't assume.</li>
<li><b>Exposing the server.</b> By default these servers listen only on your machine. If you open them to a network, put authentication in front; they have none by default.</li>
</ul>`,
  watch:[],
  read:[R.ollamaOpenAI, R.lmstudio, R.llamacpp, R.vllm, R.springOllama],
  exercise:`<p>Week 10 build. Install Ollama and run the model you chose in 10.2. Write a small script (Python, or Spring Boot if you prefer) that sends the same 10 inputs for your chosen task to (1) your local model and (2) a hosted model, using the OpenAI-compatible interface for both. Record for each: correct or not, time taken, and cost (zero for local, per-token for hosted). Keep the results; Week 11 turns this into a proper eval.</p>`,
  quiz:[
    {q:"Which tool suits serving many users at once from a cloud GPU?", o:["LM Studio","vLLM","A spreadsheet","Ollama's chat window"], a:1, why:"vLLM is built for high-throughput production serving on GPUs."},
    {q:"Why design code against the OpenAI-compatible interface?", o:["It's required by law","You can swap local and hosted models by changing configuration","It's faster","It's the only API"], a:1, why:"Most local and hosted providers support it, so switching becomes a config change."},
    {q:"You expose your local model server to the internet. What's missing by default?", o:["Nothing","Authentication","A GPU","A model"], a:1, why:"Local servers usually have no auth. Put a gateway or proxy with authentication in front."}
  ]
},
{
  id:"10-5", title:"Fine-tuning with LoRA: when and how", mins:15,
  body:`
<p><b>Fine-tuning</b> means continuing to train a model on your own examples so it gets better at your specific task. With open weights you can do this yourself.</p>
<h3>First: do you need it?</h3>
<p>Fine-tuning is often the wrong tool. Try these first, in order:</p>
<ol>
<li><b>Better prompting</b>, with clear instructions and examples (Month 1).</li>
<li><b>Retrieval (RAG)</b> if the model needs your <em>knowledge</em>: documents, policies, product data (Month 4). Fine-tuning is a poor way to teach facts; they're hard to update and the model may still invent details.</li>
<li><b>A bigger or better model.</b></li>
</ol>
<p>Fine-tuning earns its place when you need a <b>consistent behaviour, format or style</b> that prompting can't reliably produce, or when you want a <b>small, cheap model to match a big one</b> on a narrow, high-volume task (for example, classifying transaction descriptions or extracting fields from one document type).</p>
<h3>LoRA in one paragraph</h3>
<p>Full fine-tuning updates every weight and needs serious GPU memory. <b>LoRA</b> (Low-Rank Adaptation) freezes the original model and trains a small set of extra weights, called an <em>adapter</em>, often under 1% of the model's size. It's much cheaper and faster, and the adapter file is small enough to share or swap. <b>QLoRA</b> goes further by loading the frozen base model in 4-bit, so fine-tuning a 7–8B model fits on a single consumer or free-tier cloud GPU.</p>
<h3>What you need</h3>
<ul>
<li><b>Data.</b> Usually a few hundred to a few thousand high-quality input/output examples in the model's chat format. Quality beats quantity: 500 clean, consistent examples outperform 5,000 messy ones.</li>
<li><b>A held-out test set</b> the model never trains on, so you can measure honestly.</li>
<li><b>A GPU.</b> A cloud notebook (Colab, Kaggle) or a rented GPU is enough for small models.</li>
<li><b>Tools.</b> Hugging Face's PEFT library is the standard way to do LoRA in Python. Higher-level tools build on it to reduce memory use and setup.</li>
</ul>
<h3>The workflow</h3>
<ol>
<li>Measure the base model on your test set. This is your baseline.</li>
<li>Prepare training data in the chat template the model expects.</li>
<li>Train a LoRA adapter. Start small: few epochs, default settings.</li>
<li>Measure again on the same test set. Did it actually beat the baseline <em>and</em> the best prompted version?</li>
<li>Merge the adapter into the model or load it alongside, convert to GGUF if you want to run it in Ollama, and deploy.</li>
</ol>
<h3>Common failures</h3>
<ul>
<li><b>Overfitting:</b> great on training examples, worse on new ones. Your held-out set catches this.</li>
<li><b>Forgetting:</b> the model gets better at your task and worse at general instructions.</li>
<li><b>Wrong chat template:</b> training data formatted differently from how the model is prompted later. Output becomes erratic.</li>
</ul>`,
  watch:[],
  read:[R.peft, R.loraCourse],
  exercise:`<p>Optional stretch for this week: follow the Hugging Face LoRA chapter in a free cloud notebook and fine-tune a small model (1–3B) on 200+ examples for one narrow task. Compare it against the base model and your best prompt on a held-out set of 30 examples. Even if it doesn't win, write up what you learned; a fine-tune that loses to a good prompt is a useful result.</p>`,
  quiz:[
    {q:"A model needs to know your company's 300-page policy manual. Best approach?", o:["Fine-tune on the manual","Retrieval (RAG) over the manual","A higher temperature","Ask it to memorise it"], a:1, why:"Fine-tuning is poor at teaching facts. Retrieval supplies the right text when needed and is easy to update."},
    {q:"What does LoRA train?", o:["Every weight in the model","A small adapter while the base model stays frozen","Only the tokenizer","Nothing"], a:1, why:"LoRA adds and trains a small set of extra weights, keeping the original frozen."},
    {q:"Why keep a held-out test set?", o:["To train faster","To measure honestly on examples the model never saw","It's a legal requirement","To reduce file size"], a:1, why:"Without unseen examples you can't tell real improvement from memorisation."}
  ]
}
];
