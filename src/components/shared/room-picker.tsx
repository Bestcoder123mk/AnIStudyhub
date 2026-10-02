"use client";

import { useStudyStore, ROOMS, type RoomId } from "@/store/use-study-store";

export function RoomPicker() {
  const room = useStudyStore((s) => s.room);
  const setRoom = useStudyStore((s) => s.setRoom);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
      {ROOMS.map((r) => {
        const active = room === r.id;
        return (
          <button
            key={r.id}
            onClick={() => setRoom(r.id as RoomId)}
            className={`group relative overflow-hidden rounded-xl border p-3 text-left transition-all hover:scale-[1.02] ${
              active ? "border-primary ring-1 ring-primary/30" : "border-border hover:border-border"
            }`}
            style={r.bg ? { background: r.bg } : {}}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">{r.icon}</span>
              <span className={`text-xs font-semibold ${active ? "text-primary" : "text-foreground"}`}>{r.label}</span>
            </div>
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="h-1 flex-1 rounded-full"
                  style={{ background: `hsl(${r.ambientHue}, 60%, 50%)`, opacity: 0.3 + (i * 0.15) }}
                />
              ))}
            </div>
            {active && (
              <div className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-primary animate-pulse" />
            )}
          </button>
        );
      })}
    </div>
  );
}
