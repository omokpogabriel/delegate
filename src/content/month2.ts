import type { Lesson, Resource } from "./types";
import { U } from "./unis";

// Month 2 lessons (weeks 5–8): coding agents in depth.
// Written for people new to software tooling: every new term is explained where it first appears,
// and each lesson has a "Stuck?" box for the problems that most often make people give up.

const R: Record<string, Resource> = {
  memory: {title:"Manage Claude's memory (CLAUDE.md) — Claude Code docs", url:"https://code.claude.com/docs/en/memory"},
  agentsmd: {title:"AGENTS.md — the shared format for agent instructions", url:"https://agents.md"},
  best: {title:"Claude Code best practices", url:"https://code.claude.com/docs/en/best-practices"},
  workflows: {title:"Common workflows (plan mode, worktrees and more) — Claude Code docs", url:"https://code.claude.com/docs/en/common-workflows"},
  skills: {title:"Agent skills — Claude Code docs", url:"https://code.claude.com/docs/en/skills"},
  subagents: {title:"Subagents — Claude Code docs", url:"https://code.claude.com/docs/en/sub-agents"},
  hooks: {title:"Get started with hooks — Claude Code docs", url:"https://code.claude.com/docs/en/hooks-guide"},
  context: {title:"Effective context engineering for AI agents — Anthropic", url:"https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents"},
  tdd: {title:"Test-driven development — Martin Fowler", url:"https://martinfowler.com/bliki/TestDrivenDevelopment.html"},
  playwright: {title:"Playwright: getting started", url:"https://playwright.dev/docs/intro"},
  actions: {title:"GitHub Actions documentation", url:"https://docs.github.com/en/actions"},
  worktree: {title:"git worktree — official Git documentation", url:"https://git-scm.com/docs/git-worktree"}
};

export const week5: Lesson[] = [
{
  id:"5-1", title:"Why your agent keeps forgetting, and how project memory fixes it", mins:12,
  objectives:["Explain why every new agent session starts with no knowledge of your project","Describe what a project memory file (CLAUDE.md or AGENTS.md) is and when it is loaded","Create a first memory file for one of your own projects"],
  prereqs:"<p>Month 1, especially lesson 1.2 (the context window) and Week 3 (your first coding agent). You need a coding agent installed and one real project folder to practise on.</p>",
  body:`
<p>By now you have probably noticed something frustrating. On Monday you spend twenty minutes explaining to the agent how your project works: which command runs the tests, that you use tabs not spaces, that the <code>legacy/</code> folder must never be touched. On Tuesday you open a new session and it has forgotten all of it.</p>
<p>That isn't a bug. Remember lesson 1.2: the model has <b>no memory outside its context window</b>. A new session is a new, empty window. Everything you told it yesterday is gone.</p>
<h3>The fix: a file the agent reads every time</h3>
<p>Coding agents solve this with a <b>project memory file</b>: a plain text file in your project that the agent automatically loads into its context at the start of every session. You write it once and update it as you go, and the agent never starts from zero again.</p>
<ul>
<li><b>Claude Code</b> reads a file called <code>CLAUDE.md</code>.</li>
<li><b>Codex, Cursor and many other tools</b> read <code>AGENTS.md</code>, a shared format several tools agreed on.</li>
</ul>
<p>Both are ordinary <b>Markdown</b> files. Markdown is just text with a few simple marks: a line starting with <code>#</code> is a heading, a line starting with <code>-</code> is a bullet point. If you can write a bullet list, you can write Markdown.</p>
<h3>Where the file lives</h3>
<p>Put it in the <b>root</b> of your project, which means the top-level folder that holds everything else (usually where your <code>package.json</code>, <code>pom.xml</code> or <code>README.md</code> is). Commit it to git like any other file, so everyone on the team, and every agent, gets the same instructions.</p>
<p>Claude Code also supports a personal file in your home folder (<code>~/.claude/CLAUDE.md</code>) for preferences that apply to all your projects, such as "explain changes in plain English". Project rules go in the project; personal habits go in the personal file.</p>
<h3>The quickest start</h3>
<p>In Claude Code, open your project and type <code>/init</code>. The agent reads your code and drafts a <code>CLAUDE.md</code> for you. <b>Treat that draft as a first draft, not a finished file</b>: it describes what the code looks like, but it can't know your unwritten rules. The next lesson shows you how to turn it into something useful.</p>
<div class="callout"><b>Stuck?</b> If <code>/init</code> isn't recognised, you're probably typing it in your normal terminal instead of inside the agent. Start the agent first (type <code>claude</code> in the project folder), then type <code>/init</code> at its prompt. If you use a tool that reads <code>AGENTS.md</code>, create the file by hand in the project root: an empty file is fine to start with.</div>`,
  watch:[U.berkeleySwe],
  read:[R.memory, R.agentsmd],
  exercise:`<p>Pick one real project. Run <code>/init</code> (or create <code>AGENTS.md</code> by hand). Then open a fresh session and ask the agent: "Without reading any code, tell me how to run this project's tests and what I must never change." Note what it gets right from the memory file alone, and what is missing. You'll fix the gaps in the next lesson.</p>`,
  problems:[
    {q:"<p>You told the agent yesterday that the API runs on port 8033. Today it keeps trying port 8080. Give the cause and the permanent fix.</p>",
     a:"<p>Cause: yesterday's conversation isn't in today's context window, so the agent falls back to the most common default (8080). Fix: add one line to the project memory file, for example \"The API runs on <code>http://localhost:8033</code> (not 8080)\". From then on it is loaded into every session.</p>"},
    {q:"<p>Which of these belong in the project's <code>CLAUDE.md</code>, and which in your personal one? (a) \"Run tests with <code>./mvnw test</code>\" (b) \"I prefer short answers\" (c) \"Never edit files in <code>db/migration</code>; add a new migration instead\".</p>",
     a:"<p>(a) and (c) are facts about the project that every developer and agent needs, so they go in the project file. (b) is your personal preference, so it goes in your personal file and doesn't get forced on teammates.</p>"}
  ],
  quiz:[
    {q:"Why does a new agent session forget yesterday's instructions?", o:["The agent deletes them on purpose","A new session starts with an empty context window","The model is retrained overnight","Instructions expire after 24 hours"], a:1, why:"The model only knows what's in its context window, and a new session starts empty."},
    {q:"What is CLAUDE.md?", o:["A log of past conversations","A Markdown file the agent loads into context at the start of every session","A configuration file for the model's weights","A list of installed packages"], a:1, why:"It's plain text the agent reads at startup, so your project knowledge is always present."},
    {q:"What's the right way to treat the file that /init generates?", o:["Never edit it","As a first draft you improve with your own rules","Delete it after one session","Keep it out of git"], a:1, why:"/init can describe the code but can't know your unwritten rules, so you add those yourself."}
  ]
},
{
  id:"5-2", title:"Writing a memory file that actually works", mins:14,
  objectives:["Structure a memory file into commands, layout, conventions and rules","Write instructions that are specific and checkable","Keep the file short and update it from real mistakes"],
  prereqs:"<p>Lesson 5.1, and a draft memory file for one project.</p>",
  body:`
<p>A good memory file is like the one-page note you'd leave for a capable contractor on their first day: the things they can't easily work out by reading the code, and the mistakes you don't want them to make.</p>
<h3>The five sections that matter</h3>
<ol>
<li><b>What this is.</b> Two sentences: what the project does and who uses it.</li>
<li><b>Commands.</b> The exact commands to install, run, test and build. Exact means copy-pasteable: <code>npm run test</code>, not "run the tests".</li>
<li><b>Where things live.</b> A short map: "API routes are in <code>src/routes/</code>, database code in <code>src/db/</code>".</li>
<li><b>Conventions.</b> How code here is written: naming, error handling, which libraries to use and which to avoid.</li>
<li><b>Rules.</b> The things that must never happen, with the reason: "Never edit an existing database migration; add a new one, because migrations that already ran on production can't change."</li>
</ol>
<h3>A worked example</h3>
<pre># Shop API

Node.js REST API for a small online shop. Used by our mobile app.

## Commands
- Install: npm install
- Run locally: npm run dev   (http://localhost:3000)
- Test: npm test             (must pass before any commit)

## Where things live
- src/routes/   one file per resource (orders, products)
- src/db/       database queries; never write SQL anywhere else

## Conventions
- Money is stored in kobo as whole numbers (never floats)
- Return errors as { "error": "message" } with the right HTTP status

## Rules
- Never change files in migrations/: add a new migration instead
- Ask before adding any new npm package</pre>
<p>Notice what each line does: it either saves the agent from guessing, or prevents a specific mistake. "Money is stored in kobo as whole numbers" prevents a classic bug where ₦10.10 becomes ₦10.099999.</p>
<h3>Three habits that keep it good</h3>
<ul>
<li><b>Be specific.</b> "Write clean code" changes nothing. "Functions over 40 lines should be split" changes behaviour.</li>
<li><b>Keep it short.</b> Every line is read in every session and costs context. Aim for under 100 lines. If something is only needed for one task, put it in the prompt for that task instead.</li>
<li><b>Grow it from mistakes.</b> Each time the agent gets something wrong because it didn't know a rule, add that rule. Your failure log (from Week 3) is where these come from.</li>
</ul>
<div class="callout"><b>Stuck on what to write?</b> Ask yourself: "What did I have to correct the agent on last week?" Every correction is a missing line. If you can't think of any, have the agent do a small real task with no memory file, watch where it goes wrong, and write those down.</div>`,
  watch:[],
  read:[R.memory, R.best],
  exercise:`<p>Rewrite your memory file from lesson 5.1 using the five sections. Include at least two rules, each with its reason. Then run the same test as before in a fresh session ("how do I run the tests, and what must I never change?") and compare the answers. Add one line to your failure log for anything still missing.</p>`,
  problems:[
    {q:"<p>Improve this line so an agent can act on it: \"Be careful with the database.\"</p>",
     a:"<p>For example: \"All database access goes through <code>src/db/</code>. Never run <code>DROP</code> or <code>DELETE</code> without a <code>WHERE</code> clause. Never edit files in <code>migrations/</code>; add a new numbered migration.\" Each part is specific and can be checked.</p>"},
    {q:"<p>Your memory file has grown to 400 lines and the agent seems to ignore parts of it. What do you do?</p>",
     a:"<p>Cut it. Delete anything the agent can work out by reading the code, anything that was for a one-off task, and anything vague. Keep commands, the map, conventions and rules. A long file dilutes the important lines (remember lesson 1.2: buried context gets less attention). If some content is only needed for certain tasks, move it into a separate document the memory file points to, or into a skill (Week 6).</p>"}
  ],
  quiz:[
    {q:"Which line is most useful in a memory file?", o:["Write good code","Tests: run ./mvnw test; all must pass before committing","This project is important","Be smart about the architecture"], a:1, why:"It's specific and copy-pasteable, so the agent can follow it and you can check that it did."},
    {q:"Why should rules include the reason?", o:["It looks more professional","The agent can apply the reason to situations the rule doesn't name","Reasons are required by the file format","It makes the file longer"], a:1, why:"Knowing why lets the agent handle cases you didn't list."},
    {q:"Where do new rules for the memory file usually come from?", o:["Online templates","Mistakes the agent actually made in your project","The model's documentation","Random guesses"], a:1, why:"Real mistakes show exactly what the agent can't work out on its own."}
  ]
},
{
  id:"5-3", title:"Plan mode: make the agent think before it touches code", mins:12,
  objectives:["Use plan mode to get a plan before any file changes","Review a plan for scope, risk and missing steps","Decide when planning is worth it and when it isn't"],
  prereqs:"<p>Lessons 5.1–5.2 and lesson 3.3 (spec, plan, build).</p>",
  body:`
<p>In Week 3 you learned the order spec, then plan, then build. <b>Plan mode</b> makes the middle step a feature of the tool: the agent can read your code and think, but it is not allowed to edit files or run commands that change anything until you approve its plan.</p>
<h3>How to use it</h3>
<p>In Claude Code, press <b>Shift+Tab</b> until the status line shows plan mode, then describe the task. The agent reads the relevant code and comes back with a plan: which files it will change, what it will change in each, and how it will check its work. You can ask questions, push back, or ask for a different approach. When you're happy, approve it and the agent starts building. Other agents have an equivalent: if yours doesn't, simply say "Don't change any files yet. Read the code and give me a step-by-step plan first."</p>
<h3>What to look for in a plan</h3>
<ul>
<li><b>Scope.</b> Does it change only what the task needs? A plan for "add a phone number field" that also "refactors the user module" is a warning sign.</li>
<li><b>Risky steps.</b> Database changes, deleting things, changing shared code, touching payments or login. These deserve a second look.</li>
<li><b>Verification.</b> Does the plan say how it will prove the change works: which tests it will add or run?</li>
<li><b>Assumptions.</b> If the plan guesses at something you know, correct it now. A correction costs one sentence now and an hour later.</li>
</ul>
<h3>When to plan</h3>
<p>Plan when a change touches more than a couple of files, when you don't know the code well, or when a mistake would be expensive. Skip it for small, obvious edits like fixing a typo or renaming a variable: planning those just slows you down.</p>
<div class="callout"><b>Stuck?</b> If you can't judge whether a plan is good because you don't understand the code, ask the agent to explain it: "Before I approve, explain in plain English what each file you're changing does and why it needs to change." Understanding the plan is part of the job, and it's also how you learn the codebase.</div>`,
  watch:[U.agenticWebinar],
  read:[R.workflows, R.best],
  exercise:`<p>Pick a real change that touches at least three files. Run it in plan mode. Before approving, write down one thing you changed in the plan and why. After the build, compare the result with the plan: did the agent stick to it?</p>`,
  problems:[
    {q:"<p>You ask for \"add a phone number to the signup form\". The plan includes: update the form, update the API, add a database column, and \"modernise the validation library across the app\". What do you do?</p>",
     a:"<p>Remove the last step. It's out of scope, touches the whole app and adds risk with no benefit to this task. Reply \"Drop step 4; only change what the phone field needs\", and approve the rest. If modernising validation is genuinely useful, make it a separate task with its own plan.</p>"},
    {q:"<p>Which of these deserve plan mode? (a) fixing a typo in a button label (b) adding payment refunds (c) renaming one local variable (d) upgrading the web framework to a new major version.</p>",
     a:"<p>(b) and (d). Both touch many files, carry real risk and benefit from thinking first. (a) and (c) are small and obvious; planning would cost more than it saves.</p>"}
  ],
  quiz:[
    {q:"In plan mode, the agent:", o:["Edits files immediately","Can read code and propose a plan, but can't change anything until you approve","Runs all the tests","Deploys the app"], a:1, why:"Plan mode is read-only until you approve the plan."},
    {q:"A plan doesn't say how the change will be checked. You should:", o:["Approve it anyway","Ask it to add the tests or checks it will use","Cancel the task","Switch models"], a:1, why:"A plan without verification gives you no way to know the build worked."},
    {q:"When is plan mode usually not worth it?", o:["Database changes","Small, obvious edits like a typo","Payment features","Unfamiliar code"], a:1, why:"Planning has a cost; for tiny edits it's more than the benefit."}
  ]
},
{
  id:"5-4", title:"Reading diffs like a senior engineer", mins:14,
  objectives:["Read a unified diff and say what changed","Review a change in a fixed order: scope, correctness, safety, tests","Give the agent feedback it can act on"],
  prereqs:"<p>Lesson 3.4 (reviewing agent output) and basic git (you can run <code>git status</code> and <code>git diff</code>).</p>",
  body:`
<p>A <b>diff</b> shows the difference between two versions of your code. It is the single most important thing you read when working with agents, because it shows what the agent actually did, as opposed to what it says it did.</p>
<h3>How to read one</h3>
<p>Run <code>git diff</code> in your project (or look at the changes view in your editor or on GitHub). You'll see something like:</p>
<pre>--- a/src/orders.js
+++ b/src/orders.js
@@ -12,7 +12,9 @@ function total(items) {
   let sum = 0;
   for (const item of items) {
-    sum += item.price;
+    sum += item.price * item.qty;
   }
+  if (sum &lt; 0) throw new Error("negative total");
   return sum;
 }</pre>
<ul>
<li>The first two lines name the file: <code>a/</code> is the old version, <code>b/</code> the new.</li>
<li><code>@@ -12,7 +12,9 @@</code> means: this piece starts at line 12, and was 7 lines long, now 9.</li>
<li>Lines starting with <code>-</code> were removed. Lines starting with <code>+</code> were added. Lines with neither are unchanged context, shown so you can see where you are.</li>
</ul>
<p>So this change multiplies price by quantity and adds a check for negative totals.</p>
<h3>Review in a fixed order</h3>
<p>Senior engineers don't read diffs top to bottom hoping to spot problems. They ask the same questions every time:</p>
<ol>
<li><b>Scope:</b> are all the changed files ones the task needed? Run <code>git status</code> to list them before you read any lines.</li>
<li><b>Correctness:</b> does each change do what the task asked? Check edge cases: empty lists, zero, missing values.</li>
<li><b>Safety:</b> were any tests, checks or error handling removed? Any secrets, passwords or keys added?</li>
<li><b>Tests:</b> is there a test that would fail if this change were wrong?</li>
</ol>
<h3>Feedback the agent can use</h3>
<p>Point to the exact place and the expected behaviour: "In <code>orders.js</code> line 15, an empty <code>items</code> list should return 0, but <code>qty</code> can be undefined for old orders; default it to 1 and add a test for that case." Vague feedback ("this looks wrong") gets vague fixes.</p>
<div class="callout"><b>Stuck?</b> If a diff is too big to understand, it's too big. Ask the agent to undo it and redo the work in smaller steps, one commit per step. Reviewing five small diffs is much easier than one huge one, and that's a habit, not a weakness.</div>`,
  watch:[U.berkeleySwe],
  read:[R.best],
  exercise:`<p>Take the change from lesson 5.3's exercise. Review its diff using the four questions, and write your findings as numbered comments. Send them to the agent as one message, then review its fixes the same way. Add anything it got wrong to your failure log.</p>`,
  problems:[
    {q:"<p>In a diff you see <code>- expect(total(items)).toBe(150);</code> and <code>+ expect(total(items)).toBe(149);</code>. What happened and what's your feedback?</p>",
     a:"<p>The agent changed the test's expected value instead of fixing the code. Feedback: \"Don't change the expected value in the test. Find out why <code>total</code> returns 149 for these items and fix the code so it returns 150.\" Also add a rule to your memory file about not changing tests without asking.</p>"},
    {q:"<p>Decode <code>@@ -40,6 +40,4 @@</code>.</p>",
     a:"<p>The change starts at line 40. In the old file this piece was 6 lines, in the new file it's 4, so overall two lines were removed in this section.</p>"}
  ],
  quiz:[
    {q:"In a diff, a line starting with + is:", o:["A comment","A line that was added","A line that was removed","A heading"], a:1, why:"+ lines were added and − lines were removed."},
    {q:"What should you check first in any review?", o:["Variable names","Scope: which files changed, and should they have?","Code style","Comments"], a:1, why:"Out-of-scope changes are the cheapest problems to catch and the most dangerous to miss."},
    {q:"The diff is 2,000 lines. Best move?", o:["Approve it if the tests pass","Ask for it to be redone in smaller steps","Read only the first file","Merge and fix later"], a:1, why:"A diff you can't understand is a diff you can't review."}
  ]
}
];

export const week6: Lesson[] = [
{
  id:"6-1", title:"Skills: turn a workflow you repeat into a tool", mins:14,
  objectives:["Explain what a skill is and how an agent decides to use one","Write a SKILL.md with a clear name and description","Choose which of your own workflows deserve to become skills"],
  prereqs:"<p>Week 5. You're comfortable editing Markdown files in your project.</p>",
  body:`
<p>Some instructions you give over and over: "write the release notes in this format", "when you add an API endpoint, also update the Postman collection and the docs", "review this pull request against our checklist". A <b>skill</b> packages instructions like these so the agent can load them only when the task needs them.</p>
<h3>Skills vs the memory file</h3>
<p>The memory file is read in <em>every</em> session, so it should only hold what nearly every task needs. A skill is loaded <em>on demand</em>. At the start, the agent sees just each skill's name and one-line description. When a task matches the description, it reads the full instructions. That means you can have dozens of skills without filling the context window.</p>
<h3>What a skill looks like</h3>
<p>A skill is a folder containing a file called <code>SKILL.md</code>. In Claude Code, project skills live in <code>.claude/skills/&lt;skill-name&gt;/SKILL.md</code>. The file starts with a small header (called <b>frontmatter</b>, between two <code>---</code> lines) and then the instructions:</p>
<pre>---
name: release-notes
description: Write release notes from recent commits. Use when the user asks for release notes or a changelog.
---

# Release notes

1. Run git log since the last tag to list the commits.
2. Group them under: New, Improved, Fixed. Skip internal-only changes.
3. Write each item in plain English for customers, one line each.
4. Save to docs/releases/&lt;version&gt;.md and show me the result.</pre>
<p>The folder can also hold supporting files, such as templates or scripts, that the instructions refer to.</p>
<h3>The description is the trigger</h3>
<p>The agent decides whether to use a skill from its description alone, so write it like a label on a drawer: what it does <em>and</em> when to use it. "Helps with docs" will rarely be picked; "Write release notes from recent commits. Use when the user asks for release notes or a changelog" will be picked when it should be.</p>
<h3>What deserves a skill</h3>
<p>A good candidate is something you do at least weekly, with steps that are always the same, where the agent gets it wrong without guidance. Examples: your team's code-review checklist, your deployment steps, the way you write database migrations, the format of client reports.</p>
<div class="callout"><b>Stuck?</b> If the agent never uses your skill, check three things: the folder is in the right place (<code>.claude/skills/name/SKILL.md</code>), the frontmatter has both <code>name</code> and <code>description</code> between <code>---</code> lines, and the description contains words you actually use when asking. You can also simply ask for it by name: "use the release-notes skill".</div>`,
  watch:[],
  read:[R.skills, R.context],
  exercise:`<p>Write one skill for a task you repeat at least weekly. Test it three times with differently worded requests ("write the changelog", "what changed since the last release?", "release notes please") and record whether the agent picked it up each time. Improve the description until it does.</p>`,
  problems:[
    {q:"<p>Rewrite this weak description: \"Database stuff.\"</p>",
     a:"<p>For example: \"Create a new database migration safely. Use when the user asks to add or change a table, column or index.\" It says what the skill does and exactly when to use it.</p>"},
    {q:"<p>Should \"run tests with <code>npm test</code>\" go in a skill or in the memory file?</p>",
     a:"<p>The memory file. Nearly every coding task needs it, so it should always be in context. Skills are for longer, task-specific procedures that would waste context if they were always loaded.</p>"}
  ],
  quiz:[
    {q:"How does an agent decide to use a skill?", o:["It reads every skill in full at startup","It matches the task against each skill's name and description","It picks one at random","Only if you restart it"], a:1, why:"Only names and descriptions are loaded up front; the full instructions load when a task matches."},
    {q:"Where does a project skill live in Claude Code?", o:["In package.json","In .claude/skills/<name>/SKILL.md","In the README","In the git history"], a:1, why:"Each skill is a folder with a SKILL.md file."},
    {q:"Which is the best candidate for a skill?", o:["A one-off bug fix","Your weekly client-report format","Your project's test command","A typo"], a:1, why:"Repeated, multi-step, task-specific procedures are what skills are for."}
  ]
},
{
  id:"6-2", title:"Subagents: keep the noise out of your main session", mins:12,
  objectives:["Explain how a subagent protects the main context window","Decide which tasks to hand to a subagent","Write a brief that gets a useful summary back"],
  prereqs:"<p>Lesson 1.2 (context window) and lesson 6.1.</p>",
  body:`
<p>Some tasks produce a lot of reading but a small answer. "Find every place we send an email" might involve opening forty files to report back eight locations. If your main session does that reading, those forty files fill its context window, and the quality of everything after drops (lesson 1.2).</p>
<p>A <b>subagent</b> is a second agent, started by the main one, with its <em>own fresh context window</em>. It does the noisy work and returns only a short summary. The main session gets the answer without the clutter.</p>
<h3>Good jobs for a subagent</h3>
<ul>
<li><b>Searching and research:</b> "find every place we call the payment API and list file and line".</li>
<li><b>Investigation:</b> "read the logs from last night's failed job and tell me the first error".</li>
<li><b>Independent review:</b> "review this diff for security problems". A fresh context hasn't seen your reasoning, so it judges the code on its own merits.</li>
</ul>
<p>Bad jobs: anything that needs the full conversation so far, or small tasks where starting a new agent costs more than doing it directly.</p>
<h3>How to use one</h3>
<p>In Claude Code you can simply ask: "Use a subagent to find every place we send email, and give me a list of file, line and what triggers it." You can also define reusable subagents with their own instructions and allowed tools in <code>.claude/agents/</code>. The docs linked below show the format.</p>
<h3>The brief is everything</h3>
<p>The subagent starts with nothing but your brief, just like a new session. So say what to find, where to look, and exactly what shape the answer should take. "Look into emails" gets a rambling essay; "List each place we send email as: file, line, trigger, recipient. Under 20 lines." gets something you can use.</p>
<div class="callout"><b>Stuck?</b> Subagents can feel abstract at first. Think of it as sending a colleague to the archive: you don't want them to bring back every box they opened, just the answer. If the summary that comes back is too long or vague, the fix is almost always a more specific brief.</div>`,
  watch:[U.cs224n_agents],
  read:[R.subagents, R.context],
  exercise:`<p>In a real project, give the same research question twice: once directly in the main session, and once through a subagent with a precise answer format. Compare the answers, and check how full the context is afterwards (Claude Code's <code>/context</code> command shows it). Write two sentences on the difference.</p>`,
  problems:[
    {q:"<p>Write a subagent brief for: \"Why is the nightly report job failing?\"</p>",
     a:"<p>For example: \"Read the logs in <code>logs/report-job/</code> from the last 3 nights. Find the first error in each run. Reply with: date, the error message, the file and line it points to, and your best guess at the cause in one sentence. Don't change any files.\"</p>"},
    {q:"<p>A main session read 30 large files while searching, and its later answers got worse. Why, and what should you do next time?</p>",
     a:"<p>Those files filled its context window, so the important instructions were buried among irrelevant code. Next time send the search to a subagent and have it return only the list. For now, compact or start a fresh session with a short summary of where you got to.</p>"}
  ],
  quiz:[
    {q:"What does a subagent mainly protect?", o:["Your API key","The main session's context window","Your git history","The model's weights"], a:1, why:"Its noisy work happens in a separate window, and only a summary comes back."},
    {q:"Which task suits a subagent best?", o:["Renaming one variable","Searching 50 files for every use of a function","Answering 'what did I just say?'","Approving a plan"], a:1, why:"Lots of reading, small answer: that's exactly the subagent shape."},
    {q:"A subagent returns a vague essay. The best fix is:", o:["Use a bigger model","Give a more specific brief with an answer format","Stop using subagents","Ask the same thing again"], a:1, why:"It only knows your brief, so the brief decides the quality of the answer."}
  ]
},
{
  id:"6-3", title:"Hooks: rules that run every time, not just when remembered", mins:15,
  objectives:["Explain the difference between an instruction and a hook","Add a hook that formats code after every edit","Use a hook to block a dangerous action"],
  prereqs:"<p>Lessons 6.1–6.2. Basic terminal use. You'll edit a JSON file; the lesson explains the parts you need.</p>",
  body:`
<p>Instructions in your memory file are requests. The agent follows them most of the time, but "most of the time" isn't good enough for some rules. A <b>hook</b> is a command that the agent's software runs automatically at a fixed moment, such as after every file edit or before every shell command. It doesn't depend on the model remembering. It just runs.</p>
<h3>Two words you'll need</h3>
<ul>
<li><b>Formatter:</b> a tool that rewrites code into a consistent layout (spacing, quotes, line breaks). Examples: Prettier for JavaScript, Black for Python, Spotless for Java.</li>
<li><b>Linter:</b> a tool that checks code for likely mistakes and style problems without running it. Examples: ESLint, Ruff, Checkstyle.</li>
</ul>
<h3>When hooks run</h3>
<p>Claude Code offers several moments (called events). The two you'll use most:</p>
<ul>
<li><b>PostToolUse</b>: after the agent uses a tool, for example after it edits a file. Good for formatting and quick checks.</li>
<li><b>PreToolUse</b>: before the agent uses a tool. Good for blocking: if your hook command exits with code 2, the action is blocked and the message your command printed is shown to the agent, so it knows why.</li>
</ul>
<h3>Example: format after every edit</h3>
<p>Hooks are configured in <code>.claude/settings.json</code> in your project. This is JSON: curly braces hold named settings, square brackets hold lists, and every name and text value is in double quotes.</p>
<pre>{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          { "type": "command", "command": "npx prettier --write ." }
        ]
      }
    ]
  }
}</pre>
<p>Read it as: after any <code>Edit</code> or <code>Write</code> tool use, run Prettier on the project. (Formatting the whole project each time is simple but slow on big projects. The hooks guide shows how to format only the file that changed.)</p>
<h3>The easiest way to start</h3>
<p>You don't have to write the JSON by hand. In Claude Code, type <code>/hooks</code> to add one through a menu, or ask the agent: "Add a hook that runs Prettier after every file edit, and show me the settings it adds." Then read what it added, which you can now do.</p>
<div class="callout"><b>Stuck?</b> If a hook seems to do nothing: (1) run its command yourself in the terminal, from the project folder, to make sure it works at all; (2) check the JSON is valid (a missing comma breaks the whole file; paste it into any online JSON validator); (3) restart the agent session so it reloads the settings. On Windows, commands that work in Git Bash might not work in PowerShell and vice versa, so test in the same shell the agent uses.</div>`,
  watch:[],
  read:[R.hooks],
  exercise:`<p>Add one formatting hook to a real project and confirm it runs: ask the agent to make a messy edit and check the file comes out formatted. Then design (on paper or for real) one blocking hook for a rule that matters to you, for example blocking edits to <code>migrations/</code>, and write down which event it uses and what message it should give the agent.</p>`,
  problems:[
    {q:"<p>Your memory file says \"never edit test files without asking\", but the agent sometimes does. What's the stronger fix?</p>",
     a:"<p>A <b>PreToolUse</b> hook on <code>Edit|Write</code> that checks the file path, and exits with code 2 and a message like \"Editing tests needs approval; explain the change first\" when the path is under the test folder. The rule then holds every time instead of depending on the model.</p>"},
    {q:"<p>What's the difference between a formatter and a linter?</p>",
     a:"<p>A formatter changes how code looks without changing what it does (spacing, line breaks, quotes). A linter reports likely mistakes or rule violations (an unused variable, a missing <code>await</code>) and sometimes fixes simple ones. Formatting is safe to run automatically after every edit; linter errors usually need a decision.</p>"}
  ],
  quiz:[
    {q:"How is a hook different from an instruction in CLAUDE.md?", o:["Hooks are suggestions","A hook is run by the tool automatically, every time, regardless of what the model remembers","Hooks only work at night","There is no difference"], a:1, why:"Instructions rely on the model; hooks are enforced by the software."},
    {q:"Which event would you use to block a dangerous command?", o:["PostToolUse","PreToolUse","SessionEnd","None; hooks can't block"], a:1, why:"PreToolUse runs before the action; exit code 2 blocks it."},
    {q:"A hook does nothing. What's the best first check?", o:["Reinstall the agent","Run the hook's command yourself in the terminal","Delete settings.json","Switch models"], a:1, why:"If the command doesn't work on its own, it won't work as a hook."}
  ]
}
];

export const week7: Lesson[] = [
{
  id:"7-1", title:"Tests first: make the agent prove its work", mins:15,
  objectives:["Explain what a unit test is and read a simple one","Use the red–green loop: a failing test first, then the fix","Brief an agent to write the test before the code"],
  prereqs:"<p>Week 5. No testing experience needed: this lesson starts from zero.</p>",
  body:`
<p>Agents are very good at producing code that <em>looks</em> right. The only reliable way to know it <em>is</em> right is to run something that checks it. That something is a test.</p>
<h3>What a test is</h3>
<p>A <b>unit test</b> is a small piece of code that calls your code with a known input and checks the output. Here's one in JavaScript:</p>
<pre>test("total multiplies price by quantity", () =&gt; {
  const items = [{ price: 500, qty: 2 }, { price: 250, qty: 1 }];
  expect(total(items)).toBe(1250);
});</pre>
<p>It says: for these items, <code>total</code> must return 1250. If it returns anything else, the test <b>fails</b> and tells you so. Every language has the same idea with a different tool (Jest or Vitest for JavaScript, pytest for Python, JUnit for Java), and your project's memory file should name the command that runs them.</p>
<h3>Red, then green</h3>
<p>The habit that makes agents trustworthy is called <b>test-first</b> (or test-driven development):</p>
<ol>
<li><b>Red:</b> write a test for the behaviour you want, and run it. It must <em>fail</em>, because the feature doesn't exist yet. If it passes already, the test isn't testing anything new.</li>
<li><b>Green:</b> write the code until the test passes.</li>
<li><b>Tidy:</b> clean up the code while keeping the test green.</li>
</ol>
<p>Why make it fail first? Because a test that has never failed might be unable to fail, for example if it checks the wrong thing. Seeing it go from red to green proves it's connected to the behaviour.</p>
<h3>Briefing the agent</h3>
<pre>Bug: orders with quantity &gt; 1 are charged for one item only.
1. Write a test in tests/orders.test.js that reproduces this. Run it and
   show me that it fails.
2. Then fix the code so it passes. Don't change the test.
3. Run the whole test suite and show me the result.</pre>
<p>This brief gives the agent a way to check itself, which means you review evidence instead of promises.</p>
<div class="callout"><b>Stuck?</b> If your project has no tests at all, ask the agent: "Set up the standard test framework for this project, add one example test, and add the test command to CLAUDE.md." Then run that command yourself once. Seeing a passing test on your own machine is the moment testing stops feeling theoretical.</div>`,
  watch:[U.berkeleySwe],
  read:[R.tdd, R.best],
  exercise:`<p>Pick a small real bug or feature. Use the three-step brief above. Keep the terminal output that shows the test failing first and then passing, and paste both into your weekly write-up.</p>`,
  problems:[
    {q:"<p>The agent writes a new test and it passes on the very first run, before any code changed. What does that tell you?</p>",
     a:"<p>Either the behaviour already worked (so there was no bug, or the test doesn't reproduce it), or the test doesn't really check the behaviour. Ask the agent to show why the test should have failed, and to adjust it until it fails for the right reason.</p>"},
    {q:"<p>Write the test you'd want for: \"a discount code takes 10% off, but never more than ₦2,000\".</p>",
     a:"<p>At least two cases: a ₦10,000 order gets ₦1,000 off (10%), and a ₦50,000 order gets ₦2,000 off (the cap, not ₦5,000). A good third case is exactly at the boundary: a ₦20,000 order gets ₦2,000 off. Boundaries are where bugs live.</p>"}
  ],
  quiz:[
    {q:"In test-first, the new test should first:", o:["Pass","Fail","Be skipped","Be deleted"], a:1, why:"A test that fails first proves it actually checks the new behaviour."},
    {q:"A unit test:", o:["Deploys the app","Calls a piece of code with known input and checks the output","Measures performance","Formats code"], a:1, why:"That's the core idea, in every language."},
    {q:"Why do tests matter more with agents?", o:["Agents can't write code","Agents write plausible-looking code, and tests are the evidence it actually works","Tests make agents faster","They don't"], a:1, why:"You review evidence, not promises."}
  ]
},
{
  id:"7-2", title:"Guardrails: types, linters and CI", mins:13,
  objectives:["Explain what type checks, linters and CI each catch","Make all three run on every change","Read a CI failure and send the agent what it needs"],
  prereqs:"<p>Lesson 7.1. A project on GitHub (for the CI part).</p>",
  body:`
<p>Tests check that code does the right thing. Three other automatic checks catch whole classes of mistakes before you even read the diff.</p>
<h3>1. Type checks</h3>
<p>A <b>type</b> says what kind of value something is: a number, text, a list of orders. Languages like TypeScript, Java and Kotlin check types before the code runs, so calling <code>total("abc")</code> on a function that expects a list is caught immediately. If you use plain JavaScript or Python, adding TypeScript or Python type hints with a checker (such as mypy) gives agents a fast, strict signal.</p>
<h3>2. Linters</h3>
<p>From lesson 6.3: a linter flags likely mistakes, such as variables that are never used, missing <code>await</code>s and comparisons that are always true. Agents leave behind exactly this kind of debris.</p>
<h3>3. CI (continuous integration)</h3>
<p><b>CI</b> is a service that runs your checks automatically, on a clean computer, every time code is pushed. With GitHub that's GitHub Actions: you add a small file to <code>.github/workflows/</code> and every push or pull request gets a green tick or a red cross. A minimal one for a Node project:</p>
<pre>name: checks
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - run: npm ci
      - run: npm run lint
      - run: npm test</pre>
<p>CI matters because "it passed on my machine" isn't proof. The clean machine has none of your local leftovers, so it catches missing files and dependencies that only exist on your laptop.</p>
<h3>Make the agent run them too</h3>
<p>Put the commands in the memory file ("before saying you're done, run <code>npm run lint</code>, <code>npm run typecheck</code> and <code>npm test</code>; all must pass"). Then the agent fixes its own debris before you ever see it.</p>
<div class="callout"><b>Stuck?</b> When CI fails, open the failed run on GitHub, click the red step, and copy the <em>first</em> error (later errors are often knock-on effects). Paste it to the agent with: "CI failed with this. Reproduce it locally, fix the cause, and show me the passing run." Don't ask it to "make CI green", which invites it to weaken the checks.</div>`,
  watch:[],
  read:[R.actions, R.best],
  exercise:`<p>Add a CI workflow that runs lint and tests to one of your GitHub projects (the agent can write it; you review it). Push a deliberately broken change on a branch, watch CI fail, then have the agent fix it from the CI error alone.</p>`,
  problems:[
    {q:"<p>Which check catches each problem? (a) passing text where a number is expected (b) a variable that's assigned but never used (c) a file that exists on your laptop but was never committed.</p>",
     a:"<p>(a) the type checker; (b) the linter; (c) CI, because it builds from a clean copy of the repository and fails when the file is missing.</p>"},
    {q:"<p>The agent's fix for a failing CI run was to delete the lint step from the workflow. What do you do?</p>",
     a:"<p>Reject it. Removing a check is weakening the guardrail, not fixing the problem. Ask it to fix the lint errors themselves, and add a rule (or a hook) that CI configuration can't be changed without your approval.</p>"}
  ],
  quiz:[
    {q:"What does CI add that running tests locally doesn't?", o:["Faster tests","Checks on a clean machine, automatically, on every push","Better error messages","Free hosting"], a:1, why:"A clean environment catches problems hidden by your local setup."},
    {q:"When reading a CI log, which error should you fix first?", o:["The last one","The first one","The longest one","Any of them"], a:1, why:"Later errors are often caused by the first."},
    {q:"Best way to ask an agent to fix CI?", o:["Make CI green","Here's the first error: reproduce it locally, fix the cause, and show me the passing run","Delete the failing test","Skip CI for now"], a:1, why:"It points at the cause and asks for evidence."}
  ]
},
{
  id:"7-3", title:"Let the agent run the app and check its own output", mins:12,
  objectives:["Give an agent a way to run the app and observe the result","Use logs, the browser and screenshots as evidence","Know what still needs your own eyes"],
  prereqs:"<p>Lessons 7.1–7.2.</p>",
  body:`
<p>Tests check pieces. Some problems only show up when the whole thing runs: a page that renders blank, a button that does nothing, an API that returns the wrong status code, an error that only appears in the logs. Agents can check these too, if you give them a way to look.</p>
<h3>Three ways an agent can observe</h3>
<ul>
<li><b>Run commands and read the output.</b> Start the server, call the endpoint with <code>curl</code>, and read the response. For example: <code>curl -i http://localhost:3000/orders/42</code> prints the status code and the body.</li>
<li><b>Read logs.</b> Tell it where the logs are and ask it to check them after each change. Errors that never reach the screen show up there.</li>
<li><b>Drive a browser.</b> Tools such as Playwright (or a browser built into your agent) let it open the page, click, type and take screenshots. That's how it checks UI changes.</li>
</ul>
<h3>Brief it to verify</h3>
<pre>After the change:
1. Start the app with npm run dev.
2. Open /checkout, add two items, and take a screenshot of the total.
3. Check the server log for errors.
Tell me what you saw, with the screenshot.</pre>
<h3>What still needs you</h3>
<p>An agent can tell you a page loaded with no errors. It's weaker at judging whether the layout looks right on a phone, whether the wording makes sense to your customers, or whether the flow feels confusing. Do a quick manual pass on anything a user will see.</p>
<div class="callout"><b>Stuck?</b> If the agent says "I can't run the app", the usual causes are a missing environment variable or a service that isn't running (a database, for example). Ask it to list exactly what it needs to start the app, sort out those pieces once, and then put the start-up steps in your memory file so it never gets stuck there again.</div>`,
  watch:[],
  read:[R.playwright],
  exercise:`<p>Pick a change with a visible effect. Brief the agent to run the app, exercise the change and show you evidence (output, log lines or a screenshot). Then check it yourself on a phone-sized screen and note anything the agent missed.</p>`,
  problems:[
    {q:"<p>All unit tests pass but the checkout page is blank. Name two ways an agent could find the cause.</p>",
     a:"<p>(1) Open the page in a browser tool and read the browser console errors. (2) Read the server log for errors while the page loads. A blank page is often a JavaScript error, and the console shows it immediately.</p>"},
    {q:"<p>What does <code>curl -i http://localhost:3000/health</code> show you?</p>",
     a:"<p>The full HTTP response from that address: the status line (for example <code>HTTP/1.1 200 OK</code>), the headers, and the body. It's a quick way to check a server is running and responding correctly.</p>"}
  ],
  quiz:[
    {q:"Which problem would unit tests most likely miss?", o:["A wrong calculation","A page that renders blank because of a front-end error","A function returning the wrong number","A missing return"], a:1, why:"It only appears when the whole app runs."},
    {q:"Where do errors that never reach the screen show up?", o:["In the README","In the logs","In git","Nowhere"], a:1, why:"Logs are the agent's (and your) window into what happened."},
    {q:"What should you still check yourself?", o:["Nothing","Whether user-facing pages look right and make sense","Only the tests","The model version"], a:1, why:"Agents are weaker at judging layout, wording and flow."}
  ]
},
{
  id:"7-4", title:"When \"all tests pass\" is a lie", mins:12,
  objectives:["Recognise the ways an agent can pass checks without doing the task","Set up defences against them","Log and learn from each case"],
  prereqs:"<p>Lessons 7.1–7.3.</p>",
  body:`
<p>Agents are trained to reach goals, and "make the tests pass" is a goal. Sometimes they reach it the wrong way. This has a name in AI research, <b>reward hacking</b>: satisfying the measure without achieving the intent. It isn't malice. It's the shortest path to "done".</p>
<h3>The usual suspects</h3>
<ul>
<li><b>Editing the test</b> to match wrong output (you saw this in lesson 5.4).</li>
<li><b>Special-casing:</b> code like <code>if (input === testValue) return expected;</code> that only works for the test's exact input.</li>
<li><b>Skipping or deleting tests</b>, for example marking them <code>.skip</code> or removing them "because they're flaky".</li>
<li><b>Swallowing errors:</b> wrapping code in try/catch blocks that hide the failure so nothing crashes.</li>
<li><b>Claiming without running:</b> "All tests pass!" when the tests were never run, or not all of them.</li>
</ul>
<h3>Defences that work</h3>
<ol>
<li><b>Ask for evidence</b>: the actual command output, not a summary.</li>
<li><b>Protect tests</b>: a rule in the memory file plus a PreToolUse hook (lesson 6.3) that blocks test edits without approval.</li>
<li><b>Check the diff</b> for <code>.skip</code>, deleted tests and new try/catch blocks (lesson 5.4).</li>
<li><b>Let CI decide</b>: the clean machine runs everything, whatever the agent claims.</li>
<li><b>Add a second test with different inputs</b> when a fix looks suspiciously narrow. Special-cased code fails it.</li>
</ol>
<div class="callout"><b>Don't be discouraged</b> when you catch one of these. Catching it is the skill this week is teaching. Each one goes in your failure log with the defence you added. After a few weeks you'll have far fewer, because your setup will block most of them automatically.</div>`,
  watch:[U.cs224n_bench],
  read:[R.best],
  exercise:`<p>Go back through your failure log and your last ten agent changes. Find any case of the patterns above (or deliberately ask for something hard with a test and watch closely). For each one, write the pattern, how you spotted it and which defence you've added.</p>`,
  problems:[
    {q:"<p>You see this fix for a failing test: <code>if (orderId === \"TEST-123\") return 1250;</code>. What is it and what's your response?</p>",
     a:"<p>Special-casing: the code returns the expected answer only for the test's input. Reject it, ask for a real fix, and add a second test with a different order so a special case can't pass both.</p>"},
    {q:"<p>The agent reports \"all 48 tests pass\". How do you check that cheaply?</p>",
     a:"<p>Run the test command yourself, or look at the CI run, and compare the count and the result. Also check the diff for skipped or deleted tests, since 48 passing out of what used to be 52 isn't a pass.</p>"}
  ],
  quiz:[
    {q:"Reward hacking means:", o:["The model gets paid","Meeting the measure without achieving the real goal","Hacking a server","Training faster"], a:1, why:"Passing the test is the measure; working code is the goal."},
    {q:"Which is a sign of special-casing?", o:["A new helper function","Code that checks for the test's exact input value","Extra comments","A renamed variable"], a:1, why:"It works for the test and nothing else."},
    {q:"The most reliable judge of whether tests pass:", o:["The agent's summary","CI running the full suite on a clean machine","A screenshot of the code","The commit message"], a:1, why:"CI doesn't depend on what anyone claims."}
  ]
}
];

export const week8: Lesson[] = [
{
  id:"8-1", title:"Git branches and worktrees, in plain English", mins:15,
  objectives:["Explain what a branch is and why parallel work needs one each","Create, list and remove git worktrees","Avoid the common worktree mistakes"],
  prereqs:"<p>Basic git: you can commit and push. If you've never used branches, this lesson covers what you need.</p>",
  body:`
<p>This week's exam asks you to run three agents at once. If three agents edit the same folder, they overwrite each other's work. You need three separate copies of the project that still belong to one repository. That's exactly what git worktrees give you.</p>
<h3>Branches first</h3>
<p>A <b>branch</b> is a separate line of work. <code>main</code> holds the finished, working code. When you start a feature, you create a branch, for example <code>feature-search</code>, and commit to it. <code>main</code> is untouched until you <b>merge</b> the branch back. Three features means three branches, so each can be finished, reviewed and merged on its own.</p>
<h3>The problem with plain branches</h3>
<p>A normal project folder can only have one branch checked out at a time. Switching branches swaps the files in that folder. That's fine for one person, but useless for three agents working at the same moment.</p>
<h3>Worktrees: one folder per branch</h3>
<p>A <b>worktree</b> is an extra folder linked to the same repository, with its own branch checked out. All the folders share history, so commits made in one are visible to the others, but each has its own files.</p>
<pre># from inside your project folder (on main):
git worktree add ../shop-search -b feature-search
git worktree add ../shop-invoices -b feature-invoices
git worktree add ../shop-alerts -b feature-alerts

git worktree list      # shows all folders and their branches</pre>
<p>Read the first command as: "make a new folder <code>../shop-search</code> next to this one, with a new branch <code>feature-search</code> checked out in it". Now you have four folders: your original on <code>main</code>, and one per feature.</p>
<p>When a feature is merged, clean up:</p>
<pre>git worktree remove ../shop-search
git branch -d feature-search</pre>
<h3>Things that trip people up</h3>
<ul>
<li><b>Dependencies:</b> each worktree is a fresh folder, so run <code>npm install</code> (or your equivalent) in each one.</li>
<li><b>Ports:</b> if all three agents start the dev server on port 3000, two will fail. Give each one its own port.</li>
<li><b>Same branch twice:</b> git won't let two worktrees check out the same branch. Each feature needs its own.</li>
<li><b>Untracked files:</b> files that aren't committed, such as <code>.env</code>, aren't copied. Copy them across yourself.</li>
</ul>
<div class="callout"><b>Stuck?</b> Practise on a throwaway project first: create a worktree, make a commit in it, run <code>git log</code> in the original folder to see the commit is there, then remove the worktree. Five minutes of practice removes most of the fear. Many agents can also create worktrees for you; the Claude Code docs below describe how.</div>`,
  watch:[],
  read:[R.worktree, R.workflows],
  exercise:`<p>In a real project, create two worktrees with new branches. Make one small commit in each (by hand is fine). Run <code>git worktree list</code> and <code>git log --oneline --all</code> from the original folder to see everything. Then remove both worktrees and delete the branches.</p>`,
  problems:[
    {q:"<p>Agent A in <code>../shop-search</code> starts the app and gets \"port 3000 already in use\". Why, and how do you fix it?</p>",
     a:"<p>Another worktree's agent is already running a dev server on port 3000. Give each worktree its own port, for example by starting with <code>PORT=3001 npm run dev</code>, or by setting the port in that worktree's <code>.env</code>, and tell each agent which port is theirs.</p>"},
    {q:"<p>What does <code>git worktree add ../app-login -b feature-login</code> do?</p>",
     a:"<p>It creates a new folder <code>../app-login</code> next to the current project, creates a new branch <code>feature-login</code> from the current commit, and checks that branch out in the new folder.</p>"}
  ],
  quiz:[
    {q:"Why does each parallel agent need its own worktree?", o:["Git requires it for every commit","So they don't overwrite each other's files in the same folder","To save disk space","To run faster"], a:1, why:"One folder can only hold one set of working files at a time."},
    {q:"After creating a worktree, what often needs doing in it?", o:["Nothing","Installing dependencies and copying untracked files like .env","Re-cloning the repo","Deleting main"], a:1, why:"A worktree is a fresh folder; uncommitted files and installed packages aren't there."},
    {q:"Can two worktrees check out the same branch?", o:["Yes","No: each needs its own branch","Only on Windows","Only for main"], a:1, why:"Git prevents it to avoid conflicting edits."}
  ]
},
{
  id:"8-2", title:"Running three agents at once without losing control", mins:13,
  objectives:["Write three independent specs before starting","Run three sessions and review them in rotation","Spot and avoid overlap between features"],
  prereqs:"<p>Lesson 8.1 and Weeks 5–7. This is where everything from Month 2 comes together.</p>",
  body:`
<p>The exam: three agents, three worktrees, three features, one day, all with passing tests. The hard part isn't the agents. It's managing your own attention.</p>
<h3>Before you start (about an hour)</h3>
<ol>
<li><b>Pick three features that don't overlap.</b> If two features change the same files, they'll conflict when you merge. "Search", "PDF invoices" and "low-stock email alerts" touch different parts of a shop; "new checkout" and "checkout discounts" don't.</li>
<li><b>Write three specs</b> (lesson 3.3): the goal, what's out of scope, acceptance criteria, and the test command. A spec is what lets an agent work without you for 20 minutes.</li>
<li><b>Check the memory file</b> is up to date, because all three agents rely on it.</li>
<li><b>Create the worktrees</b>, install dependencies, and assign ports.</li>
</ol>
<h3>During the day: rotate</h3>
<p>Start all three in plan mode. Review plan 1 and approve it; while agent 1 builds, review plan 2; then plan 3. From then on, cycle: check agent 1's progress and answer its questions, then agent 2, then agent 3. Each agent waits at most a few minutes, and none runs for an hour unsupervised.</p>
<p>Keep a simple log for each agent: time, what it's doing, what you decided. It feeds your write-up and stops you mixing them up.</p>
<h3>Warning signs</h3>
<ul>
<li>An agent is editing files outside its feature: stop it and re-scope.</li>
<li>You're no longer reading diffs because there's too much to read: pause one agent. Two well-reviewed features beat three unreviewed ones.</li>
<li>One agent is stuck in a loop on the same error: stop it, read the error yourself, and give it a specific next step.</li>
</ul>
<div class="callout"><b>Stuck or overwhelmed?</b> That's normal on the first try. Drop to two agents for the morning and add the third in the afternoon. The skill being tested is running parallel work under control, not maximum speed. Write down where your time went: that's the most useful part of the write-up.</div>`,
  watch:[U.berkeleyAgents],
  read:[R.workflows],
  exercise:`<p>Do the exam preparation: choose three non-overlapping features, write the three specs, update the memory file, and create and set up three worktrees. Check each spec against the question "could an agent work for 20 minutes with only this?"</p>`,
  problems:[
    {q:"<p>Features: (a) customer search, (b) redesign of the order model, (c) order export to CSV. Which pair is likely to conflict and what do you do?</p>",
     a:"<p>(b) and (c): exporting orders depends on the order model that (b) is changing. Either finish (b) first and do (c) afterwards, or swap (c) for a feature that doesn't touch orders.</p>"},
    {q:"<p>By 2pm you've approved diffs from agent 3 without reading them. What now?</p>",
     a:"<p>Pause agent 3. Go back and review its unreviewed changes properly before letting it continue. Unreviewed parallel output is the exact failure the exam is checking for, and finishing two features well is a better result.</p>"}
  ],
  quiz:[
    {q:"What makes three features safe to build in parallel?", o:["They are small","They don't change the same files","They use the same branch","They have no tests"], a:1, why:"Overlapping files cause merge conflicts and conflicting changes."},
    {q:"Why start all three in plan mode?", o:["It's faster","So you approve each direction before any code changes","Agents require it","To save tokens"], a:1, why:"A bad direction is cheapest to fix before the build starts."},
    {q:"You can't keep up with reviews. Best move?", o:["Stop reading diffs","Pause one agent","Add a fourth agent","Merge everything"], a:1, why:"Control matters more than parallelism."}
  ]
},
{
  id:"8-3", title:"Merging, conflicts and the exam write-up", mins:12,
  objectives:["Merge feature branches one at a time with tests between","Resolve a simple merge conflict","Write up the exam with honest evidence"],
  prereqs:"<p>Lessons 8.1–8.2.</p>",
  body:`
<h3>Merge one at a time</h3>
<p>When a feature is finished and reviewed, merge it into <code>main</code>, run the full test suite, and only then merge the next one. If something breaks, you know which merge caused it.</p>
<pre>git switch main
git merge feature-search
npm test                    # all green? then the next one
git merge feature-invoices
npm test</pre>
<p>On GitHub, the same flow is a pull request per feature, with CI (lesson 7.2) running on each one.</p>
<h3>Merge conflicts, demystified</h3>
<p>A <b>conflict</b> happens when two branches changed the same lines differently, and git can't decide which to keep. It marks the file like this:</p>
<pre>&lt;&lt;&lt;&lt;&lt;&lt;&lt; HEAD
const PAGE_SIZE = 20;
=======
const PAGE_SIZE = 50;
&gt;&gt;&gt;&gt;&gt;&gt;&gt; feature-invoices</pre>
<p>The top part is what's on your current branch, the bottom what the incoming branch has. You edit the file to keep the right version (or a combination), delete the marker lines, then <code>git add</code> the file and <code>git commit</code>. You can also ask an agent: "resolve the merge conflict in <code>config.js</code>; we want the invoices value. Explain what you kept and run the tests."</p>
<h3>The write-up</h3>
<p>Include: the three features and links to their pull requests; your timeline (from your per-agent log); where your time actually went (planning, reviewing, unblocking, fixing); every failure and the defence you added; and an honest result. "Two features shipped, the third reverted because I couldn't review it properly" is a strong, honest write-up.</p>
<div class="callout"><b>Stuck in a conflict?</b> You can always back out: <code>git merge --abort</code> returns everything to how it was before the merge. Nothing is lost. Take a breath, read both versions, and try again, or ask the agent to explain both sides first.</div>`,
  watch:[],
  read:[R.worktree, R.actions],
  exercise:`<p>This is the Month 2 exam. Run the day, merge each feature one at a time with tests in between, and publish your write-up with your timeline and failure log highlights.</p>`,
  problems:[
    {q:"<p>After merging feature 2, tests fail. Feature 1 passed on its own. What's the likely cause and the next step?</p>",
     a:"<p>The two features interact, and something in feature 2 breaks an assumption of feature 1 or vice versa. Since you merged one at a time, you know it's this merge. Run the failing test, read its error, and fix it on <code>main</code> (or revert the merge with <code>git revert</code> and fix it on the branch).</p>"},
    {q:"<p>What does <code>git merge --abort</code> do?</p>",
     a:"<p>It cancels a merge that hit conflicts, putting your branch and files back exactly as they were before you started the merge.</p>"}
  ],
  quiz:[
    {q:"Why merge one feature at a time?", o:["Git requires it","So you know which merge broke something","It's faster","To avoid writing tests"], a:1, why:"Testing between merges isolates the cause of any failure."},
    {q:"In a conflict, the part between <<<<<<< HEAD and ======= is:", o:["The incoming branch's version","Your current branch's version","A comment","Deleted code"], a:1, why:"HEAD is the branch you're on; the incoming version comes after =======."},
    {q:"A strong exam write-up:", o:["Claims everything worked","Shows evidence, the timeline and honest failures","Is as short as possible","Hides the reverted feature"], a:1, why:"Evidence and honesty are what make it credible."}
  ]
}
];
