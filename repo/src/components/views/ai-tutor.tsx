"use client";

import { useEffect, useRef, useState } from "react";
import { Send, Trash2, Bot, User, Lightbulb, Mic } from "lucide-react";
import { useStudyStore } from "@/store/use-study-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useMounted } from "@/components/shared/helpers";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

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

  // Auto-scroll to bottom on new messages / loading
  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    }
  }, [messages, loading]);

  const switchMode = (next: TutorMode) => {
    if (next === mode) return;
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

  const send = async (text?: string) => {
    const question = (text ?? input).trim();
    if (!question || loading) return;

    const userMsg: ChatMessage = { role: "user", content: question };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai-tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          question,
          mode,
          track,
        }),
      });
      const data = await res.json();
      const reply: string =
        data?.reply ||
        "I couldn't generate a response. Please try rephrasing your question.";
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Network error";
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `I hit a snag just now (${msg}). Please try again in a moment — your question is important to me!`,
        },
      ]);
    } finally {
      setLoading(false);
      // refocus textarea
      requestAnimationFrame(() => textareaRef.current?.focus());
    }
  };

  const clearChat = () => {
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
    ? `💡 Tip: I can see you're studying ${track === "ssc" ? "Social Science" : "Science"}. Ask me anything!`
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
                  : "border-border/70 bg-background/60 text-muted-foreground hover:border-primary/40 hover:bg-primary/5 hover:text-foreground"
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
          className="max-h-[55vh] min-h-[300px] overflow-y-auto scroll-thin px-3 py-4 sm:px-4 space-y-4"
        >
          {messages.map((m, i) => (
            <MessageBubble key={i} msg={m} />
          ))}

          {/* Typing indicator */}
          {loading && (
            <div className="flex items-start gap-2">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
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
            <div className="flex items-start gap-2 rounded-lg border border-primary/20 bg-primary/5 px-3 py-2 text-xs text-muted-foreground">
              <Lightbulb className="size-3.5 text-primary shrink-0 mt-0.5" />
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
                className="rounded-full border border-border/70 bg-background/60 px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:bg-primary/5 hover:text-foreground"
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
            <Button
              size="icon"
              onClick={() => void send()}
              disabled={!input.trim() || loading}
              className="h-11 w-11 shrink-0 rounded-lg"
              aria-label="Send message"
            >
              <Send className="size-4" />
            </Button>
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
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-primary/15 text-primary"
        }`}
      >
        {isUser ? <User className="size-4" /> : <Bot className="size-4" />}
      </div>
      <div
        className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap leading-relaxed ${
          isUser
            ? "rounded-tr-sm bg-primary text-primary-foreground"
            : "rounded-tl-sm border border-border/60 bg-card"
        }`}
      >
        {msg.content}
      </div>
    </div>
  );
}
