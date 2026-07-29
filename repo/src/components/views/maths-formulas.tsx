"use client";

import { useStudyStore } from "@/store/use-study-store";
import { MATHS_FORMULAS, type MATHSFormulaItem } from "@/lib/maths-data";
import { useMounted } from "@/components/shared/helpers";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

// Maths accent (cyan) — local constant.
const ACCENT = "#22d3ee";

function FormulaCard({ f }: { f: MATHSFormulaItem }) {
  const mounted = useMounted();
  const bookmarks = useStudyStore((s) => s.bookmarks);
  const addBookmark = useStudyStore((s) => s.addBookmark);
  const removeBookmark = useStudyStore((s) => s.removeBookmark);
  const isBookmarked = useStudyStore((s) => s.isBookmarked);
  const pushToast = useStudyStore((s) => s.pushToast);

  const refId = `maths-formula-${f.title}`;
  const isBm = mounted && isBookmarked("maths", "formula", refId);

  const toggleBm = () => {
    if (isBookmarked("maths", "formula", refId)) {
      const bm = bookmarks.find((b) => b.track === "maths" && b.type === "formula" && b.refId === refId);
      if (bm) {
        removeBookmark(bm.id);
        pushToast("☆", "Bookmark removed", "info");
      }
    } else {
      addBookmark({
        track: "maths",
        type: "formula",
        refId,
        title: f.title,
        ch: 0,
        subj: "maths",
      });
      pushToast("⭐", `Bookmarked: ${f.title}`, "success");
    }
  };

  return (
    <Card className="glass relative gap-2 rounded-2xl p-4">
      <div className="flex items-start justify-between gap-2">
        <h4 className="text-sm font-semibold leading-snug">{f.title}</h4>
        <Button
          variant="ghost"
          size="icon"
          className="size-7 shrink-0"
          aria-label={isBm ? "Remove bookmark" : "Add bookmark"}
          onClick={toggleBm}
        >
          <Star className={isBm ? "size-4 fill-amber-400 text-amber-400" : "size-4"} />
        </Button>
      </div>
      <p
        className="whitespace-pre-wrap font-mono text-base sm:text-lg font-semibold leading-snug"
        style={{ color: ACCENT }}
      >
        {f.text}
      </p>
      {f.note ? (
        <p className="text-xs leading-relaxed text-muted-foreground">{f.note}</p>
      ) : null}
    </Card>
  );
}

export function MathsFormulasView() {
  const totalFormulas = MATHS_FORMULAS.cats.reduce((sum, c) => sum + c.formulas.length, 0);

  return (
    <div className="space-y-6">
      <div className="animate-float-up">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl" style={{ color: ACCENT }}>
          Maths Formula Sheet 🧮
        </h1>
        <p className="mt-1 text-sm text-muted-foreground md:text-base">
          Every NCERT Class 10 Maths formula in one place — {MATHS_FORMULAS.cats.length} categories · {totalFormulas} formulas · bookmark the tricky ones for last-minute revision
        </p>
      </div>

      {/* Category sections — no tabs needed since this is a single subject */}
      {MATHS_FORMULAS.cats.map((cat) => (
        <section key={cat.cat} className="space-y-3">
          <h3 className="flex items-center gap-2 text-base font-semibold md:text-lg border-b border-border pb-2">
            <span aria-hidden className="text-xl">
              {cat.icon}
            </span>
            <span style={{ color: ACCENT }}>{cat.cat}</span>
            <span className="ml-auto text-xs font-normal text-muted-foreground">
              {cat.formulas.length} formula{cat.formulas.length !== 1 ? "s" : ""}
            </span>
          </h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {cat.formulas.map((f) => (
              <FormulaCard key={f.title} f={f} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
