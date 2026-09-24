const { collections } = require('../config/db');
const { MARKING_SCHEME, QUESTION_STATUS } = require('../config/constants');
const { successResponse, errorResponse } = require('../utils/apiResponse');

// Helper to seed sample questions if question bank is empty
function seedSampleQuestionsIfEmpty() {
  if (collections.questions.countDocuments() === 0) {
    const samples = [
      // Physics (NEET / JEE)
      {
        subject: 'Physics',
        topic: 'Mechanics',
        questionText: 'A particle moves in a straight line with a constant acceleration of 2 m/s². If its initial velocity is 10 m/s, what is the distance travelled in the 5th second?',
        options: ['19 m', '20 m', '25 m', '29 m'],
        correctOption: 0, // 19 m (S_nth = u + a/2 * (2n - 1) = 10 + 1 * 9 = 19m)
        explanation: 'Distance in nth second is given by: Sn = u + a/2(2n - 1). Here u = 10, a = 2, n = 5. S5 = 10 + (2/2)*(2*5 - 1) = 10 + 9 = 19 m.',
        classLevel: 'Class 11',
        stream: 'NEET'
      },
      {
        subject: 'Physics',
        topic: 'Electrostatics',
        questionText: 'Two point charges +q and -q are held fixed at (-d, 0) and (d, 0) respectively of an (x, y) coordinate system. Then:',
        options: [
          'The electric field E at all points on the x-axis is along the x-axis',
          'The electric field E at all points on the y-axis is along the y-axis',
          'The electric potential V at all points on the y-axis is zero',
          'The electric dipole moment vector points along the positive x-axis'
        ],
        correctOption: 2,
        explanation: 'On the perpendicular bisector (y-axis) of an electric dipole, the electric potential is identically zero everywhere.',
        classLevel: 'Class 12',
        stream: 'NEET'
      },
      // Chemistry
      {
        subject: 'Chemistry',
        topic: 'Chemical Bonding',
        questionText: 'Which of the following molecules has a linear shape according to VSEPR theory?',
        options: ['SO₂', 'CO₂', 'H₂O', 'O₃'],
        correctOption: 1,
        explanation: 'CO2 has 2 bond pairs and 0 lone pairs around carbon, giving it sp hybridization and a linear bond angle of 180°.',
        classLevel: 'Class 11',
        stream: 'NEET'
      },
      {
        subject: 'Chemistry',
        topic: 'Organic Chemistry',
        questionText: 'The conversion of an alkyl halide to an alkene using alcoholic KOH is an example of:',
        options: ['Substitution reaction', 'Electrophilic addition', 'β-Elimination reaction (dehydrohalogenation)', 'Rearrangement reaction'],
        correctOption: 2,
        explanation: 'Alcoholic KOH acts as a strong base inducing E2/β-elimination of HX to yield an alkene.',
        classLevel: 'Class 12',
        stream: 'NEET'
      },
      // Biology (Botany/Zoology)
      {
        subject: 'Biology',
        topic: 'Cell Biology',
        questionText: 'Which cell organelle is known as the "Powerhouse of the Cell" and is the primary site of ATP synthesis?',
        options: ['Golgi apparatus', 'Mitochondria', 'Endoplasmic reticulum', 'Lysosome'],
        correctOption: 1,
        explanation: 'Mitochondria are the double-membrane-bound organelles where aerobic respiration and ATP generation occur.',
        classLevel: 'Class 11',
        stream: 'NEET'
      },
      {
        subject: 'Biology',
        topic: 'Genetics',
        questionText: 'In a typical Mendelian monohybrid cross between homozygous tall (TT) and dwarf (tt) pea plants, the phenotypic ratio in the F2 generation is:',
        options: ['1 : 2 : 1', '3 : 1', '9 : 3 : 3 : 1', '2 : 1'],
        correctOption: 1,
        explanation: 'The phenotypic ratio is 3 Tall : 1 Dwarf. (Genotypic ratio is 1 TT : 2 Tt : 1 tt).',
        classLevel: 'Class 12',
        stream: 'NEET'
      }
    ];

    samples.forEach(q => collections.questions.create(q));
    console.log('✅ Seeded sample NEET/JEE questions for testing.');
  }
}

/**
 * Start or resume an online exam
 */
async function startExam(req, res, next) {
  try {
    seedSampleQuestionsIfEmpty();

    const studentId = req.user.id;
    const { examType = 'RSAT_ONLINE', examTitle = 'Rankers Path Scholarship Admission Test (RSAT)' } = req.body;

    // Check if already in-progress
    let activeSubmission = collections.examSubmissions.findOne({
      studentId,
      status: 'IN_PROGRESS'
    });

    // Fetch questions
    const allQuestions = collections.questions.find();

    if (allQuestions.length === 0) {
      return errorResponse(res, 'No questions currently available for this exam.', 404);
    }

    const durationMinutes = 45;

    if (!activeSubmission) {
      const now = new Date();
      const serverDeadline = new Date(now.getTime() + durationMinutes * 60 * 1000).toISOString();

      activeSubmission = collections.examSubmissions.create({
        studentId,
        studentName: req.user.fullName,
        mobile: req.user.mobile,
        examType,
        examTitle,
        durationMinutes,
        startedAt: now.toISOString(),
        serverDeadline,
        status: 'IN_PROGRESS',
        tabSwitchCount: 0,
        answers: {}, // questionId -> { selectedOption, status, timeSpentSeconds }
        score: 0,
        correctCount: 0,
        incorrectCount: 0,
        unattemptedCount: allQuestions.length
      });
    }

    // SANITIZE questions: Strip answers and explanations so students cannot inspect network tab
    const sanitizedQuestions = allQuestions.map((q, idx) => ({
      id: q.id,
      questionNumber: idx + 1,
      subject: q.subject,
      topic: q.topic,
      questionText: q.questionText,
      options: q.options,
      classLevel: q.classLevel
    }));

    return successResponse(res, 'Exam session ready', {
      submissionId: activeSubmission.id,
      startedAt: activeSubmission.startedAt,
      serverDeadline: activeSubmission.serverDeadline,
      durationMinutes: activeSubmission.durationMinutes,
      savedAnswers: activeSubmission.answers,
      tabSwitchCount: activeSubmission.tabSwitchCount || 0,
      totalQuestions: sanitizedQuestions.length,
      questions: sanitizedQuestions
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Save / Update Single Answer in real time (called every time student clicks or saves)
 */
async function saveAnswer(req, res, next) {
  try {
    const { submissionId, questionId, selectedOption, status } = req.body;

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
      status: status || QUESTION_STATUS.ANSWERED,
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
      // Force submit on 3rd violation
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
 * Submit Exam & Grade automatically
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

    const allQuestions = collections.questions.find();
    const answers = submission.answers || {};

    let correctCount = 0;
    let incorrectCount = 0;
    let unattemptedCount = 0;
    let totalScore = 0;

    const subjectBreakdown = {};

    allQuestions.forEach(q => {
      const studentResponse = answers[q.id];
      const subj = q.subject || 'General';

      if (!subjectBreakdown[subj]) {
        subjectBreakdown[subj] = { total: 0, correct: 0, incorrect: 0, unattempted: 0, marks: 0 };
      }
      subjectBreakdown[subj].total += 1;

      if (!studentResponse || studentResponse.selectedOption === null || studentResponse.selectedOption === undefined) {
        unattemptedCount += 1;
        subjectBreakdown[subj].unattempted += 1;
      } else if (Number(studentResponse.selectedOption) === Number(q.correctOption)) {
        correctCount += 1;
        totalScore += MARKING_SCHEME.CORRECT; // +4
        subjectBreakdown[subj].correct += 1;
        subjectBreakdown[subj].marks += MARKING_SCHEME.CORRECT;
      } else {
        incorrectCount += 1;
        totalScore += MARKING_SCHEME.INCORRECT; // -1
        subjectBreakdown[subj].incorrect += 1;
        subjectBreakdown[subj].marks += MARKING_SCHEME.INCORRECT;
      }
    });

    const maxMarks = allQuestions.length * MARKING_SCHEME.CORRECT;
    const percentage = maxMarks > 0 ? Math.max(0, Math.round((totalScore / maxMarks) * 100)) : 0;

    // Calculate scholarship slab
    let scholarshipPercent = 10;
    if (percentage >= 85) scholarshipPercent = 100;
    else if (percentage >= 70) scholarshipPercent = 75;
    else if (percentage >= 50) scholarshipPercent = 50;
    else if (percentage >= 35) scholarshipPercent = 25;

    const updated = collections.examSubmissions.findByIdAndUpdate(submission.id, {
      status: 'SUBMITTED',
      submittedAt: new Date().toISOString(),
      score: totalScore,
      maxMarks,
      percentage,
      correctCount,
      incorrectCount,
      unattemptedCount,
      scholarshipPercent,
      subjectBreakdown
    });

    return successResponse(res, 'Exam submitted and evaluated successfully!', updated);
  } catch (err) {
    next(err);
  }
}

/**
 * Get Submission Result and Detailed Analysis
 */
async function getSubmissionResult(req, res, next) {
  try {
    const { id } = req.params;
    const submission = collections.examSubmissions.findById(id);

    if (!submission) {
      return errorResponse(res, 'Submission not found', 404);
    }

    // Include questions with solutions now that exam is over
    const allQuestions = collections.questions.find();
    const solutions = allQuestions.map((q, idx) => ({
      id: q.id,
      questionNumber: idx + 1,
      subject: q.subject,
      topic: q.topic,
      questionText: q.questionText,
      options: q.options,
      correctOption: q.correctOption,
      explanation: q.explanation,
      studentSelected: submission.answers && submission.answers[q.id] ? submission.answers[q.id].selectedOption : null
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
  startExam,
  saveAnswer,
  reportViolation,
  submitExam,
  getSubmissionResult
};
