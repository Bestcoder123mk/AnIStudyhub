"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { Mascot } from "@/components/shared/mascot";

/**
 * The post-answer sheet: a tinted pane of Liquid Glass that rises from the bottom (green for right,
 * red for wrong). It is the functional layer — it floats over the question, so the question stays
 * visible through it — which is exactly what the material is for. Children are the explanation,
 * the confidence prompt and the Next button; CSS (.answer-sheet) lays them out.
 */
export function AnswerSheet({ correct, children }: { correct: boolean; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  // The sheet must never hide the answer you just gave (it covered every option on a phone). Once it is up,
  // scroll just far enough that the lowest highlighted option sits above it — Duolingo's behaviour.
  useEffect(() => {
    const id = window.setTimeout(() => {
      const el = ref.current;
      if (!el) return;
      const picked = Array.from(document.querySelectorAll<HTMLElement>(".choice-correct, .choice-wrong"));
      if (!picked.length) return;
      const lowest = Math.max(...picked.map((p) => p.getBoundingClientRect().bottom));
      const sheetTop = window.innerHeight - el.offsetHeight - 24; // final position (it animates in)
      const over = lowest - (sheetTop - 14);
      if (over > 0) window.scrollBy({ top: over, behavior: "smooth" });
    }, 60);
    return () => window.clearTimeout(id);
  }, []);
  return (
    <>
      {/* keeps the last options scrollable above the sheet */}
      <div aria-hidden className="h-72" />
      <div ref={ref} className="answer-sheet" data-tone={correct ? "right" : "wrong"} role="status" aria-live="polite">
        <div className="mb-2 flex items-center gap-2.5">
          <Mascot mood={correct ? "cheer" : "sad"} size={50} decorative bounce={correct} className="-ml-1 -mt-1.5 shrink-0" />
          <span className="font-display text-xl font-extrabold" style={{ color: correct ? "color-mix(in oklch, var(--success) 62%, var(--foreground))" : "color-mix(in oklch, var(--danger) 70%, var(--foreground))" }}>
            {correct ? "Correct!" : "Not quite"}
          </span>
        </div>
        {children}
      </div>
    </>
  );
}
