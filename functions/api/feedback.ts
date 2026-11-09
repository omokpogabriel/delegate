import { type Env, cleanText, error, json, normEmail, randomHex, readBody, sha256, validEmail } from "../_shared";

/**
 * POST /api/feedback → quick course feedback.
 * 1. Always saved to R2 at feedback/<timestamp>-<id>.json, so nothing is lost if email fails.
 * 2. Emailed to FEEDBACK_TO (default learn@isuxtech.com) through Resend, when RESEND_API_KEY is set.
 *    Setup: see "Feedback emails" in README.md.
 */

const MAX_PER_HOUR = 10; // per visitor IP
const DEFAULT_TO = "learn@isuxtech.com";
const DEFAULT_FROM = "Delegate feedback <feedback@isuxtech.com>";
const RATINGS = ["", "Very poor", "Poor", "OK", "Good", "Excellent"];

type Body = { rating?: number; message?: string; email?: string; page?: string; track?: string; website?: string };

export type Feedback = {
  id: string;
  createdAt: string;
  rating: number | null;
  message: string;
  email: string;
  page: string;
  track: string;
  emailed: boolean;
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const b = await readBody<Body>(request);
  if (!b) return error(400, "That feedback couldn't be read.");
  if (b.website) return json({ ok: true }); // honeypot: bots fill it, people never see it

  const rating = Number.isInteger(b.rating) && b.rating! >= 1 && b.rating! <= 5 ? b.rating! : null;
  const message = cleanText(b.message, 3000);
  const email = normEmail(b.email);
  if (!rating && message.length < 3) return error(400, "Pick a rating or write a few words.");
  if (email && !validEmail(email)) return error(400, "That email doesn't look right. Leave it empty if you don't need a reply.");

  const ip = request.headers.get("cf-connecting-ip") ?? "unknown";
  const hour = new Date().toISOString().slice(0, 13);
  const rlKey = `ratelimit/feedback/${(await sha256(ip)).slice(0, 32)}/${hour}`;
  const count = Number((await (await env.LEARNERS.get(rlKey))?.text()) ?? 0);
  if (count >= MAX_PER_HOUR) return error(429, "Thanks! You've sent a lot of feedback this hour. Please try again later.");
  await env.LEARNERS.put(rlKey, String(count + 1));

  const now = new Date().toISOString();
  const fb: Feedback = {
    id: randomHex(6), createdAt: now, rating, message, email,
    page: cleanText(b.page, 300), track: cleanText(b.track, 30), emailed: false,
  };
  fb.emailed = await sendEmail(env, fb);
  await env.LEARNERS.put(`feedback/${now}-${fb.id}.json`, JSON.stringify(fb), { httpMetadata: { contentType: "application/json" } });
  return json({ ok: true }, 201);
};

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/** Sends one email through Resend. Returns false (and never throws) if it isn't configured or fails. */
async function sendEmail(env: Env, fb: Feedback): Promise<boolean> {
  if (!env.RESEND_API_KEY) return false;
  const stars = fb.rating ? `${"★".repeat(fb.rating)}${"☆".repeat(5 - fb.rating)} ${RATINGS[fb.rating]}` : "No rating";
  const lines = [
    `Rating: ${stars}`,
    `Page: ${fb.page || "-"}${fb.track ? ` (${fb.track} track)` : ""}`,
    `Reply to: ${fb.email || "not given"}`,
    `Sent: ${fb.createdAt}`,
    "",
    fb.message || "(no message)",
  ];
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { authorization: `Bearer ${env.RESEND_API_KEY}`, "content-type": "application/json" },
      body: JSON.stringify({
        from: env.FEEDBACK_FROM || DEFAULT_FROM,
        to: [env.FEEDBACK_TO || DEFAULT_TO],
        ...(fb.email ? { reply_to: fb.email } : {}),
        subject: `Delegate feedback: ${fb.rating ? `${fb.rating}/5` : "comment"}${fb.message ? ` — ${fb.message.slice(0, 60)}` : ""}`,
        text: lines.join("\n"),
        html: `<div style="font-family:system-ui,sans-serif;font-size:15px;line-height:1.5">${lines.slice(0, 4).map((l) => `<div>${esc(l)}</div>`).join("")}<p style="white-space:pre-wrap;border-left:3px solid #3CC1A0;padding-left:12px">${esc(fb.message || "(no message)")}</p></div>`,
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
