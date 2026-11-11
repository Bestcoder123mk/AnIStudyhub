"use client";

import { Check as CheckIcon, ChevronDown as ChevronDownIcon, ChevronsUpDown, MoreHorizontal, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Mascot } from "@/components/shared/mascot";
import { SubjectIcon } from "@/components/shared/subject-icon";
import { useEffect, useMemo, useState } from "react";
import { useStudyStore, SUBJECT_META, type ViewId, type Track } from "@/store/use-study-store";
import { XpBar } from "@/components/shared/xp-bar";
import { StatPills } from "@/components/shared/stat-pills";
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
  Search, Settings, X, BookMarked, ShoppingBag, Coins, StickyNote, PenTool, ClipboardCheck,
} from "lucide-react";

interface NavItem { id: ViewId; label: string; icon: React.ReactNode; badge?: string; }
interface Section { key: string; label: string; defaultOpen: boolean; items: NavItem[]; }
// A section with an empty label is the always-visible core group (no header, never collapses).

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
  { id: "sqp", label: "Sample Papers", icon: <ClipboardCheck className="size-4" />, badge: "2026-27" },
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
        { id: "concepts", label: "Concept Lessons", icon: <GraduationCap className="size-4" /> },
      ];
      case "maths": return [
        { id: "maths-dash", label: "Dashboard", icon: <Rocket className="size-4" /> },
        { id: "maths-chapters", label: "All Chapters", icon: <BookOpen className="size-4" />, badge: String(MATHS_CHAPTERS.length) },
        { id: "concepts", label: "Concept Lessons", icon: <GraduationCap className="size-4" /> },
      ];
      case "english": return [
        { id: "eng-dash", label: "Dashboard", icon: <Rocket className="size-4" /> },
        { id: "eng-chapters", label: "Prose & Poetry", icon: <BookOpen className="size-4" />, badge: String(ENG_CHAPTERS.length) },
        { id: "concepts", label: "Concept Lessons", icon: <GraduationCap className="size-4" /> },
      ];
      case "sanskrit": return [
        { id: "skt-dash", label: "Dashboard", icon: <Rocket className="size-4" /> },
        { id: "skt-chapters", label: "Shemushi Chapters", icon: <BookOpen className="size-4" />, badge: String(SKT_CHAPTERS.length) },
        { id: "concepts", label: "Concept Lessons", icon: <GraduationCap className="size-4" /> },
      ];
      default: return [
        { id: "dash", label: "Dashboard", icon: <Rocket className="size-4" /> },
        { id: "chapters", label: "All Chapters", icon: <BookOpen className="size-4" />, badge: String(CHAPTERS.length) },
        { id: "concepts", label: "Concept Lessons", icon: <GraduationCap className="size-4" /> },
      ];
    }
  })();
  const museum: NavItem = { id: "museum", label: "3D Museum", icon: <Boxes className="size-4" /> };

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

  const tutor = smartTools.find((t) => t.id === "tutor")!;
  const otherSmart = smartTools.filter((t) => t.id !== "tutor");
  return [
    { key: "core", label: "", defaultOpen: true, items: [...study, tutor] },
    { key: "practice", label: "Practice", defaultOpen: true, items: practice },
    { key: "tools", label: "Study tools", defaultOpen: false, items: [...otherSmart, ...focusTools] },
    { key: "rewards", label: "Rewards & play", defaultOpen: false, items: [...progressTools(achId), ...playTools] },
    { key: "more", label: "More", defaultOpen: false, items: [museum, ...exploreTools, ...supportTools] },
  ];
}

const SUBJECTS: Track[] = ["science", "ssc", "maths", "english", "sanskrit"];
const NAV_COLLAPSED_KEY = "studyhub-nav-collapsed";
const NAV_OPEN_KEY = "studyhub-nav-open";

/** A UI preference kept in localStorage (not the study store): read after mount so SSR and hydration agree. */
function useLocalPref<T extends object>(key: string, initial: T) {
  const [v, setV] = useState<T>(initial);
  useEffect(() => {
    try { const raw = localStorage.getItem(key); if (raw !== null) setV({ ...initial, ...JSON.parse(raw) }); } catch { /* keep default */ }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  const set = (next: T) => { setV(next); try { localStorage.setItem(key, JSON.stringify(next)); } catch { /* ignore */ } };
  return [v, set] as const;
}
function useIsDesktop() {
  const [d, setD] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const on = () => setD(mq.matches);
    on(); mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return d;
}
const ink = (hex: string) => `color-mix(in oklch, ${hex} var(--atm, 100%), black)`;

function SubjectSwitcher({ rail }: { rail: boolean }) {
  const track = useStudyStore((s) => s.track);
  const setTrack = useStudyStore((s) => s.setTrack);
  const [open, setOpen] = useState(false);
  const meta = SUBJECT_META[track];
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          aria-label={`Subject: ${meta.label}. Switch subject`}
          title={rail ? meta.label : undefined}
          className={`flex w-full items-center gap-2.5 rounded-xl border border-[var(--edge)] bg-card text-left outline-none transition hover:border-[color-mix(in_oklch,var(--primary)_40%,var(--edge))] focus-visible:ring-2 focus-visible:ring-ring ${rail ? "justify-center p-1.5" : "px-2.5 py-2"}`}
        >
          <span className="grid size-8 shrink-0 place-items-center rounded-lg" style={{ background: `color-mix(in oklch, ${meta.accent} 16%, transparent)`, color: ink(meta.accent) }}>
            <SubjectIcon track={track} className="size-[18px]" />
          </span>
          {!rail && (
            <>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[14px] font-semibold leading-tight">{meta.label}</span>
                <span className="block text-[11px] leading-tight text-muted-foreground">Class 10 · CBSE</span>
              </span>
              <ChevronsUpDown className="size-4 shrink-0 text-muted-foreground" />
            </>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" side={rail ? "right" : "bottom"} sideOffset={8} className="w-60 p-1.5">
        <div className="px-2 pb-1 pt-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Subject</div>
        {SUBJECTS.map((s) => {
          const m = SUBJECT_META[s];
          const on = s === track;
          return (
            <button key={s} onClick={() => { setTrack(s); setOpen(false); }} aria-label={`Switch to ${m.label}`} aria-current={on ? "true" : undefined}
              className="flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left text-[14px] outline-none transition hover:bg-accent focus-visible:bg-accent">
              <span className="grid size-7 shrink-0 place-items-center rounded-md" style={{ background: `color-mix(in oklch, ${m.accent} 16%, transparent)`, color: ink(m.accent) }}><SubjectIcon track={s} className="size-4" /></span>
              <span className={`flex-1 ${on ? "font-semibold" : "font-medium"}`}>{m.label}</span>
              {on && <CheckIcon className="size-4 text-muted-foreground" />}
            </button>
          );
        })}
      </PopoverContent>
    </Popover>
  );
}

function NavRow({ item, active, rail, accent, onClick }: { item: NavItem; active: boolean; rail: boolean; accent: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      title={rail ? item.label : undefined}
      aria-label={rail ? item.label : undefined}
      aria-current={active ? "page" : undefined}
      className={`group relative flex w-full items-center rounded-lg text-[14px] font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring ${rail ? "h-10 justify-center" : "h-9 gap-2.5 px-2.5"} ${active ? "text-foreground" : "text-muted-foreground hover:bg-foreground/[0.05] hover:text-foreground"}`}
      style={active ? { background: `color-mix(in oklch, ${accent} 13%, transparent)` } : undefined}
    >
      {active && <span aria-hidden className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-full" style={{ background: accent }} />}
      <span className="grid size-[18px] shrink-0 place-items-center [&_svg]:size-[18px]" style={active ? { color: ink(accent) } : undefined}>{item.icon}</span>
      {!rail && <span className="flex-1 truncate text-left">{item.label}</span>}
      {!rail && item.badge && <span className="rounded-md bg-foreground/[0.07] px-1.5 py-0.5 text-[10px] font-semibold tabular-nums text-muted-foreground">{item.badge}</span>}
    </button>
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
  const sections = useMemo(() => buildSections(track), [track]);
  const isDesktop = useIsDesktop();
  const [collapsedPref, setCollapsedPref] = useLocalPref<{ v: boolean }>(NAV_COLLAPSED_KEY, { v: false });
  const rail = collapsedPref.v && isDesktop; // the icon-only rail is a desktop affordance; the phone drawer is always full
  const [openMap, setOpenMap] = useLocalPref<Record<string, boolean>>(NAV_OPEN_KEY, Object.fromEntries(sections.map((x) => [x.key, x.defaultOpen])));
  const setOpen = (key: string, v: boolean) => setOpenMap({ ...openMap, [key]: v });

  // Whatever you navigate to must be visible: open the group that holds the active page.
  useEffect(() => {
    const g = sections.find((x) => x.label && x.items.some((i) => i.id === view));
    if (g && openMap[g.key] === false) setOpenMap({ ...openMap, [g.key]: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, track]);

  const go = (id: ViewId) => { setView(id); setSidebar(false); };

  return (
    <>
      {sidebarOpen && <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden" onClick={() => setSidebar(false)} />}

      <aside
        aria-label="Primary navigation"
        className={`fixed lg:sticky top-0 left-0 z-50 lg:z-10 flex h-screen shrink-0 flex-col border-r border-[var(--edge)] bg-sidebar transition-[transform,width] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] w-64 sm:w-72 ${rail ? "lg:w-[68px]" : "lg:w-64"} max-lg:shadow-2xl ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* brand */}
        <div className={`flex items-center gap-2 pt-4 ${rail ? "justify-center px-2" : "px-4"}`}>
          <button onClick={() => go("home")} className="flex min-w-0 items-center gap-2.5 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring" aria-label="StudyHub home">
            <Mascot mood="happy" size={rail ? 34 : 30} decorative />
            {!rail && <span className="text-[17px] font-semibold tracking-tight">StudyHub</span>}
          </button>
          {!rail && <span className="flex-1" />}
          {!rail && (
            <button onClick={() => setSidebar(false)} className="grid size-8 place-items-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground lg:hidden" aria-label="Close menu">
              <X className="size-4" />
            </button>
          )}
        </div>

        {/* subject + search */}
        <div className={`space-y-2 pt-3 ${rail ? "px-2" : "px-3"}`}>
          <SubjectSwitcher rail={rail} />
          {rail ? (
            <button onClick={() => setSearch(true)} title="Search (⌘K)" aria-label="Search" className="grid h-10 w-full place-items-center rounded-lg text-muted-foreground transition hover:bg-foreground/[0.06] hover:text-foreground"><Search className="size-[18px]" /></button>
          ) : (
            <button onClick={() => setSearch(true)} className="flex h-9 w-full items-center gap-2 rounded-lg border border-[var(--edge)] bg-[color-mix(in_oklch,var(--edge)_22%,var(--background))] px-2.5 text-left text-[13px] text-muted-foreground outline-none transition hover:border-primary/40 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring">
              <Search className="size-4" />
              <span className="flex-1">Search</span>
              <kbd className="rounded border border-[var(--edge)] px-1.5 py-0.5 text-[10px] font-medium">⌘K</kbd>
            </button>
          )}
        </div>

        {/* navigation */}
        <nav className={`scroll-thin mt-2 flex-1 overflow-y-auto pb-6 [mask-image:linear-gradient(to_bottom,black_calc(100%-20px),transparent)] ${rail ? "px-2" : "px-2.5"}`} aria-label="Pages">
          {sections.map((sec) => {
            const headerless = sec.label === "";
            const isOpen = headerless || (openMap[sec.key] ?? sec.defaultOpen);
            return (
              <div key={sec.key} className={headerless ? "space-y-0.5" : ""}>
                {!headerless && (rail ? (
                  <div className="mx-2 my-2.5 h-px bg-[var(--edge)]" />
                ) : (
                  <button onClick={() => setOpen(sec.key, !isOpen)} aria-expanded={isOpen} className="mt-3 flex w-full items-center gap-1 rounded-md px-2.5 pb-1 pt-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground outline-none transition hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring">
                    <span className="flex-1 text-left">{sec.label}</span>
                    <span className="text-[10px] font-medium tabular-nums opacity-60">{sec.items.length}</span>
                    <ChevronDownIcon className={`size-3.5 transition-transform duration-200 ${isOpen ? "" : "-rotate-90"}`} />
                  </button>
                ))}
                {(!rail || isOpen) && (
                  <div className="grid transition-[grid-template-rows] duration-200 ease-out" style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }} {...(!isOpen ? { inert: true } : {})}>
                    <div className="space-y-0.5 overflow-hidden">
                      {sec.items.map((item) => (
                        <NavRow key={item.id} item={item} active={view === item.id} rail={rail} accent={accent} onClick={() => go(item.id)} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          {rail && (
            <button onClick={() => setCollapsedPref({ v: false })} title="Show all pages" aria-label="Expand sidebar to show all pages" className="mt-2 grid h-10 w-full place-items-center rounded-lg text-muted-foreground transition hover:bg-foreground/[0.06] hover:text-foreground">
              <MoreHorizontal className="size-[18px]" />
            </button>
          )}
        </nav>

        {/* footer: profile, progress, quick actions */}
        <div className={`border-t border-[var(--edge)] ${rail ? "space-y-1.5 p-2" : "space-y-2.5 p-3"}`}>
          <ProfileChip rail={rail} />
          {!rail && <XpBar compact />}
          <div className={`flex ${rail ? "flex-col items-center gap-1" : "items-center gap-1"}`}>
            {!rail && <StatPills />}
            {!rail && <span className="flex-1" />}
            <button onClick={() => go("settings")} title="Settings" aria-label="Settings" aria-current={view === "settings" ? "page" : undefined}
              className={`grid size-8 place-items-center rounded-lg outline-none transition hover:bg-foreground/[0.07] hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring ${view === "settings" ? "text-foreground" : "text-muted-foreground"}`}>
              <Settings className="size-4" />
            </button>
            <button onClick={() => setCollapsedPref({ v: !collapsedPref.v })} title={rail ? "Expand sidebar" : "Collapse sidebar"} aria-label={rail ? "Expand sidebar" : "Collapse sidebar"}
              className="hidden size-8 place-items-center rounded-lg text-muted-foreground outline-none transition hover:bg-foreground/[0.07] hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring lg:grid">
              {rail ? <PanelLeftOpen className="size-4" /> : <PanelLeftClose className="size-4" />}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

function ProfileChip({ rail }: { rail: boolean }) {
  const coins = useStudyStore((s) => s.coins);
  const equippedAvatar = useStudyStore((s) => s.equippedAvatar);
  const equippedTitle = useStudyStore((s) => s.equippedTitle);
  const setView = useStudyStore((s) => s.setView);
  const avatar = findAvatar(equippedAvatar);
  const title = findTitle(equippedTitle);
  return (
    <button onClick={() => setView("shop")} title={rail ? `${title ? title.label : "Profile"} · ${coins} coins` : undefined} aria-label="Open the shop and customise your profile"
      className={`flex w-full items-center rounded-xl border border-[var(--edge)] bg-card text-left outline-none transition hover:border-primary/40 focus-visible:ring-2 focus-visible:ring-ring ${rail ? "justify-center p-1.5" : "gap-2.5 px-2.5 py-2"}`}>
      <span className="grid size-8 shrink-0 place-items-center rounded-full border border-border/60 bg-accent text-base">{avatar.emoji}</span>
      {!rail && (
        <>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[13px] font-semibold leading-tight">{title ? title.label : "Your profile"}</span>
            <span className="block truncate text-[11px] leading-tight text-muted-foreground">Customise in the shop</span>
          </span>
          <span className="flex shrink-0 items-center gap-1 rounded-full bg-foreground/[0.07] px-2 py-1 text-[12px] font-semibold tabular-nums" style={{ color: "var(--gold-text)" }}><Coins className="size-3.5" />{coins}</span>
        </>
      )}
    </button>
  );
}
