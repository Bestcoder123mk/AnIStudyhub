"use client";

import { useRef, useState } from "react";
import { useStudyStore, SUBJECT_META } from "@/store/use-study-store";
import { DIAGRAM_PROMPTS, type DiagramPrompt } from "@/lib/diagram-data";
import { DiagramCanvas, type DiagramCanvasHandle } from "@/components/shared/diagram-canvas";
import { Button } from "@/components/ui/button";
import { useMounted, fireConfetti } from "@/components/shared/helpers";
import { PenTool, ArrowLeft, Eye, CheckCircle2, Circle, Sparkles, RotateCcw } from "lucide-react";

export function DiagramPracticeView() {
  const [active, setActive] = useState<DiagramPrompt | null>(null);
  if (active) return <PracticeSession prompt={active} onExit={() => setActive(null)} />;
  return <PromptList onSelect={setActive} />;
}

function PromptList({ onSelect }: { onSelect: (p: DiagramPrompt) => void }) {
  const mounted = useMounted();
  const completions = useStudyStore((s) => s.diagramCompletions);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl sm:text-3xl font-display font-bold mb-1 flex items-center gap-2">
          <PenTool className="size-6" /> Diagram Practice
        </h1>
        <p className="text-sm text-muted-foreground">
          Draw it yourself, then compare against a reference and rate your own attempt honestly.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {DIAGRAM_PROMPTS.map((p) => {
          const meta = SUBJECT_META[p.track];
          const times = mounted ? (completions[p.id] || 0) : 0;
          return (
            <button
              key={p.id}
              onClick={() => onSelect(p)}
              className="tap-lift text-left rounded-2xl border border-border/70 bg-card/60 hover:bg-card p-4 transition-all overflow-hidden relative"
            >
              <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: meta.accent }} />
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-muted/60 text-muted-foreground">
                  {meta.icon} {p.subject}
                </span>
                {times > 0 && (
                  <span className="text-[10px] flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                    <CheckCircle2 className="size-3" /> {times}×
                  </span>
                )}
              </div>
              <h3 className="font-semibold text-sm leading-snug mb-1">{p.title}</h3>
              <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{p.instructions}</p>
              <div className="text-[11px] font-semibold text-amber-600 dark:text-amber-300">+{p.xp} XP</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function PracticeSession({ prompt, onExit }: { prompt: DiagramPrompt; onExit: () => void }) {
  const canvasRef = useRef<DiagramCanvasHandle>(null);
  const [phase, setPhase] = useState<"draw" | "compare">("draw");
  const [checked, setChecked] = useState<boolean[]>(() => prompt.checklist.map(() => false));
  const completeDiagram = useStudyStore((s) => s.completeDiagram);
  const meta = SUBJECT_META[prompt.track];

  const toggleCheck = (i: number) => setChecked((c) => c.map((v, idx) => (idx === i ? !v : v)));
  const checkedCount = checked.filter(Boolean).length;

  const finish = () => {
    completeDiagram(prompt.id, prompt.track, prompt.xp);
    fireConfetti();
    onExit();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <button onClick={onExit} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition">
          <ArrowLeft className="size-4" /> All diagrams
        </button>
        <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-muted/60 text-muted-foreground">
          {meta.icon} {prompt.subject}
        </span>
      </div>

      <div>
        <h2 className="text-xl font-display font-bold mb-1">{prompt.title}</h2>
        <p className="text-sm text-muted-foreground">{prompt.instructions}</p>
      </div>

      {phase === "draw" ? (
        <>
          <DiagramCanvas ref={canvasRef} height={360} />
          <div className="flex flex-wrap gap-2 justify-end">
            <Button variant="outline" onClick={() => canvasRef.current?.clear()} className="gap-1.5">
              <RotateCcw className="size-4" /> Start over
            </Button>
            <Button onClick={() => setPhase("compare")} className="gap-1.5">
              <Eye className="size-4" /> Done — compare to reference
            </Button>
          </div>
        </>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <div className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Reference sketch</div>
            <div className="rounded-2xl border border-border/60 bg-white p-3">
              <prompt.Reference />
            </div>
            {prompt.caption && <p className="text-[11px] text-muted-foreground/70 mt-2 italic">{prompt.caption}</p>}
          </div>
          <div>
            <div className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
              Self-check — tick what your diagram includes ({checkedCount}/{prompt.checklist.length})
            </div>
            <div className="rounded-2xl border border-border/60 bg-card/50 p-3 space-y-2">
              {prompt.checklist.map((item, i) => (
                <button
                  key={i}
                  onClick={() => toggleCheck(i)}
                  className="w-full flex items-start gap-2 text-left text-sm p-1.5 rounded-lg hover:bg-accent/50 transition"
                >
                  {checked[i] ? (
                    <CheckCircle2 className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                  ) : (
                    <Circle className="size-4 text-muted-foreground/40 shrink-0 mt-0.5" />
                  )}
                  <span className={checked[i] ? "text-foreground" : "text-muted-foreground"}>{item}</span>
                </button>
              ))}
            </div>

            <div className="flex flex-wrap gap-2 justify-end mt-4">
              <Button variant="outline" onClick={() => setPhase("draw")} className="gap-1.5">
                <ArrowLeft className="size-4" /> Back to drawing
              </Button>
              <Button onClick={finish} className="gap-1.5">
                <Sparkles className="size-4" /> Done — claim +{prompt.xp} XP
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
