"use client";

import { useEffect } from "react";
import { useStudyStore } from "@/store/use-study-store";
import { readableTextColor } from "@/components/shared/helpers";
import { LiquidGlassDefs } from "@/components/layout/liquid-glass-defs";
import { startLiquidGlassEngine } from "@/components/layout/liquid-glass-engine";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useStudyStore((s) => s.theme);
  const textSize = useStudyStore((s) => s.textSize);
  const monochrome = useStudyStore((s) => s.monochrome);
  const glassDynamics = useStudyStore((s) => s.glassDynamics);
  const autoTheme = useStudyStore((s) => s.autoTheme);
  const setTheme = useStudyStore((s) => s.setTheme);
  const accentColor = useStudyStore((s) => s.accentColor);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", theme);
    root.setAttribute("data-text", textSize);
    if (monochrome) root.classList.add("mono-mode");
    else root.classList.remove("mono-mode");
    // User-customizable accent — read by --primary/--ring/--sidebar-primary/
    // glow in the midnight & daylight theme blocks in globals.css. Setting it
    // here (rather than baking it into a theme block) is what lets "pure
    // black/white, any accent colour" be one control instead of N themes.
    root.style.setProperty("--user-accent", accentColor);
    root.style.setProperty("--user-accent-fg", readableTextColor(accentColor));
  }, [theme, textSize, monochrome, accentColor]);

  // Liquid Glass input engine — see liquid-glass-engine.ts for the full
  // rundown (pointer, press/ripple, keyboard, typing, scroll, device tilt).
  // One shared engine for the whole app, gated two ways:
  //   - prefers-reduced-motion always wins, regardless of the setting below.
  //   - glassDynamics (Settings → Appearance) lets a person turn it down to
  //     a light touch or off entirely, independent of motion elsewhere in
  //     the app — someone can keep quiz/level-up animations and still want
  //     the chrome itself to hold still.
  // "off" (or reduced-motion) leaves .glass-interactive's plain static
  // sheen — the resting look this always had — with zero listeners
  // attached, not just the effect toned down to nothing.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (glassDynamics === "off") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    return startLiquidGlassEngine(glassDynamics);
  }, [glassDynamics]);

  // Tier B liquid-glass: real edge lensing via an SVG feDisplacementMap
  // (globals.css's .glass-refract-sm/-md/-lg, defs in LiquidGlassDefs
  // below), gated to Chromium — the only engine that currently resolves
  // an SVG filter reference through `backdrop-filter`. Safari/Firefox
  // parse the declaration fine, they just never render the distortion,
  // so this needs an explicit runtime check rather than relying on the
  // cascade to "fall back" on its own. Re-verify this UA list
  // periodically — it's exactly the kind of narrow support gap that
  // closes as engines catch up, per the liquid-glass-ui skill.
  //
  // Also excludes touch-primary devices even when they are Chromium
  // (Chrome on Android matches the UA test above): the engine can resolve
  // the filter, but an SVG feDisplacementMap is a genuinely expensive
  // per-pixel effect, and phone GPUs feel that far more than desktop
  // ones do — this was very likely a real contributor to "mobile feels
  // clanky", stacked on top of Tier A's own backdrop-filter cost. Tier A
  // (globals.css's plain blur, already reduced under `pointer: coarse`)
  // is what touch devices get instead, same as Safari/Firefox.
  useEffect(() => {
    const supportsSvgBackdropFilter = () => {
      if (typeof CSS === "undefined" || !CSS.supports?.("backdrop-filter", "blur(1px)")) return false;
      if (window.matchMedia("(pointer: coarse)").matches) return false;
      const ua = navigator.userAgent;
      return /Chrome|Chromium|Edg|Arc|Brave/.test(ua) && !/Firefox/.test(ua);
    };
    document.documentElement.classList.toggle("supports-glass-refraction", supportsSvgBackdropFilter());
  }, []);

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

  // PWA service worker registration. Auto-updates: sw.js calls
  // skipWaiting()/clients.claim() so a new worker takes control as soon as
  // it's installed, and this reloads the page exactly once when that
  // happens — otherwise a returning user could get served stale, cached
  // HTML/JS indefinitely with no way back short of manually clearing site
  // data (the old failure mode here — see sw.js for the caching strategy
  // itself).
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    let refreshing = false;
    const onControllerChange = () => {
      if (refreshing) return;
      refreshing = true;
      window.location.reload();
    };
    navigator.serviceWorker.addEventListener("controllerchange", onControllerChange);
    navigator.serviceWorker.register("/sw.js").catch(() => {});
    return () => navigator.serviceWorker.removeEventListener("controllerchange", onControllerChange);
  }, []);

  return (
    <>
      <LiquidGlassDefs />
      {children}
    </>
  );
}
