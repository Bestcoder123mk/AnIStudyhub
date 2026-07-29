"use client";

import { useStudyStore, type Track, SUBJECT_META } from "@/store/use-study-store";
import { Card, CardContent } from "@/components/ui/card";
import { Lock, Check, Coins, Sparkles } from "lucide-react";

interface SkillNode {
  id: string;
  label: string;
  desc: string;
  cost: number;
  icon: string;
  deps: string[];
  track?: Track;
}

const SKILLS: SkillNode[] = [
  { id: "root", label: "Foundation", desc: "Unlock the skill tree", cost: 0, icon: "🌱", deps: [] },
  { id: "science-mcq", label: "Science MCQ Master", desc: "Access 70 Science MCQs", cost: 50, icon: "⚛️", deps: ["root"], track: "science" },
  { id: "ssc-mcq", label: "SSC Explorer", desc: "Access 40 SSC MCQs", cost: 50, icon: "🌏", deps: ["root"], track: "ssc" },
  { id: "maths-formulas", label: "Formula Vault", desc: "Unlock the Maths formula sheet", cost: 80, icon: "📐", deps: ["root"], track: "maths" },
  { id: "museum", label: "Museum Key", desc: "Access the 3D Museum", cost: 100, icon: "🏛️", deps: ["root"] },
  { id: "ai-tutor", label: "AI Companion", desc: "Unlock the AI Tutor", cost: 150, icon: "🤖", deps: ["root"] },
  { id: "sanskrit-translator", label: "Sanskrit Translator", desc: "Translate Sanskrit → English", cost: 120, icon: "🕉️", deps: ["root"], track: "sanskrit" },
  { id: "speedrun", label: "Speed Runner", desc: "Unlock Speedrun mode", cost: 100, icon: "⚡", deps: ["science-mcq"] },
  { id: "mock-test", label: "Exam Simulator", desc: "Unlock Mock Tests", cost: 200, icon: "📝", deps: ["science-mcq", "ssc-mcq"] },
  { id: "galaxy", label: "Galaxy Explorer", desc: "Unlock the Knowledge Galaxy", cost: 250, icon: "🌌", deps: ["museum", "ai-tutor"] },
  { id: "flashcards-pro", label: "Flashcards Pro", desc: "Unlock all flashcard decks + SM-2 review", cost: 150, icon: "🎴", deps: ["science-mcq"] },
  { id: "voice-tutor", label: "Voice Tutor", desc: "Speak to the AI Tutor", cost: 300, icon: "🎙️", deps: ["ai-tutor"] },
  { id: "study-rooms", label: "Ambient Rooms", desc: "Unlock 12 immersive study environments", cost: 200, icon: "🌧️", deps: ["museum"] },
  { id: "mastery", label: "Mastery Tracker", desc: "Unlock detailed analytics + weakness detection", cost: 180, icon: "📊", deps: ["galaxy"] },
];

export function SkillTreeView() {
  const skillTree = useStudyStore((s) => s.skillTree);
  const coins = useStudyStore((s) => s.coins);
  const unlockSkill = useStudyStore((s) => s.unlockSkill);
  const spendCoins = useStudyStore((s) => s.spendCoins);
  const pushToast = useStudyStore((s) => s.pushToast);
  const setView = useStudyStore((s) => s.setView);
  const setTrack = useStudyStore((s) => s.setTrack);

  const isUnlocked = (id: string) => skillTree[id] || id === "root";
  const canUnlock = (node: SkillNode) => {
    if (isUnlocked(node.id)) return false;
    return node.deps.every((d) => isUnlocked(d)) && coins >= node.cost;
  };

  const handleUnlock = (node: SkillNode) => {
    if (!canUnlock(node)) return;
    if (spendCoins(node.cost)) {
      unlockSkill(node.id);
      pushToast(node.icon, `Unlocked: ${node.label}!`, "ach");
    }
  };

  const handleUse = (node: SkillNode) => {
    if (node.track) { setTrack(node.track); }
    if (node.id === "museum") setView("museum");
    else if (node.id === "ai-tutor") setView("tutor");
    else if (node.id === "sanskrit-translator") { setTrack("sanskrit"); setView("skt-translator"); }
    else if (node.id === "galaxy") setView("galaxy");
    else if (node.id === "speedrun") setView("speedrun");
    else if (node.id === "mock-test") setView("mock");
    else if (node.id === "flashcards-pro") setView("review");
    else if (node.id === "voice-tutor") setView("tutor");
    else if (node.id === "study-rooms") setView("settings");
    else if (node.id === "mastery") setView("analytics");
  };

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Skill Tree 🌳</h1>
          <p className="text-sm text-muted-foreground mt-1">Spend coins to unlock features and modes</p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400/10 border border-amber-400/30">
          <Coins className="size-4 text-amber-400" />
          <span className="font-bold text-amber-400 tabular-nums">{coins}</span>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {SKILLS.map((node) => {
          const unlocked = isUnlocked(node.id);
          const available = canUnlock(node);
          const depsMet = node.deps.every((d) => isUnlocked(d));
          return (
            <Card
              key={node.id}
              className={`rounded-2xl transition-all cursor-pointer ${
                unlocked ? "glass border-primary/30" : available ? "glass border-amber-400/40 hover:scale-[1.02]" : "glass opacity-50 border-border"
              }`}
              onClick={() => unlocked ? handleUse(node) : available ? handleUnlock(node) : undefined}
            >
              <CardContent className="pt-4 pb-4">
                <div className="flex items-start gap-3">
                  <div className={`size-10 rounded-xl flex items-center justify-center text-lg shrink-0 ${
                    unlocked ? "bg-primary/15" : available ? "bg-amber-400/15" : "bg-muted/40"
                  }`}>
                    {unlocked ? node.icon : available ? node.icon : "🔒"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-semibold truncate">{node.label}</span>
                      {unlocked && <Check className="size-3.5 text-emerald-400 shrink-0" />}
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">{node.desc}</p>
                    {!unlocked && (
                      <div className="flex items-center gap-1.5 mt-2">
                        <span className={`text-[11px] font-bold flex items-center gap-0.5 ${available ? "text-amber-400" : "text-muted-foreground"}`}>
                          <Coins className="size-3" /> {node.cost}
                        </span>
                        {!depsMet && <span className="text-[9px] text-rose-400">🔒 Locked deps</span>}
                        {depsMet && !available && <span className="text-[9px] text-muted-foreground">Need {node.cost} coins</span>}
                        {available && <span className="text-[9px] text-amber-400 font-bold">Click to unlock →</span>}
                      </div>
                    )}
                    {unlocked && <span className="text-[9px] text-primary mt-1.5 block">Click to use →</span>}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
