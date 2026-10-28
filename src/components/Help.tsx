import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { useLocation } from "react-router-dom";
import * as api from "../lib/api";
import { useStore } from "../lib/store";
import { FAQS, RESPONSE_TIME } from "../content/help";
import { Icon } from "./Icon";

type Tab = "answers" | "message";

/** Floating Help button with quick answers and a message form (saved to R2 via /api/help). */
export function Help() {
  const { profile } = useStore();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Tab>("answers");
  const [query, setQuery] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [sentTo, setSentTo] = useState("");
  const panel = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);

  // prefill from the learner's profile
  useEffect(() => {
    if (open && profile) { setName((n) => n || profile.name); setEmail((e) => e || profile.email); }
  }, [open, profile]);

  // Esc closes; focus moves into the panel when it opens
  useEffect(() => {
    if (!open) return;
    panel.current?.querySelector<HTMLElement>("input,button,textarea")?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { setOpen(false); toggle.current?.focus(); } };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, tab]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return FAQS.map((f, i) => ({ ...f, i }));
    const words = q.split(/\s+/);
    return FAQS.map((f, i) => ({ ...f, i })).filter((f) => words.every((w) => (f.q + " " + f.a).toLowerCase().includes(w)));
  }, [query]);

  async function send(e: FormEvent) {
    e.preventDefault();
    setErr(""); setBusy(true);
    try {
      await api.sendHelp({ name: name.trim(), email: email.trim(), subject: subject.trim(), message: message.trim(), page: pathname, website });
      setSentTo(email.trim());
      setSubject(""); setMessage("");
    } catch (e) {
      setErr(e instanceof api.Unreachable
        ? "We couldn't reach the server. Check your connection and try again."
        : e instanceof Error ? e.message : "Something went wrong.");
    } finally { setBusy(false); }
  }

  return (
    <>
      {open && (
        <div className="help-panel" role="dialog" aria-modal="false" aria-labelledby="help-title" ref={panel}>
          <div className="help-head">
            <button className="help-x" onClick={() => setOpen(false)} aria-label="Close help"><Icon name="x" /></button>
            <h2 id="help-title">How can we help?</h2>
            <p>{RESPONSE_TIME}</p>
            <div className="help-tabs" role="tablist">
              <button role="tab" aria-selected={tab === "answers"} onClick={() => setTab("answers")}>Answers</button>
              <button role="tab" aria-selected={tab === "message"} onClick={() => { setTab("message"); setSentTo(""); }}>Message us</button>
            </div>
          </div>

          <div className="help-body">
            {tab === "answers" && (
              <>
                <label className="help-search">
                  <Icon name="search" />
                  <input type="search" aria-label="Search answers" placeholder="Search answers" value={query} onChange={(e) => { setQuery(e.target.value); setOpenFaq(null); }} />
                </label>
                {results.length ? (
                  <ul className="faq">
                    {results.map((f) => (
                      <li key={f.i}>
                        <button aria-expanded={openFaq === f.i} onClick={() => setOpenFaq(openFaq === f.i ? null : f.i)}>
                          <span>{f.q}</span><Icon name="chev" className="i chev" />
                        </button>
                        {openFaq === f.i && <p>{f.a}</p>}
                      </li>
                    ))}
                  </ul>
                ) : <p className="help-empty">No answers match that. Try other words, or send us a message.</p>}
                <button className="btn btn-ghost btn-sm help-cta" onClick={() => { setTab("message"); setSentTo(""); }}>Still stuck? Message us</button>
              </>
            )}

            {tab === "message" && (sentTo ? (
              <div className="help-sent">
                <span className="help-ok"><Icon name="check" /></span>
                <h3>Message sent</h3>
                <p>We'll reply to <b>{sentTo}</b>. {RESPONSE_TIME}</p>
                <button className="btn btn-ghost btn-sm" onClick={() => setSentTo("")}>Send another message</button>
              </div>
            ) : (
              <form onSubmit={send} className="help-form">
                <label htmlFor="h-name">Name</label>
                <input id="h-name" required maxLength={100} autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} />
                <label htmlFor="h-email">Email</label>
                <input id="h-email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <label htmlFor="h-subject">Subject</label>
                <input id="h-subject" maxLength={150} value={subject} onChange={(e) => setSubject(e.target.value)} />
                <label htmlFor="h-msg">How can we help?</label>
                <textarea id="h-msg" required minLength={10} maxLength={5000} rows={5} value={message} onChange={(e) => setMessage(e.target.value)} />
                <input className="hp" tabIndex={-1} autoComplete="off" aria-hidden="true" value={website} onChange={(e) => setWebsite(e.target.value)} name="website" />
                {err && <p className="err" role="alert">{err}</p>}
                <button className="btn btn-primary help-send" disabled={busy}>{busy ? "Sending" : "Send message"}</button>
              </form>
            ))}
          </div>
        </div>
      )}

      <button ref={toggle} className={`help-fab${open ? " is-open" : ""}`} onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-label={open ? "Close help" : "Help"}>
        <Icon name={open ? "chev" : "quiz"} />
        <span>Help</span>
      </button>
    </>
  );
}
