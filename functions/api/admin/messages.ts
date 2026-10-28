import type { Env } from "../../_shared";
import type { HelpMessage } from "../help";

/**
 * GET /api/admin/messages  (header: Authorization: Bearer <ADMIN_KEY>)
 * Returns help messages, newest first. Add ?format=csv for a spreadsheet.
 * Disabled until you set the ADMIN_KEY secret.
 */
export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  if (!env.ADMIN_KEY || request.headers.get("authorization") !== `Bearer ${env.ADMIN_KEY}`) {
    return new Response("Not found", { status: 404 });
  }
  const keys: string[] = [];
  let cursor: string | undefined;
  do {
    const page = await env.LEARNERS.list({ prefix: "messages/", cursor });
    keys.push(...page.objects.map((o) => o.key));
    cursor = page.truncated ? page.cursor : undefined;
  } while (cursor);

  const newest = keys.sort().reverse().slice(0, 500);
  const msgs = (await Promise.all(newest.map(async (k) => (await env.LEARNERS.get(k))?.json<HelpMessage>()))).filter(Boolean) as HelpMessage[];

  if (new URL(request.url).searchParams.get("format") === "csv") {
    const rows = [["date", "name", "email", "subject", "message", "page"], ...msgs.map((m) => [m.createdAt, m.name, m.email, m.subject, m.message, m.page])];
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    return new Response(csv, { headers: { "content-type": "text/csv", "content-disposition": 'attachment; filename="help-messages.csv"' } });
  }
  return new Response(JSON.stringify(msgs, null, 2), { headers: { "content-type": "application/json", "cache-control": "no-store" } });
};
