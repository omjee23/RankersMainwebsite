// Test Range-Based Numerical Answer Type (Range NAT) evaluation engine
const assert = require('assert');

function evaluateQuestion(q, ans, pattern = 'JEE_MAIN') {
  let isCorrect = false;
  let earnedMarks = 0;
  let penaltyMarks = 0;

  if (q.questionType === 'NUMERICAL' || q.questionType === 'NAT' || q.questionType === 'NAT_RANGE') {
    const rawStudentAns = (ans.numericAnswer !== null && ans.numericAnswer !== undefined && ans.numericAnswer !== '')
      ? ans.numericAnswer
      : ans.selectedOption;
    const studentNum = parseFloat(rawStudentAns);

    let matched = false;
    if (!isNaN(studentNum)) {
      const hasMin = q.rangeMin !== undefined && q.rangeMin !== null && q.rangeMin !== '';
      const hasMax = q.rangeMax !== undefined && q.rangeMax !== null && q.rangeMax !== '';

      if (hasMin && hasMax) {
        const rMin = parseFloat(q.rangeMin);
        const rMax = parseFloat(q.rangeMax);
        const lower = Math.min(rMin, rMax);
        const upper = Math.max(rMin, rMax);
        matched = (studentNum >= lower - 0.0001) && (studentNum <= upper + 0.0001);
      } else if (q.tolerance !== undefined && q.tolerance !== null && q.tolerance !== '') {
        const cVal = parseFloat(q.correctAnswer || q.correctValue);
        const tol = parseFloat(q.tolerance) || 0.05;
        if (!isNaN(cVal)) {
          matched = Math.abs(studentNum - cVal) <= (tol + 0.0001);
        }
      } else {
        const correctNum = parseFloat(q.correctAnswer || q.correctValue);
        if (!isNaN(correctNum)) {
          matched = Math.abs(studentNum - correctNum) < 0.05;
        }
      }
    }

    if (matched) {
      isCorrect = true;
      earnedMarks = (pattern === 'JEE_ADVANCED') ? 3 : 4;
    } else {
      isCorrect = false;
      penaltyMarks = (pattern === 'JEE_ADVANCED') ? 0 : 1;
    }
  }

  return { isCorrect, earnedMarks, penaltyMarks };
}

// Test Suite
console.log('--- Running Range NAT Evaluation Tests ---');

const rangeQ = {
  questionType: 'NAT_RANGE',
  rangeMin: 12.4,
  rangeMax: 12.6,
  correctAnswer: '12.5'
};

// Test 1: Mid-range value (12.5) -> Correct +4
const res1 = evaluateQuestion(rangeQ, { numericAnswer: '12.5' });
assert.strictEqual(res1.isCorrect, true);
assert.strictEqual(res1.earnedMarks, 4);
assert.strictEqual(res1.penaltyMarks, 0);
console.log('✅ Test 1 Passed: Mid-range value (12.5) awarded +4 marks');

// Test 2: Lower boundary (12.40) -> Correct +4
const res2 = evaluateQuestion(rangeQ, { numericAnswer: '12.40' });
assert.strictEqual(res2.isCorrect, true);
assert.strictEqual(res2.earnedMarks, 4);
console.log('✅ Test 2 Passed: Lower boundary value (12.40) awarded +4 marks');

// Test 3: Upper boundary (12.60) -> Correct +4
const res3 = evaluateQuestion(rangeQ, { numericAnswer: '12.60' });
assert.strictEqual(res3.isCorrect, true);
assert.strictEqual(res3.earnedMarks, 4);
console.log('✅ Test 3 Passed: Upper boundary value (12.60) awarded +4 marks');

// Test 4: Intermediate decimal (12.456) -> Correct +4
const res4 = evaluateQuestion(rangeQ, { numericAnswer: '12.456' });
assert.strictEqual(res4.isCorrect, true);
assert.strictEqual(res4.earnedMarks, 4);
console.log('✅ Test 4 Passed: Decimal (12.456) awarded +4 marks');

// Test 5: Out of range above (12.65) -> Incorrect -1
const res5 = evaluateQuestion(rangeQ, { numericAnswer: '12.65' });
assert.strictEqual(res5.isCorrect, false);
assert.strictEqual(res5.earnedMarks, 0);
assert.strictEqual(res5.penaltyMarks, 1);
console.log('✅ Test 5 Passed: Out of range (12.65) penalized with -1 mark');

// Test 6: Out of range below (12.39) -> Incorrect -1
const res6 = evaluateQuestion(rangeQ, { numericAnswer: '12.39' });
assert.strictEqual(res6.isCorrect, false);
assert.strictEqual(res6.earnedMarks, 0);
assert.strictEqual(res6.penaltyMarks, 1);
console.log('✅ Test 6 Passed: Out of range (12.39) penalized with -1 mark');

// Test 7: Exact NAT question (value 25)
const exactQ = {
  questionType: 'NUMERICAL',
  correctAnswer: '25'
};
const res7 = evaluateQuestion(exactQ, { numericAnswer: '25' });
assert.strictEqual(res7.isCorrect, true);
assert.strictEqual(res7.earnedMarks, 4);
console.log('✅ Test 7 Passed: Exact NAT (25) awarded +4 marks');

console.log('🎉 ALL RANGE NAT EVALUATION TESTS PASSED PERFECTLY!');
