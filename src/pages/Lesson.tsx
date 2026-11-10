import { useEffect, useRef, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { Check, Icon } from "../components/Icon";
import { useStore } from "../lib/store";
import { withMath } from "../lib/math";
import {
  hasVideo, useTrack, ytId,
  type Lesson, type LessonRef, type Problem, type QuizQuestion, type Resource, type Track,
} from "../content";

const Embed = ({ id, title }: { id: string; title: string }) => (
  <iframe loading="lazy" src={`https://www.youtube-nocookie.com/embed/${id}`} title={title}
    allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
);

type Vid = Resource & { id: string };
const canEmbed = (v: Resource) => v.embed !== false;
const vidsOf = (rs: Resource[]) => rs.map((v) => ({ ...v, id: ytId(v.url) })).filter((v): v is Vid => !!v.id);

/** A lecture whose publisher has switched off embedding: a thumbnail that opens YouTube. */
const LinkOut = ({ v }: { v: Vid }) => (
  <a className="fr linkout" href={v.url} target="_blank" rel="noopener">
    <img src={`https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`} alt="" loading="lazy" />
    <span className="lo"><Icon name="play" size={28} /><b>Watch on YouTube</b><small>The publisher doesn't allow embedding</small></span>
  </a>
);

function VideoGrid({ vids }: { vids: Vid[] }) {
  return (
    <div className="vlist">
      {vids.map((v) => (
        <div className="v" key={v.id}>
          {canEmbed(v) ? <div className="fr"><Embed id={v.id} title={v.title} /></div> : <LinkOut v={v} />}
          {v.src && <small className="src">{v.src}</small>}
          <p><a href={v.url} target="_blank" rel="noopener">{v.title}</a> <span>({v.len})</span></p>
        </div>
      ))}
    </div>
  );
}

const cap = (s: string) => s[0].toUpperCase() + s.slice(1);

export function LessonPage() {
  const t = useTrack();
  const { id = "" } = useParams();
  const idx = t.all.findIndex((x) => x.l.id === id);
  if (idx < 0) return <Navigate to={t.hash("content")} replace />;
  return <LessonView key={`${t.id}-${id}`} t={t} idx={idx} />;
}

function LessonView({ t, idx }: { t: Track; idx: number }) {
  const { progress, setItem } = useStore();
  const cur = t.all[idx], l = cur.l, nxt = t.all[idx + 1], prev = t.all[idx - 1];
  const mo = t.monthOf(cur.w), done = !!progress[t.lessonKey(l.id)];
  const lessonsDone = t.all.filter((x) => progress[t.lessonKey(x.l.id)]).length;
  const vids = vidsOf(l.watch);
  const main = vids.find(canEmbed);
  const rest = vids.filter((v) => v !== main);
  const unit = t.copy.unit;
  /** the next written lesson skips whole weeks that have no lessons yet */
  const gap = !!nxt && nxt.w > cur.w + 1;
  const h1 = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    document.title = `${l.title} — Delegate`;
    h1.current?.focus({ preventScroll: true });
    return () => { document.title = "Delegate — learn to work with AI"; };
  }, [l.title]);

  return (
    <>
      <div className="lbar">
        <div className="wrap">
          <Link className="back" to={t.hash(`w${cur.w}`)}><Icon name="left" />Back to course</Link>
          <span className="ct">Week {cur.w}: {t.weekOf(cur.w)[0]}</span>
          <span className="prog"><span className="bar"><i style={{ width: `${Math.round((lessonsDone / t.all.length) * 100)}%` }} /></span><span>{lessonsDone}/{t.all.length} {unit}s</span></span>
        </div>
      </div>
      <div className="wrap">
        <div className="lgrid">
          <article>
            {main && (
              <>
                <div className="player"><Embed id={main.id} title={main.title} /></div>
                <p className="vcap">{main.src && <span className="src">{main.src}</span>}<a href={main.url} target="_blank" rel="noopener">{main.title}</a> ({main.len})</p>
              </>
            )}
            <div className="lhead">
              <p className="crumb">{t.id === "engineer" ? "AI engineer · " : ""}Month {mo}: {t.months[mo - 1].t} / Week {cur.w}</p>
              <h1 tabIndex={-1} ref={h1}>{l.title}</h1>
              <div className="lmeta">
                <span><Icon name="book" />{cap(unit)} {cur.i + 1} of {t.lessons[cur.w].length}</span>
                <span><Icon name="clock" />{l.mins} min read</span>
                {vids.length > 0 && <span><Icon name="play" />{vids.length} video{vids.length > 1 ? "s" : ""}</span>}
                {l.problems && <span><Icon name="pen" />{l.problems.length} problems</span>}
                <span><Icon name="quiz" />{l.quiz.length}-question quiz</span>
                {l.deep && <span><Icon name="flag" />Optional deep dive</span>}
              </div>
            </div>

            {(l.objectives || l.prereqs) && (
              <div className="card goals">
                {l.objectives && (
                  <>
                    <h2><span className="ico" style={{ ["--c" as string]: "var(--mint)" }}><Icon name="flag" /></span>By the end of this {unit} you can</h2>
                    <ul>{l.objectives.map((o) => <li key={o}><Icon name="check" /><span dangerouslySetInnerHTML={{ __html: withMath(o) }} /></li>)}</ul>
                  </>
                )}
                {l.prereqs && <div className="pre"><b>Before you start:</b> <span dangerouslySetInnerHTML={{ __html: withMath(l.prereqs.replace(/^<p>|<\/p>$/g, "")) }} /></div>}
              </div>
            )}

            <div className="card">
              {t.id === "engineer" && <h2><span className="ico" style={{ ["--c" as string]: "var(--brand)" }}><Icon name="doc" /></span>Lecture notes</h2>}
              <div className="prose" dangerouslySetInnerHTML={{ __html: withMath(l.body) }} />
            </div>

            {rest.length > 0 && (
              <div className="card">
                <h2><span className="ico" style={{ ["--c" as string]: "var(--coral)" }}><Icon name="play" /></span>{rest.some((v) => v.src) ? "University lectures" : "More to watch"}</h2>
                <VideoGrid vids={rest} />
              </div>
            )}

            {l.read.length > 0 && (
              <div className="card">
                <h2><span className="ico" style={{ ["--c" as string]: "var(--sky)" }}><Icon name="book" /></span>Read</h2>
                <ul className="rlist">
                  {l.read.map((r) => <li key={r.url}><a href={r.url} target="_blank" rel="noopener"><Icon name="link" />{r.title}</a></li>)}
                </ul>
              </div>
            )}

            {l.deep && <GoDeep t={t} l={l} />}

            <div className="card">
              <h2><span className="ico" style={{ ["--c" as string]: "var(--sun)" }}><Icon name="hammer" /></span>Exercise</h2>
              <div className="ex" dangerouslySetInnerHTML={{ __html: withMath(l.exercise) }} />
            </div>

            {l.problems && <div className="card"><Problems problems={l.problems} /></div>}

            <Quiz questions={l.quiz} unit={unit} />

            {gap && (
              <p className="gapnote" role="note">
                <b>Weeks {cur.w + 1}–{nxt!.w - 1} are being written.</b> Keep going with their weekly builds and tasks in the curriculum,
                or jump ahead to Week {nxt!.w}: {t.weekOf(nxt!.w)[0]}.
              </p>
            )}

            <div className="actions">
              {prev ? <Link className="btn btn-ghost btn-sm" to={t.lessonHref(prev.l.id)}><Icon name="left" />Previous</Link> : <span />}
              <div className="r">
                <button className="btn btn-ghost btn-sm" aria-pressed={done} onClick={() => setItem(t.lessonKey(l.id), !done)}>
                  <Icon name="check" /><span>{done ? "Completed" : "Mark complete"}</span>
                </button>
                {nxt && !gap && <Link className="btn btn-primary btn-sm" to={t.lessonHref(nxt.l.id)}>Next {unit}<Icon name="right" /></Link>}
                {nxt && gap && <Link className="btn btn-ghost btn-sm" to={t.lessonHref(nxt.l.id)}>Jump to Week {nxt.w}<Icon name="right" /></Link>}
                {(!nxt || gap) && <Link className="btn btn-primary btn-sm" to={t.hash(`w${cur.w + 1}`)}>{nxt ? `Week ${cur.w + 1} in the curriculum` : "Back to curriculum"}</Link>}
              </div>
            </div>
          </article>
          <Sidebar t={t} cur={cur} />
        </div>
      </div>
    </>
  );
}

/** Optional depth before the exercise: collapsed by default, never needed to complete the lesson. */
function GoDeep({ t, l }: { t: Track; l: Lesson }) {
  const { progress, setItem } = useStore();
  const d = l.deep!;
  const key = t.deepKey(l.id), done = !!progress[key];
  const vids = vidsOf(d.watch);
  const parts = [
    ...vids.map((v) => `${v.src?.split(" · ")[0] ?? "Lecture"} (${v.len})`),
    ...(d.notes ? ["the theory behind it"] : []),
    ...(d.problems?.length ? [`${d.problems.length} problem${d.problems.length > 1 ? "s" : ""} with worked solutions`] : []),
  ];
  return (
    <details className="card deep">
      <summary>
        <span className="ico" style={{ ["--c" as string]: "var(--sky)" }}><Icon name="play" /></span>
        <div>
          <b>{done ? "You went deep on this one." : "You've got the core. Want to go deeper?"}</b>
          <small>{parts.join(" · ")} · Optional</small>
        </div>
        <Icon name="chev" className="i chev" />
      </summary>
      <div className="deepbody">
        <p className="muted">Nothing here is needed to complete the {t.copy.unit}. Take it when you're curious, now or later.</p>
        {vids.length > 0 && <>
          <h3>University lecture{vids.length > 1 ? "s" : ""}</h3>
          <p className="tip">These are real university classes, so they move fast and assume some background. Watch at your own pace, pause often, and stop when it goes beyond what you need: even the first 20 minutes is worth it. Don't worry if parts go over your head.</p>
          <VideoGrid vids={vids} />
        </>}
        {d.notes && <div className="prose" dangerouslySetInnerHTML={{ __html: withMath(d.notes) }} />}
        {d.problems && d.problems.length > 0 && <><h3>Problems</h3><Problems problems={d.problems} bare /></>}
        <button className="btn btn-ghost btn-sm" aria-pressed={done} onClick={() => setItem(key, !done)}>
          <Icon name="check" /><span>{done ? "Deep dive done" : "Mark deep dive done"}</span>
        </button>
      </div>
    </details>
  );
}

function Problems({ problems, bare }: { problems: Problem[]; bare?: boolean }) {
  return (
    <>
      {!bare && <h2><span className="ico" style={{ ["--c" as string]: "var(--coral)" }}><Icon name="pen" /></span>Problem set</h2>}
      <p className="muted pintro">Have a go first, even a rough guess, then open the solution. Each one is worked through step by step, and getting it wrong first is how it sticks.</p>
      <ol className="probs">
        {problems.map((p, i) => (
          <li key={i}>
            <div className="prose" dangerouslySetInnerHTML={{ __html: withMath(p.q) }} />
            <details>
              <summary>Show worked solution</summary>
              <div className="prose sol" dangerouslySetInnerHTML={{ __html: withMath(p.a) }} />
            </details>
          </li>
        ))}
      </ol>
    </>
  );
}

function Quiz({ questions, unit }: { questions: QuizQuestion[]; unit: string }) {
  const [picks, setPicks] = useState<Record<number, number>>({});
  const answered = Object.keys(picks).length;
  const correct = questions.filter((q, qi) => picks[qi] === q.a).length;
  return (
    <div className="card">
      <h2><span className="ico" style={{ ["--c" as string]: "var(--lilac)" }}><Icon name="quiz" /></span>Check your understanding</h2>
      {questions.map((q, qi) => {
        const pick = picks[qi];
        const ok = pick === q.a;
        return (
          <fieldset className="q" key={qi}>
            <legend>{qi + 1}. {q.q}</legend>
            {q.o.map((o, oi) => (
              <label key={oi} className={pick === undefined ? "" : ok && oi === q.a ? "right" : oi === pick && !ok ? "wrong" : ""}>
                <input type="radio" name={`q${qi}`} checked={pick === oi} onChange={() => setPicks((p) => ({ ...p, [qi]: oi }))} />
                <span>{o}</span>
              </label>
            ))}
            <p className="fb" aria-live="polite">{pick !== undefined && (ok ? <><b>Correct.</b> {q.why}</> : <b>Not quite, try again.</b>)}</p>
          </fieldset>
        );
      })}
      <p className="score" aria-live="polite">
        {answered === questions.length && (correct === answered
          ? `${correct} of ${answered} correct. Mark the ${unit} complete once you've done the exercise.`
          : `${correct} of ${answered} correct so far.`)}
      </p>
    </div>
  );
}

function Sidebar({ t, cur }: { t: Track; cur: LessonRef }) {
  const { progress } = useStore();
  const scroller = useRef<HTMLDivElement>(null);
  const weeks = [...new Set(t.all.map((x) => x.w))];

  useEffect(() => {
    const sc = scroller.current;
    const a = sc?.querySelector<HTMLElement>('[aria-current="page"]');
    if (sc && a && sc.scrollHeight > sc.clientHeight) {
      sc.scrollTop += a.getBoundingClientRect().top - sc.getBoundingClientRect().top - 60;
    }
  }, [cur.l.id]);

  return (
    <aside className="side" aria-label="Course content">
      <h2>Course content</h2>
      <div className="scroll" ref={scroller}>
        {weeks.map((wn) => {
          const ls = t.lessons[wn];
          const d = ls.filter((l) => progress[t.lessonKey(l.id)]).length;
          return (
            <details key={wn} open={wn === cur.w || undefined}>
              <summary>
                <div><b>Week {wn}: {t.weekOf(wn)[0]}</b><small>{d}/{ls.length} done, {t.lessonMins(wn)} min</small></div>
                <Icon name="chev" className="i chev" />
              </summary>
              <ol>
                {ls.map((l, i) => (
                  <li key={l.id} className={progress[t.lessonKey(l.id)] ? "done" : ""}>
                    <Link to={t.lessonHref(l.id)} aria-current={l.id === cur.l.id ? "page" : undefined}>
                      <Check />
                      <span>{wn}.{i + 1} {l.title}{progress[t.deepKey(l.id)] && <em className="deepmark">Deep</em>}<small>{hasVideo(l) ? "Video + reading" : "Reading"}, {l.mins} min</small></span>
                    </Link>
                  </li>
                ))}
              </ol>
            </details>
          );
        })}
      </div>
    </aside>
  );
}
