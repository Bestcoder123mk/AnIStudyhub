"use client";

import { useRef, useState } from "react";
import { useStudyStore, type Theme, type TextSize, type Track, ACCENT_PRESETS, DEFAULT_ACCENT, buildProgressExport, validateProgressExport, applyProgressImport, type ProgressExportFile } from "@/store/use-study-store";
import { useMounted, readableTextColor } from "@/components/shared/helpers";
import { RoomPicker } from "@/components/shared/room-picker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Palette,
  Type,
  Eye,
  CalendarClock,
  Shield,
  RotateCcw,
  Info,
  Moon,
  Sunset,
  Sun,
  Sparkles,
  BookOpen,
  Check,
  Pipette,
  Contrast,
  Download,
  Upload,
  AlertTriangle,
} from "lucide-react";

const THEMES: { id: Theme; label: string; desc: string; icon: React.ReactNode; swatches: string[] }[] = [
  { id: "midnight", label: "Midnight", desc: "Pure black, your accent colour", icon: <Moon className="size-4" />, swatches: ["oklch(0.07 0 0)", "#22d3ee", "oklch(0.98 0 0)"] },
  { id: "twilight", label: "Twilight", desc: "Pink-purple dusk", icon: <Sunset className="size-4" />, swatches: ["oklch(0.16 0.05 300)", "oklch(0.72 0.2 330)", "oklch(0.95 0.01 300)"] },
  { id: "daylight", label: "Daylight", desc: "Pure white, your accent colour", icon: <Sun className="size-4" />, swatches: ["oklch(0.975 0 0)", "#22d3ee", "oklch(0.12 0 0)"] },
  { id: "sepia", label: "Sepia", desc: "Warm paper reading", icon: <BookOpen className="size-4" />, swatches: ["oklch(0.94 0.04 75)", "oklch(0.6 0.1 60)", "oklch(0.3 0.03 60)"] },
  { id: "contrast", label: "High Contrast", desc: "Max readability", icon: <Contrast className="size-4" />, swatches: ["oklch(0.06 0 0)", "oklch(0.98 0 0)", "oklch(0.5 0 0)"] },
];

const TEXT_SIZES: { id: TextSize; label: string; sampleClass: string }[] = [
  { id: "md", label: "Medium", sampleClass: "text-base" },
  { id: "lg", label: "Large", sampleClass: "text-lg" },
  { id: "xl", label: "Extra Large", sampleClass: "text-xl" },
];

function ThemeCard({ theme, active, onClick, accentColor }: { theme: typeof THEMES[number]; active: boolean; onClick: () => void; accentColor: string }) {
  // Midnight & Daylight's middle swatch is the live user accent, not a fixed hue.
  const swatches = theme.id === "midnight" || theme.id === "daylight"
    ? [theme.swatches[0], accentColor, theme.swatches[2]]
    : theme.swatches;
  return (
    <button
      onClick={onClick}
      className={`group relative flex flex-col gap-3 rounded-2xl border p-4 text-left transition-all hover:scale-[1.02] ${
        active ? "border-primary bg-primary/10 ring-2 ring-primary/40" : "border-border bg-card/50 hover:border-primary/40"
      }`}
    >
      <div className="flex items-center justify-between">
        <span className={`flex items-center gap-2 font-semibold ${active ? "text-primary" : ""}`}>
          {theme.icon}
          {theme.label}
        </span>
        {active && (
          <span className="size-2 rounded-full bg-primary animate-pulse" />
        )}
      </div>
      <div className="flex gap-1.5">
        {swatches.map((c, i) => (
          <span
            key={i}
            className="h-8 flex-1 rounded-md border border-border/40 shadow-inner"
            style={{ backgroundColor: c }}
          />
        ))}
      </div>
      <span className="text-xs text-muted-foreground">{theme.desc}</span>
    </button>
  );
}

function ResetButton({ title, desc, onConfirm }: { title: string; desc: string; onConfirm: () => void }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="justify-start text-left h-auto py-3 border-rose-500/40 hover:bg-rose-500/10 hover:text-rose-400">
          <div>
            <div className="font-semibold">{title}</div>
            <div className="text-xs font-normal text-muted-foreground mt-0.5">{desc}</div>
          </div>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm reset</AlertDialogTitle>
          <AlertDialogDescription>
            {desc} This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-rose-500 text-white hover:bg-rose-600"
            onClick={onConfirm}
          >
            Yes, reset
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function DataSection() {
  const pushToast = useStudyStore((s) => s.pushToast);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingImport, setPendingImport] = useState<ProgressExportFile | null>(null);
  const [importError, setImportError] = useState<string | null>(null);

  const handleExport = () => {
    const file = buildProgressExport();
    const blob = new Blob([JSON.stringify(file, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `studyhub-progress-${file.exportedAt.slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    pushToast("💾", "Progress exported", "success");
  };

  const handleFileChosen = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    e.target.value = ""; // allow re-selecting the same file later
    if (!f) return;
    setImportError(null);
    try {
      const parsed = JSON.parse(await f.text());
      // Validate now (before asking for confirmation) so the confirm dialog
      // only ever appears for a file that's actually going to work.
      const result = validateProgressExport(parsed);
      if (!result.ok) {
        setImportError(result.error);
        return;
      }
      setPendingImport(result.file);
    } catch {
      setImportError("Couldn't read that file — make sure it's a StudyHub export (.json) and hasn't been edited.");
    }
  };

  const confirmImport = () => {
    if (!pendingImport) return;
    applyProgressImport(pendingImport);
    setPendingImport(null);
    pushToast("✅", "Progress imported", "success");
  };

  return (
    <Card className="glass rounded-2xl">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2"><Download className="size-4" /> Your Data</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-xs text-muted-foreground">
          Everything — XP, streaks, achievements, mistakes, bookmarks — lives only in this
          browser. Export a backup before clearing site data, switching browsers, or moving
          to a new device, then import it there to pick up where you left off.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" className="gap-1.5" onClick={handleExport}>
            <Download className="size-3.5" /> Export progress
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="size-3.5" /> Import progress
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={handleFileChosen}
            aria-label="Import StudyHub progress file"
          />
        </div>
        {importError && (
          <p className="text-xs text-rose-400 flex items-center gap-1.5">
            <AlertTriangle className="size-3.5 shrink-0" /> {importError}
          </p>
        )}
      </CardContent>

      <AlertDialog open={!!pendingImport} onOpenChange={(open) => { if (!open) setPendingImport(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Import this progress file?</AlertDialogTitle>
            <AlertDialogDescription>
              This replaces your current XP, streaks, achievements, and everything else on
              this device with what's in the file
              {pendingImport ? ` (exported ${new Date(pendingImport.exportedAt).toLocaleDateString()})` : ""}.
              Your current progress on this device will be lost unless you've exported it too.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmImport}>Yes, import</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}

export function SettingsView() {
  const mounted = useMounted();
  const theme = useStudyStore((s) => s.theme);
  const setTheme = useStudyStore((s) => s.setTheme);
  const accentColor = useStudyStore((s) => s.accentColor);
  const setAccentColor = useStudyStore((s) => s.setAccentColor);
  const textSize = useStudyStore((s) => s.textSize);
  const setTextSize = useStudyStore((s) => s.setTextSize);
  const monochrome = useStudyStore((s) => s.monochrome);
  const autoTheme = useStudyStore((s) => s.autoTheme);
  const setAutoTheme = useStudyStore((s) => s.setAutoTheme);
  const voiceEnabled = useStudyStore((s) => s.voiceEnabled);
  const setVoiceEnabled = useStudyStore((s) => s.setVoiceEnabled);
  const soundEnabled = useStudyStore((s) => s.soundEnabled);
  const toggleSound = useStudyStore((s) => s.toggleSound);
  const coins = useStudyStore((s) => s.coins);
  const streakFreeze = useStudyStore((s) => s.streakFreeze);
  const buyStreakFreeze = useStudyStore((s) => s.buyStreakFreeze);
  const toggleMonochrome = useStudyStore((s) => s.toggleMonochrome);
  const examDate = useStudyStore((s) => s.examDate);
  const setExamDate = useStudyStore((s) => s.setExamDate);
  const shields = useStudyStore((s) => s.shields);
  const resetTrack = useStudyStore((s) => s.resetTrack);
  const resetAll = useStudyStore((s) => s.resetAll);
  const pushToast = useStudyStore((s) => s.pushToast);

  const handleReset = (what: "science" | "ssc" | "all") => {
    if (what === "all") {
      resetAll();
    } else {
      resetTrack(what as Track);
    }
    pushToast("🔄", `Progress reset · ${what === "all" ? "everything cleared" : what === "science" ? "Science track wiped" : "SSC track wiped"}`, "info");
  };

  return (
    <div className="space-y-6 animate-float-up">
      <header className="space-y-1">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Settings ⚙️</h1>
        <p className="text-sm text-muted-foreground">Saved automatically · applies across Science &amp; SSC</p>
      </header>

      {/* Theme picker */}
      <Card className="glass rounded-2xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2"><Palette className="size-4 text-primary" /> Theme</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {THEMES.map((t) => (
              <ThemeCard key={t.id} theme={t} active={theme === t.id} onClick={() => setTheme(t.id)} accentColor={accentColor} />
            ))}
          </div>
          <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
            <span className="font-medium text-foreground/80">Midnight</span> is pure black,{" "}
            <span className="font-medium text-foreground/80">Daylight</span> is its pure-white twin —
            switch between them any time; both pick up your accent colour below.
          </p>
        </CardContent>
      </Card>

      {/* Accent colour — the customizable cyan-by-default accent used for
          primary buttons, focus rings, glows, and the sidebar highlight in
          Midnight & Daylight. */}
      <Card className="glass rounded-2xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Pipette className="size-4" style={{ color: accentColor }} /> Accent Colour
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            {ACCENT_PRESETS.map((p) => {
              const active = accentColor.toLowerCase() === p.hex.toLowerCase();
              return (
                <button
                  key={p.hex}
                  onClick={() => setAccentColor(p.hex)}
                  title={p.label}
                  aria-label={`Use ${p.label} accent`}
                  className="group flex flex-col items-center gap-1.5"
                >
                  <span
                    className="flex size-10 items-center justify-center rounded-full border-2 tap-lift transition-all"
                    style={{
                      backgroundColor: p.hex,
                      borderColor: active ? p.hex : "transparent",
                      boxShadow: active ? `0 0 0 3px var(--card), 0 0 0 5px ${p.hex}, 0 0 16px ${p.hex}66` : "none",
                    }}
                  >
                    {active && <Check className="size-4" style={{ color: readableTextColor(p.hex) }} />}
                  </span>
                  <span className="text-[10px] text-muted-foreground group-hover:text-foreground transition-colors">{p.label}</span>
                </button>
              );
            })}

            {/* Custom colour — native picker, kept in sync with the store */}
            <div className="flex flex-col items-center gap-1.5">
              <label
                className="relative flex size-10 items-center justify-center rounded-full border-2 border-dashed border-border tap-lift cursor-pointer overflow-hidden"
                style={{ backgroundColor: accentColor }}
                title="Custom colour"
              >
                <input
                  type="color"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="absolute inset-0 size-full cursor-pointer opacity-0"
                  aria-label="Pick a custom accent colour"
                />
                <Pipette className="size-4 pointer-events-none" style={{ color: readableTextColor(accentColor) }} />
              </label>
              <span className="text-[10px] text-muted-foreground">Custom</span>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <Input
              value={accentColor}
              onChange={(e) => {
                const v = e.target.value;
                if (/^#[0-9a-fA-F]{0,6}$/.test(v)) setAccentColor(v);
              }}
              maxLength={7}
              className="h-9 w-28 font-mono text-xs uppercase"
            />
            {accentColor.toLowerCase() !== DEFAULT_ACCENT.toLowerCase() && (
              <Button size="sm" variant="ghost" className="h-9 text-xs" onClick={() => setAccentColor(DEFAULT_ACCENT)}>
                Reset to cyan
              </Button>
            )}
            <span className="ml-auto text-xs text-muted-foreground">Used for buttons, highlights &amp; glows</span>
          </div>
        </CardContent>
      </Card>

      {/* Study Rooms */}
      <Card className="glass rounded-2xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2"><Sparkles className="size-4 text-primary" /> Study Room</CardTitle>
          <p className="text-xs text-muted-foreground">Immersive ambient environments — changes the background, mood, and ambient sound of the whole app</p>
        </CardHeader>
        <CardContent>
          <RoomPicker />
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Text Size */}
        <Card className="glass rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2"><Type className="size-4 text-primary" /> Text Size</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-2">
              {TEXT_SIZES.map((ts) => (
                <button
                  key={ts.id}
                  onClick={() => setTextSize(ts.id)}
                  className={`flex flex-col items-center justify-center gap-1 rounded-xl border p-4 transition-all ${
                    textSize === ts.id
                      ? "border-primary bg-primary/10 ring-2 ring-primary/40"
                      : "border-border bg-card/50 hover:border-primary/40"
                  }`}
                >
                  <span className={`font-bold ${ts.sampleClass} ${textSize === ts.id ? "text-primary" : ""}`}>A</span>
                  <span className="text-[11px] text-muted-foreground">{ts.label}</span>
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-3">Affects content readability across all views.</p>
          </CardContent>
        </Card>

        {/* Monochrome + Exam date + Shields */}
        <Card className="glass rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2"><Eye className="size-4 text-primary" /> Appearance &amp; Focus</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-card/50 p-3">
              <div className="space-y-0.5">
                <div className="font-medium text-sm">Distraction-free monochrome mode</div>
                <p className="text-xs text-muted-foreground">Hides subject colors for a calmer, unified palette.</p>
              </div>
              <Switch checked={monochrome} onCheckedChange={toggleMonochrome} />
            </div>

            <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-card/50 p-3">
              <div className="space-y-0.5">
                <div className="font-medium text-sm">Auto theme (time-of-day)</div>
                <p className="text-xs text-muted-foreground">Automatically switches between daylight, sepia, and midnight themes based on the time.</p>
              </div>
              <Switch checked={autoTheme} onCheckedChange={setAutoTheme} />
            </div>

            <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-card/50 p-3">
              <div className="space-y-0.5">
                <div className="font-medium text-sm">Voice / TTS</div>
                <p className="text-xs text-muted-foreground">Enable text-to-speech for flashcards, answers, and AI narration in the museum.</p>
              </div>
              <Switch checked={voiceEnabled} onCheckedChange={setVoiceEnabled} />
            </div>

            <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-card/50 p-3">
              <div className="space-y-0.5">
                <div className="font-medium text-sm">Sound effects &amp; ambience</div>
                <p className="text-xs text-muted-foreground">Correct/incorrect chimes, achievement fanfare, and your Study Room's ambient sound.</p>
              </div>
              <Switch checked={soundEnabled} onCheckedChange={toggleSound} />
            </div>

            <Separator />

            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-sm font-medium">
                <CalendarClock className="size-4 text-primary" /> Exam Date
              </div>
              <Input
                type="date"
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                className="bg-background"
              />
              {mounted && examDate && (
                <p className="text-xs text-muted-foreground">Counting down to your board exam.</p>
              )}
            </div>

            <Separator />

            <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-card/50 p-3">
              <div className="space-y-0.5">
                <div className="font-medium text-sm flex items-center gap-2">
                  <Shield className="size-4 text-amber-400" /> Streak Shields
                </div>
                <p className="text-xs text-muted-foreground">Protects your streak on missed days.</p>
              </div>
              <Badge variant="secondary" className="text-base gap-1 py-1.5 px-2.5">
                <span>🛡️</span>
                <span className="tabular-nums">{shields}</span>
              </Badge>
            </div>

            {/* Coins + Streak Freeze economy */}
            <Separator />
            <div className="flex items-center justify-between gap-4 rounded-xl border border-amber-400/20 bg-amber-400/5 p-3">
              <div className="space-y-0.5">
                <div className="font-medium text-sm flex items-center gap-2">
                  🪙 Coins
                </div>
                <p className="text-xs text-muted-foreground">Earn 1 coin per 10 XP. Spend on streak freezes and skill unlocks.</p>
              </div>
              <Badge variant="secondary" className="text-base gap-1 py-1.5 px-2.5 bg-amber-400/15 text-amber-400">
                🪙 <span className="tabular-nums">{coins}</span>
              </Badge>
            </div>

            <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-card/50 p-3">
              <div className="space-y-0.5">
                <div className="font-medium text-sm flex items-center gap-2">
                  🛡️ Streak Freeze ({streakFreeze} owned)
                </div>
                <p className="text-xs text-muted-foreground">Buy a streak freeze for 50 coins. Auto-used when you miss a day.</p>
              </div>
              <Button size="sm" variant="outline" onClick={buyStreakFreeze} disabled={coins < 50} className="gap-1.5">
                Buy (50 🪙)
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data export/import */}
      <DataSection />

      {/* Reset section */}
      <Card className="glass rounded-2xl border-rose-500/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2 text-rose-400"><RotateCcw className="size-4" /> Reset Progress</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-xs text-muted-foreground mb-3">
            These actions permanently delete your stored progress. Be sure before you click.
          </p>
          <div className="grid sm:grid-cols-3 gap-2">
            <ResetButton
              title="Reset Science Progress"
              desc="Wipes Science XP, MCQs, streaks, chapters, achievements."
              onConfirm={() => handleReset("science")}
            />
            <ResetButton
              title="Reset SSC Progress"
              desc="Wipes Social Science XP, MCQs, streaks, achievements."
              onConfirm={() => handleReset("ssc")}
            />
            <ResetButton
              title="Reset Everything"
              desc="Wipes both tracks plus mistakes, bookmarks, goals, heatmap, pomodoro."
              onConfirm={() => handleReset("all")}
            />
          </div>
        </CardContent>
      </Card>

      {/* About */}
      <Card className="glass rounded-2xl">
        <CardContent className="py-5 flex items-start gap-3">
          <Info className="size-5 text-primary shrink-0 mt-0.5" />
          <div className="text-sm text-muted-foreground space-y-1">
            <p className="font-medium text-foreground">StudyHub v7 · Built with Next.js · NCERT Class 10</p>
            <p>All progress stored locally on your device. No accounts, no servers — your data stays yours.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
