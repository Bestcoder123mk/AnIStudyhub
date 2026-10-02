"use client";

import { useState, useRef } from "react";
import { useStudyStore, SUBJECT_META } from "@/store/use-study-store";
import { SKT_TRANSLATION_EX } from "@/lib/sanskrit-data";
import { useMounted } from "@/components/shared/helpers";
import { Markdown } from "@/components/shared/markdown";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Languages, Sparkles, Loader2, Trash2, Wand2, BookOpen, Lightbulb } from "lucide-react";

const ACCENT = SUBJECT_META.sanskrit.accent; // single source of truth — was a duplicated hex literal

type Mode = "default" | "word-by-word" | "full";

const MODES: { key: Mode; label: string; sub: string }[] = [
  { key: "default", label: "Detailed", sub: "word-by-word + translation + grammar" },
  { key: "word-by-word", label: "Word-by-word", sub: "deep breakdown + grammar" },
  { key: "full", label: "Full translation", sub: "fluent translation only" },
];

export function SktTranslatorView() {
  const mounted = useMounted();
  const pushToast = useStudyStore((s) => s.pushToast);
  const addXp = useStudyStore((s) => s.addXp);

  const [input, setInput] = useState("");
  const [mode, setMode] = useState<Mode>("default");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const translate = async () => {
    const text = input.trim();
    if (!text) {
      pushToast("⚠️", "Please enter some Sanskrit first", "error");
      return;
    }
    if (loading) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, mode }),
      });
      const data = await res.json();
      const reply: string | undefined = data?.reply;
      if (!reply) {
        setError("No translation was returned. Please try again.");
      } else {
        setResult(reply);
        addXp(5, "Translation complete");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Network error";
      setError(`Translation failed (${msg}). Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const clear = () => {
    setInput("");
    setResult(null);
    setError(null);
    requestAnimationFrame(() => textareaRef.current?.focus());
  };

  const loadExample = (sanskrit: string) => {
    setInput(sanskrit);
    setResult(null);
    setError(null);
    requestAnimationFrame(() => textareaRef.current?.focus());
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      void translate();
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="animate-float-up">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-2">
          Sanskrit Translator
          <span style={{ color: ACCENT, filter: `drop-shadow(0 0 8px ${ACCENT})` }}>🕉️</span>
          <Badge
            className="ml-1 text-[10px] uppercase tracking-wide"
            style={{ backgroundColor: ACCENT + "20", color: ACCENT, border: "1px solid " + ACCENT + "40" }}
          >
            AI
          </Badge>
        </h1>
        <p className="mt-1 text-sm text-muted-foreground md:text-base">
          Translate any Sanskrit shloka or sentence to English — with word-by-word breakdown and grammar notes.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* INPUT CARD */}
        <Card
          className="glass rounded-2xl"
          style={{ borderColor: ACCENT + "30" }}
        >
          <CardContent className="p-5 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span
                  className="flex size-8 items-center justify-center rounded-lg"
                  style={{ backgroundColor: ACCENT + "20", color: ACCENT }}
                >
                  <Languages className="size-4" />
                </span>
                <span className="text-sm font-semibold">Sanskrit input (Devanagari)</span>
              </div>
              {input && (
                <Button variant="ghost" size="sm" onClick={clear} className="h-7 text-xs text-muted-foreground hover:text-rose-400">
                  <Trash2 className="size-3.5" /> Clear
                </Button>
              )}
            </div>

            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="यहाँ संस्कृत लिखें... (Paste any Sanskrit shloka or sentence)"
              rows={6}
              dir="auto"
              className="text-lg leading-relaxed resize-none field-sizing-content min-h-[140px] max-h-[400px]"
              style={{ fontFamily: "'Noto Sans Devanagari', ui-sans-serif, system-ui, sans-serif", lineHeight: 1.7 }}
            />

            {/* Mode selector */}
            <div>
              <div className="text-xs text-muted-foreground mb-1.5">Mode</div>
              <div className="grid grid-cols-3 gap-2">
                {MODES.map((m) => {
                  const active = mode === m.key;
                  return (
                    <button
                      key={m.key}
                      type="button"
                      onClick={() => setMode(m.key)}
                      className={`rounded-lg border px-2 py-2 text-center transition-all ${
                        active ? "border-transparent" : "border-border bg-card/40 hover:bg-muted/40"
                      }`}
                      style={active ? { backgroundColor: ACCENT, color: "#000" } : undefined}
                      aria-pressed={active}
                      title={m.sub}
                    >
                      <div className="text-xs font-semibold leading-tight">{m.label}</div>
                      <div className={`text-[10px] leading-tight mt-0.5 ${active ? "text-black/70" : "text-muted-foreground"}`}>
                        {m.sub}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Translate button */}
            <Button
              onClick={translate}
              disabled={loading || !input.trim()}
              className="w-full h-11 text-base font-semibold"
              style={{ backgroundColor: ACCENT, color: "#000" }}
            >
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin mr-2" />
                  Translating…
                </>
              ) : (
                <>
                  <Wand2 className="size-4 mr-2" />
                  Translate
                </>
              )}
            </Button>

            {/* Examples */}
            <div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
                <Sparkles className="size-3.5" style={{ color: ACCENT }} />
                <span>Try these examples — click to fill:</span>
              </div>
              <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto scroll-thin pr-1">
                {SKT_TRANSLATION_EX.map((ex) => (
                  <button
                    key={ex.id}
                    type="button"
                    onClick={() => loadExample(ex.sanskrit)}
                    title={ex.hint}
                    className="rounded-full border px-2.5 py-1 text-xs text-foreground/80 transition-all hover:text-foreground"
                    style={{ borderColor: ACCENT + "40", backgroundColor: ACCENT + "08" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = ACCENT;
                      e.currentTarget.style.backgroundColor = ACCENT + "18";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = ACCENT + "40";
                      e.currentTarget.style.backgroundColor = ACCENT + "08";
                    }}
                    dir="auto"
                  >
                    {ex.sanskrit.length > 40 ? ex.sanskrit.slice(0, 38) + "…" : ex.sanskrit}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* RESULT CARD */}
        <Card
          className="glass rounded-2xl flex flex-col"
          style={{ borderColor: ACCENT + "30" }}
        >
          <CardContent className="p-5 flex-1 flex flex-col">
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <span
                  className="flex size-8 items-center justify-center rounded-lg"
                  style={{ backgroundColor: ACCENT + "20", color: ACCENT }}
                >
                  <BookOpen className="size-4" />
                </span>
                <span className="text-sm font-semibold">Translation &amp; breakdown</span>
              </div>
              {result && (
                <Badge variant="outline" className="text-[10px]" style={{ borderColor: ACCENT + "40", color: ACCENT }}>
                  {mode === "word-by-word" ? "Word-by-word" : mode === "full" ? "Full" : "Detailed"}
                </Badge>
              )}
            </div>

            <div className="flex-1 min-h-[280px]">
              {/* Loading state */}
              {loading && (
                <div className="flex flex-col items-center justify-center py-12 gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="size-2.5 rounded-full animate-bounce [animation-delay:-0.3s]" style={{ backgroundColor: ACCENT }} />
                    <span className="size-2.5 rounded-full animate-bounce [animation-delay:-0.15s]" style={{ backgroundColor: ACCENT }} />
                    <span className="size-2.5 rounded-full animate-bounce" style={{ backgroundColor: ACCENT }} />
                  </div>
                  <p className="text-xs text-muted-foreground">Analyzing Sanskrit… breaking down sandhi, samas &amp; grammar</p>
                </div>
              )}

              {/* Error state */}
              {!loading && error && (
                <div className="rounded-xl border border-rose-500/30 bg-rose-500/5 p-4 text-sm text-rose-400">
                  <p className="font-semibold mb-1">⚠️ Translation failed</p>
                  <p className="text-rose-300/80">{error}</p>
                </div>
              )}

              {/* Empty state */}
              {!loading && !error && !result && (
                <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
                  <div
                    className="flex size-14 items-center justify-center rounded-2xl"
                    style={{ backgroundColor: ACCENT + "15" }}
                  >
                    <Languages className="size-7" style={{ color: ACCENT }} />
                  </div>
                  <p className="text-sm text-muted-foreground max-w-xs">
                    Your translation will appear here. Type or paste Sanskrit on the left, choose a mode, and tap <span className="font-semibold" style={{ color: ACCENT }}>Translate</span>.
                  </p>
                  <p className="text-[10px] text-muted-foreground/70">Tip: ⌘/Ctrl + Enter to translate</p>
                </div>
              )}

              {/* Result */}
              {!loading && !error && result && (
                <div
                  className="animate-float-up rounded-xl border p-4 max-h-[60vh] overflow-y-auto scroll-thin"
                  style={{ borderColor: ACCENT + "30", backgroundColor: ACCENT + "06" }}
                >
                  <Markdown text={result} accent={ACCENT} />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* How it works */}
      <Card className="glass rounded-2xl" style={{ borderColor: ACCENT + "20" }}>
        <CardContent className="p-4 flex items-start gap-3">
          <span
            className="flex size-8 shrink-0 items-center justify-center rounded-lg"
            style={{ backgroundColor: ACCENT + "15", color: ACCENT }}
          >
            <Lightbulb className="size-4" />
          </span>
          <div className="text-xs text-muted-foreground leading-relaxed">
            <span className="font-semibold text-foreground">How it works — </span>
            Powered by AI. Translates Sanskrit → English with word-by-word meanings, grammar notes (sandhi / samas / shabdarupa), and Hindi where helpful.
            {" "}
            For shlokas, it gives a 1-line theme and may use roman transliteration in brackets.
            {" "}
            <span className="text-foreground/80">Always cross-check important translations with your NCERT teacher.</span>
          </div>
        </CardContent>
      </Card>

      {!mounted && (
        <div className="h-32 bg-muted/30 rounded-2xl animate-pulse" />
      )}
    </div>
  );
}
