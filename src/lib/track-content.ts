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

import { CHAPTERS, SSC_CHAPTERS, MCQS, SSC_MCQS, SHORT_QA, SSC_SHORT_QA, LONG_QA, SSC_LONG_QA, SCIENCE_DEEP_DIVE, SSC_DEEP_DIVE, ALL_MCQS, ALL_SSC_MCQS } from "./study-data";
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
  /** false only for a chapter CBSE has removed from the current (2026-27)
   *  board-exam syllabus (see Chapter.onSyllabus in study-data.ts) — true
   *  for everything else, including every track that has no such chapters
   *  at all. Filtered out by default from getTrackChapters/getAllTrackMcqs;
   *  pass { includeOffSyllabus: true } wherever a person is meant to still
   *  see/practice it as bonus reading (the museum, the chapter picker). */
  onSyllabus: boolean;
}

export type TrackDiff = "easy" | "medium" | "hard";

export interface TrackMCQ {
  id: number;
  ch: number;
  /** Sub-subject key — chem/bio/phy for Science, hist/geo/polsci/eco for SSC,
   *  or just the track name itself (maths/english/sanskrit) where a track
   *  has no further sub-subject split. */
  subj: string;
  diff: TrackDiff;
  q: string;
  opts: string[];
  ans: number;
  exp: string;
  /** Board-exam-pattern question, written in the style of CBSE 2020–2026 papers. */
  pyq?: boolean;
}

export interface TrackQA {
  id: number;
  ch: number;
  marks: number;
  q: string;
  a: string;
  /** Board-exam-pattern question, written in the style of CBSE 2020–2026 papers. */
  pyq?: boolean;
}

/** Passed to the whole-track accessors below. Every one of them defaults to
 *  EXCLUDING chapters CBSE has dropped from the current syllabus — the
 *  right default for anything board-exam-facing (mock tests, Battle,
 *  Dungeons, XP/mastery). Pass `{ includeOffSyllabus: true }` at the few
 *  call sites where a person is meant to still browse/practice that content
 *  as clearly-labelled bonus reading (the museum, the chapter picker) —
 *  never delete the underlying content, just don't let it leak into
 *  anything that's meant to mirror the real exam. */
export interface TrackQueryOpts {
  includeOffSyllabus?: boolean;
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
    onSyllabus?: boolean;
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
    onSyllabus: c.onSyllabus ?? true,
  };
}

export function getTrackChapters(track: Track, opts: TrackQueryOpts = {}): TrackChapter[] {
  const all: TrackChapter[] =
    track === "science" ? CHAPTERS.map((c) => normalizeChapter(c, SCIENCE_DEEP_DIVE)) :
    track === "ssc" ? SSC_CHAPTERS.map((c) => normalizeChapter(c, SSC_DEEP_DIVE)) :
    track === "maths" ? MATHS_CHAPTERS.map((c) => normalizeChapter(c, MATHS_DEEP_DIVE)) :
    track === "english" ? ENG_CHAPTERS.map((c) => normalizeChapter(c, ENG_DEEP_DIVE)) :
    SKT_CHAPTERS.map((c) => normalizeChapter(c, SKT_DEEP_DIVE));
  return opts.includeOffSyllabus ? all : all.filter((c) => c.onSyllabus);
}

// Always resolves by id against the FULL chapter list (including off-
// syllabus ones) — this fetches one specific, already-known chapter rather
// than building a pool, so there's nothing for the syllabus filter to
// protect against here; the calling view is what decides whether to show
// an off-syllabus badge next to it.
/** The label a person should see for a chapter — the textbook number the
 *  chapter list shows ("Ch 8"), NOT the internal id. They diverge only where
 *  a chapter was slotted into textbook order after the fact (Maths: id 14,
 *  Introduction to Trigonometry, is "Ch 8" and shifts Applications to "Ch 9"),
 *  which is exactly why per-question badges must not print the raw id. */
export function chapterLabel(track: Track, chapterId: number): string {
  const num = getTrackChapter(track, chapterId)?.num;
  if (!num) return `Ch ${chapterId}`;
  return /^\d+$/.test(num) ? `Ch ${num}` : num;
}

export function getTrackChapter(track: Track, chapterId: number): TrackChapter | undefined {
  return getTrackChapters(track, { includeOffSyllabus: true }).find((c) => c.id === chapterId);
}

export function getTrackMcqs(track: Track, chapterId: number): TrackMCQ[] {
  if (track === "science") return MCQS.filter((m) => m.ch === chapterId);
  if (track === "ssc") return SSC_MCQS.filter((m) => m.ch === chapterId);
  if (track === "maths") return MATHS_MCQS.filter((m) => m.ch === chapterId);
  if (track === "english") return ENG_MCQS.filter((m) => m.ch === chapterId);
  return SKT_MCQS.filter((m) => m.ch === chapterId);
}

// Unfiltered — every MCQ in a track, regardless of chapter. Used by modes
// that draw from the whole pool (Battle, Dungeons) instead of one chapter
// at a time. Previously each of those two views hand-rolled an identical
// (and, per-file, independently-maintained) switch statement to get this;
// this is the one place that logic lives now.
//
// Defaults to excluding questions from chapters CBSE has dropped from the
// current syllabus (see TrackQueryOpts) — the pools these feed (Battle,
// Dungeons, mastery/XP) are exam-facing practice, so a board-relevant
// default matters more here than almost anywhere else in the app.
export function getAllTrackMcqs(track: Track, opts: TrackQueryOpts = {}): TrackMCQ[] {
  // Science/SSC start from the unfiltered ALL_* arrays (their default
  // MCQS/SSC_MCQS exports are already syllabus-only) so that
  // includeOffSyllabus:true genuinely returns everything; the chapter-flag
  // filter below then does the excluding for the default case, and keeps
  // working unchanged if maths/english/sanskrit ever gain a flagged chapter.
  const all: TrackMCQ[] =
    track === "science" ? ALL_MCQS :
    track === "ssc" ? ALL_SSC_MCQS :
    track === "maths" ? MATHS_MCQS :
    track === "english" ? ENG_MCQS :
    SKT_MCQS;
  if (opts.includeOffSyllabus) return all;
  const offIds = new Set(
    getTrackChapters(track, { includeOffSyllabus: true })
      .filter((c) => !c.onSyllabus)
      .map((c) => c.id)
  );
  return offIds.size === 0 ? all : all.filter((m) => !offIds.has(m.ch));
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
