import type { Lesson } from "../types";
import { week1 } from "./week1";

/** AI engineer track: lessons by week number. Weeks without an entry show the lecture, build and tasks only. */
export const E_LESSONS: Record<number, Lesson[]> = {
  1: week1,
};
