"use client";

import { useState } from "react";
import { ExternalLink, BookMarked, FileText, Landmark } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { NCERT_CLASS10_BOOKS, OFFICIAL_LINKS, type NcertBook } from "@/lib/ncert-resources";

const ACCENTS: Record<string, string> = {
  science: "#34d399",
  maths: "#60a5fa",
  history: "#fb923c",
  geography: "#22d3ee",
  civics: "#c084fc",
  economics: "#f472b6",
};

function BookCard({ book, index }: { book: NcertBook; index: number }) {
  const [open, setOpen] = useState(false);
  const accent = ACCENTS[book.id] ?? "var(--primary)";

  return (
    <Card
      className={`card-premium rounded-2xl p-0 overflow-hidden animate-rise stagger-${Math.min(index + 1, 7)}`}
      style={{ ["--sc" as string]: accent }}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <Badge variant="outline" className="border-subj text-subj mb-2 text-[11px]">
              {book.subject}
            </Badge>
            <h3 className="text-lg font-semibold leading-snug">{book.bookTitle}</h3>
            <p className="text-xs text-muted-foreground mt-1">
              {book.chapters.length} chapters · NCERT official
            </p>
          </div>
          <div
            className="size-10 shrink-0 rounded-xl grid place-items-center glow-ring"
            style={{ background: "color-mix(in oklch, var(--sc) 16%, transparent)" }}
          >
            <BookMarked className="size-5 text-subj" />
          </div>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="mt-4 text-sm font-medium text-subj tap-lift inline-flex items-center gap-1"
        >
          {open ? "Hide chapter list" : "View chapter list"}
          <ExternalLink className="size-3.5" />
        </button>

        {open && (
          <ol className="mt-3 space-y-1.5 animate-float-up">
            {book.chapters.map((ch) => (
              <li key={ch.no} className="flex items-baseline gap-2 text-sm">
                <span className="text-subj font-semibold w-5 shrink-0 text-right">{ch.no}.</span>
                <span className="text-foreground/90">{ch.title}</span>
              </li>
            ))}
          </ol>
        )}

        <a
          href={book.officialUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-subj bg-subj-dim py-2.5 text-sm font-medium tap-lift"
        >
          Open official NCERT textbook
          <ExternalLink className="size-3.5" />
        </a>
      </CardContent>
    </Card>
  );
}

export function NcertResourcesView() {
  return (
    <div className="space-y-6">
      <div className="page-header">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          NCERT Resources <span className="inline-block">📚</span>
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl">
          Every Class 10 CBSE textbook, straight from the source. Chapter lists match the current
          NCERT syllabus — tap through to the official portal for the free PDFs, since NCERT
          re-issues these periodically and we'd rather send you to the real thing than a stale copy.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {NCERT_CLASS10_BOOKS.map((book, i) => (
          <BookCard key={book.id} book={book} index={i} />
        ))}
      </div>

      <div>
        <h2 className="text-lg font-semibold flex items-center gap-2 mb-3">
          <Landmark className="size-4 text-primary" />
          Official portals &amp; previous-year papers
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {OFFICIAL_LINKS.map((link) => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="glass rounded-xl p-4 flex items-start gap-3 tap-lift glow-ring-hover"
            >
              <div className="size-9 shrink-0 rounded-lg bg-primary/15 grid place-items-center">
                <FileText className="size-4 text-primary" />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-medium flex items-center gap-1.5">
                  {link.label}
                  <ExternalLink className="size-3 text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{link.description}</p>
              </div>
            </a>
          ))}
        </div>
      </div>

      <p className="text-xs text-muted-foreground text-center pt-2">
        All links point to NCERT (ncert.nic.in / epathshala.nic.in) and CBSE (cbse.gov.in / cbseacademic.nic.in) — no third-party mirrors.
      </p>
    </div>
  );
}
