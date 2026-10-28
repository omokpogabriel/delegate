import { type Env, cleanData, error, getRecord, json, normEmail, putRecord, readBody, sha256 } from "../_shared";

/** PUT { email, token, data } → saves progress and failure log. Called automatically by the site. */
export const onRequestPut: PagesFunction<Env> = async ({ request, env }) => {
  const b = await readBody<{ email?: string; token?: string; data?: unknown }>(request);
  const email = normEmail(b?.email);
  if (!email || typeof b?.token !== "string") return error(400, "Missing email or token.");
  const rec = await getRecord(env, email);
  if (!rec || !rec.tokens.includes(await sha256(b.token))) return error(401, "This browser isn't linked to that learner any more.");
  rec.data = cleanData(b.data);
  rec.updatedAt = new Date().toISOString();
  await putRecord(env, rec);
  return json({ updatedAt: rec.updatedAt });
};
