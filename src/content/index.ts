import { useLocation } from "react-router-dom";
import { LINKS, MONTHS } from "./course";
import { week1, week2, week3, week4 } from "./month1";
import { week5, week6, week7, week8 } from "./month2";
import { week9 } from "./week9";
import { week10 } from "./month3";
import { lesson10_6 } from "./lesson10-6";
import { week22 } from "./week22";
import { l1_5, l1_6, l2_5, l3_5, l7_5, l9_6, l10_7 } from "./upgrade-w1-10";
import { UPGRADES } from "./lectures";
import { CORE_VIDEOS } from "./videos";
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
  /** what one item is called: "lesson" or "lecture" */
  unit: string;
  /** hero chips: [top, bottom-without-backup] */
  chips: [string, string];
  feats: { c: string; i: string; t: string; d: string }[];
};

/**
 * Merge an upgrade into a lesson. On a beginner track (`split`), university lectures (any video with `src`),
 * theory notes and the problem set move into the optional `deep` section; the core lesson stays short.
 */
function upgrade(l: Lesson, u: LessonUpgrade | undefined, split: boolean): Lesson {
  const watch = [...(u?.lectures ?? []), ...l.watch, ...(split ? CORE_VIDEOS[l.id] ?? [] : [])];
  const base: Lesson = {
    ...l,
    objectives: u?.objectives ?? l.objectives,
    prereqs: u?.prereqs ?? l.prereqs,
    problems: u?.problems ?? l.problems,
    body: u?.notes ? l.body + u.notes : l.body,
    watch,
  };
  if (!split) return base;
  const deep = { watch: watch.filter((v) => v.src), notes: u?.deepNotes, problems: base.problems };
  const has = deep.watch.length > 0 || !!deep.notes || !!deep.problems?.length;
  return { ...base, watch: watch.filter((v) => !v.src), problems: undefined, deep: has ? deep : undefined };
}

/** One course. `prefix` keeps each track's progress keys apart; the agents track uses "" so saved progress keeps working. */
function makeTrack(id: string, base: string, prefix: string, name: string, months: Month[],
  links: Record<string, [string, string]>, raw: Record<number, Lesson[]>, copy: TrackCopy) {
  const lessons: Record<number, Lesson[]> = Object.fromEntries(
    Object.entries(raw).map(([w, ls]) => [w, ls.map((l) => upgrade(l, prefix ? undefined : UPGRADES[l.id], !prefix))]),
  );
  const all: LessonRef[] = Object.keys(lessons).map(Number).sort((a, b) => a - b)
    .flatMap((w) => lessons[w].map((l, i) => ({ w, i, l })));
  const weeks = Array.from({ length: months.length * 4 }, (_, i) => i + 1);
  const monthOf = (wn: number) => Math.ceil(wn / 4);
  const weekOf = (wn: number): Week => months[monthOf(wn) - 1].weeks[(wn - 1) % 4];
  const lessonsFor = (wn: number) => lessons[wn] ?? [];
  const lessonKey = (lid: string) => `L${prefix}${lid}`;
  const taskId = (wn: number, ti: number) => `t${prefix}${wn}_${ti}`;
  /** set when the learner finishes a lesson's optional Go deep section; never counted towards progress */
  const deepKey = (lid: string) => `D${prefix}${lid}`;
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
    monthOf, weekOf, lessonsFor, lessonKey, taskId, deepKey, weekStats, monthStats, overall,
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
  {
    // New lessons go at the END of their week: lessons cite each other by number ("lesson 1.4"),
    // and the number comes from the position, so inserting mid-week would break those references.
    1: [...week1, l1_5, l1_6],
    2: [...week2, l2_5],
    3: [...week3, l3_5],
    4: week4, 5: week5, 6: week6,
    7: [...week7, l7_5],
    8: week8,
    9: [...week9, l9_6],
    10: [...week10, lesson10_6, l10_7],
    22: week22,
  },
  {
    label: "Agent user track",
    pill: "Self-paced, 24 weeks, free",
    h1: "Become one of ",
    accent: "the best users of AI",
    lede: "A hands-on course for people who want to hand real work to AI agents and trust what comes back. Short lessons, real projects, and a practical exam at the end of every month. When you want more, each lesson has an optional deep dive.",
    unit: "lesson",
    chips: ["A quiz in every lesson", "Build something every week"],
    feats: [
      { c: "var(--brand)", i: "hammer", t: "Build more than you read", d: "No tutorial longer than 20 minutes without building something straight after." },
      { c: "var(--coral)", i: "ship", t: "Exams you ship", d: "Every month ends with a practical exam. You pass by shipping, not by answering questions." },
      { c: "var(--lilac)", i: "log", t: "A failure log", d: "Record every time an agent gets something wrong, and why. It becomes your most useful asset." },
      { c: "var(--sky)", i: "play", t: "Go deep when you want", d: "Optional deep dives after a lesson: university lectures, the theory, and problems with worked solutions." },
    ],
    outcomes: [
      "Ship real software with 3–5 agents working in parallel, and trust the output",
      "Pick the right model for a task from your own evals, not hype",
      "Run open models on your own hardware and know when it's worth it",
      "Design memory and retrieval for an AI system",
      "Build your own agent harness and MCP servers",
      "Run agents in production that work without you watching",
    ],
    curriculum: "Lessons are live for weeks 1–10 and week 22 (LLMOps); the rest are on the way. Every week's build and tasks are ready now.",
  });

export const ENGINEER = makeTrack("engineer", "/engineer", "e", "AI engineer", E_MONTHS, E_LINKS, E_LESSONS,
  {
    label: "AI engineer track",
    pill: "AI engineer track · 24 weeks, free",
    h1: "Become ",
    accent: "an AI engineer",
    lede: "The maths, the models and the engineering, taught the way Stanford and MIT teach it: each week built around a real university lecture, with rigorous notes, worked problems and something you build from scratch. Assumes you can already program.",
    unit: "lecture",
    chips: ["Stanford, MIT and Berkeley lectures", "Problem sets with worked solutions"],
    feats: [
      { c: "var(--brand)", i: "play", t: "University lectures", d: "Each week is anchored in a real lecture from Stanford, MIT, Harvard or Berkeley, chosen and checked for this course." },
      { c: "var(--sky)", i: "doc", t: "Lecture notes", d: "Rigorous notes with learning objectives, worked examples and the maths written out, so you can study without the video." },
      { c: "var(--coral)", i: "pen", t: "Problem sets", d: "Problems at the end of every lecture, each with a worked solution to check yourself against." },
      { c: "var(--lilac)", i: "ship", t: "Exams you ship", d: "Every month ends with a practical exam. You pass by building something, not by answering questions." },
    ],
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
