"use client";

import { X } from "lucide-react";
import { useStudyStore, SUBJECT_META } from "@/store/use-study-store";
import { Progress } from "@/components/ui/progress";

/** The lesson bar: pinned to the top of a practice session (Duolingo's pattern) so progress is always
 *  visible — it used to sit at the very bottom of the page, under the dock on phones. Liquid Glass,
 *  because it floats over the question as it scrolls. */
export function SessionBar({ answered, total }: { answered: number; total: number }) {
  const track = useStudyStore((s) => s.track);
  const setView = useStudyStore((s) => s.setView);
  const pct = total > 0 ? Math.min(100, (answered / total) * 100) : 0;
  return (
    <div className="glass-strong sticky top-[calc(env(safe-area-inset-top,0px)+0.6rem)] z-20 flex items-center gap-2.5 rounded-2xl px-2 py-2 lg:top-3" role="group" aria-label="Session progress">
      <button onClick={() => setView(SUBJECT_META[track].dash)} aria-label="Exit lesson" className="grid size-9 shrink-0 place-items-center rounded-xl text-muted-foreground outline-none transition hover:bg-foreground/10 hover:text-foreground active:scale-90 focus-visible:ring-2 focus-visible:ring-ring">
        <X className="size-5" strokeWidth={3} />
      </button>
      <Progress value={pct} className="flex-1" aria-label={`${answered} of ${total} answered`} />
      <span className="text-xs font-extrabold tabular-nums text-muted-foreground">
        {answered} / {total}
      </span>
      <span className="hidden text-[11px] font-bold text-muted-foreground lg:inline" aria-hidden>
        1–4 select · Enter check
      </span>
    </div>
  );
}
