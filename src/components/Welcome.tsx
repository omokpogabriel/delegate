import { useEffect, useRef, useState, type FormEvent } from "react";
import * as api from "../lib/api";
import { useStore } from "../lib/store";
import { Icon } from "./Icon";

const QUESTIONS = [
  "What was the name of your first school?",
  "What is the name of a teacher you remember?",
  "What was your childhood nickname?",
  "What street did you grow up on?",
  "What was the first thing you built that you were proud of?",
];
const OWN = "__own__";

type Step = "details" | "returning" | "secret" | "unreachable";

export function Welcome() {
  const { welcomeOpen, closeWelcome, profile, progress, logs, linkAccount, saveProfileLocally } = useStore();
  const [step, setStep] = useState<Step>("details");
  const [name, setName] = useState(profile?.name ?? "");
  const [email, setEmail] = useState(profile?.email ?? "");
  const [updates, setUpdates] = useState(profile?.updates ?? false);
  const [question, setQuestion] = useState(QUESTIONS[0]);
  const [ownQuestion, setOwnQuestion] = useState("");
  const [knownQuestion, setKnownQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [answer2, setAnswer2] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const dialog = useRef<HTMLDialogElement>(null);
  const canClose = profile !== null; // first-time visitors must enter their details

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (welcomeOpen && !d.open) {
      setStep("details"); setErr(""); setAnswer(""); setAnswer2("");
      setName(profile?.name ?? ""); setEmail(profile?.email ?? ""); setUpdates(profile?.updates ?? false);
      d.showModal();
    }
    if (!welcomeOpen && d.open) d.close();
  }, [welcomeOpen, profile]);

  const fail = (e: unknown) => {
    if (e instanceof api.Unreachable) setStep("unreachable");
    else setErr(e instanceof Error ? e.message : "Something went wrong.");
  };

  async function submitDetails(e: FormEvent) {
    e.preventDefault();
    setErr(""); setBusy(true);
    try {
      const r = await api.lookup(email);
      if (r.exists) { setKnownQuestion(r.question ?? ""); setStep("returning"); }
      else setStep("secret");
      setAnswer(""); setAnswer2("");
    } catch (e) { fail(e); } finally { setBusy(false); }
  }

  async function submitSecret(e: FormEvent) {
    e.preventDefault();
    setErr("");
    if (answer.trim().toLowerCase() !== answer2.trim().toLowerCase()) { setErr("The two answers don't match."); return; }
    const q = question === OWN ? ownQuestion.trim() : question;
    setBusy(true);
    try {
      const acct = await api.register({ name: name.trim(), email: email.trim(), question: q, answer, updates, data: { progress, logs } });
      linkAccount(acct, updates);
    } catch (e) { fail(e); } finally { setBusy(false); }
  }

  async function submitReturning(e: FormEvent) {
    e.preventDefault();
    setErr(""); setBusy(true);
    try {
      const acct = await api.restore(email.trim(), answer);
      linkAccount(acct);
    } catch (e) { fail(e); } finally { setBusy(false); }
  }

  return (
    <dialog ref={dialog} className="welcome" aria-labelledby="wl-title"
      onCancel={(e) => { if (!canClose) e.preventDefault(); else closeWelcome(); }}>
      <div className="wl-art" aria-hidden="true"><span className="s1" /><span className="s2" /><span className="s3" /></div>
      <div className="wl-body">
        {canClose && <button className="wl-x" onClick={closeWelcome} aria-label="Close"><Icon name="x" /></button>}

        {step === "details" && (
          <form onSubmit={submitDetails}>
            <h2 id="wl-title">{profile ? "Back up your progress" : "Welcome to Delegate"}</h2>
            <p className="wl-lede">{profile ? "Confirm your details to save your progress online, so you can continue on any device." : "Tell us who you are and we'll save your progress, so you can pick up where you left off on any device. No password needed."}</p>
            <label htmlFor="wl-name">Full name</label>
            <input id="wl-name" required autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} maxLength={100} />
            <label htmlFor="wl-email">Email</label>
            <input id="wl-email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <label className="wl-check"><input type="checkbox" checked={updates} onChange={(e) => setUpdates(e.target.checked)} /><span>Email me course updates and study reminders. You can opt out any time.</span></label>
            {err && <p className="err" role="alert">{err}</p>}
            <button className="btn btn-primary wl-go" disabled={busy}>{busy ? "Checking" : "Continue"}</button>
            <p className="wl-fine">We use your email only for course updates and reminders you agree to, and to find your progress. We never share it.</p>
          </form>
        )}

        {step === "secret" && (
          <form onSubmit={submitSecret}>
            <h2 id="wl-title">Set a secret question</h2>
            <p className="wl-lede">On another device, you'll enter your email and this answer to get your progress back. Pick an answer other people can't guess or find online.</p>
            <label htmlFor="wl-q">Question</label>
            <select id="wl-q" value={question} onChange={(e) => setQuestion(e.target.value)}>
              {QUESTIONS.map((q) => <option key={q} value={q}>{q}</option>)}
              <option value={OWN}>Write my own question</option>
            </select>
            {question === OWN && (<><label htmlFor="wl-own">Your question</label><input id="wl-own" required minLength={5} maxLength={200} value={ownQuestion} onChange={(e) => setOwnQuestion(e.target.value)} /></>)}
            <label htmlFor="wl-a">Answer</label>
            <input id="wl-a" type="password" required minLength={3} maxLength={200} autoComplete="new-password" value={answer} onChange={(e) => setAnswer(e.target.value)} />
            <label htmlFor="wl-a2">Type the answer again</label>
            <input id="wl-a2" type="password" required autoComplete="new-password" value={answer2} onChange={(e) => setAnswer2(e.target.value)} />
            <p className="wl-hint">Not case-sensitive. We store it scrambled, so we can't read it or remind you of it.</p>
            {err && <p className="err" role="alert">{err}</p>}
            <button className="btn btn-primary wl-go" disabled={busy}>{busy ? "Saving" : "Save and start learning"}</button>
            <button type="button" className="linkbtn wl-back" onClick={() => { setStep("details"); setErr(""); }}>Back</button>
          </form>
        )}

        {step === "returning" && (
          <form onSubmit={submitReturning}>
            <h2 id="wl-title">Welcome back</h2>
            <p className="wl-lede">There's saved progress for <b>{email.trim().toLowerCase()}</b>. Answer your secret question to load it here.</p>
            <label htmlFor="wl-ra">{knownQuestion}</label>
            <input id="wl-ra" type="password" required autoComplete="current-password" value={answer} onChange={(e) => setAnswer(e.target.value)} />
            {err && <p className="err" role="alert">{err}</p>}
            <button className="btn btn-primary wl-go" disabled={busy}>{busy ? "Checking" : "Load my progress"}</button>
            <button type="button" className="linkbtn wl-back" onClick={() => { setStep("details"); setErr(""); setAnswer(""); }}>Use a different email</button>
          </form>
        )}

        {step === "unreachable" && (
          <div>
            <h2 id="wl-title">We can't reach the server right now</h2>
            <p className="wl-lede">You can start learning now. Your progress will be saved in this browser, and you can back it up online later from your account menu.</p>
            <button className="btn btn-primary wl-go" onClick={() => saveProfileLocally({ name: name.trim(), email: email.trim(), updates })}>Continue in this browser</button>
            <button type="button" className="linkbtn wl-back" onClick={() => { setStep("details"); setErr(""); }}>Try again</button>
          </div>
        )}
      </div>
    </dialog>
  );
}
