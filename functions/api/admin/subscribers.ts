import type { Env, LearnerRecord } from "../../_shared";

/**
 * GET /api/admin/subscribers  (header: Authorization: Bearer <ADMIN_KEY>)
 * Returns a CSV of learners who agreed to updates and reminders.
 * Disabled until you set the ADMIN_KEY secret.
 */
export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  if (!env.ADMIN_KEY || request.headers.get("authorization") !== `Bearer ${env.ADMIN_KEY}`) {
    return new Response("Not found", { status: 404 });
  }
  const rows = [["name", "email", "joined", "last_active", "lessons_done"]];
  let cursor: string | undefined;
  do {
    const page = await env.LEARNERS.list({ prefix: "learners/", cursor, include: ["customMetadata"] });
    for (const o of page.objects) {
      if (o.customMetadata?.updates !== "true") continue;
      const rec = (await (await env.LEARNERS.get(o.key))?.json()) as LearnerRecord | undefined;
      if (!rec?.consent.updates) continue;
      const lessons = Object.keys(rec.data.progress).filter((k) => k.startsWith("L")).length;
      rows.push([rec.name, rec.email, rec.createdAt, rec.updatedAt, String(lessons)]);
    }
    cursor = page.truncated ? page.cursor : undefined;
  } while (cursor);
  const csv = rows.map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(",")).join("\n");
  return new Response(csv, { headers: { "content-type": "text/csv", "content-disposition": 'attachment; filename="subscribers.csv"' } });
};
