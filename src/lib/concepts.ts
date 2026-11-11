import type { Track } from "@/store/use-study-store";
import type { ConceptLesson } from "@/lib/concepts-core";
import { MATHS_CONCEPTS } from "@/lib/concepts-maths";
import { SCIENCE_CONCEPTS } from "@/lib/concepts-science";

export * from "@/lib/concepts-core";

export const CONCEPTS: ConceptLesson[] = [...MATHS_CONCEPTS, ...SCIENCE_CONCEPTS];
export const getConcept = (track: Track, chapterId: number) => CONCEPTS.find((c) => c.track === track && c.chapterId === chapterId);
export const conceptCount = (track: Track) => CONCEPTS.filter((c) => c.track === track).length;

const SUBJECT_WORD: Record<Track, string> = { science: "Science", ssc: "Social Science", maths: "Maths", english: "English", sanskrit: "Sanskrit" };

/** A YouTube search for this chapter's one-shot revision videos. A search link never goes stale the way a pinned
 *  video link does, and it surfaces the current CBSE Class 10 uploads. */
export const oneShotSearchUrl = (track: Track, chapterTitle: string) =>
  `https://www.youtube.com/results?search_query=${encodeURIComponent(`Class 10 ${SUBJECT_WORD[track]} ${chapterTitle} one shot`)}`;

const ALL_C10 = { label: "Magnet Brains — all CBSE Class 10 video courses", url: "https://www.magnetbrains.com/courses/cbse-class-10th-full-video-course/" };
/** Full-course video series (third-party; availability can change). */
export const VIDEO_SERIES: Record<Track, { label: string; url: string }[]> = {
  maths: [{ label: "Magnet Brains — Class 10 Maths, NCERT full video course", url: "https://www.magnetbrains.com/course/class-10th-maths-ncert-book-full-video-course/" }],
  science: [
    { label: "Magnet Brains — Class 10 Physics, NCERT full video course", url: "https://www.magnetbrains.com/course/class-10th-physics-science-book-ncert-full-video-course" },
    { label: "Magnet Brains — Class 10 Biology, NCERT full video course", url: "https://www.magnetbrains.com/course/class-10th-biology-science-book-ncert-full-video-course-vibhuti-mam" },
    ALL_C10,
  ],
  ssc: [ALL_C10],
  english: [ALL_C10],
  sanskrit: [ALL_C10],
};
