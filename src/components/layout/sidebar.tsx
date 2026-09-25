"use client";

import { useState } from "react";
import { useStudyStore, SUBJECT_META, type ViewId, type Track } from "@/store/use-study-store";
import { XpBar } from "@/components/shared/xp-bar";
import {
  CHAPTERS, MCQS, SHORT_QA, LONG_QA, FLASHCARDS,
  SSC_CHAPTERS, SSC_MCQS, SSC_SHORT_QA, SSC_LONG_QA, SSC_FLASHCARDS,
} from "@/lib/study-data";
import { MATHS_CHAPTERS } from "@/lib/maths-data";
import { ENG_CHAPTERS } from "@/lib/english-data";
import { SKT_CHAPTERS } from "@/lib/sanskrit-data";
import { findAvatar, findTitle } from "@/lib/shop-data";
import {
  Rocket, BookOpen, Boxes, CircleDot, PenLine, Scroll, Zap, FileText, Calculator,
  Bot, Brain, AlertCircle, BarChart3, Sparkles, Timer, Gauge, CalendarDays,
  Trophy, Workflow, Crown, Gem, Bookmark, Swords, Shield, Users, MessageCircle, Gift,
  FlaskConical, Microscope, Briefcase, GraduationCap, HeartHandshake, Languages,
  Settings, ChevronRight, X, BookMarked, ShoppingBag, Coins, StickyNote, PenTool,
} from "lucide-react";

interface NavItem { id: ViewId; label: string; icon: React.ReactNode; badge?: string; }
interface Section { key: string; label: string; defaultOpen: boolean; items: NavItem[]; }

// ---- Sections shared by every subject track ----------------------------
// These are global tools (they read `track` from the store internally),
// so every subject should be able to reach every one of them — the old
// sidebar only wired most of these into Science, leaving SSC/Maths/
// English/Sanskrit without a leaderboard, planner, battle arena, guilds,
// social learning, seasonal events, lab, research, career hub, or portals.

const smartTools: NavItem[] = [
  { id: "tutor", label: "AI Tutor", icon: <Bot className="size-4" /> },
  { id: "notes", label: "Notes", icon: <StickyNote className="size-4" /> },
  { id: "review", label: "Spaced Repetition", icon: <Brain className="size-4" /> },
  { id: "mistakes", label: "Mistake Notebook", icon: <AlertCircle className="size-4" /> },
  { id: "analytics", label: "Analytics", icon: <BarChart3 className="size-4" /> },
  { id: "galaxy", label: "Knowledge Galaxy", icon: <Sparkles className="size-4" /> },
  { id: "resources", label: "NCERT Resources", icon: <BookMarked className="size-4" /> },
];

const focusTools: NavItem[] = [
  { id: "timer", label: "Pomodoro", icon: <Timer className="size-4" /> },
  { id: "diagrams", label: "Diagram Practice", icon: <PenTool className="size-4" /> },
  { id: "speedrun", label: "Speedrun", icon: <Gauge className="size-4" /> },
  { id: "planner", label: "Study Planner", icon: <CalendarDays className="size-4" /> },
];

const progressTools = (achId: ViewId): NavItem[] => [
  { id: achId, label: "Achievements", icon: <Trophy className="size-4" /> },
  { id: "shop", label: "Shop", icon: <ShoppingBag className="size-4" /> },
  { id: "skill-tree", label: "Skill Tree", icon: <Workflow className="size-4" /> },
  { id: "leaderboard", label: "Leaderboard", icon: <Crown className="size-4" /> },
  { id: "collections", label: "Collections", icon: <Gem className="size-4" /> },
  { id: "bookmarks", label: "Bookmarks", icon: <Bookmark className="size-4" /> },
];

const playTools: NavItem[] = [
  { id: "battle", label: "Battle Arena", icon: <Swords className="size-4" /> },
  { id: "dungeons", label: "Knowledge Dungeons", icon: <Shield className="size-4" /> },
  { id: "guild", label: "Guilds", icon: <Users className="size-4" /> },
  { id: "social", label: "Social Learning", icon: <MessageCircle className="size-4" /> },
  { id: "seasonal", label: "Seasonal Events", icon: <Gift className="size-4" /> },
];

const exploreTools: NavItem[] = [
  { id: "lab", label: "Laboratory", icon: <FlaskConical className="size-4" /> },
  { id: "research", label: "Research Mode", icon: <Microscope className="size-4" /> },
  { id: "career", label: "Career Hub", icon: <Briefcase className="size-4" /> },
];

const supportTools: NavItem[] = [
  { id: "teacher", label: "Teacher Portal", icon: <GraduationCap className="size-4" /> },
  { id: "parent", label: "Parent Dashboard", icon: <HeartHandshake className="size-4" /> },
];

// ---- Per-track sections: Study + Practice only differ by subject -------

function buildSections(track: Track): Section[] {
  const study: NavItem[] = (() => {
    switch (track) {
      case "ssc": return [
        { id: "ssc-dash", label: "SSC Dashboard", icon: <Rocket className="size-4" /> },
        { id: "ssc-chapters", label: "All Chapters", icon: <BookOpen className="size-4" />, badge: String(SSC_CHAPTERS.length) },
      ];
      case "maths": return [
        { id: "maths-dash", label: "Dashboard", icon: <Rocket className="size-4" /> },
        { id: "maths-chapters", label: "All Chapters", icon: <BookOpen className="size-4" />, badge: String(MATHS_CHAPTERS.length) },
      ];
      case "english": return [
        { id: "eng-dash", label: "Dashboard", icon: <Rocket className="size-4" /> },
        { id: "eng-chapters", label: "Prose & Poetry", icon: <BookOpen className="size-4" />, badge: String(ENG_CHAPTERS.length) },
      ];
      case "sanskrit": return [
        { id: "skt-dash", label: "Dashboard", icon: <Rocket className="size-4" /> },
        { id: "skt-chapters", label: "Shemushi Chapters", icon: <BookOpen className="size-4" />, badge: String(SKT_CHAPTERS.length) },
      ];
      default: return [
        { id: "dash", label: "Dashboard", icon: <Rocket className="size-4" /> },
        { id: "chapters", label: "All Chapters", icon: <BookOpen className="size-4" />, badge: String(CHAPTERS.length) },
      ];
    }
  })();
  // The redesigned chapter walkthrough lives right under "All Chapters" —
  // it's the primary way through a chapter, not a side attraction.
  study.push({ id: "museum", label: "3D Museum", icon: <Boxes className="size-4" /> });

  const practice: NavItem[] = (() => {
    switch (track) {
      case "ssc": return [
        { id: "ssc-mcq", label: "MCQ Quiz", icon: <CircleDot className="size-4" />, badge: String(SSC_MCQS.length) },
        { id: "ssc-short", label: "Short Answer", icon: <PenLine className="size-4" />, badge: String(SSC_SHORT_QA.length) },
        { id: "ssc-long", label: "Long Answer", icon: <Scroll className="size-4" />, badge: String(SSC_LONG_QA.length) },
        { id: "ssc-flash", label: "Flashcards", icon: <Zap className="size-4" />, badge: String(SSC_FLASHCARDS.length) },
      ];
      case "maths": return [
        { id: "maths-mcq", label: "MCQ Quiz", icon: <CircleDot className="size-4" />, badge: "PYQ" },
        { id: "maths-short", label: "Short Answer", icon: <PenLine className="size-4" /> },
        { id: "maths-long", label: "Long Answer", icon: <Scroll className="size-4" /> },
        { id: "maths-flash", label: "Flashcards", icon: <Zap className="size-4" /> },
        { id: "maths-mock", label: "Mock Test", icon: <FileText className="size-4" /> },
        { id: "maths-formulas", label: "Formula Sheet", icon: <Calculator className="size-4" /> },
      ];
      case "english": return [
        { id: "eng-mcq", label: "MCQ Quiz", icon: <CircleDot className="size-4" />, badge: "PYQ" },
        { id: "eng-short", label: "Short Answer", icon: <PenLine className="size-4" /> },
        { id: "eng-long", label: "Long Answer", icon: <Scroll className="size-4" /> },
        { id: "eng-flash", label: "Flashcards", icon: <Zap className="size-4" /> },
        { id: "eng-mock", label: "Mock Test", icon: <FileText className="size-4" /> },
      ];
      case "sanskrit": return [
        { id: "skt-mcq", label: "MCQ Quiz", icon: <CircleDot className="size-4" />, badge: "PYQ" },
        { id: "skt-short", label: "Short Answer", icon: <PenLine className="size-4" /> },
        { id: "skt-long", label: "Long Answer", icon: <Scroll className="size-4" /> },
        { id: "skt-flash", label: "Flashcards", icon: <Zap className="size-4" /> },
        { id: "skt-mock", label: "Mock Test", icon: <FileText className="size-4" /> },
        { id: "skt-translator", label: "Sanskrit Translator", icon: <Languages className="size-4" /> },
      ];
      default: return [
        { id: "mcq", label: "MCQ Quiz", icon: <CircleDot className="size-4" />, badge: String(MCQS.length) },
        { id: "short", label: "Short Answer", icon: <PenLine className="size-4" />, badge: String(SHORT_QA.length) },
        { id: "long", label: "Long Answer", icon: <Scroll className="size-4" />, badge: String(LONG_QA.length) },
        { id: "flash", label: "Flashcards", icon: <Zap className="size-4" />, badge: String(FLASHCARDS.length) },
        { id: "mock", label: "Mock Test", icon: <FileText className="size-4" /> },
        { id: "formulas", label: "Formula Sheet", icon: <Calculator className="size-4" /> },
      ];
    }
  })();

  const achId: ViewId = SUBJECT_META[track].ach;

  return [
    { key: "study", label: "Study", defaultOpen: true, items: study },
    { key: "practice", label: "Practice", defaultOpen: true, items: practice },
    { key: "smart", label: "Smart Tools", defaultOpen: true, items: smartTools },
    { key: "focus", label: "Focus", defaultOpen: false, items: focusTools },
    { key: "progress", label: "Progress", defaultOpen: false, items: progressTools(achId) },
    { key: "play", label: "Play", defaultOpen: false, items: playTools },
    { key: "explore", label: "Explore", defaultOpen: false, items: exploreTools },
    { key: "support", label: "For Parents & Teachers", defaultOpen: false, items: supportTools },
  ];
}

function TrackToggle() {
  const track = useStudyStore((s) => s.track);
  const setTrack = useStudyStore((s) => s.setTrack);
  const subjects: Track[] = ["science", "ssc", "maths", "english", "sanskrit"];
  return (
    <div className="mb-2">
      <div className="text-[9px] font-semibold uppercase tracking-widest text-muted-foreground/50 px-1 mb-1">Subject</div>
      <div className="grid grid-cols-1 gap-0.5">
        {subjects.map((s) => {
          const meta = SUBJECT_META[s];
          const active = track === s;
          return (
            <button
              key={s}
              onClick={() => setTrack(s)}
              className={`tap-lift flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[12px] font-medium transition-all ${
                active ? "" : "text-muted-foreground/70 hover:text-foreground hover:bg-muted/30"
              }`}
              style={active ? { background: meta.accent, color: "#0a0a0a", boxShadow: `0 3px 14px -2px ${meta.accent}80` } : {}}
            >
              <span className={`text-xs transition-transform duration-300 ${active ? "scale-110" : ""}`}>{meta.icon}</span>
              <span className="flex-1 text-left">{meta.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function Sidebar() {
  const track = useStudyStore((s) => s.track);
  const view = useStudyStore((s) => s.view);
  const setView = useStudyStore((s) => s.setView);
  const sidebarOpen = useStudyStore((s) => s.sidebarOpen);
  const setSidebar = useStudyStore((s) => s.setSidebar);
  const setSearch = useStudyStore((s) => s.setSearch);
  const accent = SUBJECT_META[track].accent;
  const sections = buildSections(track);

  // Collapsed state persists across track switches (a section you opened
  // for Science stays open when you flip to Maths) — it's a UI preference,
  // not subject-specific data.
  const [openMap, setOpenMap] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(sections.map((s) => [s.key, s.defaultOpen]))
  );
  const toggle = (key: string) => setOpenMap((m) => ({ ...m, [key]: !m[key] }));

  return (
    <>
      {/* mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden" onClick={() => setSidebar(false)} />
      )}

      <aside
        className={`liquid-sheen glass-refract-lg grain fixed lg:sticky top-0 left-0 z-50 lg:z-10 h-screen lg:h-screen w-64 sm:w-72 lg:w-64 shrink-0 bg-sidebar/95 lg:bg-sidebar/80 backdrop-blur-xl backdrop-saturate-150 border-r border-sidebar-border/50 flex flex-col overflow-hidden transition-transform duration-300 pt-safe ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* ambient glow bleeding from the top, tinted to the active subject */}
        <div className="ambient-orb size-40 -top-16 -left-8" style={{ background: accent }} />

        {/* logo row — clickable to go home */}
        <div className="relative z-10 flex items-center gap-2 px-4 py-3.5">
          <button
            onClick={() => { setView("home"); setSidebar(false); }}
            className="tap-lift flex items-center gap-2 flex-1 min-w-0 text-left"
          >
            <div
              className="glow-ring size-8 rounded-xl bg-primary text-primary-foreground flex items-center justify-center text-sm shrink-0"
              style={{ boxShadow: `0 0 0 1px ${accent}59, 0 6px 18px -4px ${accent}80` }}
            >
              {SUBJECT_META[track].icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-display font-bold text-[13px] leading-tight text-foreground">StudyHub</div>
              <div className="text-[9px] text-muted-foreground/70">{SUBJECT_META[track].label}</div>
            </div>
          </button>
          <button
            onClick={() => setSidebar(false)}
            className="press-scale lg:hidden text-muted-foreground hover:text-foreground p-2 -m-1 rounded-lg hover:bg-accent"
            aria-label="Close menu"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="relative z-10 px-3 pb-2">
          <TrackToggle />
          <button
            onClick={() => { setSearch(true); }}
            className="glass glass-interactive glass-refract-sm w-full text-left text-[11px] px-2.5 py-2 rounded-lg text-muted-foreground/60 hover:text-muted-foreground transition mb-1"
          >
            <span className="opacity-50">⌘K</span> Search…
          </button>
        </div>

        {/* nav */}
        <nav className="relative z-10 flex-1 overflow-y-auto scroll-thin px-2 pb-2">
          {sections.map((section) => {
            const isOpen = openMap[section.key];
            const activeInSection = section.items.some((it) => it.id === view);
            return (
              <div key={section.key} className="mb-0.5">
                <button
                  onClick={() => toggle(section.key)}
                  className="press-scale w-full flex items-center gap-1.5 px-3 pt-3 pb-1 group"
                >
                  <ChevronRight
                    className={`size-2.5 text-muted-foreground/40 transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${isOpen ? "rotate-90" : ""}`}
                  />
                  <span className="text-[9px] font-semibold uppercase tracking-widest text-muted-foreground/50 group-hover:text-muted-foreground/80 transition">
                    {section.label}
                  </span>
                  {!isOpen && (
                    <span
                      className="ml-auto text-[9px] tabular-nums px-1.5 rounded-full"
                      style={
                        activeInSection
                          ? { background: `${accent}25`, color: accent }
                          : { background: "color-mix(in oklch, var(--foreground) 8%, transparent)", color: "var(--muted-foreground)" }
                      }
                    >
                      {section.items.length}
                    </span>
                  )}
                </button>
                {isOpen && section.items.map((item, i) => {
                  const active = view === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setView(item.id)}
                      className={`tap-lift animate-rise stagger-${Math.min((i % 7) + 1, 7)} group relative w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] transition-all ${
                        active
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-muted-foreground/80 hover:text-foreground hover:bg-muted/40"
                      }`}
                    >
                      {active && (
                        <span
                          className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-full"
                          style={{ background: accent, boxShadow: `0 0 8px ${accent}` }}
                        />
                      )}
                      <span className={`icon-nudge transition ${active ? "text-primary" : "text-muted-foreground/60 group-hover:text-foreground"}`}>
                        {item.icon}
                      </span>
                      <span className="flex-1 text-left">{item.label}</span>
                      {item.badge && (
                        <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-medium tabular-nums ${
                          active ? "bg-primary/20 text-primary" : "bg-muted/60 text-muted-foreground/70"
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </nav>

        {/* Settings — pinned, always one click away regardless of section state */}
        <div className="relative z-10 px-2 pb-1">
          <button
            onClick={() => setView("settings")}
            className={`tap-lift group w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] transition-all ${
              view === "settings" ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground/80 hover:text-foreground hover:bg-muted/40"
            }`}
          >
            <Settings className="icon-nudge size-4" />
            <span className="flex-1 text-left">Settings</span>
          </button>
        </div>

        {/* Profile chip — equipped avatar/title + coin balance, tap to open the Shop */}
        <ProfileChip />

        {/* XP footer */}
        <div className="relative z-10 border-t border-sidebar-border">
          <XpBar />
        </div>
      </aside>
    </>
  );
}

function ProfileChip() {
  const coins = useStudyStore((s) => s.coins);
  const equippedAvatar = useStudyStore((s) => s.equippedAvatar);
  const equippedTitle = useStudyStore((s) => s.equippedTitle);
  const setView = useStudyStore((s) => s.setView);
  const avatar = findAvatar(equippedAvatar);
  const title = findTitle(equippedTitle);

  return (
    <button
      onClick={() => setView("shop")}
      className="glass glass-interactive glass-refract-sm relative z-10 mx-2 mb-1 flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left"
    >
      <div className="size-8 rounded-full bg-accent flex items-center justify-center text-base shrink-0 border border-border/60">
        {avatar.emoji}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[11px] font-semibold truncate">{title ? title.label : "Tap to visit Shop"}</div>
        <div className="text-[9px] text-muted-foreground/60">Customize your profile</div>
      </div>
      <div className="flex items-center gap-1 text-[12px] font-bold tabular-nums px-2 py-1 rounded-full bg-amber-400/15 text-amber-500 dark:text-amber-300 shrink-0">
        <Coins className="size-3.5" />
        {coins}
      </div>
    </button>
  );
}
