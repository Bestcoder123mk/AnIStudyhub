"use client";

import { Component, Suspense, lazy, useEffect, useState, useRef, type ComponentType, type ReactNode } from "react";
import { motion } from "framer-motion";
import { useStudyStore, SUBJECT_META } from "@/store/use-study-store";
import { Button } from "@/components/ui/button";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { HomeScreen } from "@/components/layout/home-screen";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileHeader } from "@/components/layout/mobile-header";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { Footer } from "@/components/layout/footer";
import { SearchOverlay } from "@/components/layout/search-overlay";
import { ToastContainer, PopupLayer } from "@/components/shared/feedback";
import { AuroraBackground } from "@/components/shared/aurora-background";
import { RoomAmbience } from "@/components/shared/room-ambience";



import { QuickNoteFab } from "@/components/shared/quick-note-fab";

// ---------------------------------------------------------------------------------
// Views load on demand.
//
// There are 71 of them, and they used to be imported statically — so the
// first screen shipped all of them (and three.js / react-three-fiber for the 3D
// museum and galaxy) before showing anything: ~1.3 MB of compressed JS. Each one
// is now its own chunk, fetched the first time it is opened. `preload()` lets us
// warm the likely ones in idle time (see the prefetch effect in Page) so
// navigation still feels instant.
// ---------------------------------------------------------------------------------
type PreloadableView = ComponentType & { preload: () => Promise<unknown>; reset: () => void };

function lazyView<K extends string>(load: () => Promise<Record<K, ComponentType>>, name: K): PreloadableView {
  // A chunk fetch fails now and then (a flaky connection, a tab that outlived a deploy). Retry a couple
  // of times with a short back-off before giving up, so most blips never reach the student.
  const loadWithRetry = async () => {
    for (let attempt = 0; ; attempt++) {
      try {
        return await load();
      } catch (err) {
        if (attempt >= 2) throw err;
        await new Promise((r) => setTimeout(r, 400 * (attempt + 1)));
      }
    }
  };
  const make = () => lazy(() => loadWithRetry().then((m) => ({ default: m[name] as ComponentType })));
  // React.lazy remembers a failure for good, so a view that failed would stay broken until a full reload.
  // Rendering through a wrapper lets "Try again" swap in a fresh lazy component.
  let Inner = make();
  const View = () => <Inner />; // views take no props
  return Object.assign(View, {
    preload: loadWithRetry,
    reset: () => {
      Inner = make();
    },
  });
}

const GalaxyView = lazyView(() => import("@/components/views/galaxy"), "GalaxyView");
const DashboardView = lazyView(() => import("@/components/views/dashboard"), "DashboardView");
const ChaptersView = lazyView(() => import("@/components/views/chapters"), "ChaptersView");
const McqQuizView = lazyView(() => import("@/components/views/mcq-quiz"), "McqQuizView");
const ShortQaView = lazyView(() => import("@/components/views/short-qa"), "ShortQaView");
const LongQaView = lazyView(() => import("@/components/views/long-qa"), "LongQaView");
const FlashcardsView = lazyView(() => import("@/components/views/flashcards"), "FlashcardsView");
const FormulasView = lazyView(() => import("@/components/views/formulas"), "FormulasView");
const MockTestView = lazyView(() => import("@/components/views/mock-test"), "MockTestView");
const PomodoroView = lazyView(() => import("@/components/views/pomodoro"), "PomodoroView");
const SpeedrunView = lazyView(() => import("@/components/views/speedrun"), "SpeedrunView");
const AnalyticsView = lazyView(() => import("@/components/views/analytics"), "AnalyticsView");
const MistakesView = lazyView(() => import("@/components/views/mistakes"), "MistakesView");
const BookmarksView = lazyView(() => import("@/components/views/bookmarks"), "BookmarksView");
const AchievementsView = lazyView(() => import("@/components/views/achievements"), "AchievementsView");
const AiTutorView = lazyView(() => import("@/components/views/ai-tutor"), "AiTutorView");
const SettingsView = lazyView(() => import("@/components/views/settings"), "SettingsView");
const MuseumView = lazyView(() => import("@/components/museum/museum-view"), "MuseumView");
const SscDashboardView = lazyView(() => import("@/components/views/ssc-dashboard"), "SscDashboardView");
const SscChaptersView = lazyView(() => import("@/components/views/ssc-chapters"), "SscChaptersView");
const SscMcqView = lazyView(() => import("@/components/views/ssc-mcq"), "SscMcqView");
const SscShortQaView = lazyView(() => import("@/components/views/ssc-short-qa"), "SscShortQaView");
const SscLongQaView = lazyView(() => import("@/components/views/ssc-long-qa"), "SscLongQaView");
const SscFlashcardsView = lazyView(() => import("@/components/views/ssc-flashcards"), "SscFlashcardsView");
const SscAchievementsView = lazyView(() => import("@/components/views/ssc-achievements"), "SscAchievementsView");
const MathsDashboardView = lazyView(() => import("@/components/views/maths-dashboard"), "MathsDashboardView");
const MathsChaptersView = lazyView(() => import("@/components/views/maths-chapters"), "MathsChaptersView");
const MathsMcqView = lazyView(() => import("@/components/views/maths-mcq"), "MathsMcqView");
const MathsShortQaView = lazyView(() => import("@/components/views/maths-short-qa"), "MathsShortQaView");
const MathsLongQaView = lazyView(() => import("@/components/views/maths-long-qa"), "MathsLongQaView");
const MathsFormulasView = lazyView(() => import("@/components/views/maths-formulas"), "MathsFormulasView");
const MathsFlashcardsView = lazyView(() => import("@/components/views/maths-flashcards"), "MathsFlashcardsView");
const MathsMockView = lazyView(() => import("@/components/views/maths-mock"), "MathsMockView");
const MathsAchievementsView = lazyView(() => import("@/components/views/maths-achievements-v2"), "MathsAchievementsV2");
const EngDashboardView = lazyView(() => import("@/components/views/eng-dashboard"), "EngDashboardView");
const EngChaptersView = lazyView(() => import("@/components/views/eng-chapters"), "EngChaptersView");
const EngMcqView = lazyView(() => import("@/components/views/eng-mcq"), "EngMcqView");
const EngShortQaView = lazyView(() => import("@/components/views/eng-short-qa"), "EngShortQaView");
const EngLongQaView = lazyView(() => import("@/components/views/eng-long-qa"), "EngLongQaView");
const EngFlashcardsView = lazyView(() => import("@/components/views/eng-flashcards"), "EngFlashcardsView");
const EngMockView = lazyView(() => import("@/components/views/eng-mock"), "EngMockView");
const EngAchievementsView = lazyView(() => import("@/components/views/eng-achievements-v2"), "EngAchievementsV2");
const SktDashboardView = lazyView(() => import("@/components/views/skt-dashboard"), "SktDashboardView");
const SktChaptersView = lazyView(() => import("@/components/views/skt-chapters"), "SktChaptersView");
const SktMcqView = lazyView(() => import("@/components/views/skt-mcq"), "SktMcqView");
const SktShortQaView = lazyView(() => import("@/components/views/skt-short-qa"), "SktShortQaView");
const SktLongQaView = lazyView(() => import("@/components/views/skt-long-qa"), "SktLongQaView");
const SktFlashcardsView = lazyView(() => import("@/components/views/skt-flashcards"), "SktFlashcardsView");
const SktMockView = lazyView(() => import("@/components/views/skt-mock"), "SktMockView");
const SktAchievementsView = lazyView(() => import("@/components/views/skt-achievements-v2"), "SktAchievementsV2");
const SktTranslatorView = lazyView(() => import("@/components/views/skt-translator"), "SktTranslatorView");
const ReviewView = lazyView(() => import("@/components/views/review"), "ReviewView");
const SkillTreeView = lazyView(() => import("@/components/views/skill-tree"), "SkillTreeView");
const LeaderboardView = lazyView(() => import("@/components/views/leaderboard"), "LeaderboardView");
const PlannerView = lazyView(() => import("@/components/views/planner"), "PlannerView");
const BattleView = lazyView(() => import("@/components/views/battle"), "BattleView");
const DungeonsView = lazyView(() => import("@/components/views/dungeons"), "DungeonsView");
const LabView = lazyView(() => import("@/components/views/lab"), "LabView");
const ResearchView = lazyView(() => import("@/components/views/research"), "ResearchView");
const CareerView = lazyView(() => import("@/components/views/career"), "CareerView");
const TeacherView = lazyView(() => import("@/components/views/teacher"), "TeacherView");
const ParentView = lazyView(() => import("@/components/views/parent"), "ParentView");
const SocialView = lazyView(() => import("@/components/views/social"), "SocialView");
const GuildView = lazyView(() => import("@/components/views/guild"), "GuildView");
const CollectionsView = lazyView(() => import("@/components/views/collections"), "CollectionsView");
const SeasonalView = lazyView(() => import("@/components/views/seasonal"), "SeasonalView");
const NcertResourcesView = lazyView(() => import("@/components/views/ncert-resources"), "NcertResourcesView");
const SqpView = lazyView(() => import("@/components/views/sqp"), "SqpView");
const ShopView = lazyView(() => import("@/components/views/shop"), "ShopView");
const NotesView = lazyView(() => import("@/components/views/notes"), "NotesView");
const DiagramPracticeView = lazyView(() => import("@/components/views/diagram-practice"), "DiagramPracticeView");

const VIEW_MAP: Record<string, PreloadableView> = {
  dash: DashboardView,
  chapters: ChaptersView,
  mcq: McqQuizView,
  short: ShortQaView,
  long: LongQaView,
  flash: FlashcardsView,
  formulas: FormulasView,
  mock: MockTestView,
  timer: PomodoroView,
  speedrun: SpeedrunView,
  analytics: AnalyticsView,
  mistakes: MistakesView,
  bookmarks: BookmarksView,
  ach: AchievementsView,
  tutor: AiTutorView,
  settings: SettingsView,
  museum: MuseumView,
  galaxy: GalaxyView,
  "ssc-dash": SscDashboardView,
  "ssc-chapters": SscChaptersView,
  "ssc-mcq": SscMcqView,
  "ssc-short": SscShortQaView,
  "ssc-long": SscLongQaView,
  "ssc-flash": SscFlashcardsView,
  "ssc-ach": SscAchievementsView,
  "maths-dash": MathsDashboardView,
  "maths-chapters": MathsChaptersView,
  "maths-mcq": MathsMcqView,
  "maths-short": MathsShortQaView,
  "maths-long": MathsLongQaView,
  "maths-formulas": MathsFormulasView,
  "maths-ach": MathsAchievementsView,
  "maths-flash": MathsFlashcardsView,
  "maths-mock": MathsMockView,
  "eng-dash": EngDashboardView,
  "eng-chapters": EngChaptersView,
  "eng-mcq": EngMcqView,
  "eng-short": EngShortQaView,
  "eng-long": EngLongQaView,
  "eng-ach": EngAchievementsView,
  "eng-flash": EngFlashcardsView,
  "eng-mock": EngMockView,
  "skt-dash": SktDashboardView,
  "skt-chapters": SktChaptersView,
  "skt-mcq": SktMcqView,
  "skt-short": SktShortQaView,
  "skt-long": SktLongQaView,
  "skt-ach": SktAchievementsView,
  "skt-flash": SktFlashcardsView,
  "skt-mock": SktMockView,
  "skt-translator": SktTranslatorView,
  review: ReviewView,
  "skill-tree": SkillTreeView,
  leaderboard: LeaderboardView,
  planner: PlannerView,
  battle: BattleView,
  dungeons: DungeonsView,
  lab: LabView,
  research: ResearchView,
  career: CareerView,
  teacher: TeacherView,
  parent: ParentView,
  social: SocialView,
  guild: GuildView,
  collections: CollectionsView,
  seasonal: SeasonalView,
  resources: NcertResourcesView,
  sqp: SqpView,
  shop: ShopView,
  notes: NotesView,
  diagrams: DiagramPracticeView,
};

// Linear-style keyboard shortcuts: press "g" then a key to navigate
function KeyboardShortcuts() {
  const setView = useStudyStore((s) => s.setView);
  const setSearch = useStudyStore((s) => s.setSearch);
  const setQuickNoteOpen = useStudyStore((s) => s.setQuickNoteOpen);
  const gPressed = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [helpOpen, setHelpOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || (e.target as HTMLElement)?.isContentEditable) return;
      const key = e.key.toLowerCase();

      if (key === "g" && !gPressed.current) {
        gPressed.current = true;
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(() => { gPressed.current = false; }, 1200);
        return;
      }
      if (gPressed.current) {
        const map: Record<string, string> = {
          d: "dash", h: "home", m: "museum", t: "tutor", a: "analytics",
          s: "settings", g: "galaxy", b: "bookmarks", k: "search", n: "notes", p: "sqp",
        };
        const target = map[key];
        if (target) {
          e.preventDefault();
          if (target === "search") setSearch(true);
          else if (target === "home") setView("home");
          else setView(target as never);
        }
        gPressed.current = false;
        if (timer.current) clearTimeout(timer.current);
        return;
      }
      // Bare "n" — instant note capture from anywhere, no "g" prefix needed
      // since jotting a note is meant to interrupt whatever you're doing.
      if (key === "n") {
        e.preventDefault();
        setQuickNoteOpen(true);
        return;
      }
      if (key === "?") {
        e.preventDefault();
        setHelpOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setView, setSearch, setQuickNoteOpen]);

  return helpOpen ? <ShortcutsHelp onClose={() => setHelpOpen(false)} /> : null;
}

const SHORTCUT_LIST: [string, string][] = [
  ["⌘/Ctrl K", "Search"],
  ["N", "Quick note"],
  ["G then D", "Dashboard"],
  ["G then H", "Home"],
  ["G then T", "AI Tutor"],
  ["G then N", "Notes"],
  ["G then A", "Analytics"],
  ["G then B", "Bookmarks"],
  ["G then M", "3D Museum"],
  ["G then P", "Sample Papers"],
  ["G then S", "Settings"],
  ["?", "Toggle this list"],
];

function ShortcutsHelp({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[105] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-float-up" onClick={onClose}>
      <div
        className="glass-strong rounded-3xl p-6 max-w-sm w-full border border-border/60 shadow-2xl animate-pop-in"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="font-display font-bold text-lg mb-4">Keyboard shortcuts</h3>
        <div className="space-y-2">
          {SHORTCUT_LIST.map(([keys, label]) => (
            <div key={label} className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{label}</span>
              <kbd className="px-2 py-1 rounded-md bg-muted text-[11px] font-mono font-medium">{keys}</kbd>
            </div>
          ))}
        </div>
        <Button onClick={onClose} className="w-full mt-5" variant="outline">Close</Button>
      </div>
    </div>
  );
}

// Before hydration completes the app previously rendered nothing at all —
// a blank white/black flash on every load. This shows a proper branded
// splash for that split second instead.
/** Shown for the instant a view's chunk is on its way (first open only). */
function ViewLoading() {
  return (
    <div className="space-y-5 animate-pulse" aria-busy="true" aria-label="Loading">
      <div className="h-9 w-56 rounded-lg bg-foreground/10" />
      <div className="h-4 w-80 max-w-full rounded bg-foreground/[0.07]" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-24 rounded-2xl bg-foreground/[0.06]" />
        ))}
      </div>
      <div className="h-64 rounded-2xl bg-foreground/[0.05]" />
    </div>
  );
}

/** The 3D museum is the heaviest chunk, so it gets a proper message rather than a skeleton. */
function MuseumLoading() {
  return (
    <div className="grid min-h-[70vh] place-items-center text-sm text-muted-foreground" aria-busy="true">
      <div className="space-y-2 text-center">
        <div className="mx-auto size-8 animate-spin rounded-full border-2 border-foreground/20 border-t-foreground/70" />
        <div>Loading the 3D museum…</div>
      </div>
    </div>
  );
}

/**
 * A view's chunk can fail to load (flaky connection, or a deploy replaced the files while a tab was open).
 * Without this, that is a blank screen; with it, one tap recovers. Resets itself when you change view.
 */
class ViewErrorBoundary extends Component<{ children: ReactNode; resetKey: string; onFail: () => void }, { error: Error | null; key: string }> {
  state = { error: null as Error | null, key: this.props.resetKey };
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  static getDerivedStateFromProps(props: { resetKey: string }, state: { key: string }) {
    return props.resetKey !== state.key ? { error: null, key: props.resetKey } : null;
  }
  componentDidCatch(error: Error) {
    console.error("[view] failed to render or load:", error);
    // Give the failed view a fresh loader right away, so BOTH "Try again" and simply navigating back to it
    // later start clean (React.lazy would otherwise remember the failure for the life of the page).
    this.props.onFail();
  }
  retry = () => this.setState({ error: null });
  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div role="alert" className="mx-auto mt-16 max-w-md space-y-4 rounded-2xl border border-border bg-card/60 p-6 text-center">
        <div className="text-lg font-semibold">This screen didn&apos;t load</div>
        <p className="text-sm text-muted-foreground">
          Usually a flaky connection, or the app updated in the background. Your progress is saved.
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <Button onClick={this.retry}>Try again</Button>
          <Button
            variant="outline"
            onClick={() => {
              const st = useStudyStore.getState();
              st.setView(SUBJECT_META[st.track]?.dash ?? "dash"); // each subject has its own dashboard
            }}
          >
            Back to dashboard
          </Button>
          <Button variant="ghost" onClick={() => window.location.reload()}>
            Reload page
          </Button>
        </div>
      </div>
    );
  }
}

function BootSplash() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-3">
        <div className="size-12 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold animate-pulse">
          S
        </div>
        <div className="size-5 rounded-full border-2 border-muted-foreground/20 border-t-foreground animate-spin" />
      </div>
    </div>
  );
}

export default function Home() {
  const view = useStudyStore((s) => s.view);
  const track = useStudyStore((s) => s.track);
  const setView = useStudyStore((s) => s.setView);
  const [entered, setEntered] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // keyboard shortcut for search — the rest of the app's shortcuts
    // ("g" then a letter, and bare "n" for quick notes) live in the
    // KeyboardShortcuts component below; this one stays here since it
    // needs to run before the app has necessarily "entered" past the
    // welcome screen.
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        useStudyStore.getState().setSearch(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // scroll to top on view change
  useEffect(() => {
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }, [view]);

  // Warm the view chunks in idle time, one at a time, so a first visit to any screen is usually instant.
  // The two three.js views are left to load on demand (they are by far the heaviest), and a metered or
  // slow connection gets no speculative downloads at all.
  useEffect(() => {
    if (!mounted || !entered) return;
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
    if (conn?.saveData || /(^|-)2g$/.test(conn?.effectiveType ?? "")) return;
    const prefix: Record<string, string> = { maths: "maths-", ssc: "ssc-", english: "eng-", sanskrit: "skt-" };
    const mine = prefix[useStudyStore.getState().track];
    const others = Object.values(prefix).filter((p) => p !== mine);
    const heavy = new Set(["museum", "galaxy"]);
    const ids = Object.keys(VIEW_MAP)
      .filter((id) => !heavy.has(id))
      .sort((a, b) => {
        const rank = (id: string) => (mine ? (id.startsWith(mine) ? 0 : 1) : others.some((p) => id.startsWith(p)) ? 1 : 0);
        return rank(a) - rank(b);
      });
    let i = 0;
    let cancelled = false;
    let timer = 0;
    const win = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number; cancelIdleCallback?: (h: number) => void };
    const schedule = (cb: () => void) => (win.requestIdleCallback ? win.requestIdleCallback(cb, { timeout: 3000 }) : window.setTimeout(cb, 500));
    const step = () => {
      if (cancelled || i >= ids.length) return;
      VIEW_MAP[ids[i++]].preload().catch(() => {});
      timer = schedule(step);
    };
    const start = window.setTimeout(() => (timer = schedule(step)), 2500); // let the first screen settle first
    return () => {
      cancelled = true;
      window.clearTimeout(start);
      if (win.cancelIdleCallback) win.cancelIdleCallback(timer);
      else window.clearTimeout(timer);
    };
  }, [mounted, entered]);

  if (!mounted) return <BootSplash />;

  // gate: home screen until user picks a track/tool this session
  if (!entered) {
    return (
      <ThemeProvider>
        <HomeScreen onEnter={() => setEntered(true)} />
        <ToastContainer />
      </ThemeProvider>
    );
  }

  const ViewComp = VIEW_MAP[view] || DashboardView;
  const isFullBleed = view === "museum";
  const showHome = view === "home";

  return (
    <ThemeProvider>
      <AuroraBackground />
      <RoomAmbience />
      <div className="min-h-screen flex flex-col bg-background/60 backdrop-blur-sm">
        {showHome ? (
          <HomeScreen onEnter={() => setView(SUBJECT_META[track].dash)} />
        ) : (
        <div className="flex flex-1">
          <Sidebar />
          <div className="flex-1 flex flex-col min-w-0">
            <MobileHeader />
            <main className={isFullBleed ? "flex-1 p-0" : "flex-1 px-4 sm:px-6 lg:px-8 py-5 pb-24 lg:pb-5 max-w-6xl w-full mx-auto"}>
              {/* Keyed so every view mounts fresh. This used to be AnimatePresence mode="wait" with an
                  opacity + scale fade, which cost every navigation ~640ms (old view out, THEN new view
                  in) and — because fading a container that holds blurred glass panels takes the light
                  from behind them for the duration — made the panels flash flat and snap back. A short
                  transform-only lift gives the sense of movement without either problem. */}
              <motion.div
                key={view}
                initial={{ y: 8 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              >
                <ViewErrorBoundary resetKey={view} onFail={() => VIEW_MAP[view]?.reset()}>
                  <Suspense fallback={isFullBleed ? <MuseumLoading /> : <ViewLoading />}>
                    <ViewComp />
                  </Suspense>
                </ViewErrorBoundary>
              </motion.div>
            </main>
            {!isFullBleed && <Footer />}
          </div>
        </div>
        )}
        {!showHome && <MobileBottomNav />}
        <SearchOverlay />
        <QuickNoteFab />
        <ToastContainer />
        <PopupLayer />
        <KeyboardShortcuts />
        <span className="hidden" data-track={track} data-setview={typeof setView} />
      </div>
    </ThemeProvider>
  );
}
