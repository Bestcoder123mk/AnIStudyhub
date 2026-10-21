"use client";

import { useEffect, useRef, useState } from "react";
import { Send, Trash2, Bot, User, Lightbulb, Mic, Square, ChevronsRight } from "lucide-react";
import { useStudyStore, SUBJECT_META } from "@/store/use-study-store";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useMounted } from "@/components/shared/helpers";
import { Markdown } from "@/components/shared/markdown";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  /** Still arriving over the stream. */
  streaming?: boolean;
  /** The reply stopped early (token limit, dropped connection, or the Stop button). */
  truncated?: boolean;
}

const CONTINUE_PROMPT =
  "Continue from exactly where you stopped. Don't repeat what you already wrote and don't add an introduction — pick up at the last complete point and finish the answer.";

type TutorMode =
  | "tutor"
  | "debate"
  | "homework"
  | "examcoach"
  | "memory"
  | "essay"
  | "mathsolver"
  | "career";

interface ModeConfig {
  id: TutorMode;
  label: string;
  chipLabel: string;
  welcome: string;
  suggestions: string[];
  placeholder: string;
}

const MODE_CONFIG: ModeConfig[] = [
  {
    id: "tutor",
    label: "Tutor",
    chipLabel: "Tutor 🤖",
    welcome:
      "Hi! I'm your StudyHub AI Tutor 🤖\n\nAsk me anything about Class 10 Science or Social Science — concepts, doubts, numericals, reactions, dates, formulas, anything!\n\nPick a suggestion below or type your own question to get started. ✨",
    suggestions: [
      "Explain photosynthesis",
      "Balance: Fe + CuSO₄ →",
      "Why do we get cramps?",
      "Explain the mirror formula",
    ],
    placeholder:
      "Ask your Tutor anything…  (Enter to send, Shift+Enter for newline)",
  },
  {
    id: "debate",
    label: "Debate Partner",
    chipLabel: "Debate 🗣️",
    welcome:
      "Welcome to Debate Mode 🗣️\n\nState a position on any Class 10 topic and I'll argue the opposite side — respectfully but rigorously. I'll steel-man your view, then poke holes in it.\n\nPick a starter below ↓",
    suggestions: [
      "Why is renewable energy better than fossil fuels?",
      "Democracy is the best form of government.",
      "Social media does more harm than good for teens.",
      "Chemistry is harder than Physics.",
    ],
    placeholder:
      "State your position…  (Enter to send, Shift+Enter for newline)",
  },
  {
    id: "homework",
    label: "Homework Helper",
    chipLabel: "Homework 📝",
    welcome:
      "Homework Helper mode 📝\n\nPaste a question and I'll guide you step-by-step — but I won't just hand you the answer. We'll get there together, Socratic style. Ready?\n\nTry one below ↓",
    suggestions: [
      "Find the roots of x² - 5x + 6 = 0",
      "Why is the sky blue?",
      "Balance: Al + HCl → AlCl₃ + H₂",
      "Explain the causes of the French Revolution",
    ],
    placeholder:
      "Paste your homework question…  (Enter to send, Shift+Enter for newline)",
  },
  {
    id: "examcoach",
    label: "Exam Coach",
    chipLabel: "Exam Coach 🎯",
    welcome:
      "Exam Coach mode 🎯\n\nI'll help you plan paper strategy, time management, question selection, and last-minute revision. Practical, motivational, no fluff. What's stressing you?\n\nPick one below ↓",
    suggestions: [
      "How do I manage time in the Science board paper?",
      "Last 7 days revision plan for Social Science",
      "Best order to attempt the Maths paper",
      "How do I score full marks in diagram questions?",
    ],
    placeholder:
      "Tell me your exam worry…  (Enter to send, Shift+Enter for newline)",
  },
  {
    id: "memory",
    label: "Memory Coach",
    chipLabel: "Memory 🧠",
    welcome:
      "Memory Coach mode 🧠\n\nI'll teach mnemonics, memory palaces, and spaced-repetition tricks tuned to your Class 10 syllabus. Tell me what to memorize and I'll make it stick.\n\nTry one below ↓",
    suggestions: [
      "Help me memorize the reactivity series",
      "Mnemonic for trigonometric ratios",
      "How to remember the Mughal emperors in order",
      "Best way to memorize Biology diagrams",
    ],
    placeholder:
      "What do you need to memorize?…  (Enter to send, Shift+Enter for newline)",
  },
  {
    id: "essay",
    label: "Essay Reviewer",
    chipLabel: "Essay ✍️",
    welcome:
      "Essay Reviewer mode ✍️\n\nPaste your essay or paragraph below and I'll critique structure, vocabulary, grammar, and content — CBSE Class 10 English standard. Suggestions, not rewrites. Go!\n\nTip: paste your full essay in the box ↓",
    suggestions: [
      "Paste your essay here for review…",
      "Check my paragraph on 'My Aim in Life'",
      "Is my introduction strong enough?",
      "Suggest better vocabulary for this paragraph:",
    ],
    placeholder:
      "Paste your essay / paragraph here…  (Enter to send, Shift+Enter for newline)",
  },
  {
    id: "mathsolver",
    label: "Math Solver",
    chipLabel: "Math Solver 🔢",
    welcome:
      "Math Solver mode 🔢\n\nDrop any Class 10 Maths problem and I'll solve it step-by-step: Given → Find → Formula → Substitution → Answer. Full working, no shortcuts.\n\nTry one below ↓",
    suggestions: [
      "Solve: 2x² - 7x + 3 = 0",
      "Find the 10th term of AP: 2, 7, 12, …",
      "If sin A = 3/5, find cos A and tan A",
      "A cone has r = 7, h = 24. Find its volume.",
    ],
    placeholder:
      "Type your Maths problem here…  (Enter to send, Shift+Enter for newline)",
  },
  {
    id: "career",
    label: "Career Advisor",
    chipLabel: "Career 💼",
    welcome:
      "Career Advisor mode 💼\n\nTell me your interests, favourite subjects, and hobbies — I'll suggest 3 career paths with the right stream (Science / Commerce / Arts), entrance exams, and skills to start building now.\n\nOr pick a starter below ↓",
    suggestions: [
      "I love coding and maths — what should I do?",
      "I enjoy Biology and helping people.",
      "Career options after Class 10 with Arts?",
      "How do I become a CA after Class 10?",
    ],
    placeholder:
      "Tell me about your interests…  (Enter to send, Shift+Enter for newline)",
  },
];

const MODE_MAP: Record<TutorMode, ModeConfig> = MODE_CONFIG.reduce(
  (acc, m) => {
    acc[m.id] = m;
    return acc;
  },
  {} as Record<TutorMode, ModeConfig>
);

function getModeConfig(mode: TutorMode): ModeConfig {
  return MODE_MAP[mode] ?? MODE_CONFIG[0];
}

export function AiTutorView() {
  const mounted = useMounted();
  const track = useStudyStore((s) => s.track);
  const mistakes = useStudyStore((s) => s.mistakes);
  const pendingTutorContext = useStudyStore((s) => s.pendingTutorContext);
  const setPendingTutorContext = useStudyStore((s) => s.setPendingTutorContext);

  const [mode, setMode] = useState<TutorMode>("tutor");
  const activeConfig = getModeConfig(mode);

  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: activeConfig.welcome },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const stickRef = useRef(true);

  // Follow the reply as it streams in — but only while the student is already
  // at the bottom, so scrolling up to re-read part of a long answer isn't
  // fought by every new chunk.
  useEffect(() => {
    const el = scrollRef.current;
    if (el && stickRef.current) el.scrollTo({ top: el.scrollHeight, behavior: "auto" });
  }, [messages, loading]);

  const onChatScroll = () => {
    const el = scrollRef.current;
    if (el) stickRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < 96;
  };

  // Abort an in-flight reply if the view goes away.
  useEffect(() => () => abortRef.current?.abort(), []);

  const switchMode = (next: TutorMode) => {
    if (next === mode) return;
    abortRef.current?.abort();
    const cfg = getModeConfig(next);
    setMode(next);
    // Clear chat and show the new mode's welcome message
    setMessages([{ role: "assistant", content: cfg.welcome }]);
    setInput("");
    setLoading(false);
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ top: 0, behavior: "auto" });
      textareaRef.current?.focus();
    });
  };

  const send = async (text?: string, opts: { continueLast?: boolean } = {}) => {
    // "Continue" re-opens the last (cut-off) assistant message and keeps
    // streaming into it, so the answer — including any **bold**, list or table
    // that was split mid-way — reads as one piece instead of two bubbles. The
    // nudge to the model is sent with the request but never added to the chat.
    const cont = !!opts.continueLast;
    const base = cont ? messages[messages.length - 1] : undefined;
    if (cont && (!base || base.role !== "assistant")) return;
    const question = cont ? CONTINUE_PROMPT : (text ?? input).trim();
    if (!question || loading) return;

    // Whatever was waiting on a "Continue" no longer is.
    const settled = messages.map((m) => (m.truncated ? { ...m, truncated: false } : m));
    const nextMessages: ChatMessage[] = cont ? settled : [...settled, { role: "user", content: question }];
    setMessages(cont ? settled.map((m, i) => (i === settled.length - 1 ? { ...m, streaming: true } : m)) : nextMessages);
    if (!cont) setInput("");
    setLoading(true);
    stickRef.current = true;

    const ctrl = new AbortController();
    abortRef.current = ctrl;

    // The reply arrives in small pieces; paint at most once per frame.
    let acc = base?.content ?? "";
    let started = cont; // a continuation already has its bubble
    let gotNew = false;
    let frame = 0;
    const paint = () => {
      frame = 0;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (!last || !last.streaming) return prev;
        return [...prev.slice(0, -1), { ...last, content: acc }];
      });
    };

    let truncated = false;
    let failure = "";
    try {
      const turns = nextMessages.map((m) => ({ role: m.role, content: m.content }));
      const res = await fetch("/api/ai-tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: ctrl.signal,
        body: JSON.stringify({
          messages: cont ? [...turns, { role: "user", content: CONTINUE_PROMPT }] : turns,
          question,
          mode,
          track,
          stream: true,
        }),
      });

      const type = res.headers.get("content-type") ?? "";
      if (!res.body || !type.includes("ndjson")) {
        // Rate-limit and configuration errors come back as plain JSON.
        const data = await res.json().catch(() => null);
        const reply: string =
          data?.reply || "I couldn't generate a response. Please try rephrasing your question.";
        setMessages((prev) => {
          const copy = [...prev];
          const last = copy[copy.length - 1];
          // A failed continuation hands the "Continue" button back.
          if (cont && last?.streaming) copy[copy.length - 1] = { ...last, streaming: false, truncated: true };
          copy.push({ role: "assistant", content: reply });
          return copy;
        });
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        let nl: number;
        while ((nl = buf.indexOf("\n")) !== -1) {
          const line = buf.slice(0, nl).trim();
          buf = buf.slice(nl + 1);
          if (!line) continue;
          let ev: { d?: string; done?: boolean; truncated?: boolean; error?: string };
          try {
            ev = JSON.parse(line);
          } catch {
            continue;
          }
          if (typeof ev.d === "string" && ev.d) {
            acc += ev.d;
            gotNew = true;
            if (!started) {
              started = true;
              setMessages((prev) => [...prev, { role: "assistant", content: acc, streaming: true }]);
            } else if (!frame) {
              frame = requestAnimationFrame(paint);
            }
          } else if (ev.done) {
            truncated = !!ev.truncated;
          } else if (ev.error) {
            failure = ev.error;
          }
        }
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        truncated = acc.length > 0; // the Stop button — keep what already arrived
      } else {
        failure = err instanceof Error ? err.message : "Network error";
      }
    } finally {
      if (frame) cancelAnimationFrame(frame);
      abortRef.current = null;
      const cutShort = truncated || (failure !== "" && acc.length > 0);
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (started && last?.streaming) {
          return [...prev.slice(0, -1), { role: "assistant", content: acc, truncated: cutShort }];
        }
        if (!started && failure) {
          return [
            ...prev,
            {
              role: "assistant",
              content: `I hit a snag just now (${failure}). Please try again in a moment — your question is important to me!`,
            },
          ];
        }
        return prev;
      });
      // A continuation that connected but added nothing and then failed: say so, keep Continue available.
      if (cont && failure && !gotNew) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: `I couldn't pick that up again (${failure}). Try Continue once more in a moment.` },
        ]);
      }
      setLoading(false);
      requestAnimationFrame(() => textareaRef.current?.focus());
    }
  };

  const clearChat = () => {
    abortRef.current?.abort();
    setMessages([{ role: "assistant", content: activeConfig.welcome }]);
    setInput("");
  };

  // If another view (e.g. Mistake Notebook's "Ask AI Tutor") handed off a
  // real question, send it automatically instead of dropping the student
  // into a blank chat that's forgotten why they're here.
  const consumedSeed = useRef(false);
  useEffect(() => {
    if (consumedSeed.current) return;
    if (!pendingTutorContext) return;
    consumedSeed.current = true;
    const seed = pendingTutorContext;
    setPendingTutorContext(null);
    void send(seed);
  }, [pendingTutorContext]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void send();
    }
  };

  // Context hint
  const recentMistake = mounted && mistakes.length > 0 ? mistakes[0] : null;
  const contextNote = recentMistake
    ? `💡 Tip: I can see you recently got a question wrong on "${recentMistake.q.slice(0, 60)}${recentMistake.q.length > 60 ? "…" : ""}". Ask me to explain it!`
    : mounted
    ? `💡 Tip: I can see you're studying ${SUBJECT_META[track]?.label ?? "Science"}. Ask me anything!`
    : null;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="page-header">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
              AI Tutor <span className="inline-block">🤖</span>
            </h1>
            <p className="text-muted-foreground mt-2 max-w-2xl">
              Ask anything about Class 10 Science or Social Science — concepts,
              doubts, numericals, reactions.
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearChat}
            className="shrink-0 text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10"
            aria-label="Clear chat"
          >
            <Trash2 className="size-4" />
            <span className="hidden sm:inline">Clear</span>
          </Button>
        </div>
      </div>

      {/* Mode selector — horizontal scrollable row of chips */}
      <div
        role="tablist"
        aria-label="AI Tutor modes"
        className="flex gap-2 overflow-x-auto scroll-thin pb-1 -mx-1 px-1 snap-x"
      >
        {MODE_CONFIG.map((m) => {
          const active = m.id === mode;
          const disabled = loading && !active;
          return (
            <button
              key={m.id}
              role="tab"
              aria-selected={active}
              type="button"
              onClick={() => switchMode(m.id)}
              disabled={disabled}
              className={`shrink-0 snap-start whitespace-nowrap rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all ${
                active
                  ? "border-primary bg-primary text-primary-foreground shadow-sm"
                  : "border-border/70 bg-background/60 text-muted-foreground hover:border-foreground/25 hover:bg-foreground/[0.05] hover:text-foreground"
              } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {m.chipLabel}
            </button>
          );
        })}
      </div>

      {/* Chat container */}
      <Card className="glass flex flex-col">
        {/* Messages */}
        <div
          ref={scrollRef}
          onScroll={onChatScroll}
          className="max-h-[min(74dvh,920px)] min-h-[300px] overflow-y-auto scroll-thin px-3 py-4 sm:px-4 space-y-4"
        >
          {messages.map((m, i) => <MessageBubble key={i} msg={m} />)}

          {/* Continue — shown when a reply stopped early */}
          {!loading && messages[messages.length - 1]?.truncated && (
            <div className="flex flex-wrap items-center gap-2 pl-10 text-xs text-muted-foreground">
              <span>This reply stopped before it finished.</span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => void send(undefined, { continueLast: true })}
                className="h-7 rounded-full px-3 text-xs"
              >
                <ChevronsRight className="size-3.5" />
                Continue
              </Button>
            </div>
          )}

          {/* Typing indicator — only until the first words arrive */}
          {loading && !messages[messages.length - 1]?.streaming && (
            <div className="flex items-start gap-2">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-foreground/[0.08] text-foreground/80">
                <Bot className="size-4" />
              </div>
              <div className="rounded-2xl rounded-tl-sm border border-border/60 bg-card px-4 py-3">
                <div className="flex items-center gap-1">
                  <span className="size-2 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:-0.3s]" />
                  <span className="size-2 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:-0.15s]" />
                  <span className="size-2 rounded-full bg-muted-foreground/60 animate-bounce" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Context note */}
        {contextNote && (
          <div className="px-3 sm:px-4 pb-2">
            <div className="flex items-start gap-2 rounded-lg border border-border/60 bg-foreground/[0.03] px-3 py-2 text-xs text-muted-foreground">
              <Lightbulb className="size-3.5 text-foreground/60 shrink-0 mt-0.5" />
              <span>{contextNote}</span>
            </div>
          </div>
        )}

        {/* Suggestions — mode-specific */}
        <div className="px-3 sm:px-4 pb-2">
          <div className="flex flex-wrap gap-2">
            {activeConfig.suggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => {
                  setInput(s);
                  requestAnimationFrame(() => textareaRef.current?.focus());
                }}
                className="rounded-full border border-border/70 bg-background/60 px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-foreground/25 hover:bg-foreground/[0.05] hover:text-foreground"
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Input bar — sticky bottom on mobile */}
        <div className="sticky bottom-0 border-t border-border/60 bg-card/80 backdrop-blur-md p-3 sm:p-4">
          <div className="flex items-end gap-2">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder={activeConfig.placeholder}
              rows={1}
              className="min-h-[44px] max-h-40 resize-none field-sizing-content"
              disabled={loading}
            />
            <Button
              size="icon"
              variant="outline"
              onClick={() => {
                const SR =
                  window.SpeechRecognition ||
                  (window as unknown as {
                    webkitSpeechRecognition: typeof SpeechRecognition;
                  }).webkitSpeechRecognition;
                if (!SR) {
                  alert("Voice input not supported in this browser");
                  return;
                }
                const rec = new SR();
                rec.lang = "en-US";
                rec.interimResults = false;
                rec.onresult = (e: SpeechRecognitionEvent) => {
                  setInput(e.results[0][0].transcript);
                };
                rec.start();
              }}
              className="h-11 w-11 shrink-0 rounded-lg"
              aria-label="Voice input"
              title="Voice input"
            >
              <Mic className="size-4" />
            </Button>
            {loading ? (
              <Button
                size="icon"
                variant="outline"
                onClick={() => abortRef.current?.abort()}
                className="h-11 w-11 shrink-0 rounded-lg"
                aria-label="Stop generating"
                title="Stop generating"
              >
                <Square className="size-3.5 fill-current" />
              </Button>
            ) : (
              <Button
                size="icon"
                onClick={() => void send()}
                disabled={!input.trim()}
                className="h-11 w-11 shrink-0 rounded-lg"
                aria-label="Send message"
              >
                <Send className="size-4" />
              </Button>
            )}
          </div>
          <div className="mt-1.5 text-[10px] text-muted-foreground/70 text-center">
            AI can make mistakes. Verify important facts with your NCERT
            textbook.
          </div>
        </div>
      </Card>
    </div>
  );
}

function MessageBubble({ msg }: { msg: ChatMessage }) {
  const isUser = msg.role === "user";
  return (
    <div className={`flex items-start gap-2 ${isUser ? "flex-row-reverse" : ""}`}>
      <div
        className={`flex size-8 shrink-0 items-center justify-center rounded-full ${
          isUser ? "bg-foreground/[0.14] text-foreground" : "bg-foreground/[0.08] text-foreground/80"
        }`}
      >
        {isUser ? <User className="size-4" /> : <Bot className="size-4" />}
      </div>
      <div
        className={
          isUser
            ? "max-w-[85%] sm:max-w-[75%] rounded-2xl rounded-tr-sm border border-border/70 bg-foreground/[0.07] px-4 py-2.5 text-sm leading-relaxed text-foreground whitespace-pre-wrap break-words"
            : // Assistant replies get the full width of the chat (capped for line length) —
              // long answers, tables and worked solutions need the room.
              "min-w-0 max-w-[min(calc(100%-2.75rem),52rem)] rounded-2xl rounded-tl-sm border border-border/60 bg-card px-4 py-3"
        }
      >
        {isUser ? (
          msg.content
        ) : (
          <>
            <Markdown text={msg.content} />
            {msg.streaming && (
              <span className="mt-1.5 flex items-center gap-1" aria-label="Still writing">
                <span className="size-1.5 rounded-full bg-muted-foreground/60 animate-pulse" />
                <span className="size-1.5 rounded-full bg-muted-foreground/60 animate-pulse [animation-delay:150ms]" />
                <span className="size-1.5 rounded-full bg-muted-foreground/60 animate-pulse [animation-delay:300ms]" />
              </span>
            )}
          </>
        )}
      </div>
    </div>
  );
}
