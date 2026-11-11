# StudyHub redesign notes

## The one rule: two layers
- **Content is solid** (`.glass`, `.card-premium`, `<Card>`, `.choice`, buttons): a 2px edge plus a 4px "ledge"
  that squashes flat when pressed. Duolingo-style, tactile. *(`.glass` is a historical name — ~400 call sites
  use it for cards.)*
- **Floating UI is Liquid Glass** (`.liquid`, `.glass-strong`, `.glass-clear`): dock, headers, sheets, dialogs,
  menus, the answer sheet, the path's chapter sheet. If it floats over content, it is glass. Nothing else is.
- The pointer engine (`liquid-glass-engine.ts`) only touches the glass layer. Keep it that way.

## Gotchas learned the hard way
- Unlayered `position: relative` on a utility-like class beats Tailwind's `fixed`/`sticky`. Positioning for the
  glass/grain classes lives in `@layer base` so utilities win.
- Always write `backdrop-filter` un-prefixed (the build guard `scripts/check-css.mjs` enforces it).
- An ancestor with `backdrop-filter` is a *backdrop root*: glass inside it can't see what's behind it. Don't
  wrap the app in a blur.
- Muted text at `/50`–`/70` opacity was tuned for pure black; there is a legibility floor in `globals.css`.
- Accent labels: use `readableTextColor()` (picks by WCAG contrast), never a fixed white/black.

## Where things live
- Tokens/surfaces: `src/app/globals.css` ("The two layers", "Duolingo layer", "Learning path nodes").
- Learning path: `components/shared/learning-path.tsx` (reads `mastery-engine` + `track-content`).
- Lesson UI: `answer-sheet.tsx`, `session-bar.tsx`, `use-quiz-keys.ts`, `chapter-focus-chip.tsx`.
- Font: Geist (as originally).
- Store: `focusChapter` is transient (never persisted); persist `version: 2` migrates only the untouched
  old default accent (`#00e5ff` → `#58cc02`).

## The lesson loop (v3)
Dashboard hero (`daily-hero.tsx`: mascot, big Continue, daily goal, week streak) → focused lesson (header and dock
hidden on phones; `session-bar.tsx` has the X) → **select, then Check** (`check-bar.tsx`; a tap only selects, so a
stray tap can't lock in an answer) → tinted glass `answer-sheet.tsx` → after `LESSON_SIZE` (10) questions the
full-screen `lesson-complete.tsx` (stats, streak, mascot, confetti, fanfare + haptics in `lib/sfx.ts`).
- Keys: `1–4`/`A–D` select, the same key again or `Enter` checks, `Enter` continues (`use-quiz-keys.ts`).
- "Continue" after a lesson sets `extra` so the session carries on; chapter-scoped lessons end when the chapter
  is done and offer "Play again".
- The mascot "Ash" (`mascot.tsx`) is an original geometric wolf: fixed steel-grey fur, with eyes / forehead mark / inner ears in `--primary`. Three moods (happy, cheer, sad).
- The five quiz screens (`mcq-quiz`, `ssc-mcq`, `maths-mcq`, `eng-mcq`, `skt-mcq`) share these components; keep them in sync.

## Polish notes (v4)
- Bright accents are fine as fills but fail as text on white. Use `--fire`, `--gold-text` and `--atm` (the share of
  the accent kept in text colour: 100% dark, 56% light) via `color-mix(... var(--atm), black)`; `.text-primary` and
  `.text-neon` are already darkened in the daylight theme.
- Ash is `decorative` inside the answer sheet (the text already says Correct / Not quite).
- `LessonComplete` is a modal dialog: focus lands on Continue; "Review mistakes" appears when something was missed.

## Professional layer + concept lessons (v6)
- The look is deliberately calm: neutral slate surfaces, hairline borders, soft shadows, Geist type, emerald accent,
  line icons (`subject-icon.tsx`) instead of emoji for subjects. The refinement block at the END of `globals.css`
  overrides the earlier chunky treatment (ledges are `--ledge: 0px`); keep new rules above it or in it.
- Light theme: coloured TEXT is darkened (`--atm`, `.ink-success/.ink-danger`, and a mapping for Tailwind
  `text-amber-400` etc.). Axe contrast is 0 violations on the key screens in both themes — re-check after palette edits.
- **Concept lessons** (`lib/concepts*.ts`, `shared/concept-player.tsx`, `views/concepts.tsx`): 14 Maths + 13 Science
  lessons, each = hook, idea/analogy/formula/worked-example (revealed step by step)/trap cards, checks, recap.
  Add a lesson by appending `lesson(track, chapterId, minutes, hook, steps, recap)` in a `concepts-*.ts` file and
  spreading it into `CONCEPTS`. Chapters without one fall back to "Teach me with AI" (the existing tutor).
- Video references are YouTube *searches* per chapter plus verified full-course series pages (`VIDEO_SERIES`).
  Pinned video IDs were deliberately avoided — they rot.
- Completed lessons are tracked in their own localStorage key (`studyhub-concepts-done`), not the main store.

## Sidebar (v7)
- Structure: a headerless **core** group (Dashboard, All Chapters, Concept Lessons, AI Tutor), **Practice** (open),
  and three collapsed groups (Study tools, Rewards & play, More). Groups are built per subject in `buildSections()`;
  a group holding the active page auto-opens. Open/closed state and the icon-rail preference live in localStorage
  (`studyhub-nav-open`, `studyhub-nav-collapsed`), not the study store.
- Subject switching is a dropdown (`SubjectSwitcher`), not five tiles. The rail (68px) is desktop-only; the phone
  drawer is always the full layout.
- To add a page: add its item to the right list in `buildSections()` — don't add a new always-visible group.
