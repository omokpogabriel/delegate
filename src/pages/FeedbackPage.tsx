import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { FeedbackForm } from "../components/Feedback";

/** /feedback: the quick feedback form as its own page, so it can be shared as a link (?from=<page> optional). */
export function FeedbackPage() {
  const { search } = useLocation();
  const from = new URLSearchParams(search).get("from") ?? "/feedback";
  useEffect(() => {
    document.title = "Feedback — Delegate";
    return () => { document.title = "Delegate — learn to work with AI"; };
  }, []);
  return (
    <section className="fb-page">
      <div className="wrap">
        <div className="card">
          <h1>Quick feedback</h1>
          <p className="muted">Tell us what's working and what isn't. It takes 10 seconds and goes straight to the team.</p>
          <FeedbackForm page={from} autoFocus />
        </div>
      </div>
    </section>
  );
}
