// src/utils/narration.js
// Narration script builder for EquationQuest (Grade 7 / Secondary 1 Mathematics)
// Strictly matches on-screen text 1:1 and obeys PRD §11 pronunciation rules.

export const say       = (text) => ({ text, style: 'statement' });
export const ask       = (text) => ({ text, style: 'question' });
export const cheer     = (text) => ({ text, style: 'celebration' });
export const emphasize = (text) => ({ text, style: 'emphasis' });
export const think     = (text) => ({ text, style: 'thinking' });
export const instruct  = (text) => ({ text, style: 'instruction' });
export const encourage = (text) => ({ text, style: 'encouragement' });

// ─── INTRO & HOME SCREEN ─────────────────────────────────────────────────────
export function homeIntroNarration() {
  return [
    encourage("Hi! I'm Milo the Fox. Ready to investigate cases, name the unknown, and master the balance method?")
  ];
}

// ─── WONDER PHASE (THE MISSING MANGOES) ──────────────────────────────────────
export function wonderNarration() {
  return [
    say("Welcome to EquationQuest! Let's investigate the case of the missing mangoes!"),
    say("A shopkeeper counted his mangoes this morning. 18 mangoes were sold today, leaving 14 left in the crate."),
    ask("Can you help Detective HQ find the missing number, and solve for x?"),
    cheer("Every mystery has an unknown quantity. In algebra, we call it x! Let's crack this case together!"),
  ];
}

// ─── STORY PHASE (4 PANELS) ──────────────────────────────────────────────────
export function storyNarration(panel) {
  const scripts = [
    [
      say("At Detective HQ, junior investigators Wei Jie and Deepa received their very first official case assignment."),
      say("A local fruit shopkeeper had a dilemma: I started with a full crate of fresh mangoes. We sold 18 mangoes today, and now exactly 14 are left in the crate. But I forgot my opening count!"),
      think("In primary school, we used bar models. But in Secondary 1, we have a far more powerful tool: algebra!"),
      cheer("Let's track down the missing number!"),
    ],
    [
      say("Milo the Fox, Chief Mentor at Detective HQ, adjusted his deerstalker hat and tapped the chalkboard."),
      instruct("Rule number one of algebra detective work: always name your unknown first! Write: Let x equal the number of mangoes the shopkeeper started with."),
      say("Now we translate the crime scene clue into math: starting with x mangoes and losing 18 means x minus 18."),
      cheer("Spot on, Deepa. x minus 18 is our algebraic expression!"),
    ],
    [
      say("Milo brought out a polished brass balance scale."),
      instruct("An equation is like a level scale: both sides must stay perfectly balanced at all times. Since x minus 18 equals 14, the two pans are equal: x minus 18 equals 14."),
      say("Whatever you do to one side of the equals sign, you must do to the exact other side!"),
      cheer("If we add 18 to the left side, we must also add 18 to the right side to keep the balance level."),
    ],
    [
      say("Together, the pair performed the balanced operation: x minus 18 plus 18 equals 14 plus 18, which cleanly gave x equals 32!"),
      think("A master detective always checks by substitution. 32 minus 18 equals 14. It matched perfectly!"),
      say("The shopkeeper started with exactly 32 mangoes, announced Wei Jie proudly."),
      cheer("Chief Milo stamped the dossier: Case Closed!"),
    ],
  ];

  return scripts[panel] || scripts[0];
}

// ─── SIMULATE STATION INTROS ─────────────────────────────────────────────────
export function simStationIntro(stationIdx) {
  const intros = [
    [
      instruct("Welcome to Station A — The Balance Scale Lab!"),
      instruct("Explore how operations tip the balance scale. Perform inverse operations on both pans to isolate x while keeping the scale level!"),
    ],
    [
      instruct("Welcome to Station B — The Combination Safe!"),
      instruct("Slide and step the variable x to evaluate the expression in real time and hit the target safe code!"),
    ],
    [
      instruct("Welcome to Station C — Build the Case File!"),
      instruct("Drag and slot clue chunks to translate real-world mystery scenarios into linear equations, then solve for x!"),
    ],
    [
      instruct("Welcome to Station D — Spot the Fake Clue!"),
      instruct("Inspect suspect worked solutions, spot the seeded algebraic mistake, and supply the correct mathematical fix!"),
    ],
  ];

  return intros[stationIdx] || intros[0];
}

// ─── 10 DISTRICTS / WORLDS INTROS ────────────────────────────────────────────
export function worldIntroNarration(worldId) {
  const worldLines = [
    say("World 1: The Mystery Letter. Translate worded phrases into algebraic expressions."),
    say("World 2: The Balance Case. Solve one-step equations with the balance method."),
    say("World 3: The Two-Step Trail. Solve two-step equations and isolate the unknown."),
    say("World 4: The Bracket Vault. Expand brackets and crack the vault equation!"),
    say("World 5: The Fraction Files. Clear fractions and solve the case."),
    say("World 6: Coins and Clues. Form and solve linear equations from money scenarios."),
    say("World 7: Ages and Alibis. Form equations and crack the timeline alibis."),
    say("World 8: Perimeter Puzzle. Solve geometric perimeters and consecutive integer problems."),
    say("World 9: Detective's Verdict. Tackle multi-step applied real-world cases."),
    say("World 10: The Grand Case File. The final showdown mixed review across all concepts!"),
  ];
  return [worldLines[worldId] || worldLines[0]];
}

// ─── PRACTICE / PLAY PHASE PROMPTS & FEEDBACK ────────────────────────────────
export function practiceIntroNarration() {
  return [
    instruct("Welcome to Practice Mode! Investigate 10 mystery districts, crack equation clues, and defeat the district bosses!")
  ];
}

export function playQuestionNarration(questionText) {
  return [
    ask(questionText)
  ];
}

export function playCorrectNarration(streak = 1) {
  if (streak >= 5) {
    return [cheer("Incredible detective streak! You are cracking every case! 🔥")];
  }
  if (streak >= 3) {
    return [cheer("Awesome! Three clues solved in a row! ⭐")];
  }
  return [cheer("Spot on! That's correct! 🎉")];
}

export function playWrongNarration() {
  return [
    think("Not quite — inspect the clue, check your balance method steps, and try again! 💡")
  ];
}

export function playHint1Narration() {
  return [
    encourage("Here's your first clue! Start by naming the unknown and isolating the term with x.")
  ];
}

export function playHint2Narration() {
  return [
    encourage("Here's your final clue! Perform the exact inverse operation on both sides to find x.")
  ];
}

export function districtCompleteNarration() {
  return [
    cheer("World Complete! Spectacular detective work on this case file! 🌟")
  ];
}

export function practiceCompleteNarration() {
  return [
    cheer("Practice Phase Complete! Outstanding work investigating all 10 districts! Proceed to the Reflect Phase!")
  ];
}

// ─── BOSS BATTLES ────────────────────────────────────────────────────────────
export function bossStartNarration() {
  return [
    emphasize("The Boss Battle begins! Crack the suspect's puzzles to claim your detective badge!")
  ];
}

export function bossWinNarration() {
  return [
    cheer("Victory! You cracked the case and defeated the boss! 👑")
  ];
}

export function bossLoseNarration() {
  return [
    encourage("Out of lives! Review the balance rules and challenge the boss again!")
  ];
}

// ─── REFLECT PHASE ───────────────────────────────────────────────────────────
export function reflectNarration() {
  return [
    say("Welcome to the Reflect Phase! Let's review the key algebra rules and check your Chief Detective scorecard! 📓")
  ];
}

export function reflectReviewNarration(qIdx) {
  const reviews = [
    instruct("Question 1: When expanding a bracket preceded by a minus sign, the negative sign distributes to every term inside the bracket."),
    instruct("Question 2: When solving an equation with a fraction, either isolate the fraction first, or multiply every term on both sides by the denominator."),
    instruct("Question 3: The fundamental principle of the balance method: whatever operation you perform on one side of the equals sign, you must do to the other side."),
  ];
  return [reviews[qIdx] || reviews[0]];
}

export function reflectCompleteNarration() {
  return [
    cheer("Outstanding! You have mastered forming and solving linear equations! You are a true Chief Detective! 🏅")
  ];
}
