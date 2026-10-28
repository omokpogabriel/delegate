import type { Lesson, Resource } from "./types";
// Month 1 lessons. Each week number maps to an ordered list of lessons.

const V: Record<string, Resource> = {
  karpathyIntro: {title:"Intro to Large Language Models — Andrej Karpathy", len:"1 hr", url:"https://www.youtube.com/watch?v=zjkBMFhNj_g"},
  karpathyDeep: {title:"Deep Dive into LLMs like ChatGPT — Andrej Karpathy", len:"3.5 hr", url:"https://www.youtube.com/watch?v=7xTGNNLPyMI"},
  briefly: {title:"Large Language Models explained briefly — 3Blue1Brown", len:"8 min", url:"https://www.youtube.com/watch?v=LPZh9BOjkQs"},
  transformers: {title:"How transformers and attention work (talk) — 3Blue1Brown", len:"1 hr", url:"https://www.youtube.com/watch?v=KJtZARuO3JY"}
};
const R: Record<string, Resource> = {
  tokens: {title:"What are tokens and how to count them — OpenAI Help", url:"https://help.openai.com/en/articles/4936856-what-are-tokens-and-how-to-count-them"},
  halluc: {title:"Hallucinations in code are the least dangerous form of LLM mistakes — Simon Willison", url:"https://simonwillison.net/2025/Mar/2/hallucinations-in-code/"},
  promptOverview: {title:"Prompt engineering overview — Claude docs", url:"https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview"},
  clearDirect: {title:"Be clear and direct — Claude docs", url:"https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/be-clear-and-direct"},
  promptBlog: {title:"Best practices for prompt engineering — Claude blog", url:"https://claude.com/blog/best-practices-for-prompt-engineering"},
  promptTutorial: {title:"Prompt engineering interactive tutorial — Anthropic (GitHub)", url:"https://github.com/anthropics/prompt-eng-interactive-tutorial"},
  ccQuick: {title:"Claude Code quickstart", url:"https://code.claude.com/docs/en/quickstart"},
  ccHow: {title:"How Claude Code works", url:"https://code.claude.com/docs/en/how-claude-code-works"},
  ccBest: {title:"Claude Code best practices", url:"https://code.claude.com/docs/en/best-practices"},
  cc101: {title:"Claude Code 101 (free course) — Claude Academy", url:"https://academy.claude.com/courses/claude-code-101"},
  codexCli: {title:"Codex CLI — OpenAI docs", url:"https://developers.openai.com/codex/cli"}
};

export const week1: Lesson[] = [
{
  id:"1-1", title:"What a language model actually is", mins:12,
  body:`
<p>A large language model (LLM) does one thing: given some text, it predicts what text is likely to come next. It does this one small piece at a time, adds that piece to the text, and predicts again. Everything you will see a model do, from answering questions to writing code to running as an agent, is built on that loop.</p>
<h3>How it learns to predict</h3>
<p>Models are built in stages:</p>
<ol>
<li><b>Pre-training.</b> The model reads a huge amount of text from the internet, books and code, and is trained to guess the next piece of each passage. To get good at that, it has to absorb grammar, facts, reasoning patterns and programming languages. The result is called a <em>base model</em>. It is knowledgeable but not helpful: ask it a question and it might continue with three more questions, because that is what text on the internet often does.</li>
<li><b>Fine-tuning.</b> The base model is then trained on many examples of conversations between a user and a helpful assistant. Now it learns to <em>answer</em> rather than just continue.</li>
<li><b>Reinforcement learning.</b> Finally, the model practises tasks and is rewarded for good results: answers people prefer, code that passes tests, maths that checks out. This is where much of the reasoning ability of modern models comes from.</li>
</ol>
<h3>What this means for you</h3>
<p>Three practical consequences follow, and the rest of this course keeps coming back to them:</p>
<ul>
<li><b>The model only knows what it was trained on, plus what you give it.</b> It has a training cutoff date. Anything after that, and anything private to you (your codebase, your clients, your business rules), it does not know unless you put it in front of it.</li>
<li><b>It produces what is <em>likely</em>, not what is <em>true</em>.</b> Usually these are the same. Lesson 1.4 is about when they are not.</li>
<li><b>The text you give it shapes everything it produces.</b> Since it is always predicting a continuation of your input, the quality and clarity of that input matter enormously. That is the whole of Week 2.</li>
</ul>
<h3>Chat apps vs the model</h3>
<p>When you use Claude, ChatGPT or Gemini in an app, you are not talking to the raw model. The app adds a hidden system prompt, tools (web search, code execution, file reading), memory and safety layers. The same model can feel very different in different apps, and very different again when you call it directly through an API. Keep that distinction in mind: later in the course you will build these layers yourself.</p>`,
  watch:[V.briefly, V.karpathyIntro],
  read:[],
  exercise:`<p>Watch the 8-minute 3Blue1Brown video, then the first 20 minutes of Karpathy's talk. Then, without looking anything up, write five sentences explaining to a non-technical friend how a chatbot produces an answer. Save it; you'll publish a polished version at the end of the week.</p>`,
  quiz:[
    {q:"At its core, what is a language model trained to do?", o:["Look up answers in a database","Predict the next piece of text","Search the internet for each question","Follow a fixed set of rules"], a:1, why:"Everything else is built on next-token prediction, repeated one piece at a time."},
    {q:"Why might a base model answer a question with more questions?", o:["It is broken","It has not yet been fine-tuned to act as an assistant","It lacks internet access","Its temperature is too low"], a:1, why:"A base model just continues text in the style it has seen. Fine-tuning teaches it to answer."},
    {q:"You ask a model about a library released last month and it gives a confident but wrong answer. The most likely reason is:", o:["The library is too complex","It is after the model's training cutoff","The model is being lazy","You used the wrong language"], a:1, why:"Models only know what was in their training data, unless you give them more context or tools."}
  ]
},
{
  id:"1-2", title:"Tokens and the context window", mins:12,
  body:`
<p>Models do not read characters or words. They read <b>tokens</b>: chunks of text that are often a whole short word, part of a longer word, or a piece of punctuation. In English, one token is roughly three-quarters of a word, so 1,000 words is about 1,300 tokens. Code, numbers and non-English languages usually use more tokens per word.</p>
<h3>Why tokens matter</h3>
<ul>
<li><b>Cost.</b> API pricing is per token, usually with separate prices for input (what you send) and output (what the model writes). Output is typically several times more expensive.</li>
<li><b>Speed.</b> The model writes one token at a time, so long answers take longer.</li>
<li><b>Odd mistakes.</b> Because the model sees chunks, not letters, tasks like counting characters or reversing a word can trip it up. It's not a reasoning failure; it can't see the letters directly.</li>
</ul>
<h3>The context window</h3>
<p>The <b>context window</b> is everything the model can see at once: the system prompt, the conversation so far, any files or documents, tool results, and its own reply. It is measured in tokens. Modern models have large windows, often hundreds of thousands of tokens, but three things are worth knowing:</p>
<ol>
<li><b>The model has no memory outside the window.</b> Every reply is generated from scratch by reading the whole window again. "Memory" features in apps work by putting saved notes back into the window.</li>
<li><b>When the window fills up, something has to go.</b> Apps and agents either cut old messages or <em>compact</em> them into a summary. Details get lost. You'll study this properly in Month 4.</li>
<li><b>More context is not always better.</b> A model given a focused 2-page brief usually does better than one given 200 pages with the important part buried in the middle. Irrelevant context is noise.</li>
</ol>
<h3>The habit to build</h3>
<p>Start thinking of every interaction as "what is in the window right now?" When a model gets something wrong, ask: did it actually have the information it needed? Was the important part clear, or buried? Most failures you'll meet in this course come down to the window.</p>`,
  watch:[V.karpathyIntro],
  read:[R.tokens],
  exercise:`<p>Take a paragraph of English, a short piece of code, and a sentence in Yoruba, Igbo, Hausa or Pidgin. Use any online tokenizer (search "LLM tokenizer") to count the tokens in each. Write down the tokens-per-word ratio for each and one sentence on what it means for cost if you built a product for Nigerian users.</p>`,
  quiz:[
    {q:"Roughly how many tokens is 750 English words?", o:["About 250","About 1,000","About 5,000","Exactly 750"], a:1, why:"A token is roughly three-quarters of a word in English, so 750 words is about 1,000 tokens."},
    {q:"How does a chat app 'remember' things from an earlier conversation?", o:["The model updates its own training","Saved notes are put back into the context window","The model stores memories in its weights after each chat","It doesn't; that's impossible"], a:1, why:"The model itself is fixed. Memory works by putting relevant text back into what the model sees."},
    {q:"You paste a 300-page document and ask about one clause. The answer is vague. A good first fix is:", o:["Paste the document twice","Give only the relevant section, clearly marked","Ask in capital letters","Switch to a smaller model"], a:1, why:"Focused, relevant context almost always beats a huge window with the key part buried."}
  ]
},
{
  id:"1-3", title:"Sampling, temperature and why answers vary", mins:10,
  body:`
<p>At each step, the model doesn't output one token. It outputs a probability for <em>every</em> possible next token. Something then has to pick one. That picking is called <b>sampling</b>.</p>
<h3>Temperature</h3>
<p><b>Temperature</b> controls how adventurous the pick is:</p>
<ul>
<li><b>Low temperature (near 0):</b> almost always picks the most likely token. Output is focused and repeatable. Good for extraction, classification, code and anything with a right answer.</li>
<li><b>Higher temperature (around 1):</b> sometimes picks less likely tokens. Output is more varied. Good for brainstorming, naming and creative writing.</li>
</ul>
<p>Even at temperature 0 you may see small differences between runs, because of how calculations are batched on the hardware. Don't build anything that depends on byte-for-byte identical output.</p>
<h3>Why this matters more than it seems</h3>
<p>Because output varies, <b>one good result proves very little</b>. A prompt that worked once may fail one time in five. This is the single most common mistake people make when judging AI: they try something once, it works, and they assume it always will. Or it fails once and they decide the model "can't do it".</p>
<p>The professional habit is to run things several times and look at the spread. That habit grows into <em>evals</em> in Month 3, where you'll run a prompt against 30+ test cases and measure a success rate instead of trusting a single run.</p>
<h3>You often can't set it</h3>
<p>Chat apps choose the sampling settings for you. Agents and newer reasoning models often fix them too. You'll get full control when you call models through the API, which you'll do in Month 3. For now, the lesson is conceptual: variation is built in, so judge on several runs.</p>`,
  watch:[V.briefly],
  read:[],
  exercise:`<p>This is the Week 1 build. In a chat app, ask the same open question five times in fresh chats (for example, "Suggest a name and one-line pitch for a Lagos logistics startup"). Then ask a factual question five times ("What is 17% of 2,350?"). Log all ten answers in a table. Write three sentences on where variation helped and where it would be dangerous.</p>`,
  quiz:[
    {q:"Which setting suits extracting invoice fields into JSON?", o:["High temperature","Low temperature","Temperature doesn't matter","Maximum temperature"], a:1, why:"Extraction has a right answer, so you want focused, repeatable output."},
    {q:"A prompt worked perfectly once. What can you conclude?", o:["It will always work","Very little until you've tried it several times","The model is deterministic","It needs no testing"], a:1, why:"Output varies between runs. Judge on many runs, not one."},
    {q:"What does the model actually output at each step?", o:["A single word","A probability for every possible next token","A full sentence","A database query"], a:1, why:"Sampling then picks one token from that probability distribution."}
  ]
},
{
  id:"1-4", title:"Hallucinations and how to catch them", mins:14,
  body:`
<p>A <b>hallucination</b> is when a model states something false with the same confidence it states true things: a made-up citation, a library function that doesn't exist, a wrong statistic, an invented court case.</p>
<h3>Why it happens</h3>
<p>Remember lesson 1.1: the model produces what is <em>likely</em>, not what is <em>true</em>. A plausible-looking reference has the right shape, so the model produces it, whether or not it exists. Models have got much better at saying "I don't know", but the risk never drops to zero. It is highest when:</p>
<ul>
<li>you ask about obscure or very specific facts (exact figures, names, dates, quotes, URLs);</li>
<li>you ask about things after the training cutoff;</li>
<li>the question assumes something false ("Why did Nigeria switch to driving on the left in 2015?");</li>
<li>you push it to give an answer when the honest answer is "unclear".</li>
</ul>
<h3>How to defend against it</h3>
<ol>
<li><b>Give it the source.</b> Paste the document, or give it a search tool, and ask it to answer only from that. Grounded answers hallucinate far less.</li>
<li><b>Ask for evidence you can check.</b> Quotes from the provided text, links, file names, line numbers. Then actually check a sample.</li>
<li><b>Give it permission not to know.</b> "If the document doesn't say, reply 'not stated'." Without this, models feel pressure to produce something.</li>
<li><b>Let reality check it.</b> For code, this is the big one: run it. A made-up function fails immediately when you run the code. Simon Willison's article in the reading list argues that this makes code hallucinations the <em>least</em> dangerous kind. The dangerous mistakes are the ones that run fine and are subtly wrong.</li>
</ol>
<h3>The mindset</h3>
<p>Treat model output like work from a fast, well-read new hire who never admits uncertainty unless told it's allowed. You wouldn't send their first draft to a client unchecked. But you also wouldn't refuse to use them. The skill this whole course builds is making checking cheap: tests, sources, evals, review. That is what lets you trust agents with real work.</p>`,
  watch:[V.karpathyIntro],
  read:[R.halluc],
  exercise:`<p>Try to make a model hallucinate, then fix it. (1) Ask a chat model for three academic papers on mobile money adoption in Nigeria, with authors, years and links. Check every one. (2) Ask again, but add: "Only include papers you are confident exist. If unsure, say so." (3) If the app has web search, ask a third time with search on. Record how many real vs fake results each version gave. Add the worst case to your failure log.</p>`,
  quiz:[
    {q:"Why do models hallucinate?", o:["They are designed to lie","They produce likely-looking text, which isn't always true","They have viruses","They only hallucinate on purpose"], a:1, why:"Plausible and true usually overlap, but not always."},
    {q:"Which is the strongest defence against hallucinated code?", o:["Asking it to be careful","Running the code and tests","Using capital letters","Asking twice"], a:1, why:"Execution exposes made-up functions immediately. Subtle logic errors still need tests and review."},
    {q:"'Why did Company X shut down in 2024?' (it didn't). What makes this risky?", o:["It's too long","It contains a false assumption","It mentions a year","It's a question"], a:1, why:"Questions built on false premises push the model to invent an explanation."}
  ]
}
];

export const week2: Lesson[] = [
{
  id:"2-1", title:"A prompt is a spec", mins:10,
  body:`
<p>Most bad AI results come from under-specified prompts. "Write a function to validate users" leaves the model to guess the language, the rules, the edge cases, the style and what "validate" means. It guesses something reasonable and generic, and you're disappointed.</p>
<h3>The new-hire test</h3>
<p>Anthropic's prompting guide suggests a simple check: imagine handing your prompt to a smart new colleague who knows nothing about your project. Would they have enough to do the job well, first time? If they'd need to ask five questions, your prompt is missing five answers.</p>
<p>This is the same skill as writing a good ticket, a good brief for a contractor, or good acceptance criteria. If you've led a team, you already have it. You just need to apply it to a reader who will never ask a clarifying question unless you invite it.</p>
<h3>Vague vs specific</h3>
<p><b>Vague:</b> "Summarise this meeting transcript."</p>
<p><b>Specific:</b> "Summarise this sales call transcript for the account manager who wasn't on the call. Give: the client's main objection, any numbers they mentioned, what we promised, and the agreed next step with its date. Use short bullet points. If something wasn't discussed, write 'not discussed'."</p>
<p>The second takes thirty seconds longer to write and saves you a round of back-and-forth, every time.</p>
<h3>Say why, not just what</h3>
<p>Models follow instructions better when they understand the reason. "Never use ellipses" is a rule. "This text will be read aloud by a text-to-speech engine, so never use ellipses, because it can't pronounce them" is a rule the model can generalise from. It will also avoid other things a speech engine can't handle.</p>`,
  watch:[],
  read:[R.clearDirect, R.promptBlog],
  exercise:`<p>Find five prompts you've actually used recently (from your chat history, or write down five tasks you do often). Rewrite each one to pass the new-hire test: audience, goal, constraints, format, and what to do when information is missing. Keep both versions; you'll compare outputs in lesson 2.4.</p>`,
  quiz:[
    {q:"What is the 'new-hire test' for a prompt?", o:["Whether a new model can run it","Whether a smart newcomer with no context could do the job from it","Whether it's under 100 words","Whether HR approved it"], a:1, why:"If a capable newcomer would need to ask questions, the prompt is missing information."},
    {q:"Why explain the reason behind an instruction?", o:["It makes the prompt longer","The model can generalise to cases you didn't list","Models ignore reasons","It reduces cost"], a:1, why:"Understanding the purpose lets the model handle situations your rules didn't cover."},
    {q:"Which skill transfers most directly to prompting?", o:["Typing speed","Writing clear tickets and briefs","Memorising syntax","Graphic design"], a:1, why:"A prompt is a brief for a capable worker who won't ask follow-up questions."}
  ]
},
{
  id:"2-2", title:"The anatomy of a strong prompt", mins:12,
  body:`
<p>Strong prompts tend to have the same parts. Not every prompt needs all of them, but it's worth checking each one:</p>
<ol>
<li><b>Role and audience.</b> Who is the model acting as, and who is the output for? "You're reviewing a pull request for a fintech backend; the reader is a senior engineer."</li>
<li><b>Context.</b> The background the model can't know: your stack, your business rules, what's been tried, what the data looks like.</li>
<li><b>Task.</b> The specific thing to do, stated plainly. One main task per prompt works best.</li>
<li><b>Constraints.</b> What must or must not happen. Libraries to use or avoid, length limits, tone, things not to change.</li>
<li><b>Output format.</b> Exactly what you want back: a table, JSON with given fields, a diff, three options, under 200 words.</li>
<li><b>Handling gaps.</b> What to do when information is missing or ambiguous: ask, flag it, or make a stated assumption.</li>
</ol>
<h3>Put long material first, the question last</h3>
<p>When your prompt includes a long document, put the document at the top and your instructions and question at the bottom. Models generally handle this ordering better.</p>
<h3>Ask for the format you'll actually use</h3>
<p>If the output feeds code, ask for JSON and give the exact field names. If it goes to a client, ask for the tone and length you'd send. Reformatting output by hand is wasted time, and "parse whatever it gives me" code breaks.</p>
<h3>A worked example</h3>
<p><em>Role:</em> You're a backend engineer reviewing an API design.<br>
<em>Context:</em> Spring Boot service for a Nigerian lending app. Customers verify identity with BVN before getting a loan. Here's the current endpoint list: [paste].<br>
<em>Task:</em> Identify security risks in how BVN data is handled.<br>
<em>Constraints:</em> Focus on data exposure and access control; ignore styling and naming.<br>
<em>Format:</em> A table with columns: endpoint, risk, severity (high/medium/low), fix.<br>
<em>Gaps:</em> If you need to know how auth works and it isn't shown, list that as an open question instead of guessing.</p>`,
  watch:[],
  read:[R.promptOverview],
  exercise:`<p>Take the two most important prompts from your lesson 2.1 rewrite and restructure them using all six parts. Mark each part with a heading so you can see what's there and what's missing.</p>`,
  quiz:[
    {q:"Where should a long document go in a prompt?", o:["At the end, after the question","At the top, with instructions and question after it","In the middle","It must be split into many prompts"], a:1, why:"Long material first, then instructions and the question, generally works best."},
    {q:"Output will be parsed by your code. What should you ask for?", o:["A friendly paragraph","JSON with exact field names","Markdown with headings","Whatever it prefers"], a:1, why:"Specify the exact machine-readable format your code expects."},
    {q:"Why include 'what to do if information is missing'?", o:["To make the prompt longer","So the model flags gaps instead of inventing answers","Models require it","To save tokens"], a:1, why:"Without permission to say 'not stated', models tend to fill gaps with guesses."}
  ]
},
{
  id:"2-3", title:"Examples and structure", mins:10,
  body:`
<p>Two techniques make prompts much more reliable: showing examples, and separating the parts of the prompt clearly.</p>
<h3>Examples (few-shot prompting)</h3>
<p>Describing what you want is good. <b>Showing</b> it is often better. Two or three examples of input and ideal output teach format, tone and judgement faster than paragraphs of rules.</p>
<p>Make examples varied. If all three examples are short and positive, the model will learn "short and positive" whether you meant to teach that or not. Include at least one tricky case, such as one where the right answer is "not stated", or one edge case.</p>
<h3>Clear structure with tags</h3>
<p>When a prompt mixes instructions, a document, examples and data, the model can confuse which is which. Wrap each part in labelled tags:</p>
<pre>&lt;instructions&gt;
Classify each support ticket as billing, technical or account.
&lt;/instructions&gt;

&lt;examples&gt;
&lt;example&gt;
&lt;ticket&gt;I was charged twice this month&lt;/ticket&gt;
&lt;label&gt;billing&lt;/label&gt;
&lt;/example&gt;
&lt;/examples&gt;

&lt;tickets&gt;
...
&lt;/tickets&gt;</pre>
<p>The tag names don't matter much. What matters is consistency, and referring to them in your instructions ("classify each ticket in the &lt;tickets&gt; section").</p>
<h3>Let it think first, when the task needs it</h3>
<p>For tasks with several steps of reasoning, asking the model to work through the problem before giving its final answer improves accuracy. Many current models have a built-in "thinking" mode that does this automatically. For simple lookups and formatting, it just adds time and cost.</p>`,
  watch:[],
  read:[R.promptTutorial],
  exercise:`<p>Build a classifier prompt for something real: customer messages, transaction descriptions, or support emails. Write 15 test inputs. Run them once with instructions only, then again with three varied examples and tags. Count how many each version got right.</p>`,
  quiz:[
    {q:"Your three examples are all short positive reviews. What risk does that create?", o:["None","The model learns to favour short, positive outputs","The prompt becomes too long","The model refuses"], a:1, why:"Models pick up every pattern in examples, intended or not. Vary them."},
    {q:"What's the main benefit of wrapping prompt parts in tags?", o:["It looks professional","The model can tell instructions, data and examples apart","Tags are required","It reduces cost"], a:1, why:"Clear separation prevents the model from confusing your data with your instructions."},
    {q:"When does asking the model to reason before answering help most?", o:["Simple formatting","Multi-step problems","Translating one word","Always equally"], a:1, why:"Extra reasoning pays off on multi-step problems, and is wasted on simple ones."}
  ]
},
{
  id:"2-4", title:"Iterate against test cases", mins:12,
  body:`
<p>A prompt is never finished after one draft. The professional loop is: write it, test it on several realistic inputs, look at the failures, fix the prompt, test again.</p>
<h3>Build a small test set</h3>
<p>Before changing anything, collect 5–10 inputs that represent real use, including:</p>
<ul>
<li>a typical, easy case;</li>
<li>a long or messy case;</li>
<li>an edge case (empty input, wrong language, missing field);</li>
<li>a case where the right answer is "I can't tell".</li>
</ul>
<p>Write down what a good output looks like for each, <em>before</em> you run anything. Otherwise you'll talk yourself into accepting whatever comes back.</p>
<h3>Change one thing at a time</h3>
<p>If you rewrite half the prompt and results improve, you won't know which change helped. Make one change, re-run the whole set, keep it if it helped, undo it if it didn't. Keep old versions so you can go back.</p>
<h3>Read the failures</h3>
<p>The useful information is in the failures, not the successes. For each failure, ask: was the instruction missing, unclear, or contradicted by an example? Was the needed context missing? Or is this beyond what the model can do (in which case, a better prompt won't fix it)?</p>
<h3>Why this matters</h3>
<p>What you're doing this week, by hand, is the start of <b>evals</b>, the subject of Month 3. People who test their prompts systematically get far better results than people who tweak by feel, and they can prove it. Start the habit now while the stakes are low.</p>`,
  watch:[],
  read:[R.promptOverview],
  exercise:`<p>Week 2 build: take your five rewritten prompts from lesson 2.1. For one of them, build a 6-case test set with expected outputs. Run the original prompt and the rewritten one against all six. Make two more one-at-a-time improvements and re-run each time. Publish a short write-up: before/after scores and the single change that helped most.</p>`,
  quiz:[
    {q:"When should you write down what a good output looks like?", o:["After seeing the output","Before running anything","Never","Only for failures"], a:1, why:"Deciding first stops you rationalising whatever the model returns."},
    {q:"Why change one thing at a time?", o:["It's faster","So you know which change caused the effect","Models need it","To save tokens"], a:1, why:"Several simultaneous changes make it impossible to tell what helped."},
    {q:"A failure persists after clear instructions and good examples. What might that mean?", o:["Add more capital letters","The task may be beyond the model, or needs a different approach","Run it 100 more times","Delete the test case"], a:1, why:"Some failures are capability limits. Recognising them saves wasted prompt tweaking."}
  ]
}
];

export const week3: Lesson[] = [
{
  id:"3-1", title:"From chatbot to agent", mins:10,
  body:`
<p>In a chat, the model writes text and you do everything else: copy the code, run it, paste back the error. An <b>agent</b> is a model that can take actions itself, in a loop:</p>
<ol>
<li>Read the goal.</li>
<li>Decide on an action: read a file, search, run a command, edit code.</li>
<li>Do it, using a <b>tool</b>.</li>
<li>Look at the result.</li>
<li>Decide the next action, or stop if done.</li>
</ol>
<p>That loop is the whole idea. A coding agent like Claude Code or Codex runs it inside your project: it explores files, makes changes, runs your tests, sees what failed, and fixes it, often across dozens of steps without you typing anything.</p>
<h3>What changes for you</h3>
<ul>
<li><b>You move from writing code to directing and reviewing it.</b> Your job becomes: brief the agent well, give it ways to check its work, and review what it produces.</li>
<li><b>The agent's environment matters as much as the model.</b> An agent that can run your tests will find and fix its own bugs. One that can't will hand you broken code that looks fine.</li>
<li><b>Mistakes can compound.</b> A wrong assumption at step 2 carries through to step 40. Catching problems early (by asking for a plan first) saves a lot of rework.</li>
</ul>
<h3>The "harness"</h3>
<p>The software around the model that runs this loop (the tools it can use, the permissions, how it manages context) is called the <b>harness</b>. Claude Code, Codex, Cursor and others are different harnesses. The same model can perform quite differently in different harnesses. In Month 5 you'll build a simple one yourself, which makes all of this concrete.</p>`,
  watch:[],
  read:[R.ccHow],
  exercise:`<p>Read "How Claude Code works". Draw the agent loop on paper for a task like "fix the failing test in this project": list each step the agent would likely take, which tool it would use, and what it would look at before deciding the next step.</p>`,
  quiz:[
    {q:"What makes something an agent rather than a chatbot?", o:["It's a bigger model","It can take actions with tools in a loop","It has a nicer interface","It costs more"], a:1, why:"The action-observe-decide loop with tools is the defining feature."},
    {q:"Why give a coding agent the ability to run tests?", o:["It looks impressive","It can find and fix its own bugs","Tests make it faster","It's required to install"], a:1, why:"An agent that can check its work catches mistakes before you see them."},
    {q:"What is the 'harness'?", o:["The model's weights","The software that runs the loop, tools and permissions around the model","A type of GPU","The prompt"], a:1, why:"The harness is everything around the model that turns it into a working agent."}
  ]
},
{
  id:"3-2", title:"Set up a coding agent safely", mins:12,
  body:`
<p>This week you'll install a coding agent and use it on a real, small project. Pick one: <b>Claude Code</b> or <b>OpenAI Codex CLI</b>. Both run in your terminal and work in a project folder. The links in this lesson have current install steps; follow those rather than copying commands from old blog posts, because they change.</p>
<h3>Before your first session</h3>
<ol>
<li><b>Use git, and commit before every session.</b> This is your undo button. If the agent makes a mess, you can return to a clean state in one command. Never run an agent in a folder that isn't under version control.</li>
<li><b>Start in a throwaway or low-stakes project.</b> Not a client's production repo.</li>
<li><b>Understand permissions.</b> Agents ask before editing files or running commands, unless you allow them not to. Start with approvals on, so you see every action. Loosen it later, deliberately, once you trust the setup.</li>
<li><b>Keep secrets out.</b> Don't leave API keys or production credentials in files the agent can read. Use environment variables and a <code>.gitignore</code>d <code>.env</code> file.</li>
</ol>
<h3>Your first session</h3>
<p>Don't start by asking it to build something. Start by asking it to <b>explain</b> an existing project: "What does this project do? What's the folder structure? Where's the entry point?" You'll learn how it explores, and you'll see it read files and run commands. Then give it one small, concrete change.</p>
<h3>Cost</h3>
<p>Coding agents use a lot of tokens because they read many files. Use a subscription plan if you can, or set a spending limit on your API account before you start.</p>`,
  watch:[],
  read:[R.ccQuick, R.codexCli, R.cc101],
  exercise:`<p>Install your chosen agent. Create a new git repo, commit an empty README, then start a session. Ask it to explain what it can do, then to create a tiny command-line tool (for example, a naira-to-dollar converter that reads a rate from a config file). Approve each step manually and note every action it takes.</p>`,
  quiz:[
    {q:"What should you do before every agent session?", o:["Restart your computer","Commit your work in git","Delete old files","Turn off the internet"], a:1, why:"A commit gives you a clean point to return to if the agent goes wrong."},
    {q:"Best first task in an unfamiliar project?", o:["Rewrite everything","Ask the agent to explain the project","Deploy to production","Delete tests"], a:1, why:"Explaining first shows you how the agent explores and catches misunderstandings early."},
    {q:"Where should API keys live?", o:["Hard-coded in source","In environment variables or a git-ignored .env file","In the README","In the prompt"], a:1, why:"Keep secrets out of files the agent reads and out of version control."}
  ]
},
{
  id:"3-3", title:"Briefing an agent: spec, plan, build", mins:12,
  body:`
<p>Everything from Week 2 applies, with one addition: agents work over many steps, so a small misunderstanding at the start becomes a large one by the end. The fix is a three-stage workflow.</p>
<h3>1. Spec</h3>
<p>Write what you want in a few short paragraphs or bullets: the goal, the behaviour, constraints (libraries, patterns, files not to touch), and how you'll know it's done ("all tests pass and the endpoint returns 404 for unknown IDs"). Save it as a file in the repo, such as <code>SPEC.md</code>, so the agent can re-read it.</p>
<h3>2. Plan</h3>
<p>Ask the agent to read the relevant code and propose a plan <em>before</em> changing anything. Claude Code has a plan mode for exactly this. Read the plan. This is the cheapest moment to catch a wrong assumption: correcting one sentence now saves an hour of rework later.</p>
<h3>3. Build in slices</h3>
<p>Ask it to implement one piece at a time, running tests after each. Commit after each working slice. Small slices mean small diffs, which mean reviews you can actually do properly.</p>
<h3>Give it a way to check</h3>
<p>The single biggest improvement you can make: tell the agent how to verify its work. "Run <code>mvn test</code> after each change." "Start the server and call the endpoint with curl." "The output should match <code>expected.json</code>." An agent that can see its own failures fixes them. One that can't will tell you it's done when it isn't.</p>
<h3>Clear context between tasks</h3>
<p>When you finish one task and start an unrelated one, start a fresh session (or clear the conversation). Old context from the previous task is noise for the new one.</p>`,
  watch:[],
  read:[R.ccBest],
  exercise:`<p>Week 3 build: write a SPEC.md for a slightly bigger feature on your CLI tool from lesson 3.2 (for example, fetching a live exchange rate with a cached fallback). Ask for a plan first and correct it before any code is written. Build it in at least three slices, with tests after each and a commit after each.</p>`,
  quiz:[
    {q:"When is the cheapest moment to catch a wrong assumption?", o:["After deployment","During the plan, before code is written","During code review","Never"], a:1, why:"Correcting a plan costs one sentence. Correcting finished code costs hours."},
    {q:"What single addition most improves agent results?", o:["A longer prompt","A way for it to verify its own work","More emojis","A faster computer"], a:1, why:"Tests, commands and expected outputs let the agent find and fix its own mistakes."},
    {q:"You finish a task and start an unrelated one. What should you do?", o:["Keep going in the same session","Start a fresh session","Restart the computer","Reinstall the agent"], a:1, why:"Leftover context from the old task is noise for the new one."}
  ]
},
{
  id:"3-4", title:"Reviewing agent output", mins:12,
  body:`
<p>Agents write code faster than you can read it. That makes review the new bottleneck, and the place where quality is won or lost.</p>
<h3>Read every diff</h3>
<p>For Month 1, read every line the agent changes. Not skim: read. You're building a mental model of what it does well and where it cuts corners. Later you'll review faster because you'll know where to look.</p>
<h3>Common agent failure modes</h3>
<ul>
<li><b>Making tests pass the wrong way.</b> Editing or deleting a failing test, or special-casing the test input, instead of fixing the code.</li>
<li><b>Claiming success without checking.</b> "Done, all tests pass" when it didn't run them, or they didn't pass.</li>
<li><b>Scope creep.</b> Refactoring files you didn't ask it to touch.</li>
<li><b>Swallowing errors.</b> Wrapping things in try/catch that hides the real problem.</li>
<li><b>Inventing APIs.</b> Calling a library method that doesn't exist, or with the wrong signature. Running the code catches this fast.</li>
<li><b>Duplicating instead of reusing.</b> Writing a new helper when one already exists in your codebase.</li>
<li><b>Losing the plot in long sessions.</b> Forgetting earlier instructions as the context fills.</li>
</ul>
<h3>Start your failure log</h3>
<p>Every time you catch one of these, write it down: what happened, which tool, why you think it happened, and what you changed (the prompt, the spec, a project instruction, a test). This log is the most valuable thing you'll build in this course. After a month it tells you exactly which guardrails to put in place, and those guardrails are what eventually let you run several agents at once.</p>
<p>The site has a failure log built in. Use it.</p>`,
  watch:[],
  read:[R.ccBest, R.halluc],
  exercise:`<p>Go back through every diff from this week's work. Find at least three things you'd push back on in a code review, even small ones. Add each to the failure log on this site with the cause and the fix. Publish your Week 3 write-up: what the agent did well, and your top three failures.</p>`,
  quiz:[
    {q:"An agent 'fixes' a failing test by changing the test's expected value. This is:", o:["A good fix","A classic failure mode: passing the test the wrong way","Required behaviour","Faster, so fine"], a:1, why:"Changing the test instead of the code hides the bug. Watch for it."},
    {q:"Why read every diff in Month 1?", o:["It's required by law","To build a mental model of where agents cut corners","Agents can't be trusted ever","It's faster"], a:1, why:"Close reading now lets you review faster and more selectively later."},
    {q:"What's the main purpose of the failure log?", o:["Blaming the AI","Turning repeated mistakes into specific guardrails","Counting tokens","Impressing others"], a:1, why:"Patterns in the log tell you which instructions, tests and hooks to add."}
  ]
}
];

export const week4: Lesson[] = [
{
  id:"4-1", title:"Choose and specify your exam project", mins:10,
  body:`
<p>The Month 1 exam: <b>build a small full-stack app where the agent writes at least 80% of the code, and you can explain every line.</b></p>
<h3>Choosing the project</h3>
<p>Pick something small enough to finish in about a week of evenings, and real enough to matter. Good choices are things you or someone you know would actually use:</p>
<ul>
<li>an invoice generator for freelancers that exports PDFs;</li>
<li>a simple booking page for a barber or clinic, with a basic admin view;</li>
<li>an internal tool that tracks client projects and payment status;</li>
<li>a tracker for this course: weeks, notes and links to your write-ups.</li>
</ul>
<p>Avoid anything needing payments, real personal data or complicated third-party approvals. Those are good later projects, not exam projects.</p>
<h3>Writing the spec</h3>
<p>Your SPEC.md should cover:</p>
<ol>
<li><b>Users and the main job.</b> Who uses it and the one thing it must do well.</li>
<li><b>Features</b>, as a short list, marked must-have or nice-to-have.</li>
<li><b>Stack.</b> Pick something you can read fluently, so your review is real. You can use a stack you know well, or deliberately learn a new one; just be honest that review will be slower.</li>
<li><b>Data model.</b> The main entities and their fields.</li>
<li><b>Definition of done.</b> Tests passing, deployed somewhere, and a README a stranger could follow.</li>
</ol>
<p>Then ask the agent to critique your spec before any code is written: "What's ambiguous or missing in this spec?" Fix what it finds.</p>`,
  watch:[],
  read:[R.ccBest],
  exercise:`<p>Pick your project and write SPEC.md. Ask the agent to critique it and list open questions. Answer them in the spec. Commit it.</p>`,
  quiz:[
    {q:"Why choose a stack you can read fluently for the exam?", o:["It's faster to type","So your review of the agent's code is real","Agents only know some stacks","Required by the course"], a:1, why:"The exam requires explaining every line. That needs fluent reading."},
    {q:"What should you do with the spec before coding?", o:["Nothing","Ask the agent to critique it for gaps","Delete it","Hide it from the agent"], a:1, why:"Having the agent find ambiguities early saves rework."},
    {q:"Which is a poor exam project?", o:["Freelancer invoice generator","A payments app handling real card data","Internal project tracker","Course progress tracker"], a:1, why:"Real payments and personal data add risk and approvals that don't belong in a first exam."}
  ]
},
{
  id:"4-2", title:"Build loop: slices, tests, commits", mins:10,
  body:`
<p>Build the app using the Week 3 workflow, at a larger scale.</p>
<h3>The loop, for each feature</h3>
<ol>
<li>Point the agent at SPEC.md and the feature to build.</li>
<li>Ask for a plan. Correct it.</li>
<li>Have it write tests for the feature first, then the code.</li>
<li>It runs the tests. You read the diff.</li>
<li>Commit with a clear message.</li>
</ol>
<h3>Write project instructions as you go</h3>
<p>Every time you correct the agent on something general ("we use DTOs, not entities, in API responses", "run the linter before committing"), add it to the project instructions file the agent reads at the start of every session: <code>CLAUDE.md</code> for Claude Code, <code>AGENTS.md</code> for Codex. By the end of the week, this file is a compact record of your standards, and the agent stops repeating the same mistakes. Month 2 goes deep on this.</p>
<h3>Track the 80%</h3>
<p>Keep a rough tally of what you wrote by hand versus what the agent wrote. If you find yourself writing a lot by hand, stop and ask why. Was the brief unclear? Was it faster to type than to explain? Note it in your failure log. Both are useful answers.</p>
<h3>Deploy early</h3>
<p>Get the app running somewhere public (Amplify, Vercel, Render, Railway, or a small VPS) by mid-week, even half-finished. Deployment problems found on the last day are the worst kind.</p>`,
  watch:[],
  read:[R.ccBest],
  exercise:`<p>Build the exam app. Keep CLAUDE.md or AGENTS.md updated with each general correction. Deploy by mid-week. Log every failure.</p>`,
  quiz:[
    {q:"You correct the agent on a project-wide convention. Where should that go?", o:["Nowhere","The project instructions file it reads every session","A sticky note","The commit message only"], a:1, why:"CLAUDE.md or AGENTS.md makes the correction stick across sessions."},
    {q:"Why deploy mid-week rather than at the end?", o:["It's more fun","Deployment problems found late are the most damaging","It's free","Agents require it"], a:1, why:"Early deployment surfaces environment problems while there's time to fix them."},
    {q:"You notice you're hand-writing a lot of code. What should you do?", o:["Ignore it","Ask why, and log the reason","Stop using the agent","Delete the code"], a:1, why:"The reason, whether an unclear brief or a genuine shortcut, is useful data."}
  ]
},
{
  id:"4-3", title:"Prove it and publish it", mins:10,
  body:`
<p>Finishing is half the exam. The other half is showing that you understand what was built, and sharing it.</p>
<h3>The walkthrough</h3>
<p>Record a short screen recording (10–15 minutes) or write a walkthrough document going through the codebase file by file. For each file: what it does, why it's structured that way, and anything you changed from the agent's version. If you reach a part you can't explain, that's not a failure of the exam; it's exactly what the exam is designed to find. Go back, understand it, then continue.</p>
<h3>The write-up</h3>
<p>Publish a post (LinkedIn, a blog, or a write-ups page on this site) covering:</p>
<ul>
<li>what you built and the link to it;</li>
<li>roughly what share of the code the agent wrote;</li>
<li>your workflow, briefly;</li>
<li>your three most instructive agent failures and what you changed because of them;</li>
<li>what you'd do differently.</li>
</ul>
<p>Keep it honest and specific. "The agent deleted my validation to make a test pass, so I added a rule to CLAUDE.md" is far more credible than "AI made me 10x faster".</p>
<h3>Self-assessment</h3>
<p>You've passed Month 1 if you can tick all of these honestly:</p>
<ul>
<li>The app works and is deployed.</li>
<li>The agent wrote at least 80% of the code.</li>
<li>You can explain every file.</li>
<li>Your failure log has at least ten entries.</li>
<li>Your write-up is published.</li>
</ul>`,
  watch:[],
  read:[],
  exercise:`<p>Do the walkthrough, publish the write-up, and tick the Week 4 tasks on the curriculum page. Then take a day off before Month 2.</p>`,
  quiz:[
    {q:"You hit a file in your walkthrough you can't explain. What now?", o:["Skip it","Go back and understand it; that's what the exam is for","Delete it","Say the AI wrote it"], a:1, why:"Finding gaps in your understanding is the point. Close them before moving on."},
    {q:"Which write-up line is most credible?", o:["AI made me 10x faster","The agent deleted validation to pass a test, so I added a rule to CLAUDE.md","AI is amazing","I barely did anything"], a:1, why:"Specific, honest detail is what makes public work convincing."},
    {q:"How many failure-log entries should you have by the end of Month 1?", o:["Zero","At least ten","Exactly three","One per week"], a:1, why:"Ten real entries means you've been paying close attention."}
  ]
}
];
