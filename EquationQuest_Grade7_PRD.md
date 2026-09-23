# EquationQuest — Module PRD
**Grade 7 · Equations from Word Problems**
*(Produced from `Intellia_Module_Blueprint_PRD.md` — {{GRADE}} = Grade 7, {{TOPIC}} = Equations from Word Problems, {{SPECIAL_INSTRUCTIONS}} = none supplied, defaults assumed throughout)*

---

## 1. Overview

EquationQuest teaches students to translate real-world scenarios into linear equations in one variable, and to solve those equations using the balance method — including equations with brackets and simple fractions. It is framed as a detective mystery: every world is a "case," the unknown is "the missing number," and the student plays a junior detective who must find x to crack the case.

## 2. Background

This module continues Intellia Global's five-phase (Wonder → Story → Simulate → Play → Reflect) pedagogical architecture, reusing the `G2-Money-Money-main` reference architecture per the platform blueprint. It is built to mirror the established reference codebase and design system exactly, per the platform's standing convention (equal-groups-main / speed-rate-intro-main / etc.).

> **⚠️ Scope flag:** every prior Intellia Global module on record targets Singapore MOE **Primary** Mathematics (Grade 1–6). This is the first module built against **Secondary 1** content. It is scoped and researched accordingly below, but this represents a genuine expansion of the product's grade range and should be confirmed with stakeholders before build (see §15).

## 3. Standards Alignment

**Source:** Singapore MOE Secondary 1 Mathematics syllabus, *Number and Algebra* strand — specifically the "Algebraic Expressions and Formulae" and "Equations and Inequalities" content areas, narrowed to the "Simple Equations in One Variable" sub-topic (commonly taught as forming and solving linear equations, including simple fractional equations, and using them to solve word problems).

**In-scope skills:**
- Using a letter to represent an unknown number.
- Translating a worded phrase or statement into an algebraic expression.
- Translating a worded problem into a linear equation in one variable.
- Solving one-step and two-step linear equations using inverse operations ("the balance method").
- Solving linear equations that require expanding a bracket first.
- Solving linear equations containing a simple fraction (clearing the denominator).
- Checking a solution by substitution, and interpreting it back in the context of the original problem.

**Adjacent skills treated as bridge only, not tested in the question bank:**
- **Simultaneous linear equations (two unknowns)** — Secondary 2 content; referenced only conceptually if at all ("some mysteries need two clues — that's a case for next year").
- **Solving simple inequalities** — a sibling Secondary 1 topic taught in the same syllabus cluster, but a distinct skill; explicitly out of scope.
- **Quadratic equations** — Secondary 3/4 content; not referenced.
- **General algebraic manipulation (expanding/factorising/changing the subject) as a standalone skill** — treated as a supporting tool inside equation-solving questions, not as its own question category.

**Domain conventions to encode as house style:**
- Always define the unknown explicitly first ("Let *x* = …") before forming the equation — this is the MOE-taught convention and is reinforced in narration and worked examples.
- Equations are solved via the **balance method** (whatever you do to one side, you do to the other) rather than the Primary-school bar-model method. The Story phase should acknowledge the bar model as "what you used to use" and position algebra as the more powerful upgrade, rather than silently ignoring it (see open question in §15).
- Every worked/modelled solution ends with a **substitution check** and a one-line interpretation in the problem's real-world context (money, age, length) — not just a bare numeric answer.

## 4. Learning Objectives

By the end of this module, a student should be able to:
1. Translate a worded phrase (e.g. "5 more than a number," "twice a number decreased by 3") into an algebraic expression.
2. Translate a one- or two-step worded statement into a linear equation in one variable, correctly defining the unknown first.
3. Solve a one-step linear equation (`x + a = b`, `x − a = b`, `ax = b`, `x/a = b`) using inverse operations.
4. Solve a two-step linear equation (`ax + b = c`) using the balance method.
5. Solve a linear equation that requires expanding a bracket (`a(x + b) = c`) before it can be balanced.
6. Solve a linear equation containing a simple fraction (`x/a + b = c`) by clearing the denominator.
7. Form and solve a linear equation from a multi-step real-world word problem (money, age, perimeter, consecutive integers), including choosing which quantity to let *x* represent.
8. Verify a solution by substitution and correctly interpret it in the context of the original problem (units, reasonableness, "which value does the question actually want?").

Ordering above runs foundational → applied (recall → single-step solving → two-step/bracket/fraction solving → multi-step real-world application), and directly drives the world sequence in §9.

## 5. Inherited Standards *(Section A of the platform blueprint — copied verbatim, unchanged)*

- **Five-phase architecture:** Wonder → Story → Simulate → Play ("Practice" in-UI) → Reflect, per the fixed definitions in blueprint §A.1.
- **Gamification:** XP per question (attempts/hints/streak), 0–3 stars per world (9–10✓=3★, 7–8=2★, 5–6=1★, below=0★), continuous streak tracking, 8 fixed badge triggers (relabelled per §10), 10 Boss Battles (5Q/3 lives each).
- **Practice modes:** Guided (5Q, hints, untimed), Independent (10Q, no hints), Timed Challenge (8Q, 60s), Boss Battle (5Q, 3 lives) — unchanged.
- **Audio pipeline:** ElevenLabs Alice voice only, 6 emotional presets, pre-generated static `.mp3`s + dynamic generation for procedurally-varying text, no browser TTS fallback, strict 1:1 narration/on-screen-text parity.
- **Question bank shape:** 10 worlds × 10 questions = 100, procedurally generated and QA stress-tested (≥300 randomized runs), fixed schema (`id, worldId, category, visual, questionText, options, correctAnswer, explanation, hint1, hint2, visualData`), World 9 (last, 0-indexed) is always the mixed-review grand finale.
- **Product standards:** React/Vite/Tailwind/Framer Motion, pixel-faithful reuse of `design-tokens.css`, enlarged Simulate/Practice fonts and touch targets, delivered as a zip (no `node_modules`/`dist`) with placeholder story art + art-brief README.

## 6. Enhancement Requests / Special Instructions

None were supplied for this build. Defaults applied throughout this PRD:
- Default 4-panel Story (justified in §8.2 — the topic fits within 4 without needing extension).
- Singaporean-multicultural naming convention for the two named characters (§7).
- Theme-specific mascot override, with rationale stated (§7) — a detective theme reads poorly with the default owl and reads well with a fox.

## 7. Module Identity

- **Module name:** **EquationQuest**
- **Story theme:** a junior-detective mystery framing — "Detective HQ" receives a new case in every world, and the unknown quantity is always the thing that's missing from the case. This suits Secondary 1's older age band (12–13), which the platform blueprint explicitly says can support a more abstract/project-based setting than a Primary module's concrete everyday setting.
- **Named characters** (Singaporean-multicultural convention, first names only):
  - **Wei Jie** — the methodical one, favours the balance method, double-checks every step.
  - **Deepa** — the quick-thinking one, spots patterns fast, sometimes needs reminding to check her answer.
- **Mascot: Milo the Fox 🦊** (deerstalker hat, magnifying glass) — **overriding the default Tally the Owl**, because the detective theme is carried by the mascot's visual identity as much as the story, and a fox reads more naturally as a sharp-eyed investigator than the platform's default owl. Consistent with prior precedent for theme-specific mascot swaps (Pip the Parrot, Dash the Cheetah).

## 8. Five-Phase Journey Detail

### 8.1 Wonder
Single hook screen: *"A shopkeeper counted his mangoes this morning. Some were sold. Now there are 14 left — but he can't remember how many he started with. Can you help find the missing number?"* Sets up "the missing number" as the central mystery motif carried through every phase.

### 8.2 Story — 4 panels (default, not exceeded)
The topic's concept progression (translate → balance-method rule → worked example) fits cleanly inside 4 panels without needing the extended-panel exception, so the default is kept.

| # | Title | Concept delivered | Narrative beat |
|---|---|---|---|
| 1 | The Case of the Missing Number | Hook: an unknown quantity needs finding | Wei Jie and Deepa are recruited by Detective HQ for their first case — a missing number. |
| 2 | Naming the Unknown | Vocabulary: "let *x* = the unknown"; translating a phrase into an expression | Milo the Fox teaches them to always name the unknown before doing anything else. |
| 3 | The Detective's Balance | Formal rule: the balance method — whatever you do to one side, do to the other | Wei Jie demonstrates with a literal balance scale prop; Deepa almost skips a step and gets corrected. |
| 4 | Cracking the First Case | Worked application: a full word problem → equation → solve → check → interpret | The pair solves the mango case together, checks by substitution, and Detective HQ confirms the case is closed. |

### 8.3 Simulate — 4 stations (archetype-mapped)
See full technical spec in the companion TRD. Summary:

| Station | Archetype | Premise |
|---|---|---|
| The Balance Scale | Concept Discovery Lab | Drag weights on a visual balance; any operation performed on one pan must be mirrored on the other to keep it level — builds felt understanding of *why* the balance method works. |
| Crack the Combination | Build-to-Target Challenge | Adjust a slider (the value of *x*) until a live-computed expression matches a target total, like cracking a combination lock. |
| Build the Case File | Multi-Step/Composite Construction | Drag phrase-chunks from a word-problem scenario into an equation-builder ("let *x* = …", operator, constant, "=", target), then solve the assembled equation — combines translation + solving. |
| Spot the Fake Clue | Error-Detective | A "suspect's" worked solution contains one seeded, realistic mistake (a sign error, an under-distributed bracket, an unbalanced operation); the student taps the wrong line and supplies the fix. |

### 8.4 Play / Practice
Standard, unchanged mechanics (10 worlds × 10 questions, 4 modes). See world table in §9.

### 8.5 Reflect
3 new recap questions targeting the module's most-often-misunderstood concept: **expanding a bracket preceded by a minus, and remembering to apply an operation to an entire side, not just part of it** — the same misconception the Error-Detective station targets. Followed by the standard scorecard and an optional reflection prompt ("Which case was the trickiest to crack, and why?").

## 9. World & Question Bank Table

*Shape: `{ id, name, emoji, accent, description, conceptFocus, boss: { name, emoji, reward } }`. World 9 (last) is the mixed-review grand finale per platform standard.*

| id | World | conceptFocus | Description | Boss | Reward |
|---|---|---|---|---|---|
| 0 | The Mystery Letter | `translate-expressions` | Translate worded phrases into algebraic expressions | The Phrase Phantom 👻 | Cipher Badge |
| 1 | The Balance Case | `one-step-equations` | Solve one-step equations with the balance method | The Scale Tipper ⚖️ | Balance Badge |
| 2 | The Two-Step Trail | `two-step-equations` | Solve two-step equations (`ax + b = c`) | Double Trouble Dan 🎭 | Trailblazer Badge |
| 3 | The Bracket Vault | `bracket-equations` | Solve equations requiring bracket expansion | The Bracket Bandit 🔓 | Vault Cracker Badge |
| 4 | The Fraction Files | `fraction-equations` | Solve equations containing a simple fraction | Fraction Fiona 🗂️ | Files Closed Badge |
| 5 | Coins & Clues | `money-word-problems` | Form & solve equations from money scenarios | The Coin Counterfeiter 🪙 | Treasury Badge |
| 6 | Ages & Alibis | `age-word-problems` | Form & solve equations from age scenarios | The Age-Old Alibi 🕰️ | Timeline Badge |
| 7 | Perimeter Puzzle | `geometry-consecutive-word-problems` | Perimeter & consecutive-integer word problems | The Perimeter Prowler 📐 | Blueprint Badge |
| 8 | Detective's Verdict | `multi-step-applied-word-problems` | Full multi-step "let *x* be…" applied problems | The Case Cracker 🧩 | Verdict Badge |
| 9 | The Grand Case File | `mixed-review` | Mixed review of every concept above; hardest boss | The Mastermind 🎩 | Chief Detective Trophy |

**Sample questions (illustrative, not the full 100):**

- **World 0:** *"A number increased by 7."* → `x + 7` ✓ (distractors: `7x`, `x − 7`, `7 − x`)
- **World 1:** *Solve `5x = 35`.* → `x = 7` ✓ (distractors: `175`, `30`, `40` — each reflecting multiplying instead of dividing, or an off-by-one arithmetic slip)
- **World 2:** *Solve `3x + 4 = 19`.* → `x = 5` ✓ (distractor reflecting dividing before subtracting: `x ≈ 7.67`, rounded/rejected by the "clean number" rule so a whole-number decoy is substituted instead, e.g. `x = 23`)
- **World 3:** *Solve `2(x + 3) = 16`.* → `x = 5` ✓ (distractor reflecting under-distribution, e.g. treating it as `2x + 3 = 16`)
- **World 4:** *Solve `x/4 + 2 = 9`.* → `x = 28` ✓ (distractor reflecting multiplying before subtracting: `x = 36`)
- **World 5:** *"A storybook costs $x. Three storybooks plus a $5 bookmark cost $38 in total. Find x."* → `3x + 5 = 38` → `x = 11` ✓
- **World 6:** *"Priya is x years old. In 5 years she will be 19. Find x."* → `x + 5 = 19` → `x = 14` ✓
- **World 7:** *"A rectangle's length is (x + 3) cm and width is x cm. Its perimeter is 38 cm. Find x."* → `2(x + x + 3) = 38` → `x = 8` ✓
- **World 8:** *"Wei Jie has $x. Deepa has $3 more than twice Wei Jie's amount. Together they have $54. How much does Wei Jie have?"* → `x + (2x + 3) = 54` → `x = 17` ✓
- **World 9:** mixed-type item combining a bracket and a money-word-problem framing, drawing its template from worlds 3 and 5.

## 10. Gamification — Badge Renames

| Fixed trigger | Badge name |
|---|---|
| First correct answer | First Clue Found 🔍 |
| 5-answer streak | Hot on the Trail 🔥 |
| 10-answer streak | Master Detective Streak 🕵️ |
| All 4 Simulate stations complete | Full Forensics Kit 🧰 |
| Any world scores 3 stars | Case Closed ⭐⭐⭐ |
| Any Boss Battle won | Suspect Cracked 🚨 |
| 20+ questions answered in Practice | Seasoned Investigator 📋 |
| Full 5-phase journey complete | Chief Detective Badge 🏅 |

## 11. Audio & Narration Content Rules

Topic-specific terms that must always be spoken in full (per the universal rule in blueprint §A.4):
- `x` is read as the letter "ex," never as "times."
- `=` is always spoken as "equals."
- Fractions read as "*[numerator]* over *[denominator]*" — never "slash."
- Signed values read as "negative *n*" (not "minus *n*," which is reserved for the subtraction operation).
- Bracketed expressions read as "the quantity *[expression]*" (e.g. `2(x + 3)` → "two times the quantity x plus three").
- "coefficient" and "variable" always spoken in full, never abbreviated.
- Money read as "*n* dollars and *n* cents" — never as a bare decimal.

## 12. Accessibility

Standard enlarged fonts/touch targets in Simulate and Practice apply, but calibrated toward the more restrained end of the platform's sizing range given the Secondary 1 (12–13-year-old) audience, per blueprint §A.6's grade-appropriate sizing guidance. Slider interactions (Balance Scale, Crack the Combination) require explicit +/− keyboard-operable controls, not drag-only. Visual aids (balance diagrams, bracket highlighting) carry text labels, never color-only cues.

## 13. Assets Required

4 story images at the reference's standard placeholder dimensions, delivered as blank CSS-framed placeholders per platform convention, with an art-brief README describing each panel's required scene:
1. Detective HQ office, Wei Jie and Deepa receiving the mango case.
2. Milo the Fox coaching the pair on naming the unknown.
3. A literal balance scale prop demonstrating the balance method.
4. The pair celebrating cracking the first case, checking their answer.

## 14. Success Metrics / Acceptance Criteria

Standard fixed criteria (question-bank stress test, audio parity, clean build, full-journey walkthrough) plus module-specific:
- All 5 procedurally-generated equation types (one-step, two-step, bracket, fraction, applied word-problem) reliably produce solutions that are whole numbers or curated "friendly" values — never an ugly recurring decimal or a negative age/length.
- All 4 Simulate stations are genuinely interactive (live-updating visuals), not static reveal-and-answer screens.
- Distractors across the bank reflect the real misconceptions researched for this topic (sign errors on moving terms, incomplete bracket distribution, operating on only one side, answering the wrong quantity in a word problem) rather than random numbers.

## 15. Assumptions & Open Questions

1. **Grade-range expansion:** this is the platform's first Secondary 1 (Grade 7) build against an all-Primary (Grade 1–6) catalogue. Recommend confirming with stakeholders that this is an intended scope expansion before committing build time.
2. **Scope boundary:** simultaneous equations, inequalities, and quadratics are explicitly excluded per §3 — confirm this matches the intended assessment window (e.g. if this module is meant to also cover inequalities, that would need a separate PRD pass).
3. **Character names and mascot** (Wei Jie, Deepa, Milo the Fox) are proposed defaults per the naming/mascot convention, not yet stakeholder-approved.
4. **Bar-model transition:** confirm whether the Story phase should explicitly address the Primary-school bar-model method as something being "upgraded" from (as drafted in §3), or leave it unmentioned entirely — this is a framing choice with no fixed platform precedent since this is the first Secondary module.
5. **Concept Discovery Lab completion gate:** the platform blueprint's default Concept Discovery Lab archetype (§B.5 in the blueprint) is gated on free exploration **plus one confirmation question**. This sits in tension with a previously stated general preference for Simulate stations to be pure free-play with no question/scoring element. This PRD follows the blueprint's stated archetype as written; flagging the tension here rather than silently resolving it either way — worth a quick confirm before the Balance Scale station is built.
6. **Tone calibration for an older audience:** the fixed XP/stars/badges/confetti gamification mechanics are reused as-is per §5, but the detective framing in §7 is intentionally pitched slightly more "sophisticated" than a typical Primary module's framing, in line with blueprint §B.3's guidance that older grades can support more abstract/project-based settings — worth a sanity check once the first build draft is playable, to confirm the tone lands for a 12–13-year-old rather than reading as too juvenile or too dry.
