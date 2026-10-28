/**
 * Shared helpers for the learner API. Data lives in one R2 bucket as one JSON
 * file per learner: learners/<sha256(email)>.json
 */

export interface Env {
  LEARNERS: R2Bucket;
  /** optional: set with `wrangler pages secret put ADMIN_KEY` to enable the subscriber export */
  ADMIN_KEY?: string;
}

export type LearnerData = {
  progress: Record<string, boolean>;
  logs: { id: string; what: string; tool?: string | null; why?: string | null; createdAt: string }[];
};

export type LearnerRecord = {
  version: 1;
  name: string;
  email: string;
  consent: { updates: boolean; at: string };
  createdAt: string;
  updatedAt: string;
  question: string;
  answer: { salt: string; hash: string; iterations: number };
  /** sha256 of each device's save token (newest last) */
  tokens: string[];
  failed: { count: number; lockedUntil: string | null };
  data: LearnerData;
};

export const MAX_ATTEMPTS = 5;
export const LOCK_MINUTES = 15;
const ITERATIONS = 100_000; // the maximum PBKDF2 iteration count Workers allow
const MAX_TOKENS = 10;
const MAX_BODY = 256 * 1024;

export const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json", "cache-control": "no-store" } });

export const error = (status: number, message: string, extra: Record<string, unknown> = {}) => json({ error: message, ...extra }, status);

export async function readBody<T>(request: Request): Promise<T | null> {
  const len = Number(request.headers.get("content-length") ?? 0);
  if (len > MAX_BODY) return null;
  const text = await request.text();
  if (text.length > MAX_BODY) return null;
  try { return JSON.parse(text) as T; } catch { return null; }
}

export const normEmail = (e: unknown) => (typeof e === "string" ? e.trim().toLowerCase() : "");
export const validEmail = (e: string) => e.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e);
export const normAnswer = (a: unknown) => (typeof a === "string" ? a.trim().toLowerCase().replace(/\s+/g, " ") : "");
export const cleanText = (s: unknown, max: number) => (typeof s === "string" ? s.trim().slice(0, max) : "");

const hex = (buf: ArrayBuffer) => [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
const fromHex = (h: string) => new Uint8Array(h.match(/.{2}/g)!.map((b) => parseInt(b, 16)));

export async function sha256(s: string) {
  return hex(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s)));
}

export const keyFor = async (email: string) => `learners/${await sha256(email)}.json`;

export function randomHex(bytes = 32) {
  const a = new Uint8Array(bytes);
  crypto.getRandomValues(a);
  return hex(a.buffer);
}

async function pbkdf2(answer: string, saltHex: string, iterations: number) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(answer), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt: fromHex(saltHex), iterations }, key, 256);
  return hex(bits);
}

export async function hashAnswer(answer: string) {
  const salt = randomHex(16);
  return { salt, hash: await pbkdf2(answer, salt, ITERATIONS), iterations: ITERATIONS };
}

export async function checkAnswer(answer: string, stored: LearnerRecord["answer"]) {
  const h = await pbkdf2(answer, stored.salt, stored.iterations);
  // constant-time comparison
  if (h.length !== stored.hash.length) return false;
  let diff = 0;
  for (let i = 0; i < h.length; i++) diff |= h.charCodeAt(i) ^ stored.hash.charCodeAt(i);
  return diff === 0;
}

export async function issueToken(rec: LearnerRecord) {
  const token = randomHex(32);
  rec.tokens = [...rec.tokens, await sha256(token)].slice(-MAX_TOKENS);
  return token;
}

export async function getRecord(env: Env, email: string) {
  const obj = await env.LEARNERS.get(await keyFor(email));
  return obj ? ((await obj.json()) as LearnerRecord) : null;
}

export async function putRecord(env: Env, rec: LearnerRecord) {
  await env.LEARNERS.put(await keyFor(rec.email), JSON.stringify(rec), {
    httpMetadata: { contentType: "application/json" },
    customMetadata: { updates: String(rec.consent.updates) },
  });
}

/** Keep stored data well-formed and bounded, whatever the client sends. */
export function cleanData(d: unknown): LearnerData {
  const src = (d ?? {}) as Partial<LearnerData>;
  const progress: Record<string, boolean> = {};
  if (src.progress && typeof src.progress === "object") {
    for (const [k, v] of Object.entries(src.progress).slice(0, 2000)) {
      if (v === true && /^[\w-]{1,40}$/.test(k)) progress[k] = true;
    }
  }
  const logs = Array.isArray(src.logs)
    ? src.logs.slice(0, 1000).filter((l) => l && typeof l.what === "string").map((l) => ({
        id: cleanText(l.id, 64) || randomHex(8),
        what: cleanText(l.what, 500),
        tool: cleanText(l.tool, 100) || null,
        why: cleanText(l.why, 2000) || null,
        createdAt: cleanText(l.createdAt, 40) || new Date().toISOString(),
      }))
    : [];
  return { progress, logs };
}

export const publicData = (rec: LearnerRecord) => ({ name: rec.name, email: rec.email, consent: rec.consent, data: rec.data, updatedAt: rec.updatedAt });
