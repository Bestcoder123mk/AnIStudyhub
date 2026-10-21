"use client";

import { useStudyStore, getTrackXp } from "@/store/use-study-store";
import { levelProgress, levelTitle } from "@/lib/achievements";
import { AVATARS, TITLES, BOOST_PACKS, DEFAULT_AVATAR, type BoostPack } from "@/lib/shop-data";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Coins, Check, Shield, Zap, Sparkles } from "lucide-react";

export function ShopView() {
  const coins = useStudyStore((s) => s.coins);
  const track = useStudyStore((s) => s.track);
  const totalXp = useStudyStore((s) => getTrackXp(s, track));
  const { level } = levelProgress(totalXp);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold mb-1">Shop</h1>
          <p className="text-sm text-muted-foreground">
            Spend the coins you earn from studying on a look that's yours — Level {level} · {levelTitle(level)}
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-amber-400/12 border border-amber-400/25 shrink-0">
          <Coins className="size-5 text-amber-500 dark:text-amber-300" />
          <span className="text-xl font-bold tabular-nums">{coins}</span>
          <span className="text-xs text-muted-foreground">coins</span>
        </div>
      </div>

      <Card className="mb-6 p-4 sm:p-5 bg-muted/30 border-dashed">
        <p className="text-xs sm:text-[13px] text-muted-foreground leading-relaxed">
          <Sparkles className="inline size-3.5 -mt-0.5 mr-1" />
          Coins drop automatically as you study — roughly 1 coin per 10 XP from every chapter, flashcard,
          answered question, and focus session. Nothing here changes how the app works; it's all just for you.
        </p>
      </Card>

      <Tabs defaultValue="avatars">
        <TabsList className="mb-5 w-full sm:w-auto">
          <TabsTrigger value="avatars" className="flex-1 sm:flex-none">Avatars</TabsTrigger>
          <TabsTrigger value="titles" className="flex-1 sm:flex-none">Titles</TabsTrigger>
          <TabsTrigger value="boosts" className="flex-1 sm:flex-none">Boosts</TabsTrigger>
        </TabsList>

        <TabsContent value="avatars">
          <AvatarGrid coins={coins} />
        </TabsContent>
        <TabsContent value="titles">
          <TitleGrid coins={coins} />
        </TabsContent>
        <TabsContent value="boosts">
          <BoostsPanel coins={coins} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function AvatarGrid({ coins }: { coins: number }) {
  const inventory = useStudyStore((s) => s.inventory);
  const equipped = useStudyStore((s) => s.equippedAvatar);
  const buyCosmetic = useStudyStore((s) => s.buyCosmetic);
  const equipAvatar = useStudyStore((s) => s.equipAvatar);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      {AVATARS.map((a) => {
        const owned = a.id === DEFAULT_AVATAR || inventory.includes(a.id);
        const isEquipped = equipped === a.id;
        return (
          <ShopItemCard
            key={a.id}
            emoji={a.emoji}
            label={a.label}
            cost={a.cost}
            owned={owned}
            equipped={isEquipped}
            canAfford={coins >= a.cost}
            onBuy={() => buyCosmetic(a.id, a.cost)}
            onEquip={() => equipAvatar(a.id)}
          />
        );
      })}
    </div>
  );
}

function TitleGrid({ coins }: { coins: number }) {
  const inventory = useStudyStore((s) => s.inventory);
  const equipped = useStudyStore((s) => s.equippedTitle);
  const buyCosmetic = useStudyStore((s) => s.buyCosmetic);
  const equipTitle = useStudyStore((s) => s.equipTitle);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      {TITLES.map((t) => {
        const owned = t.cost === 0 || inventory.includes(t.id);
        return (
          <ShopItemCard
            key={t.id}
            label={t.label}
            cost={t.cost}
            owned={owned}
            equipped={equipped === t.id}
            canAfford={coins >= t.cost}
            onBuy={() => buyCosmetic(t.id, t.cost)}
            onEquip={() => equipTitle(t.id)}
          />
        );
      })}
      {equipped && (
        <button
          onClick={() => equipTitle(null)}
          className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2 col-span-full text-left mt-1"
        >
          Clear equipped title
        </button>
      )}
    </div>
  );
}

function BoostsPanel({ coins }: { coins: number }) {
  const streakFreeze = useStudyStore((s) => s.streakFreeze);
  const xpBoost = useStudyStore((s) => s.xpBoost);
  const buyStreakFreeze = useStudyStore((s) => s.buyStreakFreeze);
  const buyXpBoost = useStudyStore((s) => s.buyXpBoost);

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Zap className="size-4 text-foreground" />
          <h3 className="font-semibold text-sm">XP Boosts</h3>
          {xpBoost > 0 && <Badge className="bg-emerald-500 text-white border-0">{xpBoost} answers active</Badge>}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {BOOST_PACKS.map((b) => (
            <BoostCard key={b.id} pack={b} canAfford={coins >= b.cost} onBuy={() => buyXpBoost(b.cost, b.uses)} />
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-3">
          <Shield className="size-4 text-foreground" />
          <h3 className="font-semibold text-sm">Streak Protection</h3>
          <Badge variant="secondary">{streakFreeze} owned</Badge>
        </div>
        <Card className="p-4 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="font-medium text-sm">Streak Freeze</div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Automatically protects your daily streak the next time you miss a day.
            </p>
          </div>
          <Button size="sm" onClick={buyStreakFreeze} disabled={coins < 50} className="shrink-0 gap-1.5">
            <Coins className="size-3.5" /> 50
          </Button>
        </Card>
      </div>
    </div>
  );
}

function BoostCard({ pack, canAfford, onBuy }: { pack: BoostPack; canAfford: boolean; onBuy: () => void }) {
  return (
    <Card className="p-4 flex items-center justify-between gap-4">
      <div className="min-w-0">
        <div className="font-medium text-sm">{pack.label}</div>
        <p className="text-xs text-muted-foreground mt-0.5">{pack.desc}</p>
      </div>
      <Button size="sm" onClick={onBuy} disabled={!canAfford} className="shrink-0 gap-1.5">
        <Coins className="size-3.5" /> {pack.cost}
      </Button>
    </Card>
  );
}

function ShopItemCard({
  emoji, label, cost, owned, equipped, canAfford, onBuy, onEquip,
}: {
  emoji?: string; label: string; cost: number; owned: boolean; equipped: boolean;
  canAfford: boolean; onBuy: () => void; onEquip: () => void;
}) {
  return (
    <Card
      className={`p-3.5 flex flex-col items-center text-center gap-2 transition ${
        equipped ? "ring-2 ring-primary border-primary/50" : ""
      }`}
    >
      {equipped && (
        <span className="self-end -mt-1 -mr-1 -mb-3">
          <Check className="size-3.5 text-primary" />
        </span>
      )}
      {emoji && <div className="text-3xl leading-none">{emoji}</div>}
      <div className="text-[13px] font-semibold leading-tight">{label}</div>
      {owned ? (
        equipped ? (
          <span className="text-[11px] text-muted-foreground font-medium">Equipped</span>
        ) : (
          <Button size="sm" variant="outline" onClick={onEquip} className="h-7 text-xs px-3 w-full">
            Equip
          </Button>
        )
      ) : (
        <Button size="sm" onClick={onBuy} disabled={!canAfford} className="h-7 text-xs px-3 w-full gap-1">
          <Coins className="size-3" /> {cost}
        </Button>
      )}
    </Card>
  );
}
