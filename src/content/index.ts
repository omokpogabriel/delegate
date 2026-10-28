import { LINKS, MONTHS } from "./course";
import { week1, week2, week3, week4 } from "./month1";
import { week10 } from "./month3";
import type { Lesson, Week } from "./types";

export { LINKS, MONTHS };
export type { Lesson, Week, Month, QuizQuestion, Resource } from "./types";

/** Lessons by week number. Weeks without an entry have no written lessons yet. */
export const LESSONS: Record<number, Lesson[]> = {
  1: week1,
  2: week2,
  3: week3,
  4: week4,
  10: week10,
};

export type LessonRef = { w: number; i: number; l: Lesson };

/** Every live lesson in course order. */
export const ALL_LESSONS: LessonRef[] = Object.keys(LESSONS)
  .map(Number)
  .sort((a, b) => a - b)
  .flatMap((w) => LESSONS[w].map((l, i) => ({ w, i, l })));

export const WEEK_NUMBERS = Array.from({ length: 24 }, (_, i) => i + 1);
export const MONTH_COLORS = ["var(--brand)", "var(--coral)", "var(--sky)", "var(--lilac)", "#E0A100", "var(--mint)"];

export const monthOf = (wn: number) => Math.ceil(wn / 4);
export const weekOf = (wn: number): Week => MONTHS[monthOf(wn) - 1].weeks[(wn - 1) % 4];
export const lessonsFor = (wn: number) => LESSONS[wn] ?? [];
export const lessonMins = (wn: number) => lessonsFor(wn).reduce((a, l) => a + l.mins, 0);
export const hasVideo = (l: Lesson) => l.watch.length > 0;
export const taskId = (wn: number, ti: number) => `t${wn}_${ti}`;
export const lessonKey = (id: string) => `L${id}`;

export const TOTAL_ITEMS = WEEK_NUMBERS.reduce((a, wn) => a + weekOf(wn)[2].length + lessonsFor(wn).length, 0);

export type Progress = Record<string, boolean>;

export function weekStats(p: Progress, wn: number): [done: number, total: number] {
  const tasks = weekOf(wn)[2];
  const ls = lessonsFor(wn);
  const done = tasks.filter((_, ti) => p[taskId(wn, ti)]).length + ls.filter((l) => p[lessonKey(l.id)]).length;
  return [done, tasks.length + ls.length];
}

export function monthStats(p: Progress, mo: number): [number, number] {
  let d = 0, n = 0;
  for (let i = 1; i <= 4; i++) {
    const [wd, wt] = weekStats(p, (mo - 1) * 4 + i);
    d += wd; n += wt;
  }
  return [d, n];
}

export function overall(p: Progress) {
  const done = WEEK_NUMBERS.reduce((a, wn) => a + weekStats(p, wn)[0], 0);
  const lessonsDone = ALL_LESSONS.filter((x) => p[lessonKey(x.l.id)]).length;
  const next = ALL_LESSONS.find((x) => !p[lessonKey(x.l.id)]);
  return { done, total: TOTAL_ITEMS, pct: Math.round((done / TOTAL_ITEMS) * 100), lessonsDone, next, started: lessonsDone > 0 };
}

export const ytId = (u: string) => u.match(/[?&]v=([\w-]{11})/)?.[1] ?? null;
