const assert = require('assert');
const { collections } = require('../config/db');
const {
  createExamTest,
  sendExamToDirector,
  approveExamTestByDirector,
  togglePublishExamResults,
  getExamParticipationReport,
  exportDirectorExamSheet
} = require('../controllers/adminController');

console.log('--- Testing Director Workflow, Pattern Builder & Participation Ledger ---');

function mockRes() {
  const res = {
    statusCode: 200,
    headers: {},
    data: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.data = payload;
      return this;
    },
    setHeader(k, v) {
      this.headers[k] = v;
    },
    send(body) {
      this.data = body;
      return this;
    }
  };
  return res;
}

async function runTests() {
  // Test 1: Create JEE Advanced Test Paper
  const req1 = {
    body: {
      title: 'JEE (Advanced) 2026 Test Series Mock 02',
      patternType: 'JEE_ADVANCED',
      category: 'STUDENT_TEST_SERIES',
      stream: 'JEE',
      batchTier: 'DIAMOND',
      targetBatch: 'Super 30 Diamond IIT',
      durationMinutes: 180,
      totalMarks: 180,
      description: 'Full syllabus JEE Advanced mock with 4 sections'
    }
  };
  const res1 = mockRes();
  await createExamTest(req1, res1, console.error);

  assert.strictEqual(res1.statusCode, 201, 'Test 1 Failed: Status should be 201');
  const createdTest = res1.data.data;
  assert.strictEqual(createdTest.patternType, 'JEE_ADVANCED', 'Test 1 Failed: Pattern should be JEE_ADVANCED');
  assert.strictEqual(createdTest.directorApproval.status, 'PENDING', 'Test 1 Failed: Should be PENDING director approval');
  assert.ok(createdTest.sectionsConfig['Section 1'], 'Test 1 Failed: Should have Section 1');
  assert.ok(createdTest.sectionsConfig['Section 2'], 'Test 1 Failed: Should have Section 2');
  assert.ok(createdTest.sectionsConfig['Section 3'], 'Test 1 Failed: Should have Section 3');
  assert.ok(createdTest.sectionsConfig['Section 4'], 'Test 1 Failed: Should have Section 4');
  console.log('✅ Test 1 Passed: JEE Advanced 4-Section paper created with PENDING Director status');

  // Test 2: Send Exam to Director (WhatsApp & Email generation)
  const req2 = {
    params: { id: createdTest.id },
    body: { directorMobile: '9826012345', directorEmail: 'director@rankerspath.in', note: 'Please review Q.14 matrix match' }
  };
  const res2 = mockRes();
  await sendExamToDirector(req2, res2, console.error);

  assert.strictEqual(res2.statusCode, 200, 'Test 2 Failed: Status should be 200');
  const shareData = res2.data.data;
  assert.ok(shareData.whatsappUrl.includes('https://wa.me/919826012345?text='), 'Test 2 Failed: Valid WhatsApp URL');
  assert.ok(shareData.mailtoUrl.includes('mailto:director@rankerspath.in'), 'Test 2 Failed: Valid mailto URL');
  assert.ok(shareData.textMessage.includes('JEE_ADVANCED'), 'Test 2 Failed: Text contains exam pattern');
  console.log('✅ Test 2 Passed: Director WhatsApp & Email dispatch links generated');

  // Test 3: Approve Exam Test by Director
  const req3 = {
    params: { id: createdTest.id },
    body: { approvedBy: 'Dr. S.K. Verma (Academic Director)', feedback: 'Approved. Perfect JEE Advanced standard.', publishToStudents: true }
  };
  const res3 = mockRes();
  await approveExamTestByDirector(req3, res3, console.error);

  assert.strictEqual(res3.statusCode, 200, 'Test 3 Failed: Status should be 200');
  const approvedTest = res3.data.data;
  assert.strictEqual(approvedTest.directorApproval.status, 'APPROVED', 'Test 3 Failed: Status should be APPROVED');
  assert.strictEqual(approvedTest.isPublishedToStudents, true, 'Test 3 Failed: isPublishedToStudents should be true');
  console.log('✅ Test 3 Passed: Director approval authorized and test published to students');

  // Test 4: Toggle Live Result Announcement
  const req4 = {
    params: { id: createdTest.id },
    body: { live: true }
  };
  const res4 = mockRes();
  await togglePublishExamResults(req4, res4, console.error);

  assert.strictEqual(res4.statusCode, 200, 'Test 4 Failed: Status should be 200');
  assert.strictEqual(res4.data.data.resultPublishedToStudents, true, 'Test 4 Failed: Results marked LIVE');
  console.log('✅ Test 4 Passed: Live result announcement toggled on');

  // Test 5: Participation Report
  const req5 = {
    params: { id: createdTest.id }
  };
  const res5 = mockRes();
  await getExamParticipationReport(req5, res5, console.error);

  assert.strictEqual(res5.statusCode, 200, 'Test 5 Failed: Status should be 200');
  const participation = res5.data.data;
  assert.ok(participation.stats, 'Test 5 Failed: Stats object must exist');
  assert.ok(Array.isArray(participation.attemptedStudents), 'Test 5 Failed: attemptedStudents array');
  assert.ok(Array.isArray(participation.absentStudents), 'Test 5 Failed: absentStudents array');
  console.log('✅ Test 5 Passed: Student participation ledger calculated (Attempted vs Absent)');

  // Test 6: Export Director Exam Sheet (CSV)
  const req6 = {
    params: { id: createdTest.id }
  };
  const res6 = mockRes();
  await exportDirectorExamSheet(req6, res6, console.error);

  assert.strictEqual(res6.statusCode, 200, 'Test 6 Failed: Status should be 200');
  assert.ok(res6.headers['Content-Type'].includes('text/csv'), 'Test 6 Failed: Must be text/csv');
  assert.ok(res6.data.includes('Rank,Roll_Number,Student_Name'), 'Test 6 Failed: CSV must have header row');
  console.log('✅ Test 6 Passed: Director Excel/CSV merit sheet exported with full column headers');

  // Clean up test created
  collections.exams.deleteById(createdTest.id);

  console.log('\n🎉 ALL DIRECTOR WORKFLOW & EXAM BUILDER TESTS PASSED 100%!');
}

runTests().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
