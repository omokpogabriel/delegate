import {
  type Env, type LearnerRecord, cleanData, cleanText, error, getRecord, hashAnswer, issueToken, json,
  normAnswer, normEmail, publicData, putRecord, readBody, validEmail,
} from "../_shared";

type Body = { name?: string; email?: string; question?: string; answer?: string; updates?: boolean; data?: unknown };

/** POST → creates a learner record. Returns a save token for this browser. */
export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const b = await readBody<Body>(request);
  if (!b) return error(400, "That request couldn't be read.");
  const email = normEmail(b.email);
  const name = cleanText(b.name, 100);
  const question = cleanText(b.question, 200);
  const answer = normAnswer(b.answer);
  if (!name) return error(400, "Enter your full name.");
  if (!validEmail(email)) return error(400, "Enter a valid email address.");
  if (question.length < 5) return error(400, "Choose or write a secret question.");
  if (answer.length < 3) return error(400, "Your answer needs at least 3 characters.");
  if (answer.length > 200) return error(400, "Keep your answer under 200 characters.");

  if (await getRecord(env, email)) return error(409, "There's already a learner with this email.");

  const now = new Date().toISOString();
  const rec: LearnerRecord = {
    version: 1, name, email,
    consent: { updates: b.updates === true, at: now },
    createdAt: now, updatedAt: now,
    question, answer: await hashAnswer(answer),
    tokens: [], failed: { count: 0, lockedUntil: null },
    data: cleanData(b.data),
  };
  const token = await issueToken(rec);
  await putRecord(env, rec);
  return json({ token, ...publicData(rec) }, 201);
};
