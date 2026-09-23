// src/utils/equationMath.js
// Core mathematical engine for EquationQuest (Grade 7 / Secondary 1 Mathematics)
// Generates clean equations and word problems strictly adhering to TRD §4.4 constraints.

const CURATED_COEFFICIENTS = [2, 3, 4, 5, 6, 7, 8, 9, 10, 12];
const FRACTION_DENOMINATORS = [2, 3, 4, 5];

/**
 * Pick a clean coefficient from curated pool
 */
export function pickCleanCoefficient(customPool = CURATED_COEFFICIENTS) {
  return customPool[Math.floor(Math.random() * customPool.length)];
}

/**
 * Pick a random integer in [min, max] inclusive
 */
export function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Shuffles an array immutably
 */
export function shuffleArray(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Evaluates an expression object or simple string at a given x value
 */
export function evaluateExpression(expr, xVal) {
  if (typeof expr === 'number') return expr;
  if (typeof expr === 'function') return expr(xVal);
  if (typeof expr === 'object' && expr !== null) {
    if (expr.type === 'ax+b') return expr.a * xVal + expr.b;
    if (expr.type === 'a(x+b)') return expr.a * (xVal + expr.b);
    if (expr.type === 'x/a+b') return xVal / expr.a + expr.b;
    if (expr.type === 'ax-b') return expr.a * xVal - expr.b;
  }
  // Safe evaluation for basic linear algebra expressions like "3*x + 4"
  try {
    const sanitized = String(expr).replace(/x/g, `(${xVal})`);
    // eslint-disable-next-line no-new-func
    return Function(`"use strict"; return (${sanitized})`)();
  } catch {
    return NaN;
  }
}

/**
 * Verifies if candidate satisfies the equation
 */
export function verifySolution(equation, candidate) {
  const cand = Number(candidate);
  if (isNaN(cand)) return false;
  return Number(equation.solution) === cand;
}

/**
 * Generates One-Step Equation:
 * Types:
 * 1: x + a = b  (sol: b - a)
 * 2: x - a = b  (sol: b + a)
 * 3: ax = b     (sol: b / a)
 * 4: x / a = b  (sol: a * b)
 */
export function generateOneStepEquation() {
  const type = randomInt(1, 4);
  let equationStr = '';
  let solution = 0;
  let distractorMisconceptions = [];
  let spokenForm = '';
  let visualData = {};

  if (type === 1) {
    // x + a = b
    const sol = randomInt(3, 20);
    const a = randomInt(2, 18);
    const b = sol + a;
    solution = sol;
    equationStr = `x + ${a} = ${b}`;
    spokenForm = `x plus ${a} equals ${b}`;
    // Misconceptions:
    // 1. Sign error: adding instead of subtracting (b + a)
    // 2. Off-by-one or swapped
    // 3. Multiplication slip
    distractorMisconceptions = [b + a, Math.max(1, sol - 1), sol + 2];
    visualData = { form: 'x+a=b', lhs: `x + ${a}`, rhs: `${b}`, leftPan: ['x', a], rightPan: [b], op: 'subtract', val: a };
  } else if (type === 2) {
    // x - a = b
    const sol = randomInt(6, 25);
    const a = randomInt(2, sol - 1);
    const b = sol - a;
    solution = sol;
    equationStr = `x - ${a} = ${b}`;
    spokenForm = `x minus ${a} equals ${b}`;
    // Misconceptions:
    // 1. Sign error: subtracting instead of adding (b - a)
    // 2. Swapped
    distractorMisconceptions = [Math.abs(b - a) || (sol + 3), sol + 1, Math.max(1, sol - 2)];
    visualData = { form: 'x-a=b', lhs: `x - ${a}`, rhs: `${b}`, leftPan: ['x', -a], rightPan: [b], op: 'add', val: a };
  } else if (type === 3) {
    // ax = b
    const a = pickCleanCoefficient([2, 3, 4, 5, 6, 7, 8, 9]);
    const sol = randomInt(2, 12);
    const b = a * sol;
    solution = sol;
    equationStr = `${a}x = ${b}`;
    spokenForm = `${a} ex equals ${b}`;
    // Misconceptions:
    // 1. Multiplied instead of divided (b * a) -> cap if huge
    // 2. Subtracted instead of divided (b - a)
    // 3. Off by one
    const multDistractor = a * b <= 120 ? a * b : sol * 2;
    distractorMisconceptions = [b - a, multDistractor, sol + 1];
    visualData = { form: 'ax=b', lhs: `${a}x`, rhs: `${b}`, leftPan: Array(a).fill('x'), rightPan: [b], op: 'divide', val: a };
  } else {
    // x / a = b
    const a = pickCleanCoefficient([2, 3, 4, 5]);
    const b = randomInt(3, 10);
    solution = a * b;
    equationStr = `x/${a} = ${b}`;
    spokenForm = `x over ${a} equals ${b}`;
    // Misconceptions:
    // 1. Divided instead of multiplied: Math.round(b / a) or b + a
    // 2. Added: b + a
    // 3. Off by denominator
    distractorMisconceptions = [b + a, Math.max(1, Math.floor(solution / 2)), solution + a];
    visualData = { form: 'x/a=b', lhs: `x/${a}`, rhs: `${b}`, denominator: a, numerator: 'x', target: b, op: 'multiply', val: a };
  }

  // Ensure unique distractors
  const distractors = makeUniqueDistractors(solution, distractorMisconceptions);

  return {
    equationStr,
    solution,
    distractors,
    spokenForm,
    visualData,
    type: 'one-step',
  };
}

/**
 * Generates Two-Step Equation: ax + b = c or ax - b = c
 * Constrained so that solution is an integer.
 */
export function generateTwoStepEquation() {
  const isMinus = Math.random() > 0.5;
  const a = pickCleanCoefficient([2, 3, 4, 5, 6, 7]);
  const sol = randomInt(2, 12);
  const b = randomInt(1, 15);
  const c = isMinus ? a * sol - b : a * sol + b;
  const solution = sol;

  const equationStr = isMinus ? `${a}x - ${b} = ${c}` : `${a}x + ${b} = ${c}`;
  const spokenForm = isMinus
    ? `${a} ex minus ${b} equals ${c}`
    : `${a} ex plus ${b} equals ${c}`;

  // Misconceptions:
  // 1. Sign error when moving b: (c - b)/a when minus, or (c + b)/a when plus
  // 2. Divided before subtracting: (c / a) - b (round/reject ugly decimals, use integer substitute)
  // 3. Forgetting to divide by a: c - b or c + b
  const wrongSignNumerator = isMinus ? c - b : c + b;
  const wrongSignSol = Math.round(wrongSignNumerator / a);
  const forgotDivide = Math.abs(isMinus ? c + b : c - b);

  const rawDistractors = [
    wrongSignSol !== solution ? wrongSignSol : solution + 3,
    forgotDivide <= 60 && forgotDivide !== solution ? forgotDivide : solution * a,
    solution + 1,
  ];

  const distractors = makeUniqueDistractors(solution, rawDistractors);

  return {
    equationStr,
    solution,
    distractors,
    spokenForm,
    visualData: {
      form: isMinus ? 'ax-b=c' : 'ax+b=c',
      a,
      b,
      c,
      isMinus,
      lhs: isMinus ? `${a}x - ${b}` : `${a}x + ${b}`,
      rhs: `${c}`,
      leftPan: [`${a}x`, isMinus ? -b : b],
      rightPan: [c],
    },
    type: 'two-step',
  };
}

/**
 * Generates Bracket Equation: a(x + b) = c or a(x - b) = c
 * Constrained so solution is integer.
 */
export function generateBracketEquation() {
  const isMinus = Math.random() > 0.4;
  const a = pickCleanCoefficient([2, 3, 4, 5]);
  const sol = randomInt(2, 10);
  const b = randomInt(1, 8);
  const inner = isMinus ? sol - b : sol + b;
  // Ensure inner > 0 for standard middle school problems
  const safeB = isMinus && b >= sol ? sol - 1 : b;
  const safeInner = isMinus ? sol - safeB : sol + safeB;
  const c = a * safeInner;
  const solution = sol;

  const equationStr = isMinus ? `${a}(x - ${safeB}) = ${c}` : `${a}(x + ${safeB}) = ${c}`;
  const spokenForm = isMinus
    ? `${a} times the quantity x minus ${safeB} equals ${c}`
    : `${a} times the quantity x plus ${safeB} equals ${c}`;

  // Research-backed misconception:
  // Incomplete distribution! Under-distributing the bracket:
  // treating a(x + b) = c as ax + b = c (forgot to multiply b by a)
  // => x = (c - b) / a
  const underDistributedNumerator = isMinus ? c + safeB : c - safeB;
  const underDistributedSol = Math.round(underDistributedNumerator / a);

  // Another misconception: Divided c by a but inverted sign
  const signErrorSol = isMinus ? Math.round(c / a) - safeB : Math.round(c / a) + safeB;

  const rawDistractors = [
    underDistributedSol !== solution ? underDistributedSol : solution + 4,
    signErrorSol !== solution && signErrorSol > 0 ? signErrorSol : solution + 2,
    Math.max(1, solution - 1),
  ];

  const distractors = makeUniqueDistractors(solution, rawDistractors);

  return {
    equationStr,
    solution,
    distractors,
    spokenForm,
    visualData: {
      form: 'bracket',
      a,
      b: safeB,
      c,
      isMinus,
      distributedForm: isMinus ? `${a}x - ${a * safeB} = ${c}` : `${a}x + ${a * safeB} = ${c}`,
      lhs: isMinus ? `${a}(x - ${safeB})` : `${a}(x + ${safeB})`,
      rhs: `${c}`,
    },
    type: 'bracket',
  };
}

/**
 * Generates Fraction Equation: x/a + b = c or x/a - b = c
 * Denominator a ∈ {2, 3, 4, 5}, final solution is integer.
 */
export function generateFractionEquation() {
  const isMinus = Math.random() > 0.5;
  const a = pickCleanCoefficient(FRACTION_DENOMINATORS);
  const sol = randomInt(2, 10) * a; // ensures x is clean multiple of a
  const b = randomInt(1, 8);
  const c = isMinus ? sol / a - b : sol / a + b;
  const solution = sol;

  const equationStr = isMinus ? `x/${a} - ${b} = ${c}` : `x/${a} + ${b} = ${c}`;
  const spokenForm = isMinus
    ? `x over ${a} minus ${b} equals ${c}`
    : `x over ${a} plus ${b} equals ${c}`;

  // Misconceptions:
  // 1. Multiplied before adding/subtracting: multiplying only c by a without multiplying b
  //    => x + b = c * a => x = c*a - b
  const multFirstSol = isMinus ? c * a + b : c * a - b;

  // 2. Operating on only one side or sign error
  const wrongSignSol = isMinus ? (c - b) * a : (c + b) * a;

  const rawDistractors = [
    multFirstSol > 0 && multFirstSol !== solution ? multFirstSol : solution + a,
    wrongSignSol > 0 && wrongSignSol !== solution ? wrongSignSol : solution - a,
    Math.max(1, solution + 2 * a),
  ];

  const distractors = makeUniqueDistractors(solution, rawDistractors);

  return {
    equationStr,
    solution,
    distractors,
    spokenForm,
    visualData: {
      form: 'fraction',
      a,
      b,
      c,
      isMinus,
      lhs: isMinus ? `x/${a} - ${b}` : `x/${a} + ${b}`,
      rhs: `${c}`,
      clearedForm: isMinus ? `x - ${a * b} = ${a * c}` : `x + ${a * b} = ${a * c}`,
    },
    type: 'fraction',
  };
}

/**
 * Generates Money Word Problem
 * Clean dollars or exact 5/10/25/50 cent steps.
 */
export function generateMoneyWordProblem() {
  const items = [
    { name: 'detective notebooks', singular: 'detective notebook' },
    { name: 'magnifying glasses', singular: 'magnifying glass' },
    { name: 'clue files', singular: 'clue file' },
    { name: 'evidence folders', singular: 'evidence folder' },
    { name: 'fingerprint ink pads', singular: 'fingerprint ink pad' },
  ];
  const item = items[Math.floor(Math.random() * items.length)];
  const count = pickCleanCoefficient([2, 3, 4, 5]);
  const costPerItem = randomInt(4, 15); // $4 - $15
  const extraCost = randomInt(2, 9); // extra bookmark or badge
  const total = count * costPerItem + extraCost;
  const solution = costPerItem;

  const scenarioText = `Detective Wei Jie bought ${count} identical ${item.name} and a $${extraCost} badge. The total cost came to $${total}. How much did one ${item.singular} cost?`;
  const equationStr = `${count}x + ${extraCost} = ${total}`;
  const spokenForm = `${count} ex plus ${extraCost} equals ${total}`;

  // Distractors:
  // 1. Forgot extra cost: total / count (rounded)
  const forgotExtra = Math.round(total / count);
  // 2. Added extra instead of subtracting: (total + extraCost) / count
  const addedExtra = Math.round((total + extraCost) / count);
  // 3. Off by one
  const offByOne = solution + 1;

  const rawDistractors = [
    forgotExtra !== solution ? forgotExtra : solution + 3,
    addedExtra !== solution ? addedExtra : solution + 4,
    offByOne,
  ];

  const distractors = makeUniqueDistractors(solution, rawDistractors);

  return {
    scenarioText,
    equationStr,
    solution,
    distractors,
    formattedSolution: `$${solution}`,
    formattedOptions: [solution, ...distractors].map((v) => `$${v}`),
    spokenForm,
    visualData: {
      type: 'money',
      item: item.singular,
      count,
      extraCost,
      total,
      lhs: `${count}x + $${extraCost}`,
      rhs: `$${total}`,
    },
    type: 'money-problem',
  };
}

/**
 * Generates Age Word Problem
 * Ages strictly kept in 8–80 human range, positive years.
 */
export function generateAgeWordProblem() {
  const names = [
    { older: 'Uncle Tan', younger: 'Wei Jie', rel: 'older than' },
    { older: 'Detective Inspector Lee', younger: 'Deepa', rel: 'older than' },
    { older: 'Auntie Mei', younger: 'Priya', rel: 'older than' },
  ];
  const pair = names[Math.floor(Math.random() * names.length)];
  const multiplier = pickCleanCoefficient([2, 3]);
  const diff = randomInt(2, 6);
  // Let younger be x (e.g. 10 to 18)
  const youngerAge = randomInt(11, 16);
  const olderAge = multiplier * youngerAge + diff;
  const sum = youngerAge + olderAge; // x + (multiplier * x + diff) = (multiplier + 1)x + diff = sum
  const solution = youngerAge;

  const scenarioText = `${pair.older} is ${diff} years older than ${multiplier === 2 ? 'twice' : 'three times'} ${pair.younger}'s age. The sum of their ages is ${sum} years. How old is ${pair.younger}?`;
  const equationStr = `x + (${multiplier}x + ${diff}) = ${sum}`;

  // Distractors:
  // 1. Solving for the OLDER person instead of the younger (classic problem trap!)
  const olderSolution = olderAge;
  // 2. Misconception forgetting x: (sum - diff) / multiplier
  const forgotX = Math.round((sum - diff) / multiplier);
  // 3. Off by one
  const offByOne = solution + 2;

  const rawDistractors = [
    olderSolution !== solution ? olderSolution : solution + 5,
    forgotX !== solution ? forgotX : solution + 3,
    offByOne,
  ];

  const distractors = makeUniqueDistractors(solution, rawDistractors);

  return {
    scenarioText,
    equationStr,
    solution,
    distractors,
    formattedSolution: `${solution} years old`,
    formattedOptions: [solution, ...distractors].map((v) => `${v} years old`),
    spokenForm: `sum of ages is ${sum}`,
    visualData: {
      type: 'age',
      youngerName: pair.younger,
      olderName: pair.older,
      sum,
      diff,
      multiplier,
    },
    type: 'age-problem',
  };
}

/**
 * Generates Perimeter Word Problem
 * Positive integer side lengths (1–100 cm range).
 */
export function generatePerimeterWordProblem() {
  // Rectangle length = x + diff, width = x
  // Perimeter = 2(length + width) = 2(2x + diff) = 4x + 2*diff
  const diff = randomInt(2, 9);
  const x = randomInt(4, 15); // width
  const length = x + diff;
  const perimeter = 2 * (length + x);
  const solution = x;

  const scenarioText = `The perimeter of a rectangular crime scene cordon is ${perimeter} cm. Its length is ${diff} cm longer than its width. If the width is x cm, find the width.`;
  const equationStr = `2(x + x + ${diff}) = ${perimeter}`;

  // Distractors:
  // 1. Answering LENGTH instead of WIDTH (length = x + diff)
  const lengthTrap = length;
  // 2. Forgetting to multiply by 2 (semi-perimeter): perimeter - diff
  const forgotFactor2 = Math.round((perimeter / 2 - diff) / 2);
  // 3. Off by 2
  const offByTwo = solution + 3;

  const rawDistractors = [
    lengthTrap !== solution ? lengthTrap : solution + diff,
    forgotFactor2 > 0 && forgotFactor2 !== solution ? forgotFactor2 : solution + 1,
    offByTwo,
  ];

  const distractors = makeUniqueDistractors(solution, rawDistractors);

  return {
    scenarioText,
    equationStr,
    solution,
    distractors,
    formattedSolution: `${solution} cm`,
    formattedOptions: [solution, ...distractors].map((v) => `${v} cm`),
    spokenForm: `perimeter is ${perimeter} centimetres`,
    visualData: {
      type: 'perimeter',
      width: x,
      length,
      diff,
      perimeter,
    },
    type: 'perimeter-problem',
  };
}

/**
 * Generates Consecutive Integer Problem
 * Consecutive integers: x, x + 1, x + 2
 * Sum = 3x + 3
 */
export function generateConsecutiveIntegerProblem() {
  const x = randomInt(5, 25);
  const sum = x + (x + 1) + (x + 2);
  const solution = x;

  const scenarioText = `Three consecutive clue locker numbers add up to ${sum}. If the first locker number is x, find x.`;
  const equationStr = `x + (x + 1) + (x + 2) = ${sum}`;

  // Distractors:
  // 1. Answering the MIDDLE number (x + 1)
  // 2. Answering the LARGEST number (x + 2)
  // 3. Sum divided by 3 (average)
  const rawDistractors = [x + 1, x + 2, Math.round(sum / 3)];
  const distractors = makeUniqueDistractors(solution, rawDistractors);

  return {
    scenarioText,
    equationStr,
    solution,
    distractors,
    formattedSolution: `${solution}`,
    formattedOptions: [solution, ...distractors].map(String),
    spokenForm: `three consecutive locker numbers add up to ${sum}`,
    visualData: {
      type: 'consecutive',
      x,
      sum,
    },
    type: 'consecutive-problem',
  };
}

export function makeUniqueDistractors(solution, rawPool) {
  const seen = new Set([solution]);
  const result = [];

  for (const item of rawPool) {
    const val = Number(item);
    if (!isNaN(val) && val > 0 && !seen.has(val)) {
      seen.add(val);
      result.push(val);
    }
  }

  // If we still need more distractors to make exactly 3
  let offset = 1;
  while (result.length < 3) {
    const candidateA = solution + offset;
    const candidateB = Math.max(1, solution - offset);
    if (!seen.has(candidateA)) {
      seen.add(candidateA);
      result.push(candidateA);
    }
    if (result.length < 3 && !seen.has(candidateB) && candidateB > 0) {
      seen.add(candidateB);
      result.push(candidateB);
    }
    offset++;
  }

  return result.slice(0, 3);
}

/**
 * Format equation object to clean string
 */
export function formatEquationString(eq) {
  if (!eq) return '';
  if (typeof eq === 'string') return eq;
  return eq.equationStr || '';
}

export default {
  pickCleanCoefficient,
  randomInt,
  shuffleArray,
  evaluateExpression,
  verifySolution,
  generateOneStepEquation,
  generateTwoStepEquation,
  generateBracketEquation,
  generateFractionEquation,
  generateMoneyWordProblem,
  generateAgeWordProblem,
  generatePerimeterWordProblem,
  generateConsecutiveIntegerProblem,
  formatEquationString,
};
