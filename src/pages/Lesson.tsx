import { useEffect, useRef, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { Check, Icon } from "../components/Icon";
import { useStore } from "../lib/store";
import {
  ALL_LESSONS, LESSONS, MONTHS, hasVideo, lessonKey, lessonMins, monthOf, weekOf, ytId,
  type LessonRef, type QuizQuestion,
} from "../content";

const Embed = ({ id, title }: { id: string; title: string }) => (
  <iframe loading="lazy" src={`https://www.youtube-nocookie.com/embed/${id}`} title={title}
    allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
);

export function LessonPage() {
  const { id = "" } = useParams();
  const idx = ALL_LESSONS.findIndex((x) => x.l.id === id);
  if (idx < 0) return <Navigate to="/#content" replace />;
  return <LessonView key={id} idx={idx} />;
}

function LessonView({ idx }: { idx: number }) {
  const { progress, setItem } = useStore();
  const cur = ALL_LESSONS[idx], l = cur.l, nxt = ALL_LESSONS[idx + 1], prev = ALL_LESSONS[idx - 1];
  const mo = monthOf(cur.w), done = !!progress[lessonKey(l.id)];
  const lessonsDone = ALL_LESSONS.filter((x) => progress[lessonKey(x.l.id)]).length;
  const vids = l.watch.map((v) => ({ ...v, id: ytId(v.url) })).filter((v): v is typeof v & { id: string } => !!v.id);
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
          <Link className="back" to={`/#w${cur.w}`}><Icon name="left" />Back to course</Link>
          <span className="ct">Week {cur.w}: {weekOf(cur.w)[0]}</span>
          <span className="prog"><span className="bar"><i style={{ width: `${Math.round((lessonsDone / ALL_LESSONS.length) * 100)}%` }} /></span><span>{lessonsDone}/{ALL_LESSONS.length} lessons</span></span>
        </div>
      </div>
      <div className="wrap">
        <div className="lgrid">
          <article>
            {vids.length > 0 && (
              <>
                <div className="player"><Embed id={vids[0].id} title={vids[0].title} /></div>
                <p className="vcap">Watch: <a href={vids[0].url} target="_blank" rel="noopener">{vids[0].title}</a> ({vids[0].len})</p>
              </>
            )}
            <div className="lhead">
              <p className="crumb">Month {mo}: {MONTHS[mo - 1].t} / Week {cur.w}</p>
              <h1 tabIndex={-1} ref={h1}>{l.title}</h1>
              <div className="lmeta">
                <span><Icon name="book" />Lesson {cur.i + 1} of {LESSONS[cur.w].length}</span>
                <span><Icon name="clock" />{l.mins} min read</span>
                {vids.length > 0 && <span><Icon name="play" />{vids.length} video{vids.length > 1 ? "s" : ""}</span>}
                <span><Icon name="quiz" />{l.quiz.length}-question quiz</span>
              </div>
            </div>


            <div className="card"><div className="prose" dangerouslySetInnerHTML={{ __html: l.body }} /></div>

            {vids.length > 1 && (
              <div className="card">
                <h2><span className="ico" style={{ background: "var(--coral)" }}><Icon name="play" /></span>More to watch</h2>
                <div className="vlist">
                  {vids.slice(1).map((v) => (
                    <div className="v" key={v.id}><div className="fr"><Embed id={v.id} title={v.title} /></div><p>{v.title} <span>({v.len})</span></p></div>
                  ))}
                </div>
              </div>
            )}

            {l.read.length > 0 && (
              <div className="card">
                <h2><span className="ico" style={{ background: "var(--sky)" }}><Icon name="book" /></span>Read</h2>
                <ul className="rlist">
                  {l.read.map((r) => <li key={r.url}><a href={r.url} target="_blank" rel="noopener"><Icon name="link" />{r.title}</a></li>)}
                </ul>
              </div>
            )}

            <div className="card">
              <h2><span className="ico" style={{ background: "#E0A100" }}><Icon name="pen" /></span>Exercise</h2>
              <div className="ex" dangerouslySetInnerHTML={{ __html: l.exercise }} />
            </div>

            <Quiz questions={l.quiz} />

            <div className="actions">
              {prev ? <Link className="btn btn-ghost btn-sm" to={`/lesson/${prev.l.id}`}><Icon name="left" />Previous</Link> : <span />}
              <div className="r">
                <button className="btn btn-ghost btn-sm" aria-pressed={done} onClick={() => setItem(lessonKey(l.id), !done)}>
                  <Icon name="check" /><span>{done ? "Completed" : "Mark complete"}</span>
                </button>
                {nxt
                  ? <Link className="btn btn-primary btn-sm" to={`/lesson/${nxt.l.id}`}>Next lesson<Icon name="right" /></Link>
                  : <Link className="btn btn-primary btn-sm" to="/#content">Back to curriculum</Link>}
              </div>
            </div>
          </article>
          <Sidebar cur={cur} />
        </div>
      </div>
    </>
  );
}

function Quiz({ questions }: { questions: QuizQuestion[] }) {
  const [picks, setPicks] = useState<Record<number, number>>({});
  const answered = Object.keys(picks).length;
  const correct = questions.filter((q, qi) => picks[qi] === q.a).length;
  return (
    <div className="card">
      <h2><span className="ico" style={{ background: "var(--lilac)" }}><Icon name="quiz" /></span>Check your understanding</h2>
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
          ? `${correct} of ${answered} correct. Mark the lesson complete once you've done the exercise.`
          : `${correct} of ${answered} correct so far.`)}
      </p>
    </div>
  );
}

function Sidebar({ cur }: { cur: LessonRef }) {
  const { progress } = useStore();
  const scroller = useRef<HTMLDivElement>(null);
  const weeks = [...new Set(ALL_LESSONS.map((x) => x.w))];

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
          const ls = LESSONS[wn];
          const d = ls.filter((l) => progress[lessonKey(l.id)]).length;
          return (
            <details key={wn} open={wn === cur.w || undefined}>
              <summary>
                <div><b>Week {wn}: {weekOf(wn)[0]}</b><small>{d}/{ls.length} done, {lessonMins(wn)} min</small></div>
                <Icon name="chev" className="i chev" />
              </summary>
              <ol>
                {ls.map((l, i) => (
                  <li key={l.id} className={progress[lessonKey(l.id)] ? "done" : ""}>
                    <Link to={`/lesson/${l.id}`} aria-current={l.id === cur.l.id ? "page" : undefined}>
                      <Check />
                      <span>{wn}.{i + 1} {l.title}<small>{hasVideo(l) ? "Video + reading" : "Reading"}, {l.mins} min</small></span>
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
