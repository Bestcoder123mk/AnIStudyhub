import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // NOTE: `output: "standalone"` was removed. It's for self-hosting behind
  // the Caddyfile/bun-server setup in this repo (see package.json's build/
  // start scripts) — Vercel does its own build output tracing and doesn't
  // want or need standalone mode. If you ever move off Vercel back to a
  // self-hosted box, add `output: "standalone"` back.
  typescript: {
    // Previously `ignoreBuildErrors: true` — flagged in worklog.md as
    // hiding real type errors, with a note to turn it off "once you've
    // got a block of time." `tsc --noEmit` and a full `next build` both
    // came back completely clean during this pass, so there's nothing
    // currently being hidden — flipped off now while that's true, so the
    // build actually fails fast the next time a real type error ships,
    // instead of silently shipping it.
    ignoreBuildErrors: false,
  },
  reactStrictMode: false,
};

export default nextConfig;
