import { type Env, error, getRecord, json, normEmail, readBody, validEmail } from "../_shared";

/** POST { email } → { exists, question? }  Tells the welcome screen whether this is a new or returning learner. */
export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const body = await readBody<{ email?: string }>(request);
  const email = normEmail(body?.email);
  if (!validEmail(email)) return error(400, "Enter a valid email address.");
  const rec = await getRecord(env, email);
  return json(rec ? { exists: true, question: rec.question } : { exists: false });
};
