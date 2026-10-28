import {
  type Env, LOCK_MINUTES, MAX_ATTEMPTS, checkAnswer, error, getRecord, issueToken, json,
  normAnswer, normEmail, publicData, putRecord, readBody, validEmail,
} from "../_shared";

/** POST { email, answer } → the learner's saved data and a save token for this browser. */
export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const b = await readBody<{ email?: string; answer?: string }>(request);
  const email = normEmail(b?.email);
  if (!validEmail(email)) return error(400, "Enter a valid email address.");
  const rec = await getRecord(env, email);
  if (!rec) return error(404, "No learner found with this email.");

  const now = Date.now();
  if (rec.failed.lockedUntil && Date.parse(rec.failed.lockedUntil) > now) {
    const mins = Math.ceil((Date.parse(rec.failed.lockedUntil) - now) / 60000);
    return error(423, `Too many wrong answers. Try again in ${mins} minute${mins === 1 ? "" : "s"}.`, { retryAfterMinutes: mins });
  }

  if (!(await checkAnswer(normAnswer(b?.answer), rec.answer))) {
    rec.failed.count += 1;
    const left = MAX_ATTEMPTS - rec.failed.count;
    if (left <= 0) {
      rec.failed = { count: 0, lockedUntil: new Date(now + LOCK_MINUTES * 60000).toISOString() };
      await putRecord(env, rec);
      return error(423, `Too many wrong answers. Try again in ${LOCK_MINUTES} minutes.`, { retryAfterMinutes: LOCK_MINUTES });
    }
    await putRecord(env, rec);
    return error(401, `That answer doesn't match. ${left} attempt${left === 1 ? "" : "s"} left.`, { attemptsLeft: left });
  }

  rec.failed = { count: 0, lockedUntil: null };
  const token = await issueToken(rec);
  await putRecord(env, rec);
  return json({ token, ...publicData(rec) });
};
