export type Resource = { title: string; url: string; len?: string };

export type QuizQuestion = {
  q: string;
  /** answer options */
  o: string[];
  /** index of the correct option */
  a: number;
  /** explanation shown after a correct answer */
  why: string;
};

export type Lesson = {
  /** "<week>-<n>", e.g. "1-2" */
  id: string;
  title: string;
  mins: number;
  /** lesson body as trusted HTML */
  body: string;
  watch: Resource[];
  read: Resource[];
  /** exercise as trusted HTML */
  exercise: string;
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
