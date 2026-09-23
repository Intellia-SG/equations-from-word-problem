// src/data/questionBank.js
// Procedurally generated 100 Questions for EquationQuest across 10 Themed Worlds
// Strictly conforms to TRD §4.4 and PRD §9.

import { WORLDS } from '../config/worlds.config.js';
import {
  pickCleanCoefficient,
  randomInt,
  shuffleArray,
  makeUniqueDistractors,
  generateOneStepEquation,
  generateTwoStepEquation,
  generateBracketEquation,
  generateFractionEquation,
  generateMoneyWordProblem,
  generateAgeWordProblem,
  generatePerimeterWordProblem,
  generateConsecutiveIntegerProblem,
} from '../utils/equationMath.js';

// Export DISTRICTS mapped from WORLDS for backward compatibility with PlayPhase
export const DISTRICTS = WORLDS.map((w) => ({
  id: w.id,
  name: w.name,
  icon: w.emoji,
  boss: w.boss,
}));

/**
 * World 0: The Mystery Letter (translate-expressions)
 */
function generateTranslateQuestion(id, districtId) {
  const templates = [
    {
      phrase: (n) => `A number increased by ${n}`,
      correct: (n) => `x + ${n}`,
      distractors: (n) => [`${n}x`, `x - ${n}`, `${n} - x`],
      hint1: "Look at the phrase 'increased by' — what operation does that mean?",
      hint2: (n) => `Addition! So 'a number x increased by ${n}' is x + ${n}.`,
      exp: (n) => `'Increased by' indicates addition. Letting the unknown be x, the expression is x + ${n}.`,
      visual: 'phrase-to-expression',
      tag: 'TRANSLATE PHRASE',
    },
    {
      phrase: (n) => `A number decreased by ${n}`,
      correct: (n) => `x - ${n}`,
      distractors: (n) => [`${n} - x`, `x + ${n}`, `${n}x`],
      hint1: "What does 'decreased by' mean?",
      hint2: (n) => `Subtraction starting from the number x: x - ${n}.`,
      exp: (n) => `'Decreased by' means subtracting ${n} from x, giving x - ${n}. Notice that ${n} - x would mean ${n} decreased by x.`,
      visual: 'phrase-to-expression',
      tag: 'TRANSLATE PHRASE',
    },
    {
      phrase: (n) => `${n} times a mystery number`,
      correct: (n) => `${n}x`,
      distractors: (n) => [`x + ${n}`, `x/${n}`, `${n} + x`],
      hint1: "When we multiply a variable by a number, how do we write it?",
      hint2: (n) => `We write the coefficient directly in front of the letter: ${n}x.`,
      exp: (n) => `In algebra, multiplication between a number and a variable is written without a times sign: ${n}x.`,
      visual: 'phrase-to-expression',
      tag: 'TRANSLATE PHRASE',
    },
    {
      phrase: (n, m) => `${n} more than twice a number`,
      correct: (n) => `2x + ${n}`,
      distractors: (n) => [`2(x + ${n})`, `x + ${n}`, `2x - ${n}`],
      hint1: "First translate 'twice a number', then add the extra amount.",
      hint2: (n) => `'Twice a number' is 2x. Adding ${n} gives 2x + ${n}.`,
      exp: (n) => `'Twice a number' is 2x. '${n} more than' means adding ${n}, giving 2x + ${n}.`,
      visual: 'phrase-to-expression',
      tag: 'TWO-PART EXPRESSION',
    },
    {
      phrase: (n, m) => `The product of ${n} and the sum of a number and ${m}`,
      correct: (n, m) => `${n}(x + ${m})`,
      distractors: (n, m) => [`${n}x + ${m}`, `x + ${n * m}`, `${n} + (x + ${m})`],
      hint1: "Notice 'the sum of a number and ...' comes as a single grouped quantity!",
      hint2: (n, m) => `The entire sum (x + ${m}) is multiplied by ${n}, so use brackets: ${n}(x + ${m}).`,
      exp: (n, m) => `Because the product applies to the whole sum, brackets are required: ${n}(x + ${m}).`,
      visual: 'bracket-highlight',
      tag: 'BRACKET EXPRESSION',
    },
    {
      phrase: (n) => `A number divided by ${n}`,
      correct: (n) => `x/${n}`,
      distractors: (n) => [`${n}/x`, `${n}x`, `x - ${n}`],
      hint1: "How do we write division in algebra?",
      hint2: (n) => `As a fraction: x over ${n}, written x/${n}.`,
      exp: (n) => `In Secondary algebra, division is written as a fraction: x/${n}.`,
      visual: 'fraction-bar',
      tag: 'FRACTION EXPRESSION',
    },
  ];

  const tmpl = templates[randomInt(0, templates.length - 1)];
  const n = randomInt(2, 9);
  const m = randomInt(1, 7);

  const questionText = `Translate the worded clue into an algebraic expression:\n"${tmpl.phrase(n, m)}"`;
  const correctAnswer = tmpl.correct(n, m);
  const dist = tmpl.distractors(n, m);
  const options = shuffleArray([correctAnswer, ...dist]);

  return {
    id,
    districtId,
    category: tmpl.tag,
    visual: tmpl.visual,
    questionText,
    options,
    correctAnswer,
    explanation: tmpl.exp(n, m),
    hint1: tmpl.hint1,
    hint2: typeof tmpl.hint2 === 'function' ? tmpl.hint2(n, m) : tmpl.hint2,
    visualData: { phrase: tmpl.phrase(n, m), expression: correctAnswer, n, m },
  };
}

/**
 * World 1: The Balance Case (one-step-equations)
 */
function generateOneStepQuestion(id, districtId) {
  const eq = generateOneStepEquation();
  const correctAnswer = `x = ${eq.solution}`;
  const options = shuffleArray([correctAnswer, ...eq.distractors.map((d) => `x = ${d}`)]);

  return {
    id,
    districtId,
    category: 'ONE-STEP EQUATION',
    visual: 'balance-diagram',
    questionText: `Solve the linear equation using the balance method:\n${eq.equationStr}`,
    options,
    correctAnswer,
    explanation: `To isolate x in ${eq.equationStr}, apply the inverse operation to BOTH sides of the equation. This yields ${correctAnswer}. Substitution check: satisfies the equation!`,
    hint1: "Identify the operation attached to x and do the exact opposite to both sides.",
    hint2: `Whatever you do to the left side, do to the right side to keep the scale balanced.`,
    visualData: eq.visualData,
  };
}

/**
 * World 2: The Two-Step Trail (two-step-equations)
 */
function generateTwoStepQuestion(id, districtId) {
  const eq = generateTwoStepEquation();
  const correctAnswer = `x = ${eq.solution}`;
  const options = shuffleArray([correctAnswer, ...eq.distractors.map((d) => `x = ${d}`)]);

  return {
    id,
    districtId,
    category: 'TWO-STEP EQUATION',
    visual: 'balance-diagram',
    questionText: `Solve the two-step equation:\n${eq.equationStr}`,
    options,
    correctAnswer,
    explanation: `Step 1: Balance the constant term across the equals sign. Step 2: Divide both sides by the coefficient of x. Solution: ${correctAnswer}.`,
    hint1: "First isolate the term with x by adding or subtracting the constant term from both sides.",
    hint2: `After balancing the constant, divide both sides by the coefficient of x.`,
    visualData: eq.visualData,
  };
}

/**
 * World 3: The Bracket Vault (bracket-equations)
 */
function generateBracketQuestion(id, districtId) {
  const eq = generateBracketEquation();
  const correctAnswer = `x = ${eq.solution}`;
  const options = shuffleArray([correctAnswer, ...eq.distractors.map((d) => `x = ${d}`)]);

  return {
    id,
    districtId,
    category: 'BRACKET EQUATION',
    visual: 'bracket-highlight',
    questionText: `Crack the bracket vault! Solve for x:\n${eq.equationStr}`,
    options,
    correctAnswer,
    explanation: `First expand the bracket by multiplying every term inside by the outer coefficient: ${eq.visualData.distributedForm}. Then balance both sides to find ${correctAnswer}.`,
    hint1: "Expand the bracket first! Remember to multiply the number outside by BOTH terms inside.",
    hint2: `In ${eq.equationStr}, expand to get ${eq.visualData.distributedForm}, then solve as a two-step equation.`,
    visualData: eq.visualData,
  };
}

/**
 * World 4: The Fraction Files (fraction-equations)
 */
function generateFractionQuestion(id, districtId) {
  const eq = generateFractionEquation();
  const correctAnswer = `x = ${eq.solution}`;
  const options = shuffleArray([correctAnswer, ...eq.distractors.map((d) => `x = ${d}`)]);

  return {
    id,
    districtId,
    category: 'FRACTION EQUATION',
    visual: 'fraction-bar',
    questionText: `Clear the fraction and solve for x:\n${eq.equationStr}`,
    options,
    correctAnswer,
    explanation: `First isolate the fraction term or multiply the entire equation by the denominator (${eq.visualData.a}). This clears the fraction to give ${eq.visualData.clearedForm}, solving to ${correctAnswer}.`,
    hint1: "Isolate the fraction term first, or multiply every term on both sides by the denominator.",
    hint2: `Multiply both sides by ${eq.visualData.a} to clear the denominator.`,
    visualData: eq.visualData,
  };
}

/**
 * World 5: Coins & Clues (money-word-problems)
 */
function generateMoneyQuestion(id, districtId) {
  const p = generateMoneyWordProblem();
  const correctAnswer = p.formattedSolution;
  const options = shuffleArray(p.formattedOptions);

  return {
    id,
    districtId,
    category: 'MONEY WORD PROBLEM',
    visual: 'word-problem-diagram',
    questionText: `${p.scenarioText}`,
    options,
    correctAnswer,
    explanation: `Let the cost of one item be $x. Form the equation: ${p.equationStr}. Subtract the extra cost, then divide by ${p.visualData.count} to get ${correctAnswer}.`,
    hint1: "Let x represent the cost of one item. How would you write the total cost of all items plus the extra?",
    hint2: `The equation is ${p.equationStr}. Solve for x using the balance method.`,
    visualData: p.visualData,
  };
}

/**
 * World 6: Ages & Alibis (age-word-problems)
 */
function generateAgeQuestion(id, districtId) {
  const p = generateAgeWordProblem();
  const correctAnswer = p.formattedSolution;
  const options = shuffleArray(p.formattedOptions);

  return {
    id,
    districtId,
    category: 'AGE WORD PROBLEM',
    visual: 'word-problem-diagram',
    questionText: `${p.scenarioText}`,
    options,
    correctAnswer,
    explanation: `Let ${p.visualData.youngerName}'s age be x. The older person's age is expressed in terms of x. Summing them: ${p.equationStr}. Solving yields x = ${p.solution}. Therefore, ${p.visualData.youngerName} is ${correctAnswer}.`,
    hint1: `Always let x be the younger person's age first. How do you write the older person's age in terms of x?`,
    hint2: `Add both expressions together to equal the sum of their ages (${p.visualData.sum}), then solve for x.`,
    visualData: p.visualData,
  };
}

/**
 * World 7: Perimeter Puzzle (geometry-consecutive-word-problems)
 */
function generateGeometryQuestion(id, districtId) {
  const isConsecutive = Math.random() > 0.5;
  if (isConsecutive) {
    const p = generateConsecutiveIntegerProblem();
    const correctAnswer = p.formattedSolution;
    const options = shuffleArray(p.formattedOptions);
    return {
      id,
      districtId,
      category: 'CONSECUTIVE INTEGERS',
      visual: 'word-problem-diagram',
      questionText: `${p.scenarioText}`,
      options,
      correctAnswer,
      explanation: `Let the consecutive numbers be x, x + 1, and x + 2. Their sum is ${p.equationStr}. Simplifying gives 3x + 3 = ${p.visualData.sum} => 3x = ${p.visualData.sum - 3} => x = ${correctAnswer}.`,
      hint1: "Consecutive integers go up by 1 each time: x, x + 1, and x + 2.",
      hint2: `Add them together: 3x + 3 = ${p.visualData.sum}. Solve for x.`,
      visualData: p.visualData,
    };
  }

  const p = generatePerimeterWordProblem();
  const correctAnswer = p.formattedSolution;
  const options = shuffleArray(p.formattedOptions);
  return {
    id,
    districtId,
    category: 'PERIMETER EQUATION',
    visual: 'word-problem-diagram',
    questionText: `${p.scenarioText}`,
    options,
    correctAnswer,
    explanation: `Perimeter of a rectangle = 2(length + width). Setting up: ${p.equationStr}. Expanding: 4x + ${2 * p.visualData.diff} = ${p.visualData.perimeter}. Solving gives width x = ${correctAnswer}.`,
    hint1: "Remember the perimeter formula: Perimeter = 2 × (length + width).",
    hint2: `Substitute length = (x + ${p.visualData.diff}) and width = x into 2(length + width) = ${p.visualData.perimeter}.`,
    visualData: p.visualData,
  };
}

/**
 * World 8: Detective's Verdict (multi-step-applied-word-problems)
 */
function generateMultiStepQuestion(id, districtId) {
  // Multi-step problem: combination of brackets or two-step applied word problems
  const type = randomInt(1, 3);
  if (type === 1) {
    // Multi-step money with bracket
    const count = pickCleanCoefficient([2, 3, 4]);
    const discount = randomInt(1, 4);
    const itemCost = randomInt(5, 14);
    const total = count * (itemCost - discount);
    const correctAnswer = `$${itemCost}`;
    const rawDist = [itemCost + discount, itemCost - discount, itemCost + 2 * discount];
    const distractors = makeUniqueDistractors(itemCost, rawDist).map((v) => `$${v}`);
    const options = shuffleArray([correctAnswer, ...distractors]);

    return {
      id,
      districtId,
      category: 'APPLIED WORD PROBLEM',
      visual: 'word-problem-diagram',
      questionText: `Detective Deepa bought ${count} evidence kits that were each discounted by $${discount}. The total paid was $${total}. What was the original price of one evidence kit?`,
      options,
      correctAnswer,
      explanation: `Let the original price be $x. Each kit costs (x - ${discount}). Form equation: ${count}(x - ${discount}) = ${total}. Divide by ${count}: x - ${discount} = ${total / count}. Adding ${discount}: x = ${correctAnswer}.`,
      hint1: "Let original price be x. The discounted price for each kit is (x - discount).",
      hint2: `Set up ${count}(x - ${discount}) = ${total} and solve for x.`,
      visualData: { type: 'money', count, discount, total },
    };
  }

  // Type 2: Combined items with ratio/multiplier
  const mult = pickCleanCoefficient([2, 3]);
  const extra = randomInt(3, 8);
  const weiJieAmount = randomInt(8, 20);
  const deepaAmount = mult * weiJieAmount + extra;
  const total = weiJieAmount + deepaAmount;
  const correctAnswer = `$${weiJieAmount}`;
  const rawDist = [deepaAmount, Math.round(total / 2), weiJieAmount + extra];
  const distractors = makeUniqueDistractors(weiJieAmount, rawDist).map((v) => `$${v}`);
  const options = shuffleArray([correctAnswer, ...distractors]);

  return {
    id,
    districtId,
    category: 'APPLIED WORD PROBLEM',
    visual: 'word-problem-diagram',
    questionText: `Wei Jie has $x. Deepa has $${extra} more than ${mult === 2 ? 'twice' : 'three times'} Wei Jie's amount. Together they have $${total}. How much money does Wei Jie have?`,
    options,
    correctAnswer,
    explanation: `Wei Jie has x, Deepa has ${mult}x + ${extra}. Total equation: x + (${mult}x + ${extra}) = ${total} => ${mult + 1}x + ${extra} = ${total}. Subtract ${extra}: ${mult + 1}x = ${total - extra}. Divide by ${mult + 1}: x = ${correctAnswer}.`,
    hint1: "Write Deepa's amount in terms of x first, then add them together to equal the total.",
    hint2: `Equation: x + (${mult}x + ${extra}) = ${total}. Combine like terms to get ${mult + 1}x + ${extra} = ${total}.`,
    visualData: { type: 'money', weiJieAmount, deepaAmount, total, mult, extra },
  };
}

/**
 * World 9: The Grand Case File (mixed-review)
 */
function generateMixedQuestion(id, districtId) {
  const generatorFns = [
    generateTranslateQuestion,
    generateOneStepQuestion,
    generateTwoStepQuestion,
    generateBracketQuestion,
    generateFractionQuestion,
    generateMoneyQuestion,
    generateAgeQuestion,
    generateGeometryQuestion,
    generateMultiStepQuestion,
  ];
  const fn = generatorFns[randomInt(0, generatorFns.length - 1)];
  const q = fn(id, districtId);
  q.category = `GRAND FINALE · ${q.category}`;
  return q;
}

/**
 * Procedurally generates the full 100-question bank (10 worlds × 10 questions)
 */
export function generateQuestionBank() {
  const bank = [];
  let currentId = 1;

  for (let w = 0; w < 10; w++) {
    for (let q = 0; q < 10; q++) {
      let questionObj;
      switch (w) {
        case 0:
          questionObj = generateTranslateQuestion(currentId, w);
          break;
        case 1:
          questionObj = generateOneStepQuestion(currentId, w);
          break;
        case 2:
          questionObj = generateTwoStepQuestion(currentId, w);
          break;
        case 3:
          questionObj = generateBracketQuestion(currentId, w);
          break;
        case 4:
          questionObj = generateFractionQuestion(currentId, w);
          break;
        case 5:
          questionObj = generateMoneyQuestion(currentId, w);
          break;
        case 6:
          questionObj = generateAgeQuestion(currentId, w);
          break;
        case 7:
          questionObj = generateGeometryQuestion(currentId, w);
          break;
        case 8:
          questionObj = generateMultiStepQuestion(currentId, w);
          break;
        case 9:
        default:
          questionObj = generateMixedQuestion(currentId, w);
          break;
      }
      bank.push(questionObj);
      currentId++;
    }
  }

  return bank;
}

// Generate the canonical session question bank
export const questionBank = generateQuestionBank();
export default questionBank;
