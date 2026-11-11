# StudyHub

An immersive study platform for Class 10 CBSE — Science, Maths, Social Science, English, and Sanskrit — built around spaced repetition, a fully navigable 3D museum, and an RPG-style progression layer on top of everyday exam prep.

## Stack

Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · Zustand (persisted to `localStorage`) · React Three Fiber / drei for the 3D Museum · shadcn/ui · Prisma (scaffolded, currently unused — all real progress lives in `localStorage`)

## Features

- **Practice**: MCQ quizzes, short/long answer, flashcards, mock tests, formula sheets, speedruns
- **3D Museum**: a WASD-navigable space with hand-built exhibits per chapter — DNA, atoms, circuits, the periodic table, and more
- **Progression**: XP, levels, streaks, achievements, a skill tree, seasonal events
- **Social/RPG layer**: guilds, battles, knowledge dungeons, leaderboards
- **AI Tutor & Sanskrit Translator**: chat-based help, powered by an LLM API (see Setup)
- **Analytics**: per-subject accuracy, mistake notebook, spaced-repetition review queue

## Getting started

```bash
bun install        # or npm install
bun run dev         # or npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

The AI Tutor and Sanskrit Translator call an LLM API — set your key before those features will respond:

```
# .env.local
MY_LLM_API_KEY=your-key-here
```

**Protecting the key.** Every AI request costs tokens on your key, so the AI routes are rate limited (per IP, plus an
optional global daily budget) and reject oversized requests. Out of the box the counters are in-memory, which on Vercel
is only best-effort. Connect a free Upstash Redis (or Vercel KV) and set `UPSTASH_REDIS_REST_URL` /
`UPSTASH_REDIS_REST_TOKEN` (or the `KV_REST_API_*` pair) to make them durable and shared; set `AI_GLOBAL_DAILY_LIMIT`
for a hard daily cap. All the options are documented in `.env.example`. If Redis is ever unreachable the limiter falls
back to memory rather than taking the tutor down.

## Build checks

`npm run build` finishes by running `scripts/check-css.mjs` (the `postbuild` hook — Vercel runs it too). It reads the
CSS Next actually emitted and fails the build if any glass panel lost its standard `backdrop-filter`. That happened once,
silently: a hand-written `-webkit-backdrop-filter` next to `backdrop-filter` gets collapsed by the CSS compiler to only
the prefixed line, which Chrome/Edge/Firefox ignore. Write the standard property alone and the compiler adds the Safari
prefix itself. CI (`.github/workflows/ci.yml`) also runs type-check, lint and the build on every push and PR.

## Deployment

Deployed via [Vercel](https://vercel.com), connected to this repo for automatic deploys on push to `main`. `/api/ai-tutor` and `/api/translate` are server-rendered routes, so this needs a Node runtime — a plain static host (e.g. Firebase Hosting) can't serve them. (An earlier `Caddyfile`/`firebase.json`/`.firebaserc` from a prior self-hosting experiment were removed — they didn't match this deploy path and would have silently dropped the AI Tutor and Translator if ever used.)

## Project structure

```
src/
  app/              # routes + API endpoints (ai-tutor, translate)
  components/
    layout/         # sidebar, home screen, mobile header
    views/           # every screen — quiz, flashcards, dashboard, battle, etc. — per subject
    museum/          # the 3D museum: gallery, rooms, exhibits, controls
    shared/          # XP bar, aurora background, helpers
  store/            # Zustand store — all app state and persistence
  lib/              # study content, achievements, level logic
```
