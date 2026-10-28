import { type Env, cleanText, error, json, normEmail, randomHex, readBody, sha256, validEmail } from "../_shared";

/**
 * POST /api/help → saves a learner's message to R2 at messages/<timestamp>-<id>.json
 * Read them with GET /api/admin/messages (needs ADMIN_KEY), or in the R2 dashboard.
 */

const MAX_PER_HOUR = 5; // per visitor IP

type Body = { name?: string; email?: string; subject?: string; message?: string; page?: string; website?: string };

export type HelpMessage = {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  page: string;
  status: "new";
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const b = await readBody<Body>(request);
  if (!b) return error(400, "That message couldn't be read.");

  // honeypot: real visitors never see or fill this field
  if (b.website) return json({ ok: true });

  const name = cleanText(b.name, 100);
  const email = normEmail(b.email);
  const subject = cleanText(b.subject, 150);
  const message = cleanText(b.message, 5000);
  if (!name) return error(400, "Enter your name.");
  if (!validEmail(email)) return error(400, "Enter a valid email so we can reply.");
  if (message.length < 10) return error(400, "Tell us a little more (at least 10 characters).");

  // simple rate limit: count messages per IP per hour
  const ip = request.headers.get("cf-connecting-ip") ?? "unknown";
  const hour = new Date().toISOString().slice(0, 13);
  const rlKey = `ratelimit/help/${(await sha256(ip)).slice(0, 32)}/${hour}`;
  const count = Number((await (await env.LEARNERS.get(rlKey))?.text()) ?? 0);
  if (count >= MAX_PER_HOUR) return error(429, "You've sent several messages in the last hour. Please try again later.");
  await env.LEARNERS.put(rlKey, String(count + 1));

  const now = new Date().toISOString();
  const msg: HelpMessage = {
    id: randomHex(6), createdAt: now, name, email,
    subject: subject || "(no subject)", message,
    page: cleanText(b.page, 300), status: "new",
  };
  await env.LEARNERS.put(`messages/${now}-${msg.id}.json`, JSON.stringify(msg), { httpMetadata: { contentType: "application/json" } });
  return json({ ok: true }, 201);
};
