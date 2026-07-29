"use client";
import { useStudyStore } from "@/store/use-study-store";
import { EXHIBITS } from "@/components/museum/exhibits/registry";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useMounted } from "@/components/shared/helpers";
import { useState } from "react";
import { BookMarked, Lock, Search } from "lucide-react";

export function CollectionsView() {
  const mounted = useMounted();
  const collections = useStudyStore((s) => s.collections);
  const setView = useStudyStore((s) => s.setView);
  const [filter, setFilter] = useState<"all" | "collected" | "missing">("all");

  if (!mounted) return null;

  const collected = EXHIBITS.filter((e) => collections.includes(e.id));
  const missing = EXHIBITS.filter((e) => !collections.includes(e.id));
  const shown = filter === "all" ? EXHIBITS : filter === "collected" ? collected : missing;
  const pct = Math.round((collected.length / EXHIBITS.length) * 100);

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Collections 📦</h1>
          <p className="text-sm text-muted-foreground mt-1">{collected.length} of {EXHIBITS.length} artifacts collected · {pct}% complete</p>
        </div>
        <Badge variant="secondary" className="gap-1"><BookMarked className="size-3" /> {pct}%</Badge>
      </header>

      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div className="h-full bg-gradient-to-r from-primary to-amber-400 transition-all" style={{ width: `${pct}%` }} />
      </div>

      <div className="flex gap-2">
        {(["all", "collected", "missing"] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1 rounded-lg text-xs font-medium transition ${filter === f ? "bg-primary text-primary-foreground" : "bg-muted/40 text-muted-foreground hover:bg-muted/60"}`}>
            {f === "all" ? `All (${EXHIBITS.length})` : f === "collected" ? `Collected (${collected.length})` : `Missing (${missing.length})`}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {shown.map((ex) => {
          const isCollected = collections.includes(ex.id);
          return (
            <Card key={ex.id} className={`rounded-2xl overflow-hidden transition-all ${isCollected ? "glass border-primary/30" : "opacity-50 border-border"}`}>
              <CardContent className="pt-4 pb-4 text-center">
                <div className="text-4xl mb-2" style={{ filter: isCollected ? "none" : "grayscale(1)" }}>{ex.icon}</div>
                <div className="text-xs font-semibold truncate" style={{ color: isCollected ? ex.accent : "#666" }}>{ex.title}</div>
                <div className="text-[9px] text-muted-foreground mt-0.5 truncate">{ex.subtitle}</div>
                {isCollected ? (
                  <Badge variant="secondary" className="mt-2 text-[9px] gap-1"><BookMarked className="size-2.5" /> Collected</Badge>
                ) : (
                  <div className="mt-2 flex items-center justify-center gap-1 text-[9px] text-muted-foreground"><Lock className="size-2.5" /> Visit in museum</div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="glass rounded-2xl">
        <CardContent className="pt-4 pb-4 text-center">
          <p className="text-xs text-muted-foreground mb-2">Visit exhibits in the 3D Museum to collect them</p>
          <button onClick={() => setView("museum")} className="text-sm font-semibold text-primary hover:underline">Enter Museum →</button>
        </CardContent>
      </Card>
    </div>
  );
}
