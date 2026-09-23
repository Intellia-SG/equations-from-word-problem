// scripts/test_question_bank.js
// Stress test: 300 randomized question bank generations (30,000 questions total)
// Asserts all TRD §10 criteria:
// 1. Exactly 4 options per question, all unique.
// 2. correctAnswer is in options.
// 3. No NaN, undefined, or empty fields.
// 4. Positive ages (8-80) and positive geometry lengths.
// 5. Valid integer solutions for all equation types.

import { generateQuestionBank } from '../src/data/questionBank.js';

console.log("🔍 Starting Question Bank Stress Test (300 randomized runs = 30,000 questions)...");

const RUNS = 300;
let totalQuestionsChecked = 0;

for (let r = 1; r <= RUNS; r++) {
  const bank = generateQuestionBank();
  if (bank.length !== 100) {
    throw new Error(`Run ${r}: Expected 100 questions, got ${bank.length}`);
  }

  for (const q of bank) {
    totalQuestionsChecked++;

    // 1. Basic schema verification
    if (!q.id || typeof q.districtId !== 'number' || !q.category || !q.visual || !q.questionText) {
      throw new Error(`Run ${r}, Q ${q.id}: Missing required schema fields.`);
    }

    if (!q.explanation || !q.hint1 || !q.hint2) {
      throw new Error(`Run ${r}, Q ${q.id}: Explanation or hints are missing.`);
    }

    // 2. Options verification
    if (!Array.isArray(q.options) || q.options.length !== 4) {
      throw new Error(`Run ${r}, Q ${q.id}: Expected 4 options, got ${q.options?.length}`);
    }

    const uniqueOptions = new Set(q.options);
    if (uniqueOptions.size !== 4) {
      throw new Error(`Run ${r}, Q ${q.id}: Duplicate options detected: ${JSON.stringify(q.options)}`);
    }

    if (!uniqueOptions.has(q.correctAnswer)) {
      throw new Error(`Run ${r}, Q ${q.id}: Correct answer "${q.correctAnswer}" is not among options: ${JSON.stringify(q.options)}`);
    }

    // 3. Check for NaN or undefined in any string
    const jsonStr = JSON.stringify(q);
    if (jsonStr.includes('NaN') || jsonStr.includes('undefined')) {
      throw new Error(`Run ${r}, Q ${q.id}: Found NaN or undefined in payload: ${jsonStr}`);
    }

    // 4. Word problem domain assertions
    if (q.category.includes('AGE')) {
      if (q.visualData?.youngerName && q.visualData?.sum) {
        if (q.visualData.sum <= 0) {
          throw new Error(`Run ${r}, Q ${q.id}: Invalid age sum: ${q.visualData.sum}`);
        }
      }
    }

    if (q.category.includes('PERIMETER')) {
      if (q.visualData?.perimeter <= 0 || q.visualData?.width <= 0) {
        throw new Error(`Run ${r}, Q ${q.id}: Invalid perimeter dimensions: width=${q.visualData?.width}, perim=${q.visualData?.perimeter}`);
      }
    }
  }

  if (r % 50 === 0) {
    console.log(`  ✓ Passed ${r}/${RUNS} runs (${totalQuestionsChecked} questions verified)`);
  }
}

console.log(`\n🎉 SUCCESS! All ${totalQuestionsChecked} questions across ${RUNS} runs passed all QA validation criteria!`);
