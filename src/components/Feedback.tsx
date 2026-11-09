import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link, useLocation } from "react-router-dom";
import * as api from "../lib/api";
import { useStore } from "../lib/store";
import { useTrack } from "../content";
import { Icon } from "./Icon";

const FACES = [
  { v: 1, e: "😞", l: "Very poor" },
  { v: 2, e: "🙁", l: "Poor" },
  { v: 3, e: "😐", l: "OK" },
  { v: 4, e: "🙂", l: "Good" },
  { v: 5, e: "😍", l: "Excellent" },
];

/** The quick feedback form: one tap for a rating, optional comment and email. Used in the sheet and on /feedback. */
export function FeedbackForm({ page, autoFocus, onDone }: { page: string; autoFocus?: boolean; onDone?: () => void }) {
  const { profile } = useStore();
  const t = useTrack();
  const [rating, setRating] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState(profile?.email ?? "");
  const [website, setWebsite] = useState(""); // honeypot
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [sent, setSent] = useState(false);
  const first = useRef<HTMLButtonElement>(null);

  useEffect(() => { if (autoFocus) first.current?.focus(); }, [autoFocus]);

  async function send(e: FormEvent) {
    e.preventDefault();
    if (!rating && message.trim().length < 3) { setErr("Pick a face or write a few words."); return; }
    setErr(""); setBusy(true);
    try {
      await api.sendFeedback({ rating, message: message.trim(), email: email.trim(), page, track: t.id, website });
      setSent(true);
    } catch (e) {
      setErr(e instanceof api.Unreachable
        ? "We couldn't reach the server. Check your connection and try again."
        : e instanceof Error ? e.message : "Something went wrong.");
    } finally { setBusy(false); }
  }

  if (sent) return (
    <div className="fb-done" role="status">
      <span className="fb-ok"><Icon name="check" /></span>
      <h3>Thank you!</h3>
      <p>Your feedback goes straight to the team.{email.trim() ? " If you asked something, we'll reply by email." : ""}</p>
      <button className="btn btn-ghost btn-sm" onClick={() => { setSent(false); setRating(null); setMessage(""); onDone?.(); }}>{onDone ? "Close" : "Send more feedback"}</button>
    </div>
  );

  return (
    <form className="fb-form" onSubmit={send}>
      <fieldset className="fb-faces">
        <legend>How is the course for you so far?</legend>
        <div>
          {FACES.map((f, i) => (
            <button type="button" key={f.v} ref={i === 0 ? first : undefined} aria-pressed={rating === f.v} aria-label={f.l} title={f.l}
              onClick={() => setRating(rating === f.v ? null : f.v)}>
              <span aria-hidden="true">{f.e}</span><small>{f.l}</small>
            </button>
          ))}
        </div>
      </fieldset>
      <label htmlFor="fb-msg">What should we change, add or keep? <span className="opt">(optional)</span></label>
      <textarea id="fb-msg" rows={3} maxLength={3000} value={message} onChange={(e) => setMessage(e.target.value)}
        placeholder="A confusing lesson, a missing topic, something you loved…" />
      <label htmlFor="fb-email">Email, if you'd like a reply <span className="opt">(optional)</span></label>
      <input id="fb-email" type="email" autoComplete="email" inputMode="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input className="hp" tabIndex={-1} autoComplete="off" aria-hidden="true" name="website" value={website} onChange={(e) => setWebsite(e.target.value)} />
      {err && <p className="err" role="alert">{err}</p>}
      <button className="btn btn-primary fb-send" disabled={busy}>{busy ? "Sending…" : "Send feedback"}</button>
    </form>
  );
}

/** Small "Feedback" tab on every page (except /feedback) that opens the form in a sheet. */
export function FeedbackButton() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const btn = useRef<HTMLButtonElement>(null);

  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { setOpen(false); btn.current?.focus(); } };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  if (pathname === "/feedback") return null;
  return (
    <>
      {open && <div className="fb-scrim" onClick={() => setOpen(false)} aria-hidden="true" />}
      {open && (
        <div className="fb-sheet" role="dialog" aria-modal="true" aria-labelledby="fb-title">
          <div className="fb-head">
            <h2 id="fb-title">Quick feedback</h2>
            <p>Takes 10 seconds. It goes straight to the team.</p>
            <button className="fb-x" onClick={() => { setOpen(false); btn.current?.focus(); }} aria-label="Close feedback"><Icon name="x" /></button>
          </div>
          <FeedbackForm page={pathname} autoFocus onDone={() => setOpen(false)} />
          <p className="fb-link"><Link to="/feedback">Open as a page</Link></p>
        </div>
      )}
      <button ref={btn} className="fb-tab" onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-haspopup="dialog">
        <Icon name="pen" /><span>Feedback</span>
      </button>
    </>
  );
}
