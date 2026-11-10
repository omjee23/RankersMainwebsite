const { collections } = require('../config/db');
const { QUESTION_STATUS } = require('../config/constants');
const { successResponse, errorResponse } = require('../utils/apiResponse');

/**
 * Get available tests filtered by category, stream, batchTier, and subject
 */
async function getAvailableExams(req, res, next) {
  try {
    const studentStream = req.query.stream || (req.user && req.user.targetStream) || 'ALL';
    const category = req.query.category || 'ALL';
    const batchTier = req.query.batchTier || (req.user && req.user.batchTier) || 'ALL';
    const subject = req.query.subject || 'ALL';

    const allExams = collections.exams.find({ active: true });

    const studentId = req.user ? req.user.id : null;
    let studentSubmissions = [];
    if (studentId) {
      studentSubmissions = collections.examSubmissions.find({ studentId });
    }

    const filtered = allExams.filter(exam => {
      // 1. Category Filter: RSAT, RANKEX, or STUDENT_TEST_SERIES
      if (category !== 'ALL' && exam.category) {
        if (exam.category.toUpperCase() !== category.toUpperCase()) return false;
      }

      // 2. Stream Filter: NEET, JEE, ALL
      if (studentStream !== 'ALL' && exam.stream && exam.stream !== 'ALL') {
        if (exam.stream.toUpperCase() !== studentStream.toUpperCase()) return false;
      }

      // 3. Batch Tier Filter: DIAMOND, PLATINUM, SILVER, GREEN, ALL
      if (batchTier !== 'ALL' && exam.batchTier && exam.batchTier !== 'ALL') {
        if (exam.batchTier.toUpperCase() !== batchTier.toUpperCase()) return false;
      }

      // 4. Subject Filter: FULL_MOCK, PHYSICS, CHEMISTRY, MATHEMATICS, BIOLOGY
      if (subject !== 'ALL' && exam.subject && exam.subject !== 'ALL') {
        if (exam.subject.toUpperCase() !== subject.toUpperCase()) return false;
      }

      // 5. Director Approval & Publication Filter
      if (exam.category === 'STUDENT_TEST_SERIES') {
        if (exam.isPublishedToStudents === false) return false;
        if (exam.directorApproval && exam.directorApproval.status !== 'APPROVED') return false;
      }

      return true;
    }).map(exam => {
      // Check if student has taken or started this test
      const submission = studentSubmissions.find(s => s.testId === exam.id || (s.examType === exam.examType && s.status === 'SUBMITTED'));
      const examLiveResult = exam.resultPublishedToStudents !== false;
      const isPublished = submission
        ? (examLiveResult && (submission.isPublished !== undefined ? submission.isPublished : (submission.category === 'RSAT' || exam.category === 'RSAT')))
        : false;

      return {
        ...exam,
        submissionStatus: submission ? submission.status : 'NOT_STARTED',
        submissionId: submission ? submission.id : null,
        scoreObtained: isPublished && submission ? submission.score : null,
        percentageObtained: isPublished && submission ? submission.percentage : null,
        isPublished: isPublished,
        resultUnderReview: Boolean(submission && !isPublished)
      };
    });

    return successResponse(res, 'Available tests retrieved', filtered);
  } catch (err) {
    next(err);
  }
}

/**
 * Get student's previous submissions history
 */
async function getMySubmissions(req, res, next) {
  try {
    const studentId = req.user.id;
    const submissions = collections.examSubmissions.find({ studentId });
    return successResponse(res, 'Student exam history', submissions);
  } catch (err) {
    next(err);
  }
}

/**
 * Start or resume an online exam session
 */
async function startExam(req, res, next) {
  try {
    const studentId = req.user.id;
    const { testId = 'test-neet-mock-01', examType } = req.body;

    // 1. Locate test definition
    let testDef = collections.exams.findById(testId);
    if (!testDef && examType) {
      testDef = collections.exams.findOne({ examType });
    }
    if (!testDef) {
      testDef = collections.exams.findOne() || {
        id: 'test-default',
        title: 'Rankers Path All-India CBT Mock Exam',
        examType: 'NEET',
        stream: 'NEET',
        durationMinutes: 180,
        totalMarks: 720,
        subjects: ['Physics', 'Chemistry', 'Botany', 'Zoology']
      };
    }

    // 2. Fetch questions belonging to this test or matching examType
    let testQuestions = collections.questions.find({ testId: testDef.id });
    if (testQuestions.length === 0) {
      testQuestions = collections.questions.find({ examType: testDef.examType });
    }
    if (testQuestions.length === 0) {
      testQuestions = collections.questions.find();
    }

    // 3. Check for existing active submission
    let activeSubmission = collections.examSubmissions.findOne({
      studentId,
      testId: testDef.id,
      status: 'IN_PROGRESS'
    });

    const durationMinutes = testDef.durationMinutes || 180;

    if (!activeSubmission) {
      const now = new Date();
      const serverDeadline = new Date(now.getTime() + durationMinutes * 60 * 1000).toISOString();

      activeSubmission = collections.examSubmissions.create({
        studentId,
        studentName: req.user.fullName,
        mobile: req.user.mobile,
        testId: testDef.id,
        category: testDef.category || 'STUDENT_TEST_SERIES',
        stream: testDef.stream || 'ALL',
        subject: testDef.subject || 'FULL_MOCK',
        batchTier: testDef.batchTier || 'ALL',
        examType: testDef.examType,
        examTitle: testDef.title,
        durationMinutes,
        startedAt: now.toISOString(),
        serverDeadline,
        status: 'IN_PROGRESS',
        tabSwitchCount: 0,
        isPublished: testDef.category === 'RSAT',
        answers: {}, // questionId -> { selectedOption, selectedOptions, numericAnswer, status }
        score: 0
      });
    }

    // 4. SANITIZE questions: Strip answers and explanations
    const sanitizedQuestions = testQuestions.map((q, idx) => ({
      id: q.id,
      questionNumber: idx + 1,
      subject: q.subject || 'General',
      section: q.section || 'Section A',
      questionType: q.questionType || (q.options ? 'MCQ' : 'NUMERICAL'),
      questionText: q.questionText,
      options: q.options || [],
      classLevel: q.classLevel || 'Class 12'
    }));

    return successResponse(res, 'Exam session ready', {
      submissionId: activeSubmission.id,
      testId: testDef.id,
      testInfo: {
        id: testDef.id,
        title: testDef.title,
        examType: testDef.examType,
        stream: testDef.stream,
        durationMinutes: testDef.durationMinutes,
        totalMarks: testDef.totalMarks,
        subjects: testDef.subjects || ['Physics', 'Chemistry', 'Mathematics'],
        sectionsConfig: testDef.sectionsConfig || {}
      },
      startedAt: activeSubmission.startedAt,
      serverDeadline: activeSubmission.serverDeadline,
      durationMinutes: activeSubmission.durationMinutes,
      savedAnswers: activeSubmission.answers || {},
      tabSwitchCount: activeSubmission.tabSwitchCount || 0,
      totalQuestions: sanitizedQuestions.length,
      questions: sanitizedQuestions
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Save / Update Single Answer in real time
 */
async function saveAnswer(req, res, next) {
  try {
    const {
      submissionId,
      questionId,
      selectedOption,
      selectedOptions,
      numericAnswer,
      status,
      timeSpentSeconds
    } = req.body;

    const submission = collections.examSubmissions.findById(submissionId);
    if (!submission) {
      return errorResponse(res, 'Exam session not found', 404);
    }

    if (submission.status !== 'IN_PROGRESS') {
      return errorResponse(res, 'Exam has already been submitted', 400);
    }

    const currentAnswers = submission.answers || {};
    currentAnswers[questionId] = {
      selectedOption: selectedOption !== undefined ? selectedOption : null,
      selectedOptions: Array.isArray(selectedOptions) ? selectedOptions : [],
      numericAnswer: numericAnswer !== undefined && numericAnswer !== null ? String(numericAnswer).trim() : null,
      status: status || QUESTION_STATUS.ANSWERED,
      timeSpentSeconds: timeSpentSeconds || 0,
      updatedAt: new Date().toISOString()
    };

    collections.examSubmissions.findByIdAndUpdate(submission.id, {
      answers: currentAnswers
    });

    return successResponse(res, 'Answer synced');
  } catch (err) {
    next(err);
  }
}

/**
 * Report Tab Switch / Window Blur Violation
 */
async function reportViolation(req, res, next) {
  try {
    const { submissionId } = req.body;
    const submission = collections.examSubmissions.findById(submissionId);

    if (!submission || submission.status !== 'IN_PROGRESS') {
      return errorResponse(res, 'Invalid exam session', 400);
    }

    const newCount = (submission.tabSwitchCount || 0) + 1;
    let autoSubmitted = false;

    if (newCount >= 3) {
      autoSubmitted = true;
      return submitExam(req, res, next);
    }

    collections.examSubmissions.findByIdAndUpdate(submission.id, {
      tabSwitchCount: newCount
    });

    return successResponse(res, `Violation recorded (${newCount}/3 warnings).`, {
      tabSwitchCount: newCount,
      autoSubmitted
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Submit Exam & Grade according to exact Exam Pattern rules
 */
async function submitExam(req, res, next) {
  try {
    const { submissionId } = req.body;
    const submission = collections.examSubmissions.findById(submissionId);

    if (!submission) {
      return errorResponse(res, 'Exam session not found', 404);
    }

    if (submission.status === 'SUBMITTED') {
      return successResponse(res, 'Exam was already submitted', submission);
    }

    const testDef = collections.exams.findById(submission.testId) || {
      examType: submission.examType || 'NEET',
      totalMarks: 720
    };

    let allQuestions = collections.questions.find({ testId: submission.testId });
    if (allQuestions.length === 0) {
      allQuestions = collections.questions.find({ examType: testDef.examType });
    }
    if (allQuestions.length === 0) {
      allQuestions = collections.questions.find();
    }

    const answers = submission.answers || {};
    const pattern = testDef.examType || 'NEET';

    let correctCount = 0;
    let incorrectCount = 0;
    let unattemptedCount = 0;
    let totalScore = 0;
    let totalNegativeMarks = 0;

    const subjectBreakdown = {};

    // Group questions by subject and section for Section B capping
    const grouped = {};
    allQuestions.forEach(q => {
      const subj = q.subject || 'General';
      const sec = q.section || 'Section A';
      if (!grouped[subj]) grouped[subj] = {};
      if (!grouped[subj][sec]) grouped[subj][sec] = [];
      grouped[subj][sec].push(q);

      if (!subjectBreakdown[subj]) {
        subjectBreakdown[subj] = {
          total: 0,
          attempted: 0,
          correct: 0,
          incorrect: 0,
          unattempted: 0,
          marks: 0,
          negativePenalty: 0
        };
      }
      subjectBreakdown[subj].total += 1;
    });

    // Evaluate per question respecting Section B attempt cap
    for (const [subj, sections] of Object.entries(grouped)) {
      for (const [secName, qList] of Object.entries(sections)) {
        // Check if there is an attempt limit for this section
        let maxAllowedAttempts = qList.length;
        if (secName === 'Section B') {
          if (pattern === 'JEE_MAIN') maxAllowedAttempts = 5;
          if (pattern === 'NEET') maxAllowedAttempts = 10;
        }

        // Filter attempted questions in order
        let attemptedInThisSec = 0;

        for (const q of qList) {
          const ans = answers[q.id];
          const hasAttempted = ans && (
            ans.selectedOption !== null && ans.selectedOption !== undefined ||
            (Array.isArray(ans.selectedOptions) && ans.selectedOptions.length > 0) ||
            (ans.numericAnswer !== null && ans.numericAnswer !== undefined && ans.numericAnswer !== '')
          );

          if (!hasAttempted) {
            unattemptedCount += 1;
            subjectBreakdown[subj].unattempted += 1;
            continue;
          }

          // If Section B attempt cap reached, ignore extra attempts beyond limit
          if (secName === 'Section B' && attemptedInThisSec >= maxAllowedAttempts) {
            unattemptedCount += 1;
            subjectBreakdown[subj].unattempted += 1;
            continue;
          }

          attemptedInThisSec += 1;
          subjectBreakdown[subj].attempted += 1;

          // EVALUATION BY QUESTION TYPE
          let isCorrect = false;
          let isPartial = false;
          let earnedMarks = 0;
          let penaltyMarks = 0;

          if (q.questionType === 'NUMERICAL' || q.questionType === 'NAT' || q.questionType === 'NAT_RANGE') {
            // Numerical answer check (supports exact NAT & Range NAT)
            const rawStudentAns = (ans.numericAnswer !== null && ans.numericAnswer !== undefined && ans.numericAnswer !== '')
              ? ans.numericAnswer
              : ans.selectedOption;
            const studentNum = parseFloat(rawStudentAns);

            let matched = false;
            if (!isNaN(studentNum)) {
              const hasMin = q.rangeMin !== undefined && q.rangeMin !== null && q.rangeMin !== '';
              const hasMax = q.rangeMax !== undefined && q.rangeMax !== null && q.rangeMax !== '';

              if (hasMin && hasMax) {
                // Range-Based Numerical: Student answer must fall inside [rangeMin, rangeMax]
                const rMin = parseFloat(q.rangeMin);
                const rMax = parseFloat(q.rangeMax);
                const lower = Math.min(rMin, rMax);
                const upper = Math.max(rMin, rMax);
                matched = (studentNum >= lower - 0.0001) && (studentNum <= upper + 0.0001);
              } else if (q.tolerance !== undefined && q.tolerance !== null && q.tolerance !== '') {
                // Target value with explicit tolerance
                const cVal = parseFloat(q.correctAnswer || q.correctValue);
                const tol = parseFloat(q.tolerance) || 0.05;
                if (!isNaN(cVal)) {
                  matched = Math.abs(studentNum - cVal) <= (tol + 0.0001);
                }
              } else {
                // Exact numerical value match (with standard 0.05 float rounding margin)
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
              penaltyMarks = (pattern === 'JEE_ADVANCED') ? 0 : 1; // Standard NTA JEE Main penalty is -1
            }
          } else if (q.questionType === 'MULTI_CORRECT') {
            // JEE Advanced Multi-Correct with Partial Marking
            const studentArr = Array.isArray(ans.selectedOptions) ? ans.selectedOptions.map(Number).sort() : [];
            const correctArr = Array.isArray(q.correctAnswer) ? q.correctAnswer.map(Number).sort() : [];

            // Check if any wrong option chosen
            const wrongChosen = studentArr.some(opt => !correctArr.includes(opt));
            if (wrongChosen) {
              // Penalty -2
              isCorrect = false;
              penaltyMarks = 2;
            } else if (studentArr.length === correctArr.length && studentArr.every((val, i) => val === correctArr[i])) {
              // Full marks +4
              isCorrect = true;
              earnedMarks = 4;
            } else if (studentArr.length > 0) {
              // Partial marks: +1 for each correct option chosen (if not all chosen)
              isPartial = true;
              earnedMarks = Math.min(studentArr.length, 3);
            }
          } else {
            // Standard Single Choice MCQ (+4, -1 or +3, -1)
            const correctOpt = Number(q.correctAnswer !== undefined ? q.correctAnswer : q.correctOption);
            if (Number(ans.selectedOption) === correctOpt) {
              isCorrect = true;
              earnedMarks = (pattern === 'JEE_ADVANCED') ? 3 : 4;
            } else {
              isCorrect = false;
              penaltyMarks = 1;
            }
          }

          // Apply marks
          if (isCorrect || isPartial) {
            correctCount += 1;
            totalScore += earnedMarks;
            subjectBreakdown[subj].correct += 1;
            subjectBreakdown[subj].marks += earnedMarks;
          } else {
            incorrectCount += 1;
            totalScore -= penaltyMarks;
            totalNegativeMarks += penaltyMarks;
            subjectBreakdown[subj].incorrect += 1;
            subjectBreakdown[subj].marks -= penaltyMarks;
            subjectBreakdown[subj].negativePenalty += penaltyMarks;
          }
        }
      }
    }

    const maxMarks = testDef.totalMarks || (allQuestions.length * 4);
    // Score should not fall below 0 in percentage
    const percentage = maxMarks > 0 ? Math.max(0, Math.round((Math.max(0, totalScore) / maxMarks) * 100)) : 0;

    // Realistic Percentile calculation based on percentage
    const percentile = Math.min(99.9, Math.max(25.0, Number((percentage * 0.95 + 4.5).toFixed(2))));

    // Simulated Batch / All-India Rank
    const simulatedTotalCandidates = 1450;
    const allIndiaRank = Math.max(1, Math.round(simulatedTotalCandidates * (1 - percentile / 100)));

    // Scholarship Slab
    let scholarshipPercent = 10;
    if (percentage >= 85) scholarshipPercent = 100;
    else if (percentage >= 70) scholarshipPercent = 75;
    else if (percentage >= 50) scholarshipPercent = 50;
    else if (percentage >= 35) scholarshipPercent = 25;

    const isRsat = (testDef.category === 'RSAT' || submission.category === 'RSAT');
    const updated = collections.examSubmissions.findByIdAndUpdate(submission.id, {
      status: 'SUBMITTED',
      submittedAt: new Date().toISOString(),
      category: testDef.category || submission.category || 'STUDENT_TEST_SERIES',
      stream: testDef.stream || submission.stream || 'ALL',
      subject: testDef.subject || submission.subject || 'FULL_MOCK',
      batchTier: testDef.batchTier || submission.batchTier || 'ALL',
      isPublished: submission.isPublished !== undefined ? submission.isPublished : isRsat,
      score: totalScore,
      maxMarks,
      percentage,
      percentile,
      allIndiaRank,
      correctCount,
      incorrectCount,
      unattemptedCount,
      totalNegativeMarks,
      scholarshipPercent,
      subjectBreakdown
    });

    if (isRsat) {
      const rsatReg = collections.rsatRegistrations.findOne({ studentId: submission.studentId }) ||
                      collections.rsatRegistrations.findOne({ mobile: submission.mobile });
      if (rsatReg) {
        collections.rsatRegistrations.findByIdAndUpdate(rsatReg.id, {
          funnelStatus: '4_EXAM_COMPLETED',
          status: 'EXAM_COMPLETED',
          examScore: totalScore,
          maxMarks,
          percentage,
          scholarshipPercent,
          submittedAt: new Date().toISOString()
        });
      }
    }

    return successResponse(res, 'Exam submitted and evaluated successfully!', updated);
  } catch (err) {
    next(err);
  }
}

/**
 * Get Submission Result and Detailed Analysis with Solutions
 */
async function getSubmissionResult(req, res, next) {
  try {
    const { id } = req.params;
    const submission = collections.examSubmissions.findById(id);

    if (!submission) {
      return errorResponse(res, 'Submission not found', 404);
    }

    if (submission.category === 'STUDENT_TEST_SERIES' && submission.isPublished === false && req.user && req.user.role === 'student') {
      return successResponse(res, 'Exam submitted successfully! Results will be live shortly.', {
        submission: {
          id: submission.id,
          studentName: submission.studentName,
          rollNumber: submission.rollNumber,
          examTitle: submission.examTitle,
          status: 'EVALUATED_PENDING_LIVE_ANNOUNCEMENT',
          resultAnnounced: false,
          submittedAt: submission.submittedAt,
          notice: 'Exam submitted successfully! The Academic Director and Faculty are currently reviewing scores. Official All-India Ranks and solutions will be live on your portal shortly.'
        },
        solutions: []
      });
    }

    let allQuestions = collections.questions.find({ testId: submission.testId });
    if (allQuestions.length === 0) {
      allQuestions = collections.questions.find({ examType: submission.examType });
    }
    if (allQuestions.length === 0) {
      allQuestions = collections.questions.find();
    }

    const solutions = allQuestions.map((q, idx) => ({
      id: q.id,
      questionNumber: idx + 1,
      subject: q.subject,
      section: q.section,
      questionType: q.questionType,
      questionText: q.questionText,
      options: q.options || [],
      correctOption: q.correctOption,
      correctAnswer: q.correctAnswer,
      rangeMin: q.rangeMin,
      rangeMax: q.rangeMax,
      tolerance: q.tolerance,
      explanation: q.explanation,
      studentResponse: submission.answers && submission.answers[q.id] ? submission.answers[q.id] : null
    }));

    return successResponse(res, 'Detailed exam result retrieved', {
      submission,
      solutions
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAvailableExams,
  getMySubmissions,
  startExam,
  saveAnswer,
  reportViolation,
  submitExam,
  getSubmissionResult
};
