import { useLocation } from "react-router-dom";
import { LINKS, MONTHS } from "./course";
import { week1, week2, week3, week4 } from "./month1";
import { week10 } from "./month3";
import { UPGRADES } from "./lectures";
import { E_LINKS, E_MONTHS } from "./engineer/course";
import { E_LESSONS } from "./engineer";
import type { Lesson, LessonUpgrade, Month, Week } from "./types";

export type { Lesson, Week, Month, QuizQuestion, Resource, Problem } from "./types";

export type LessonRef = { w: number; i: number; l: Lesson };
export type Progress = Record<string, boolean>;

export type TrackCopy = {
  pill: string;
  /** headline before the accent, with and without a first name */
  h1: string;
  accent: string;
  lede: string;
  outcomes: string[];
  curriculum: string;
  /** short name for the switcher */
  label: string;
};

/** Merge university lectures, objectives and problem sets into a lesson. */
function upgrade(l: Lesson, u?: LessonUpgrade): Lesson {
  if (!u) return l;
  return {
    ...l,
    objectives: u.objectives ?? l.objectives,
    prereqs: u.prereqs ?? l.prereqs,
    problems: u.problems ?? l.problems,
    body: u.notes ? l.body + u.notes : l.body,
    watch: [...(u.lectures ?? []), ...l.watch],
  };
}

/** One course. `prefix` keeps each track's progress keys apart; the agents track uses "" so saved progress keeps working. */
function makeTrack(id: string, base: string, prefix: string, name: string, months: Month[],
  links: Record<string, [string, string]>, raw: Record<number, Lesson[]>, copy: TrackCopy) {
  const lessons: Record<number, Lesson[]> = Object.fromEntries(
    Object.entries(raw).map(([w, ls]) => [w, ls.map((l) => upgrade(l, prefix ? undefined : UPGRADES[l.id]))]),
  );
  const all: LessonRef[] = Object.keys(lessons).map(Number).sort((a, b) => a - b)
    .flatMap((w) => lessons[w].map((l, i) => ({ w, i, l })));
  const weeks = Array.from({ length: months.length * 4 }, (_, i) => i + 1);
  const monthOf = (wn: number) => Math.ceil(wn / 4);
  const weekOf = (wn: number): Week => months[monthOf(wn) - 1].weeks[(wn - 1) % 4];
  const lessonsFor = (wn: number) => lessons[wn] ?? [];
  const lessonKey = (lid: string) => `L${prefix}${lid}`;
  const taskId = (wn: number, ti: number) => `t${prefix}${wn}_${ti}`;
  const total = weeks.reduce((a, wn) => a + weekOf(wn)[2].length + lessonsFor(wn).length, 0);

  function weekStats(p: Progress, wn: number): [done: number, total: number] {
    const tasks = weekOf(wn)[2];
    const ls = lessonsFor(wn);
    const done = tasks.filter((_, ti) => p[taskId(wn, ti)]).length + ls.filter((l) => p[lessonKey(l.id)]).length;
    return [done, tasks.length + ls.length];
  }
  function monthStats(p: Progress, mo: number): [number, number] {
    let d = 0, n = 0;
    for (let i = 1; i <= 4; i++) {
      const [wd, wt] = weekStats(p, (mo - 1) * 4 + i);
      d += wd; n += wt;
    }
    return [d, n];
  }
  function overall(p: Progress) {
    const done = weeks.reduce((a, wn) => a + weekStats(p, wn)[0], 0);
    const lessonsDone = all.filter((x) => p[lessonKey(x.l.id)]).length;
    const next = all.find((x) => !p[lessonKey(x.l.id)]);
    return { done, total, pct: Math.round((done / total) * 100), lessonsDone, next, started: lessonsDone > 0 };
  }

  return {
    id, base, name, copy, months, links, lessons, all, weeks,
    monthOf, weekOf, lessonsFor, lessonKey, taskId, weekStats, monthStats, overall,
    lessonMins: (wn: number) => lessonsFor(wn).reduce((a, l) => a + l.mins, 0),
    /** link to a lesson in this track */
    lessonHref: (lid: string) => `${base}/lesson/${lid}`,
    /** link to a section of this track's home page */
    hash: (h: string) => `${base || "/"}#${h}`,
    home: base || "/",
  };
}

export type Track = ReturnType<typeof makeTrack>;

export const AGENTS = makeTrack("agents", "", "", "AI agent user", MONTHS, LINKS,
  { 1: week1, 2: week2, 3: week3, 4: week4, 10: week10 },
  {
    label: "Agent user track",
    pill: "Self-paced, 24 weeks, free",
    h1: "Become one of ",
    accent: "the best users of AI",
    lede: "A hands-on course for people who want to hand real work to AI agents and trust what comes back. University lectures from Stanford, MIT and Berkeley, lecture notes with problem sets, real projects, and a practical exam at the end of every month.",
    outcomes: [
      "Ship real software with 3–5 agents working in parallel, and trust the output",
      "Pick the right model for a task from your own evals, not hype",
      "Run open models on your own hardware and know when it's worth it",
      "Design memory and retrieval for an AI system",
      "Build your own agent harness and MCP servers",
      "Run agents in production that work without you watching",
    ],
    curriculum: "Lessons are live for Month 1 and Week 10; the rest are on the way. Every week's build and tasks are ready now.",
  });

export const ENGINEER = makeTrack("engineer", "/engineer", "e", "AI engineer", E_MONTHS, E_LINKS, E_LESSONS,
  {
    label: "AI engineer track",
    pill: "AI engineer track · 24 weeks, free",
    h1: "Become ",
    accent: "an AI engineer",
    lede: "The maths, the models and the engineering, taught the way Stanford and MIT teach it: each week built around a real university lecture, with rigorous notes, worked problems and something you build from scratch. Assumes you can already program.",
    outcomes: [
      "Read the maths in a machine-learning paper and follow it",
      "Derive and implement gradient descent and backpropagation yourself",
      "Build and train a small GPT from scratch, including the tokenizer",
      "Fine-tune an open model and prove it improved with evals",
      "Build retrieval and agent systems whose accuracy you can measure",
      "Run AI in production with known cost, latency and failure rates",
    ],
    curriculum: "Each week is built around one university lecture. Lecture notes are being written week by week; every week's build and tasks are ready now.",
  });

export const TRACKS = [AGENTS, ENGINEER];

/** The track for the current URL. Used by pages and the nav. */
export function useTrack(): Track {
  const { pathname } = useLocation();
  return pathname === ENGINEER.base || pathname.startsWith(`${ENGINEER.base}/`) ? ENGINEER : AGENTS;
}

export const MONTH_COLORS = ["var(--brand)", "var(--coral)", "var(--sky)", "var(--lilac)", "#E0A100", "var(--mint)"];
export const hasVideo = (l: Lesson) => l.watch.length > 0;
export const ytId = (u: string) => u.match(/[?&]v=([\w-]{11})/)?.[1] ?? null;
