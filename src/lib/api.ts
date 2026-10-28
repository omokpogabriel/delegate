import type { Progress } from "../content";

/**
 * Calls to the small learner API (Cloudflare Pages Functions in /functions/api).
 * The browser is the main store; this API only backs data up to R2 and restores it.
 */

export type LogEntry = { id: string; what: string; tool?: string | null; why?: string | null; createdAt: string };
export type LearnerData = { progress: Progress; logs: LogEntry[] };
export type Account = { token: string; name: string; email: string; consent: { updates: boolean }; data: LearnerData; updatedAt: string };

/** Thrown when the API can't be reached at all (offline, or running without the functions). */
export class Unreachable extends Error {}
/** Thrown for a clear "no" from the API, with a message safe to show the learner. */
export class ApiError extends Error {
  constructor(public status: number, message: string) { super(message); }
}

async function call<T>(path: string, method: "POST" | "PUT", body: unknown): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`/api/${path}`, { method, headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
  } catch {
    throw new Unreachable("Couldn't reach the server.");
  }
  const isJson = res.headers.get("content-type")?.includes("application/json");
  if (!isJson) throw new Unreachable("The server isn't available right now.");
  const data = (await res.json()) as T & { error?: string };
  if (!res.ok) throw new ApiError(res.status, data.error ?? "Something went wrong.");
  return data;
}

export const lookup = (email: string) => call<{ exists: boolean; question?: string }>("lookup", "POST", { email });

export const register = (p: { name: string; email: string; question: string; answer: string; updates: boolean; data: LearnerData }) =>
  call<Account>("register", "POST", p);

export const restore = (email: string, answer: string) => call<Account>("restore", "POST", { email, answer });

export const save = (email: string, token: string, data: LearnerData) => call<{ updatedAt: string }>("save", "PUT", { email, token, data });

export const sendHelp = (m: { name: string; email: string; subject: string; message: string; page: string; website: string }) =>
  call<{ ok: true }>("help", "POST", m);
