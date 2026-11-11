// Rate limiter for the AI-backed routes (/api/ai-tutor, /api/translate).
// Every call to these burns tokens on your Gemini key, so nothing should be
// able to hammer them — a curious visitor, a bot, or a bug in a retry loop.
//
// Two backends behind one `await checkRateLimit(req)`:
//
//   • DURABLE — Upstash Redis (Vercel KV is the same thing). One atomic Lua
//     script does every check in a single round-trip, and the counts are shared
//     by every serverless instance and survive cold starts. Switched on
//     automatically when UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN (or
//     Vercel KV's KV_REST_API_URL + KV_REST_API_TOKEN) are set. It talks to the
//     REST API with plain fetch — no npm package, nothing to install.
//
//   • IN-MEMORY — the original per-instance limiter. Used when no Redis is
//     configured, AND as the fallback if Redis can't be reached or errors:
//     the limiter fails over rather than taking the tutor down with it. On
//     Vercel this is best-effort only (every cold start / parallel instance has
//     its own counts).
//
// Limits (env overrides in brackets), checked in this order:
//   1. burst   — messages per minute per IP        (AI_BURST_LIMIT,  default 8)
//   2. daily   — messages per rolling day per IP   (AI_DAILY_LIMIT,  default 120)
//   3. global  — ALL visitors together per rolling day (AI_GLOBAL_DAILY_LIMIT,
//                default off). This is the real protection for your key and
//                your bill: a hard stop on total daily requests, however many
//                IPs someone rotates through. Only requests that passed 1 and 2
//                count toward it, so a flood of rejected ones can't burn it.
//
// Note an IP is a coarse identity: a school or office behind one NAT shares a
// single burst/daily allowance.

type Bucket = { count: number; windowStart: number };

const burstBuckets = new Map<string, Bucket>();
const dailyBuckets = new Map<string, Bucket>();
const globalBuckets = new Map<string, Bucket>();

const BURST_WINDOW_MS = 60_000; // 1 minute
const DAILY_WINDOW_MS = 24 * 60 * 60_000;
const REDIS_TIMEOUT_MS = 1500;

function intEnv(name: string, fallback: number, min = 1): number {
  const n = Number.parseInt(process.env[name] ?? "", 10);
  return Number.isFinite(n) && n >= min ? n : fallback;
}

function limits() {
  return {
    burst: intEnv("AI_BURST_LIMIT", 8),
    daily: intEnv("AI_DAILY_LIMIT", 120),
    global: intEnv("AI_GLOBAL_DAILY_LIMIT", 0, 0), // 0 = no global budget
  };
}

export type RateLimitResult =
  | { limited: false }
  | { limited: true; reason: "burst" | "daily" | "global"; retryAfterSeconds: number };

export function getClientKey(req: Request): string {
  // Vercel sets x-forwarded-for on every request; fall back to a shared
  // bucket if it's ever missing (e.g. local dev) rather than throwing.
  const fwd = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip");
  return (fwd?.split(",")[0]?.trim() || "local-dev").slice(0, 64);
}

// ---------------------------------------------------------------------------
// In-memory backend (per instance)
// ---------------------------------------------------------------------------

function hit(map: Map<string, Bucket>, key: string, windowMs: number, limit: number) {
  const now = Date.now();
  const existing = map.get(key);
  if (!existing || now - existing.windowStart > windowMs) {
    map.set(key, { count: 1, windowStart: now });
    return { limited: false, resetMs: windowMs };
  }
  existing.count += 1;
  return { limited: existing.count > limit, resetMs: windowMs - (now - existing.windowStart) };
}

/** Best-effort periodic cleanup so the maps don't grow unbounded on a long-lived instance. */
let lastSweep = Date.now();
function sweep() {
  const now = Date.now();
  if (now - lastSweep < 10 * 60_000) return;
  lastSweep = now;
  for (const [k, v] of burstBuckets) if (now - v.windowStart > BURST_WINDOW_MS) burstBuckets.delete(k);
  for (const [k, v] of dailyBuckets) if (now - v.windowStart > DAILY_WINDOW_MS) dailyBuckets.delete(k);
  for (const [k, v] of globalBuckets) if (now - v.windowStart > DAILY_WINDOW_MS) globalBuckets.delete(k);
}

function memoryCheck(key: string, lim: ReturnType<typeof limits>): RateLimitResult {
  sweep();
  const burst = hit(burstBuckets, key, BURST_WINDOW_MS, lim.burst);
  if (burst.limited) return { limited: true, reason: "burst", retryAfterSeconds: Math.ceil(burst.resetMs / 1000) };

  const daily = hit(dailyBuckets, key, DAILY_WINDOW_MS, lim.daily);
  if (daily.limited) return { limited: true, reason: "daily", retryAfterSeconds: Math.ceil(daily.resetMs / 1000) };

  if (lim.global > 0) {
    const global = hit(globalBuckets, "all", DAILY_WINDOW_MS, lim.global);
    if (global.limited) return { limited: true, reason: "global", retryAfterSeconds: Math.ceil(global.resetMs / 1000) };
  }
  return { limited: false };
}

// ---------------------------------------------------------------------------
// Durable backend (Upstash Redis REST)
// ---------------------------------------------------------------------------

/**
 * All three checks in ONE atomic round-trip, so concurrent requests can't race
 * each other past a limit and a request costs a single network hop.
 * KEYS: burst, daily, global.   ARGV: burstLimit, burstMs, dailyLimit, dailyMs, globalLimit (0 = off), globalMs.
 * Returns {0, 0} when allowed, or {1|2|3, pttl} = burst / daily / global limited, with ms until it resets.
 */
const LUA = `
local function bump(key, ms)
  local n = redis.call('INCR', key)
  if n == 1 or redis.call('PTTL', key) < 0 then redis.call('PEXPIRE', key, ms) end
  return n
end
if bump(KEYS[1], tonumber(ARGV[2])) > tonumber(ARGV[1]) then return {1, redis.call('PTTL', KEYS[1])} end
if bump(KEYS[2], tonumber(ARGV[4])) > tonumber(ARGV[3]) then return {2, redis.call('PTTL', KEYS[2])} end
local gl = tonumber(ARGV[5])
if gl > 0 and bump(KEYS[3], tonumber(ARGV[6])) > gl then return {3, redis.call('PTTL', KEYS[3])} end
return {0, 0}
`;

function redisConfig(): { url: string; token: string } | null {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  return url && token ? { url: url.replace(/\/+$/, ""), token } : null;
}

/** Which backend is active right now (handy for a health check or a test). */
export function rateLimitBackend(): "redis" | "memory" {
  return redisConfig() ? "redis" : "memory";
}

let lastWarn = 0;
function warnOnce(msg: string) {
  const now = Date.now();
  if (now - lastWarn < 5 * 60_000) return;
  lastWarn = now;
  console.warn(`[rate-limit] ${msg}`);
}

/** Returns null when Redis can't give a trustworthy answer, so the caller falls back to memory. */
async function redisCheck(
  cfg: { url: string; token: string },
  key: string,
  lim: ReturnType<typeof limits>
): Promise<RateLimitResult | null> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), REDIS_TIMEOUT_MS);
  try {
    const res = await fetch(cfg.url, {
      method: "POST",
      signal: ctrl.signal,
      headers: { Authorization: `Bearer ${cfg.token}`, "Content-Type": "application/json" },
      body: JSON.stringify([
        "EVAL", LUA, "3",
        `rl:b:${key}`, `rl:d:${key}`, "rl:g",
        String(lim.burst), String(BURST_WINDOW_MS),
        String(lim.daily), String(DAILY_WINDOW_MS),
        String(lim.global), String(DAILY_WINDOW_MS),
      ]),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { result?: unknown };
    const out = data.result;
    if (!Array.isArray(out) || typeof out[0] !== "number") return null;
    const code = out[0];
    if (code === 0) return { limited: false };
    const pttl = typeof out[1] === "number" ? out[1] : 0;
    return {
      limited: true,
      reason: code === 1 ? "burst" : code === 2 ? "daily" : "global",
      retryAfterSeconds: Math.max(1, Math.ceil(Math.max(pttl, 0) / 1000)),
    };
  } catch {
    return null; // timeout, DNS, bad JSON… — all the same to the caller
  } finally {
    clearTimeout(timer);
  }
}

/** Call once at the top of a route handler (before doing any real work). */
export async function checkRateLimit(req: Request): Promise<RateLimitResult> {
  const key = getClientKey(req);
  const lim = limits();
  const cfg = redisConfig();
  if (cfg) {
    const result = await redisCheck(cfg, key, lim);
    if (result) return result;
    warnOnce("Redis limiter unreachable or returned something unexpected — using the per-instance fallback.");
  }
  return memoryCheck(key, lim);
}
