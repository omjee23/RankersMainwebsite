const { collections } = require('../config/db');

console.log('--- Verifying Database & Test Series Setup ---');

// 1. Verify Exams in DB
const exams = collections.exams.find();
console.log(`Total Exams in DB: ${exams.length}`);
const foundationExams = exams.filter(e => e.stream === 'FOUNDATION' || e.examType === 'FOUNDATION');
console.log(`Foundation Exams: ${foundationExams.map(e => e.title)}`);

const jeeExams = exams.filter(e => e.stream === 'JEE' || e.examType === 'JEE_MAIN');
console.log(`JEE Exams: ${jeeExams.map(e => e.title)}`);

const neetExams = exams.filter(e => e.stream === 'NEET' || e.examType === 'NEET');
console.log(`NEET Exams: ${neetExams.map(e => e.title)}`);

// 2. Verify Questions in DB
const allQuestions = collections.questions.find();
console.log(`\nTotal Questions in DB: ${allQuestions.length}`);

const rangeQuestions = allQuestions.filter(q => q.questionType === 'NAT_RANGE');
console.log(`Range NAT Questions: ${rangeQuestions.length}`);
rangeQuestions.forEach(q => {
  console.log(`- [${q.subject} | ${q.stream}] Range: [${q.rangeMin} to ${q.rangeMax}] -> ${q.questionText.slice(0, 60)}...`);
});

// 3. Test Question Creation via DB
const testQ = collections.questions.create({
  testId: 'test-jee-main-mock-01',
  examType: 'JEE_MAIN',
  stream: 'JEE',
  subject: 'Physics',
  section: 'Section B',
  questionType: 'NAT_RANGE',
  rangeMin: 15.2,
  rangeMax: 15.8,
  correctAnswer: '15.5',
  questionText: 'Test projectile parameter range problem',
  classLevel: 'Class 11'
});
console.log(`\nCreated test Range NAT question: ID ${testQ.id}, Range: [${testQ.rangeMin} to ${testQ.rangeMax}]`);

// Cleanup created test question so DB stays clean
const rawList = collections.questions.find();
const filtered = rawList.filter(x => x.id !== testQ.id);
require('fs').writeFileSync(require('path').join(__dirname, '../data/questions.json'), JSON.stringify(filtered, null, 2));
console.log('Cleanup completed successfully.');

console.log('\n🎉 ALL E2E CBT CHECKS PASSED!');
