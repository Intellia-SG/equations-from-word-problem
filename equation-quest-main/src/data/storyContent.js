// src/data/storyContent.js
// 4 Widescreen Story Panels for EquationQuest (Grade 7)
// Conforms to PRD §8.2 and TRD §4.3

export const STORY_PANELS = [
  {
    panel: 0,
    title: "The Case of the Missing Number 🔍",
    text: "At Detective HQ, junior investigators Wei Jie and Deepa received their very first official case assignment. A local fruit shopkeeper had a dilemma: 'I started with a full crate of fresh mangoes. We sold 18 mangoes today, and now exactly 14 are left in the crate. But I forgot my opening count!' Wei Jie pulled out his casebook. 'In primary school, we used bar models. But in Secondary 1, we have a far more powerful tool: algebra!' Deepa's eyes lit up. 'Let's track down the missing number!'",
    highlight: "🔍 Opening Mangoes − 18 sold = 14 left in crate",
    character: "Wei Jie & Deepa",
    characterEmoji: "🧑🏻",
    imageBg: "radial-gradient(circle, #3b82f6 0%, #1e1b4b 100%)",
    imageEmoji: "🔍",
  },
  {
    panel: 1,
    title: "Naming the Unknown 🦊",
    text: "Milo the Fox, Chief Mentor at Detective HQ, adjusted his deerstalker hat and tapped the chalkboard. 'Rule number one of algebra detective work: always name your unknown first! Write: Let x equal the number of mangoes the shopkeeper started with.' Deepa jotted it down swiftly. 'Now we translate the crime scene clue into math: starting with x mangoes and losing 18 means x minus 18.' Milo nodded approvingly. 'Spot on, Deepa. x − 18 is our algebraic expression!'",
    highlight: "📝 Step 1: Let x = the unknown quantity · Translating: x − 18",
    character: "Milo the Fox",
    characterEmoji: "🦊",
    imageBg: "radial-gradient(circle, #f59e0b 0%, #78350f 100%)",
    imageEmoji: "🦊",
  },
  {
    panel: 2,
    title: "The Detective's Balance ⚖️",
    text: "Milo brought out a polished brass balance scale. 'An equation is like a level scale: both sides must stay perfectly balanced at all times. Since x − 18 equals 14, the two pans are equal: x − 18 = 14.' Deepa reached to add 18 to the left pan to isolate x. 'Wait!' cautioned Wei Jie methodically. 'Whatever you do to one side of the equals sign, you MUST do to the exact other side! If we add 18 to the left side, we must also add 18 to the right side to keep the balance level.'",
    highlight: "⚖️ The Golden Rule: Whatever you do to one side, do to the other!",
    character: "Wei Jie",
    characterEmoji: "🧑🏻",
    imageBg: "radial-gradient(circle, #10b981 0%, #064e3b 100%)",
    imageEmoji: "⚖️",
  },
  {
    panel: 3,
    title: "Cracking the First Case 🏆",
    text: "Together, the pair performed the balanced operation: x − 18 + 18 = 14 + 18, which cleanly gave x = 32! 'Hold on,' Deepa said, remembering Milo's training. 'A master detective always checks by substitution.' She plugged 32 back into the original clue: 32 − 18 = 14. It matched perfectly! 'The shopkeeper started with exactly 32 mangoes,' announced Wei Jie proudly. Chief Milo stamped the dossier: CASE CLOSED!",
    highlight: "🏆 Solve: x = 32 · Verify: 32 − 18 = 14 ✓ · Case Closed!",
    character: "Deepa & Wei Jie",
    characterEmoji: "👧🏽",
    imageBg: "radial-gradient(circle, #8b5cf6 0%, #31104b 100%)",
    imageEmoji: "🏆",
  },
];

export default STORY_PANELS;
