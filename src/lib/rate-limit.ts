// Lightweight in-memory rate limiter for the AI-backed routes
// (/api/ai-tutor, /api/translate) — every call to these burns tokens on
// your Gemini key, and until now nothing stopped one visitor (or one
// bug in the frontend retry logic) from hammering it in a loop.
//
// Honest limitation: this state lives in the Node process's memory, so it
// resets whenever a serverless instance cold-starts and isn't shared across
// concurrent instances/regions. On Vercel that means it's "best effort," not
// a hard guarantee — fine for a personal/small-scale app, but if this ever
// gets real traffic, swap the Map below for Upstash Redis (@upstash/ratelimit
// — HTTP-based, works from serverless/edge, has a generous free tier) and
// keep the same `check()` call signature so nothing else has to change.

type Bucket = { count: number; windowStart: number };

const burstBuckets = new Map<string, Bucket>();
const dailyBuckets = new Map<string, Bucket>();

const BURST_WINDOW_MS = 60_000; // 1 minute
const BURST_LIMIT = 8; // messages per minute per IP
const DAILY_WINDOW_MS = 24 * 60 * 60_000;
const DAILY_LIMIT = 120; // messages per day per IP — tune to your budget

function hit(map: Map<string, Bucket>, key: string, windowMs: number, limit: number) {
  const now = Date.now();
  const existing = map.get(key);
  if (!existing || now - existing.windowStart > windowMs) {
    map.set(key, { count: 1, windowStart: now });
    return { limited: false, remaining: limit - 1, resetMs: windowMs };
  }
  existing.count += 1;
  const limited = existing.count > limit;
  return { limited, remaining: Math.max(0, limit - existing.count), resetMs: windowMs - (now - existing.windowStart) };
}

/** Best-effort periodic cleanup so the maps don't grow unbounded on a long-lived instance. */
let lastSweep = Date.now();
function sweep() {
  const now = Date.now();
  if (now - lastSweep < 10 * 60_000) return;
  lastSweep = now;
  for (const [k, v] of burstBuckets) if (now - v.windowStart > BURST_WINDOW_MS) burstBuckets.delete(k);
  for (const [k, v] of dailyBuckets) if (now - v.windowStart > DAILY_WINDOW_MS) dailyBuckets.delete(k);
}

export function getClientKey(req: Request): string {
  // Vercel sets x-forwarded-for on every request; fall back to a shared
  // bucket if it's ever missing (e.g. local dev) rather than throwing.
  const fwd = req.headers.get("x-forwarded-for");
  return fwd?.split(",")[0]?.trim() || "local-dev";
}

export type RateLimitResult =
  | { limited: false }
  | { limited: true; reason: "burst" | "daily"; retryAfterSeconds: number };

/** Call once at the top of a route handler. Cheap, synchronous, no I/O. */
export function checkRateLimit(req: Request): RateLimitResult {
  sweep();
  const key = getClientKey(req);

  const burst = hit(burstBuckets, key, BURST_WINDOW_MS, BURST_LIMIT);
  if (burst.limited) {
    return { limited: true, reason: "burst", retryAfterSeconds: Math.ceil(burst.resetMs / 1000) };
  }

  const daily = hit(dailyBuckets, key, DAILY_WINDOW_MS, DAILY_LIMIT);
  if (daily.limited) {
    return { limited: true, reason: "daily", retryAfterSeconds: Math.ceil(daily.resetMs / 1000) };
  }

  return { limited: false };
}
