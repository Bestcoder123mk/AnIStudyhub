"use client";

import { useEffect, useState } from "react";

// Subject metadata for color/icon/label
export const SUBJ_META: Record<string, { label: string; icon: string; emoji: string; cls: string }> = {
  chem: { label: "Chemistry", icon: "🧪", emoji: "🧪", cls: "subj-chem" },
  bio: { label: "Biology", icon: "🧬", emoji: "🧬", cls: "subj-bio" },
  phy: { label: "Physics", icon: "⚡", emoji: "⚡", cls: "subj-phy" },
  hist: { label: "History", icon: "🏛️", emoji: "🏛️", cls: "subj-hist" },
  geo: { label: "Geography", icon: "🌍", emoji: "🌍", cls: "subj-geo" },
  polsci: { label: "Pol. Science", icon: "⚖️", emoji: "⚖️", cls: "subj-polsci" },
  eco: { label: "Economics", icon: "💰", emoji: "💰", cls: "subj-eco" },
};

export function getSubjMeta(subj: string) {
  return SUBJ_META[subj] || { label: subj, icon: "📘", emoji: "📘", cls: "" };
}

// Difficulty badge styling
export function diffColor(diff: string): string {
  if (diff === "easy") return "text-emerald-400 bg-emerald-500/10 border-emerald-500/30";
  if (diff === "medium") return "text-amber-400 bg-amber-500/10 border-amber-500/30";
  return "text-rose-400 bg-rose-500/10 border-rose-500/30";
}

// Confetti burst
export function fireConfetti() {
  if (typeof document === "undefined") return;
  const colors = ["#fbbf24", "#34d399", "#60a5fa", "#c084fc", "#f472b6", "#22d3ee"];
  const container = document.createElement("div");
  container.style.cssText = "position:fixed;inset:0;pointer-events:none;z-index:9999;overflow:hidden";
  document.body.appendChild(container);
  for (let i = 0; i < 80; i++) {
    const p = document.createElement("div");
    const size = 6 + Math.random() * 8;
    p.style.cssText = `position:absolute;left:${Math.random() * 100}%;top:-10px;width:${size}px;height:${size * 0.6}px;background:${colors[i % colors.length]};border-radius:2px;animation:confetti-fall ${1.6 + Math.random() * 1.4}s ${Math.random() * 0.3}s ease-in forwards;transform-origin:center`;
    container.appendChild(p);
  }
  setTimeout(() => container.remove(), 3500);
}

// Hydration-safe hook
export function useMounted() {
  const [m, setM] = useState(false);
  useEffect(() => setM(true), []);
  return m;
}

// Format minutes as "Xh Ym"
export function fmtMins(mins: number): string {
  if (mins < 60) return `${mins}m`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}

// Days until exam
export function daysUntil(dateStr: string): number | null {
  if (!dateStr) return null;
  const target = new Date(dateStr + "T00:00:00");
  if (isNaN(target.getTime())) return null;
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - now.getTime()) / 86400000);
}
