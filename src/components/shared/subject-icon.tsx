"use client";

import { Atom, BookOpen, Landmark, Languages, Sigma, type LucideIcon } from "lucide-react";
import type { Track } from "@/store/use-study-store";

const ICONS: Record<Track, LucideIcon> = { science: Atom, ssc: Landmark, maths: Sigma, english: BookOpen, sanskrit: Languages };

/** A subject's line icon — used where emoji felt too casual (sidebar, home tiles). */
export function SubjectIcon({ track, className = "size-5" }: { track: Track; className?: string }) {
  const Icon = ICONS[track];
  return <Icon className={className} strokeWidth={2.1} aria-hidden />;
}
