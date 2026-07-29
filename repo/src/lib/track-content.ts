// Track-aware content accessors — a single place that knows how to fetch
// "the current chapter" (and its MCQs / short & long answers) no matter
// which of the 5 subjects (Science, SSC, Maths, English, Sanskrit) is
// active. Each subject's data file defines its own chapter/MCQ/QA
// interfaces (Chapter/SscChapter/MATHSChapter/ENGChapter/SKTChapter, etc.)
// that are structurally close but not identical — e.g. ENGChapter.num is a
// number while every other track's is a string, English chapters carry no
// formulas, and chapter ids restart from 1 in every track (so "chapter 2"
// means something different in Science vs SSC vs Maths). Anything that
// needs "chapter N of track T" should go through here instead of reaching
// into a single track's array directly, so it automatically works for all
// 5 subjects instead of silently only working for whichever track was
// hardcoded in.

import { CHAPTERS, SSC_CHAPTERS, MCQS, SSC_MCQS, SHORT_QA, SSC_SHORT_QA, LONG_QA, SSC_LONG_QA, SCIENCE_DEEP_DIVE, SSC_DEEP_DIVE } from "./study-data";
import { MATHS_CHAPTERS, MATHS_MCQS, MATHS_SHORT_QA, MATHS_LONG_QA, MATHS_DEEP_DIVE } from "./maths-data";
import { ENG_CHAPTERS, ENG_MCQS, ENG_SHORT_QA, ENG_LONG_QA, ENG_DEEP_DIVE } from "./english-data";
import { SKT_CHAPTERS, SKT_MCQS, SKT_SHORT_QA, SKT_LONG_QA, SKT_DEEP_DIVE } from "./sanskrit-data";
import type { Track } from "@/store/use-study-store";

export interface TrackChapter {
  id: number;
  num: string;
  title: string;
  oneshot: string[];
  keypts: string[];
  formulas: string;
  exam: string[];
  // Longer, prose-style teaching content (2-4 paragraphs) that explains the
  // *why* and *how* behind the chapter's ideas — reasoning, connections
  // between facts, worked intuition, common misconceptions — as opposed to
  // oneshot/keypts, which stay deliberately terse for quick revision.
  deepDive: string[];
}

export interface TrackMCQ {
  id: number;
  ch: number;
  q: string;
  opts: string[];
  ans: number;
  exp: string;
}

export interface TrackQA {
  id: number;
  ch: number;
  marks: number;
  q: string;
  a: string;
}

// Reshapes any track's raw chapter record into the common TrackChapter
// shape. Only `num` actually needs coercing today (English stores it as a
// number) but every field is passed through explicitly so a future track
// with a differently-typed field fails to compile here instead of causing
// a subtle rendering bug three components away.
function normalizeChapter(
  c: {
    id: number; num: string | number; title: string;
    oneshot: string[]; keypts: string[]; formulas: string; exam: string[];
  },
  deepDiveMap: Record<number, string[]>
): TrackChapter {
  return {
    id: c.id,
    num: String(c.num),
    title: c.title,
    oneshot: c.oneshot,
    keypts: c.keypts,
    formulas: c.formulas,
    exam: c.exam,
    deepDive: deepDiveMap[c.id] ?? [],
  };
}

export function getTrackChapters(track: Track): TrackChapter[] {
  if (track === "science") return CHAPTERS.map((c) => normalizeChapter(c, SCIENCE_DEEP_DIVE));
  if (track === "ssc") return SSC_CHAPTERS.map((c) => normalizeChapter(c, SSC_DEEP_DIVE));
  if (track === "maths") return MATHS_CHAPTERS.map((c) => normalizeChapter(c, MATHS_DEEP_DIVE));
  if (track === "english") return ENG_CHAPTERS.map((c) => normalizeChapter(c, ENG_DEEP_DIVE));
  return SKT_CHAPTERS.map((c) => normalizeChapter(c, SKT_DEEP_DIVE));
}

export function getTrackChapter(track: Track, chapterId: number): TrackChapter | undefined {
  return getTrackChapters(track).find((c) => c.id === chapterId);
}

export function getTrackMcqs(track: Track, chapterId: number): TrackMCQ[] {
  if (track === "science") return MCQS.filter((m) => m.ch === chapterId);
  if (track === "ssc") return SSC_MCQS.filter((m) => m.ch === chapterId);
  if (track === "maths") return MATHS_MCQS.filter((m) => m.ch === chapterId);
  if (track === "english") return ENG_MCQS.filter((m) => m.ch === chapterId);
  return SKT_MCQS.filter((m) => m.ch === chapterId);
}

export function getTrackShortQa(track: Track, chapterId: number): TrackQA[] {
  if (track === "science") return SHORT_QA.filter((q) => q.ch === chapterId);
  if (track === "ssc") return SSC_SHORT_QA.filter((q) => q.ch === chapterId);
  if (track === "maths") return MATHS_SHORT_QA.filter((q) => q.ch === chapterId);
  if (track === "english") return ENG_SHORT_QA.filter((q) => q.ch === chapterId);
  return SKT_SHORT_QA.filter((q) => q.ch === chapterId);
}

export function getTrackLongQa(track: Track, chapterId: number): TrackQA[] {
  if (track === "science") return LONG_QA.filter((q) => q.ch === chapterId);
  if (track === "ssc") return SSC_LONG_QA.filter((q) => q.ch === chapterId);
  if (track === "maths") return MATHS_LONG_QA.filter((q) => q.ch === chapterId);
  if (track === "english") return ENG_LONG_QA.filter((q) => q.ch === chapterId);
  return SKT_LONG_QA.filter((q) => q.ch === chapterId);
}
