import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import * as api from "./api";
import type { LearnerData, LogEntry } from "./api";
import type { Progress } from "../content";

/**
 * Learner state. The browser (localStorage) is always the main copy, so the site
 * works instantly and offline. When the learner has a backup token, every change
 * is also saved to R2 in the background.
 */

const PROFILE_KEY = "delegate.profile.v1";
const PROGRESS_KEY = "delegate.progress.v1";
const LOG_KEY = "delegate.failures.v2";
const LEGACY_LOG_KEY = "delegate.failures.v1";
/** sessionStorage: visitor closed the welcome form, so don't reopen it until their next visit */
const DISMISSED_KEY = "delegate.welcome.dismissed";

export type Profile = { name: string; email: string; updates: boolean; token: string | null };
export type SyncState = "none" | "saving" | "saved" | "offline" | "relink";

type Store = {
  profile: Profile | null;
  progress: Progress;
  logs: LogEntry[];
  sync: SyncState;
  setItem: (key: string, done: boolean) => void;
  resetProgress: () => void;
  addLog: (e: { what: string; tool?: string; why?: string }) => void;
  removeLog: (id: string) => void;
  /** after a successful register or restore */
  linkAccount: (a: api.Account, updates?: boolean) => void;
  /** keep going without a backup (server unreachable) */
  saveProfileLocally: (p: { name: string; email: string; updates: boolean }) => void;
  exportJSON: () => void;
  importJSON: (file: File) => Promise<string>;
  forgetBrowser: () => void;
  welcomeOpen: boolean;
  openWelcome: () => void;
  closeWelcome: () => void;
};

const Ctx = createContext<Store | null>(null);

const read = <T,>(k: string, d: T): T => {
  try { const v = localStorage.getItem(k); return v ? (JSON.parse(v) as T) : d; } catch { return d; }
};
const write = (k: string, v: unknown) => {
  try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* storage unavailable */ }
};
const remove = (k: string) => { try { localStorage.removeItem(k); } catch { /* ignore */ } };

function readLocalLogs(): LogEntry[] {
  const v2 = read<LogEntry[]>(LOG_KEY, []);
  const v1 = read<{ w: string; t?: string; y?: string }[]>(LEGACY_LOG_KEY, []);
  return [...v2, ...v1.map((e, i) => ({ id: `m${Date.now()}${i}`, what: e.w, tool: e.t, why: e.y, createdAt: new Date().toISOString() }))];
}

const newId = () => (crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`);

/** Union of completed items; logs de-duplicated by id, newest first. */
function merge(a: LearnerData, b: LearnerData): LearnerData {
  const progress: Progress = { ...a.progress };
  for (const [k, v] of Object.entries(b.progress)) if (v) progress[k] = true;
  const seen = new Map<string, LogEntry>();
  for (const l of [...a.logs, ...b.logs]) if (!seen.has(l.id)) seen.set(l.id, l);
  return { progress, logs: [...seen.values()].sort((x, y) => y.createdAt.localeCompare(x.createdAt)) };
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(() => read(PROFILE_KEY, null));
  const [progress, setProgress] = useState<Progress>(() => read(PROGRESS_KEY, {}));
  const [logs, setLogs] = useState<LogEntry[]>(readLocalLogs);
  const [sync, setSync] = useState<SyncState>(() => (read<Profile | null>(PROFILE_KEY, null)?.token ? "saved" : "none"));
  const [welcomeOpen, setWelcomeOpen] = useState(() => {
    if (read(PROFILE_KEY, null) !== null) return false;
    try { return sessionStorage.getItem(DISMISSED_KEY) !== "1"; } catch { return true; }
  });
  const firstRun = useRef(true);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => { write(PROFILE_KEY, profile); }, [profile]);
  useEffect(() => { write(PROGRESS_KEY, progress); }, [progress]);
  useEffect(() => { write(LOG_KEY, logs); remove(LEGACY_LOG_KEY); }, [logs]);

  // background backup to R2, debounced
  const email = profile?.email, token = profile?.token;
  useEffect(() => {
    if (firstRun.current) { firstRun.current = false; return; }
    if (!email || !token) return;
    setSync("saving");
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(async () => {
      try {
        await api.save(email, token, { progress, logs });
        setSync("saved");
      } catch (e) {
        if (e instanceof api.ApiError && e.status === 401) {
          setProfile((p) => (p ? { ...p, token: null } : p));
          setSync("relink");
        } else setSync("offline");
      }
    }, 800);
    return () => window.clearTimeout(timer.current);
  }, [progress, logs, email, token]);

  // retry a failed backup when the connection comes back
  useEffect(() => {
    const retry = () => { if (sync === "offline") setLogs((l) => [...l]); };
    window.addEventListener("online", retry);
    return () => window.removeEventListener("online", retry);
  }, [sync]);

  const setItem = useCallback((key: string, done: boolean) => {
    setProgress((p) => {
      const next = { ...p };
      if (done) next[key] = true; else delete next[key];
      return next;
    });
  }, []);

  const resetProgress = useCallback(() => setProgress({}), []);

  const addLog = useCallback((e: { what: string; tool?: string; why?: string }) => {
    setLogs((l) => [{ id: newId(), ...e, createdAt: new Date().toISOString() }, ...l]);
  }, []);

  const removeLog = useCallback((id: string) => setLogs((l) => l.filter((x) => x.id !== id)), []);

  const linkAccount = useCallback((a: api.Account, updates?: boolean) => {
    const merged = merge(a.data, { progress: read(PROGRESS_KEY, {}), logs: readLocalLogs() });
    setProgress(merged.progress);
    setLogs(merged.logs);
    setProfile({ name: a.name, email: a.email, updates: updates ?? a.consent.updates, token: a.token });
    setSync("saving"); // the merged copy is pushed by the backup effect
    setWelcomeOpen(false);
  }, []);

  const saveProfileLocally = useCallback((p: { name: string; email: string; updates: boolean }) => {
    setProfile({ ...p, token: null });
    setSync("none");
    setWelcomeOpen(false);
  }, []);

  const exportJSON = useCallback(() => {
    const payload = {
      app: "delegate", version: 1, exportedAt: new Date().toISOString(),
      learner: profile ? { name: profile.name, email: profile.email } : null,
      progress, logs,
    };
    const url = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `delegate-progress-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }, [profile, progress, logs]);

  const importJSON = useCallback(async (file: File) => {
    let parsed: { app?: string; progress?: Progress; logs?: LogEntry[] };
    try { parsed = JSON.parse(await file.text()); } catch { throw new Error("That file isn't valid JSON."); }
    if (parsed.app !== "delegate" || typeof parsed.progress !== "object") throw new Error("That file isn't a Delegate progress file.");
    const incoming: LearnerData = {
      progress: Object.fromEntries(Object.entries(parsed.progress ?? {}).filter(([, v]) => v === true)) as Progress,
      logs: Array.isArray(parsed.logs) ? parsed.logs.filter((l) => l && typeof l.what === "string" && typeof l.id === "string") : [],
    };
    const merged = merge({ progress, logs }, incoming);
    const added = Object.keys(merged.progress).length - Object.keys(progress).length;
    setProgress(merged.progress);
    setLogs(merged.logs);
    return added > 0 ? `Imported. ${added} more item${added === 1 ? "" : "s"} marked complete.` : "Imported. Nothing new to add.";
  }, [progress, logs]);

  const forgetBrowser = useCallback(() => {
    [PROFILE_KEY, PROGRESS_KEY, LOG_KEY].forEach(remove);
    setProfile(null);
    setProgress({});
    setLogs([]);
    setSync("none");
    setWelcomeOpen(true);
  }, []);

  const value = useMemo<Store>(() => ({
    profile, progress, logs, sync, setItem, resetProgress, addLog, removeLog, linkAccount, saveProfileLocally,
    exportJSON, importJSON, forgetBrowser, welcomeOpen,
    openWelcome: () => setWelcomeOpen(true),
    closeWelcome: () => {
      try { sessionStorage.setItem(DISMISSED_KEY, "1"); } catch { /* ignore */ }
      setWelcomeOpen(false);
    },
  }), [profile, progress, logs, sync, setItem, resetProgress, addLog, removeLog, linkAccount, saveProfileLocally, exportJSON, importJSON, forgetBrowser, welcomeOpen]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const s = useContext(Ctx);
  if (!s) throw new Error("useStore must be used inside StoreProvider");
  return s;
}
