"use client";

import { Button } from "@/components/ui/button";

/** Duolingo's CHECK bar. Tapping an option only selects it; this commits the answer, so a stray tap while
 *  scrolling on a phone can't lock in a wrong answer. Liquid Glass because it floats over the question. */
export function CheckBar({ disabled, onCheck }: { disabled: boolean; onCheck: () => void }) {
  return (
    <>
      <div aria-hidden className="h-24" />
      <div className="check-bar glass-strong">
        <Button size="lg" className="w-full" disabled={disabled} onClick={onCheck}>
          Check
        </Button>
      </div>
    </>
  );
}
