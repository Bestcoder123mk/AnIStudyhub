/**
 * CBSE Class X Sample Question Papers (SQP) + Marking Schemes, 2026-27.
 *
 * Source: https://cbseacademic.nic.in/SQP_CLASSX_2026-27.html — the five
 * papers this app covers. The papers themselves are CBSE's publications and
 * are linked, never copied: students open the official PDF on CBSE's site, so
 * they always see the current, authoritative version.
 *
 * What lives here is the *structure* of each paper (sections, marks, question
 * types), read directly off the published 2026-27 SQPs and described in our
 * own words. Every paper is 80 marks / 3 hours; the section marks below are
 * checked to sum to 80 (see the dev-time assertion at the bottom).
 */
import type { Track, ViewId } from "@/store/use-study-store";

export const SQP_PAGE_URL = "https://cbseacademic.nic.in/SQP_CLASSX_2026-27.html";
const BASE = "https://cbseacademic.nic.in/web_material/SQP/ClassX_2026_27";

/** testType prefix for logged attempts — lets us pick SQP attempts out of mockHistory. */
export const SQP_TEST_PREFIX = "CBSE SQP 2026-27";

export interface SqpSection {
  id: string;
  name: string;
  marks: number;
  /** Question numbers in the official paper, e.g. "Q1–20". */
  qs: string;
  /** What the section is made of — used for the blueprint and to seed AI practice. */
  detail: string;
}

export type PracticeKind = "mcq" | "short" | "long" | "mock";

export interface SqpPaper {
  track: Track;
  title: string;
  code: string;
  sqpUrl: string;
  msUrl: string;
  maxMarks: number;
  durationMin: number;
  questionCount: number;
  sections: SqpSection[];
  /** Things worth knowing before sitting the paper. */
  facts: string[];
  /** Where each kind of practice lives in the app for this subject (not every subject has all four). */
  practice: Partial<Record<PracticeKind, ViewId>>;
}

export const SQP_PAPERS: SqpPaper[] = [
  {
    track: "maths",
    title: "Mathematics (Standard)",
    code: "041",
    sqpUrl: `${BASE}/MathsStandard-SQP.pdf`,
    msUrl: `${BASE}/MathsStandard-MS.pdf`,
    maxMarks: 80,
    durationMin: 180,
    questionCount: 38,
    sections: [
      { id: "A", name: "MCQs & assertion–reason", marks: 20, qs: "Q1–20", detail: "18 MCQs plus 2 assertion–reason questions, 1 mark each" },
      { id: "B", name: "Very short answer", marks: 10, qs: "Q21–25", detail: "5 very-short-answer questions, 2 marks each (2 with internal choice)" },
      { id: "C", name: "Short answer", marks: 18, qs: "Q26–31", detail: "6 short-answer questions, 3 marks each (2 with internal choice)" },
      { id: "D", name: "Long answer", marks: 20, qs: "Q32–35", detail: "4 long-answer questions, 5 marks each (2 with internal choice)" },
      { id: "E", name: "Case studies", marks: 12, qs: "Q36–38", detail: "3 case-study questions, 4 marks each, split 1 + 1 + 2" },
    ],
    facts: [
      "38 questions, all compulsory — there is no overall choice.",
      "Internal choice: 2 questions each in Sections B, C and D, and every 2-mark sub-part in Section E.",
      "Calculators are not allowed; take π = 22/7 unless the question says otherwise.",
      "Draw neat, clean figures wherever the question needs one.",
    ],
    practice: { mcq: "maths-mcq", short: "maths-short", long: "maths-long", mock: "maths-mock" },
  },
  {
    track: "science",
    title: "Science",
    code: "086",
    sqpUrl: `${BASE}/Science-SQP.pdf`,
    msUrl: `${BASE}/Science-MS.pdf`,
    maxMarks: 80,
    durationMin: 180,
    questionCount: 39,
    sections: [
      { id: "A", name: "Biology", marks: 30, qs: "Q1–16", detail: "7 MCQs, 2 assertion–reason, 3 two-markers, 2 three-markers, 1 case-based (4) and 1 long answer (5)" },
      { id: "B", name: "Chemistry", marks: 25, qs: "Q17–29", detail: "7 MCQs and 1 assertion–reason, 1 two-marker, 2 three-markers, 1 case-based (4) and 1 long answer (5)" },
      { id: "C", name: "Physics", marks: 25, qs: "Q30–39", detail: "2 MCQs and 1 assertion–reason, 2 two-markers, 3 three-markers, 1 case-based (4) and 1 long answer (5)" },
    ],
    facts: [
      "39 questions, all compulsory; internal choice is given in some questions (attempt one alternative).",
      "This paper is grouped by discipline — Biology, then Chemistry, then Physics — rather than by question type.",
      "Across the paper: 20 × 1 mark (MCQ + assertion–reason), 6 × 2, 7 × 3, 3 case-based × 4 and 3 long answers × 5.",
      "Each discipline ends with a 4-mark case-based question and a 5-mark long answer.",
    ],
    practice: { mcq: "mcq", short: "short", long: "long", mock: "mock" },
  },
  {
    track: "sanskrit",
    title: "Sanskrit",
    code: "122",
    sqpUrl: `${BASE}/Sanskrit-SQP.pdf`,
    msUrl: `${BASE}/Sanskrit-MS.pdf`,
    maxMarks: 80,
    durationMin: 180,
    questionCount: 18,
    sections: [
      { id: "क", name: "Unseen comprehension", marks: 10, qs: "Q1", detail: "One unseen passage: 2 one-word answers, 2 full-sentence answers, a title, and 3 'as directed' items" },
      { id: "ख", name: "Composition", marks: 15, qs: "Q2–4", detail: "A letter (5), five sentences from a picture or on a topic (5), and five translations into Sanskrit (5)" },
      { id: "ग", name: "Applied grammar", marks: 25, qs: "Q5–11", detail: "Sandhi (4), samāsa (4), pratyaya (4), fill-in forms (3), time expressions (4), avyaya (3) and error correction (3)" },
      { id: "घ", name: "Prescribed text", marks: 30, qs: "Q12–18", detail: "A prose passage (5), a verse (5), a play extract (5), framing questions (4), anvaya (4), story sequencing (4) and contextual meaning (3)" },
    ],
    facts: [
      "18 questions in 4 sections; every answer is written in Sanskrit.",
      "Applied grammar and the prescribed-text section together carry 55 of the 80 marks.",
      "Write the question number exactly as printed, and keep each section's answers together.",
    ],
    practice: { mcq: "skt-mcq", short: "skt-short", long: "skt-long", mock: "skt-mock" },
  },
  {
    track: "english",
    title: "English (Language & Literature)",
    code: "184",
    sqpUrl: `${BASE}/EnglishL-SQP.pdf`,
    msUrl: `${BASE}/EnglishL-MS.pdf`,
    maxMarks: 80,
    durationMin: 180,
    questionCount: 11,
    sections: [
      { id: "A", name: "Reading skills", marks: 20, qs: "Q1–2", detail: "Two unseen passages, 10 marks each" },
      { id: "B", name: "Grammar & writing", marks: 20, qs: "Q3–5", detail: "Grammar: any 10 of 12 one-mark items; a formal letter (5) and an analytical paragraph (5), each with an A/B choice" },
      { id: "C", name: "Literature textbook", marks: 40, qs: "Q6–11", detail: "Two extract sets (5 each, pick A or B), 4 of 5 short answers (3 each), 2 of 3 short answers (3 each), and two 6-mark long answers (100–120 words, one of two each)" },
    ],
    facts: [
      "11 questions, all compulsory, in three sections.",
      "Literature is half the paper (40 marks): extracts, short answers and two long answers.",
      "Short literature answers run about 40–50 words; the 6-markers about 100–120 words.",
    ],
    practice: { mcq: "eng-mcq", short: "eng-short", long: "eng-long", mock: "eng-mock" },
  },
  {
    track: "ssc",
    title: "Social Science",
    code: "087",
    sqpUrl: `${BASE}/SocialScience-SQP.pdf`,
    msUrl: `${BASE}/SocialScience-MS.pdf`,
    maxMarks: 80,
    durationMin: 180,
    questionCount: 38,
    sections: [
      { id: "A", name: "History", marks: 20, qs: "Q1–9", detail: "4 MCQs, a 2-marker, a 3-marker, a 5-marker, 1 case-based (4) and 1 map question (2)" },
      { id: "B", name: "Geography", marks: 20, qs: "Q10–19", detail: "6 MCQs/assertion–reason, a 2-marker, a 5-marker, 1 case-based (4) and 1 map question (3)" },
      { id: "C", name: "Political Science", marks: 20, qs: "Q20–28", detail: "4 MCQs/assertion–reason, two 2-markers, a 3-marker, a 5-marker and 1 case-based (4)" },
      { id: "D", name: "Economics", marks: 20, qs: "Q29–38", detail: "6 MCQs/assertion–reason, three 3-markers and a 5-marker built on a data table" },
    ],
    facts: [
      "38 questions, all compulsory; internal choice is given in a few questions.",
      "Four equal sections of 20 marks: History, Geography, Political Science, Economics.",
      "Word limits: 2 marks ≈ 40 words, 3 marks ≈ 60, 5 marks ≈ 120, and case-based questions ≈ 100.",
      "Map skills are worth 5 marks in all — 2 in History (Q9) and 3 in Geography (Q19).",
    ],
    practice: { mcq: "ssc-mcq", short: "ssc-short", long: "ssc-long" },
  },
];

export function getSqpPaper(track: Track): SqpPaper | undefined {
  return SQP_PAPERS.find((p) => p.track === track);
}

/** Time to spend on a section if you keep 15 minutes back for revision — proportional to its marks. */
export function paceMinutes(paper: SqpPaper, section: SqpSection): number {
  const working = paper.durationMin - 15;
  return Math.round((section.marks / paper.maxMarks) * working);
}

export function testTypeFor(paper: SqpPaper): string {
  return `${SQP_TEST_PREFIX} · ${paper.title}`;
}

/** Prompt handed to the AI Tutor to generate ORIGINAL practice mirroring one section's pattern. */
export function practicePrompt(paper: SqpPaper, section: SqpSection): string {
  return (
    `Create an original practice set that mirrors Section ${section.id} (${section.name}) of the CBSE Class 10 ${paper.title} ` +
    `2026-27 sample paper. Pattern to follow: ${section.detail}. ` +
    `Use only the Class 10 CBSE syllabus and write new questions — don't reproduce any published paper. ` +
    `Number the questions, show the marks for each, and hold the answers back until I reply "answers".`
  );
}

/** Prompt for a post-attempt review with the AI Tutor. */
export function reviewPrompt(
  paper: SqpPaper,
  scored: number,
  rows: { section: SqpSection; scored: number }[]
): string {
  const lines = rows.map((r) => `Section ${r.section.id} (${r.section.name}): ${r.scored}/${r.section.marks}`).join("; ");
  return (
    `I just attempted the CBSE Class 10 ${paper.title} 2026-27 sample paper and scored ${scored}/${paper.maxMarks}. ` +
    `${lines}. Which sections should I fix first, and what's a realistic 7-day plan to improve them?`
  );
}

// Dev-time guard: a typo in a section's marks would silently skew every
// percentage and the pacing guide, so fail loudly instead.
if (process.env.NODE_ENV !== "production") {
  for (const p of SQP_PAPERS) {
    const sum = p.sections.reduce((n, s) => n + s.marks, 0);
    if (sum !== p.maxMarks) throw new Error(`SQP data error: ${p.title} sections sum to ${sum}, expected ${p.maxMarks}`);
  }
}
