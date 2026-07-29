"use client";

import { useState, useMemo } from "react";
import { useStudyStore, SUBJECT_META, type Track } from "@/store/use-study-store";
import { useMounted } from "@/components/shared/helpers";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Briefcase, Stethoscope, Wrench, Scale, GraduationCap, BarChart3,
  Building2, PencilRuler, Newspaper, Rocket, FlaskConical, Calculator,
  Palette, Sparkles, Trophy, ArrowRight, CheckCircle2, RotateCcw, Target,
} from "lucide-react";

/* ---------- career data ---------- */
interface Career {
  id: string;
  name: string;
  icon: React.ReactNode;
  desc: string;
  subjects: Track[];
  salary: string;
  skills: string[];
  matchSubjects: Track[];
}

const CAREERS: Career[] = [
  {
    id: "doctor", name: "Doctor", icon: <Stethoscope className="size-5" />,
    desc: "Diagnose and treat patients across specialties from cardiology to paediatrics.",
    subjects: ["science"], salary: "₹8–20 LPA", skills: ["Biology", "Chemistry", "Empathy", "Stamina"],
    matchSubjects: ["science"],
  },
  {
    id: "engineer", name: "Engineer", icon: <Wrench className="size-5" />,
    desc: "Design, build, and maintain everything from bridges to microchips.",
    subjects: ["science", "maths"], salary: "₹6–18 LPA", skills: ["Physics", "Maths", "Problem solving", "Design"],
    matchSubjects: ["science", "maths"],
  },
  {
    id: "lawyer", name: "Lawyer", icon: <Scale className="size-5" />,
    desc: "Advise clients, argue cases in court, and shape policy through legal expertise.",
    subjects: ["ssc", "english"], salary: "₹6–15 LPA", skills: ["Civics", "Reading", "Argument", "Research"],
    matchSubjects: ["ssc", "english"],
  },
  {
    id: "teacher", name: "Teacher", icon: <GraduationCap className="size-5" />,
    desc: "Shape young minds in schools, colleges, or as a private tutor.",
    subjects: ["science", "ssc", "maths", "english", "sanskrit"], salary: "₹3–9 LPA", skills: ["Communication", "Patience", "Subject mastery"],
    matchSubjects: ["science", "ssc", "maths", "english", "sanskrit"],
  },
  {
    id: "data-scientist", name: "Data Scientist", icon: <BarChart3 className="size-5" />,
    desc: "Mine insights from large datasets to drive business and research decisions.",
    subjects: ["maths", "science"], salary: "₹8–22 LPA", skills: ["Statistics", "Programming", "Logic", "Curiosity"],
    matchSubjects: ["maths", "science"],
  },
  {
    id: "civil-services", name: "Civil Services", icon: <Building2 className="size-5" />,
    desc: "Serve the nation as an IAS, IPS, or IFS officer shaping public policy.",
    subjects: ["ssc", "english"], salary: "₹7–14 LPA", skills: ["History", "Polity", "Current affairs", "Writing"],
    matchSubjects: ["ssc", "english"],
  },
  {
    id: "architect", name: "Architect", icon: <PencilRuler className="size-5" />,
    desc: "Plan buildings and spaces that balance function, beauty, and safety.",
    subjects: ["maths", "science"], salary: "₹5–12 LPA", skills: ["Geometry", "Drawing", "Spatial sense", "Creativity"],
    matchSubjects: ["maths", "science"],
  },
  {
    id: "journalist", name: "Journalist", icon: <Newspaper className="size-5" />,
    desc: "Investigate, write, and report stories that inform the public.",
    subjects: ["english", "ssc"], salary: "₹4–10 LPA", skills: ["Writing", "Curiosity", "Skepticism", "Interviewing"],
    matchSubjects: ["english", "ssc"],
  },
  {
    id: "entrepreneur", name: "Entrepreneur", icon: <Rocket className="size-5" />,
    desc: "Start and grow your own venture — turn ideas into products and services.",
    subjects: ["maths", "ssc", "english"], salary: "Variable", skills: ["Risk taking", "Leadership", "Finance", "Persistence"],
    matchSubjects: ["maths", "ssc", "english"],
  },
  {
    id: "research-scientist", name: "Research Scientist", icon: <FlaskConical className="size-5" />,
    desc: "Push the boundaries of knowledge in labs, universities, or industry R&D.",
    subjects: ["science", "maths"], salary: "₹7–18 LPA", skills: ["Experimentation", "Analysis", "Patience", "Writing"],
    matchSubjects: ["science", "maths"],
  },
  {
    id: "chartered-accountant", name: "Chartered Accountant", icon: <Calculator className="size-5" />,
    desc: "Audit, tax, and advise on financial matters for individuals and companies.",
    subjects: ["maths"], salary: "₹7–18 LPA", skills: ["Accounting", "Numbers", "Discipline", "Integrity"],
    matchSubjects: ["maths"],
  },
  {
    id: "designer", name: "Designer", icon: <Palette className="size-5" />,
    desc: "Craft visual experiences in graphic, UX, product, or fashion design.",
    subjects: ["english", "ssc"], salary: "₹4–12 LPA", skills: ["Creativity", "Typography", "Empathy", "Tools"],
    matchSubjects: ["english"],
  },
];

/* ---------- career quiz ---------- */
interface QuizOption { label: string; weights: Partial<Record<Track, number>>; }
interface QuizQuestion { q: string; options: QuizOption[]; }
const QUIZ: QuizQuestion[] = [
  {
    q: "What kind of homework do you secretly enjoy most?",
    options: [
      { label: "Solving algebra or geometry puzzles", weights: { maths: 2, science: 1 } },
      { label: "Reading stories, poems, or essays", weights: { english: 2, ssc: 1 } },
      { label: "Drawing diagrams of cells or circuits", weights: { science: 2, maths: 1 } },
      { label: "Reading about kings, wars, or geography", weights: { ssc: 2, english: 1 } },
    ],
  },
  {
    q: "Pick a free-time activity you'd love:",
    options: [
      { label: "Coding a small game or app", weights: { maths: 2, science: 1 } },
      { label: "Writing a blog or short story", weights: { english: 2 } },
      { label: "Doing science experiments at home", weights: { science: 2 } },
      { label: "Debating news and politics", weights: { ssc: 2, english: 1 } },
    ],
  },
  {
    q: "Which problem would you most like to solve?",
    options: [
      { label: "Designing a cheaper solar panel", weights: { science: 2, maths: 1 } },
      { label: "Building a budget for a city", weights: { maths: 2, ssc: 1 } },
      { label: "Drafting a public-awareness campaign", weights: { english: 2, ssc: 1 } },
      { label: "Mapping local history and culture", weights: { ssc: 2 } },
    ],
  },
  {
    q: "When you grow up, you want to be remembered for…",
    options: [
      { label: "Discovering something new about nature", weights: { science: 2 } },
      { label: "Solving a famous unsolved problem", weights: { maths: 2 } },
      { label: "Writing a book everyone reads", weights: { english: 2 } },
      { label: "Improving how society is run", weights: { ssc: 2 } },
    ],
  },
  {
    q: "Your strongest subject this year is…",
    options: [
      { label: "Maths", weights: { maths: 2 } },
      { label: "Science", weights: { science: 2 } },
      { label: "English / Sanskrit", weights: { english: 2, sanskrit: 1 } },
      { label: "Social Science", weights: { ssc: 2 } },
    ],
  },
];

/* ---------- helpers ---------- */
function xpForTrack(s: { totalXp: number; ssc: { totalXp: number }; subjectStats: Record<string, { totalXp: number }> }, t: Track): number {
  if (t === "science") return s.totalXp;
  if (t === "ssc") return s.ssc.totalXp;
  return s.subjectStats[t]?.totalXp ?? 0;
}

/* ---------- career card ---------- */
function CareerCard({ career, highlighted }: { career: Career; highlighted: boolean }) {
  const accent = highlighted ? "#fbbf24" : "#94a3b8";
  return (
    <Card
      className={`glass overflow-hidden flex flex-col transition-all ${
        highlighted ? "ring-2 ring-amber-400/60 shadow-lg shadow-amber-400/10" : ""
      }`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <div
            className="size-10 shrink-0 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${accent}22`, color: accent }}
          >
            {career.icon}
          </div>
          <div className="min-w-0 flex-1">
            <CardTitle className="text-base flex items-center gap-2">
              {career.name}
              {highlighted && (
                <Badge variant="outline" className="text-amber-300 border-amber-400/40 bg-amber-400/10">
                  <Sparkles className="size-3 mr-1" /> Match
                </Badge>
              )}
            </CardTitle>
            <CardDescription className="mt-0.5">{career.salary}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 space-y-3">
        <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap">{career.desc}</p>
        <div>
          <div className="text-[10px] uppercase tracking-wide text-muted-foreground mb-1">Strong subjects</div>
          <div className="flex flex-wrap gap-1">
            {career.subjects.map((s) => (
              <span
                key={s}
                className="px-2 py-0.5 rounded-md text-[11px] font-medium border"
                style={{
                  backgroundColor: `${SUBJECT_META[s].accent}15`,
                  color: SUBJECT_META[s].accent,
                  borderColor: `${SUBJECT_META[s].accent}40`,
                }}
              >
                {SUBJECT_META[s].icon} {SUBJECT_META[s].label}
              </span>
            ))}
          </div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-wide text-muted-foreground mb-1">Related skills</div>
          <div className="flex flex-wrap gap-1">
            {career.skills.map((sk) => (
              <span key={sk} className="px-2 py-0.5 rounded-md text-[11px] bg-muted border border-border">
                {sk}
              </span>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/* ---------- career quiz ---------- */
function CareerQuiz({ strongest }: { strongest: Track | null }) {
  const [step, setStep] = useState(0);
  const [scores, setScores] = useState<Record<Track, number>>({ science: 0, ssc: 0, maths: 0, english: 0, sanskrit: 0 });
  const [done, setDone] = useState(false);

  const reset = () => {
    setStep(0);
    setDone(false);
    setScores({ science: 0, ssc: 0, maths: 0, english: 0, sanskrit: 0 });
  };

  const pick = (opt: QuizOption) => {
    const next = { ...scores };
    (Object.keys(opt.weights) as Track[]).forEach((k) => {
      next[k] = (next[k] ?? 0) + (opt.weights[k] ?? 0);
    });
    setScores(next);
    if (step + 1 < QUIZ.length) setStep(step + 1);
    else setDone(true);
  };

  const sorted = useMemo(
    () => (Object.entries(scores) as [Track, number][])
      .sort((a, b) => b[1] - a[1]),
    [scores],
  );
  const top = sorted[0]?.[0];
  const topCareer = top ? CAREERS.find((c) => c.matchSubjects.includes(top)) : undefined;

  if (done) {
    return (
      <div className="space-y-3">
        <div className="text-center space-y-1">
          <div className="text-4xl">{topCareer?.icon ?? "🎯"}</div>
          <div className="text-sm text-muted-foreground">Your strongest fit</div>
          <div className="text-2xl font-bold" style={{ color: top ? SUBJECT_META[top].accent : undefined }}>
            {top ? SUBJECT_META[top].label : "—"}
          </div>
          {topCareer && (
            <div className="text-sm text-muted-foreground">
              Suggested path: <span className="font-medium text-foreground">{topCareer.name}</span>
            </div>
          )}
          {strongest && strongest === top && (
            <Badge variant="outline" className="mt-2 text-emerald-300 border-emerald-400/40 bg-emerald-400/10">
              <CheckCircle2 className="size-3 mr-1" /> Matches your XP data!
            </Badge>
          )}
        </div>
        <Separator />
        <div className="space-y-1.5">
          <div className="text-xs text-muted-foreground">Your full breakdown:</div>
          {sorted.map(([t, score]) => (
            <div key={t} className="flex items-center gap-2">
              <span className="text-xs w-28 flex items-center gap-1.5">
                <span>{SUBJECT_META[t].icon}</span> {SUBJECT_META[t].label}
              </span>
              <Progress value={score * 10} className="flex-1 h-2" />
              <span className="text-xs tabular-nums w-6 text-right">{score}</span>
            </div>
          ))}
        </div>
        <Button variant="outline" size="sm" onClick={reset} className="w-full">
          <RotateCcw className="size-3.5 mr-1" /> Retake quiz
        </Button>
      </div>
    );
  }

  const cur = QUIZ[step];
  const pct = (step / QUIZ.length) * 100;
  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Question {step + 1} of {QUIZ.length}</span>
          <span className="tabular-nums">{Math.round(pct)}%</span>
        </div>
        <Progress value={pct} className="h-1.5" />
      </div>
      <div className="rounded-lg bg-muted/40 border p-3">
        <p className="text-sm font-medium whitespace-pre-wrap">{cur.q}</p>
      </div>
      <div className="grid grid-cols-1 gap-2">
        {cur.options.map((o, i) => (
          <Button key={i} variant="outline" className="justify-start text-left h-auto py-2.5 whitespace-pre-wrap" onClick={() => pick(o)}>
            <span className="flex items-center gap-2">
              <span className="size-5 rounded-md bg-primary/15 text-primary text-[11px] font-bold flex items-center justify-center shrink-0">
                {String.fromCharCode(65 + i)}
              </span>
              <span className="text-sm">{o.label}</span>
            </span>
          </Button>
        ))}
      </div>
    </div>
  );
}

/* ---------- main view ---------- */
export function CareerView() {
  const mounted = useMounted();
  const totalXp = useStudyStore((s) => s.totalXp);
  const sscXp = useStudyStore((s) => s.ssc.totalXp);
  const subjectStats = useStudyStore((s) => s.subjectStats);
  const store = { totalXp, ssc: { totalXp: sscXp }, subjectStats };

  // find strongest subject by XP
  const tracks: Track[] = ["science", "ssc", "maths", "english", "sanskrit"];
  const trackXps = tracks.map((t) => ({ t, xp: xpForTrack(store, t) }));
  const sortedTracks = [...trackXps].sort((a, b) => b.xp - a.xp);
  const strongest = sortedTracks[0]?.xp > 0 ? sortedTracks[0].t : null;
  const totalAllXp = trackXps.reduce((s, x) => s + x.xp, 0);

  if (!mounted) {
    return (
      <div className="space-y-4">
        <div className="h-10 w-64 rounded bg-muted/40 animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-56 rounded-2xl bg-muted/30 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Briefcase className="size-7 text-amber-400" />
          Career Hub <span aria-hidden>💼</span>
        </h1>
        <p className="text-sm text-muted-foreground">Discover paths aligned with your strengths</p>
      </header>

      {/* Match widget */}
      <Card className="glass">
        <CardContent className="pt-5 pb-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <div className="text-xs uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
                <Target className="size-3.5" /> Your strongest subject
              </div>
              {strongest ? (
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl">{SUBJECT_META[strongest].icon}</span>
                  <span className="text-2xl font-bold" style={{ color: SUBJECT_META[strongest].accent }}>
                    {SUBJECT_META[strongest].label}
                  </span>
                </div>
              ) : (
                <div className="text-sm text-muted-foreground italic mt-1">
                  Start studying to unlock matches
                </div>
              )}
              <div className="text-[11px] text-muted-foreground mt-1">
                Based on total XP across all 5 subjects ({totalXp.toLocaleString()} XP)
              </div>
            </div>
            <div className="md:col-span-2 space-y-2">
              <div className="text-xs uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
                <Trophy className="size-3.5" /> Subject XP breakdown
              </div>
              <div className="space-y-1.5">
                {sortedTracks.map(({ t, xp }) => {
                  const max = Math.max(1, ...trackXps.map((x) => x.xp));
                  const pct = Math.round((xp / max) * 100);
                  return (
                    <div key={t} className="flex items-center gap-2">
                      <span className="text-xs w-28 flex items-center gap-1.5 shrink-0">
                        <span>{SUBJECT_META[t].icon}</span> {SUBJECT_META[t].label}
                      </span>
                      <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${pct}%`, backgroundColor: SUBJECT_META[t].accent }}
                        />
                      </div>
                      <span className="text-xs tabular-nums w-12 text-right">{xp.toLocaleString()}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Career cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {CAREERS.map((c) => (
          <CareerCard
            key={c.id}
            career={c}
            highlighted={!!strongest && c.matchSubjects.includes(strongest)}
          />
        ))}
      </div>

      {/* Career Quiz */}
      <Card className="glass">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles className="size-4 text-amber-400" /> Career Quiz
          </CardTitle>
          <CardDescription>5 quick questions to suggest a path forward</CardDescription>
        </CardHeader>
        <CardContent>
          <CareerQuiz strongest={strongest} />
        </CardContent>
      </Card>

      <div className="rounded-2xl glass border p-4 flex items-start gap-3 text-xs text-muted-foreground">
        <ArrowRight className="size-4 shrink-0 text-amber-400 mt-0.5" />
        <p className="whitespace-pre-wrap">
          Salary ranges are indicative of entry-to-mid level roles in India and vary widely by city, employer, and experience. Treat the matches as friendly guidance — your real career path is shaped by curiosity, persistence, and the doors you choose to open.
        </p>
      </div>
    </div>
  );
}
