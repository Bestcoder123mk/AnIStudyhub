"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ExternalLink, FileText, ClipboardCheck, Play, Pause, Square, RotateCcw, Timer,
  Sparkles, CircleDot, PenLine, Scroll, Trophy, Check, X,
} from "lucide-react";
import { useStudyStore, SUBJECT_META, type Track } from "@/store/use-study-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  SQP_PAPERS, SQP_PAGE_URL, SQP_TEST_PREFIX, getSqpPaper, paceMinutes, testTypeFor,
  practicePrompt, reviewPrompt, type PracticeKind,
} from "@/lib/sqp-data";

// ---------------------------------------------------------------------------
// Timed attempt — one at a time, kept in localStorage so it survives leaving
// this view (or reloading) mid-paper. Time is derived from a wall-clock end
// timestamp, never from counting ticks, so a throttled background tab can't
// make the clock drift.
// ---------------------------------------------------------------------------

const ATTEMPT_KEY = "studyhub-sqp-attempt-v1";

interface Attempt {
  track: Track;
  status: "running" | "paused" | "finished";
  /** Wall-clock time the paper ends (running only). */
  endAt: number | null;
  /** Time left when paused. */
  remainingMs: number | null;
  /** How long the student actually worked (set when finished). */
  elapsedMs: number | null;
}

function readAttempt(): Attempt | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(ATTEMPT_KEY);
    if (!raw) return null;
    const a = JSON.parse(raw) as Attempt;
    return a && typeof a.track === "string" && getSqpPaper(a.track) ? a : null;
  } catch {
    return null;
  }
}

function writeAttempt(a: Attempt | null) {
  try {
    if (a) window.localStorage.setItem(ATTEMPT_KEY, JSON.stringify(a));
    else window.localStorage.removeItem(ATTEMPT_KEY);
  } catch {
    /* storage unavailable — the timer still works for this visit */
  }
}

function fmtClock(ms: number): string {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

const PRACTICE_BUTTONS: { kind: PracticeKind; label: string; icon: React.ReactNode }[] = [
  { kind: "mcq", label: "MCQs", icon: <CircleDot className="size-3.5" /> },
  { kind: "short", label: "Short answers", icon: <PenLine className="size-3.5" /> },
  { kind: "long", label: "Long answers", icon: <Scroll className="size-3.5" /> },
  { kind: "mock", label: "Mock test", icon: <FileText className="size-3.5" /> },
];

export function SqpView() {
  const track = useStudyStore((s) => s.track);
  const setTrack = useStudyStore((s) => s.setTrack);
  const setView = useStudyStore((s) => s.setView);
  const setPendingTutorContext = useStudyStore((s) => s.setPendingTutorContext);
  const mockHistory = useStudyStore((s) => s.mockHistory);
  const recordMockResult = useStudyStore((s) => s.recordMockResult);
  const addXp = useStudyStore((s) => s.addXp);
  const pushToast = useStudyStore((s) => s.pushToast);

  const [selected, setSelected] = useState<Track>(() => (getSqpPaper(track) ? track : "maths"));
  const paper = getSqpPaper(selected) ?? SQP_PAPERS[0];
  const meta = SUBJECT_META[paper.track];

  const [attempt, setAttemptState] = useState<Attempt | null>(readAttempt);
  const [now, setNow] = useState(() => Date.now());
  const [logging, setLogging] = useState(false);
  const [scores, setScores] = useState<Record<string, string>>({});
  const [minutes, setMinutes] = useState("");
  const [saved, setSaved] = useState<{ scored: number; pct: number; weakest: string; prompt: string } | null>(null);

  const setAttempt = (a: Attempt | null) => {
    setAttemptState(a);
    writeAttempt(a);
  };

  const durationMs = paper.durationMin * 60_000;
  const mine = attempt && attempt.track === paper.track ? attempt : null;

  // Tick once a second while a paper is running; finish it automatically at zero.
  useEffect(() => {
    if (attempt?.status !== "running") return;
    const id = window.setInterval(() => {
      const t = Date.now();
      setNow(t);
      setAttemptState((cur) => {
        if (cur && cur.status === "running" && cur.endAt !== null && t >= cur.endAt) {
          const done: Attempt = { ...cur, status: "finished", endAt: null, remainingMs: 0, elapsedMs: (getSqpPaper(cur.track)?.durationMin ?? 180) * 60_000 };
          writeAttempt(done);
          return done;
        }
        return cur;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [attempt?.status]);

  const remainingMs = !mine
    ? durationMs
    : mine.status === "running" && mine.endAt !== null
      ? Math.max(0, mine.endAt - now)
      : mine.status === "paused"
        ? mine.remainingMs ?? durationMs
        : 0;
  const elapsedFraction = 1 - remainingMs / durationMs;

  // ---- timer actions -------------------------------------------------------------------------------------------
  const start = () => {
    const t = Date.now();
    setNow(t);
    setSaved(null);
    setLogging(false);
    setAttempt({ track: paper.track, status: "running", endAt: t + durationMs, remainingMs: null, elapsedMs: null });
  };
  const pause = () => {
    if (!mine || mine.endAt === null) return;
    setAttempt({ ...mine, status: "paused", endAt: null, remainingMs: Math.max(0, mine.endAt - Date.now()) });
  };
  const resume = () => {
    if (!mine || mine.remainingMs === null) return;
    const t = Date.now();
    setNow(t);
    setAttempt({ ...mine, status: "running", endAt: t + mine.remainingMs, remainingMs: null });
  };
  const finish = () => {
    if (!mine) return;
    const left = mine.status === "running" && mine.endAt !== null ? Math.max(0, mine.endAt - Date.now()) : mine.remainingMs ?? 0;
    const elapsed = durationMs - left;
    setAttempt({ ...mine, status: "finished", endAt: null, remainingMs: left, elapsedMs: elapsed });
    openLogger(Math.round(elapsed / 60_000));
  };
  const discard = () => {
    setAttempt(null);
    setLogging(false);
  };

  const openLogger = (mins?: number) => {
    setLogging(true);
    setSaved(null);
    if (mins !== undefined) setMinutes(String(mins));
  };

  // ---- score logging -------------------------------------------------------------------------------------------
  const parsed = useMemo(
    () =>
      paper.sections.map((s) => {
        const raw = scores[s.id];
        const n = raw === undefined || raw === "" ? 0 : Number(raw);
        const valid = Number.isFinite(n) && n >= 0 && n <= s.marks;
        return { section: s, value: Number.isFinite(n) ? Math.min(Math.max(n, 0), s.marks) : 0, valid, blank: raw === undefined || raw === "" };
      }),
    [paper, scores]
  );
  const total = parsed.reduce((n, r) => n + r.value, 0);
  const allValid = parsed.every((r) => r.valid);
  const anyEntered = parsed.some((r) => !r.blank);

  const saveScore = () => {
    if (!allValid || !anyEntered) return;
    const pct = Math.round((total / paper.maxMarks) * 100);
    const mins = Number(minutes);
    const timeTakenSec =
      Number.isFinite(mins) && mins > 0
        ? Math.round(mins * 60)
        : Math.round((mine?.elapsedMs ?? durationMs) / 1000);
    recordMockResult({
      track: paper.track,
      testType: testTypeFor(paper),
      scoredMarks: total,
      maxMarks: paper.maxMarks,
      scorePct: pct,
      timeTakenSec,
      timeAllottedSec: paper.durationMin * 60,
      sectionBreakdown: parsed.map((r) => ({ section: `${r.section.id} · ${r.section.name}`, scored: r.value, max: r.section.marks })),
    });
    addXp(20 + Math.round(pct / 2), "Sample paper attempt", paper.track);
    pushToast("📝", `${paper.title}: ${total}/${paper.maxMarks} saved to Analytics`, "success");

    const weakest = [...parsed].sort((a, b) => a.value / a.section.marks - b.value / b.section.marks)[0];
    setSaved({
      scored: total,
      pct,
      weakest: `${weakest.section.name} (${weakest.value}/${weakest.section.marks})`,
      prompt: reviewPrompt(paper, total, parsed.map((r) => ({ section: r.section, scored: r.value }))),
    });
    setLogging(false);
    setScores({});
    setMinutes("");
    if (mine) setAttempt(null);
  };

  // ---- history for this paper --------------------------------------------------------------------------------------
  const history = useMemo(
    () => mockHistory.filter((m) => m.track === paper.track && m.testType.startsWith(SQP_TEST_PREFIX)),
    [mockHistory, paper.track]
  );
  const best = history.reduce((b, m) => Math.max(b, m.scoredMarks), 0);
  const avg = history.length ? history.reduce((n, m) => n + m.scorePct, 0) / history.length : 0;

  // ---- hand-offs ---------------------------------------------------------------------------------------------------
  const goPractice = (kind: PracticeKind) => {
    const target = paper.practice[kind];
    if (!target) return;
    setTrack(paper.track); // switches subject (and lands on its dashboard)…
    setView(target); // …then straight on to the practice screen
  };
  const askTutor = (prompt: string) => {
    setTrack(paper.track);
    setPendingTutorContext(prompt);
    setView("tutor");
  };

  const otherRunning = attempt && attempt.track !== paper.track && attempt.status !== "finished" ? getSqpPaper(attempt.track) : null;

  return (
    <div className="space-y-5" style={{ ["--sc" as string]: meta.accent }}>
      {/* Header */}
      <div className="page-header">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Sample Papers 📝</h1>
            <p className="text-muted-foreground mt-2 max-w-2xl">
              CBSE&apos;s official Class X sample question papers and marking schemes for 2026-27 — open the real
              paper, sit it against the clock, and log your score so it feeds your Analytics.
            </p>
          </div>
          <a
            href={SQP_PAGE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-border/70 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
          >
            CBSE SQP page <ExternalLink className="size-3" />
          </a>
        </div>
      </div>

      {/* Subject tabs */}
      <div role="tablist" aria-label="Subjects" className="flex gap-2 overflow-x-auto scroll-thin pb-1 -mx-1 px-1 snap-x">
        {SQP_PAPERS.map((p) => {
          const active = p.track === paper.track;
          const m = SUBJECT_META[p.track];
          return (
            <button
              key={p.track}
              role="tab"
              aria-selected={active}
              type="button"
              onClick={() => {
                setSelected(p.track);
                setLogging(false);
                setSaved(null);
              }}
              className={`shrink-0 snap-start whitespace-nowrap rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all ${
                active
                  ? "border-foreground/80 bg-foreground text-background shadow-sm"
                  : "border-border/70 bg-background/60 text-muted-foreground hover:border-foreground/30 hover:text-foreground"
              }`}
            >
              <span className="mr-1">{m.icon}</span>
              {m.label}
            </button>
          );
        })}
      </div>

      {otherRunning && attempt && (
        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border/70 bg-foreground/[0.04] px-4 py-3 text-sm">
          <Timer className="size-4 text-muted-foreground" />
          <span>
            A timed attempt for <strong>{otherRunning.title}</strong> is {attempt.status === "paused" ? "paused" : "running"}.
          </span>
          <Button size="sm" variant="outline" className="ml-auto h-7 rounded-full" onClick={() => setSelected(otherRunning.track)}>
            Go to it
          </Button>
        </div>
      )}

      {/* Paper card */}
      <Card className="card-premium rounded-2xl p-0 overflow-hidden">
        <CardContent className="p-5 sm:p-6 space-y-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <Badge variant="outline" className="text-[11px]">Code {paper.code}</Badge>
                <Badge variant="outline" className="text-[11px]">{paper.maxMarks} marks</Badge>
                <Badge variant="outline" className="text-[11px]">{paper.durationMin / 60} hours</Badge>
                <Badge variant="outline" className="text-[11px]">{paper.questionCount} questions</Badge>
              </div>
              <h2 className="text-2xl font-semibold tracking-tight">
                <span className="mr-2">{meta.icon}</span>
                {paper.title}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">Sample Question Paper · Class X · 2026-27</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button asChild>
                <a href={paper.sqpUrl} target="_blank" rel="noopener noreferrer">
                  <FileText className="size-4" /> Question paper <ExternalLink className="size-3.5 opacity-70" />
                </a>
              </Button>
              <Button asChild variant="outline">
                <a href={paper.msUrl} target="_blank" rel="noopener noreferrer">
                  <ClipboardCheck className="size-4" /> Marking scheme <ExternalLink className="size-3.5 opacity-70" />
                </a>
              </Button>
            </div>
          </div>

          {/* Blueprint */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Paper blueprint</h3>
            <div className="flex h-9 w-full gap-1 overflow-hidden rounded-xl" role="img" aria-label="Marks by section">
              {paper.sections.map((s, i) => (
                <div
                  key={s.id}
                  className="flex min-w-0 items-center justify-center rounded-md text-[11px] font-semibold text-foreground/85"
                  style={{
                    flexGrow: s.marks,
                    flexBasis: 0,
                    backgroundColor: `color-mix(in oklch, var(--foreground) ${10 + (i % 2) * 7}%, transparent)`,
                  }}
                  title={`${s.name} — ${s.marks} marks`}
                >
                  {s.id} · {s.marks}
                </div>
              ))}
            </div>

            <ul className="mt-3 divide-y divide-border/50 rounded-xl border border-border/60" role="list">
              {paper.sections.map((s) => (
                <li key={s.id} className="flex flex-wrap items-start gap-x-4 gap-y-2 px-4 py-3">
                  <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-foreground/[0.07] text-sm font-semibold">{s.id}</span>
                  <div className="min-w-0 flex-1 basis-60">
                    <div className="text-sm font-medium">
                      {s.name} <span className="ml-1 text-xs font-normal text-muted-foreground">{s.qs}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{s.detail}</p>
                  </div>
                  <div className="text-right text-xs text-muted-foreground tabular-nums">
                    <div className="text-sm font-semibold text-foreground">{s.marks} marks</div>
                    <div>≈ {paceMinutes(paper, s)} min</div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 rounded-full text-xs text-muted-foreground hover:text-foreground"
                    onClick={() => askTutor(practicePrompt(paper, s))}
                    title="Ask the AI Tutor for an original practice set in this section's pattern"
                  >
                    <Sparkles className="size-3.5" /> Practise
                  </Button>
                </li>
              ))}
            </ul>
            <p className="mt-2 text-[11px] text-muted-foreground">
              Pacing keeps 15 minutes back for revision and splits the rest in proportion to marks. &ldquo;Practise&rdquo; asks the
              AI Tutor for brand-new questions in that section&apos;s pattern.
            </p>
          </div>

          {/* Facts */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Good to know</h3>
            <ul className="space-y-1.5 text-sm leading-relaxed" role="list">
              {paper.facts.map((f) => (
                <li key={f} className="flex gap-2.5">
                  <span aria-hidden className="mt-[0.6em] size-[5px] shrink-0 rounded-full bg-foreground/40" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Practice routing */}
          <div className="flex flex-wrap items-center gap-2 border-t border-border/50 pt-4">
            <span className="text-xs text-muted-foreground mr-1">Warm up in the app:</span>
            {PRACTICE_BUTTONS.filter((b) => paper.practice[b.kind]).map((b) => (
              <Button key={b.kind} size="sm" variant="outline" className="h-8 rounded-full text-xs" onClick={() => goPractice(b.kind)}>
                {b.icon} {b.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Exam mode */}
      <Card className="card-premium rounded-2xl p-0 overflow-hidden">
        <CardContent className="p-5 sm:p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold tracking-tight flex items-center gap-2">
                <Timer className="size-5 text-muted-foreground" /> Exam mode
              </h3>
              <p className="text-sm text-muted-foreground mt-0.5">
                Open the paper, start the clock, and work to the real {paper.durationMin / 60}-hour limit.
              </p>
            </div>
            {!mine && !logging && (
              <div className="flex gap-2">
                <Button onClick={start} disabled={!!otherRunning}>
                  <Play className="size-4" /> Start timed attempt
                </Button>
                <Button variant="outline" onClick={() => openLogger()}>
                  Log a score
                </Button>
              </div>
            )}
          </div>

          {mine && (
            <div className="rounded-2xl border border-border/60 bg-foreground/[0.03] p-4 sm:p-5">
              <div
                className={`text-center font-mono text-5xl sm:text-6xl font-semibold tabular-nums tracking-tight ${
                  mine.status === "paused" ? "opacity-60" : ""
                }`}
                aria-live="off"
                aria-label={`Time left ${fmtClock(remainingMs)}`}
              >
                {fmtClock(remainingMs)}
              </div>
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-foreground/10">
                <div className="h-full rounded-full bg-foreground/70 transition-[width] duration-1000 ease-linear" style={{ width: `${Math.min(100, elapsedFraction * 100)}%` }} />
              </div>
              <div className="mt-1.5 text-center text-xs text-muted-foreground">
                {mine.status === "paused" ? "Paused" : mine.status === "finished" ? "Time's up" : "Running"} · {Math.round(elapsedFraction * 100)}% of the time used
              </div>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {mine.status === "running" && (
                  <Button variant="outline" onClick={pause}>
                    <Pause className="size-4" /> Pause
                  </Button>
                )}
                {mine.status === "paused" && (
                  <Button onClick={resume}>
                    <Play className="size-4" /> Resume
                  </Button>
                )}
                <Button onClick={finish} variant={mine.status === "finished" ? "default" : "outline"}>
                  <Square className="size-3.5" /> {mine.status === "finished" ? "Log my score" : "Finish & log score"}
                </Button>
                <Button variant="ghost" className="text-muted-foreground" onClick={discard}>
                  <RotateCcw className="size-4" /> Discard
                </Button>
              </div>
            </div>
          )}

          {logging && (
            <div className="rounded-2xl border border-border/60 bg-foreground/[0.03] p-4 sm:p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold">Marks you got — check against the marking scheme</h4>
                <Button size="icon" variant="ghost" className="size-8" onClick={() => setLogging(false)} aria-label="Close score log">
                  <X className="size-4" />
                </Button>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {parsed.map((r) => (
                  <label key={r.section.id} className="flex items-center gap-3 rounded-xl border border-border/60 bg-background/50 px-3 py-2.5">
                    <span className="grid size-7 shrink-0 place-items-center rounded-md bg-foreground/[0.07] text-xs font-semibold">{r.section.id}</span>
                    <span className="min-w-0 flex-1 truncate text-sm">{r.section.name}</span>
                    <input
                      type="number"
                      inputMode="decimal"
                      min={0}
                      max={r.section.marks}
                      step={0.5}
                      value={scores[r.section.id] ?? ""}
                      onChange={(e) => setScores((cur) => ({ ...cur, [r.section.id]: e.target.value }))}
                      placeholder="0"
                      aria-label={`Marks scored in ${r.section.name}, out of ${r.section.marks}`}
                      className={`w-16 rounded-lg border bg-transparent px-2 py-1.5 text-right text-sm tabular-nums outline-none focus:border-foreground/50 ${
                        r.valid ? "border-border/70" : "border-destructive"
                      }`}
                    />
                    <span className="w-9 shrink-0 text-xs text-muted-foreground tabular-nums">/ {r.section.marks}</span>
                  </label>
                ))}
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-4 text-sm">
                  <span>
                    Total{" "}
                    <strong className="tabular-nums">
                      {total}/{paper.maxMarks}
                    </strong>{" "}
                    <span className="text-muted-foreground tabular-nums">({Math.round((total / paper.maxMarks) * 100)}%)</span>
                  </span>
                  <label className="flex items-center gap-2 text-xs text-muted-foreground">
                    Time taken
                    <input
                      type="number"
                      inputMode="numeric"
                      min={1}
                      max={paper.durationMin}
                      value={minutes}
                      onChange={(e) => setMinutes(e.target.value)}
                      placeholder={String(paper.durationMin)}
                      aria-label="Minutes taken"
                      className="w-16 rounded-lg border border-border/70 bg-transparent px-2 py-1 text-right text-sm tabular-nums text-foreground outline-none focus:border-foreground/50"
                    />
                    min
                  </label>
                </div>
                <Button onClick={saveScore} disabled={!allValid || !anyEntered}>
                  <Check className="size-4" /> Save attempt
                </Button>
              </div>
              {!allValid && <p className="text-xs text-destructive">A section&apos;s marks can&apos;t be negative or above its maximum.</p>}
            </div>
          )}

          {saved && (
            <div className="rounded-2xl border border-border/60 bg-foreground/[0.03] p-4 sm:p-5">
              <div className="flex flex-wrap items-center gap-3">
                <Trophy className="size-5 text-muted-foreground" />
                <div className="text-sm">
                  Saved: <strong className="tabular-nums">{saved.scored}/{paper.maxMarks}</strong> ({saved.pct}%). Weakest section:{" "}
                  <strong>{saved.weakest}</strong>.
                </div>
                <Button size="sm" variant="outline" className="ml-auto h-8 rounded-full" onClick={() => askTutor(saved.prompt)}>
                  <Sparkles className="size-3.5" /> Plan my fixes with the AI Tutor
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* History */}
      <Card className="card-premium rounded-2xl p-0 overflow-hidden">
        <CardContent className="p-5 sm:p-6">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h3 className="text-lg font-semibold tracking-tight">Your attempts · {meta.label}</h3>
            {history.length > 0 && (
              <span className="text-xs text-muted-foreground tabular-nums">
                {history.length} logged · best {best}/{paper.maxMarks} · average {Math.round(avg)}%
              </span>
            )}
          </div>
          {history.length === 0 ? (
            <p className="mt-2 text-sm text-muted-foreground">
              Nothing logged yet. Attempts you save here count towards this subject&apos;s mock-test stats in Analytics.
            </p>
          ) : (
            <ul className="mt-3 divide-y divide-border/50" role="list">
              {history.slice(0, 6).map((m) => (
                <li key={m.id} className="flex items-center gap-4 py-2.5 text-sm">
                  <span className="w-24 shrink-0 text-xs text-muted-foreground">{new Date(m.date).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })}</span>
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-foreground/10">
                    <div className="h-full rounded-full bg-foreground/70" style={{ width: `${m.scorePct}%` }} />
                  </div>
                  <span className="w-20 shrink-0 text-right font-medium tabular-nums">
                    {m.scoredMarks}/{m.maxMarks}
                  </span>
                  <span className="w-12 shrink-0 text-right text-xs text-muted-foreground tabular-nums">{m.scorePct}%</span>
                  <span className="hidden w-16 shrink-0 text-right text-xs text-muted-foreground tabular-nums sm:block">{Math.round(m.timeTakenSec / 60)} min</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <p className="text-center text-[11px] text-muted-foreground">
        Papers and marking schemes are published by CBSE and open on cbseacademic.nic.in. CBSE notes there is no change in the
        paper design or assessment pattern for 2026-27.
      </p>
    </div>
  );
}
