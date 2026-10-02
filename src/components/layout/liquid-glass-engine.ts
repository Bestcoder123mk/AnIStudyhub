/**
 * Liquid Glass input engine.
 *
 * Makes the glass in globals.css react to whatever the person is actually
 * doing — not just where the cursor is:
 *
 *   • POINTER / TOUCH  Tight specular hotspot + a laggier ambient glow follow
 *     the pointer (both on controls AND on plain glass surfaces, which used
 *     to be static). Controls also tip a few degrees toward the pointer.
 *   • PRESS            Controls squash on a real spring (they overshoot and
 *     settle when released, rather than easing back), tilt toward the exact
 *     touch point on phones, and throw a liquid ripple ring from the press
 *     point. The same happens for Enter/Space so keyboard users get the
 *     identical tactile response.
 *   • KEYBOARD         Focus-visible parks the glint on the focused control.
 *   • TYPING           Each keystroke in a field lights the glass around it
 *     and decays, so a text box feels like it is "catching" the input.
 *   • SCROLL           Scroll velocity drags the ambient glow and briefly
 *     lights visible surfaces, as if the material were sliding through a
 *     fixed light. Settles when the scroll stops.
 *   • DEVICE TILT      On phones, tilting the device moves the light across
 *     every glass surface on screen and tips the controls.
 *
 * Design rules (from the liquid-glass-ui skill, kept deliberately):
 *   - ONE shared requestAnimationFrame loop for the whole app, and it only
 *     runs while something is actually moving. At rest it is completely
 *     asleep — no idle cost, nothing competing with the 3D museum's canvas.
 *   - Continuously driven values are lerped/sprung in that loop instead of
 *     written raw or animated with CSS transitions (which restart on every
 *     pointermove and stutter). Lerps are frame-rate independent so a
 *     120 Hz display isn't twice as fast as a 60 Hz one.
 *   - Content stays calm: only controls (.glass-interactive) tilt or squash.
 *     Plain glass surfaces only ever have LIGHT move across them.
 *   - Big elements barely move: tilt and squash scale down for anything
 *     larger than ~220px, so a sidebar never wobbles like a button.
 *   - Everything here is progressive enhancement. The caller does not start
 *     the engine under prefers-reduced-motion, and every CSS rule that
 *     depends on it hangs off the `lg-dyn` class this adds to <html>.
 *
 * All values are written as CSS custom properties. globals.css registers
 * them with @property (inherits: false) so an update invalidates only the
 * glass element itself, not its whole subtree.
 */

export type GlassLevel = "subtle" | "full";

const CONTROL = ".glass-interactive";
const SURFACE = ".glass, .glass-strong, .glass-clear, .card-premium";
const ANY = `${CONTROL}, ${SURFACE}`;
const PRESSABLE = 'button, a[href], [role="button"], [role="tab"], [role="menuitem"], [role="option"], summary, label';
const EDITABLE = 'input, textarea, select, [contenteditable=""], [contenteditable="true"]';

/** Where each highlight rests when nothing is touching the glass (matches the
 *  defaults declared in globals.css). */
const HOME = { hx: 30, hy: 20, sx: 35, sy: 30 } as const;

const MAX_TILT = 8;        // degrees — real glass barely tips
const REF_SIZE = 220;      // px — controls larger than this move proportionally less
const PRESS_DEPTH = 0.05;  // 5% squash at full press on a reference-size control
const TILT_K = 200, TILT_C = 15;   // tilt spring (underdamped ≈ 0.53 → a little follow-through)
const PRESS_K = 520, PRESS_C = 22; // press spring (≈ 0.48 → visible overshoot on release)
const SNAPSHOT_MS = 300;
const MAX_TRACKED = 80;

const VARS = [
  "--hx", "--hy", "--hx-soft", "--hy-soft", "--rx", "--ry",
  "--lg-sc", "--lg-gl", "--lg-px", "--lg-py", "--lg-rr", "--lg-ra",
] as const;

interface G {
  el: HTMLElement;
  control: boolean;
  // Tight hotspot (fast) and ambient glow (slow), % of the element's box.
  hx: number; hy: number; thx: number; thy: number;
  sx: number; sy: number; tsx: number; tsy: number;
  // Tilt springs, degrees.
  rx: number; ry: number; vrx: number; vry: number; trx: number; tryv: number;
  // Press spring: 0 = rest, 1 = fully pressed (may overshoot below 0 on release).
  p: number; pv: number; pt: number;
  // "Light the glass is catching" 0..1 — follow-light intensity on surfaces.
  gl: number; tgl: number; typing: number;
  size: number;
  last: Record<string, string>;
}

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));
const near = (a: number, b: number, eps: number) => Math.abs(a - b) < eps;
const pct = (n: number) => clamp(n * 100, -15, 115);

export function startLiquidGlassEngine(level: GlassLevel): () => void {
  const root = document.documentElement;
  const full = level === "full";
  const A = full ? 1 : 0.5; // overall amplitude

  // Ripples animate a registered custom property via WAAPI — needs @property
  // support (Chromium, Safari 16.4+, Firefox 128+). Where it's missing the
  // ripple is simply skipped; every other reaction still works.
  const canRipple =
    full &&
    typeof CSS !== "undefined" &&
    typeof (CSS as unknown as { registerProperty?: unknown }).registerProperty === "function" &&
    typeof Element.prototype.animate === "function";

  const states = new Map<HTMLElement, G>();
  const active = new Set<G>();   // elements still moving — the only ones the loop touches
  const hover = new Set<G>();
  const pressed = new Set<G>();
  const ripples = new WeakMap<HTMLElement, Animation>();

  let visible: G[] = [];
  let snapAt = 0;
  let impulse = 0;               // smoothed scroll velocity, decays to 0
  let scrollWasActive = false;
  let raf = 0;
  let last = 0;

  // ---- element state ---------------------------------------------------------
  const makeG = (el: HTMLElement): G => ({
    el,
    control: el.matches(CONTROL),
    hx: HOME.hx, hy: HOME.hy, thx: HOME.hx, thy: HOME.hy,
    sx: HOME.sx, sy: HOME.sy, tsx: HOME.sx, tsy: HOME.sy,
    rx: 0, ry: 0, vrx: 0, vry: 0, trx: 0, tryv: 0,
    p: 0, pv: 0, pt: 0,
    gl: 0, tgl: 0, typing: 0,
    size: REF_SIZE,
    last: {},
  });

  const ensure = (el: HTMLElement, r?: DOMRect): G => {
    let g = states.get(el);
    if (!g) {
      g = makeG(el);
      states.set(el, g);
    }
    if (r) g.size = Math.max(r.width, r.height, 1);
    return g;
  };

  /** Tilt/squash scale: 1 for control-sized things, down to 0.12 for huge panels. */
  const kSize = (g: G) => clamp(REF_SIZE / g.size, 0.12, 1);

  const glassChain = (target: EventTarget | null, max: number): HTMLElement[] => {
    const out: HTMLElement[] = [];
    let el = target instanceof Element ? target : null;
    for (let i = 0; el && i < 10 && out.length < max; i++, el = el.parentElement) {
      if (!(el instanceof HTMLElement)) continue;
      // Anything at or under a [data-lg-static] root is left completely alone
      // (drag surfaces like the museum joystick shouldn't squash or tilt).
      if (el.hasAttribute("data-lg-static")) return [];
      if (el.matches(ANY)) out.push(el);
    }
    return out;
  };

  // ---- writing ---------------------------------------------------------------
  const write = (g: G) => {
    const s = g.el.style;
    const put = (name: string, v: string) => {
      if (g.last[name] !== v) {
        g.last[name] = v;
        s.setProperty(name, v);
      }
    };
    put("--hx", g.hx.toFixed(2) + "%");
    put("--hy", g.hy.toFixed(2) + "%");
    put("--hx-soft", g.sx.toFixed(2) + "%");
    put("--hy-soft", g.sy.toFixed(2) + "%");
    put("--lg-gl", clamp(g.gl + g.typing, 0, 1).toFixed(3));
    if (g.control) {
      put("--rx", g.rx.toFixed(2) + "deg");
      put("--ry", g.ry.toFixed(2) + "deg");
      put("--lg-sc", (1 - g.p * PRESS_DEPTH * kSize(g) * A).toFixed(4));
    }
  };

  const isSettled = (g: G) =>
    near(g.hx, g.thx, 0.05) && near(g.hy, g.thy, 0.05) &&
    near(g.sx, g.tsx, 0.05) && near(g.sy, g.tsy, 0.05) &&
    near(g.rx, g.trx, 0.02) && near(g.ry, g.tryv, 0.02) &&
    Math.abs(g.vrx) < 0.02 && Math.abs(g.vry) < 0.02 &&
    near(g.p, g.pt, 0.002) && Math.abs(g.pv) < 0.01 &&
    near(g.gl, g.tgl, 0.01) && g.typing < 0.01;

  // ---- the loop (asleep unless something is moving) --------------------------
  const wake = () => {
    if (!raf) {
      last = performance.now();
      raf = requestAnimationFrame(tick);
    }
  };
  const activate = (g: G) => {
    active.add(g);
    wake();
  };

  const tick = (t: number) => {
    raf = 0;
    const dt = clamp((t - last) / 1000, 0.001, 1 / 30);
    last = t;
    const lerp = (rate: number) => 1 - Math.pow(1 - rate, dt * 60);

    // Scroll shimmer: drag the ambient glow and light visible surfaces in
    // proportion to how fast the page is moving, then let it drain back out.
    impulse *= Math.pow(0.9, dt * 60);
    const scrolling = full && Math.abs(impulse) > 0.5;
    if (scrolling || scrollWasActive) {
      for (const g of visible) {
        if (!g.el.isConnected || hover.has(g)) continue;
        if (scrolling) {
          g.tgl = g.control ? 0 : Math.min(0.55, Math.abs(impulse) / 90);
          g.tsy = HOME.sy - impulse * 0.5;
          g.tsx = HOME.sx;
        } else {
          g.tgl = 0;
          g.tsy = HOME.sy;
          g.tsx = HOME.sx;
        }
        active.add(g);
      }
      scrollWasActive = scrolling;
    }

    active.forEach((g) => {
      // Elements can unmount mid-animation (dialogs, sheets, route changes).
      if (!g.el.isConnected) {
        active.delete(g);
        states.delete(g.el);
        hover.delete(g);
        pressed.delete(g);
        return;
      }
      g.hx += (g.thx - g.hx) * lerp(0.35);
      g.hy += (g.thy - g.hy) * lerp(0.35);
      g.sx += (g.tsx - g.sx) * lerp(0.07);
      g.sy += (g.tsy - g.sy) * lerp(0.07);
      g.gl += (g.tgl - g.gl) * lerp(0.14);
      g.typing *= Math.pow(0.9, dt * 60);

      if (g.control) {
        g.vrx += (TILT_K * (g.trx - g.rx) - TILT_C * g.vrx) * dt;
        g.vry += (TILT_K * (g.tryv - g.ry) - TILT_C * g.vry) * dt;
        g.rx += g.vrx * dt;
        g.ry += g.vry * dt;
        g.pv += (PRESS_K * (g.pt - g.p) - PRESS_C * g.pv) * dt;
        g.p += g.pv * dt;
      }

      write(g);
      if (isSettled(g)) {
        g.hx = g.thx; g.hy = g.thy; g.sx = g.tsx; g.sy = g.tsy;
        g.rx = g.trx; g.ry = g.tryv; g.vrx = 0; g.vry = 0;
        g.p = g.pt; g.pv = 0; g.gl = g.tgl; g.typing = 0;
        write(g);
        active.delete(g);
      }
    });

    if (active.size > 0 || Math.abs(impulse) > 0.5 || scrollWasActive) {
      raf = requestAnimationFrame(tick);
    }
  };

  // ---- visible-element snapshot (used by scroll shimmer + device tilt) -------
  // A cheap periodic query beats a MutationObserver here: it only runs during a
  // scroll/tilt burst, at most every 300ms, and never during plain pointer use.
  const snapshot = () => {
    const now = performance.now();
    if (now - snapAt < SNAPSHOT_MS) return;
    snapAt = now;
    const vw = window.innerWidth, vh = window.innerHeight;
    const list: G[] = [];
    for (const el of document.querySelectorAll<HTMLElement>(ANY)) {
      if (list.length >= MAX_TRACKED) break;
      const r = el.getBoundingClientRect();
      if (r.width < 4 || r.height < 4 || r.bottom < -80 || r.top > vh + 80 || r.right < -80 || r.left > vw + 80) continue;
      list.push(ensure(el, r));
    }
    visible = list;
    for (const [el, g] of states) {
      if (!el.isConnected) {
        states.delete(el);
        active.delete(g);
        hover.delete(g);
        pressed.delete(g);
      }
    }
  };

  // ---- pointer ---------------------------------------------------------------
  const aim = (g: G, r: DOMRect, x: number, y: number, touch: boolean) => {
    const px = (x - r.left) / r.width;
    const py = (y - r.top) / r.height;
    g.thx = pct(px);
    g.thy = pct(py);
    g.tsx = g.thx;
    g.tsy = g.thy;
    // Controls already have hotspot layers of their own; plain surfaces get a
    // follow-light instead.
    g.tgl = g.control ? 0 : A;
    if (g.control && !touch) {
      const k = kSize(g) * A;
      g.trx = (0.5 - py) * MAX_TILT * k;
      g.tryv = (px - 0.5) * MAX_TILT * k;
    }
    activate(g);
  };

  const release = (g: G) => {
    g.trx = 0;
    g.tryv = 0;
    g.tgl = 0;
    activate(g);
  };

  const releaseHover = () => {
    hover.forEach(release);
    hover.clear();
  };

  const onPointerMove = (e: PointerEvent) => {
    const chain = glassChain(e.target, 3);
    if (chain.length === 0 && hover.size === 0) return;
    const touch = e.pointerType === "touch";
    const now = new Set<G>();
    for (const el of chain) {
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) continue;
      const g = ensure(el, r);
      now.add(g);
      aim(g, r, e.clientX, e.clientY, touch);
    }
    hover.forEach((g) => { if (!now.has(g)) release(g); });
    hover.clear();
    now.forEach((g) => hover.add(g));
  };

  // ---- press + ripple --------------------------------------------------------
  const ripple = (g: G, r: DOMRect, x: number, y: number) => {
    const el = g.el;
    const lx = x - r.left, ly = y - r.top;
    const far = Math.hypot(Math.max(lx, r.width - lx), Math.max(ly, r.height - ly));
    el.style.setProperty("--lg-px", ((lx / r.width) * 100).toFixed(1) + "%");
    el.style.setProperty("--lg-py", ((ly / r.height) * 100).toFixed(1) + "%");
    el.style.setProperty("--lg-rr", Math.min(far, 300).toFixed(0) + "px");
    // Big panels get a fainter ring so a click in the sidebar isn't a flash.
    el.style.setProperty("--lg-ra", (0.2 + 0.32 * kSize(g)).toFixed(2));
    ripples.get(el)?.cancel();
    try {
      el.classList.add("lg-rippling");
      const a = el.animate({ "--lg-rp": ["0", "1"] }, { duration: 650, easing: "cubic-bezier(0.16, 1, 0.3, 1)" });
      ripples.set(el, a);
      a.onfinish = a.oncancel = () => {
        if (ripples.get(el) === a) ripples.delete(el);
        el.classList.remove("lg-rippling");
      };
    } catch {
      el.classList.remove("lg-rippling");
      /* engines that can't animate custom properties just skip the ripple */
    }
  };

  const press = (g: G, r: DOMRect, x: number, y: number, touch: boolean) => {
    if (g.control) {
      g.pt = 1;
      pressed.add(g);
      if (touch) {
        // No hover on a phone, so tip the control toward the exact touch point.
        const px = (x - r.left) / r.width, py = (y - r.top) / r.height;
        const k = kSize(g) * A * 1.4;
        g.trx = (0.5 - py) * MAX_TILT * k;
        g.tryv = (px - 0.5) * MAX_TILT * k;
      }
    } else {
      g.typing = Math.min(1, g.typing + 0.6 * A); // a flash of light on a pressed card
    }
    g.thx = pct((x - r.left) / r.width);
    g.thy = pct((y - r.top) / r.height);
    if (canRipple) ripple(g, r, x, y);
    activate(g);
  };

  const releasePresses = (touch: boolean) => {
    pressed.forEach((g) => {
      g.pt = 0;
      if (touch) { g.trx = 0; g.tryv = 0; }
      activate(g);
    });
    pressed.clear();
  };

  const onPointerDown = (e: PointerEvent) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    const target = e.target instanceof Element ? e.target : null;
    if (!target || target.closest(EDITABLE)) return;
    const chain = glassChain(target, 4);
    if (chain.length === 0) return;
    const hit = target.closest(PRESSABLE);
    // The nearest glass ancestor that is actually something you press.
    const primary = chain.find(
      (el) => el.matches(CONTROL) || (hit && el.contains(hit)) || getComputedStyle(el).cursor === "pointer"
    );
    if (!primary) return;
    const r = primary.getBoundingClientRect();
    if (!r.width || !r.height) return;
    press(ensure(primary, r), r, e.clientX, e.clientY, e.pointerType === "touch");
  };

  const onPointerUp = (e: PointerEvent) => {
    releasePresses(e.pointerType === "touch");
    if (e.pointerType === "touch") releaseHover(); // touch has no "leave"
  };

  // The pointer left the window entirely.
  const onPointerOut = (e: PointerEvent) => {
    if (!e.relatedTarget) releaseHover();
  };

  // ---- keyboard --------------------------------------------------------------
  const onKeyDown = (e: KeyboardEvent) => {
    const t = e.target instanceof HTMLElement ? e.target : null;
    if (!t) return;

    if (t.matches(EDITABLE)) {
      // TYPING: light the glass around the field on each keystroke.
      if (!full || e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key.length !== 1 && e.key !== "Backspace" && e.key !== "Enter") return;
      const chain = glassChain(t, 2);
      if (chain.length === 0) return;
      const tr = t.getBoundingClientRect();
      for (const el of chain) {
        const r = el.getBoundingClientRect();
        if (!r.width || !r.height) continue;
        const g = ensure(el, r);
        g.thx = pct((tr.left + tr.width / 2 - r.left) / r.width);
        g.thy = pct((tr.top + tr.height / 2 - r.top) / r.height);
        g.tsx = g.thx;
        g.tsy = g.thy;
        g.typing = Math.min(1, g.typing + 0.5);
        activate(g);
      }
      return;
    }

    // KEYBOARD PRESS: Enter/Space on a glass control feels like a click.
    if ((e.key === "Enter" || e.key === " ") && !e.repeat) {
      const primary = glassChain(t, 3).find((el) => el.matches(CONTROL));
      if (!primary) return;
      const r = primary.getBoundingClientRect();
      if (!r.width || !r.height) return;
      press(ensure(primary, r), r, r.left + r.width / 2, r.top + r.height / 2, false);
    }
  };

  const onKeyUp = () => releasePresses(false);

  const onFocusIn = (e: FocusEvent) => {
    const t = e.target instanceof HTMLElement ? e.target : null;
    if (!t) return;
    let visibleFocus = false;
    try { visibleFocus = t.matches(":focus-visible"); } catch { visibleFocus = false; }
    if (!visibleFocus) return;
    for (const el of glassChain(t, 2)) {
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) continue;
      const g = ensure(el, r);
      g.thx = 50; g.thy = 28; g.tsx = 50; g.tsy = 34;
      if (!g.control) g.tgl = 0.6 * A;
      activate(g);
    }
  };

  const onFocusOut = (e: FocusEvent) => {
    const t = e.target instanceof HTMLElement ? e.target : null;
    if (!t) return;
    for (const el of glassChain(t, 2)) {
      const g = states.get(el);
      if (g && !hover.has(g)) { g.tgl = 0; activate(g); }
    }
  };

  // ---- scroll ----------------------------------------------------------------
  const lastTop = new WeakMap<object, number>();
  const onScroll = (e: Event) => {
    if (!full) return;
    const t = e.target;
    const top = t instanceof Element ? t.scrollTop : (document.scrollingElement?.scrollTop ?? window.scrollY);
    const key: object = t instanceof Element ? t : document;
    const prev = lastTop.get(key);
    lastTop.set(key, top);
    if (prev === undefined) return;
    const d = top - prev;
    if (!d) return;
    impulse = clamp(impulse + d * 0.35, -60, 60);
    snapshot();
    wake();
  };

  // ---- device tilt (touch-primary sessions) ----------------------------------
  const isCoarse = window.matchMedia("(pointer: coarse)").matches;
  const tilt = { rx: 0, ry: 0 };
  let lastApplied = { rx: 999, ry: 999 };
  let baseline: { beta: number; gamma: number } | null = null;

  const applyTilt = () => {
    if (Math.abs(tilt.rx - lastApplied.rx) < 0.25 && Math.abs(tilt.ry - lastApplied.ry) < 0.25) return;
    lastApplied = { rx: tilt.rx, ry: tilt.ry };
    snapshot();
    const lx = clamp(tilt.ry / MAX_TILT, -1, 1);
    const ly = clamp(-tilt.rx / MAX_TILT, -1, 1);
    for (const g of visible) {
      if (!g.el.isConnected || hover.has(g) || pressed.has(g)) continue;
      if (g.control) {
        const k = kSize(g) * A;
        g.trx = tilt.rx * k;
        g.tryv = tilt.ry * k;
      }
      g.tsx = 50 + lx * 30 * A;
      g.tsy = 40 + ly * 30 * A;
      g.tgl = g.control ? 0 : 0.4 * A;
      active.add(g);
    }
    wake();
  };

  const onOrientation = (e: DeviceOrientationEvent) => {
    if (e.beta == null || e.gamma == null) return;
    // Read tilt relative to however the phone is already being held.
    if (!baseline) baseline = { beta: e.beta, gamma: e.gamma };
    tilt.rx = clamp(-(e.beta - baseline.beta) * 0.4, -MAX_TILT, MAX_TILT);
    tilt.ry = clamp((e.gamma - baseline.gamma) * 0.4, -MAX_TILT, MAX_TILT);
    applyTilt();
  };

  let askOnce: (() => void) | null = null;
  if (isCoarse && typeof DeviceOrientationEvent !== "undefined") {
    const requestable = DeviceOrientationEvent as unknown as {
      requestPermission?: () => Promise<"granted" | "denied">;
    };
    if (typeof requestable.requestPermission === "function") {
      // iOS needs a user gesture before it will grant this — ask once, on the
      // first touch, rather than blocking on load.
      askOnce = () => {
        askOnce = null;
        requestable.requestPermission!()
          .then((result) => { if (result === "granted") window.addEventListener("deviceorientation", onOrientation); })
          .catch(() => {});
      };
      window.addEventListener("touchstart", askOnce, { once: true, passive: true });
    } else {
      window.addEventListener("deviceorientation", onOrientation);
    }
  }

  // ---- wire up ---------------------------------------------------------------
  root.classList.add("lg-dyn");
  document.addEventListener("pointermove", onPointerMove, { passive: true });
  document.addEventListener("pointerdown", onPointerDown, { passive: true });
  document.addEventListener("pointerup", onPointerUp, { passive: true });
  document.addEventListener("pointercancel", onPointerUp, { passive: true });
  document.addEventListener("pointerout", onPointerOut, { passive: true });
  document.addEventListener("keydown", onKeyDown);
  document.addEventListener("keyup", onKeyUp);
  document.addEventListener("focusin", onFocusIn);
  document.addEventListener("focusout", onFocusOut);
  document.addEventListener("scroll", onScroll, { capture: true, passive: true });
  window.addEventListener("blur", releaseHover);

  return () => {
    document.removeEventListener("pointermove", onPointerMove);
    document.removeEventListener("pointerdown", onPointerDown);
    document.removeEventListener("pointerup", onPointerUp);
    document.removeEventListener("pointercancel", onPointerUp);
    document.removeEventListener("pointerout", onPointerOut);
    document.removeEventListener("keydown", onKeyDown);
    document.removeEventListener("keyup", onKeyUp);
    document.removeEventListener("focusin", onFocusIn);
    document.removeEventListener("focusout", onFocusOut);
    document.removeEventListener("scroll", onScroll, { capture: true });
    window.removeEventListener("blur", releaseHover);
    window.removeEventListener("deviceorientation", onOrientation);
    if (askOnce) window.removeEventListener("touchstart", askOnce);
    if (raf) cancelAnimationFrame(raf);
    // Hand every element back to the plain static material.
    states.forEach((g) => {
      ripples.get(g.el)?.cancel();
      g.el.classList.remove("lg-rippling");
      for (const v of VARS) g.el.style.removeProperty(v);
    });
    states.clear();
    active.clear();
    hover.clear();
    pressed.clear();
    root.classList.remove("lg-dyn");
  };
}
