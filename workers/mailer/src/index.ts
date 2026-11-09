/**
 * delegate-mailer: sends one email to the site owner. Only reachable through the Pages service binding
 * (workers_dev = false, no routes), so it doesn't need its own auth.
 *
 * POST any path with JSON { subject, text, html?, replyTo? } → 200 { ok: true, messageId } or 4xx/5xx { ok: false, error }.
 */

interface Env {
  EMAIL: SendEmail;
  MAIL_FROM: string;
  MAIL_FROM_NAME: string;
  MAIL_TO: string;
}

type Body = { subject?: string; text?: string; html?: string; replyTo?: string };

const reply = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method !== "POST") return reply(405, { ok: false, error: "POST only" });
    let b: Body;
    try { b = await request.json(); } catch { return reply(400, { ok: false, error: "bad JSON" }); }
    if (!b.subject || !b.text) return reply(400, { ok: false, error: "subject and text are required" });

    try {
      const res = await env.EMAIL.send({
        from: { email: env.MAIL_FROM, name: env.MAIL_FROM_NAME },
        to: env.MAIL_TO,
        subject: b.subject.slice(0, 200),
        text: b.text,
        ...(b.html ? { html: b.html } : {}),
        ...(b.replyTo ? { replyTo: b.replyTo } : {}),
      });
      return reply(200, { ok: true, messageId: res.messageId });
    } catch (e) {
      const err = e as { code?: string; message?: string };
      console.error("send failed", err.code, err.message, "to:", env.MAIL_TO, "from:", env.MAIL_FROM);
      return reply(502, { ok: false, error: `${err.code ?? "send_failed"}: ${err.message ?? "unknown error"}` });
    }
  },
};
