import type { Lesson } from "../types";
import { week1 } from "./week1";
import { week2 } from "./week2";
import { week3 } from "./week3";
import { week4 } from "./week4";
import { week21 } from "./week21";

/** AI engineer track: lessons by week number. Weeks without an entry show the lecture, build and tasks only. */
export const E_LESSONS: Record<number, Lesson[]> = {
  1: week1,
  2: week2,
  3: week3,
  4: week4,
  21: week21,
};
