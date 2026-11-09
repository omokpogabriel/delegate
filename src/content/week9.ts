import type { Lesson, Resource } from "./types";
import { U } from "./unis";

// Week 9 lessons: calling models directly through the API.
// Assumes no API experience: installing Python, API keys and environment variables are covered from scratch.
// h`...` (String.raw) keeps backslashes in Windows paths.
const h = String.raw;

const R: Record<string, Resource> = {
  messages: {title:"Working with the Messages API — Claude docs", url:"https://platform.claude.com/docs/en/build-with-claude/working-with-messages"},
  structured: {title:"Structured outputs — Claude docs", url:"https://platform.claude.com/docs/en/build-with-claude/structured-outputs"},
  tools: {title:"Tool use overview — Claude docs", url:"https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview"},
  writingTools: {title:"Writing effective tools for agents — Anthropic", url:"https://www.anthropic.com/engineering/writing-tools-for-agents"},
  errors: {title:"API errors — Claude docs", url:"https://platform.claude.com/docs/en/api/errors"},
  rate: {title:"Rate limits — Claude docs", url:"https://platform.claude.com/docs/en/api/rate-limits"},
  streaming: {title:"Streaming messages — Claude docs", url:"https://platform.claude.com/docs/en/build-with-claude/streaming"},
  caching: {title:"Prompt caching — Claude docs", url:"https://platform.claude.com/docs/en/build-with-claude/prompt-caching"},
  ollamaOpenAI: {title:"OpenAI compatibility — Ollama docs", url:"https://docs.ollama.com/openai"}
};

const MODEL = "claude-sonnet-5-5";

export const week9: Lesson[] = [
{
  id:"9-1", title:"Your first API call, from zero", mins:18,
  objectives:["Explain what an API, an API key and an environment variable are","Set up Python and the SDK, and keep your key out of your code","Make a first call and read the response, including the token counts"],
  prereqs:"<p>Months 1–2. No API experience needed. You'll need a computer where you can install Python, and either an API account with a little credit or the free local route described in the box below.</p>",
  body:h`
<p>Until now you've used AI through apps and coding agents. This month you call the model yourself, from your own code. This is the step from <em>user</em> to <em>builder</em>: once you can do it, you can put AI inside any product.</p>
<h3>Three words first</h3>
<ul>
<li><b>API</b> (application programming interface): a way for one program to ask another for something over the internet. Your code sends a request ("here's a conversation, please reply") and gets a response back.</li>
<li><b>API key</b>: a long secret string that identifies you and is used for billing. Anyone who has it can spend your money, so treat it like a password.</li>
<li><b>Environment variable</b>: a named value stored in your terminal session or system, outside your code. Your code reads the key from there, so the key never appears in a file you might commit or share.</li>
</ul>
<h3>Step 1: install Python and the SDK</h3>
<p>Install Python 3 from python.org (on Windows, tick "Add Python to PATH" in the installer). Check it in a new terminal with <code>python --version</code>. Then create a project folder and a virtual environment, which is a private set of packages for this project:</p>
<pre>mkdir ai-calls
cd ai-calls
python -m venv .venv
.venv\Scripts\activate        # Windows
source .venv/bin/activate     # macOS / Linux
pip install anthropic</pre>
<p>The <b>SDK</b> (software development kit) is a library that handles the HTTP details, so you call a Python function instead of building web requests by hand.</p>
<h3>Step 2: set your key</h3>
<p>Create a key in your provider's console, then set it in the terminal where you'll run your code:</p>
<pre>$env:ANTHROPIC_API_KEY="sk-ant-..."     # Windows PowerShell (this window only)
setx ANTHROPIC_API_KEY "sk-ant-..."     # Windows, permanent (open a new terminal after)
export ANTHROPIC_API_KEY="sk-ant-..."   # macOS / Linux</pre>
<h3>Step 3: the call</h3>
<p>Save this as <code>first.py</code> and run <code>python first.py</code>:</p>
<pre>import anthropic

client = anthropic.Anthropic()   # reads ANTHROPIC_API_KEY automatically

response = client.messages.create(
    model="${MODEL}",
    max_tokens=500,
    messages=[{"role": "user", "content": "Explain what an API is to a market trader in Lagos, in 3 sentences."}],
)

print(response.content[0].text)
print("tokens in:", response.usage.input_tokens, "out:", response.usage.output_tokens)</pre>
<p>Every call has the same core parts: the <b>model</b> name, <b>max_tokens</b> (the most the reply may use, which caps your cost) and <b>messages</b> (the conversation). The response contains the reply and a <b>usage</b> record of tokens in and out, which is what you pay for (lesson 1.2).</p>
<div class="callout"><b>No card, or can't pay in dollars yet?</b> Many learners in Nigeria hit this wall, and it shouldn't stop you. Install Ollama (Week 10 covers it in detail), run <code>ollama pull qwen2.5:3b</code>, and call it through its OpenAI-compatible endpoint at <code>http://localhost:11434/v1</code> using the <code>openai</code> Python package (<code>pip install openai</code>). It's free, runs on your own computer, and every idea in this week works the same way. The Ollama docs linked below show the exact code.</div>
<div class="callout"><b>Stuck?</b> The three most common errors: <code>'python' is not recognized</code> means Python isn't on your PATH (reinstall with the PATH box ticked, then open a new terminal); <code>ModuleNotFoundError: anthropic</code> means the virtual environment isn't active (run the activate line again); <code>401</code> or "authentication error" means the key isn't set in <em>this</em> terminal (set it again, or open a new terminal after <code>setx</code>).</div>`,
  watch:[U.mit191llm],
  read:[R.messages, R.ollamaOpenAI],
  exercise:`<p>Make the call above work on your machine. Then change three things one at a time and note what happens: set <code>max_tokens</code> to 20 (the reply is cut off), ask the same question three times (the answers vary, lesson 1.3), and ask in Pidgin or Yoruba (compare the token counts with English, lesson 1.2).</p>`,
  problems:[
    {q:"<p>A friend's code has <code>client = anthropic.Anthropic(api_key=\"sk-ant-abc123...\")</code> and they want to push it to GitHub. What's wrong and what should they do?</p>",
     a:"<p>The key is in the code, so anyone who sees the repository can use it and spend their money (bots scan GitHub for keys within minutes). Remove it, read it from the environment variable instead, and, because it may already have been exposed, delete that key in the console and create a new one.</p>"},
    {q:"<p>A call used 1,200 input tokens and 300 output tokens. At $3 per million input and $15 per million output, what did it cost? What about 1,000 such calls a day for 30 days?</p>",
     a:"<p>One call: \\(1{,}200 \\times 3 / 10^6 + 300 \\times 15 / 10^6 = \\$0.0036 + \\$0.0045 = \\$0.0081\\). For 30,000 calls: about <b>$243</b> a month. Small per call, real money at scale, which is why you log usage from day one.</p>"}
  ],
  quiz:[
    {q:"Where should your API key live?", o:["In your code","In an environment variable, outside the code","In the README","In a comment"], a:1, why:"Keys in code end up in git and get stolen."},
    {q:"What does max_tokens control?", o:["How long the prompt can be","The maximum length (and cost) of the reply","The model's intelligence","The number of retries"], a:1, why:"It caps the output tokens the model may generate."},
    {q:"You get a 401 authentication error. Most likely cause?", o:["The model is down","The API key isn't set in this terminal, or is wrong","Your question was too long","Python is too old"], a:1, why:"401 means the server didn't accept your credentials."}
  ]
},
{
  id:"9-2", title:"Conversations and system prompts", mins:13,
  objectives:["Explain why the API is stateless and how multi-turn conversations work","Use a system prompt to set the model's role and rules","Build a simple chat loop that keeps history"],
  prereqs:"<p>Lesson 9.1 working on your machine.</p>",
  body:h`
<p>Here's the most surprising fact about model APIs: <b>the model remembers nothing between calls</b>. Each request is independent. A "conversation" is something your code builds by sending the whole history every time.</p>
<h3>Messages and roles</h3>
<p>The <code>messages</code> list alternates between two roles: <code>user</code> (what the person said) and <code>assistant</code> (what the model replied). To continue a conversation, you append the model's last reply and the user's new message, and send the whole list again:</p>
<pre>messages = [
    {"role": "user", "content": "I sell phones in Computer Village. Suggest a shop name."},
    {"role": "assistant", "content": "How about 'Village Connect'?"},
    {"role": "user", "content": "Shorter, and with a Yoruba word."},
]</pre>
<p>The model sees all three and answers the last one in context. This is exactly how chat apps work behind the scenes, and why long conversations get more expensive: every turn resends everything before it.</p>
<h3>The system prompt</h3>
<p>The <b>system prompt</b> is a separate instruction that sets the model's role, rules and context for the whole conversation. In this API it's its own parameter, not a message:</p>
<pre>response = client.messages.create(
    model="claude-sonnet-5-5",
    max_tokens=500,
    system="You are a support assistant for Kola Phones, Ikeja. Answer in plain English. "
           "Prices are in naira. If you don't know a price, say so; never invent one.",
    messages=messages,
)</pre>
<p>Everything you learned in Week 2 about writing specs applies here. The system prompt is where your product's rules live.</p>
<h3>A minimal chat loop</h3>
<pre>import anthropic
client = anthropic.Anthropic()
history = []
while True:
    text = input("you: ")
    if text == "quit":
        break
    history.append({"role": "user", "content": text})
    reply = client.messages.create(model="claude-sonnet-5-5", max_tokens=500,
                                   system="You are a friendly tutor.", messages=history)
    answer = reply.content[0].text
    history.append({"role": "assistant", "content": answer})
    print("ai:", answer)</pre>
<div class="callout"><b>Stuck?</b> If you get an error about roles, check that the list alternates <code>user</code>, <code>assistant</code>, <code>user</code>, and that it starts and ends with <code>user</code> when you send it. Forgetting to append the assistant's reply is the most common bug: the model then "forgets" what it just said.</div>`,
  watch:[U.cs224n_prompt],
  read:[R.messages],
  exercise:`<p>Build the chat loop. Give it a system prompt for a real use (a support bot for a business you know). Have a 10-turn conversation, then print the total input tokens of the last call and explain why it's much bigger than the first.</p>`,
  problems:[
    {q:"<p>Each turn adds about 150 tokens to the history, and the system prompt is 400 tokens. How many input tokens does turn 20 send, and why is that a cost problem?</p>",
     a:"<p><b>Turn 20:</b> 400 + (20 × 150) = 400 + 3,000 = <b>3,400</b> input tokens.</p><p><b>Why it adds up:</b> you pay for the whole history again on every turn. Turn 1 sends about 550 tokens, turn 10 about 1,900, and turn 20 about 3,400, so later turns cost several times more than early ones, and the total climbs quickly. <b>Fixes:</b> trim or summarise old turns, and use prompt caching for the system prompt that never changes.</p>"},
    {q:"<p>Where should \"never invent a price\" go: the system prompt or a user message? Why?</p>",
     a:"<p>The system prompt. It's a rule for the whole conversation, and the system prompt is where the product's role and rules live, separate from what the customer types.</p>"}
  ],
  quiz:[
    {q:"How does the model know what was said earlier in a conversation?", o:["It remembers past calls","Your code sends the full history with every call","The server stores it","It doesn't need to"], a:1, why:"The API is stateless; history is resent each time."},
    {q:"What is the system prompt for?", o:["Storing the API key","Setting the model's role and rules for the whole conversation","Logging errors","Choosing the model"], a:1, why:"It's where the product's standing instructions go."},
    {q:"Why do long conversations cost more per turn?", o:["Models get tired","Every turn resends all earlier turns as input","Prices rise over time","They don't"], a:1, why:"Input grows with the history."}
  ]
},
{
  id:"9-3", title:"Getting reliable structured output", mins:15,
  objectives:["Ask for JSON that matches a schema","Validate output in code and retry with the error","Know when to use the API's structured-output feature"],
  prereqs:"<p>Lessons 9.1–9.2. Lesson 2.2 (asking for the format you'll use).</p>",
  body:h`
<p>Most real AI features don't show text to a person. They feed the model's answer into code: save it to a database, route a ticket, fill a form. Code needs <b>structured output</b>, data in an exact shape, and it has to be right every time, not usually.</p>
<h3>JSON and schemas in one minute</h3>
<p><b>JSON</b> is the standard text format for data: <code>{"name": "Ada", "age": 31, "tags": ["vip"]}</code>. A <b>schema</b> describes the shape: which fields exist, their types, and which are required. You give the model the schema, and your code checks the result against it.</p>
<h3>The pattern: ask, validate, retry</h3>
<p>Python's <code>pydantic</code> library (<code>pip install pydantic</code>) turns a schema into a class you can validate against:</p>
<pre>import anthropic, json
from pydantic import BaseModel, ValidationError

class Invoice(BaseModel):
    supplier: str
    total_naira: int
    due_date: str | None      # None when not stated

client = anthropic.Anthropic()
schema = json.dumps(Invoice.model_json_schema())

def extract(text, attempts=3):
    messages = [{"role": "user", "content":
        f"Extract the invoice fields from the text below. Reply with JSON only, matching this schema:\n"
        f"{schema}\nUse null for anything not stated. Never guess.\n\n&lt;text&gt;{text}&lt;/text&gt;"}]
    for _ in range(attempts):
        reply = client.messages.create(model="claude-sonnet-5-5", max_tokens=500, messages=messages)
        raw = reply.content[0].text
        try:
            return Invoice.model_validate_json(raw)
        except ValidationError as e:
            messages += [{"role": "assistant", "content": raw},
                         {"role": "user", "content": f"That failed validation: {e}. Reply with corrected JSON only."}]
    raise RuntimeError("no valid output after retries")</pre>
<p>Three things make this reliable: a precise schema, an explicit rule for missing values ("null, never guess"), and validation in code with a retry that tells the model exactly what was wrong.</p>
<h3>Let the API enforce it</h3>
<p>Validating and retrying works with any model, including local ones. Many APIs, including Claude's, also offer a <b>structured outputs</b> feature where you pass the schema and the response is guaranteed to match it. Use it when it's available, and keep validating anyway: a reply can match the shape and still contain a wrong value. The docs below show the current syntax.</p>
<div class="callout"><b>Stuck?</b> If parsing fails because the model wrapped the JSON in a sentence or in <code>&#96;&#96;&#96;json</code> fences, add "Reply with the JSON object only, no other text" and, as a safety net, strip everything before the first <code>{</code> and after the last <code>}</code> before parsing. If a value is wrong but well-formed, that's an accuracy problem, not a format problem: you'll measure those with evals in Week 11.</div>`,
  watch:[],
  read:[R.structured],
  exercise:`<p>This is the Week 9 build. Collect 10 real messy texts (receipts, WhatsApp order messages, invoices). Write a schema, extract them with the ask–validate–retry pattern, and record for each: valid on first try? fields correct? Keep the 10 as the start of your Month 3 eval set.</p>`,
  problems:[
    {q:"<p>The text says \"pay by end of month\" and the model returns <code>\"due_date\": \"2026-11-30\"</code>. Is that right?</p>",
     a:"<p>It depends on your rule, and the rule should be explicit. If the month isn't stated, the model guessed it, which breaks the \"never guess\" instruction. Either return <code>null</code>, or keep the original wording in a separate field such as <code>due_text</code> so a person can decide. Guessed dates in financial data cause real problems.</p>"},
    {q:"<p>Out of 100 extractions, 97 validate on the first try and all 3 failures are fixed by one retry. What's the extra cost of retries, roughly?</p>",
     a:"<p>Three extra calls per hundred, each a bit larger because it includes the failed reply and the error: roughly 3–5% more spend. That's cheap insurance for output your code can always trust.</p>"}
  ],
  quiz:[
    {q:"Why validate the model's JSON in code?", o:["It's required by Python","Because code downstream will break, or silently store bad data, if the shape is wrong","To make it faster","To reduce tokens"], a:1, why:"Validation turns 'usually right' into 'right or rejected'."},
    {q:"What should the prompt say about missing information?", o:["Make a sensible guess","Use null (or a stated default), never guess","Skip the field","Ask the user"], a:1, why:"An explicit rule prevents invented values."},
    {q:"If the API guarantees the schema, do you still need to check values?", o:["No","Yes: the shape can be right while a value is wrong","Only on Fridays","Only for numbers"], a:1, why:"Format and accuracy are different problems."}
  ]
},
{
  id:"9-4", title:"Tool calling, step by step", mins:18,
  objectives:["Define a tool with a name, a description and an input schema","Run the tool loop: the model asks, your code runs it, the result goes back","Write tool descriptions a model can use correctly"],
  prereqs:"<p>Lessons 9.1–9.3. Lesson 3.1 (from chatbot to agent).</p>",
  body:h`
<p>In Week 3 you learned that an agent is a model in a loop with tools. Now you'll build that loop yourself. It's shorter than most people expect.</p>
<h3>The key idea</h3>
<p>The model never runs anything. It can only <em>ask</em>. You describe your tools; when the model wants one, it replies with a request ("call <code>get_order_status</code> with <code>order_id = ORD-1042</code>"). <b>Your code</b> runs the real function and sends the result back. The model then continues, perhaps asking for another tool, perhaps answering.</p>
<h3>Step 1: describe the tool</h3>
<pre>tools = [{
    "name": "get_order_status",
    "description": "Look up the delivery status of a customer's order. "
                   "Use when the customer asks where their order is or when it will arrive.",
    "input_schema": {
        "type": "object",
        "properties": {"order_id": {"type": "string", "description": "Order ID such as ORD-1042"}},
        "required": ["order_id"],
    },
}]</pre>
<h3>Step 2: the loop</h3>
<pre>import anthropic, json
client = anthropic.Anthropic()

def get_order_status(order_id):
    # in real life: query your database
    return {"order_id": order_id, "status": "out for delivery", "eta": "today, 4pm"}

messages = [{"role": "user", "content": "Where is my order ORD-1042?"}]
while True:
    reply = client.messages.create(model="claude-sonnet-5-5", max_tokens=1000,
                                   tools=tools, messages=messages)
    messages.append({"role": "assistant", "content": reply.content})
    if reply.stop_reason != "tool_use":
        break                                  # the model has finished
    results = []
    for block in reply.content:
        if block.type == "tool_use":           # the model is asking for a tool
            output = get_order_status(**block.input)
            results.append({"type": "tool_result", "tool_use_id": block.id,
                            "content": json.dumps(output)})
    messages.append({"role": "user", "content": results})

print("".join(b.text for b in reply.content if b.type == "text"))</pre>
<p>Read it slowly: call the model; save its reply into the history; if it didn't ask for a tool, stop; otherwise run each requested tool, send the results back (each matched to its request by <code>tool_use_id</code>), and go round again. That's an agent. Everything else (Claude Code, Codex) is this loop with more tools, more safety, and better context management.</p>
<h3>Descriptions decide behaviour</h3>
<p>The model chooses tools from their names and descriptions alone, just like skills in lesson 6.1. Say what the tool does, when to use it, and what each input means, with an example value. Vague descriptions cause wrong calls; that's usually what's happening when an agent "misuses" a tool.</p>
<h3>Safety</h3>
<p>Because your code runs the tool, you're in control. Add a step limit to the loop (for example 10 rounds), validate inputs before running anything, and never give a model a tool that can do damage, like sending money or deleting records, without a human approval step.</p>
<div class="callout"><b>Stuck?</b> The classic errors: forgetting to append the assistant's reply before the tool results (the API then rejects the request), a <code>tool_use_id</code> that doesn't match, and an infinite loop because the tool keeps returning an error the model can't fix. Print <code>reply.stop_reason</code> and each block on every round while you're learning: watching the loop step by step makes it click.</div>`,
  watch:[U.berkeleyAgents, U.cs224n_agents],
  read:[R.tools, R.writingTools],
  exercise:`<p>Extend the example with a second tool, <code>cancel_order(order_id, reason)</code>, that only "cancels" after asking for confirmation in the terminal (<code>input("approve? y/n")</code>). Add a 10-round step limit. Try five different customer messages, including one that should use neither tool, and log every tool call.</p>`,
  problems:[
    {q:"<p>The model calls <code>get_order_status</code> with <code>order_id = \"1042\"</code> but your database needs <code>\"ORD-1042\"</code>. Name two fixes.</p>",
     a:"<p>(1) Improve the description and example: \"Order ID including the ORD- prefix, e.g. ORD-1042\". (2) Make the tool forgiving: normalise the input in code (add the prefix if it's missing), or return a clear error such as \"Order IDs look like ORD-1042\" so the model can correct itself on the next round.</p>"},
    {q:"<p>Why must the model never run tools itself, and what does that give you?</p>",
     a:"<p>The model only produces text, including tool requests; your code decides whether to run them. That means you can validate inputs, require human approval for risky actions, log everything and enforce limits. Control stays with your code.</p>"}
  ],
  quiz:[
    {q:"Who actually runs the tool?", o:["The model","Your code","The API provider","The user"], a:1, why:"The model requests; your code executes and returns the result."},
    {q:"How do you know the model wants a tool?", o:["It says please","stop_reason is 'tool_use' and the reply contains a tool_use block","The response is empty","It returns an error"], a:1, why:"That's the signal to run the tool and continue the loop."},
    {q:"What most decides whether the model picks the right tool?", o:["The tool's code","Its name and description","The order in the list","The temperature"], a:1, why:"The model only sees the descriptions, not your code."}
  ]
},
{
  id:"9-5", title:"Errors, retries, streaming and cost", mins:14,
  objectives:["Handle the errors every API integration hits","Use timeouts, retries and backoff without double-charging users","Stream long replies and track cost per request"],
  prereqs:"<p>Lessons 9.1–9.4.</p>",
  body:h`
<p>A demo works when everything goes right. A product has to work when things go wrong: the network drops, the provider is busy, you send too many requests. This lesson covers the failures you will definitely meet.</p>
<h3>The errors you'll see</h3>
<ul>
<li><b>400</b> (bad request): something is wrong with what you sent, for example roles not alternating or a missing field. Retrying won't help; fix the request.</li>
<li><b>401</b> (authentication): bad or missing key.</li>
<li><b>429</b> (rate limit): you're sending too many requests or tokens per minute. Wait and retry.</li>
<li><b>500 / 529</b> (server error / overloaded): a problem on the provider's side. Wait and retry.</li>
<li><b>Timeouts and connection errors</b>: the network or the request took too long. Retry, carefully.</li>
</ul>
<h3>Retries with backoff</h3>
<p>The rule: retry errors that are temporary (429, 5xx, connection problems), never ones that aren't (400, 401). Wait longer between each attempt (1s, 2s, 4s…), which is called <b>exponential backoff</b>. The official SDKs already do this for you a couple of times; you can configure it:</p>
<pre>client = anthropic.Anthropic(max_retries=4, timeout=60.0)

try:
    reply = client.messages.create(...)
except anthropic.RateLimitError:
    ...   # still rate-limited after retries: queue it, or tell the user to try shortly
except anthropic.APIStatusError as e:
    print("API error", e.status_code)</pre>
<p><b>Be careful with retries that have side effects.</b> If a timeout happens after the model already triggered a tool that sent an SMS, retrying the whole thing sends a second SMS. Make actions safe to repeat (for example, check "already sent for this order?") before you add retries around them.</p>
<h3>Streaming</h3>
<p>A long reply can take 20 seconds, which feels broken to a user. <b>Streaming</b> sends the reply piece by piece as it's generated, so text appears straight away:</p>
<pre>with client.messages.stream(model="claude-sonnet-5-5", max_tokens=1000,
                            messages=[{"role": "user", "content": "Write a short story."}]) as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)</pre>
<h3>Know your cost per request</h3>
<p>Log <code>usage.input_tokens</code> and <code>usage.output_tokens</code> for every call, with what the call was for. Within a week you'll know which feature costs what, and you'll spot the bug that sends the whole document 40 times. Two big savings to know about: <b>prompt caching</b> (repeated long prefixes such as a system prompt are charged at a fraction of the normal price) and <b>picking a smaller model</b> for easy tasks, which you'll measure properly in Month 3.</p>
<div class="callout"><b>Stuck?</b> To test your error handling without waiting for a real outage, use a wrong key (401), send a broken messages list (400), or set <code>timeout=0.001</code> to force a timeout. Seeing each failure once on purpose is much less stressful than meeting it in production.</div>`,
  watch:[],
  read:[R.errors, R.rate, R.streaming, R.caching],
  exercise:`<p>Wrap your Week 9 extractor (lesson 9.3) in proper error handling: retries for temporary errors, a clear message for permanent ones, and a log line per call with tokens and estimated cost. Force each error type once on purpose and save the output. Add streaming to your chat loop from lesson 9.2.</p>`,
  problems:[
    {q:"<p>For each, retry or not? (a) 429 (b) 400 \"messages: roles must alternate\" (c) 529 overloaded (d) 401.</p>",
     a:"<p>(a) Retry with backoff. (b) Don't: the request is wrong, so fix the code. (c) Retry with backoff. (d) Don't: fix the key. Temporary problems get retries; mistakes in your request get fixed.</p>"},
    {q:"<p>With backoff starting at 1 second and doubling, how long has a request waited in total before its 5th attempt?</p>",
     a:"<p>Waits before attempts 2, 3, 4 and 5 are 1, 2, 4 and 8 seconds: \\(1+2+4+8 = 15\\) seconds in total. In practice a little random \"jitter\" is added so many clients don't all retry at the same instant.</p>"}
  ],
  quiz:[
    {q:"Which error should you retry?", o:["400 bad request","401 authentication","429 rate limit","All of them"], a:2, why:"429 is temporary; 400 and 401 need fixing, not retrying."},
    {q:"Why can retries be dangerous?", o:["They cost nothing","If an action already happened, a retry can repeat it (a second SMS or payment)","They're slow","They change the model"], a:1, why:"Make side-effecting actions safe to repeat first."},
    {q:"What does streaming improve?", o:["Accuracy","How quickly the user sees the reply start","The price","The context window"], a:1, why:"Text appears as it's generated instead of after the whole reply."}
  ]
}
];
