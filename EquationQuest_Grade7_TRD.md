# EquationQuest — Module TRD
**Grade 7 · Equations from Word Problems**
*(Technical companion to `EquationQuest_Grade7_PRD.md`, produced from `Intellia_Module_Blueprint_TRD.md`. Repo: `equation-quest-main`. Default clone source: `G2-Money-Money-main`, unless a more recent sibling module is designated as the actual clone source at build time.)*

---

## 1. Reference Analysis Notes — Gotcha Check

Check each of the following fresh against whichever repo is actually used as the clone source, per platform blueprint §1:

1. **Dead/duplicate `src/features/*` folder.** Confirm `App.jsx`'s actual imports before copying anything; never replicate an unused duplicate architecture into `equation-quest-main`.
2. **Hardcoded story-panel count.** This module uses the default **4 panels** (see PRD §8.2), matching the reference's assumed count — so the `state.storyPanel >= 3` check likely does *not* need generalizing this time. Still confirm the reducer isn't hardcoded to a *different* reference panel count before assuming this is a no-op.
3. **Static vs. procedural question bank.** Build `data/questionBank.js` procedurally regardless of whether the clone source itself is static — required, per platform standard, and especially important here since this module has **5 distinct equation-generation types** (one-step, two-step, bracket, fraction, applied word-problem) rather than one, making a hand-written bank particularly impractical to maintain.
4. **Viewport-clipping bug.** Proactively apply the `100dvh` + measured-header-height (`ResizeObserver`) fix in `globals.css` rather than carrying forward the `top: 70px` + `100vh` bug.
5. **Leftover branding strings.** Before delivery, check `index.html`'s `<title>` and `README.md` for stale module-name or copy references from whichever module was actually cloned.

**Module-specific risk to add to this list:** this is the first module targeting Secondary 1 content — double-check that no Primary-specific copy (e.g. references to bar models, PSLE-style phrasing, "MOE Primary Mathematics" boilerplate in the README) survives from the clone source. See PRD §15 assumption 1.

## 2. Tech Stack

Unchanged from platform blueprint §2.1 — reuse verbatim:

```json
{
  "dependencies": {
    "framer-motion": "^12.42.0",
    "lucide-react": "^1.22.0",
    "react": "^19.2.7",
    "react-dom": "^19.2.7"
  },
  "devDependencies": {
    "@types/react": "^19.2.17",
    "@types/react-dom": "^19.2.3",
    "@vitejs/plugin-react": "^6.0.2",
    "autoprefixer": "^10.5.2",
    "dotenv": "^17.4.2",
    "node-fetch": "^3.3.2",
    "oxlint": "^1.69.0",
    "postcss": "^8.5.16",
    "tailwindcss": "^3.4.4",
    "vite": "^8.1.0"
  },
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "generate-audio": "node scripts/generate_audio.js",
    "clean-audio": "node scripts/clean_audio.js",
    "lint": "oxlint",
    "preview": "vite preview"
  }
}
```
`vite.config.js` (`base: '/'`), `tailwind.config.js`, `postcss.config.js`, `vercel.json` — reuse as-is.

## 3. Folder Structure

```
equation-quest-main/
├── public/assets/{audio/, story/}
├── scripts/
│   ├── generate_audio.js         # MODIFY: new `phrases` array (§8)
│   └── clean_audio.js            # reuse as-is
├── src/
│   ├── assets/story/             # story_1.png ... story_4.png
│   ├── components/
│   │   ├── IntroScreen.jsx/.css  # MODIFY: title/copy only
│   │   ├── ProgressMap.jsx/.css  # reuse as-is
│   │   ├── shared/
│   │   │   ├── Mascot.jsx/.css              # reuse as-is (props swap to Milo the Fox)
│   │   │   ├── FeedbackOverlay.jsx/.css     # reuse as-is
│   │   │   ├── FloatingNumbers.jsx/.css     # reuse as-is
│   │   │   └── EquationVisual.jsx           # NEW — §5.1
│   │   ├── gamification/
│   │   │   ├── KingdomMap.jsx/.css  # reuse as-is
│   │   │   └── StarRating.jsx       # reuse as-is
│   │   ├── quiz/
│   │   │   ├── QuestionRenderer.jsx/.css  # MODIFY: import EquationVisual
│   │   │   └── BossBattleModal.jsx/.css   # reuse as-is
│   │   ├── phases/
│   │   │   ├── WonderPhase.jsx/.css    # MODIFY: content only
│   │   │   ├── StoryPhase.jsx/.css     # MODIFY: content only (panel-count logic unchanged, see §1.2)
│   │   │   ├── SimulatePhase.jsx/.css  # MODIFY: 4 new station imports/labels
│   │   │   ├── PlayPhase.jsx/.css      # reuse as-is
│   │   │   └── ReflectPhase.jsx/.css   # MODIFY: 3 new recap questions (§6.3)
│   │   └── simulations/
│   │       ├── BalanceScaleLab.jsx      # NEW — Concept Discovery Lab — §6
│   │       ├── CrackTheCombination.jsx  # NEW — Build-to-Target Challenge — §6
│   │       ├── BuildTheCaseFile.jsx     # NEW — Multi-Step/Composite Construction — §6
│   │       ├── SpotTheFakeClue.jsx      # NEW — Error-Detective — §6
│   │       └── Stations.css             # MODIFY: extend with balance/vault/fraction visual classes
│   ├── config/
│   │   ├── worlds.config.js       # MODIFY: 10 topic-themed worlds — §4.1
│   │   ├── characters.config.js   # MODIFY: Wei Jie / Deepa / Milo — §4.2
│   │   └── audio.config.js        # reuse as-is
│   ├── core/hooks/useViewport.js  # reuse as-is
│   ├── hooks/useAudio.js          # reuse as-is
│   ├── data/
│   │   ├── storyContent.js        # MODIFY: 4 story panels — §4.3
│   │   └── questionBank.js        # MODIFY: procedurally generated 100 Qs — §4.4
│   ├── utils/
│   │   ├── audio.js               # reuse as-is
│   │   ├── audioMap.js            # auto-generated — do not hand-edit
│   │   ├── narration.js           # MODIFY: topic-specific phase scripts — §8
│   │   ├── badgeEngine.js         # MODIFY: relabelled BADGES array only — §7
│   │   ├── scoring.js             # reuse as-is
│   │   ├── shuffle.js             # reuse as-is
│   │   └── equationMath.js        # NEW — §4.4
│   ├── styles/
│   │   ├── design-tokens.css      # MODIFY: 10 new --world-N accent colors — §9
│   │   └── globals.css            # reuse as-is (apply viewport fix from §1.4 proactively)
│   ├── App.jsx                    # MODIFY only if the clone source's panel-count logic differs from 4 (§1.2)
│   ├── App.css / main.jsx / index.css   # reuse as-is
├── index.html / package.json / vite.config.js / tailwind.config.js / postcss.config.js / vercel.json / .oxlintrc.json / .gitignore
└── README.md                      # MODIFY: module-specific + art-brief (PRD §13)
```

## 4. Data Layer

### 4.1 `config/worlds.config.js`
Ten entries in the fixed shape, populated from PRD §9:

```js
export const WORLDS = [
  { id: 0, name: "The Mystery Letter", emoji: "👻", accent: "var(--world-0)",
    description: "Translate worded phrases into algebraic expressions",
    conceptFocus: "translate-expressions",
    boss: { name: "The Phrase Phantom", emoji: "👻", reward: "Cipher Badge" } },
  { id: 1, name: "The Balance Case", emoji: "⚖️", accent: "var(--world-1)",
    description: "Solve one-step equations with the balance method",
    conceptFocus: "one-step-equations",
    boss: { name: "The Scale Tipper", emoji: "⚖️", reward: "Balance Badge" } },
  { id: 2, name: "The Two-Step Trail", emoji: "🎭", accent: "var(--world-2)",
    description: "Solve two-step equations (ax + b = c)",
    conceptFocus: "two-step-equations",
    boss: { name: "Double Trouble Dan", emoji: "🎭", reward: "Trailblazer Badge" } },
  { id: 3, name: "The Bracket Vault", emoji: "🔓", accent: "var(--world-3)",
    description: "Solve equations requiring bracket expansion",
    conceptFocus: "bracket-equations",
    boss: { name: "The Bracket Bandit", emoji: "🔓", reward: "Vault Cracker Badge" } },
  { id: 4, name: "The Fraction Files", emoji: "🗂️", accent: "var(--world-4)",
    description: "Solve equations containing a simple fraction",
    conceptFocus: "fraction-equations",
    boss: { name: "Fraction Fiona", emoji: "🗂️", reward: "Files Closed Badge" } },
  { id: 5, name: "Coins & Clues", emoji: "🪙", accent: "var(--world-5)",
    description: "Form and solve equations from money scenarios",
    conceptFocus: "money-word-problems",
    boss: { name: "The Coin Counterfeiter", emoji: "🪙", reward: "Treasury Badge" } },
  { id: 6, name: "Ages & Alibis", emoji: "🕰️", accent: "var(--world-6)",
    description: "Form and solve equations from age scenarios",
    conceptFocus: "age-word-problems",
    boss: { name: "The Age-Old Alibi", emoji: "🕰️", reward: "Timeline Badge" } },
  { id: 7, name: "Perimeter Puzzle", emoji: "📐", accent: "var(--world-7)",
    description: "Perimeter and consecutive-integer word problems",
    conceptFocus: "geometry-consecutive-word-problems",
    boss: { name: "The Perimeter Prowler", emoji: "📐", reward: "Blueprint Badge" } },
  { id: 8, name: "Detective's Verdict", emoji: "🧩", accent: "var(--world-8)",
    description: "Full multi-step applied word problems",
    conceptFocus: "multi-step-applied-word-problems",
    boss: { name: "The Case Cracker", emoji: "🧩", reward: "Verdict Badge" } },
  { id: 9, name: "The Grand Case File", emoji: "🎩", accent: "var(--world-9)",
    description: "Mixed review of every concept above",
    conceptFocus: "mixed-review",
    boss: { name: "The Mastermind", emoji: "🎩", reward: "Chief Detective Trophy" } },
];
```

### 4.2 `config/characters.config.js`
```js
export const CHARACTERS = {
  weiJie: { name: "Wei Jie", role: "The methodical detective", emoji: "🧑🏻", colour: "var(--char-1)", mascotEmoji: "🦊" },
  deepa:  { name: "Deepa",   role: "The quick-thinking detective", emoji: "👧🏽", colour: "var(--char-2)", mascotEmoji: "🦊" },
  milo:   { name: "Milo the Fox", role: "Mascot & mentor", emoji: "🦊", colour: "var(--mascot)", mascotEmoji: "🦊" },
};
export const MASCOT = { name: "Milo the Fox", emoji: "🦊" };
```

### 4.3 `data/storyContent.js`
`STORY_PANELS` array, length 4, per PRD §8.2, fixed shape `{ panel, title, text, highlight, character, characterEmoji, imageBg, imageEmoji }`. Content authored from the PRD's panel table — titles: "The Case of the Missing Number," "Naming the Unknown," "The Detective's Balance," "Cracking the First Case."

### 4.4 Question Bank — Procedural Generation

**`utils/equationMath.js`** — pure helper functions shared by the question generator and the Simulate stations:

| Function | Purpose |
|---|---|
| `pickCleanCoefficient(range)` | Draws a coefficient from a curated pool (e.g. `{2,3,4,5,6,7,8,9,10,12}`), never an unconstrained random int. |
| `generateOneStepEquation()` | Produces `x+a=b`, `x-a=b`, `ax=b`, or `x/a=b` with an integer solution. |
| `generateTwoStepEquation()` | Produces `ax+b=c` with an integer solution. |
| `generateBracketEquation()` | Produces `a(x+b)=c`, constrained so the post-expansion solve step yields an integer. |
| `generateFractionEquation()` | Produces `x/a+b=c` with denominator `a ∈ {2,3,4,5}` chosen so the solution is an integer. |
| `generateMoneyWordProblem()` | Produces a money-context equation with all values in whole dollars or exact 5/10/25/50-cent increments. |
| `generateAgeWordProblem()` | Produces an age-context equation; enforces plausible human ages (8–80) and rejects any scenario producing a negative "years ago" age. |
| `generatePerimeterWordProblem()` | Produces a geometry-context equation with positive integer side lengths (1–100 cm range). |
| `generateConsecutiveIntegerProblem()` | Produces a consecutive-integer word problem with small, positive integers. |
| `evaluateExpression(expr, xValue)` | Evaluates an expression tree/string for a given `x`, used for both generation and the Simulate stations' live readouts. |
| `formatEquationString(equation)` | Renders an equation object to display string (and to the narration-ready spoken form per PRD §11). |
| `verifySolution(equation, candidate)` | Substitutes a candidate value back in and checks equality — used both for QA stress-testing and for the "check your answer" step modelled in Story panel 4. |

**"Clean number" constraints (hard requirements, not inline magic numbers):**
- Every generated equation across all 5 types must resolve to an integer solution, except Fraction Files, where the *intermediate* fraction is real but the *final* solution is still constrained to an integer (denominator restricted to `{2,3,4,5}`, numerator chosen accordingly).
- Money scenarios: values in whole dollars or exact 5/10/25/50-cent steps — never fractions of a cent.
- Age scenarios: ages held in an 8–80 human-plausible range; any "years ago" branch is rejected and re-rolled if it would produce a negative age.
- Perimeter/consecutive-integer scenarios: side lengths and integers kept small and positive (1–100).

**`data/questionBank.js` generation:**
One or more template functions per `conceptFocus` (10 total concept slugs from §4.1), each of which:
1. Draws numeric inputs via the curated helpers above — never an unconstrained random range.
2. Produces exactly 4 options: 1 correct + 3 distractors reflecting real misconceptions researched for this topic (see §10 Risks / QA for the specific list — sign errors moving a term across the equals sign, under-distributing a bracket (especially one preceded by a minus), performing an operation on only one side or only part of a fraction, and — for word-problem worlds specifically — correctly solving the equation but reporting the wrong quantity, e.g. giving "years ago" instead of current age).
3. Fills `explanation`, `hint1` (points at the first step — "start by naming the unknown" / "start by isolating the term with x"), `hint2` (walks the arithmetic), and `visualData` (whatever `EquationVisual.jsx` needs — see §5.1).

Fixed output schema (unchanged):
```js
{
  id: Number, districtId: Number, category: String, visual: String,
  questionText: String, options: [String], correctAnswer: String,
  explanation: String, hint1: String, hint2: String, visualData: Object,
}
```
Also export `DISTRICTS` (derived from `WORLDS`) so `PlayPhase.jsx`'s existing import is unmodified.

## 5. Component Specs

### 5.1 `EquationVisual.jsx`
Replaces the reference's domain visual component. Takes `{ type, data, compact }`. Supported `type` values, matching the question bank's `visual` field:
- `"phrase-to-expression"` — renders a phrase alongside a build-up of the matching expression.
- `"balance-diagram"` — a simple SVG balance/scale showing both sides of the equation, used for one-/two-step worlds.
- `"bracket-highlight"` — renders the equation with the bracketed term visually grouped/highlighted, and an expansion arrow animation for the worked-example/explanation view.
- `"fraction-bar"` — renders the fraction term with numerator/denominator visually separated, for the Fraction Files world.
- `"word-problem-diagram"` — a light contextual illustration (coins for money, a timeline for age, a labelled rectangle for perimeter) tying the equation back to its real-world scenario.

`compact` prop shrinks the rendering for inline use inside `QuestionRenderer.jsx`'s Play-phase question card. Also reused inside the Simulate stations wherever a live diagram is needed (Balance Scale Lab in particular reuses the `balance-diagram` renderer as its live interactive surface, not just a static illustration).

## 6. Simulate Station Specs

All 4 follow the fixed per-station contract: `<StationComponent onComplete={fn} audioEnabled={bool} />`, self-contained internal state, live SVG visuals themed with `design-tokens.css` variables (never hardcoded colors), a `station-success` panel with a "Complete Station ✓" CTA, and keyboard-operable +/− controls alongside any slider/drag interaction.

| Component | Archetype | Student manipulates | Live feedback | Completion gate |
|---|---|---|---|---|
| `BalanceScaleLab.jsx` | Concept Discovery Lab | Drags weight tiles onto either pan of a visual balance; performs an operation (add/remove/multiply/divide) on one pan | The balance visually tips if the two pans become unequal, and levels out when the same operation is mirrored on both sides | Free exploration of at least 2 operation types, **plus one confirmation question** ("if you removed 3 from the left pan, what must you do to the right?") per the platform archetype — flagged in the PRD (§15.5) as worth confirming against the general free-play preference before finalizing |
| `CrackTheCombination.jsx` | Build-to-Target Challenge | A slider representing the value of *x*, with keyboard +/− steppers | A live-computed readout of the left-hand expression's current value vs. the target (right-hand side), like a combination-lock display | Hitting the exact target value; a "try another round" loop offers a fresh target before the station is markable complete |
| `BuildTheCaseFile.jsx` | Multi-Step/Composite Construction | Drags phrase-chunks from a word-problem scenario into equation-builder slots ("let *x* = …", operator, constant, "=", target), then solves the assembled equation | The assembled equation renders live as chunks are placed; a running "your equation so far" readout updates with each drop | Correctly assembling the equation from the scenario **and** solving it — targets the module's most advanced learning objective (PRD LO 7) |
| `SpotTheFakeClue.jsx` | Error-Detective | Taps the line of a multi-line worked solution that contains the seeded mistake, then selects/types the correction | The tapped line highlights; a magnifying-glass cursor effect on hover reinforces the detective framing | Correctly identifying the erroneous line and supplying the fix; mistake pool drawn from the same misconception list used for question-bank distractors (§4.4, §10) |

Wire all 4 into `SimulatePhase.jsx`'s `STATIONS` array and station-index render switch; tab bar, footer navigation, progress dots, and `COMPLETE_SIM_STATION`/`ADVANCE_SIM_STATION` gating logic are reused verbatim from the reference.

### 6.3 `ReflectPhase.jsx` Recap Questions
Replace the 3 hard-coded recap questions with 3 targeting the "bracket sign error / operate on the whole side" misconception (PRD §8.5), matching the Error-Detective station's focus.

## 7. Gamification

`utils/scoring.js` (`calcXP`, `calcStars`) — reuse formulas as-is. `utils/badgeEngine.js` — reuse `checkBadges(state)` trigger logic as-is; only the `BADGES` array's display strings change, per PRD §10's rename table (First Clue Found, Hot on the Trail, Master Detective Streak, Full Forensics Kit, Case Closed, Suspect Cracked, Seasoned Investigator, Chief Detective Badge).

## 8. Audio Pipeline

`config/audio.config.js`, `utils/audio.js`, `hooks/useAudio.js`, `utils/audioMap.js` (auto-generated) — reuse mechanics as-is (cache-check → dynamic ElevenLabs fetch → HTML5 `Audio` playback → i+1 preloading, no browser TTS fallback).

Rewrite `utils/narration.js` function *bodies* (not signatures — `wonderNarration`, `storyNarration(panel)`, `simStationIntro(stationIdx)`, `playQuestionNarration`, `playCorrectNarration`, `playWrongNarration`, `playHint1Narration`, `playHint2Narration`, `districtCompleteNarration`, `bossStartNarration`, `bossWinNarration`, `reflectNarration`, `reflectCompleteNarration`) and `scripts/generate_audio.js`'s `phrases` array using the topic-specific "always spell this in full" rules from PRD §11 (letter "ex," "equals," "over" for fractions, "negative n," "the quantity …" for brackets, "coefficient"/"variable" spelled out, "n dollars and n cents"). After content lock: `npm run generate-audio` then `npm run clean-audio`.

## 9. Design Tokens

`styles/design-tokens.css` — reuse core palette, font stack, radii, shadows, transitions as-is. Regenerate only the `--world-0` through `--world-9` accent block:

| World | Accent (indicative) |
|---|---|
| 0 — The Mystery Letter | `#6C63FF` (indigo) |
| 1 — The Balance Case | `#2DD4BF` (teal) |
| 2 — The Two-Step Trail | `#F5A623` (amber) |
| 3 — The Bracket Vault | `#9B5DE5` (purple) |
| 4 — The Fraction Files | `#F15BB5` (rose) |
| 5 — Coins & Clues | `#FFC53D` (gold) |
| 6 — Ages & Alibis | `#38BDF8` (sky) |
| 7 — Perimeter Puzzle | `#22C55E` (green) |
| 8 — Detective's Verdict | `#FB6340` (deep orange) |
| 9 — The Grand Case File | `#DC2626` (crimson — deliberately the most dramatic, for the finale) |

## 10. Build, QA, and Delivery

1. **Question bank stress test** — ≥300 randomized generations (30,000 questions) across all 5 equation-generation types; assert no duplicate options, no out-of-range/negative ages or lengths, no non-integer "final" solutions outside the fraction-world's allowed denominators, no malformed/`NaN`/`undefined` fields.
2. **Misconception audit** — spot-check that distractors are drawn from the researched misconception set (sign errors on moving terms across `=`, under-distributed brackets — especially bracket-preceded-by-minus, operating on only one side or only part of a fraction, correct equation but wrong reported quantity in a word problem) rather than arbitrary numbers.
3. **Audio parity check** — every string passed to a narration helper has an exact match in `audioMap.js`, or is intentionally dynamic.
4. **Full user-journey walkthrough** — Wonder → Story (all 4 panels) → Simulate (all 4 stations completable, tab-gating correct) → Practice (World Map, all 4 modes reachable, all 10 Boss Battles winnable, badges unlock) → Reflect (new recap renders, scorecard accurate) — zero console/page errors.
5. **Production build check** — `npm install && npm run build` succeeds from a clean extract.
6. **Accessibility spot-check** — Simulate/Play fonts and touch targets present at the (Secondary-appropriate, more restrained) sizing from PRD §12; visual aids carry text labels, not color-only; all slider interactions have keyboard equivalents.
7. **Delivery checklist** — zip excludes `node_modules/`/`dist/`; 4 story image placeholders at the reference's exact dimensions with an art-brief README; `README.md` updated (and checked for leftover Primary-module branding per §1); `.env.local.example` documents `VITE_ELEVENLABS_API_KEY` with no real key committed.

## 11. Risks

- **First Secondary-level build.** No prior sibling module to sanity-check tone, difficulty calibration, or visual maturity against — the reference architecture and design system were all proven on Primary content. Budget extra review time on the first playable build specifically for age-appropriateness (PRD §15.6).
- **Highest question-bank complexity to date.** Five distinct equation-generation types (vs. typically one or two calculation types in prior modules) sharing one 10-world/100-question bank increases the surface area for the "clean number" QA pass — the stress test in §10.1 is more load-bearing here than in prior modules and should not be abbreviated.
- **Concept Discovery Lab design tension.** PRD §15.5 flags a real tension between the blueprint's default archetype (light confirmation question) and a previously stated preference for pure free-play stations — resolve before `BalanceScaleLab.jsx` is built, since it changes the component's state shape (whether it needs an answer-checking branch at all).
- **Bracket-preceded-by-minus misconception is the single highest-value distractor pattern** for this topic per research (§10.2) — make sure it's represented across *multiple* worlds (not just Bracket Vault) since it recurs inside Detective's Verdict and Grand Case File composite problems too.
