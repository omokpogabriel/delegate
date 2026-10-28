import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { Check, Icon } from "../components/Icon";
import { useStore } from "../lib/store";
import {
  ALL_LESSONS, LINKS, MONTHS, MONTH_COLORS, hasVideo, lessonKey, lessonMins, lessonsFor,
  monthStats, overall, taskId, weekStats,
} from "../content";

export function Home() {
  return (
    <>
      <Hero />
      <Months />
      <Method />
      <Curriculum />
      <FailureLog />
    </>
  );
}

function Hero() {
  const { progress, profile } = useStore();
  const o = overall(progress);
  const href = o.next ? `/lesson/${o.next.l.id}` : "/#content";
  const label = !o.next ? "View curriculum" : o.started ? "Continue learning" : "Start learning";
  const C = 213.6;
  return (
    <section className="hero">
      <div className="wrap">
        <div>
          <span className="pill"><i />Self-paced, 24 weeks, free</span>
          <h1>{profile ? `${profile.name.split(" ")[0]}, become one of the best users of AI.` : "Become one of the best users of AI in six months."}</h1>
          <p className="lede">A hands-on course for people who want to hand real work to AI agents and trust what comes back. Short lessons, real projects, and a practical exam at the end of every month.</p>
          <div className="ctas">
            <Link className="btn btn-primary" to={href}>{label}</Link>
            <Link className="btn btn-ghost" to="/#content">View curriculum</Link>
          </div>
          <div className="stats">
            <div><b>24</b><span>weeks</span></div>
            <div><b>{ALL_LESSONS.length}</b><span>lessons live</span></div>
            <div><b>6</b><span>practical exams</span></div>
            <div><b>1</b><span>capstone</span></div>
          </div>
        </div>
        <div className="art" aria-label="Your progress">
          <div className="dots" aria-hidden="true" />
          <div className="bgshape" aria-hidden="true" />
          <div className="tri" aria-hidden="true" />
          <div className="chip c2"><span className="ico"><Icon name="quiz" size={16} /></span>A quiz in every lesson</div>
          <div className="pcard">
            <div className="top">
              <div className="ring">
                <svg viewBox="0 0 80 80"><circle className="track" cx="40" cy="40" r="34" /><circle className="val" cx="40" cy="40" r="34" strokeDasharray={C} strokeDashoffset={C * (1 - o.pct / 100)} /></svg>
                <b>{o.pct}%</b>
              </div>
              <div><h3>Your progress</h3><p className="muted">{o.done} of {o.total} lessons and tasks</p></div>
            </div>
            <div className="next">
              <small>{o.next ? `Up next: lesson ${o.next.w}.${o.next.i + 1}` : "Up next"}</small>
              <span>{o.next ? o.next.l.title : "New lessons are on the way. Keep going with the weekly builds."}</span>
            </div>
            <Link className="btn btn-primary btn-sm" to={href}>{!o.next ? "View curriculum" : o.started ? "Continue" : "Start lesson"}</Link>
          </div>
          <div className="chip c1"><span className="ico"><Icon name={profile?.token ? "cloud" : "hammer"} size={16} /></span>{profile?.token ? "Progress backed up online" : "Build something every week"}</div>
        </div>
      </div>
    </section>
  );
}

function Months() {
  const { progress } = useStore();
  return (
    <section className="block" id="months" style={{ paddingTop: 40 }}>
      <div className="wrap">
        <div className="shead"><div><h2>Six months, six skills</h2><p>Each month builds on the last and ends with something you ship.</p></div></div>
        <div className="mgrid">
          {MONTHS.map((m, mi) => {
            const mo = mi + 1;
            const nL = [1, 2, 3, 4].reduce((a, i) => a + lessonsFor(mi * 4 + i).length, 0);
            const [d, n] = monthStats(progress, mo);
            const p = Math.round((d / n) * 100);
            return (
              <Link key={mo} className="mcard" to={`/#m${mo}`} style={{ ["--c" as string]: MONTH_COLORS[mi] }}>
                <div className="thumb"><span className="tag">{nL ? `${nL} lessons live` : "Lessons coming"}</span><b>{mo}</b></div>
                <div className="mbody">
                  <small>Month {mo}</small>
                  <h3>{m.t}</h3>
                  <p>{m.s}</p>
                  <div className="meta"><span><Icon name="book" />4 weeks</span><span><Icon name="flag" />1 exam</span></div>
                  <div className="bar"><i style={{ width: `${p}%` }} /></div>
                  <div className="barlabel"><span>Progress</span><span>{p}%</span></div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Method() {
  const feats = [
    { c: "var(--brand)", i: "hammer", t: "Build more than you read", d: "No tutorial longer than 20 minutes without building something straight after." },
    { c: "var(--coral)", i: "ship", t: "Exams you ship", d: "Every month ends with a practical exam. You pass by shipping, not by answering questions." },
    { c: "var(--lilac)", i: "log", t: "A failure log", d: "Record every time an agent gets something wrong, and why. It becomes your most useful asset." },
    { c: "var(--sky)", i: "globe", t: "Work in public", d: "One write-up a week, so by the end you have six months of proof, not a certificate." },
  ];
  const outcomes = [
    "Ship real software with 3–5 agents working in parallel, and trust the output",
    "Pick the right model for a task from your own evals, not hype",
    "Run open models on your own hardware and know when it's worth it",
    "Design memory and retrieval for an AI system",
    "Build your own agent harness and MCP servers",
    "Run agents in production that work without you watching",
  ];
  return (
    <section className="block" id="method" style={{ background: "var(--surface)" }}>
      <div className="wrap">
        <div className="shead"><div><h2>How the course works</h2><p>About 10–12 hours a week. Concepts early in the week, building midweek, review and a short write-up at the end.</p></div></div>
        <div className="features">
          {feats.map((f) => (
            <div className="feat" key={f.t}><div className="ico" style={{ background: f.c }}><Icon name={f.i} /></div><h3>{f.t}</h3><p>{f.d}</p></div>
          ))}
        </div>
        <div className="learn">
          <h3>What you'll be able to do</h3>
          <ul>{outcomes.map((o) => <li key={o}><Icon name="check" />{o}</li>)}</ul>
        </div>
      </div>
    </section>
  );
}

function Curriculum() {
  const { progress, setItem } = useStore();
  const [allOpen, setAllOpen] = useState<boolean | null>(null);
  return (
    <section className="block" id="content">
      <div className="wrap">
        <div className="shead">
          <div><h2>Curriculum</h2><p>Lessons are live for Month 1 and Week 10; the rest are on the way. Every week's build and tasks are ready now.</p></div>
          <div className="content-sum">
            <span>6 months, 24 weeks, {ALL_LESSONS.length} lessons live</span>
            <button className="linkbtn" onClick={() => setAllOpen((v) => !v)}>{allOpen ? "Collapse all weeks" : "Expand all weeks"}</button>
          </div>
        </div>
        {MONTHS.map((m, mi) => {
          const mo = mi + 1;
          return (
            <div className="month" id={`m${mo}`} key={mo} style={{ ["--c" as string]: MONTH_COLORS[mi] }}>
              <div className="month-head"><div className="sw">{mo}</div><div><h3>Month {mo}: {m.t}</h3><p>{m.s}</p></div></div>
              <div className="sections">
                {m.weeks.map((w, wi) => {
                  const wn = mi * 4 + wi + 1;
                  const ls = lessonsFor(wn);
                  const [d, n] = weekStats(progress, wn);
                  return (
                    <details className="wk" id={`w${wn}`} key={`${wn}-${allOpen}`} open={allOpen ?? undefined}>
                      <summary>
                        <Icon name="chev" className="i chev" />
                        <span className="wt">Week {wn}: {w[0]}</span>
                        <span className="wm">{ls.length ? `${ls.length} lessons, ${lessonMins(wn)} min · ` : ""}{d === n ? <span className="donepill">Complete</span> : `${d}/${n} done`}</span>
                      </summary>
                      <ul className="rows">
                        {ls.length ? ls.map((l, li) => (
                          <li key={l.id} className={progress[lessonKey(l.id)] ? "done" : ""}>
                            <Link className="row" to={`/lesson/${l.id}`}>
                              <span className="ic"><Icon name={hasVideo(l) ? "play" : "doc"} /></span>
                              <span className="rt">{wn}.{li + 1} {l.title}</span>
                              <span className="rm">{l.mins} min</span>
                            </Link>
                            <Check />
                          </li>
                        )) : <li className="soon"><Icon name="clock" />Lessons for this week are in production.</li>}
                      </ul>
                      <div className="buildrow"><b>Build:</b> {w[1]}</div>
                      <div className="subhead">Tasks</div>
                      <ul className="rows tasks">
                        {w[2].map((t, ti) => {
                          const id = taskId(wn, ti);
                          return (
                            <li key={id}>
                              <label>
                                <input type="checkbox" checked={!!progress[id]} onChange={(e) => setItem(id, e.target.checked)} />
                                <span>{t}</span>
                              </label>
                            </li>
                          );
                        })}
                      </ul>
                    </details>
                  );
                })}
              </div>
              <div className="exam"><div className="ico"><Icon name="flag" /></div><div><h4>Month {mo} exam</h4><p>{m.exam}</p></div></div>
              <p className="reads">Further reading:{" "}
                {m.reads.map((r, i) => (
                  <span key={r}>{i > 0 && ", "}<a href={LINKS[r][1]} target="_blank" rel="noopener">{LINKS[r][0]}</a></span>
                ))}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function FailureLog() {
  const { logs, addLog, removeLog, profile } = useStore();
  const [what, setWhat] = useState("");
  const [tool, setTool] = useState("");
  const [why, setWhy] = useState("");
  function submit(e: FormEvent) {
    e.preventDefault();
    if (!what.trim()) return;
    addLog({ what: what.trim(), tool: tool.trim() || undefined, why: why.trim() || undefined });
    setWhat(""); setTool(""); setWhy("");
  }

  return (
    <section className="block" id="log" style={{ paddingTop: 20 }}>
      <div className="wrap">
        <div className="shead"><div><h2>Failure log</h2><p>Write down what went wrong when an agent failed you. Patterns show up within weeks, and fixing them is most of the skill. {profile?.token ? "Entries are saved in this browser and backed up online." : "Entries are saved in this browser."}</p></div></div>
        <div className="logcard">
          <form onSubmit={submit}>
            <div><label htmlFor="lw">What the agent did wrong</label><input type="text" id="lw" required value={what} onChange={(e) => setWhat(e.target.value)} placeholder="Deleted a passing test to make the build green" /></div>
            <div><label htmlFor="lt">Tool or model</label><input type="text" id="lt" value={tool} onChange={(e) => setTool(e.target.value)} placeholder="Claude Code" /></div>
            <div className="full"><label htmlFor="ly">Why it happened, and what you changed</label><textarea id="ly" value={why} onChange={(e) => setWhy(e.target.value)} placeholder="No rule against editing tests. Added a hook that blocks changes to test files without approval." /></div>
            <div className="full"><button className="btn btn-primary" type="submit">Add entry</button></div>
          </form>
          {logs.length ? (
            <ul className="entries">
              {logs.map((l) => (
                <li key={l.id}>
                  <span className="d">{new Date(l.createdAt).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })}{l.tool && <><br />{l.tool}</>}</span>
                  <div><div className="w">{l.what}</div>{l.why && <div className="y">{l.why}</div>}</div>
                  <button onClick={() => removeLog(l.id)}>Delete</button>
                </li>
              ))}
            </ul>
          ) : <p className="empty">No entries yet. Your first one will probably come in Week 3.</p>}
        </div>
      </div>
    </section>
  );
}
