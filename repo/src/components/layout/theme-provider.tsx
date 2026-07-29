"use client";

import { useEffect } from "react";
import { useStudyStore } from "@/store/use-study-store";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useStudyStore((s) => s.theme);
  const textSize = useStudyStore((s) => s.textSize);
  const monochrome = useStudyStore((s) => s.monochrome);
  const autoTheme = useStudyStore((s) => s.autoTheme);
  const setTheme = useStudyStore((s) => s.setTheme);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", theme);
    root.setAttribute("data-text", textSize);
    if (monochrome) root.classList.add("mono-mode");
    else root.classList.remove("mono-mode");
  }, [theme, textSize, monochrome]);

  // Time-of-day auto-theme
  useEffect(() => {
    if (!autoTheme) return;
    const update = () => {
      const h = new Date().getHours();
      if (h >= 6 && h < 10) setTheme("daylight");
      else if (h >= 10 && h < 17) setTheme("daylight");
      else if (h >= 17 && h < 20) setTheme("sepia");
      else setTheme("midnight");
    };
    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, [autoTheme, setTheme]);

  // PWA service worker registration
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }, []);

  return <>{children}</>;
}
