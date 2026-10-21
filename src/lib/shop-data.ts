// Shop catalog — cosmetics and consumables purchased with coins.
// Coins are earned passively (1 per 10 XP, from every XP-granting action —
// see grantXp in use-study-store.ts) so the shop gives that existing
// currency an actual, satisfying place to spend, alongside the Skill Tree
// (which unlocks features/modes rather than cosmetics).

export interface AvatarItem {
  id: string;
  emoji: string;
  label: string;
  cost: number;
}

export interface TitleItem {
  id: string;
  label: string;
  cost: number;
}

export interface BoostPack {
  id: string;
  label: string;
  desc: string;
  cost: number;
  uses: number;
}

// Free starting avatar — always owned, never appears in the purchasable grid.
export const DEFAULT_AVATAR = "scholar";

export const AVATARS: AvatarItem[] = [
  { id: "scholar", emoji: "🎓", label: "Scholar", cost: 0 },
  { id: "fox", emoji: "🦊", label: "Fox", cost: 40 },
  { id: "owl", emoji: "🦉", label: "Owl", cost: 40 },
  { id: "cat", emoji: "🐱", label: "Cat", cost: 40 },
  { id: "panda", emoji: "🐼", label: "Panda", cost: 50 },
  { id: "lion", emoji: "🦁", label: "Lion", cost: 60 },
  { id: "robot", emoji: "🤖", label: "Robot", cost: 70 },
  { id: "ninja", emoji: "🥷", label: "Ninja", cost: 90 },
  { id: "astronaut", emoji: "🧑‍🚀", label: "Astronaut", cost: 110 },
  { id: "wizard", emoji: "🧙", label: "Wizard", cost: 120 },
  { id: "unicorn", emoji: "🦄", label: "Unicorn", cost: 140 },
  { id: "dragon", emoji: "🐉", label: "Dragon", cost: 180 },
  { id: "crown", emoji: "👑", label: "Royalty", cost: 250 },
  { id: "trophy", emoji: "🏆", label: "Champion", cost: 320 },
];

export const DEFAULT_TITLE = "rising-scholar";

export const TITLES: TitleItem[] = [
  { id: "rising-scholar", label: "Rising Scholar", cost: 0 },
  { id: "early-bird", label: "Early Bird", cost: 40 },
  { id: "night-owl", label: "Night Owl", cost: 40 },
  { id: "bookworm", label: "Bookworm", cost: 50 },
  { id: "quiz-whiz", label: "Quiz Whiz", cost: 70 },
  { id: "streak-keeper", label: "Streak Keeper", cost: 80 },
  { id: "speed-demon", label: "Speed Demon", cost: 90 },
  { id: "museum-curator", label: "Museum Curator", cost: 90 },
  { id: "perfectionist", label: "Perfectionist", cost: 120 },
  { id: "dungeon-master", label: "Dungeon Master", cost: 140 },
  { id: "board-ready", label: "Board Ready", cost: 180 },
  { id: "legend", label: "Legend", cost: 300 },
];

export const BOOST_PACKS: BoostPack[] = [
  { id: "boost-10", label: "XP Boost — 10 answers", desc: "Double XP on your next 10 correct answers, any subject.", cost: 60, uses: 10 },
  { id: "boost-25", label: "XP Boost — 25 answers", desc: "Double XP on your next 25 correct answers — best value.", cost: 130, uses: 25 },
];

export function findAvatar(id: string | null): AvatarItem {
  return AVATARS.find((a) => a.id === id) ?? AVATARS[0];
}

export function findTitle(id: string | null): TitleItem | null {
  if (!id) return null;
  return TITLES.find((t) => t.id === id) ?? null;
}
