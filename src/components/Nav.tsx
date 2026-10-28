import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Icon } from "./Icon";
import { useStore, type SyncState } from "../lib/store";
import { useTheme } from "../lib/theme";
import { overall } from "../content";

const SYNC: Record<SyncState, { label: string; detail: string }> = {
  none: { label: "This browser only", detail: "Your progress is saved in this browser only." },
  saving: { label: "Saving", detail: "Backing up your latest progress." },
  saved: { label: "Backed up", detail: "Your progress is backed up online." },
  offline: { label: "Not backed up", detail: "Couldn't reach the server. Your progress is safe in this browser and will back up when you're online." },
  relink: { label: "Reconnect", detail: "This browser needs your secret answer again to keep backing up." },
};

export function Nav() {
  const { progress, profile, openWelcome } = useStore();
  const { isDark, toggle } = useTheme();
  const o = overall(progress);
  const cta = o.next ? { to: `/lesson/${o.next.l.id}`, label: o.started ? "Continue learning" : "Start learning" } : { to: "/#content", label: "View curriculum" };

  return (
    <header className="nav">
      <div className="wrap">
        <Link className="logo" to="/"><span className="mark" aria-hidden="true" />Delegate</Link>
        <nav aria-label="Main">
          <Link to="/#months">Course</Link>
          <Link to="/#method">How it works</Link>
          <Link to="/#content">Curriculum</Link>
          <Link to="/#log">Failure log</Link>
        </nav>
        <div className="right">
          <button className="iconbtn" onClick={toggle} aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}>
            <Icon name={isDark ? "sun" : "moon"} />
          </button>
          {profile ? <Account /> : <button className="btn btn-ghost btn-sm" onClick={openWelcome}>Save my progress</button>}
          <Link className="btn btn-primary btn-sm" id="navCta" to={cta.to}>{cta.label}</Link>
        </div>
      </div>
    </header>
  );
}

function Account() {
  const { profile, sync, exportJSON, importJSON, forgetBrowser, openWelcome } = useStore();
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const file = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) { setMsg(""); return; }
    const close = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", esc);
    return () => { document.removeEventListener("mousedown", close); document.removeEventListener("keydown", esc); };
  }, [open]);

  if (!profile) return null;
  const needsBackup = !profile.token;

  return (
    <div className="acct" ref={ref}>
      <button onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-haspopup="true">
        <span className="avatar">{profile.name[0]?.toUpperCase() ?? "?"}</span>
        <span className={`syncdot ${sync}`}><i />{SYNC[sync].label}</span>
      </button>
      {open && (
        <div className="menu">
          <div className="menu-head"><b>{profile.name}</b><span>{profile.email}</span></div>
          <p className={`menu-sync ${sync}`}>{SYNC[sync].detail}</p>
          {(needsBackup || sync === "relink") && (
            <button className="primary" onClick={() => { setOpen(false); openWelcome(); }}><Icon name="cloud" />{sync === "relink" ? "Reconnect backup" : "Back up my progress online"}</button>
          )}
          <button onClick={exportJSON}><Icon name="download" />Download my progress (JSON)</button>
          <button onClick={() => file.current?.click()}><Icon name="upload" />Import a progress file</button>
          <input ref={file} type="file" accept="application/json,.json" hidden onChange={async (e) => {
            const f = e.target.files?.[0];
            e.target.value = "";
            if (!f) return;
            try { setMsg(await importJSON(f)); } catch (err) { setMsg(err instanceof Error ? err.message : "Import failed."); }
          }} />
          {msg && <p className="menu-msg" role="status">{msg}</p>}
          <hr />
          <button onClick={() => {
            const warn = profile.token
              ? "Remove your details and progress from this browser? Your online backup stays, and you can load it again with your email and secret answer."
              : "Remove your details and progress from this browser? You haven't backed up online, so download your progress first if you want to keep it.";
            if (confirm(warn)) { setOpen(false); forgetBrowser(); }
          }}>Not {profile.name.split(" ")[0]}? Use a different email</button>
        </div>
      )}
    </div>
  );
}
