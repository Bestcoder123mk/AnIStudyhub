"use client";

import { useEffect } from "react";
import { useStudyStore } from "@/store/use-study-store";
import { readableTextColor } from "@/components/shared/helpers";
import { LiquidGlassDefs } from "@/components/layout/liquid-glass-defs";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useStudyStore((s) => s.theme);
  const textSize = useStudyStore((s) => s.textSize);
  const monochrome = useStudyStore((s) => s.monochrome);
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

  // Liquid Glass motion engine — one shared pointer listener + one shared
  // requestAnimationFrame loop for the whole app (see globals.css's
  // .glass-interactive block), per the liquid-glass-ui skill's explicit
  // performance guidance: lerp continuously-pointer-driven values in a
  // shared RAF loop rather than per-element listeners or CSS transitions
  // (which restart from scratch on every pointermove and stutter).
  // Two response speeds feed the two-layer specular highlight — a tight
  // hotspot that catches up fast (0.35) and a broader ambient glow that
  // deliberately lags (0.07) — plus a small pointer-driven 3D tilt. Skips
  // entirely under prefers-reduced-motion, leaving .glass-interactive's
  // plain static sheen as the resting look.
  //
  // On a mouse, "movement" is the pointer; on a phone there's no hover to
  // read, so the same tilt (trx/tryv) is instead driven by how the device
  // itself is held (deviceorientation) — the effect people actually mean
  // by "liquid glass reacts to phone tilt". The two sources never fight:
  // pointer-driven tilt only ever gets set for `pointerType !== "touch"`,
  // and device-tilt only ever runs on a touch-primary session.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    interface GlassState {
      hx: number; hy: number; thx: number; thy: number;
      hxs: number; hys: number;
      rx: number; ry: number; trx: number; tryv: number;
    }
    const state = new Map<HTMLElement, GlassState>();
    const MAX_TILT_DEG = 8; // conservative — real glass barely tips

    const stateFor = (el: HTMLElement): GlassState => {
      let s = state.get(el);
      if (!s) {
        s = { hx: 30, hy: 20, thx: 30, thy: 20, hxs: 35, hys: 30, rx: 0, ry: 0, trx: 0, tryv: 0 };
        state.set(el, s);
      }
      return s;
    };

    const onPointerMove = (e: PointerEvent) => {
      const target = (e.target as HTMLElement)?.closest?.(".glass-interactive") as HTMLElement | null;
      if (!target) return;
      const rect = target.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      const s = stateFor(target);
      s.thx = px * 100;
      s.thy = py * 100;
      if (e.pointerType !== "touch") {
        s.trx = (0.5 - py) * MAX_TILT_DEG;
        s.tryv = (px - 0.5) * MAX_TILT_DEG;
      }
    };
    const onPointerLeave = (e: PointerEvent) => {
      const target = (e.target as HTMLElement)?.closest?.(".glass-interactive") as HTMLElement | null;
      if (!target) return;
      const s = stateFor(target);
      s.trx = 0;
      s.tryv = 0;
    };

    document.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("pointerleave", onPointerLeave, true);

    // --- Device tilt (touch-primary sessions only) ---
    // A single global reading (a phone only has one gyroscope) applied to
    // every currently-mounted .glass-interactive element, not just ones
    // that have been touched — tilting the phone should read across
    // whatever glass is on screen, the same way pointer movement reads
    // across whatever's under the cursor on desktop. Elements are
    // rescanned on a cheap 500ms interval rather than a MutationObserver
    // or a per-frame querySelectorAll, so a newly-opened sheet/dialog
    // picks up the effect within half a second without adding real cost
    // to the 60fps tick() loop below; removed elements are already pruned
    // there via isConnected.
    let deviceTiltActive = false;
    const deviceTilt = { rx: 0, ry: 0 }; // smoothed, degrees, same scale as MAX_TILT_DEG
    let tiltEls: HTMLElement[] = [];
    let rescanTimer = 0;
    let cleanupOrientation: (() => void) | null = null;
    const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;

    if (isCoarsePointer) {
      const rescan = () => { tiltEls = Array.from(document.querySelectorAll<HTMLElement>(".glass-interactive")); };
      rescan();
      rescanTimer = window.setInterval(rescan, 500);

      // Baseline beta/gamma at the moment tilt starts, so the effect
      // reads relative to however the phone is already being held
      // (portrait, propped up, lying flat) rather than assuming 0° is
      // "flat on a desk", which would peg the tilt against one edge for
      // most real holding angles.
      let baseline: { beta: number; gamma: number } | null = null;
      const onOrientation = (e: DeviceOrientationEvent) => {
        if (e.beta == null || e.gamma == null) return;
        if (!baseline) baseline = { beta: e.beta, gamma: e.gamma };
        const db = e.beta - baseline.beta;   // front/back tilt
        const dg = e.gamma - baseline.gamma; // left/right tilt
        deviceTilt.rx = Math.max(-MAX_TILT_DEG, Math.min(MAX_TILT_DEG, -db * 0.4));
        deviceTilt.ry = Math.max(-MAX_TILT_DEG, Math.min(MAX_TILT_DEG, dg * 0.4));
        deviceTiltActive = true;
      };

      const requestableEvent = DeviceOrientationEvent as unknown as {
        requestPermission?: () => Promise<"granted" | "denied">;
      };
      if (typeof requestableEvent.requestPermission === "function") {
        // iOS requires a user gesture before it will grant this — ask on
        // the first touch anywhere, once, rather than blocking on load.
        let asked = false;
        const askOnce = () => {
          if (asked) return;
          asked = true;
          requestableEvent.requestPermission!()
            .then((result) => { if (result === "granted") window.addEventListener("deviceorientation", onOrientation); })
            .catch(() => {});
          window.removeEventListener("touchstart", askOnce);
        };
        window.addEventListener("touchstart", askOnce, { once: true, passive: true });
      } else {
        // Android and other engines expose it directly, no permission gate.
        window.addEventListener("deviceorientation", onOrientation);
      }

      cleanupOrientation = () => window.removeEventListener("deviceorientation", onOrientation);
    }

    let raf = 0;
    const tick = () => {
      state.forEach((s, el) => {
        // Prune elements no longer in the document (e.g. a Dialog's glass
        // buttons, unmounted on close) — otherwise this Map grows for the
        // life of the page as sheets/dialogs/menus open and close.
        if (!el.isConnected) {
          state.delete(el);
          return;
        }
        s.hx += (s.thx - s.hx) * 0.35;
        s.hy += (s.thy - s.hy) * 0.35;
        s.hxs += (s.thx - s.hxs) * 0.07;
        s.hys += (s.thy - s.hys) * 0.07;
        s.rx += (s.trx - s.rx) * 0.18;
        s.ry += (s.tryv - s.ry) * 0.18;
        el.style.setProperty("--hx", s.hx.toFixed(2) + "%");
        el.style.setProperty("--hy", s.hy.toFixed(2) + "%");
        el.style.setProperty("--hx-soft", s.hxs.toFixed(2) + "%");
        el.style.setProperty("--hy-soft", s.hys.toFixed(2) + "%");
        el.style.setProperty("--rx", s.rx.toFixed(2) + "deg");
        el.style.setProperty("--ry", s.ry.toFixed(2) + "deg");
      });
      if (deviceTiltActive) {
        for (const el of tiltEls) {
          if (!el.isConnected) continue;
          const s = stateFor(el);
          s.trx = deviceTilt.rx;
          s.tryv = deviceTilt.ry;
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      document.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerleave", onPointerLeave, true);
      if (rescanTimer) window.clearInterval(rescanTimer);
      if (cleanupOrientation) cleanupOrientation();
      cancelAnimationFrame(raf);
    };
  }, []);

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
