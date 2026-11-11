"use client";

import { useEffect, useRef } from "react";

let lastG = 0; // the app's global shortcuts are "g then <letter>" — don't treat that letter as an answer

/** Keyboard for practice screens: 1–4 (or A–D) selects, pressing the same key again — or Enter — checks, and
 *  Enter / Space then continues. Never double-fires a focused "Next" button. */
export function useQuizKeys(o: { answered: boolean; optionCount: number; picked: number | null; onPick: (i: number) => void; onCheck: () => void; onNext: () => void }) {
  const ref = useRef(o);
  ref.current = o;
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || e.repeat) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.matches("input, textarea, select") || t.isContentEditable)) return;
      const k = e.key.toLowerCase();
      if (k === "g") { lastG = Date.now(); return; }
      const r = ref.current;
      const onChoice = !!t?.classList?.contains("choice");
      const onOtherControl = !onChoice && !!t?.closest("button, a, [role=button]");
      if (!r.answered) {
        let idx = "1234".indexOf(k);
        if (idx < 0 && Date.now() - lastG > 1500) idx = "abcd".indexOf(k);
        if (k.length === 1 && idx >= 0 && idx < r.optionCount) { e.preventDefault(); idx === r.picked ? r.onCheck() : r.onPick(idx); }
        else if ((k === "enter" || k === " ") && r.picked !== null && !onOtherControl) { e.preventDefault(); r.onCheck(); }
      } else if ((k === "enter" || k === " ") && !onOtherControl) {
        e.preventDefault();
        r.onNext();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
}
