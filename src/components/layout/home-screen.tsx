"use client";

import { useStudyStore, SUBJECT_META, type Track } from "@/store/use-study-store";
import { levelProgress } from "@/lib/achievements";
import { findTitle } from "@/lib/shop-data";
import { daysUntil, useMounted } from "@/components/shared/helpers";
import { ArrowRight, Clock, Coins } from "lucide-react";
import { QuestsWidget } from "@/components/shared/quests-widget";

const SUBJECTS: Track[] = ["science", "ssc", "maths", "english", "sanskrit"];

const SUBJECT_DESC: Record<Track, string> = {
  science: "Physics · Chemistry · Biology",
  ssc: "History · Geography · Civics · Economics",
  maths: "Algebra · Geometry · Trigonometry",
  english: "First Flight · Footprints Without Feet",
  sanskrit: "Shemushi · Vyakaran · Translator",
};

const VIEW_LABELS: Record<string, string> = {
  dash: "Dashboard", chapters: "Chapters", mcq: "MCQ Quiz", short: "Short Q&A",
  long: "Long Q&A", flash: "Flashcards", formulas: "Formulas", mock: "Mock Test",
  "ssc-dash": "SSC Dashboard", "ssc-chapters": "SSC Chapters", "ssc-mcq": "SSC MCQ",
  "maths-dash": "Maths Dashboard", "maths-mcq": "Maths MCQ", "maths-formulas": "Maths Formulas",
  "eng-chapters": "English Chapters", "skt-translator": "Sanskrit Translator", museum: "3D Museum",
  tutor: "AI Tutor", analytics: "Analytics", galaxy: "Knowledge Galaxy",
};

function ContinueWidget() {
  const lastView = useStudyStore((s) => s.lastView);
  const setView = useStudyStore((s) => s.setView);
  const setTrack = useStudyStore((s) => s.setTrack);

  if (!lastView) {
    return (
      <div className="glass rounded-2xl p-4 flex items-center gap-3 border border-border/60">
        <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Clock className="size-4 text-foreground" />
        </div>
        <div>
          <div className="text-xs font-semibold">Welcome!</div>
          <div className="text-[10px] text-muted-foreground">Pick a subject below to begin</div>
        </div>
      </div>
    );
  }

  const meta = SUBJECT_META[lastView.track];
  const label = VIEW_LABELS[lastView.view] || lastView.view;

  return (
    <button
      onClick={() => { setTrack(lastView.track); setView(lastView.view); }}
      className="tap-lift group glass rounded-2xl p-4 flex items-center gap-3 transition-all text-left border border-border/60"
    >
      <div className="size-10 rounded-xl flex items-center justify-center text-lg shrink-0" style={{ background: `${meta.accent}1a`, border: `1px solid ${meta.accent}40` }}>
        {meta.icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Continue</div>
        <div className="text-sm font-semibold truncate">{label}</div>
        <div className="text-[10px] text-muted-foreground truncate">{meta.label}</div>
      </div>
      <ArrowRight className="size-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition shrink-0" />
    </button>
  );
}

export function HomeScreen({ onEnter }: { onEnter: () => void }) {
  const setTrack = useStudyStore((s) => s.setTrack);
  const setView = useStudyStore((s) => s.setView);
  const examDate = useStudyStore((s) => s.examDate);
  const totalXp = useStudyStore((s) => s.totalXp);
  const sscXp = useStudyStore((s) => s.ssc.totalXp);
  const subjectStats = useStudyStore((s) => s.subjectStats);
  const coins = useStudyStore((s) => s.coins);
  const equippedTitle = useStudyStore((s) => s.equippedTitle);

  const mounted = useMounted();

  const examDays = mounted ? daysUntil(examDate) : null;
  const totalAll = totalXp + sscXp + SUBJECTS.filter(s => s !== "science" && s !== "ssc").reduce((sum, s) => sum + (subjectStats[s]?.totalXp || 0), 0);
  const { level } = levelProgress(totalAll);
  const title = findTitle(equippedTitle);

  const pick = (t: Track) => { setTrack(t); onEnter(); };

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col">
      {/* Subtle ambient background — pure grayscale glow, no colour wash */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80rem] h-[40rem] rounded-full bg-foreground/[0.06] blur-[120px]" />
      </div>

      <div className="relative flex-1 flex flex-col max-w-6xl w-full mx-auto px-5 sm:px-8 pt-safe">
        {/* Header — minimal */}
        <header className="flex items-center justify-between pt-6 sm:pt-8 pb-2">
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-xl bg-primary flex items-center justify-center text-sm font-bold text-primary-foreground shadow-lg">
              S
            </div>
            <span className="font-display font-bold text-sm tracking-tight">StudyHub</span>
          </div>
          <div className="flex items-center gap-3 sm:gap-4 text-xs text-muted-foreground">
            {examDays != null && examDate && (
              <span className={`hidden sm:inline ${examDays <= 30 ? "text-rose-500 dark:text-rose-400 font-medium" : ""}`}>
                {examDays <= 0 ? "Exam day" : `${examDays}d to exam`}
              </span>
            )}
            <button onClick={() => setView("shop")} className="flex items-center gap-1 font-semibold tabular-nums text-amber-600 dark:text-amber-300 hover:opacity-80 transition">
              <Coins className="size-3.5" /> {coins}
            </button>
            <span className="font-medium text-foreground">Lv {level}{title ? ` · ${title.label}` : ""}</span>
          </div>
        </header>

        {/* Hero — centered, generous whitespace */}
        <div className="flex-1 flex flex-col justify-center max-w-2xl mx-auto w-full text-center py-6 sm:py-8">
          <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight leading-[1.1] mb-3 text-foreground">
            Your board exam,
            <br />
            <span className="relative inline-block">
              <span className="relative z-10">mastered.</span>
              <span className="absolute inset-x-0 bottom-1.5 h-3 sm:h-4 bg-primary/10 rounded-sm -z-0" aria-hidden />
            </span>
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base mb-8 leading-relaxed text-balance">
            Five subjects. One companion. Notes, PYQs, mock tests, an AI tutor, and a 3D museum.
          </p>

          {/* Continue + Quests row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            <ContinueWidget />
            <QuestsWidget />
          </div>

          {/* Subject grid — large, clean, consistent */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {SUBJECTS.map((s) => {
              const meta = SUBJECT_META[s];
              return (
                <button
                  key={s}
                  onClick={() => pick(s)}
                  className="tap-lift group relative rounded-2xl border border-border bg-card/60 hover:bg-card transition-all active:scale-[0.99] p-5 text-left overflow-hidden"
                >
                  <div
                    className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl transition-opacity opacity-60 group-hover:opacity-100"
                    style={{ background: meta.accent }}
                  />
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{meta.icon}</span>
                    <span className="font-display font-bold text-base">{meta.label}</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-3">{SUBJECT_DESC[s]}</p>
                  <div className="flex items-center gap-1 text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                    Continue <ArrowRight className="size-3 group-hover:translate-x-0.5 transition" />
                  </div>
                </button>
              );
            })}

            {/* Museum — special card, distinguished by motion/glow rather than colour */}
            <button
              onClick={() => { setView("museum"); onEnter(); }}
              className="tap-lift group relative rounded-2xl border border-border bg-card/60 hover:bg-card transition-all active:scale-[0.99] p-5 text-left overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl bg-primary opacity-60 group-hover:opacity-100" />
              <div className="absolute -top-6 -right-6 size-20 rounded-full bg-foreground/[0.06] blur-2xl" />
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">🏛️</span>
                <span className="font-display font-bold text-base">3D Museum</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed mb-3">Walk through an immersive marble library</p>
              <div className="flex items-center gap-1 text-xs font-medium text-foreground">
                Explore <ArrowRight className="size-3 group-hover:translate-x-0.5 transition" />
              </div>
            </button>
          </div>
        </div>

        {/* Footer — single line */}
        <footer className="py-6 text-center text-[11px] text-muted-foreground/60 pb-safe">
          NCERT Class 10 · 2026-27 syllabus · Progress saved on this device
        </footer>
      </div>
    </div>
  );
}
