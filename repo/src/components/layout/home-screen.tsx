"use client";

import { useEffect, useState } from "react";
import { useStudyStore, SUBJECT_META, type Track } from "@/store/use-study-store";
import { levelProgress } from "@/lib/achievements";
import { daysUntil, useMounted } from "@/components/shared/helpers";
import { ArrowRight, Clock } from "lucide-react";
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
      <div className="glass rounded-2xl p-4 flex items-center gap-3">
        <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Clock className="size-4 text-primary" />
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
      className="group glass rounded-2xl p-4 flex items-center gap-3 hover:scale-[1.02] active:scale-[0.99] transition-all text-left"
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

  const mounted = useMounted();
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(t);
  }, []);

  const examDays = mounted ? daysUntil(examDate) : null;
  const totalAll = totalXp + sscXp + SUBJECTS.filter(s => s !== "science" && s !== "ssc").reduce((sum, s) => sum + (subjectStats[s]?.totalXp || 0), 0);
  const { level } = levelProgress(totalAll);

  const pick = (t: Track) => { setTrack(t); onEnter(); };
  const timeStr = now?.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }) ?? "";

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col">
      {/* Subtle ambient background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80rem] h-[40rem] rounded-full bg-primary/8 blur-[120px]" />
      </div>

      <div className="relative flex-1 flex flex-col max-w-6xl w-full mx-auto px-6 sm:px-8">
        {/* Header — minimal */}
        <header className="flex items-center justify-between pt-8 pb-2">
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-lg bg-gradient-to-br from-primary to-fuchsia-500 flex items-center justify-center text-sm font-bold text-white shadow-lg">
              S
            </div>
            <span className="font-display font-bold text-sm tracking-tight">StudyHub</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            {examDays != null && (
              <span className={examDays <= 30 ? "text-rose-400 font-medium" : ""}>
                {examDays <= 0 ? "Exam day" : `${examDays} days to exam`}
              </span>
            )}
            <span className="font-medium">Lv {level}</span>
            <span className="hidden sm:inline tabular-nums">{timeStr}</span>
          </div>
        </header>

        {/* Hero — centered, generous whitespace */}
        <div className="flex-1 flex flex-col justify-center max-w-2xl mx-auto w-full text-center py-8">
          <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight leading-[1.1] mb-3">
            Your board exam,
            <br />
            <span className="bg-gradient-to-r from-primary via-fuchsia-400 to-amber-300 bg-clip-text text-transparent">
              mastered.
            </span>
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base mb-8 leading-relaxed">
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
                  className="group relative rounded-2xl border border-border bg-card/50 hover:bg-card transition-all hover:scale-[1.02] active:scale-[0.99] p-5 text-left overflow-hidden"
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

            {/* Museum — special card */}
            <button
              onClick={() => { setView("museum"); onEnter(); }}
              className="group relative rounded-2xl border border-fuchsia-400/20 bg-gradient-to-br from-fuchsia-500/10 to-amber-500/5 hover:from-fuchsia-500/15 hover:to-amber-500/10 transition-all hover:scale-[1.02] active:scale-[0.99] p-5 text-left overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl bg-gradient-to-r from-fuchsia-500 to-amber-400 opacity-60 group-hover:opacity-100" />
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">🏛️</span>
                <span className="font-display font-bold text-base">3D Museum</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed mb-3">Walk through an immersive marble library</p>
              <div className="flex items-center gap-1 text-xs font-medium text-fuchsia-400">
                Explore <ArrowRight className="size-3 group-hover:translate-x-0.5 transition" />
              </div>
            </button>
          </div>
        </div>

        {/* Footer — single line */}
        <footer className="py-6 text-center text-[11px] text-muted-foreground/60">
          NCERT Class 10 · 2026-27 syllabus · Progress saved on this device
        </footer>
      </div>
    </div>
  );
}
