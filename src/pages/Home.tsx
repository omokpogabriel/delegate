import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { Check, Icon } from "../components/Icon";
import { useStore } from "../lib/store";
import { MONTH_COLORS, TRACKS, hasVideo, useTrack } from "../content";

export function Home() {
  const t = useTrack();
  useEffect(() => {
    if (t.id === "engineer") document.title = "AI engineer track — Delegate";
    return () => { document.title = "Delegate — learn to work with AI"; };
  }, [t.id]);
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

/** Switch between the two courses. Each keeps its own progress. */
function TrackSwitch() {
  const t = useTrack();
  return (
    <div className="tracks" role="tablist" aria-label="Choose a course">
      {TRACKS.map((x) => (
        <Link key={x.id} to={x.home} role="tab" aria-selected={x.id === t.id} className={x.id === t.id ? "on" : ""}>
          <b>{x.copy.label}</b>
          <small>{x.id === "engineer" ? "Maths, models, training, evals, RAG" : "Prompting, coding agents, MCP"}</small>
        </Link>
      ))}
    </div>
  );
}

function Hero() {
  const t = useTrack();
  const { progress, profile } = useStore();
  const o = t.overall(progress);
  const href = o.next ? t.lessonHref(o.next.l.id) : t.hash("content");
  const label = !o.next ? "View curriculum" : o.started ? "Continue learning" : "Start learning";
  const C = 213.6;
  const first = profile?.name.split(" ")[0];
  return (
    <section className="hero">
      <div className="wrap">
        <div>
          <TrackSwitch />
          <span className="pill"><i />{t.copy.pill}</span>
          <h1>{first ? `${first}, ${t.copy.h1.toLowerCase()}` : t.copy.h1}<span className="accent">{t.copy.accent}</span>{t.id === "agents" && !first ? " in six months." : "."}</h1>
          <p className="lede">{t.copy.lede}</p>
          <div className="ctas">
            <Link className="btn btn-primary" to={href}>{label}</Link>
            <Link className="btn btn-ghost" to={t.hash("content")}>View curriculum</Link>
          </div>
          <div className="stats">
            <div><b>24</b><span>weeks</span></div>
            <div><b>{t.all.length}</b><span>{t.copy.unit}s live</span></div>
            <div><b>6</b><span>practical exams</span></div>
            <div><b>1</b><span>capstone</span></div>
          </div>
        </div>
        <div className="art" aria-label="Your progress">
          <div className="dots" aria-hidden="true" />
          <div className="bgshape" aria-hidden="true" />
          <div className="tri" aria-hidden="true" />
          <div className="chip c2"><span className="ico"><Icon name={t.id === "engineer" ? "play" : "quiz"} size={16} /></span>{t.copy.chips[0]}</div>
          <div className="pcard">
            <div className="top">
              <div className="ring">
                <svg viewBox="0 0 80 80"><circle className="track" cx="40" cy="40" r="34" /><circle className="val" cx="40" cy="40" r="34" strokeDasharray={C} strokeDashoffset={C * (1 - o.pct / 100)} /></svg>
                <b>{o.pct}%</b>
              </div>
              <div><h3>Your progress</h3><p className="muted">{o.done} of {o.total} {t.copy.unit}s and tasks</p></div>
            </div>
            <div className="next">
              <small>{o.next ? `Up next: ${t.copy.unit} ${o.next.w}.${o.next.i + 1}` : "Up next"}</small>
              <span>{o.next ? o.next.l.title : `New ${t.copy.unit}s are on the way. Keep going with the weekly builds.`}</span>
            </div>
            <Link className="btn btn-primary btn-sm" to={href}>{!o.next ? "View curriculum" : o.started ? "Continue" : `Start ${t.copy.unit}`}</Link>
          </div>
          <div className="chip c1"><span className="ico"><Icon name={profile?.token ? "cloud" : t.id === "engineer" ? "pen" : "hammer"} size={16} /></span>{profile?.token ? "Progress backed up online" : t.copy.chips[1]}</div>
        </div>
      </div>
    </section>
  );
}

function Months() {
  const t = useTrack();
  const { progress } = useStore();
  return (
    <section className="block" id="months" style={{ paddingTop: 40 }}>
      <div className="wrap">
        <div className="shead"><div><h2>Six months, six skills</h2><p>Each month builds on the last and ends with something you ship.</p></div></div>
        <div className="mgrid">
          {t.months.map((m, mi) => {
            const mo = mi + 1;
            const nL = [1, 2, 3, 4].reduce((a, i) => a + t.lessonsFor(mi * 4 + i).length, 0);
            const [d, n] = t.monthStats(progress, mo);
            const p = Math.round((d / n) * 100);
            return (
              <Link key={mo} className="mcard" to={t.hash(`m${mo}`)} style={{ ["--c" as string]: MONTH_COLORS[mi] }}>
                <div className="thumb"><span className="tag">{nL ? `${nL} ${t.copy.unit}s live` : `${t.copy.unit === "lesson" ? "Lessons" : "Lectures"} coming`}</span><b>{mo}</b></div>
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
  const t = useTrack();
  const feats = t.copy.feats;
  return (
    <section className="block" id="method" style={{ background: "var(--surface)" }}>
      <div className="wrap">
        <div className="shead"><div><h2>How the course works</h2><p>{t.id === "engineer" ? "About 10–12 hours a week: the lecture and notes early in the week, the problem set and build midweek, and a short write-up at the end." : "About 10–12 hours a week. Concepts early in the week, building midweek, review and a short write-up at the end."}</p></div></div>
        <div className="features">
          {feats.map((f) => (
            <div className="feat" key={f.t}><div className="ico" style={{ ["--c" as string]: f.c }}><Icon name={f.i} /></div><h3>{f.t}</h3><p>{f.d}</p></div>
          ))}
        </div>
        <div className="learn">
          <h3>What you'll be able to do</h3>
          <ul>{t.copy.outcomes.map((o) => <li key={o}><Icon name="check" />{o}</li>)}</ul>
        </div>
      </div>
    </section>
  );
}

function Curriculum() {
  const t = useTrack();
  const { progress, setItem } = useStore();
  const [allOpen, setAllOpen] = useState<boolean | null>(null);
  return (
    <section className="block" id="content">
      <div className="wrap">
        <div className="shead">
          <div><h2>Curriculum</h2><p>{t.copy.curriculum}</p></div>
          <div className="content-sum">
            <span>6 months, 24 weeks, {t.all.length} {t.copy.unit}s live</span>
            <button className="linkbtn" onClick={() => setAllOpen((v) => !v)}>{allOpen ? "Collapse all weeks" : "Expand all weeks"}</button>
          </div>
        </div>
        {t.months.map((m, mi) => {
          const mo = mi + 1;
          return (
            <div className="month" id={`m${mo}`} key={`${t.id}-${mo}`} style={{ ["--c" as string]: MONTH_COLORS[mi] }}>
              <div className="month-head"><div className="sw">{mo}</div><div><h3>Month {mo}: {m.t}</h3><p>{m.s}</p></div></div>
              <div className="sections">
                {m.weeks.map((w, wi) => {
                  const wn = mi * 4 + wi + 1;
                  const ls = t.lessonsFor(wn);
                  const [d, n] = t.weekStats(progress, wn);
                  return (
                    <details className="wk" id={`w${wn}`} key={`${t.id}-${wn}-${allOpen}`} open={allOpen ?? undefined}>
                      <summary>
                        <Icon name="chev" className="i chev" />
                        <span className="wt">Week {wn}: {w[0]}</span>
                        <span className="wm">{ls.length ? `${ls.length} ${t.copy.unit}s, ${t.lessonMins(wn)} min · ` : ""}{d === n ? <span className="donepill">Complete</span> : `${d}/${n} done`}</span>
                      </summary>
                      <ul className="rows">
                        {ls.length ? ls.map((l, li) => (
                          <li key={l.id} className={progress[t.lessonKey(l.id)] ? "done" : ""}>
                            <Link className="row" to={t.lessonHref(l.id)}>
                              <span className="ic"><Icon name={hasVideo(l) ? "play" : "doc"} /></span>
                              <span className="rt">{wn}.{li + 1} {l.title}{progress[t.deepKey(l.id)] && <em className="deepmark">Deep</em>}</span>
                              <span className="rm">{l.mins} min</span>
                            </Link>
                            <Check />
                          </li>
                        )) : <li className="soon"><Icon name="clock" />{t.id === "engineer" ? "Lecture notes for this week are being written. The lecture is named in the tasks below." : "Lessons for this week are in production."}</li>}
                      </ul>
                      <div className="buildrow"><b>Build:</b> {w[1]}</div>
                      <div className="subhead">Tasks</div>
                      <ul className="rows tasks">
                        {w[2].map((task, ti) => {
                          const id = t.taskId(wn, ti);
                          return (
                            <li key={id}>
                              <label>
                                <input type="checkbox" checked={!!progress[id]} onChange={(e) => setItem(id, e.target.checked)} />
                                <span>{task}</span>
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
                  <span key={r}>{i > 0 && ", "}<a href={t.links[r][1]} target="_blank" rel="noopener">{t.links[r][0]}</a></span>
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
        <div className="shead"><div><h2>Failure log</h2><p>Write down what went wrong when an agent or a model failed you. Patterns show up within weeks, and fixing them is most of the skill. {profile?.token ? "Entries are saved in this browser and backed up online." : "Entries are saved in this browser."}</p></div></div>
        <div className="logcard">
          <form onSubmit={submit}>
            <div><label htmlFor="lw">What went wrong</label><input type="text" id="lw" required value={what} onChange={(e) => setWhat(e.target.value)} placeholder="Deleted a passing test to make the build green" /></div>
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
