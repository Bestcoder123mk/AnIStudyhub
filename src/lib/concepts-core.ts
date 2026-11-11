import type { Track } from "@/store/use-study-store";

/** A teacher-style concept lesson for one chapter: a short sequence of cards, each doing one job. */
export type ConceptStep =
  | { k: "idea"; h: string; p: string } //                    the core idea, in plain words
  | { k: "analogy"; h: string; p: string } //                 an everyday picture of it
  | { k: "formula"; h: string; items: string[] } //           the results worth memorising
  | { k: "example"; h: string; p: string; steps: string[] } // a worked problem, revealed one step at a time
  | { k: "trap"; h: string; p: string } //                    the mistake examiners rely on
  | { k: "check"; q: string; opts: string[]; a: number; why: string }; // a quick check for understanding

export interface ConceptLesson {
  track: Track;
  chapterId: number;
  minutes: number;
  hook: string; // one line on why this chapter matters / what you'll be able to do
  steps: ConceptStep[];
  recap: string[];
}

// Tiny constructors keep the lesson files readable.
export const idea = (h: string, p: string): ConceptStep => ({ k: "idea", h, p });
export const analogy = (h: string, p: string): ConceptStep => ({ k: "analogy", h, p });
export const formula = (h: string, items: string[]): ConceptStep => ({ k: "formula", h, items });
export const example = (h: string, p: string, steps: string[]): ConceptStep => ({ k: "example", h, p, steps });
export const trap = (h: string, p: string): ConceptStep => ({ k: "trap", h, p });
export const check = (q: string, opts: string[], a: number, why: string): ConceptStep => ({ k: "check", q, opts, a, why });
export const lesson = (track: Track, chapterId: number, minutes: number, hook: string, steps: ConceptStep[], recap: string[]): ConceptLesson => ({ track, chapterId, minutes, hook, steps, recap });

