export type Resource = {
  title: string;
  url: string;
  len?: string;
  /** who gave the lecture, e.g. "Stanford CS336 · Spring 2025". Marks a university lecture. */
  src?: string;
  /** false when the publisher has turned off embedding: shown as a link card instead of a player */
  embed?: boolean;
};

export type QuizQuestion = {
  q: string;
  /** answer options */
  o: string[];
  /** index of the correct option */
  a: number;
  /** explanation shown after a correct answer */
  why: string;
};

/** A problem-set question with a worked solution (both trusted HTML; maths in \( \) or \[ \]). */
export type Problem = { q: string; a: string };

export type Lesson = {
  /** "<week>-<n>", e.g. "1-2" (unique within a track) */
  id: string;
  title: string;
  mins: number;
  /** what the learner can do after this lecture */
  objectives?: string[];
  /** what to know first (trusted HTML) */
  prereqs?: string;
  /** lecture notes as trusted HTML; maths in \( \) or \[ \] */
  body: string;
  watch: Resource[];
  read: Resource[];
  /** exercise as trusted HTML */
  exercise: string;
  /** problem set with worked solutions */
  problems?: Problem[];
  quiz: QuizQuestion[];
};

/** [title, build description, tasks] */
export type Week = [string, string, string[]];

export type Month = {
  t: string;
  /** short label for tight spaces */
  k?: string;
  s: string;
  reads: string[];
  exam: string;
  weeks: Week[];
};

/** Extra lecture material layered onto an existing lesson by id. */
export type LessonUpgrade = Pick<Lesson, "objectives" | "prereqs" | "problems"> & {
  /** university lectures, shown before the lesson's own videos */
  lectures?: Resource[];
  /** extra notes appended to the lesson body (trusted HTML) */
  notes?: string;
};
