"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useStudyStore, SUBJECT_META, type Track } from "@/store/use-study-store";
import { useMounted } from "@/components/shared/helpers";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  FlaskConical, Lightbulb, Beaker, Network, ExternalLink,
  Play, Pause, RotateCcw, Gauge, Activity, CircuitBoard, Leaf,
} from "lucide-react";

/* ---------- helpers ---------- */

function phColor(ph: number): string {
  // 0 strong acid -> red, 7 neutral -> green, 14 strong base -> violet
  if (ph <= 7) {
    const t = ph / 7; // 0 -> red, 1 -> green
    const r = Math.round(220 - 200 * t);
    const g = Math.round(60 + 160 * t);
    const b = Math.round(60 - 50 * t);
    return `rgb(${r}, ${g}, ${b})`;
  }
  const t = (ph - 7) / 7; // 0 -> green, 1 -> violet
  const r = Math.round(20 + 130 * t);
  const g = Math.round(220 - 180 * t);
  const b = Math.round(10 + 200 * t);
  return `rgb(${r}, ${g}, ${b})`;
}

const PH_BAND: { range: [number, number]; label: string; items: string[] }[] = [
  { range: [0, 1], label: "Strong acid", items: ["Battery acid", "HCl (1M)"] },
  { range: [2, 3], label: "Acidic", items: ["Lemon juice", "Vinegar", "Soda"] },
  { range: [4, 5], label: "Weak acid", items: ["Black coffee", "Tomato", "Banana"] },
  { range: [6, 7], label: "Near neutral", items: ["Milk", "Pure water", "Saliva"] },
  { range: [8, 9], label: "Weak base", items: ["Sea water", "Baking soda", "Egg white"] },
  { range: [10, 11], label: "Basic", items: ["Milk of magnesia", "Ammonia"] },
  { range: [12, 14], label: "Strong base", items: ["Soapy water", "Bleach", "Caustic soda"] },
];

function phBand(ph: number) {
  return PH_BAND.find((b) => ph >= b.range[0] && ph <= b.range[1]) ?? PH_BAND[3];
}

/* ---------- Simulation Card wrapper ---------- */

function SimCard({
  icon, title, desc, chapter, children, accent,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  chapter: string;
  children: React.ReactNode;
  accent: string;
}) {
  const setView = useStudyStore((s) => s.setView);
  const pushToast = useStudyStore((s) => s.pushToast);
  const track = useStudyStore((s) => s.track);
  const onLearnMore = () => {
    pushToast("📖", `Opening chapters — relevant topic: ${chapter}`, "info");
    setView(SUBJECT_META[track].dash === "dash" ? "chapters" : "ssc-chapters");
  };
  return (
    <Card className="glass overflow-hidden flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <div
            className="size-10 shrink-0 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${accent}22`, color: accent }}
          >
            {icon}
          </div>
          <div className="min-w-0 flex-1">
            <CardTitle className="text-lg leading-tight">{title}</CardTitle>
            <CardDescription className="mt-0.5">{desc}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-3">{children}</CardContent>
      <CardFooter className="pt-0">
        <Button variant="ghost" size="sm" className="ml-auto text-muted-foreground" onClick={onLearnMore}>
          <ExternalLink className="size-3.5 mr-1.5" /> Learn more · {chapter}
        </Button>
      </CardFooter>
    </Card>
  );
}

/* ---------- 1. pH Meter ---------- */

function PhMeter() {
  const [ph, setPh] = useState(7);
  const color = phColor(ph);
  const band = phBand(ph);
  const acidity = ph < 6.5 ? "Acidic" : ph > 7.5 ? "Basic" : "Neutral";

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-4">
        <div
          className="size-16 rounded-2xl shrink-0 border-2 border-white/20 shadow-inner transition-colors duration-200"
          style={{ backgroundColor: color }}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold tabular-nums" style={{ color }}>{ph.toFixed(1)}</span>
            <span className="text-sm text-muted-foreground">pH</span>
          </div>
          <Badge variant="outline" className="mt-1" style={{ color, borderColor: `${color}66` }}>
            {acidity}
          </Badge>
        </div>
      </div>
      <Slider value={[ph]} min={0} max={14} step={0.1} onValueChange={(v) => setPh(v[0])} />
      <div className="flex justify-between text-[10px] text-muted-foreground">
        <span>0 Acid</span><span>7 Neutral</span><span>14 Base</span>
      </div>
      <Separator />
      <div className="text-xs">
        <div className="font-medium mb-1">{band.label} — common substances</div>
        <div className="flex flex-wrap gap-1.5">
          {band.items.map((it) => (
            <span key={it} className="px-2 py-0.5 rounded-md text-xs bg-muted border">{it}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- 2. Pendulum ---------- */

function Pendulum() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [length, setLength] = useState(1.5); // meters
  const [playing, setPlaying] = useState(true);
  const angleRef = useRef(0);
  const tRef = useRef(0);
  const playRef = useRef(playing);
  playRef.current = playing;

  const g = 9.81;
  const period = 2 * Math.PI * Math.sqrt(length / g); // seconds

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    // pivot
    const px = w / 2;
    const py = 30;
    // scale length to canvas (max 1.5m -> ~180px)
    const pxLen = Math.min(h - 60, 40 + length * 90);

    if (playRef.current) {
      tRef.current += 0.016;
      angleRef.current = 0.5 * Math.cos((2 * Math.PI / period) * tRef.current);
    }
    const a = angleRef.current;
    const bx = px + Math.sin(a) * pxLen;
    const by = py + Math.cos(a) * pxLen;

    // pivot block
    ctx.fillStyle = "#94a3b8";
    ctx.fillRect(px - 30, py - 14, 60, 10);

    // string
    ctx.strokeStyle = "#cbd5e1";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.lineTo(bx, by);
    ctx.stroke();

    // arc trail
    ctx.strokeStyle = "rgba(167,139,250,0.25)";
    ctx.beginPath();
    ctx.arc(px, py, pxLen, Math.PI / 2 - 0.5, Math.PI / 2 + 0.5);
    ctx.stroke();

    // bob
    ctx.fillStyle = "#a78bfa";
    ctx.beginPath();
    ctx.arc(bx, by, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#c4b5fd";
    ctx.stroke();
  }, [length, period]);

  useEffect(() => {
    let raf: number;
    const loop = () => { draw(); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [draw]);

  // resize canvas to its client size on mount
  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ro = new ResizeObserver(() => {
      const rect = c.getBoundingClientRect();
      c.width = Math.max(220, Math.floor(rect.width));
      c.height = 240;
    });
    ro.observe(c);
    return () => ro.disconnect();
  }, []);

  return (
    <div className="space-y-2">
      <canvas ref={canvasRef} className="w-full rounded-lg bg-muted/40 border" height={240} />
      <div className="flex items-center gap-2">
        <Button size="sm" variant="outline" onClick={() => setPlaying((p) => !p)}>
          {playing ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
          {playing ? "Pause" : "Play"}
        </Button>
        <Button size="sm" variant="ghost" onClick={() => { tRef.current = 0; angleRef.current = 0; }}>
          <RotateCcw className="size-3.5" /> Reset
        </Button>
      </div>
      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">String length</span>
          <span className="font-medium tabular-nums">{length.toFixed(2)} m</span>
        </div>
        <Slider value={[length]} min={0.3} max={3} step={0.05} onValueChange={(v) => setLength(v[0])} />
      </div>
      <div className="grid grid-cols-2 gap-2 text-center">
        <div className="rounded-lg bg-muted/40 p-2">
          <div className="text-[10px] text-muted-foreground">Period T = 2π√(L/g)</div>
          <div className="text-lg font-bold tabular-nums text-violet-400">{period.toFixed(2)} s</div>
        </div>
        <div className="rounded-lg bg-muted/40 p-2">
          <div className="text-[10px] text-muted-foreground">Frequency</div>
          <div className="text-lg font-bold tabular-nums text-violet-400">{(1 / period).toFixed(2)} Hz</div>
        </div>
      </div>
    </div>
  );
}

/* ---------- 3. Circuit Builder ---------- */

function CircuitBuilder() {
  const RESISTORS = [
    { id: "r1", label: "R₁", value: 10 },
    { id: "r2", label: "R₂", value: 20 },
    { id: "r3", label: "R₃", value: 30 },
  ];
  const [on, setOn] = useState([true, true, false]);
  const [mode, setMode] = useState<"series" | "parallel">("series");

  const active = RESISTORS.filter((_, i) => on[i]);
  let total = 0;
  if (active.length === 0) total = 0;
  else if (mode === "series") total = active.reduce((s, r) => s + r.value, 0);
  else total = 1 / active.reduce((s, r) => s + 1 / r.value, 0);

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        {(["series", "parallel"] as const).map((m) => (
          <Button
            key={m}
            size="sm"
            variant={mode === m ? "default" : "outline"}
            className="flex-1 capitalize"
            onClick={() => setMode(m)}
          >
            {m}
          </Button>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-2">
        {RESISTORS.map((r, i) => (
          <button
            key={r.id}
            onClick={() => setOn((o) => o.map((v, idx) => (idx === i ? !v : v)))}
            className={`rounded-lg border p-2 text-center transition-all ${
              on[i] ? "border-emerald-500/50 bg-emerald-500/10" : "border-border bg-muted/30 opacity-50"
            }`}
          >
            <div className="text-xs text-muted-foreground">{r.label}</div>
            <div className="text-sm font-bold tabular-nums">{r.value}Ω</div>
            <div className="text-[10px] mt-0.5">{on[i] ? "ON" : "OFF"}</div>
          </button>
        ))}
      </div>
      {/* schematic */}
      <svg viewBox="0 0 240 80" className="w-full h-20">
        {/* battery */}
        <line x1="10" y1="40" x2="20" y2="30" stroke="currentColor" strokeWidth="2" />
        <line x1="20" y1="50" x2="10" y2="40" stroke="currentColor" strokeWidth="2" />
        <line x1="20" y1="30" x2="20" y2="50" stroke="currentColor" strokeWidth="1" />
        {/* top wire */}
        <line x1="20" y1="30" x2="220" y2="30" stroke="currentColor" strokeWidth="1.5" />
        {/* bottom wire */}
        <line x1="20" y1="50" x2="220" y2="50" stroke="currentColor" strokeWidth="1.5" />
        <line x1="220" y1="30" x2="220" y2="50" stroke="currentColor" strokeWidth="1.5" />
        {/* resistors */}
        {RESISTORS.map((r, i) =>
          on[i] ? (
            <g key={r.id} transform={`translate(${50 + i * 60}, 22)`}>
              <rect width="40" height="16" fill="none" stroke="#34d399" strokeWidth="1.5" />
              <text x="20" y="11" textAnchor="middle" fontSize="9" fill="#34d399">{r.value}Ω</text>
            </g>
          ) : (
            <g key={r.id} transform={`translate(${50 + i * 60}, 22)`}>
              <line x1="0" y1="8" x2="40" y2="8" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
            </g>
          )
        )}
      </svg>
      <div className="rounded-lg bg-violet-500/10 border border-violet-500/30 p-3 text-center">
        <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Total Resistance</div>
        <div className="text-2xl font-bold tabular-nums text-violet-300">
          {total < 0.01 ? "—" : `${total.toFixed(2)} Ω`}
        </div>
        <div className="text-[10px] text-muted-foreground mt-0.5">
          {mode === "series" ? "R = R₁ + R₂ + R₃" : "1/R = 1/R₁ + 1/R₂ + 1/R₃"}
        </div>
      </div>
    </div>
  );
}

/* ---------- 4. Lens Ray Diagram ---------- */

function LensDiagram() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [objDist, setObjDist] = useState(150); // pixels from lens, > 0 means real object side
  const f = 90; // focal length in px

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ro = new ResizeObserver(() => {
      const rect = c.getBoundingClientRect();
      c.width = Math.max(280, Math.floor(rect.width));
      c.height = 260;
      draw();
    });
    ro.observe(c);
    return () => ro.disconnect();
  }, []);

  const draw = useCallback(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const w = c.width;
    const h = c.height;
    ctx.clearRect(0, 0, w, h);

    const cx = w / 2;
    const axisY = h / 2;
    // axis
    ctx.strokeStyle = "rgba(148,163,184,0.4)";
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(8, axisY); ctx.lineTo(w - 8, axisY);
    ctx.stroke();
    ctx.setLineDash([]);

    // lens
    ctx.strokeStyle = "#38bdf8";
    ctx.fillStyle = "rgba(56,189,248,0.10)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(cx, axisY, 14, h / 2 - 30, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // focal points
    [-f, f].forEach((dx) => {
      ctx.fillStyle = "#fbbf24";
      ctx.beginPath();
      ctx.arc(cx + dx, axisY, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.font = "9px sans-serif";
      ctx.fillStyle = "rgba(251,191,36,0.7)";
      ctx.fillText(dx < 0 ? "F" : "F'", cx + dx - 4, axisY + 14);
    });
    // 2F points
    [-2 * f, 2 * f].forEach((dx) => {
      ctx.fillStyle = "rgba(251,191,36,0.5)";
      ctx.beginPath();
      ctx.arc(cx + dx, axisY, 2, 0, Math.PI * 2);
      ctx.fill();
    });

    // object (arrow on left side, pointing up)
    const objX = cx - objDist;
    const objH = 50;
    ctx.strokeStyle = "#34d399";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(objX, axisY);
    ctx.lineTo(objX, axisY - objH);
    ctx.stroke();
    // arrowhead
    ctx.beginPath();
    ctx.moveTo(objX - 5, axisY - objH + 6);
    ctx.lineTo(objX, axisY - objH);
    ctx.lineTo(objX + 5, axisY - objH + 6);
    ctx.stroke();
    ctx.font = "10px sans-serif";
    ctx.fillStyle = "#34d399";
    ctx.fillText("Object", objX - 18, axisY - objH - 6);

    // image calculation (convex lens, thin lens eq: 1/v - 1/u = 1/f ; u = -objDist, convention)
    // using sign convention: u = -objDist (object on left, real), f = +f
    // 1/v = 1/f + 1/u = 1/f - 1/objDist
    let imgX: number;
    let imgH: number;
    let virtual = false;
    if (Math.abs(objDist - f) < 1) {
      imgX = cx + 10000; // at infinity
      imgH = 10000;
    } else {
      const invV = 1 / f - 1 / objDist;
      const v = 1 / invV;
      imgX = cx + v;
      // magnification m = v/u (with u = -objDist) -> m = -v/objDist
      const m = -v / objDist;
      imgH = objH * m;
      if (v < 0) virtual = true;
    }

    // draw rays (only if image is finite)
    if (Math.abs(objDist - f) > 1) {
      ctx.strokeStyle = "rgba(251,191,36,0.7)";
      ctx.lineWidth = 1.2;
      // ray 1: parallel to axis from top of object -> through F' on right
      ctx.beginPath();
      ctx.moveTo(objX, axisY - objH);
      ctx.lineTo(cx, axisY - objH);
      ctx.stroke();
      // after lens, through F'
      ctx.beginPath();
      ctx.moveTo(cx, axisY - objH);
      const slope1 = (axisY - (axisY - objH)) / (f); // dy/dx = objH / f? Actually through F' (cx+f, axisY)
      // line through (cx, axisY-objH) and (cx+f, axisY)
      // extend to right edge
      const endX1 = virtual ? objX - 200 : w - 8;
      const yEnd1 = (axisY - objH) + slope1 * (endX1 - cx);
      ctx.setLineDash(virtual ? [3, 3] : []);
      ctx.beginPath();
      ctx.moveTo(cx, axisY - objH);
      ctx.lineTo(endX1, yEnd1);
      ctx.stroke();
      ctx.setLineDash([]);

      // ray 2: through optical center (straight line)
      ctx.strokeStyle = "rgba(56,189,248,0.7)";
      const slope2 = (axisY - objH - axisY) / (objX - cx); // negative
      const endX2 = virtual ? objX - 200 : w - 8;
      const yEnd2 = axisY + slope2 * (endX2 - cx);
      ctx.setLineDash(virtual ? [3, 3] : []);
      ctx.beginPath();
      ctx.moveTo(objX, axisY - objH);
      ctx.lineTo(endX2, yEnd2);
      ctx.stroke();
      ctx.setLineDash([]);

      // image arrow
      ctx.strokeStyle = "#f472b6";
      ctx.lineWidth = 2;
      const drawY = axisY - imgH;
      ctx.beginPath();
      ctx.moveTo(imgX, axisY);
      ctx.lineTo(imgX, drawY);
      ctx.stroke();
      // arrowhead
      const dir = imgH > 0 ? -1 : 1; // if imgH positive, image is upright (virtual)
      ctx.beginPath();
      ctx.moveTo(imgX - 5, drawY + dir * 6);
      ctx.lineTo(imgX, drawY);
      ctx.lineTo(imgX + 5, drawY + dir * 6);
      ctx.stroke();
      ctx.fillStyle = "#f472b6";
      ctx.font = "10px sans-serif";
      ctx.fillText(virtual ? "Virtual image" : "Real image", imgX - 22, drawY - 8);
    } else {
      ctx.fillStyle = "#fbbf24";
      ctx.font = "11px sans-serif";
      ctx.fillText("Image at infinity (object at F)", cx - 70, 20);
    }
  }, [objDist, f]);

  useEffect(() => { draw(); }, [draw]);

  const invV = 1 / f - 1 / objDist;
  const v = Math.abs(objDist - f) < 1 ? Infinity : 1 / invV;
  const m = Math.abs(objDist - f) < 1 ? Infinity : -v / objDist;
  const virtual = v < 0;
  const nature = Math.abs(objDist - f) < 1
    ? "Image at infinity"
    : virtual
      ? "Virtual, upright, magnified"
      : objDist > 2 * f
        ? "Real, inverted, diminished"
        : Math.abs(objDist - 2 * f) < 5
          ? "Real, inverted, same size"
          : objDist > f
            ? "Real, inverted, magnified"
            : "—";

  return (
    <div className="space-y-2">
      <canvas ref={canvasRef} className="w-full rounded-lg bg-muted/40 border" height={260} />
      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Object distance (u)</span>
          <span className="font-medium tabular-nums">{objDist} px · f = {f}px</span>
        </div>
        <Slider value={[objDist]} min={40} max={280} step={2} onValueChange={(v) => setObjDist(v[0])} />
      </div>
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="rounded-lg bg-muted/40 p-1.5">
          <div className="text-[10px] text-muted-foreground">Image distance v</div>
          <div className="text-sm font-bold tabular-nums text-sky-400">
            {Math.abs(objDist - f) < 1 ? "∞" : v.toFixed(0)}
          </div>
        </div>
        <div className="rounded-lg bg-muted/40 p-1.5">
          <div className="text-[10px] text-muted-foreground">Magnification</div>
          <div className="text-sm font-bold tabular-nums text-sky-400">
            {Math.abs(objDist - f) < 1 ? "∞" : m.toFixed(2) + "×"}
          </div>
        </div>
        <div className="rounded-lg bg-muted/40 p-1.5">
          <div className="text-[10px] text-muted-foreground">Type</div>
          <div className="text-xs font-bold text-sky-400">{virtual ? "Virtual" : "Real"}</div>
        </div>
      </div>
      <p className="text-[11px] text-muted-foreground leading-relaxed">{nature}</p>
    </div>
  );
}

/* ---------- 5. Chemical Reaction Mixer ---------- */

type Element = { sym: string; name: string; color: string; };

const ELEMENTS: Element[] = [
  { sym: "Na", name: "Sodium", color: "#fbbf24" },
  { sym: "Cl", name: "Chlorine", color: "#22d3ee" },
  { sym: "H", name: "Hydrogen", color: "#a78bfa" },
  { sym: "O", name: "Oxygen", color: "#34d399" },
  { sym: "Fe", name: "Iron", color: "#94a3b8" },
  { sym: "Cu", name: "Copper", color: "#fb923c" },
  { sym: "C", name: "Carbon", color: "#475569" },
  { sym: "S", name: "Sulfur", color: "#eab308" },
];

type Reaction = {
  a: string; b: string; equation: string; product: string; note: string;
};

const REACTIONS: Reaction[] = [
  { a: "Na", b: "Cl", equation: "2 Na + Cl₂ → 2 NaCl", product: "Sodium chloride (table salt)", note: "Vigorous exothermic reaction; sodium burns with a yellow flame in chlorine gas." },
  { a: "H", b: "O", equation: "2 H₂ + O₂ → 2 H₂O", product: "Water", note: "Highly exothermic; the reaction releases a great deal of energy." },
  { a: "Fe", b: "O", equation: "4 Fe + 3 O₂ → 2 Fe₂O₃", product: "Iron oxide (rust)", note: "Slow oxidation — the familiar reddish-brown rust on iron." },
  { a: "Cu", b: "O", equation: "2 Cu + O₂ → 2 CuO", product: "Copper oxide", note: "Heated copper turns black as copper(II) oxide forms." },
  { a: "C", b: "O", equation: "C + O₂ → CO₂", product: "Carbon dioxide", note: "Combustion of carbon — releases heat and a colourless gas." },
  { a: "H", b: "Cl", equation: "H₂ + Cl₂ → 2 HCl", product: "Hydrogen chloride", note: "Forms hydrochloric acid when dissolved in water." },
  { a: "Fe", b: "S", equation: "Fe + S → FeS", product: "Iron sulfide", note: "Heated iron and sulfur combine to form a black solid." },
  { a: "Na", b: "H", equation: "—", product: "—", note: "No common direct reaction under normal conditions." },
];

function ReactionMixer() {
  const [aIdx, setAIdx] = useState(0);
  const [bIdx, setBIdx] = useState(1);
  const a = ELEMENTS[aIdx];
  const b = ELEMENTS[bIdx];

  const reaction = useMemo(() => {
    if (a.sym === b.sym) return null;
    return (
      REACTIONS.find((r) =>
        (r.a === a.sym && r.b === b.sym) || (r.a === b.sym && r.b === a.sym)
      ) ?? null
    );
  }, [a, b]);

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        {(["A", "B"] as const).map((slot, i) => {
          const el = i === 0 ? a : b;
          const idx = i === 0 ? aIdx : bIdx;
          const setIdx = i === 0 ? setAIdx : setBIdx;
          return (
            <div key={slot} className="rounded-lg border p-2 text-center" style={{ borderColor: `${el.color}55` }}>
              <div
                className="mx-auto mb-1 size-12 rounded-full flex items-center justify-center text-lg font-bold"
                style={{ backgroundColor: `${el.color}22`, color: el.color }}
              >
                {el.sym}
              </div>
              <div className="text-xs font-medium">{el.name}</div>
              <select
                value={idx}
                onChange={(e) => setIdx(Number(e.target.value))}
                className="mt-1 w-full text-[11px] rounded bg-transparent border border-border px-1 py-0.5"
              >
                {ELEMENTS.map((e, i) => (
                  <option key={e.sym} value={i} className="bg-background">{e.sym} — {e.name}</option>
                ))}
              </select>
            </div>
          );
        })}
      </div>
      {/* reaction arrow */}
      <div className="text-center text-2xl">+ →</div>
      {a.sym === b.sym ? (
        <div className="rounded-lg bg-muted/40 border p-3 text-center text-sm text-muted-foreground">
          Pick two different elements to mix.
        </div>
      ) : reaction ? (
        <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/30 p-3 space-y-1.5">
          <div className="font-mono text-sm font-bold text-emerald-300 whitespace-pre-wrap">{reaction.equation}</div>
          <div className="text-xs">
            <span className="text-muted-foreground">Product: </span>
            <span className="font-medium">{reaction.product}</span>
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed whitespace-pre-wrap">{reaction.note}</p>
        </div>
      ) : (
        <div className="rounded-lg bg-amber-500/10 border border-amber-500/30 p-3 text-center text-sm">
          <div className="font-medium text-amber-300">No common reaction</div>
          <p className="text-[11px] text-muted-foreground mt-1">
            {a.name} and {b.name} do not react directly under normal conditions.
          </p>
        </div>
      )}
    </div>
  );
}

/* ---------- 6. Food Web ---------- */

type Org = { id: string; name: string; emoji: string; type: "producer" | "herbivore" | "carnivore" | "apex"; eats: string[]; };

const ORGANISMS: Org[] = [
  { id: "grass", name: "Grass", emoji: "🌱", type: "producer", eats: [] },
  { id: "tree", name: "Tree", emoji: "🌳", type: "producer", eats: [] },
  { id: "rabbit", name: "Rabbit", emoji: "🐇", type: "herbivore", eats: ["grass"] },
  { id: "deer", name: "Deer", emoji: "🦌", type: "herbivore", eats: ["grass", "tree"] },
  { id: "mouse", name: "Mouse", emoji: "🐀", type: "herbivore", eats: ["grass", "tree"] },
  { id: "fox", name: "Fox", emoji: "🦊", type: "carnivore", eats: ["rabbit", "mouse"] },
  { id: "wolf", name: "Wolf", emoji: "🐺", type: "carnivore", eats: ["deer", "rabbit", "mouse"] },
  { id: "eagle", name: "Eagle", emoji: "🦅", type: "apex", eats: ["rabbit", "mouse", "fox"] },
];

function FoodWeb() {
  const [selected, setSelected] = useState<string | null>(null);
  const sel = ORGANISMS.find((o) => o.id === selected);
  // organisms this one eats (prey)
  const prey = sel ? sel.eats.map((id) => ORGANISMS.find((o) => o.id === id)!).filter(Boolean) : [];
  // organisms that eat this one (predators)
  const predators = selected ? ORGANISMS.filter((o) => o.eats.includes(selected)) : [];

  const typeColor: Record<Org["type"], string> = {
    producer: "#34d399",
    herbivore: "#fbbf24",
    carnivore: "#fb923c",
    apex: "#f43f5e",
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-4 gap-2">
        {ORGANISMS.map((o) => {
          const isSel = o.id === selected;
          const isPrey = sel?.eats.includes(o.id);
          const isPred = predators.some((p) => p.id === o.id);
          return (
            <button
              key={o.id}
              onClick={() => setSelected(isSel ? null : o.id)}
              className={`rounded-lg border p-2 text-center transition-all ${
                isSel ? "ring-2 ring-offset-1 ring-offset-background" : ""
              }`}
              style={{
                borderColor: isSel ? typeColor[o.type] : isPrey ? "#34d39966" : isPred ? "#f43f5e66" : "var(--border)",
                boxShadow: isSel ? `0 0 0 2px ${typeColor[o.type]}` : undefined,
                backgroundColor: isSel ? `${typeColor[o.type]}15` : undefined,
              }}
              title={o.name}
            >
              <div className="text-2xl">{o.emoji}</div>
              <div className="text-[10px] font-medium mt-0.5">{o.name}</div>
            </button>
          );
        })}
      </div>
      <div className="rounded-lg bg-muted/40 border p-3 min-h-[100px]">
        {!sel ? (
          <p className="text-xs text-muted-foreground text-center py-3">
            Click an organism to see its food relationships.
          </p>
        ) : (
          <div className="space-y-2 text-xs">
            <div className="font-medium text-sm capitalize" style={{ color: typeColor[sel.type] }}>
              {sel.emoji} {sel.name} <span className="text-muted-foreground">· {sel.type}</span>
            </div>
            <div>
              <div className="text-muted-foreground mb-1">Eats (energy flows from):</div>
              {prey.length === 0 ? (
                <span className="text-muted-foreground italic">Producer — gets energy from sunlight</span>
              ) : (
                <div className="flex flex-wrap gap-1">
                  {prey.map((p) => (
                    <span key={p.id} className="px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                      {p.emoji} {p.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div>
              <div className="text-muted-foreground mb-1">Eaten by (energy flows to):</div>
              {predators.length === 0 ? (
                <span className="text-muted-foreground italic">Apex predator — no natural predators here</span>
              ) : (
                <div className="flex flex-wrap gap-1">
                  {predators.map((p) => (
                    <span key={p.id} className="px-2 py-0.5 rounded-md bg-rose-500/15 text-rose-300 border border-rose-500/30">
                      {p.emoji} {p.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
        {(["producer", "herbivore", "carnivore", "apex"] as const).map((t) => (
          <span key={t} className="flex items-center gap-1">
            <span className="size-2 rounded-full" style={{ backgroundColor: typeColor[t] }} />
            <span className="capitalize">{t}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ---------- Main view ---------- */

export function LabView() {
  const mounted = useMounted();
  const track = useStudyStore((s) => s.track);

  if (!mounted) {
    return (
      <div className="space-y-4">
        <div className="h-10 w-48 rounded bg-muted/40 animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-64 rounded-2xl bg-muted/30 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const accent = SUBJECT_META[track].accent;

  const sims: { id: string; icon: React.ReactNode; title: string; desc: string; chapter: string; accent: string; node: React.ReactNode; }[] = [
    { id: "ph", icon: <Gauge className="size-5" />, title: "pH Meter", desc: "Drag the slider — see the colour shift and find substances at that pH.", chapter: "Acids, Bases & Salts", accent: "#34d399", node: <PhMeter /> },
    { id: "pendulum", icon: <Activity className="size-5" />, title: "Pendulum", desc: "Adjust the string length and watch the period change.", chapter: "Light & Oscillations", accent: "#a78bfa", node: <Pendulum /> },
    { id: "circuit", icon: <CircuitBoard className="size-5" />, title: "Circuit Builder", desc: "Toggle resistors in series or parallel — total resistance updates live.", chapter: "Electricity", accent: "#fbbf24", node: <CircuitBuilder /> },
    { id: "lens", icon: <Lightbulb className="size-5" />, title: "Lens Ray Diagram", desc: "Drag the object and see how a convex lens forms an image.", chapter: "Light — Reflection & Refraction", accent: "#38bdf8", node: <LensDiagram /> },
    { id: "reaction", icon: <Beaker className="size-5" />, title: "Reaction Mixer", desc: "Pick two elements — find out if they react and what they make.", chapter: "Chemical Reactions", accent: "#fb923c", node: <ReactionMixer /> },
    { id: "foodweb", icon: <Network className="size-5" />, title: "Food Web", desc: "Tap any organism to trace energy flow through the ecosystem.", chapter: "Life Processes", accent: "#22d3ee", node: <FoodWeb /> },
  ];

  return (
    <div className="space-y-5">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <FlaskConical className="size-7 text-emerald-400" />
          Laboratory <span aria-hidden>🧪</span>
        </h1>
        <p className="text-sm text-muted-foreground">
          Interactive simulations — see science in action
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sims.map((s) => (
          <SimCard key={s.id} icon={s.icon} title={s.title} desc={s.desc} chapter={s.chapter} accent={s.accent}>
            {s.node}
          </SimCard>
        ))}
      </div>

      <div className="rounded-2xl glass border p-4 flex items-start gap-3 text-sm text-muted-foreground">
        <Leaf className="size-5 shrink-0 text-emerald-400 mt-0.5" />
        <div className="whitespace-pre-wrap">
          Each simulation is a sandbox — experiment freely, then jump to the relevant chapter for the full explanation. Simulations are illustrative and use simplified physics suitable for Class 10 understanding.
        </div>
      </div>
    </div>
  );
}
