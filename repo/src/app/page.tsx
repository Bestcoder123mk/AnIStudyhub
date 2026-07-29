"use client";

import { useEffect, useState, useRef, type JSX } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useStudyStore, SUBJECT_META } from "@/store/use-study-store";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { HomeScreen } from "@/components/layout/home-screen";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileHeader } from "@/components/layout/mobile-header";
import { Footer } from "@/components/layout/footer";
import { SearchOverlay } from "@/components/layout/search-overlay";
import { ToastContainer, PopupLayer } from "@/components/shared/feedback";
import { AuroraBackground } from "@/components/shared/aurora-background";
import { RoomAmbience } from "@/components/shared/room-ambience";
import { GalaxyView } from "@/components/views/galaxy";

import { DashboardView } from "@/components/views/dashboard";
import { ChaptersView } from "@/components/views/chapters";
import { McqQuizView } from "@/components/views/mcq-quiz";
import { ShortQaView } from "@/components/views/short-qa";
import { LongQaView } from "@/components/views/long-qa";
import { FlashcardsView } from "@/components/views/flashcards";
import { FormulasView } from "@/components/views/formulas";
import { MockTestView } from "@/components/views/mock-test";
import { PomodoroView } from "@/components/views/pomodoro";
import { SpeedrunView } from "@/components/views/speedrun";
import { AnalyticsView } from "@/components/views/analytics";
import { MistakesView } from "@/components/views/mistakes";
import { BookmarksView } from "@/components/views/bookmarks";
import { AchievementsView } from "@/components/views/achievements";
import { AiTutorView } from "@/components/views/ai-tutor";
import { SettingsView } from "@/components/views/settings";
import { MuseumView } from "@/components/museum/museum-view";

import { SscDashboardView } from "@/components/views/ssc-dashboard";
import { SscChaptersView } from "@/components/views/ssc-chapters";
import { SscMcqView } from "@/components/views/ssc-mcq";
import { SscShortQaView } from "@/components/views/ssc-short-qa";
import { SscLongQaView } from "@/components/views/ssc-long-qa";
import { SscFlashcardsView } from "@/components/views/ssc-flashcards";
import { SscAchievementsView } from "@/components/views/ssc-achievements";

import { MathsDashboardView } from "@/components/views/maths-dashboard";
import { MathsChaptersView } from "@/components/views/maths-chapters";
import { MathsMcqView } from "@/components/views/maths-mcq";
import { MathsShortQaView } from "@/components/views/maths-short-qa";
import { MathsLongQaView } from "@/components/views/maths-long-qa";
import { MathsFormulasView } from "@/components/views/maths-formulas";
import { MathsAchievementsView } from "@/components/views/maths-achievements";
import { MathsFlashcardsView } from "@/components/views/maths-flashcards";
import { MathsMockView } from "@/components/views/maths-mock";
import { MathsAchievementsV2 } from "@/components/views/maths-achievements-v2";
import { EngDashboardView } from "@/components/views/eng-dashboard";
import { EngChaptersView } from "@/components/views/eng-chapters";
import { EngMcqView } from "@/components/views/eng-mcq";
import { EngShortQaView } from "@/components/views/eng-short-qa";
import { EngLongQaView } from "@/components/views/eng-long-qa";
import { EngAchievementsView } from "@/components/views/eng-achievements";
import { EngFlashcardsView } from "@/components/views/eng-flashcards";
import { EngMockView } from "@/components/views/eng-mock";
import { EngAchievementsV2 } from "@/components/views/eng-achievements-v2";
import { SktDashboardView } from "@/components/views/skt-dashboard";
import { SktChaptersView } from "@/components/views/skt-chapters";
import { SktMcqView } from "@/components/views/skt-mcq";
import { SktShortQaView } from "@/components/views/skt-short-qa";
import { SktLongQaView } from "@/components/views/skt-long-qa";
import { SktAchievementsView } from "@/components/views/skt-achievements";
import { SktFlashcardsView } from "@/components/views/skt-flashcards";
import { SktMockView } from "@/components/views/skt-mock";
import { SktAchievementsV2 } from "@/components/views/skt-achievements-v2";
import { SktTranslatorView } from "@/components/views/skt-translator";
import { ReviewView } from "@/components/views/review";
import { SkillTreeView } from "@/components/views/skill-tree";
import { LeaderboardView } from "@/components/views/leaderboard";
import { PlannerView } from "@/components/views/planner";
import { BattleView } from "@/components/views/battle";
import { DungeonsView } from "@/components/views/dungeons";
import { LabView } from "@/components/views/lab";
import { ResearchView } from "@/components/views/research";
import { CareerView } from "@/components/views/career";
import { TeacherView } from "@/components/views/teacher";
import { ParentView } from "@/components/views/parent";
import { SocialView } from "@/components/views/social";
import { GuildView } from "@/components/views/guild";
import { CollectionsView } from "@/components/views/collections";
import { SeasonalView } from "@/components/views/seasonal";
import { NcertResourcesView } from "@/components/views/ncert-resources";

const VIEW_MAP: Record<string, () => JSX.Element | null> = {
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
  "maths-ach-v2": MathsAchievementsV2,
  "eng-dash": EngDashboardView,
  "eng-chapters": EngChaptersView,
  "eng-mcq": EngMcqView,
  "eng-short": EngShortQaView,
  "eng-long": EngLongQaView,
  "eng-ach": EngAchievementsView,
  "eng-flash": EngFlashcardsView,
  "eng-mock": EngMockView,
  "eng-ach-v2": EngAchievementsV2,
  "skt-dash": SktDashboardView,
  "skt-chapters": SktChaptersView,
  "skt-mcq": SktMcqView,
  "skt-short": SktShortQaView,
  "skt-long": SktLongQaView,
  "skt-ach": SktAchievementsView,
  "skt-flash": SktFlashcardsView,
  "skt-mock": SktMockView,
  "skt-ach-v2": SktAchievementsV2,
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
};

// Linear-style keyboard shortcuts: press "g" then a key to navigate
function KeyboardShortcuts() {
  const setView = useStudyStore((s) => s.setView);
  const setSearch = useStudyStore((s) => s.setSearch);
  const gPressed = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

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
          s: "settings", g: "galaxy", b: "bookmarks", k: "search",
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
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setView, setSearch]);

  return null;
}

export default function Home() {
  const view = useStudyStore((s) => s.view);
  const track = useStudyStore((s) => s.track);
  const setView = useStudyStore((s) => s.setView);
  const [entered, setEntered] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // keyboard shortcut for search
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

  if (!mounted) return null;

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
            <main className={isFullBleed ? "flex-1 p-0" : "flex-1 px-4 sm:px-6 lg:px-8 py-5 max-w-6xl w-full mx-auto"}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={view}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  className={isFullBleed ? "" : ""}
                >
                  <ViewComp />
                </motion.div>
              </AnimatePresence>
            </main>
            {!isFullBleed && <Footer />}
          </div>
        </div>
        )}
        <SearchOverlay />
        <ToastContainer />
        <PopupLayer />
        <KeyboardShortcuts />
        <span className="hidden" data-track={track} data-setview={typeof setView} />
      </div>
    </ThemeProvider>
  );
}
