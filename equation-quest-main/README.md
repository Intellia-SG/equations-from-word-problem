# EquationQuest — Grade 7 Mathematics

**Topic:** Equations from Word Problems  
**Curriculum Standards:** Singapore MOE Secondary 1 Mathematics — *Number and Algebra* strand (Linear Equations in One Variable).

---

## 1. Module Overview
EquationQuest teaches students to translate real-world scenarios into linear equations in one variable and to solve those equations using the **balance method** — including equations with brackets, fractions, and multi-step applied word problems (money, age, perimeter, consecutive integers).

The learning journey is framed as an investigative detective mystery: every world is a "case," the unknown quantity is "the missing number," and the student plays a junior detective alongside **Wei Jie**, **Deepa**, and mentor **Milo the Fox 🦊**.

---

## 2. Five-Phase Pedagogy
1. **Wonder:** The Case of the Missing Mangoes (`x − 18 = 14`).
2. **Story:** 4 comic panels introducing the unknown, the balance method rule, and substitution verification.
3. **Simulate:** 4 interactive forensics labs:
   - **Station A (The Balance Scale Lab):** Concept Discovery Lab with a dynamic SVG scale and operation controls.
   - **Station B (Crack the Combination Safe):** Build-to-Target Challenge manipulating the value of $x$.
   - **Station C (Build the Case File):** Composite Construction assembling and solving equations from clues.
   - **Station D (Spot the Fake Clue):** Error-Detective identifying and fixing seeded algebraic slips.
4. **Practice (Play):** 10 Themed Worlds × 10 Questions = 100 questions with 10 World Boss Battles.
5. **Reflect:** Core concept check, student journal reflection, and Chief Detective certificate scorecard.

---

## 3. Story Panel Art Brief (PRD §13)
The module includes 4 custom-illustrated story panels in `src/assets/story/`:
1. `1.png`: Detective HQ office, Wei Jie and Deepa receiving the mango case dossier from the fruit shopkeeper.
2. `2.png`: Milo the Fox coaching the pair on naming the unknown first (`Let x = the unknown`).
3. `3.png`: A polished golden balance scale demonstrating the balance method rule.
4. `4.png`: The pair celebrating cracking the case, verifying $32 - 18 = 14$, with Milo stamping "CASE CLOSED".

---

## 4. Audio Pipeline
Uses ElevenLabs (Alice voice profile, `eleven_multilingual_v2`) for narration:
- Pronunciation rules: letter "ex", "equals", "over" for fractions, "the quantity ...", and full word spelling.
- Offline pre-generation: `npm run generate-audio`
- Orphan audio cleanup: `npm run clean-audio`
- Automated question bank stress test: `npm run test:bank`

---

## 5. Development & Build
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run 30,000-question QA stress test
npm run test:bank

# Build for production
npm run build
```
