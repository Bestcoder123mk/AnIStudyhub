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

## Deployment

Deployed via [Vercel](https://vercel.com), connected to this repo for automatic deploys on push to `main`.

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
