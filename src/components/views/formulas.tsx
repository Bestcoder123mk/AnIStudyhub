"use client";

import { useStudyStore } from "@/store/use-study-store";
import { FORMULA_DATA, type FormulaCat, type FormulaItem, type Subject } from "@/lib/study-data";
import { getSubjMeta, useMounted } from "@/components/shared/helpers";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Star, Zap, FlaskConical, Dna } from "lucide-react";

type SubjKey = Subject;

const TAB_META: Record<SubjKey, { label: string; icon: typeof Zap; emoji: string }> = {
  phy: { label: "Physics", icon: Zap, emoji: "⚡" },
  chem: { label: "Chemistry", icon: FlaskConical, emoji: "🧪" },
  bio: { label: "Biology", icon: Dna, emoji: "🧬" },
};

function FormulaCard({ f, subj }: { f: FormulaItem; subj: Subject }) {
  const mounted = useMounted();
  const bookmarks = useStudyStore((s) => s.bookmarks);
  const addBookmark = useStudyStore((s) => s.addBookmark);
  const removeBookmark = useStudyStore((s) => s.removeBookmark);
  const isBookmarked = useStudyStore((s) => s.isBookmarked);
  const pushToast = useStudyStore((s) => s.pushToast);

  const isBm = mounted && isBookmarked("science", "formula", f.title);

  const toggleBm = () => {
    if (isBookmarked("science", "formula", f.title)) {
      const bm = bookmarks.find((b) => b.track === "science" && b.type === "formula" && b.refId === f.title);
      if (bm) {
        removeBookmark(bm.id);
        pushToast("☆", "Bookmark removed", "info");
      }
    } else {
      addBookmark({
        track: "science",
        type: "formula",
        refId: f.title,
        title: f.title,
        ch: 0,
        subj,
      });
      pushToast("⭐", `Bookmarked: ${f.title}`, "success");
    }
  };

  return (
    <Card className="glass relative gap-2 rounded-2xl p-4 py-4">
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
      <p className="whitespace-pre-wrap font-mono text-lg font-semibold leading-snug text-primary">
        {f.text}
      </p>
      {f.note ? (
        <p className="text-xs leading-relaxed text-muted-foreground">{f.note}</p>
      ) : null}
    </Card>
  );
}

function CategoryBlock({ cat, subj }: { cat: FormulaCat; subj: Subject }) {
  const meta = getSubjMeta(subj);
  return (
    <section className="space-y-3">
      <h3 className="flex items-center gap-2 text-base font-semibold md:text-lg">
        <span aria-hidden className="text-lg">
          {meta.emoji}
        </span>
        <span className="text-subj">{cat.cat}</span>
      </h3>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {cat.formulas.map((f) => (
          <FormulaCard key={f.title} f={f} subj={subj} />
        ))}
      </div>
    </section>
  );
}

export function FormulasView() {
  return (
    <div className="space-y-5">
      <div className="animate-float-up">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Formula Sheet 📐</h1>
        <p className="mt-1 text-sm text-muted-foreground md:text-base">
          Every NCERT Class 10 Science formula in one place — bookmark the tricky ones for last-minute revision
        </p>
      </div>

      <Tabs defaultValue="phy" className="gap-4">
        <TabsList className="h-9">
          {(Object.keys(TAB_META) as SubjKey[]).map((k) => {
            const m = TAB_META[k];
            const Icon = m.icon;
            return (
              <TabsTrigger key={k} value={k}>
                <Icon className="size-4" />
                {m.emoji} {m.label}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {(Object.keys(TAB_META) as SubjKey[]).map((k) => (
          <TabsContent key={k} value={k} className="space-y-6">
            {FORMULA_DATA[k].map((cat) => (
              <CategoryBlock key={cat.cat} cat={cat} subj={k} />
            ))}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
