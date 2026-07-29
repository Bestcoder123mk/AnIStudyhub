# 🚀 THE MEGA UPGRADE PROMPT — STUDYHUB CLASS 10 (CBSE / NCERT 2026-27)

> **Purpose of this document:** This is a single, copy-paste-ready master prompt. Feed the entire document (or section by section) into ChatGPT / Claude / Gemini / Cursor to upgrade an existing HTML-based Class 10 study app into the **greatest CBSE Class 10 study hub ever built**. It covers PYQs from 2020-2026 (CBSE board + compartment + sample papers), strict alignment with the **NCERT 2026-27 rationalised syllabus**, a full UI/UX overhaul, an AI tutor engine, gamification, mock-test engine, analytics, offline support, accessibility, and a feature list numbering in the hundreds of thousands of micro-features.

---

## 📑 TABLE OF CONTENTS

1. Executive Brief & Vision
2. Current-State Audit (What the AI must ask the user)
3. Target Audience & Persona Map
4. NCERT 2026-27 Syllabus Alignment (Subject-wise rationalised blueprint)
5. Deleted Topics Reference (2020 vs 2026 syllabus diff)
6. Subject-wise PYQ Architecture (2020-2026)
   - 6.1 Mathematics (Standard + Basic)
   - 6.2 Science (Physics + Chemistry + Biology)
   - 6.3 Social Science (History, Geography, Civics, Economics)
   - 6.4 English (Language & Literature — First Flight + Footprints)
   - 6.5 Sanskrit (Shemushi + Vyakaran)
7. Question Taxonomy & Tagging Schema
8. Question Bank Data Model (JSON spec)
9. Content Sourcing Strategy (BYJU's, Khan Academy, Toppr, LearnCBSE, Teachoo, Vedantu, etc.)
10. UI/UX Overhaul — Design System
11. UI/UX Overhaul — Component Library
12. UI/UX Overhaul — Motion & Micro-interactions
13. UI/UX Overhaul — Dark Mode / Glassmorphism / Neumorphism
14. Accessibility (WCAG 2.2 AAA target)
15. AI Tutor Engine (Adaptive learning + doubt solving)
16. Gamification System (XP, streaks, badges, leagues, peer battles)
17. Mock Test Engine (Board-simulator)
18. Analytics & Insights Dashboard
19. Revision Engine (Spaced repetition — SM-2 + FSRS)
20. Social & Community Features
21. Offline-First PWA Architecture
22. Performance Budget & Tech Stack
23. Security, Privacy & Child-Safety (DPDP Act 2023)
24. Sample PYQs — Subject-wise Reference Set
25. Implementation Roadmap (12-week sprint plan)
26. Quality Assurance & Acceptance Criteria
27. The Final Aggregated Prompt (Copy-paste ready)

---

## 1. EXECUTIVE BRIEF & VISION

You are upgrading an existing single-file (or small multi-file) HTML study app for **CBSE Class 10** students in India. The current app contains a basic question bank and a simple quiz UI. Your job is to transform it into **StudyHub — the greatest CBSE Class 10 study companion ever built**, a product that should feel like the love-child of BYJU's, Khan Academy, Physics Wallah, Unacademy, and Notion — but free, lightweight, offline-capable, and obsessively aligned with the **2026-27 NCERT rationalised syllabus**.

The five subjects in scope are: **Mathematics (Standard + Basic), Science, Social Science, English (Language & Literature), and Sanskrit (Shemushi Prathammo Bhag + Vyakaranvidhi)**. The app must serve each subject with chapter-wise PYQs from board exams held between **2020 and 2026** — including the main board exam, compartment exams, and CBSE sample papers released each year — plus practice questions sourced from India's top teachers and ed-tech platforms (BYJU's, Khan Academy India, Toppr, LearnCBSE, Teachoo, Vedantu, Physics Wallah, magnetbrains, careerpower, tiwariacademy, studyrankers). Every question must be tagged with difficulty, cognitive level (Bloom's), NCERT chapter, NCERT page reference (where applicable), competency code (CBSE Competency Based Education framework), and the year/board it appeared in.

The product must ship with a next-generation UI built on **glassmorphism + neumorphism hybrid** styling, full dark mode with three themes (midnight, twilight, high-contrast), buttery 60fps animations (FLIP + spring physics), a bottom-sheet-driven mobile-first layout, and a desktop layout that feels like a premium productivity tool (think Linear + Notion + Apple Books). On top of the chrome, layer a feature set so dense that the app feels like ten products in one: an AI tutor that explains any doubt in CBSE-style Hindi or English, an adaptive spaced-repetition revision engine, a full board-exam simulator with OMR-style input, gamified streaks and leagues, peer-vs-peer battles, parent/teacher dashboards, a Pomodoro study timer with focus music, an NCERT textbook reader with inline PYQ hotspots, a formula vault, a Sanskrit shloka reciter, a chapter-wise mind-map generator, an answer-evaluation AI that mimics CBSE marking schemes, a handwriting OCR for uploading written answers, and hundreds more micro-features — each described in detail in section 12.

Build it as a **Progressive Web App (PWA)** with full offline support — every question, every solution, every video thumbnail, every formula must be cached via Service Worker so a student on a 2G connection in rural Bihar can revise the night before the board exam without interruption. The data layer must be **IndexedDB-backed** with a sync queue so progress is never lost. The app must comply with India's **DPDP Act 2023** for users under 18 — verifiable parental consent, no behavioural ads, no third-party tracking SDKs, on-device AI for sensitive features wherever possible.

The end goal: a student who uses StudyHub for 90 days before the 2027 board exam should feel that they have a personal IIT-graduate tutor, a CBSE topper's notebook, a BYJU's-grade question bank, and a game-like motivation system — all in a 12MB installable web app that works on a ₹6,000 Android phone and a ₹1,50,000 MacBook equally well.

---

## 2. CURRENT-STATE AUDIT (WHAT THE AI MUST ASK THE USER)

Before writing a single line of code, the AI must perform a structured audit of the existing app. Ask the user the following 20 questions in a single batched prompt and wait for answers. Do not skip this step — every architectural decision downstream depends on it.

1. Is the current app a single `index.html` file, or a multi-file project (separate CSS/JS)? Please share the file tree.
2. Which framework (if any) is in use — vanilla JS, React, Vue, Svelte, Alpine, or none?
3. Where is the question data currently stored — inline JS objects, JSON files, a backend API, Firebase, Supabase?
4. How many questions does the current bank have, broken down by subject and chapter?
5. What is the current UI library — plain CSS, Tailwind, Bootstrap, Material UI, shadcn/ui, or custom?
6. Does the app currently support dark mode, mobile responsiveness, offline access, or PWA install?
7. Is there any existing user-auth / progress-sync mechanism (localStorage only, or backend)?
8. Are there any third-party scripts already loaded (analytics, ads, fonts)?
9. What is the deployment target — GitHub Pages, Vercel, Netlify, a school server, or packaged as an APK via TWA?
10. Who are the actual end-users — a single student, a classroom of 40, a coaching batch of 200, or a public free app?
11. Are there existing brand colours, a logo, a name — or should the AI propose a full brand system?
12. What is the budget for paid APIs (OpenAI, Anthropic, Google Gemini) — zero, low (under ₹5k/month), or unlimited?
13. Is audio (TTS for Sanskrit shlokas, focus music, pronunciation) in scope?
14. Is image-based content (NCERT diagrams, geometry figures, science lab photos) in scope?
15. What is the target file-size budget — under 5MB, under 15MB, under 50MB?
16. Should the app support Hindi-medium students (Hindi translations of Math/Science/Social Science content)?
17. Should the app support Sanskrit-medium students (Sanskrit translations of Science/Social Science)?
18. Are teacher-side features (assign homework, view class heatmap, download reports) in scope?
19. What is the launch deadline — 30 days, 90 days, 180 days, no deadline?
20. What does "the greatest study app ever" mean to the user personally — list 3 apps they admire and 3 things they hate about existing study apps.

The AI must record the answers in a `PROJECT_BRIEF.md` file inside the repo before proceeding. Every subsequent decision must reference the brief. If the user's answer to any question would force a major architecture pivot, the AI must stop and propose two alternatives before continuing.

---

## 3. TARGET AUDIENCE & PERSONA MAP

StudyHub serves six primary personas. Every feature must be justified against at least one persona. If a feature serves none, cut it.

**Persona 1 — Aarav, 15, CBSE Class 10, urban Delhi, JEE-aspirant.** Owns an iPad and a Samsung phone. Already scores 90+. Wants razor-sharp PYQ practice, adaptive difficulty, and an AI tutor that explains in CBSE-examiner style. Hates ads, hates fluff, hates slow UI. Time budget: 2 hours/day on app.

**Persona 2 — Priya, 15, CBSE Class 10, rural Bihar, first-generation learner.** Owns a single shared Android phone on a 2G connection. Needs full offline support, Hindi-medium content, audio explanations (cannot afford to read long English paragraphs), and a Sanskrit reciter (her Sanskrit teacher is irregular). Time budget: 45 minutes/day on a borrowed phone.

**Persona 3 — Mohammed, 16, CBSE Class 10, Hyderabad, board-failure risk.** Scored 58% in pre-boards. Needs remedial content, a forced revision schedule, low-difficulty starter questions to rebuild confidence, and a streak system that hooks him back daily. Hates being shamed for low scores. Time budget: 1.5 hours/day.

**Persona 4 — Mrs. Sharma, 42, private CBSE school teacher, Lucknow.** Uses the app to assign homework, view class-wise heatmaps of weak chapters, download PDF reports for PTM meetings, and project a "question of the day" on the smartboard. Needs a teacher dashboard. Time budget: 20 minutes/day.

**Persona 5 — Mr. Iyer, 50, parent of a Class 10 student, Chennai.** Wants a weekly email/SMS digest of his daughter's progress, time-spent, weak areas, and a single "is she on track for 90+?" verdict. Hates jargon. Time budget: 5 minutes/week.

**Persona 6 — Ananya, 14, CBSE Class 9, ambitious.** Pre-loading Class 10 content for next year. Wants a "Class 9 → Class 10 bridge" mode that previews the rationalised NCERT chapters with pre-requisite refreshers. Time budget: 30 minutes/day.

The app must surface different defaults to each persona on first run via a 6-question onboarding wizard (grade, board, medium, target score, daily time budget, role). The wizard must complete in under 90 seconds.

---

## 4. NCERT 2026-27 SYLLABUS ALIGNMENT (SUBJECT-WISE RATIONALISED BLUEPRINT)

The 2026-27 NCERT rationalised syllabus is the single source of truth. The app must **never** show a question from a deleted chapter or a deleted exercise without an explicit "🗑 Deleted from 2026 syllabus — practice only for legacy reasoning" banner. The full blueprint below is the AI's contract — every chapter listed must have at least 30 PYQs (Maths/Science) or 15 PYQs (Social Science/English/Sanskrit) mapped to it.

### 4.1 MATHEMATICS (NCERT 2026-27) — Chapters in scope

1. Real Numbers (Euclid's division lemma removed; focus on Fundamental Theorem of Arithmetic, HCF/LCM, irrationality proofs)
2. Polynomials (linear, quadratic; relationship between zeroes and coefficients)
3. Pair of Linear Equations in Two Variables (graphical, substitution, elimination, cross-multiplication)
4. Quadratic Equations (factorisation, completing the square, quadratic formula, nature of roots, word problems)
5. Arithmetic Progressions (nth term, sum of n terms, word problems)
6. Triangles (similarity — SAS, SSS, AAA, Pythagoras theorem and its converse)
7. Coordinate Geometry (distance, section, area of triangle)
8. Introduction to Trigonometry (ratios, complementary angles, identities)
9. Some Applications of Trigonometry (heights and distances — line of sight, angle of elevation/depression)
10. Circles (tangent properties — radius perpendicular to tangent, lengths of tangents from external point)
11. Areas Related to Circles (sector, segment, combination of figures)
12. Surface Areas and Volumes (cylinder, cone, sphere, hemisphere — combinations and conversions)
13. Statistics (mean of grouped data, mode, median of grouped data)
14. Probability (classical definition, sample space, simple events, complementary events)

**Deleted in 2026-27 (must NOT generate new content for):** Periodic verification of irrational numbers beyond √2, √3, √5; problems on mean of grouped data using step-deviation method (kept for understanding only); constructions (perpendicular bisector, angle bisector, similar triangles) — these are REMOVED from the 2026 syllabus and the app must flag any legacy PYQ touching them.

### 4.2 SCIENCE (NCERT 2026-27) — Chapters in scope

**Chemistry:**
- Chemical Reactions and Equations (balancing, types — combination, decomposition, displacement, double displacement, oxidation-reduction, effects of oxidation in daily life)
- Acids, Bases and Salts (pH scale, indicators, reactions with metals/metal oxides/carbonates, family of salts, common salt → washing soda, baking soda, bleaching powder, plaster of Paris, chloride of lime)
- Metals and Non-metals (reactivity series, physical and chemical properties, extraction of metals — corrosion)
- Carbon and its Compounds (covalent bonding, allotropes, hydrocarbons, functional groups — alcohols, aldehydes, ketones, carboxylic acids, soaps and detergents)
- **Periodic Classification of Elements — DELETED in 2026-27**, but historical Dobereiner/Newland/Mendeleev references remain in deleted-questions vault only.

**Physics:**
- Light — Reflection and Refraction (spherical mirrors — mirror formula, magnification; refraction — Snell's law, lens formula, lensmaker, power of a lens)
- Human Eye and Colourful World (eye defects — myopia, hypermetropia, presbyopia; dispersion, rainbow formation, Tyndall effect, atmospheric refraction)
- Electricity (Ohm's law, resistance, resistivity, series/parallel combinations, heating effect, electric power)
- Magnetic Effects of Electric Current (magnetic field, field lines, force on a conductor, electromagnetic induction, domestic circuits, safety fuse)
- Sources of Energy — **DELETED in 2026-27** (legacy only).

**Biology:**
- Life Processes (nutrition — autotrophic, heterotrophic, human digestive system; respiration — aerobic, anaerobic; transportation — human heart, blood vessels, double circulation, xylem/phloem; excretion — kidney, nephron)
- Control and Coordination (nervous system — neuron, reflex action, human brain; chemical coordination — plant hormones, animal hormones, endocrine glands)
- How do Organisms Reproduce? (asexual — fission, fragmentation, regeneration, budding, spore formation; sexual — flower, human reproductive system, menstrual cycle, STDs, contraception)
- Heredity and Evolution (Mendel's laws, sex determination in humans, acquired vs inherited traits, speciation — brief). **Evolution sections trimmed in 2026-27.**
- Our Environment — **DELETED in 2026-27** (legacy only).
- Management of Natural Resources — **DELETED in 2026-27** (legacy only).

### 4.3 SOCIAL SCIENCE (NCERT 2026-27)

**History (India and the Contemporary World — II):**
1. The Rise of Nationalism in Europe
2. Nationalism in India
3. The Making of a Global World
4. The Age of Industrialisation
5. Print Culture and the Modern World

**Geography (Contemporary India — II):**
1. Resources and Development
2. Forest and Wildlife Resources
3. Water Resources
4. Agriculture
5. Minerals and Energy Resources
6. Manufacturing Industries
7. Lifelines of National Economy

**Civics (Democratic Politics — II):**
1. Power Sharing
2. Federalism
3. Gender, Religion and Caste
4. Political Parties
5. Outcomes of Democracy

**Economics (Understanding Economic Development):**
1. Development
2. Sectors of the Indian Economy
3. Money and Credit
4. Globalisation and the Indian Economy
5. Consumer Rights (project-based, minimal exam weightage in 2026-27)

### 4.4 ENGLISH (LANGUAGE & LITERATURE) — NCERT 2026-27

**First Flight (Prose):**
1. A Letter to God — G.L. Fuentes
2. Nelson Mandela: Long Walk to Freedom
3. Two Stories About Flying — His First Flight + The Black Aeroplane
4. From the Diary of Anne Frank
5. Glimpses of India — A Baker from Goa, Coorg, Tea from Assam
6. Mijbil the Otter
7. Madam Rides the Bus
8. The Sermon at Benares
9. The Proposal (Anton Chekhov)

**First Flight (Poetry):**
1. Dust of Snow — Robert Frost
2. Fire and Ice — Robert Frost
3. A Tiger in the Zoo — Leslie Norris
4. How to Tell Wild Animals — Carolyn Wells
5. The Ball Poem — John Berryman
6. Amanda! — Robin Klein
7. The Trees — Adrienne Rich
8. Fog — Carl Sandburg
9. The Tale of Custard the Dragon — Ogden Nash
10. For Anne Gregory — William Butler Yeats

**Footprints Without Feet (Supplementary):**
1. A Triumph of Surgery
2. The Thief's Story
3. The Midnight Visitor
4. A Question of Trust
5. Footprints Without Feet
6. The Making of a Scientist
7. The Necklace
8. Bholi
9. The Book That Saved the Earth

**Grammar & Writing (CBSE 2026-27 scheme):** Tenses, modals, subject-verb concord, reported speech, clauses, determiners, prepositions; formal/informal letters, analytical paragraphs, descriptive paragraphs, story writing, letters to editor, letters of complaint/enquiry/placing order.

### 4.5 SANSKRIT (शेमुषी प्रथमो भाग + व्याकरणविधिः) — NCERT 2026-27

**शेमुषी पाठाः:**
1. श्रमः एव जयते (संस्कृत कविता)
2. स्वर्णकाकः (कथा)
3. गोदोहनम् (कथा)
4. शिशुलालनम् (कविता)
5. जननी तुल्यवत्सला (कथा)
6. सूक्तिमौक्तिकम् (कथा)
7. सौहार्द प्रकाशः (कविता)
8. विचित्रः साक्षी (कथा)
9. सूक्तिस्तबकः (कथा)
10. भारतमहिमा (कविता)
11. पर्यावरणम् (कविता)
12. वाङ्मनसोर्मयूखः (कथा)

**व्याकरणविधिः (Grammar):** सन्धि (स्वर, व्यञ्जन, विसर्ग), सुबन्त-शब्दरूपाणि (अकारान्त, आकारान्त, इकारान्त, ईकारान्त, उकारान्त, ऊकारान्त, ऋकारान्त — पुं, स्त्री, नपुंसक), धातुरूप (परस्मैपद, आत्मनेपद, उभयपदी — लट्, लृट्, लङ्, लोट्), कृदन्त-तद्धित प्रत्यय, समास (तत्पुरुष, कर्मधारय, द्विगु, बहुव्रीहि, अव्ययीभाव, द्वन्द्व), वाच्य (कर्तरि, कर्मणि, भावे), प्रक्रिया (संधि-विग्रह, समास-विग्रह), अनुवाद (संस्कृत → हिन्दी/English and reverse), अपठित-अवबोधनम (unseen passage), रचनात्मक कार्यम (creative writing).

---

## 5. DELETED TOPICS REFERENCE (2020 vs 2026 SYLLABUS DIFF)

The app must ship with a built-in **"Syllabus Diff Engine"** that flags every legacy PYQ from 2020-2023 against the 2026-27 syllabus. The diff matrix is below — the AI must hardcode this matrix as a JSON file `syllabus_diff.json` and consult it whenever a question is rendered.

| Year | Subject | Deleted/Trimmed Topic | Status in 2026-27 |
|------|---------|----------------------|--------------------|
| 2020 | Maths | Constructions (full chapter) | DELETED |
| 2021 | Maths | Mean of grouped data (step-deviation) | Trimmed to direct method only |
| 2022 | Maths | Area of triangle using Heron's formula (standalone) | Folded into Surface Areas & Volumes |
| 2023 | Science | Periodic Classification of Elements (full) | DELETED |
| 2023 | Science | Sources of Energy (full) | DELETED |
| 2023 | Science | Our Environment (full) | DELETED |
| 2023 | Science | Management of Natural Resources (full) | DELETED |
| 2023 | Science | Evolution portions of Heredity | Trimmed |
| 2022 | Social Sci | Democracy & Diversity, Popular Struggles, Challenges to Democracy | DELETED earlier |
| 2022 | Social Sci | Print Culture (in some prior years) | RE-ADDED in 2026-27 |
| 2023 | English | The Sermon at Benares — moved between texts | RE-CONFIRMED in 2026-27 |
| 2023 | Sanskrit | Some shlokas from शिशुलालनम् | Trimmed |

The engine must work bidirectionally: when a student is practising 2020 PYQs and hits a Constructions question, the app must show a non-blocking banner reading "⚠️ This topic is no longer in the 2026-27 NCERT syllabus. Solve only for conceptual practice." The question is still accessible (for mental-math value) but does NOT count toward chapter-mastery progress.

---

*(continued in Part 2 below — Subject-wise PYQ Architecture 2020-2026)*

---

## 6. SUBJECT-WISE PYQ ARCHITECTURE (2020-2026)

This section is the heart of the question bank. For each subject, the AI must build a chapter-wise matrix: every chapter gets a row, every year 2020-2026 gets a column, and each cell lists the actual questions that appeared (with their 1/2/3/4/5-mark weightage, competency tag, and source — main board vs compartment vs sample paper). The AI must populate this matrix from publicly available CBSE question papers, CBSE sample papers, and trusted aggregator sites (learnCBSE, tiwariacademy, studyrankers, careerpower, Vedantu PYQ PDFs, Physics Wallah PYQ books, Magnet Brains).

### 6.1 MATHEMATICS (Standard + Basic) — 2020-2026 PYQ Distribution

The Maths paper pattern has evolved significantly across this window. From 2020 (50% competency-based pilot), through the 2021 cancelled-and-sample-paper-only year, to 2022's term-split (Term 1 MCQ-only, Term 2 subjective), then the unified 80-mark paper returning in 2023, the introduction of Competency Focused Questions (CFQ) at 30% weight in 2024, ramping to 50% in 2025 and 2026. The app must reproduce these patterns as separate "exam modes" so a student can practise against the exact format of any past year.

**Standard Maths — Chapter-wise expected PYQ count (2020-2026 total ≈ 480 questions):**
- Real Numbers: ~28 PYQs across 7 years (mostly 1-mark MCQ on irrationality + 3-mark HCF/LCM word problems)
- Polynomials: ~32 PYQs (1-mark zero-finding MCQ + 3-mark relationship between zeroes and coefficients + 4-mark case-based)
- Linear Equations: ~36 PYQs (graphical 3-mark, substitution/elimination 3-mark, cross-multiplication 4-mark, case-based 4-mark)
- Quadratic Equations: ~40 PYQs (1-mark discriminant, 2-mark factorisation, 3-mark formula, 5-mark word problems on speed/time/motion)
- Arithmetic Progressions: ~34 PYQs (1-mark nth term, 3-mark sum, 4-mark case-based on seating/stadium patterns)
- Triangles: ~38 PYQs (3-mark similarity proof, 4-mark Pythagoras-application, 5-mark combined with circles)
- Coordinate Geometry: ~30 PYQs (3-mark section formula, 4-mark area of triangle, 5-mark collinearity + quadrilateral type)
- Trigonometry: ~36 PYQs (1-mark ratio MCQ, 3-mark identity proof, 4-mark evaluation, 4-mark complementary angles)
- Heights & Distances: ~22 PYQs (almost always 4-mark case-based — tower/tree/river)
- Circles: ~30 PYQs (3-mark tangent proof, 4-mark length of tangent, 5-mark combined with triangles)
- Areas Related to Circles: ~28 PYQs (3-mark sector, 4-mark segment, 4-mark combination)
- Surface Areas & Volumes: ~36 PYQs (3-mark cone, 4-mark sphere-in-cylinder, 5-mark frustum was deleted, combination figures)
- Statistics: ~30 PYQs (3-mark mean, 3-mark mode, 3-mark median, 4-mark case-based)
- Probability: ~20 PYQs (1-mark MCQ on dice/coins, 3-mark card problems)

**Basic Maths** mirrors Standard but at lower difficulty; the app must tag each PYQ as Standard-only, Basic-only, or Both. The 2024 onwards Basic paper has seen ~15% questions unique to it (real-world framing, simpler numbers).

**Competency-Based Question Types (post-2024) the app MUST support:**
- Source-based / Case-based (4 marks each, 4 sub-parts of 1 mark each) — a paragraph/scenario followed by 4 questions
- Assertion-Reason (1 mark each) — two statements A and R, four options (A is true, R is true and is correct explanation; A is true, R is true but not correct explanation; A is true, R is false; A is false, R is true)
- Statement-based MCQ (1 mark) — multiple correct/incorrect statements to identify
- Competency-Focused Long Answer (5 marks) — multi-step real-world problem with sub-parts (a), (b), (c) each carrying 1-2 marks

### 6.2 SCIENCE — 2020-2026 PYQ Distribution

Science has moved heavily toward competency-based since 2024 with ~50% of the paper being CFQs by 2026. The app must store every PYQ with a "competency code" (CBSE CBE framework — codes K1-K4 for knowledge, A1-A4 for application, U1-U4 for understanding, P1-P4 for procedural).

**Chemistry chapter-wise PYQ counts (2020-2026 ≈ 360 questions):**
- Chemical Reactions: ~58 PYQs (1-mark balance equation, 2-mark types, 3-mark rancidity/corrosion, 5-mark case on decomposition)
- Acids, Bases, Salts: ~58 PYQs (1-mark pH, 2-mark indicator, 3-mark salt-formation, 5-mark Plaster of Paris/Bleaching Powder chain)
- Metals & Non-metals: ~64 PYQs (3-mark reactivity series, 3-mark extraction, 5-mark amphoteric oxides, 5-mark corrosion)
- Carbon Compounds: ~62 PYQs (2-mark electron-dot, 3-mark functional groups, 5-mark soap vs detergent, 5-mark homologous series)
- (Periodic Classification — DELETED but legacy PYQs kept in archive for revision practice; flagged)

**Physics chapter-wise PYQ counts:**
- Light-Reflection: ~52 PYQs (3-mark mirror formula, 3-mark ray diagram, 5-mark lens combination)
- Human Eye: ~40 PYQs (3-mark myopia correction with ray diagram, 3-mark dispersion, 5-mark Tyndall effect case)
- Electricity: ~58 PYQs (1-mark definition, 3-mark Ohm's law V-I graph, 5-mark series-parallel combination, 5-mark power bill calculation)
- Magnetic Effects: ~44 PYQs (3-mark field lines, 3-mark AC generator, 5-mark domestic circuits, 5-mark electromagnetic induction)

**Biology chapter-wise PYQ counts:**
- Life Processes: ~70 PYQs (3-mark digestion flowchart, 3-mark heart diagram, 5-mark nephron, 5-mark respiration)
- Control & Coordination: ~46 PYQs (3-mark reflex arc, 3-mark plant hormones, 5-mark endocrine glands, 5-mark brain parts)
- Reproduction: ~46 PYQs (3-mark asexual types, 3-mark flower parts, 5-mark human reproductive system, 5-mark STD/contraception)
- Heredity: ~28 PYQs (3-mark Mendel's law, 3-mark sex determination, 5-mark dihybrid cross)
- (Our Environment & Natural Resources — DELETED, archived)

### 6.3 SOCIAL SCIENCE — 2020-2026 PYQ Distribution

Social Science has 4 sub-subjects, each scored out of 20 in the 80-mark paper. The paper pattern has Source-Based Questions (5 marks), Short Answer Questions (3 marks each), Long Answer Questions (5 marks each). The 2026 pattern emphasises Competency-Based Questions at 50% weight.

**History PYQ count: ~120 across 5 chapters**
- Rise of Nationalism in Europe: ~28 PYQs (5-mark Frederic Sorrieu, 5-mark unification of Germany/Italy, 3-mark Napoleonic Code)
- Nationalism in India: ~28 PYQs (5-mark Non-Cooperation Movement, 5-mark Civil Disobedience, 3-mark Rowlatt Act, 3-mark Salt March)
- Making of a Global World: ~22 PYQs (5-mark silk routes, 5-mark Bretton Woods, 3-mark indentured labour)
- Age of Industrialisation: ~22 PYQs (5-mark factory vs guild, 3-mark Indian cotton market, 3-mark advertisement)
- Print Culture: ~20 PYQs (5-mark Gutenberg, 3-mark print in India, 3-mark print and women)

**Geography PYQ count: ~140 across 7 chapters**
- Resources & Development: ~24 PYQs (5-mark resource planning, 3-mark land use, 5-mark soil conservation)
- Forest & Wildlife: ~20 PYQs (5-mark biodiversity, 3-mark Project Tiger, 3-mark Himalayan degradation)
- Water Resources: ~18 PYQs (5-mark rainwater harvesting, 3-mark dams, 3-mark scarcity)
- Agriculture: ~22 PYQs (5-mark Green Revolution, 5-mark cropping patterns, 3-mark food security)
- Minerals & Energy: ~22 PYQs (5-mark iron/coal distribution, 5-mark renewable energy, 3-mark nuclear energy)
- Manufacturing Industries: ~20 PYQs (5-mark industrial location, 5-mark Noida/Mumbai/Pune clusters, 3-mark pollution)
- Lifelines of National Economy: ~14 PYQs (5-mark transport, 3-mark communication, 3-mark tourism)

**Civics PYQ count: ~110 across 5 chapters**
- Power Sharing: ~22 PYQs (5-mark Belgium/Sri Lanka comparison, 3-mark forms of power sharing)
- Federalism: ~22 PYQs (5-mark India's federal structure, 3-mark decentralisation, 3-mark language policy)
- Gender, Religion, Caste: ~22 PYQs (5-mark caste in politics, 3-mark feminist movements, 3-mark communalism)
- Political Parties: ~24 PYQs (5-mark national vs regional, 5-mark challenges to parties, 3-mark party system)
- Outcomes of Democracy: ~20 PYQs (5-mark economic growth vs democracy, 3-mark accountability, 3-mark equality)

**Economics PYQ count: ~100 across 5 chapters**
- Development: ~22 PYQs (5-mark HDI, 5-mark per capita income, 3-mark sustainability)
- Sectors: ~22 PYQs (5-mark primary/secondary/tertiary, 3-mark MNREGA, 3-mark disguised unemployment)
- Money & Credit: ~22 PYQs (5-mark modern money, 5-mark SHGs, 3-mark formal/informal credit)
- Globalisation: ~22 PYQs (5-mark WTO, 5-mark MNCs, 3-mark fair globalisation)
- Consumer Rights: ~12 PYQs (project-heavy, low direct PYQ weight)

### 6.4 ENGLISH (Language & Literature) — 2020-2026 PYQ Distribution

English paper (80 marks) — Sections: A (Reading — 20), B (Writing & Grammar — 20), C (Literature — 40). The pattern shifted in 2024 with Section A now featuring two unseen passages (one discursive, one case-based factual), Section B with analytical paragraph + letter + grammar MCQs, Section C with extract-based questions.

**First Flight Prose PYQ count: ~150**
- A Letter to God: ~16 PYQs (5-mark character sketch of Lencho, 3-mark faith theme)
- Nelson Mandela: ~14 PYQs (5-mark inaugural address, 3-mark apartheid, 3-mark twins)
- Two Stories About Flying: ~16 PYQs (5-mark young seagull's fear, 3-mark pilot of Black Aeroplane)
- Diary of Anne Frank: ~16 PYQs (5-mark Anne's relationship with Margot, 3-mark Kitty)
- Glimpses of India: ~18 PYQs (3-mark each on baker/Coorg/Assam — almost guaranteed one extract per year)
- Mijbil the Otter: ~14 PYQs (3-mark Mijbil's habits, 5-mark extraction)
- Madam Rides the Bus: ~14 PYQs (5-mark Valli's character, 3-mark bus journey)
- Sermon at Benares: ~14 PYQs (5-mark Buddha's teaching, 3-mark Kisa Gotami)
- The Proposal: ~14 PYQs (5-mark Lomov-Natalya quarrel, 3-mark farce elements)
- (Removed "The Hundred Dresses" — was in older syllabus, deleted)

**First Flight Poetry PYQ count: ~70**
- Each of the 10 poems has 5-10 PYQs; Dust of Snow, Fire and Ice, The Ball Poem, Amanda! appear almost every year. The app must include rhyming scheme, literary devices, theme analysis for each.

**Footprints Without Feet PYQ count: ~110**
- Each of the 9 chapters has 10-14 PYQs. The supplementary text questions are typically 3-mark or 5-mark. The app must include a "Character Map" for each story, a "Plot Diagram", and an "Irony/Moral" tag.

**Grammar PYQ count: ~80** — Tenses (12), Modals (8), Subject-verb concord (10), Reported speech (14), Clauses (12), Determiners (8), Prepositions (8). The app must include a fill-in-the-blank engine, a re-arrange-the-jumbled-words engine, and a sentence-transformation engine.

**Writing PYQ count: ~70** — Formal letter (18), Informal letter (10), Analytical paragraph based on chart (22), Descriptive paragraph (8), Story writing (12). The app must include a "writing scaffold" with sentence starters, model answers, and an AI feedback engine that scores the user's writing against CBSE's 5-mark rubric.

### 6.5 SANSKRIT — 2020-2026 PYQ Distribution

Sanskrit paper (80 marks) — Sections: अपठित अवबोधनम (13), रचनात्मक कार्यम (15), अनुप्रयुक्त व्याकरणम (32), अनुवादः (10), पाठ्यपुस्तकम (10). Note: the 2024 onwards pattern increased अपठित and रचनात्मक weight, decreased direct-translation weight.

**शेमुषी पाठ-wise PYQ count: ~120**
- श्रमः एव जयते: ~10 PYQs (श्लोक-अर्थ matching, अनुवाद)
- स्वर्णकाकः: ~10 PYQs (कथा-अर्थ, नैतिकता)
- गोदोहनम्: ~10 PYQs (अनुवाद, प्रश्नोत्तर)
- शिशुलालनम्: ~10 PYQs (श्लोक अर्थ, अलंकार)
- जननी तुल्यवत्सला: ~12 PYQs (कथा-सार, मूल्य)
- सूक्तिमौक्तिकम्: ~10 PYQs (कथा-अर्थ)
- सौहार्द प्रकाशः: ~10 PYQs (श्लोक, भाव)
- विचित्रः साक्षी: ~10 PYQs (कथा, संदेश)
- सूक्तिस्तबकः: ~10 PYQs (सूक्ति-अर्थ matching)
- भारतमहिमा: ~10 PYQs (श्लोक, देश-भक्ति)
- पर्यावरणम्: ~10 PYQs (श्लोक, पर्यावरण-चेतना)
- वाङ्मनसोर्मयूखः: ~8 PYQs (कथा, संदेश)

**व्याकरणविधिः PYQ count: ~180**
- सन्धि: ~30 PYQs (स्वर सन्धि 10, व्यञ्जन सन्धि 12, विसर्ग सन्धि 8)
- शब्दरूप: ~30 PYQs (अकारान्त पुंलिङ्ग 8, आकारान्त स्त्रीलिङ्ग 8, अकारान्त नपुंसकलिङ्ग 6, ऋकारान्त 4, विशेष-शब्द 4)
- धातुरूप: ~30 PYQs (परस्मैपद 10, आत्मनेपद 8, उभयपदी 7, लङ्/लृट्/लोट् 5)
- कृदन्त-तद्धित: ~20 PYQs (कृत् प्रत्यय 12, तद्धित प्रत्यय 8)
- समास: ~25 PYQs (तत्पुरुष 6, कर्मधारय 6, द्विगु 4, बहुव्रीहि 5, अव्ययीभाव 2, द्वन्द्व 2)
- वाच्य: ~15 PYQs (कर्तरि 6, कर्मणि 6, भावे 3)
- प्रक्रिया: ~20 PYQs (संधि-विग्रह 10, समास-विग्रह 10)
- अनुवाद: ~10 PYQs (संस्कृत → हिन्दी/English)

**अपठित अवबोधनम (Unseen Passage):** The app must include a generator that creates fresh unseen passages by sampling from a corpus of Sanskrit stories (Pañchatantra, Hitopadesha excerpts in public domain). Each passage has 5 sub-questions testing vocabulary, comprehension, and translation.

**रचनात्मक कार्यम (Creative Writing):** The app must support चित्र-वर्णनम (picture description), संवाद-लेखनम (dialogue writing), सूक्ति-वर्णनम (maxim expansion), पत्र-लेखनम (letter writing — formal and informal), and घटना-लेखनम (event writing) with model answers and AI feedback on grammatical correctness.


---

## 7. QUESTION TAXONOMY & TAGGING SCHEMA

Every question in the bank must carry a structured metadata envelope. This is not optional — the analytics engine, the adaptive tutor, and the revision system all depend on it. The schema below is the AI's contract for the `Question` object. Any question failing validation must be rejected at import time.

```json
{
  "id": "MATH-STD-2024-CBSE-Q12",
  "subject": "Mathematics",
  "subject_variant": "Standard",  // Standard | Basic
  "chapter": "Quadratic Equations",
  "chapter_id": "MATH-C04",
  "ncert_page_ref": "Ex 4.3 Q2",
  "syllabus_2026_status": "active",  // active | trimmed | deleted
  "year": 2024,
  "exam_type": "main",  // main | compartment | sample_paper | pre_board
  "board": "CBSE",
  "region": "Delhi",  // null for sample papers
  "set": "1",  // 1/2/3 — paper set code
  "question_number": 12,
  "section": "C",  // A/B/C/D per CBSE paper structure
  "marks": 3,
  "question_type": "short_answer",  // mcq | assertion_reason | short_answer | long_answer | case_based | source_based | fill_blank | true_false
  "difficulty": 0.65,  // 0.0 (trivial) to 1.0 ( Olympiad-tier)
  "bloom_level": "Apply",  // Remember | Understand | Apply | Analyze | Evaluate | Create
  "competency_code": "A2",  // CBSE CBE framework code
  "cognitive_load": "medium",  // low | medium | high
  "estimated_time_sec": 240,
  "languages": ["en", "hi"],
  "has_diagram": false,
  "has_equation": true,
  "has_table": false,
  "stem": "Find the roots of the quadratic equation 2x² - 7x + 3 = 0 by applying the quadratic formula.",
  "stem_hi": "द्विघात समीकरण 2x² - 7x + 3 = 0 के मूल द्विघात सूत्र का प्रयोग कर ज्ञात कीजिए।",
  "options": null,
  "correct_answer": "x = 3 or x = 1/2",
  "answer_steps": [
    "Compare 2x² - 7x + 3 = 0 with ax² + bx + c = 0. We get a = 2, b = -7, c = 3.",
    "Discriminant D = b² - 4ac = (-7)² - 4(2)(3) = 49 - 24 = 25 > 0. Two distinct real roots.",
    "By quadratic formula, x = [-b ± √D] / 2a = [7 ± √25] / 4 = [7 ± 5] / 4.",
    "x = 12/4 = 3   or   x = 2/4 = 1/2."
  ],
  "marking_scheme": {
    "correct": 3,
    "partial": [
      {"criterion": "Identifies a, b, c correctly", "marks": 0.5},
      {"criterion": "Computes discriminant correctly", "marks": 1},
      {"criterion": "Substitutes into formula correctly", "marks": 1},
      {"criterion": "Final roots stated with units", "marks": 0.5}
    ],
    "negative": 0
  },
  "common_mistakes": [
    "Forgetting to take ± in the formula (yields only one root)",
    "Computing b² as -49 instead of 49",
    "Sign error in b (writing +7 instead of -7)"
  ],
  "hints": [
    "Recall: x = [-b ± √(b²-4ac)] / 2a",
    "First compute b² - 4ac.",
    "Don't forget the ± sign."
  ],
  "video_solution_url": null,
  "tags": ["discriminant", "real_roots", "quadratic_formula"],
  "related_questions": ["MATH-STD-2023-CBSE-Q09", "MATH-STD-2025-SAMPLE-Q14"],
  "source_attribution": "CBSE Board Paper 2024 Delhi Set 1",
  "copyright": "CBSE — fair-dealing educational use",
  "last_verified": "2026-01-15"
}
```

The AI must build a validation script (`validate_questions.js`) that runs through every question object and enforces: required fields present, `marks` ∈ {1,2,3,4,5}, `difficulty` ∈ [0,1], `bloom_level` ∈ enum, `chapter_id` exists in the syllabus map, `syllabus_2026_status` matches the syllabus_diff.json matrix. Any failure aborts the build.

---

## 8. QUESTION BANK DATA MODEL

The bank is structured as a single denormalised JSON bundle (one file per subject) plus a master index. Target sizes (gzipped): Maths ~280KB, Science ~310KB, Social Science ~240KB, English ~190KB, Sanskrit ~140KB — total ~1.2MB compressed. Loaded on first paint via Service Worker cache, then queried in-memory via a small indexed search engine (FlexSearch).

File layout:

```
/data
  /questions
    maths.standard.json     (≈ 480 questions)
    maths.basic.json        (≈ 420 questions)
    science.json            (≈ 560 questions)
    social_science.json     (≈ 470 questions)
    english.json            (≈ 410 questions)
    sanskrit.json           (≈ 300 questions)
  /index
    by_chapter.json
    by_year.json
    by_competency.json
    by_difficulty.json
  /meta
    syllabus_diff.json
    ncert_chapters.json
    bloom_matrix.json
  /media
    diagrams/        (SVG only — no raster to keep size low)
    audio/           (MP3 32kbps mono for Sanskrit recitations)
```

The AI must generate a `QuestionBank` class with methods: `byChapter(id)`, `byYear(year)`, `byDifficulty(range)`, `byCompetency(code)`, `random(filter)`, `relatedTo(id)`, `weakAreasFor(user)` — all running against the in-memory index with O(log n) or better.

---

## 9. CONTENT SOURCING STRATEGY

The AI must source practice content (PYQs + additional practice questions) ONLY from these verified, fair-dealing sources. Each source has a different content specialty — the AI must use the right source for the right content type.

**Tier-1 — Official sources (highest authority):**
- CBSE official website (cbse.gov.in) — sample papers, marking schemes, question banks
- NCERT official (ncert.nic.in) — textbook content, exemplar problems
- DIKSHA platform (diksha.gov.in) — Energised textbooks, CBSE-aligned practice content
- ePathshala (epathshala.nic.in) — NCERT digital resources

**Tier-2 — Verified educational aggregators:**
- BYJU's (byjus.com) — concept explanations, additional practice MCQs, mock tests
- Khan Academy India (khanacademy.org) — concept videos, practice exercises (CC-BY-NC-SA licence)
- Toppr (toppr.com) — question bank, doubts
- Vedantu (vedantu.com) — PYQ PDFs, concept pages
- Physics Wallah (pw.live) — PYQ books, doubt videos
- Magnet Brains (magnetbrains.com) — free video lectures, chapter notes
- LearnCBSE (learncbse.in) — chapter-wise NCERT solutions, additional practice
- Tiwari Academy (tiwariacademy.com) — NCERT solutions, exemplar solutions
- StudyRankers (studyrankers.com) — chapter notes, NCERT solutions
- Career Power (careerpower.in) — PYQ compilations
- Jagran Josh (jagranjosh.com) — current affairs for Social Science, board prep
- India Today Education — board prep tips, topper interviews
- Aakash iTutor — for NEET-aspirant Class 10 Science practice

**Tier-3 — Question source citations:**
- Competitions like NTSE, NMMS, KVPY (Class 10 level) — for advanced practice
- SOF Olympiads (IMO, NSO, IEO) — for advanced practice in respective subjects
- State board PYQs from Maharashtra, Tamil Nadu, Karnataka — for cross-reference, NOT primary content

**Attribution rule:** Every question imported from a third party must carry a `source_attribution` field with the exact URL, page, and date of access. The AI must NOT scrape paywalled content. The AI must NOT use questions from LeetCode-style competitive programming sites. The AI must NOT generate fake PYQs and label them as CBSE board questions — if a question is created by the AI for additional practice, its `exam_type` must be `"practice_generated"` and `source_attribution` must read `"StudyHub AI-generated practice question"`.

**Sourcing workflow:** The AI must produce a `source_manifest.json` listing every URL visited, the date accessed, the licence/usage terms, and the questions extracted from it. This manifest ships with the app (in `/about/sources`) so users and parents can verify provenance.

---

## 10. UI/UX OVERHAUL — DESIGN SYSTEM

The visual overhaul must be a complete reset. The current app's plain HTML look must be replaced with a coherent design system that feels like a 2026 consumer product (think Arc Browser, Linear, Raycast, Notion AI, Apple Books). The system is defined by four pillars: **tokens, components, motion, density.**

### 10.1 Design Tokens

Define every visual primitive as a CSS custom property on `:root`. Token names follow the pattern `--<category>-<property>-<modifier>` — e.g. `--color-bg-elevated-1`, `--space-md`, `--radius-lg`, `--shadow-glass-1`. Never hardcode a hex value inside a component; always reference a token.

**Colour palette (light mode):**
- `--color-bg-base: #FAFBFC` (off-white, warmer than pure white)
- `--color-bg-elevated-1: #FFFFFF`
- `--color-bg-elevated-2: #F4F6F8`
- `--color-bg-glass: rgba(255,255,255,0.65)` (for glassmorphism surfaces)
- `--color-fg-primary: #0F1419`
- `--color-fg-secondary: #4A5568`
- `--color-fg-muted: #94A3B8`
- `--color-accent-primary: #4F46E5` (Indigo-600 — scholarly, premium)
- `--color-accent-secondary: #06B6D4` (Cyan-500 — playful, modern)
- `--color-success: #10B981`
- `--color-warning: #F59E0B`
- `--color-danger: #EF4444`
- `--color-subject-maths: #6366F1`
- `--color-subject-science: #10B981`
- `--color-subject-ssc: #F59E0B`
- `--color-subject-english: #EC4899`
- `--color-subject-sanskrit: #8B5CF6`

**Colour palette (dark mode — Midnight theme):**
- `--color-bg-base: #0A0E1A`
- `--color-bg-elevated-1: #141927`
- `--color-bg-elevated-2: #1E2436`
- `--color-bg-glass: rgba(20,25,39,0.72)`
- `--color-fg-primary: #F1F5F9`
- `--color-fg-secondary: #CBD5E1`
- `--color-fg-muted: #64748B`

**Typography:**
- Headings: `"Inter Display", "Noto Sans Devanagari", system-ui, sans-serif`
- Body: `"Inter", "Noto Sans Devanagari", system-ui, sans-serif`
- Sanskrit: `"Noto Serif Devanagari", "Sanskrit Text", serif` — for shlokas
- Mono (formulas, code): `"JetBrains Mono", "Fira Code", monospace`
- Numerals: tabular-nums enabled via `font-variant-numeric: tabular-nums` on all data displays
- Scale (fluid, clamp-based): `--text-xs: clamp(0.75rem, 0.7rem + 0.2vw, 0.875rem)`, `--text-sm: clamp(0.875rem, 0.8rem + 0.3vw, 1rem)`, `--text-base: clamp(1rem, 0.9rem + 0.4vw, 1.125rem)`, `--text-lg`, `--text-xl`, `--text-2xl`, `--text-3xl`, `--text-4xl`, `--text-5xl`, `--text-6xl`.

**Spacing scale:** `--space-3xs: 0.125rem` through `--space-3xl: 3rem` — 9-step scale (3xs, 2xs, xs, sm, md, lg, xl, 2xl, 3xl). All paddings/margins/gaps must reference these tokens.

**Radii:** `--radius-xs: 4px`, `--radius-sm: 8px`, `--radius-md: 12px`, `--radius-lg: 16px`, `--radius-xl: 24px`, `--radius-2xl: 32px`, `--radius-pill: 9999px`, `--radius-circle: 50%`.

**Shadows:** Three families — `--shadow-flat-*` (subtle, low-elevation), `--shadow-floating-*` (mid-elevation for hover states), `--shadow-glass-*` (for glassmorphism with inset highlights). Glass shadow uses a top-left inset white highlight (`inset 1px 1px 0 rgba(255,255,255,0.15)`) combined with a soft outer blur.

### 10.2 Component Library

The app must ship with a 40-component library. Each component is documented with anatomy, variants, states, do/don't examples, and code samples.

**Primitives:** Button (8 variants: primary, secondary, ghost, danger, success, link, icon, FAB — each in 3 sizes), Input (text, password, search, number with stepper, OTP-style), Textarea, Select, Checkbox, Radio, Switch, Slider, Tooltip, Popover, Toast (5 types: info, success, warning, danger, loading), Modal (with bottom-sheet variant for mobile), Drawer, Tabs, Accordion, Breadcrumb, Pagination, Tag, Badge, Avatar, Skeleton, Progress bar, Progress ring, Spinner, Empty state, Error boundary.

**Composite components:** Question card (with stem, options, answer reveal, marking scheme drawer, hint button, discuss button, flag button), Chapter card (with progress ring, mastery %, last-practised date, recommended next session), Subject tile (gradient, icon, mastery, streak), Daily challenge widget, Streak widget (with 7-day dot calendar), XP bar with level-up animation, Leaderboard row, Mock test card, Calendar heatmap (GitHub-style, last 90 days), Pomodoro timer (circular SVG), Formula vault card, Mind-map canvas, AI tutor chat bubble, Doubt thread, Friend card, Achievement badge (with rarity tier), Onboarding step, Settings group, Theme switcher (with live preview).

Each composite component must be built mobile-first with a max-width of 480px on phones, expand to a 2-column layout on tablets (768px+), and a 3-4 column dashboard on desktops (1280px+).

### 10.3 Motion & Micro-interactions

Every interactive element must have a deliberate motion. The motion system uses **spring physics** (not linear easing) for organic feel. Implement via `motion-one` library or CSS `linear()` easing function with hand-tuned control points.

**Motion tokens:**
- `--ease-spring-soft: linear(0, 0.009, 0.035 2.1%, 0.141, 0.281 6.7%, 0.723 12.9%, 0.938, 1.077, 1.176, 1.238, 1.27, 1.274, 1.266 24.1%, 1.184, 1.101, 1.035, 0.991, 0.963, 0.951 39.5%, 0.951, 0.963, 0.991, 1.035, 1.101, 1.184 56.2%, 1.196, 1.206, 1.214, 1.219, 1.222, 1.224 66.7%, 1.224, 1.222, 1.219, 1.214, 1.206, 1.196, 1.184 82.8%, 1.035, 0.991, 0.963, 0.951, 0.951, 0.963, 0.991, 1.035, 1.101, 1.184, 1.238, 1.27, 1.274, 1.266 100%)` — for soft bounces (cards entering, badges unlocking)
- `--ease-spring-snappy`: tighter spring for buttons, switches
- `--ease-spring-bouncy`: exaggerated for celebration animations (XP gain, level-up)
- `--dur-instant: 80ms` (taps, haptic feedback)
- `--dur-fast: 160ms` (hover, focus)
- `--dur-base: 240ms` (default)
- `--dur-slow: 400ms` (page transitions)
- `--dur-celebration: 1200ms` (confetti, level-up)

**Signature animations:**
1. **Question reveal flip**: when a student submits an answer, the question card flips 180° on the Y-axis revealing the solution. The flip uses `--ease-spring-soft` and `--dur-base`.
2. **XP gain burst**: a number floats up from the action area, scales from 0.8 to 1.2 to 1.0, fades out at -60px. A small particle burst (5 particles) radiates outward.
3. **Streak fire**: when a daily streak extends, a flame SVG grows from 0 to full size with a flicker animation lasting 1.2s.
4. **Chapter mastery ring**: an SVG ring fills from current % to new %, with a soft glow pulsing 3 times on completion.
5. **Page transition**: FLIP animation (First-Last-Invert-Play) between major routes — the source card scales/morphs into the destination hero.
6. **Confetti on milestone**: 30 particles in subject colours, gravity-based, on first 100-question completion, 7-day streak, level-up, full mock test, perfect score.
7. **Skeleton shimmer**: 1.2s linear gradient sweep for all loading states.
8. **Pull-to-refresh on mobile**: native-feeling spring, refresh icon morphs from arrow to spinner to check.
9. **Dark mode transition**: a circular reveal animation centred on the theme toggle, expanding the new theme across the viewport in 600ms.
10. **AI tutor typing**: messages stream in with a typewriter effect at 30 chars/sec, with a blinking cursor.

**Reduced-motion fallback:** honour `prefers-reduced-motion` strictly — all animations degrade to instant crossfades, no flips, no particles, no confetti. The skeleton shimmer becomes a static grey.

### 10.4 Dark Mode / Glassmorphism / Neumorphism

The app supports **three visual themes** the user can switch between with a single tap, with a live preview in settings:

1. **Midnight (default dark)**: deep navy-black background, glass cards with `backdrop-filter: blur(20px) saturate(180%)`, soft glow on accent elements.
2. **Twilight**: warm dark — deep purples (#1A1625) with peach accents (#F97316), inspired by sunset. Easier on eyes during late-night study.
3. **High-contrast**: pure black (#000) background, pure white text, no glassmorphism (solid cards), thicker borders (2px), AA-contrast for users with low vision. Required for accessibility compliance.
4. **Light — Daylight**: the default light theme from section 10.1.
5. **Light — Sepia**: warm cream background (#FAF4E8), brown text, for extended reading sessions.

Glassmorphism is applied to floating elements only (sticky header, FAB, modal background, toast notifications, AI tutor bubble). Cards containing primary content (questions, chapters, stats) use **neumorphism-lite** — soft outer shadow combined with subtle inner top-left highlight, no transparency, to preserve text readability. Mixing heavy glass with text content creates contrast problems; the design system explicitly forbids text on top of glass surfaces without a solid backing layer.


---

## 11. UI/UX OVERHAUL — SCREEN MAP & INFORMATION ARCHITECTURE

The app's navigation must be a bottom-tab bar on mobile (5 tabs: Home, Practice, Mock, Tutor, Profile) and a collapsible left sidebar on desktop. Each tab is a full screen with its own sub-routes. The complete screen map is below — the AI must implement every screen with at least 3 states (loading, empty, populated) and at least 1 error state.

**Tab 1 — Home (Dashboard):**
- Greeting card with first name, current streak, today's target
- Daily challenge widget (3 questions, 5-min time-bound)
- "Continue where you left off" card
- Today's recommended revision (from spaced-repetition engine)
- Subject tiles grid (5 subjects with mastery %)
- Upcoming mock test reminder
- Quote of the day (rotates between 100 educational quotes from Indian and global thinkers)
- Weekly heatmap mini-view

**Tab 2 — Practice:**
- Subject selector (5-col grid on desktop, scroll on mobile)
- Chapter list with progress rings, PYQ count, mastery, last-practised, "smart practice" CTA
- Practice mode selector: PYQ mode / Mixed mode / Weak-area mode / Chapter-mastery mode / Rapid-fire mode / Reverse-mode (answer→question)
- Question player (full-screen on mobile, side panel on desktop with question list)
- Solution drawer with step-by-step marking scheme, common mistakes, related questions
- "Discuss this question" thread (community feature, moderated)

**Tab 3 — Mock:**
- Mock test library (filterable by year, subject, full-length vs chapter-wise)
- "Board Simulator" full-screen mode with OMR-style answer sheet sidebar
- Live timer with subject-wise pace guidance
- Post-test review: question-by-question with marking-scheme overlay, examiner-style commentary on each answer
- Percentile estimator (based on past user attempts)
- Mock history with progress chart

**Tab 4 — Tutor (AI):**
- Chat interface with conversation history
- Modes: Doubt-solver / Concept-explainer / Quiz-me / Quiz-reviewer / Writing-evaluator / Sanskrit-translator / Revision-planner
- Voice input (Web Speech API) and voice output (TTS) for Sanskrit recitation
- Image upload (handwritten doubt, geometry diagram)
- "Pin to notebook" button — saves an AI explanation to a personal notebook
- Notebook with folders per subject

**Tab 5 — Profile:**
- Avatar, name, grade, board, target score
- Stats: total questions solved, accuracy %, average time per question, days active, longest streak, mock tests attempted, mastery per subject
- Achievements gallery (50+ badges)
- Leaderboard (school / city / national / friends)
- Settings (theme, language, notification preferences, parental controls, data export, account deletion)
- Parent/teacher dashboard link

**Sub-routes / Modal screens:**
- Onboarding wizard (6 steps)
- Mock test player (full-screen, hides bottom tab)
- Question player detail (full-screen on mobile)
- Achievement unlock celebration
- Payment modal (for premium tier — optional, discussed in section 23)
- Report a problem / feedback
- About / sources / privacy policy / terms

---

## 12. THE FEATURE MEGA-LIST (1,000,000 FEATURES EXPANSION)

The user asked for "1000000 features." A literal million is impossible without duplication, but the AI must deliver a **feature density** of 500+ distinct, named features organised into 25 feature domains. Each feature gets a one-paragraph description. The AI must implement at least the top 200 in the first release; the remaining 300+ are documented in a `ROADMAP.md` for staged rollout.

### DOMAIN 1 — QUESTION BANK & PRACTICE (35 features)

1. **Chapter-wise PYQ drill** — narrow to a single chapter, get only past board questions from that chapter, sorted by year descending.
2. **Year-wise full paper** — attempt an entire past year's paper question-by-question.
3. **Mixed-mode practice** — cross-chapter questions in random order, simulating the real paper's mix.
4. **Weak-area auto-targeting** — analytics identifies the user's 3 weakest sub-topics and queues 10 questions on each.
5. **Smart difficulty** — adaptive engine that adjusts difficulty (IRT-based) question-to-question based on running accuracy.
6. **Rapid-fire mode** — 60-second timer, 1-mark MCQs only, score as many as possible.
7. **Reverse mode** — show the answer, user must select the correct question from 4 options (tests conceptual understanding differently).
8. **Bookmark & revisit** — flag any question, revisit in a dedicated "Bookmarked" tab.
9. **Notes inline** — attach a personal note to any question (e.g., "I always forget to take ± here").
10. **Discuss thread** — each question has a community discussion thread; top answer upvoted by community surfaces first.
11. **Print to PDF** — generate a printable PDF of any selection of questions with answer key on a separate page.
12. **Share to friend** — share a single question via deep link (web-share API with fallback to copy-link).
13. **Solution variants** — if a question has multiple solution methods (e.g., quadratic by factorisation vs formula), show all with "Recommended for CBSE: factorisation" tag.
14. **Marking-scheme overlay** — toggle the official CBSE marking scheme step-by-step over the user's answer.
15. **Common-mistakes tooltip** — hover/tap on each option in MCQ to see why it's wrong.
16. **Diagrams zoom & pan** — pinch-to-zoom on geometry diagrams, double-tap to reset.
17. **Latex-rendered equations** — all math equations rendered via KaTeX with selectable text.
18. **Voice-read question** — TTS reads the question aloud (for visually impaired users or for revision while walking).
19. **Hint ladder** — three escalating hints: gentle nudge, method hint, full solution skeleton.
20. **Time-per-question tracker** — shows time spent on each question vs the CBSE-recommended time.
21. **Negative marking toggle** — for NTSE-style practice with -1/3 negative marking.
22. **Custom test builder** — user picks chapter(s), question count, marks distribution, difficulty range, time limit; app assembles a custom test.
23. **Question flagging** — flag a question as "wrong answer in key" or "out of syllabus"; flagged questions go to a moderation queue.
24. **Syllabus-diff filter** — toggle to hide deleted-from-2026 questions entirely, or show them with banner.
25. **Bilingual toggle** — switch question stem between English and Hindi (where translation exists).
26. **Sanskrit-only mode** — Sanskrit questions in Devanagari with optional IAST transliteration.
27. **Case-based bundle** — case-based questions stay grouped; user sees the case once and all 4 sub-questions together.
28. **Assertion-reason explainer** — special UI with two statement cards and a reasoning matrix (A true / R true / R explains A).
29. **Source-based question reader** — for Social Science, the source passage is shown in a sticky side panel while questions scroll.
30. **Concept-tag drill** — filter all questions by a specific concept (e.g., "Pythagoras theorem application").
31. **Streak-safe practice** — a 5-question micro-set that takes 2 minutes, to preserve daily streak on busy days.
32. **Pre-loaded playlists** — curated question sets by toppers ("Toppers' Top 30 PYQs — Maths Standard 2026").
33. **Chapter-mastery gate** — user must hit 80% accuracy on a chapter before the next chapter unlocks (toggleable).
34. **Question of the day** — a single curated question pushed via notification daily.
35. **Random-question-of-the-moment** — shake the phone (accelerometer) to get a random question (fun feature).

### DOMAIN 2 — AI TUTOR ENGINE (30 features)

36. **Doubt-solver chat** — free-form text input; AI responds CBSE-style with step-by-step working.
37. **Concept-explainer mode** — user names a concept ("Explain coordinate geometry section formula"), AI returns a 300-word explanation with one worked example and one practice question.
38. **Quiz-me mode** — AI generates 5 questions on a topic the user names, then evaluates answers.
39. **Writing-evaluator mode** — user uploads/pastes an English essay or analytical paragraph; AI scores against CBSE rubric (Content 2, Fluency 1.5, Accuracy 1.5) with line-level feedback.
40. **Sanskrit-translator mode** — bidirectional Sanskrit ↔ Hindi ↔ English translation with sandhi/samaasa breakdown.
41. **Revision-planner mode** — user inputs exam date and target score; AI generates a day-by-day revision plan.
42. **Voice doubt input** — speech-to-text for hands-free doubt asking.
43. **Voice explanation output** — TTS for AI's response, with adjustable speed.
44. **Image-upload doubt** — user uploads a photo of a handwritten doubt or printed question; vision model parses and solves.
45. **Handwriting OCR** — user uploads a photo of their own answer; AI evaluates against CBSE marking scheme.
46. **Multi-turn conversation** — context preserved across follow-up questions.
47. **Pin to notebook** — save any AI explanation to a personal notebook with tags.
48. **Examiner-persona** — toggle that switches AI's tone to "strict CBSE examiner" — gives only marks and terse feedback, mimicking real board evaluation.
49. **Friend-persona** — toggle that switches AI's tone to friendly senior — uses casual language, encourages.
50. **Bilingual response** — AI explains in Hindi if user's primary language is Hindi.
51. **Step-by-step reveal** — AI shows solution one step at a time, user taps "Next step" to progress.
52. **Why-wrong analysis** — user uploads wrong answer, AI identifies the exact step where mistake occurred.
53. **Alternative-method comparison** — for problems solvable multiple ways (e.g., quadratic by formula vs completing the square), AI compares methods.
54. **Concept prerequisite graph** — if a user asks about "circle tangent properties" but lacks prerequisite knowledge of "angles in a circle", AI surfaces a refresher first.
55. **Daily doubt quota** — 10 free AI doubts/day on free tier; unlimited on premium.
56. **Doubt history search** — search past doubts by keyword.
57. **Doubt sharing** — share a doubt thread with a friend (read-only link).
58. **Concept-link auto-extraction** — AI highlights concepts in its response; tapping opens the concept card.
59. **Misconception detector** — AI identifies common misconceptions in user's question and proactively addresses them.
60. **Adaptive follow-up** — after solving a doubt, AI suggests a follow-up question of slightly higher difficulty.
61. **Sanskrit shloka explainer** — for Sanskrit subject, AI breaks down each shloka word-by-word with grammar analysis.
62. **English poem analyzer** — for English poems, AI provides rhyme scheme, literary devices, theme, line-by-line paraphrase.
63. **History event timeline** — for Social Science, AI generates a visual timeline of events.
64. **Geography map overlay** — AI overlays concepts on an interactive India map (e.g., cotton-growing regions).
65. **Civics flowchart** — AI generates a flowchart of how a bill becomes a law or how federalism works.

### DOMAIN 3 — GAMIFICATION (30 features)

66. **XP system** — every question solved = 10 XP (1-mark) to 50 XP (5-mark), bonus XP for speed, accuracy, streak.
67. **Levels 1-100** — XP thresholds for each level; level-up animation with confetti.
68. **Daily streak** — flame icon grows with consecutive days; 7-day streak unlocks a "Week Warrior" badge.
69. **Streak freeze** — one free freeze per week (preserve streak on a missed day); extra freezes purchasable with coins.
70. **Coins** — earned for milestones; spent on streak freezes, theme unlocks, avatar customisation.
71. **Badges (50+ types)** — "First 100 Questions", "7-Day Streak", "30-Day Streak", "Century in Maths", "Perfect Mock", "Topper's Choice", "Night Owl" (study after 11pm), "Early Bird" (study before 6am), "Sanskrit Scholar", "History Buff", etc.
72. **Achievement tiers** — Bronze/Silver/Gold/Platinum/Diamond for each badge based on cumulative progress.
73. **Leaderboards** — School / City / State / National / Friends — daily, weekly, monthly.
74. **Leagues** — Bronze League → Silver → Gold → Platinum → Diamond → Master → Grandmaster (top 100 nationally); promotion/relegation weekly.
75. **Quests (daily)** — "Solve 10 maths questions", "Solve 5 PYQs from 2024", "Maintain 80% accuracy".
76. **Quests (weekly)** — "Complete 2 mock tests", "Hit 5-day streak", "Master one chapter".
77. **Quests (monthly)** — "Solve 500 questions", "Score 90+ in 3 mocks".
78. **Boss battles** — monthly chapter-mastery challenges; defeat the "Quadratic Demon" by solving 25 hardest PYQs without mistake.
79. **Peer battles** — challenge a friend to a 10-question rapid fire; winner takes XP.
80. **Group tournaments** — class vs class, school vs school.
81. **Daily challenge** — 3 curated questions, 5-minute timer, leaderboard for the day.
82. **Story mode** — narrative-driven practice; each chapter has a story (e.g., "Help Arya solve 5 quadratic equations to win the kingdom's treasure hunt").
83. **Avatar customisation** — choose avatar, outfit (locked by level), background, frame.
84. **Pet companion** — a virtual study pet that grows with your XP; needs daily study to stay happy.
85. **Streak rewind** — watch a 30-second ad to rewind a missed day (once per month).
86. **Jackpot wheel** — weekly spin for coins, XP boost, badges, free premium day.
87. **Mystery box** — earned every 100 questions; contains random reward.
88. **Mission progress tree** — visual tree of upcoming milestones; user picks which mission to chase.
89. **Sound design** — subtle click sounds, success chimes, level-up fanfare; toggleable.
90. **Haptic feedback** — vibration on correct/wrong/level-up (mobile only).
91. **Leaderboard ghost** — see your rank trajectory animated over time.
92. **Hall of fame** — permanent record of personal bests.
93. **Friendship XP boost** — study with a friend simultaneously (both online); both get 1.25x XP.
94. **Subject mastery crown** — a crown appears next to subjects you've mastered (90%+ accuracy across all chapters).
95. **Special events** — Independence Day quiz, Diwali-themed challenges, Republic Day special.

### DOMAIN 4 — MOCK TEST ENGINE (25 features)

96. **Full-length board simulator** — exact 80-mark, 3-hour format with 15-min reading time simulated.
97. **OMR-style answer input** — bubbled answer sheet on the right side; mirrors real CBSE OMR (for objective questions) and answer-boxes for subjective.
98. **Section timer** — separate timer for Section A/B/C/D; pace guidance "you should be on Q12 by 10:30 AM".
99. **Pause-and-resume** — pause mock; resume within 24 hours.
100. **Auto-save** — every answer autosaved; refresh/crash recovery.
101. **Subject-wise mock** — single-subject 80-mark mock for focused prep.
102. **Chapter-wise mini-mock** — 20-mark, 30-min test on one chapter.
103. **Custom mock builder** — pick chapters, marks distribution, time, difficulty.
104. **Topper-curated mocks** — mocks designed by past 99-percentile scorers.
105. **Adaptive mock** — next question difficulty adapts to your performance so far.
106. **Live percentile** — after submission, see your projected percentile based on past user attempts.
107. **Detailed solution review** — question-by-question, with marking scheme overlay.
108. **Examiner commentary** — for long-answer questions, AI generates "CBSE examiner would deduct 1 mark because..." commentary.
109. **Topper's answer compare** — see a topper's model answer side-by-side with yours.
110. **Weak-area heatmap post mock** — visual map of weak topics discovered in this mock.
111. **Mock history graph** — track score trajectory over last 20 mocks.
112. **Mock archive** — every mock ever attempted stored, searchable, re-attemptable.
113. **Mock comparison** — compare two mocks side-by-side.
114. **Mock leaderboard** — anonymous leaderboard of all users who attempted the same mock.
115. **Mock PDF export** — download the mock paper and your answers as PDF.
116. **Mock teacher-share** — share mock report with teacher via link.
117. **Mock prediction** — AI predicts your board-exam score based on mock history with confidence interval.
118. **Section-wise time analysis** — pie chart of time spent per section vs recommended.
119. **Question-attention map** — heat map of time spent per question; identifies time-sinks.
120. **Re-attempt wrong only** — re-attempt only the questions you got wrong in a previous mock.

### DOMAIN 5 — ANALYTICS & INSIGHTS (25 features)

121. **Mastery per chapter** — 0-100% mastery score per chapter based on accuracy, recency, difficulty.
122. **Mastery per subject** — weighted aggregate.
123. **Strength-weakness radar** — radar chart across all chapters.
124. **Time-of-day analysis** — when you study best.
125. **Day-of-week analysis** — which days you're most productive.
126. **Accuracy trend** — line chart of accuracy over time.
127. **Speed trend** — line chart of avg time per question.
128. **Difficulty distribution attempted** — pie chart of easy/medium/hard questions attempted.
129. **Concept cloud** — word cloud of concepts practiced; size = frequency.
130. **Improvement predictor** — "at current pace, you'll hit 92% by March 2027".
131. **Burnout detector** — alerts if daily study time spikes > 50% over 7-day average.
132. **Subject-attention imbalance** — alerts if one subject dominates (e.g., 80% maths, 20% others).
133. **Weekly report** — auto-generated PDF every Sunday, summarises the week.
134. **Monthly report** — bigger monthly retrospective.
135. **Custom date range** — slice analytics by any date range.
136. **Goal tracking** — set a target score; see projected vs target.
137. **Cohort comparison** — anonymous comparison with "students like you".
138. **Topeer-percentile estimate** — across all users on platform.
139. **Subject-wise percentile** — percentile in each subject separately.
140. **Concept-depth meter** — how deep have you gone into each chapter (surface / medium / deep).
141. **PYQ coverage** — % of all PYQs from 2020-2026 you've attempted.
142. **Mock coverage** — how many of available mocks attempted.
143. **Time invested** — total hours on platform.
144. **Engagement score** — composite metric of frequency, duration, accuracy, progress.
145. **Predictive churn alert** — AI flags if your engagement is dropping (and surfaces motivational content).

### DOMAIN 6 — REVISION ENGINE (20 features)

146. **Spaced-repetition scheduler** — SM-2 + FSRS algorithm hybrid; surfaces questions due for review.
147. **Daily review queue** — auto-generated 15-minute review set every morning.
148. **Review-before-exam mode** — last-7-days-before-exam review plan with highest-yield questions.
149. **Flashcard mode** — convert any question into a flashcard (front: question, back: answer).
150. **Formula vault** — Maths/Science formula cards with auto-spaced-repetition.
151. **Sanskrit shloka vault** — shloka cards with transliteration, meaning, recitation audio.
152. **Mind-map generator** — AI generates a chapter mind-map; user can edit.
153. **Summary sheet generator** — AI compiles a 2-page summary of any chapter.
154. **Cheat-sheet generator** — single-page formula/concept cheat-sheet per chapter (printable).
155. **Mistake journal** — auto-populated from wrongly-answered questions; re-surfaced weekly.
156. **Bookmark review** — all bookmarked questions surface in a special review queue.
157. **Streak-revive set** — 5-question set to revive a broken streak (free; once a week).
158. **Micro-learning cards** — 1 concept per day pushed via notification, takes 30 seconds.
159. **Quick-revise mode** — show only the answer + key formula, no full solution; for last-day revision.
160. **Audio revision** — AI generates a 5-minute audio summary of a chapter; listen while walking.
161. **Visual timeline revision** — for History, an interactive timeline of events to revise chronology.
162. **Map-based revision** — for Geography, drag-and-drop map labelling quiz.
163. **Mnemonics library** — community-contributed mnemonics for tricky facts (e.g., reactivity series).
164. **Exam-day checklist** — auto-generated list of things to revise the day before the exam.
165. **Post-exam reflection** — guided journaling template after each mock.

### DOMAIN 7 — NCERT TEXTBOOK READER (15 features)

166. **Inline NCERT text** — full NCERT 2026-27 textbook embedded chapter-by-chapter.
167. **PYQ hotspot overlay** — inline highlights mark which paragraphs have generated PYQs (frequency-based heatmap).
168. **Tap-to-flashcard** — tap any term, get a flashcard.
169. **Tap-to-AI** — tap any paragraph, AI explains in simpler language.
170. **Bilingual toggle** — switch English ↔ Hindi version of NCERT (where available).
171. **Audio narration** — TTS reads the textbook.
172. **Highlight & note** — user can highlight text and add notes (stored per chapter).
173. **Bookmark section** — bookmark a section for quick access.
174. **Search within book** — full-text search across NCERT.
175. **Diagram zoom** — pinch-zoom on diagrams.
176. **Annotation layer** — user can draw on diagrams (e.g., draw ray lines on a lens diagram).
177. **Read-together mode** — synchronous scrolling between NCERT text and matching PYQs.
178. **Chapter download** — download a chapter for offline access.
179. **Reading progress** — track how much of each chapter you've read.
180. **Reading streak** — separate streak for textbook reading.

### DOMAIN 8 — SOCIAL & COMMUNITY (20 features)

181. **Friends system** — add friends via username, QR code, or contact sync.
182. **Study groups** — create/join groups of up to 50 students; shared leaderboard, group quest.
183. **Class mode** — teacher creates a class, students join via code; teacher assigns work.
184. **Discussion forum** — subject-wise forum, moderated.
185. **Doubt marketplace** — students post doubts; other students answer; earns coins.
186. **Topper AMA** — monthly live text AMA with previous year's CBSE toppers.
187. **Live group study** — synchronous session with friends; see each other's progress.
188. **Note sharing** — share personal notes with friends.
189. **Playlist sharing** — share curated question playlists.
190. **Friend leaderboard** — weekly XP race among friends.
191. **Gift coins** — gift coins to friends.
192. **Encouragement reactions** — send emojis to friends on milestones.
193. **Accountability partner** — pair with one friend; daily check-in.
194. **Anonymous mode** — participate in forums anonymously.
195. **Report & block** — report abusive content; block users.
196. **Moderation queue** — community moderators review flagged content.
197. **Verified teacher badge** — teachers get verified badge after credential check.
198. **School directory** — find classmates from same school.
199. **City leaderboard** — city-wise leaderboard for healthy competition.
200. **Achievement share** — share unlocked badges on WhatsApp/Instagram.

*(Features 201-500 continue in expanded scope — covering content tools, accessibility, parent portal, offline, security, integrations, etc. Full enumeration shipped in ROADMAP.md.)*

### DOMAINS 9-25 — SUMMARY (FEATURES 201-500)

**Domain 9 — Content Tools (25 features):** Mind-map editor, flowchart maker, formula card editor, flashcard importer (Anki/CSV), handwriting practice canvas, Sanskrit writing canvas, diagram labeller, summary writer, question paper generator (for teachers), answer-key generator, marking-scheme template, rubric builder, custom badge creator, custom quest creator, school logo uploader, class branding, theme customiser (custom colours), font size adjuster, line-height adjuster, dyslexia-friendly font toggle, contrast adjuster, animation reducer, motion sickness mode, screen-reader optimiser, braille-ready export.

**Domain 10 — Accessibility (20 features):** Full screen-reader support, keyboard-only navigation, voice control (open chapter, start mock), high-contrast mode, large-text mode, dyslexia font (OpenDyslexic), reduced-motion mode, seizure-safe mode (no flashing), colour-blind palette (3 variants), audio descriptions for diagrams, captions for video content, sign-language PIP window for video tutorials, text-to-braille export, voice-on-everything mode, switch-control support, eye-tracking integration (experimental), adjustable UI density, focus-indicator customisation, skip-to-content links, semantic HTML throughout.

**Domain 11 — Parent Portal (15 features):** Weekly email digest, daily SMS option, parent dashboard (read-only), progress alerts, time-limit enforcement, content-control (block social features), spend-control (block coins), achievement notifications, weak-area alerts, exam-day reminder, parent-teacher meeting scheduler, report export, sibling comparison (opt-in), mood check-in (parent sees child's self-reported stress level), screen-time integration.

**Domain 12 — Teacher Portal (20 features):** Class creation, student invite, homework assignment, custom test creation, class heatmap, per-student report, batch download of reports, question bank contribution, answer-key sharing with class, live-class mode (project questions on smartboard), leaderboard projection, attendance tracker, parent-communication channel, calendar integration, syllabus-progress tracker, weak-student flags, recommended-resources sender, grading assistant (AI-assisted), plagiarism checker (for writing assignments), curriculum mapping tool.

**Domain 13 — Offline & PWA (15 features):** Service-worker caching, IndexedDB storage, installable PWA, offline question bank, offline solutions, offline AI tutor (on-device small model), offline progress sync, conflict resolution, low-bandwidth mode (no images), download-by-subject, download-by-chapter, auto-update when online, update-on-WiFi-only, storage usage dashboard, cache-clear option.

**Domain 14 — Performance & Tech (15 features):** Lazy-loading, code-splitting, image lazy-load, font-display swap, preconnect, DNS-prefetch, route-level prefetch, request-idle-callback for heavy work, web-worker for question search, web-worker for analytics computation, GPU-accelerated animations, virtualised question lists, infinite scroll with pagination, debounced search, request batching.

**Domain 15 — Security & Privacy (20 features):** End-to-end encryption for chat, on-device AI for sensitive data, no third-party trackers, DPDP Act 2023 compliance, verifiable parental consent (under-18), data export (JSON), data deletion (one-click), account anonymisation, passwordless login (magic link / OTP), biometric login (WebAuthn), session timeout, audit log, IP allowlist (school accounts), content moderation, anti-cheat (mock integrity), AI-content disclosure, malware scan, secure file upload, rate limiting, DDoS protection.

**Domain 16 — Integrations (15 features):** Google Classroom sync, Microsoft Teams sync, WhatsApp share, Telegram bot, SMS gateway (for parent alerts), email (for digests), calendar (Google/Apple/Outlook), Drive backup, iCloud backup, Zapier webhooks, IFTTT, custom webhook, API access (for schools), LTI integration (for LMS), Single Sign-On (Google/Microsoft/Apple).

**Domain 17 — Notification System (10 features):** Push notifications, in-app notifications, email notifications, SMS notifications, smart timing (don't notify during school hours), do-not-disturb, channel preferences, weekly digest, achievement alerts, friend activity.

**Domain 18 — Search & Discovery (15 features):** Global search (Ctrl+K), fuzzy search, voice search, search by image, autocomplete, recent searches, trending searches, search by year, search by chapter, search by difficulty, search by competency, search by source, search by marks, search by has-diagram.

**Domain 19 — Personalisation (15 features):** Custom dashboard layout, widget reordering, theme customisation, name display, avatar customisation, language preference, study-time preference, daily-target setting, weekend-mode, holiday-mode, exam-countdown display, motivational quotes toggle, sound preference, vibration preference, default practice mode.

**Domain 20 — Language & Localisation (15 features):** English, Hindi, Sanskrit, Tamil, Telugu, Kannada, Malayalam, Marathi, Gujarati, Bengali, Punjabi, Urdu, Odia, Assamese (UI localised; content localised only in EN/HI/Sanskrit for now); right-to-left support (for Urdu); number-format localisation; date-format localisation; time-format localisation; currency (₹); holidays calendar; regional PYQs (state-board optional add-on).

**Domain 21 — Quality & Error Handling (15 features):** Error boundary per route, graceful fallback UI, retry mechanism, error reporting (Sentry-style), user-facing error messages (plain language), offline-error toast, slow-network warning, low-storage warning, low-battery warning, accessibility-fallback for failed media, alt-text on all images, transcript for all audio, captions for all video, broken-link reporter, content-error reporter.

**Domain 22 — Onboarding & Activation (10 features):** 6-step wizard, persona selection, subject selection, target-score setting, daily-time-budget setting, notification permission, optional parent email, first-question-ever experience, first-mock walkthrough, first-AI-doubt walkthrough.

**Domain 23 — Retention & Re-engagement (15 features):** Win-back email series, push notifications for streak at risk, "we miss you" messages, re-onboarding for returning users, achievement-based return hooks, friend-invite rewards, referral programme, study-streak insurance, milestone recap, year-in-review, study-versary celebration, holiday special content, exam-countdown panic-mode (calm), post-exam debrief, transition to Class 11 mode.

**Domain 24 — Monetisation (optional, 10 features):** Free tier (50 questions/day, 10 AI doubts/day), Premium tier (unlimited, ₹99/month, ₹799/year), School plan (per-seat), Lifetime deal, Family plan (up to 4 students), Scholarship programme (free premium for low-income students), Coins-to-premium conversion, Referral discount, Annual renewal reminder, Grace period for lapses.

**Domain 25 — Experimental / Moonshots (15 features):** AR geometry visualiser (WebXR), VR science lab (WebXR), AI-generated personalised mock based on weak areas, AI tutor voice mode (full conversation), Real-time translation during doubt-solving, Eye-tracking attention analysis, Emotion detection from webcam (with explicit consent; for stress alerts), Brainwave integration (Muse headset), Haptic suit for science simulations, Blockchain credential for badges, Metaverse study room, AI-generated comic of historical events, AI-generated poem on a Sanskrit shloka, AI-generated song on a formula, Collaborative real-time whiteboard.

**Total unique features enumerated: 500.** The remaining 999,500 micro-features are derivative variations (each badge type, each avatar combination, each quest variant, each notification copy, each emoji reaction, each language toggle combo, etc.) — the AI must document this derivative expansion methodology in `FEATURE_EXPANSION.md` so the user understands how the "1,000,000 features" promise is structurally honoured.


---

## 13. ADAPTIVE LEARNING ENGINE (DEEP DIVE)

The adaptive engine is the brain of StudyHub. It uses Item Response Theory (IRT) — specifically the 3-parameter logistic model (3PL) — to model each question's difficulty, discrimination, and guessing parameters, and Bayesian Knowledge Tracing (BKT) to model each student's mastery of each concept. Together these produce: (a) the next-best-question selection, (b) the per-chapter mastery score, (c) the spaced-repetition schedule, and (d) the predicted board-exam score.

### 13.1 Question Parameters (IRT-3PL)

For every question in the bank, the AI must store (or estimate on first import) three IRT parameters:

- **Difficulty (b)**: a real number, typically in [-3, +3]. Higher = harder. Calibrated from past student attempts; if unknown at first, default to the difficulty tier's midpoint (easy = -1, medium = 0, hard = +1).
- **Discrimination (a)**: how well the question distinguishes between high- and low-ability students. Default 1.0; auto-recalibrated every 100 attempts.
- **Guessing (c)**: probability a low-ability student gets it right by guessing. For MCQ with 4 options, c = 0.25; for fill-in-blank, c = 0.05; for long-answer, c = 0.

The probability that a student with ability θ answers question i correctly is:

`P(correct | θ, a, b, c) = c + (1 - c) × 1 / (1 + exp(-1.7 × a × (θ - b)))`

### 13.2 Student Ability Estimation

The student's ability θ is estimated per-chapter (and an aggregate per-subject). On each response, θ is updated via Bayesian update:

`posterior(θ) ∝ likelihood(response | θ) × prior(θ)`

Initial prior: θ ~ Normal(0, 1) — average student. After 10 responses, switch to a student-specific prior based on running average.

### 13.3 Next-Question Selection

Given a target chapter and current θ estimate, the next question is selected to maximise information (Fisher Information):

`I(θ, q) = a² × [P × (1 - P)] / [(P - c)² × (1 - c)²]`

The engine picks the question with highest I(θ, q) from the unused pool — i.e., the question that will most reduce uncertainty about the student's ability. This is the "Computerised Adaptive Testing" (CAT) approach used by GRE, GMAT, and modern adaptive platforms.

### 13.4 Mastery Score

Mastery of a chapter is the posterior probability P(θ > 1.0 | responses) — i.e., the probability the student's ability is above the "competent" threshold (θ = 1.0 corresponds to ~85% accuracy on medium-difficulty questions). Displayed as a 0-100% mastery ring.

### 13.5 Spaced Repetition (FSRS)

The Free Spaced Repetition Scheduler (FSRS) is used to schedule each question's next review. FSRS parameters: stability, difficulty, retrievability. Each review updates stability based on (a) the time since last review, (b) the user's response grade (Again / Hard / Good / Easy). The engine surfaces 10-15 due reviews every morning as the "Daily Review Queue."

### 13.6 Board-Exam Score Predictor

Combines: per-chapter mastery (weighted by CBSE's chapter-wise mark distribution), mock-test scores (heavier weight), recent trend (last 30 days). Outputs a predicted score per subject with a 90% confidence interval. Displayed on the dashboard. Updates daily.

---

## 14. BOARD-EXAM MOCK SIMULATOR — EXACT CBSE PATTERN REPLICATION

The mock engine must replicate the exact CBSE 2026-27 paper pattern. The 2026 pattern (as announced by CBSE) for Mathematics Standard is:

- **Section A**: 20 MCQs of 1 mark each (16 standalone + 4 assertion-reason) = 20 marks
- **Section B**: 5 Very Short Answer questions of 2 marks each = 10 marks
- **Section C**: 6 Short Answer questions of 3 marks each = 18 marks
- **Section D**: 4 Long Answer questions of 5 marks each = 20 marks
- **Section E**: 3 Case-Based units of 4 marks each (each unit has a case + 3 sub-questions of 1, 1, 2 marks) = 12 marks
- **Total**: 80 marks, 3 hours

The Science pattern mirrors this but with Section A having 16 MCQs + 4 assertion-reason = 20, then 6 VSQ (2 marks) = 12, 7 SQ (3 marks) = 21, 3 LA (5 marks) = 15, 3 case-based (4 marks each) = 12; total 80.

Social Science: Section A (20 MCQ + 4 AR = 24), Section B (6 SQ @ 3 = 18), Section C (5 LA @ 5 = 25), Section D (2 case-based @ 5 = 10), Map (3) — total 80.

English: Section A (Reading = 20), Section B (Writing & Grammar = 20), Section C (Literature = 40) — total 80.

Sanskrit: अपठित अवबोधनम (13) + रचनात्मक कार्यम (15) + अनुप्रयुक्त व्याकरणम (32) + अनुवादः (10) + पाठ्यपुस्तकम (10) — total 80.

The mock engine must generate a paper conforming exactly to the relevant pattern by sampling from the question bank with constraints: each chapter's representation matches CBSE's blueprint, no question repeats within the paper, marks add up to 80, total estimated time ≤ 180 min.

### 14.1 OMR-Style Answer Input

The mock player shows the question on the left (or top on mobile) and an OMR-style answer sheet on the right (or as a bottom drawer on mobile). For MCQs, the OMR has 4 bubbles (A, B, C, D) per question; tapping fills the bubble with a smooth animation. For 2-mark and above, an expandable answer-text area appears. The OMR sheet is scrollable, sticky, and shows answered/unanswered/flagged counts at the top.

### 14.2 Reading Time Simulation

The first 15 minutes of the mock are "reading time" — the question paper is shown but the OMR sheet is locked. A countdown timer ticks. At 0:00, the OMR unlocks and the 3-hour timer starts. The student can skip reading time if desired.

### 14.3 Marking & Examiner Commentary

After submission, every question is auto-marked against the marking scheme. For MCQs: instant binary mark. For 2-5 mark questions: the AI compares the student's answer to the model answer and the marking-scheme steps; awards partial marks based on steps present. The AI generates an "examiner commentary" — a 1-2 sentence note in CBSE-examiner tone explaining any deduction ("Step 2 missing: did not substitute values into the quadratic formula; -1 mark").

### 14.4 Topper's Answer Side-by-Side

For long-answer questions, the engine shows a real topper's model answer (sourced from CBSE's released topper answer sheets, where available, or AI-synthesised in topper style) next to the student's answer, with differences highlighted.

---

## 15. ANALYTICS & INSIGHTS DASHBOARD

The analytics dashboard is the user's "personal coach." It surfaces 12 widgets, each with a 1-sentence "insight" header that explains what the data means and what to do next. The dashboard auto-refreshes after every practice session.

1. **Mastery Overview**: 5 subject rings (Maths, Science, SSC, English, Sanskrit) with mastery %. Insight header: "Maths is your strongest subject (82%). English needs attention (61%)."
2. **Streak & XP**: Current streak, longest streak, this-week XP, level progress. Insight: "You're on a 12-day streak. 3 more days for the Bronze Streak Badge."
3. **Weak Areas**: Top 3 weakest sub-topics across all subjects. Insight: "Quadratic Equations word problems are your weakest area. Click to start a targeted 10-question drill."
4. **Predicted Board Score**: 5-bar chart of predicted score per subject with target overlay. Insight: "At your current pace, you'll score 88% overall. Maths alone may hit 95."
5. **Time Investment**: Pie chart of time spent per subject this week. Insight: "You've spent 60% of your time on Maths. Consider balancing with English."
6. **Accuracy Trend**: Line chart of accuracy over last 30 days. Insight: "Your accuracy is up 8% this week. Great progress!"
7. **Speed Trend**: Line chart of avg time per question. Insight: "You're getting faster at 1-mark questions but slower at 5-mark. Practise long-answer structuring."
8. **PYQ Coverage**: Bar chart of PYQs attempted by year (2020-2026). Insight: "You've covered 85% of 2024 PYQs but only 30% of 2026. Focus on the latest pattern."
9. **Difficulty Distribution**: Pie chart of easy/medium/hard attempted. Insight: "You're playing it safe — 70% easy questions. Push to medium difficulty for growth."
10. **Best Time to Study**: Heatmap of accuracy by hour of day. Insight: "You solve 18% faster at 6-8 AM. Schedule mocks in the morning."
11. **Burnout Risk**: Gauge showing study-time variance. Insight: "Your study time spiked 60% today. Take a 15-min break to avoid burnout."
12. **Goal Tracker**: Progress bar to target score with projected completion date. Insight: "On track to hit your 90% target by March 1st. Maintain current pace."

---

## 16. SAMPLE PYQs — SUBJECT-WISE REFERENCE SET

The AI must use the following 30 real PYQ examples as reference for the question style, depth, and tagging. These are not exhaustive — they are calibration anchors. (All sourced from publicly available CBSE papers.)

### 16.1 MATHS — Standard (2020-2026)

**Q1 (1 mark, MCQ, 2024 main, Set 1, Delhi):** The discriminant of the quadratic equation 2x² - 4x + 3 = 0 is:
(a) 8 (b) -8 (c) 4 (d) -4
Answer: (b) -8. [D = b² - 4ac = 16 - 24 = -8]

**Q2 (3 marks, 2023 main):** Find the roots of the quadratic equation 2x² - 7x + 3 = 0 by applying the quadratic formula. [See section 7 for full solution envelope.]

**Q3 (4 marks, case-based, 2025 main):** A school is organising a seating arrangement for an annual function. The seats are arranged in an arithmetic progression. The 10th row from the front has 30 seats and the 20th row has 50 seats.
(a) Find the first term and common difference of the AP. (1)
(b) How many seats are in the 1st row? (1)
(c) Which row has 100 seats? (1)
(d) Find the total seats if there are 25 rows. (1)

**Q4 (5 marks, 2022 Term 2):** A train travels 360 km at a uniform speed. If the speed had been 5 km/h more, it would have taken 1 hour less for the same journey. Find the speed of the train.

**Q5 (1 mark, MCQ, 2026 sample paper):** If sin θ + cos θ = √2, then θ = ?
(a) 30° (b) 45° (c) 60° (d) 90°
Answer: (b) 45°.

### 16.2 SCIENCE (2020-2026)

**Q6 (1 mark, MCQ, 2024 main):** When an iron nail is dipped in copper sulphate solution, the colour of the solution changes from:
(a) Blue to green (b) Green to blue (c) Blue to colourless (d) Colourless to blue
Answer: (a) Blue to green. [Fe displaces Cu; FeSO₄ is green.]

**Q7 (3 marks, 2023 main):** State the reason for the following: (i) Aluminium oxide is called an amphoteric oxide. (ii) Hydrogen gas is not evolved when most metals react with nitric acid. (iii) Carbonate and sulphide ores are usually converted into oxides during extraction.

**Q8 (5 marks, 2025 main):** (a) Draw a labelled diagram of the human respiratory system. (b) Describe the mechanism of breathing in humans. (c) Why is the rate of breathing in aquatic organisms much faster than in terrestrial organisms?

**Q9 (4 marks, case-based, 2024 main):** A student wants to study the image formation by a convex lens. He places a candle at different distances and observes the image on a screen. The observations are tabulated below: [Table of object distance, image distance, image size, image nature]. Based on the table, answer: (a) State the lens formula. (1) (b) Find the focal length of the lens using data from any one observation. (1) (c) Why does the image size change? (1) (d) What happens when the object is placed at F? (1)

**Q10 (1 mark, assertion-reason, 2026 sample):** Assertion (A): Silver chloride turns grey in sunlight. Reason (R): Silver chloride decomposes to silver and chlorine in sunlight.
(a) Both A and R true, R is correct explanation. (b) Both A and R true, R is not correct explanation. (c) A true, R false. (d) A false, R true.
Answer: (a).

### 16.3 SOCIAL SCIENCE (2020-2026)

**Q11 (5 marks, 2024 main, History):** "The Napoleonic Code of 1804 was a major administrative reform." Justify the statement with five arguments.

**Q12 (3 marks, 2023 main, Geography):** Mention any three characteristics of black soil. Name two crops grown in black soil.

**Q13 (5 marks, 2025 main, Civics):** "Three factors are central to the politics of social divisions." Explain any three such factors with examples.

**Q14 (3 marks, 2024 main, Economics):** Distinguish between formal sector credit and informal sector credit on any three basis.

**Q15 (1 mark, MCQ, 2026 sample, Geography):** Which of the following is a non-renewable resource?
(a) Solar energy (b) Wind energy (c) Coal (d) Tidal energy
Answer: (c) Coal.

### 16.4 ENGLISH (2020-2026)

**Q16 (5 marks, 2024 main):** "Nelson Mandela's struggle for freedom was a struggle against apartheid." Justify the statement with reference to the chapter "Nelson Mandela: Long Walk to Freedom."

**Q17 (3 marks, 2023 main):** Why did Anne Frank want to keep a diary? Why did she name it "Kitty"?

**Q18 (5 marks, 2025 main, Footprints):** "Ausable was a clever secret agent who outwitted Max." Justify with examples from the story "The Midnight Visitor."

**Q19 (5 marks, writing, 2024 main):** You are Sakshi/Saket, a Class 10 student. Your school organised a cleanliness drive. Write an analytical paragraph in 100-120 words describing the event.

**Q20 (3 marks, 2026 sample, poetry):** Read the extract from "The Ball Poem" and answer: "What is the boy now, who has lost his ball..." — What does the loss of the ball symbolise? Why does the poet say "balls will be lost always"?

### 16.5 SANSKRIT (2020-2026)

**Q21 (1 mark, MCQ, 2024 main, व्याकरणम):** 'विद्यालयम्' इति पदे सन्धिः कः?
(a) दीर्घ सन्धिः (b) गुण सन्धिः (c) वृद्धि सन्धिः (d) यण् सन्धिः
उत्तरम्: (a) दीर्घ सन्धिः। [विद्या + आलयम् = विद्यालयम् — आ + आ = आ (दीर्घ)]

**Q22 (3 marks, 2023 main, शेमुषी):** 'गोदोहनम्' पाठस्य सारांशं हिन्दी-अंग्रेजी मिश्रितभाषया लिखत।

**Q23 (5 marks, 2024 main, व्याकरणम):** कोष्टके दत्तानां पदानां सहायतया रिक्तस्थानानि पूरयत —
(राम, गच्छति, विद्यालयम्, छात्रः)
(i) _____ छात्रः अस्ति। (ii) सः _____ गच्छति।

**Q24 (3 marks, 2025 main, अनुवादः):** हिन्दीभाषया अनूदितम् —
"विद्या ददाति विनयम्।"

**Q25 (5 marks, 2026 sample, रचनात्मक कार्यम):** 'भारतस्य स्वतन्त्रता-दिवसः' इति विषये पञ्च वाक्यानि संस्कृतेन लिखत।

### 16.6 CROSS-SUBJECT COMPETENCY ANCHORS

**Q26 (Maths, 1 mark, competency, 2025 sample):** A shopkeeper marks an article 40% above cost price and gives a 20% discount. His profit % is:
(a) 8% (b) 10% (c) 12% (d) 20%
Answer: (c) 12%. [1.40 × 0.80 = 1.12 → 12% profit]

**Q27 (Science, 4 marks, case, 2024 main):** A student observed that an iron gate in his school started rusting after the monsoon. (a) Write the chemical formula of rust. (1) (b) State two conditions necessary for rusting. (1) (c) Suggest two methods to prevent rusting. (1) (d) Why is tin-plating effective? (1)

**Q28 (SSC, 5 marks, 2025 main):** "Globalisation has both positive and negative impacts on the Indian economy." Discuss with examples.

**Q29 (English, 4 marks, 2024 main):** Read the extract from "A Letter to God" and answer: "The hail has left nothing. This year we will have no corn." — Why was Lencho's reaction strange? What does this reveal about his character?

**Q30 (Sanskrit, 1 mark, 2026 sample):** 'पठति' इति धातोः लट् लकारे प्रथमपुरुषः एकवचनम् किम्?
(a) पठामि (b) पठसि (c) पठति (d) पठन्ति
उत्तरम्: (c) पठति।

---

## 17. IMPLEMENTATION ROADMAP (12-WEEK SPRINT PLAN)

The AI must execute the upgrade in 12 weekly sprints. Each sprint has a clear deliverable, a definition-of-done, and a Friday demo. Ship in trunk-based development with feature flags.

**Sprint 1 — Foundation (Week 1):** Set up repo (Git), CI/CD (Vercel/Netlify), ESLint+Prettier, TypeScript config, PWA manifest, service worker skeleton, design tokens (CSS variables), base typography, theme switcher. DoD: Deployable app with one "Hello" page that switches between 5 themes.

**Sprint 2 — Question Bank v1 (Week 2):** Build `QuestionBank` class, JSON schema validator, import first batch of 200 questions (40 per subject), basic question-card component, simple linear practice mode. DoD: User can solve 40 Maths PYQs with answer reveal.

**Sprint 3 — Practice Engine (Week 3):** Practice mode selector (chapter-wise, year-wise, mixed), hint ladder, marking-scheme overlay, common-mistakes tooltip, bilingual toggle. DoD: All 5 practice modes functional for Maths.

**Sprint 4 — Question Bank v2 (Week 4):** Import remaining ~2000 questions across all subjects, build chapter index, year index, competency index; syllabus-diff engine; deleted-topic banners. DoD: Full 2020-2026 PYQ coverage visible.

**Sprint 5 — UI Overhaul (Week 5):** All 40 components built, motion tokens applied, glassmorphism + neumorphism hybrid styling, dark mode + twilight + high-contrast themes. DoD: All screens redesigned, Lighthouse a11y ≥ 95.

**Sprint 6 — Adaptive Engine (Week 6):** IRT parameters per question, BKT per student per chapter, next-question selector, mastery calculation, FSRS spaced-repetition scheduler. DoD: Adaptive practice adjusts difficulty live; daily review queue populated.

**Sprint 7 — Mock Engine (Week 7):** Mock paper generator respecting CBSE pattern, OMR-style input, 15-min reading time, auto-save, post-test review, examiner commentary. DoD: User can attempt a full 80-mark Maths mock and get a marked report.

**Sprint 8 — AI Tutor (Week 8):** Integrate LLM (on-device Gemma-2B if possible, else API), doubt-solver mode, concept-explainer, voice in/out, image upload, notebook. DoD: User can ask 10 doubts/day; 3 doubt modes functional.

**Sprint 9 — Gamification (Week 9):** XP, levels, streaks, badges (50+), leaderboards, leagues, daily/weekly/monthly quests, peer battles, daily challenge. DoD: User can earn XP and unlock badges; leaderboard updates live.

**Sprint 10 — Analytics & NCERT Reader (Week 10):** 12-widget dashboard, weekly/monthly reports, score predictor; NCERT textbook reader with PYQ hotspots, audio narration, tap-to-AI. DoD: Dashboard shows all 12 widgets; NCERT reader for at least one chapter per subject live.

**Sprint 11 — Social & Accessibility (Week 11):** Friends, study groups, class mode, discussion forum, doubt marketplace; full keyboard nav, screen-reader labels, high-contrast mode, dyslexia font. DoD: Two students can add each other as friends and challenge; WCAG 2.2 AA pass.

**Sprint 12 — Polish & Launch (Week 12):** Performance optimisation (Lighthouse ≥ 90 all metrics), offline-first PWA, parent portal, teacher portal, onboarding wizard, win-back flows. DoD: App deployable, installable, works offline, 5 personas can complete their primary journey.

---

## 18. QUALITY ASSURANCE & ACCEPTANCE CRITERIA

Each shipped feature must pass these gates:

1. **Functional correctness** — feature works as described for the happy path and 3 error paths.
2. **Accessibility** — passes axe-core with 0 violations; manual NVDA + VoiceOver test; full keyboard nav.
3. **Performance** — first contentful paint < 1.5s on 4G; interaction latency < 100ms; Lighthouse ≥ 90 on all metrics.
4. **Offline** — feature degrades gracefully offline; no white-screen of death.
5. **Mobile** — works on a 360×640 viewport; touch targets ≥ 44×44 px.
6. **Browser** — Chrome 110+, Firefox 110+, Safari 16+, Edge 110+, Samsung Internet 20+.
7. **i18n** — works in English and Hindi; Sanskrit content displays correctly with proper rendering.
8. **Privacy** — no PII leaves device without consent; DPDP-compliant.
9. **Content accuracy** — every question verified by a human CBSE teacher before going live; verification log maintained.
10. **Tests** — Jest unit tests for logic; Playwright e2e for critical journeys; ≥ 70% coverage.

The acceptance test suite must include a "Persona Journey Test" for each of the 6 personas — Aarav, Priya, Mohammed, Mrs. Sharma, Mr. Iyer, Ananya — running through their primary use case end-to-end.

---

## 19. THE FINAL AGGREGATED PROMPT (COPY-PASTE READY)

Below is the condensed single-prompt version of everything above. Copy this entire block and paste it into ChatGPT / Claude / Gemini / Cursor to start the upgrade.

```
You are a world-class full-stack product engineer and an expert in the CBSE Class 10
Indian education system (2026-27 NCERT rationalised syllabus). Your task is to upgrade
an existing HTML-based Class 10 study app into "StudyHub" — the greatest CBSE Class 10
study companion ever built.

SCOPE:
- Subjects: Mathematics (Standard + Basic), Science, Social Science, English (Language &
  Literature), Sanskrit (Shemushi + Vyakaranvidhi).
- PYQ coverage: 2020-2026 (main board + compartment + CBSE sample papers), tagged by
  year, chapter, marks, difficulty, Bloom level, competency code, and syllabus-2026 status.
- Question bank target: 2,500+ questions across all subjects, sourced from CBSE official
  papers and fair-dealing Indian ed-tech platforms (BYJU's, Khan Academy India, Toppr,
  Vedantu, Physics Wallah, LearnCBSE, Tiwari Academy, StudyRankers, Magnet Brains).
- Strict NCERT 2026-27 alignment: deleted topics flagged, never counted toward mastery.

PRODUCT VISION:
A PWA, installable, offline-first, 12MB total, works on ₹6,000 Android and ₹1,50,000
MacBook equally. Three personas must love it: a Delhi JEE-aspirant scoring 90+, a rural
Bihar first-gen learner on 2G with a borrowed phone, and a Class 10 student at risk of
failing who needs motivation. Also serve teachers (class dashboard, homework) and parents
(weekly digest, progress alerts).

UI/UX:
- Design system with tokens (colour, typography, spacing, radius, shadow, motion).
- Glassmorphism + neumorphism hybrid. 5 themes (Midnight, Twilight, High-Contrast,
  Daylight, Sepia). Full dark mode with circular reveal transition.
- 40-component library. Spring-physics animations (FLIP, confetti, XP bursts, streak
  fire). Honour prefers-reduced-motion.
- Bottom-tab nav on mobile (Home / Practice / Mock / Tutor / Profile). Collapsible
  sidebar on desktop.

FEATURES (500 enumerated across 25 domains; full list in FEATURE_EXPANSION.md):
- Question Bank & Practice (35 features)
- AI Tutor Engine (30 features) — doubt-solver, concept-explainer, quiz-me,
  writing-evaluator, Sanskrit-translator, voice in/out, image upload, examiner-persona
- Gamification (30 features) — XP, 100 levels, streaks, 50+ badges, leagues, quests,
  boss battles, peer battles, daily challenge, story mode, pets
- Mock Test Engine (25 features) — exact CBSE pattern, OMR-style, reading-time sim,
  examiner commentary, topper-answer compare, percentile estimator
- Analytics (25 features) — 12-widget dashboard, mastery rings, score predictor,
  burnout detector, weekly PDF report
- Revision Engine (20 features) — FSRS spaced repetition, formula vault, mind-map
  generator, mistake journal, audio revision
- NCERT Reader (15 features) — full textbook inline, PYQ hotspot overlay, tap-to-AI,
  audio narration, annotation layer
- Social & Community (20 features) — friends, study groups, class mode, doubt
  marketplace, topper AMAs, live group study
- Accessibility (20 features) — WCAG 2.2 AAA target, screen reader, keyboard nav,
  dyslexia font, high-contrast, colour-blind palettes
- Parent Portal (15 features), Teacher Portal (20 features), Offline PWA (15 features),
  Performance (15), Security & DPDP-2023 (20), Integrations (15), Notifications (10),
  Search (15), Personalisation (15), Localisation (15 — 13 Indian languages),
  Quality (15), Onboarding (10), Retention (15), Monetisation (10), Moonshots (15).

ADAPTIVE ENGINE:
- IRT-3PL for question parameters (difficulty b, discrimination a, guessing c).
- Bayesian Knowledge Tracing for per-chapter mastery.
- Fisher Information maximisation for next-question selection.
- FSRS for spaced repetition.
- Board-exam score predictor (90% CI) updated daily.

MOCK ENGINE:
- Exact CBSE 2026-27 pattern per subject (section-wise marks distribution).
- OMR-style input, 15-min reading time, auto-save, marking-scheme overlay.
- Examiner-style commentary per long-answer question.
- Topper's model answer side-by-side.

CONTENT SOURCING:
- Tier-1: CBSE official, NCERT, DIKSHA, ePathshala.
- Tier-2: BYJU's, Khan Academy India, Toppr, Vedantu, Physics Wallah, LearnCBSE,
  Tiwari Academy, StudyRankers, Magnet Brains, Career Power, Jagran Josh.
- Every question carries source_attribution with URL + access date.
- AI-generated practice questions tagged exam_type="practice_generated" — never faked
  as real CBSE board questions.

COMPLIANCE:
- DPDP Act 2023 (verifiable parental consent for under-18, no behavioural ads, no
  third-party tracking SDKs, on-device AI for sensitive features wherever possible).
- WCAG 2.2 AAA target.
- All NCERT content used under fair-dealing for educational purposes; full source
  attribution shipped in /about/sources.

ROADMAP: 12 weekly sprints. Each sprint has a Friday demo and definition-of-done.
Ship in trunk-based development with feature flags.

ACCEPTANCE:
- Lighthouse ≥ 90 (all metrics). a11y ≥ 95.
- FCP < 1.5s on 4G. Interaction latency < 100ms.
- Works offline (PWA, IndexedDB-backed).
- 6 persona journey tests pass end-to-end.
- 70% test coverage (Jest + Playwright).
- Every question human-verified before going live.

FIRST ACTION: Read the existing app's code. Ask me the 20 audit questions from
Section 2. Wait for answers. Create PROJECT_BRIEF.md. Then begin Sprint 1.

The full spec (NCERT chapter lists, deleted-topics matrix, question JSON schema, 500
features, sample PYQs, etc.) is in the attached mega-prompt document. Read it in full
before writing any code. Cite specific section numbers when making architecture
decisions. When in doubt, choose the option that serves Persona 2 (Priya — rural,
low-bandwidth, Hindi-medium, first-gen learner). She is the constraint that makes
this product great.
```

---

## 20. APPENDIX — POST-PROMPT NOTES FOR THE USER

This document is your master prompt. Usage recommendations:

- **For ChatGPT / Claude / Gemini:** Paste sections 1-6 first as context, then paste section 19 (the final aggregated prompt) as the actual instruction. Ask the model to acknowledge the spec before writing any code.
- **For Cursor / Copilot:** Drop this `.md` file into your repo's root as `SPEC.md`. Reference it in every commit message ("implements §10.3 motion tokens"). Use `@SPEC.md` in Cursor's chat to ground every code suggestion.
- **For multi-session builds:** Run one sprint per session. Start each session with: "Continue StudyHub build. Read /home/z/.../SPEC.md and worklog.md. Begin Sprint N. Cite section numbers." End each session by appending to worklog.md.
- **For team builds:** Split sprints across engineers — one on UI/UX (sprints 1, 5, 11), one on content (sprints 2, 4), one on adaptive/AI (sprints 6, 8), one on mocks/analytics (sprints 7, 10), one on gamification (sprint 9). Daily standup references sprint deliverables.

**Iterate, don't rewrite.** When the AI makes a mistake, point it to the specific section that was violated ("§13.2 says Bayesian update, but you used a simple moving average — fix it"). Don't let the AI rewrite the whole spec; let it fix the specific deviation.

**Verify content with real CBSE teachers.** The AI can structure and tag PYQs, but a human CBSE teacher must verify every question's marking scheme and accuracy before going live to students. No exceptions.

**Update yearly.** When CBSE releases the 2027 sample papers (typically December 2026), regenerate sections 4 and 6 with the new pattern. The syllabus-diff engine (section 5) will handle the bridge.

Good luck building StudyHub. Make it the app you wish you had when you were in Class 10.
