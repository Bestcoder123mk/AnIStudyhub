"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Markdown } from "@/components/shared/markdown";
import { PenLine, RotateCcw } from "lucide-react";

/**
 * Splits a model answer into checkable "key points" so the self-check step
 * always has something concrete to compare against, instead of just a wall
 * of prose to re-read. Prefers existing bullet/numbered lines; falls back
 * to sentence-level chunks when the answer is a single paragraph.
 */
export function extractKeyPoints(answer: string): string[] {
  const rawLines = answer
    .split(/\n+/)
    .map((l) => l.replace(/^[\s•\-*\u2022]+/, "").replace(/^\d+[.)]\s*/, "").trim())
    .filter(Boolean);
  if (rawLines.length >= 2) return rawLines.slice(0, 8);
  const sentences = answer
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 3);
  return sentences.slice(0, 6);
}

type Stage = "write" | "checked";

/**
 * The active-recall loop the review doc asked for: question → hide answer
 * → student writes from memory → reveal + self-check against key points →
 * honest self-grade → retry. `onScore` fires once per grading (not per
 * retry-of-the-same-attempt) so callers can log it via recordRecall
 * without double-counting.
 */
export function ActiveRecallPanel({
  marksMax,
  modelAnswer,
  onScore,
}: {
  marksMax: number;
  modelAnswer: string;
  onScore: (scored: number) => void;
}) {
  const [stage, setStage] = useState<Stage>("write");
  const [draft, setDraft] = useState("");
  const [scored, setScored] = useState<number | null>(null);
  const points = extractKeyPoints(modelAnswer);
  const scoreOptions = Array.from({ length: marksMax + 1 }, (_, i) => i);

  if (stage === "write") {
    return (
      <div className="space-y-2">
        <Textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Write your answer from memory first — this is the part that actually builds recall."
          rows={3}
          className="text-sm"
        />
        <Button size="sm" onClick={() => setStage("checked")}>
          <PenLine className="size-4" /> Check my answer
        </Button>
      </div>
    );
  }

  return (
    <div className="animate-float-up space-y-3">
      {draft.trim() && (
        <div className="rounded-lg border border-border bg-muted/20 p-3 text-sm">
          <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Your answer</span>
          <p className="whitespace-pre-wrap text-muted-foreground">{draft}</p>
        </div>
      )}
      <div className="rounded-lg border border-border bg-muted/40 p-3 text-sm leading-relaxed">
        <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          Model answer — did you cover these?
        </span>
        {points.length > 1 ? (
          <ul className="list-disc space-y-1 pl-4">
            {points.map((p, i) => (
              <li key={i}><Markdown text={p} compact /></li>
            ))}
          </ul>
        ) : (
          <Markdown text={modelAnswer} />
        )}
      </div>
      {scored === null ? (
        <div className="space-y-1.5">
          <p className="text-xs text-muted-foreground">Be honest — how many of the {marksMax} marks would an examiner give this?</p>
          <div className="flex flex-wrap gap-1.5">
            {scoreOptions.map((v) => (
              <Button
                key={v}
                size="sm"
                variant="outline"
                className="h-7 w-9 px-0"
                onClick={() => { setScored(v); onScore(v); }}
              >
                {v}
              </Button>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between gap-2 text-xs">
          <span className={scored >= marksMax ? "text-emerald-400" : "text-amber-400"}>
            Self-graded {scored}/{marksMax}{scored < marksMax ? " — worth another pass later" : " — full marks"}
          </span>
          <Button size="sm" variant="ghost" className="h-7" onClick={() => { setStage("write"); setDraft(""); setScored(null); }}>
            <RotateCcw className="size-3.5" /> Retry
          </Button>
        </div>
      )}
    </div>
  );
}
