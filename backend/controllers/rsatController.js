const { collections } = require('../config/db');
const { successResponse, errorResponse } = require('../utils/apiResponse');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../middlewares/authMiddleware');

/**
 * Get currently active RSAT Exam ID configured by Admin
 */
function getActiveRsatExamId() {
  const activeExam = collections.exams.findOne({ category: 'RSAT', active: true }) ||
                     collections.exams.findOne({ category: 'RSAT' });
  return activeExam ? activeExam.id : 'test-rsat-scholarship';
}

/**
 * Register for RSAT Online Scholarship Exam with ₹100 fee
 */
async function registerRSAT(req, res, next) {
  try {
    const {
      fullName,
      mobile,
      targetClass,
      stream,
      schoolName,
      preferredCentre,
      paymentMode,
      transactionId,
      scheduledDate,
      scheduledTimeSlot,
      scheduleMode
    } = req.body;

    // Identify student (from auth token or request body)
    let studentId = req.user ? req.user.id : null;
    let studentName = (req.user ? req.user.fullName : fullName) || 'RSAT Aspirant';
    let studentMobile = (req.user ? req.user.mobile : mobile);

    if (!studentMobile) {
      return errorResponse(res, 'Student mobile number is required', 400);
    }

    // Auto-create or link user account if not existing
    let user = collections.users.findOne({ mobile: studentMobile });
    if (!user) {
      user = collections.users.create({
        fullName: studentName,
        mobile: studentMobile,
        role: 'student',
        targetClass: targetClass || 'Class 11',
        targetStream: stream || 'NEET',
        schoolName: schoolName || '',
        verifiedAt: new Date().toISOString()
      });
      studentId = user.id;
    } else {
      studentId = user.id;
      studentName = user.fullName || studentName;
    }

    // Generate JWT token so student can immediately log in
    const token = jwt.sign(
      {
        id: user.id,
        mobile: user.mobile,
        fullName: user.fullName,
        role: user.role || 'student',
        targetStream: stream || user.targetStream || 'NEET',
        targetClass: targetClass || user.targetClass || 'Class 11'
      },
      JWT_SECRET,
      { expiresIn: '60d' }
    );

    // Check if already registered
    let registration = collections.rsatRegistrations.findOne({ studentId });
    const regCount = collections.rsatRegistrations.countDocuments() + 1;
    const rollNumber = registration ? registration.rollNumber : `RSAT-2026-${String(regCount).padStart(4, '0')}`;
    const txnId = transactionId || `TXN-RSAT-100-${Math.floor(100000 + Math.random() * 900000)}`;

    const registrationData = {
      studentId,
      rollNumber,
      studentName,
      mobile: studentMobile,
      email: req.body.email || user.email || '',
      targetClass: targetClass || user.targetClass || 'Class 11',
      stream: stream || user.targetStream || 'NEET',
      schoolName: schoolName || user.schoolName || '',
      preferredCentre: preferredCentre || 'Vijay Nagar Main Campus',
      status: 'ACTIVE',
      funnelStatus: scheduledDate ? '3_SCHEDULED_AWAITING_EXAM' : '2_FEE_PAID_PENDING_SCHEDULE',
      feePaid: 100, // Mandated ₹100 fee
      paymentStatus: 'PAID',
      paymentMode: paymentMode || 'UPI_GATEWAY',
      transactionId: txnId,
      paidAt: new Date().toISOString(),
      examDurationMinutes: 45,
      scheduledSlot: scheduledDate ? {
        mode: scheduleMode || 'LATER',
        date: scheduledDate,
        timeSlot: scheduledTimeSlot || '10:00 AM',
        scheduledAt: new Date().toISOString()
      } : (registration?.scheduledSlot || null),
      registeredAt: registration ? registration.registeredAt : new Date().toISOString()
    };

    if (registration) {
      registration = collections.rsatRegistrations.findByIdAndUpdate(registration.id, registrationData);
    } else {
      registration = collections.rsatRegistrations.create(registrationData);
    }

    // Record payment ledger entry
    collections.payments.create({
      studentId,
      studentName,
      mobile: studentMobile,
      amount: 100,
      purpose: 'RSAT_SCHOLARSHIP_EXAM_FEE',
      status: 'SUCCESS',
      paymentMode: paymentMode || 'UPI',
      transactionId: txnId,
      metadata: {
        rollNumber,
        stream: registration.stream,
        targetClass: registration.targetClass
      },
      paidAt: new Date().toISOString()
    });

    return successResponse(
      res,
      'RSAT Registration & ₹100 payment completed! Exam portal unlocked.',
      {
        registration,
        user,
        token,
        examId: getActiveRsatExamId(),
        unlocked: true
      },
      201
    );
  } catch (err) {
    next(err);
  }
}

/**
 * Get Student's RSAT status
 */
async function getMyRSAT(req, res, next) {
  try {
    const studentId = req.user.id;
    const registration = collections.rsatRegistrations.findOne({ studentId });

    return successResponse(res, 'RSAT status retrieved', registration);
  } catch (err) {
    next(err);
  }
}

/**
 * Check if mobile number has already paid RSAT fee
 */
async function checkRsatFeeStatus(req, res, next) {
  try {
    const { mobile } = req.params;
    if (!mobile) {
      return errorResponse(res, 'Mobile number required', 400);
    }

    const clean = String(mobile).trim();
    const cleanMobile = clean.replace(/\D/g, '').slice(-10);

    const reg = (cleanMobile ? collections.rsatRegistrations.findOne({ mobile: cleanMobile }) : null) ||
                collections.rsatRegistrations.findOne({ mobile: clean }) ||
                collections.rsatRegistrations.findOne({ email: clean.toLowerCase() }) ||
                collections.rsatRegistrations.findOne({ studentId: clean });

    const isPaid = Boolean(reg && reg.paymentStatus === 'PAID');
    const activeExamId = getActiveRsatExamId();

    return successResponse(res, 'RSAT Fee status checked', {
      isPaid,
      registration: reg || null,
      examId: activeExamId,
      activeExamId
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Schedule Exam Slot (Now vs Later)
 */
async function scheduleRsatSlot(req, res, next) {
  try {
    const studentId = req.user ? req.user.id : null;
    const { mobile, scheduledDate, scheduledTimeSlot, mode } = req.body;

    let reg = null;
    if (studentId) {
      reg = collections.rsatRegistrations.findOne({ studentId });
    }
    if (!reg && mobile) {
      reg = collections.rsatRegistrations.findOne({ mobile });
    }

    if (!reg) {
      return errorResponse(res, 'RSAT registration not found for student', 404);
    }

    const slotData = {
      mode: mode || 'LATER',
      date: scheduledDate || 'Tomorrow',
      timeSlot: scheduledTimeSlot || '10:00 AM',
      scheduledAt: new Date().toISOString()
    };

    const updated = collections.rsatRegistrations.findByIdAndUpdate(reg.id, {
      scheduledSlot: slotData,
      funnelStatus: reg.funnelStatus === '4_EXAM_COMPLETED' ? '4_EXAM_COMPLETED' : '3_SCHEDULED_AWAITING_EXAM'
    });

    return successResponse(res, 'RSAT Exam slot scheduled successfully', {
      registration: updated,
      scheduledSlot: slotData
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Get RSAT Notifications
 */
async function getRsatNotifications(req, res, next) {
  try {
    const studentId = req.user ? req.user.id : null;
    const mobile = req.query.mobile;

    let reg = null;
    if (studentId) {
      reg = collections.rsatRegistrations.findOne({ studentId });
    }
    if (!reg && mobile) {
      reg = collections.rsatRegistrations.findOne({ mobile });
    }

    const notifications = [];

    if (reg && reg.scheduledSlot && reg.scheduledSlot.mode === 'LATER') {
      notifications.push({
        id: 'notif-slot',
        title: '📅 RSAT Scholarship Exam Scheduled',
        message: `Your exam is confirmed for ${reg.scheduledSlot.date} at ${reg.scheduledSlot.timeSlot}. Please join 10 minutes prior with steady internet.`,
        timestamp: reg.scheduledSlot.scheduledAt || new Date().toISOString(),
        type: 'SLOT',
        unread: true
      });
    } else if (reg && reg.paymentStatus === 'PAID') {
      notifications.push({
        id: 'notif-ready',
        title: '⚡ RSAT Exam Hall Ready',
        message: 'Your RSAT registration fee of ₹100 is verified. You can launch your CBT exam anytime or schedule a preferred slot.',
        timestamp: reg.paidAt || new Date().toISOString(),
        type: 'ALERT',
        unread: true
      });
    }

    notifications.push({
      id: 'notif-study-mat',
      title: '📚 RSAT Diagnostic Materials Unlocked',
      message: 'Official RSAT Sample Mock Paper 2026 & High-Yield Formula Handbook are available in your RSAT Portal.',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      type: 'STUDY',
      unread: false
    });

    notifications.push({
      id: 'notif-scholarship-slab',
      title: '🏆 Win 100% Scholarship Rule',
      message: 'Score 90%+ marks in the RSAT test to earn a complete 100% Tuition Fee waiver on NEET / JEE courses.',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      type: 'SCHOLARSHIP',
      unread: false
    });

    return successResponse(res, 'Notifications retrieved', { notifications });
  } catch (err) {
    next(err);
  }
}

/**
 * Unified RSAT Command Centre Data (Admin)
 * Endpoint: GET /api/rsat/command-center
 */
async function getRSATCommandCenterData(req, res, next) {
  try {
    const { month = 'ALL' } = req.query; // 'ALL', '2026-10', '2026-09'

    const allRegistrations = collections.rsatRegistrations.find();
    const allExams = collections.exams.find();
    const allSubmissions = collections.examSubmissions.find();
    const allAdmissions = collections.admissions.find();

    // 1. Gather all available months from registrations
    const monthsSet = new Set();
    allRegistrations.forEach(r => {
      const dt = r.registeredAt || r.createdAt || r.paidAt;
      if (dt) monthsSet.add(dt.slice(0, 7));
    });
    const availableMonths = Array.from(monthsSet).sort().reverse();

    // 2. Filter registrations by month if specified
    const filteredRegistrations = allRegistrations.filter(r => {
      if (month === 'ALL') return true;
      const dt = r.registeredAt || r.createdAt || r.paidAt;
      return dt && dt.startsWith(month);
    });

    // 3. Map candidates with submissions & admissions
    let enrolledCount = 0;
    let attemptedCount = 0;
    let passedCount = 0;
    let scheduledCount = 0;
    let signedUpCount = filteredRegistrations.length;

    const candidates = filteredRegistrations.map(reg => {
      // Find submission for this candidate
      const submission = allSubmissions.find(s =>
        (s.studentId && s.studentId === reg.studentId) ||
        (s.mobile && s.mobile === reg.mobile) ||
        (reg.rollNumber && s.rollNumber === reg.rollNumber)
      );

      // Find admission for this candidate
      const admission = allAdmissions.find(a =>
        (a.studentMobile && (a.studentMobile === reg.mobile || a.parentMobile === reg.mobile)) ||
        (reg.email && a.email && a.email.toLowerCase() === reg.email.toLowerCase()) ||
        (a.admissionSource === 'RSAT' && (a.studentMobile === reg.mobile || (a.officeRemarks && a.officeRemarks.includes(reg.rollNumber))))
      );

      const hasScheduled = !!(reg.scheduledSlot && (reg.scheduledSlot.date || reg.scheduledSlot.mode));
      const hasAttempted = !!submission;
      const score = submission ? (submission.score !== undefined ? submission.score : 0) : null;
      const totalMarks = submission ? (submission.totalMarks || 120) : null;
      const accuracy = submission ? (submission.accuracyPercentage || 0) : null;
      const scholarship = submission?.scholarshipPercent || reg.scholarshipPercent || 0;
      const hasPassed = (scholarship >= 25) || (submission && submission.scorePercentage >= 40);
      const isEnrolled = !!(admission && admission.status === 'APPROVED');

      if (hasScheduled) scheduledCount++;
      if (hasAttempted) attemptedCount++;
      if (hasPassed) passedCount++;
      if (isEnrolled) enrolledCount++;

      // Compute dynamic funnel stage
      let currentStage = '1_SIGNED_UP_ONLY';
      if (isEnrolled) {
        currentStage = '5_ENROLLED_IN_INSTITUTE';
      } else if (hasPassed) {
        currentStage = '4_SCHOLARSHIP_AWARDED';
      } else if (hasAttempted) {
        currentStage = '4_EXAM_COMPLETED';
      } else if (hasScheduled) {
        currentStage = '3_SCHEDULED_AWAITING_EXAM';
      } else if (reg.paymentStatus === 'PAID') {
        currentStage = '2_FEE_PAID_PENDING_SCHEDULE';
      }

      return {
        id: reg.id,
        studentId: reg.studentId,
        rollNumber: reg.rollNumber,
        studentName: reg.studentName,
        mobile: reg.mobile,
        email: reg.email || '',
        targetClass: reg.targetClass || 'Class 11',
        stream: reg.stream || 'NEET',
        schoolName: reg.schoolName || '',
        status: reg.status || 'ACTIVE',
        funnelStatus: currentStage,
        feePaid: reg.feePaid !== undefined ? reg.feePaid : 100,
        paymentStatus: reg.paymentStatus || 'PENDING',
        transactionId: reg.transactionId || '',
        scheduledSlot: reg.scheduledSlot || null,
        examResult: submission ? {
          submissionId: submission.id,
          score,
          totalMarks,
          accuracy,
          scorePercentage: submission.scorePercentage || 0,
          scholarshipPercent: scholarship,
          submittedAt: submission.submittedAt || submission.createdAt
        } : null,
        enrolledInfo: isEnrolled ? {
          admissionNo: admission.applicationNo,
          studentId: admission.studentId,
          batchName: admission.batchName || `${reg.stream} Achiever Batch 2026-27`,
          centre: admission.centre || 'Vijay Nagar Main Campus',
          enrolledAt: admission.enrolledAt || admission.updatedAt
        } : null,
        registeredAt: reg.registeredAt || reg.createdAt
      };
    });

    // 4. RSAT Papers (Active and Past)
    const rsatPapers = allExams.filter(e =>
      e.category === 'RSAT' || (e.id && e.id.toLowerCase().includes('rsat'))
    ).map(p => ({
      id: p.id,
      title: p.title,
      examType: p.examType || 'RSAT',
      stream: p.stream || 'ALL',
      durationMinutes: p.durationMinutes || 45,
      totalMarks: p.totalMarks || 120,
      totalQuestions: p.totalQuestions || 30,
      subjects: p.subjects || ['Physics', 'Chemistry', 'Mathematics', 'Biology'],
      active: p.active !== false,
      scheduledDate: p.scheduledDate || 'Live 24x7',
      createdAt: p.createdAt || '2026-09-01T00:00:00Z'
    }));

    // 5. Enrolled students attributed to RSAT
    const enrolledStudents = allAdmissions.filter(a =>
      a.status === 'APPROVED' &&
      (a.admissionSource === 'RSAT' ||
       (a.officeRemarks && a.officeRemarks.toUpperCase().includes('RSAT')) ||
       allRegistrations.some(r => r.mobile === a.studentMobile || r.mobile === a.parentMobile))
    ).map(a => ({
      id: a.id,
      applicationNo: a.applicationNo,
      studentName: `${a.firstName || ''} ${a.lastName || ''}`.trim(),
      mobile: a.studentMobile || a.parentMobile,
      email: a.email,
      stream: a.stream,
      targetClass: a.targetClass,
      centre: a.centre || 'Vijay Nagar Main Campus',
      studentId: a.studentId,
      scholarshipApplied: a.scholarshipEligibility || '50% (RSAT)',
      batchName: a.batchName || 'Achiever Batch 2026-27',
      admissionSource: 'RSAT'
    }));

    return successResponse(res, 'RSAT Command Center data retrieved', {
      selectedMonth: month,
      availableMonths,
      funnel: {
        signedUp: signedUpCount,
        scheduled: scheduledCount,
        attempted: attemptedCount,
        passed: passedCount,
        enrolled: enrolledStudents.length || enrolledCount
      },
      candidates,
      rsatPapers,
      enrolledStudents
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Create a new RSAT Exam Paper Pattern (Admin)
 * Endpoint: POST /api/rsat/create-paper
 */
async function createRSATPaper(req, res, next) {
  try {
    const {
      title,
      stream = 'ALL',
      targetClass = 'Class 11',
      durationMinutes = 45,
      totalMarks = 120,
      totalQuestions = 30,
      subjects = ['Physics', 'Chemistry', 'Mathematics', 'Biology'],
      makeActive = true
    } = req.body;

    if (!title) {
      return errorResponse(res, 'Paper title is required', 400);
    }

    const paperId = `test-rsat-${Date.now()}`;

    // If making active, deactivate other RSAT papers
    if (makeActive) {
      const allExams = collections.exams.find({ category: 'RSAT' });
      allExams.forEach(e => {
        collections.exams.findByIdAndUpdate(e.id, { active: false });
      });
    }

    const newPaper = collections.exams.create({
      id: paperId,
      category: 'RSAT',
      title: title.trim(),
      examType: 'RSAT',
      stream: String(stream).toUpperCase(),
      subject: 'FULL_MOCK',
      targetBatch: targetClass,
      durationMinutes: Number(durationMinutes) || 45,
      totalMarks: Number(totalMarks) || 120,
      totalQuestions: Number(totalQuestions) || 30,
      maxAttemptsAllowed: 30,
      subjects: Array.isArray(subjects) ? subjects : ['Physics', 'Chemistry', 'Mathematics', 'Biology'],
      sectionsConfig: {
        General: {
          mandatory: true,
          marksPerCorrect: 4,
          negativeMarks: -1,
          type: 'MCQ'
        }
      },
      description: `Official RSAT scholarship aptitude test for ${targetClass} students.`,
      active: !!makeActive,
      isPublishedToStudents: true,
      scheduledDate: 'Live 24x7',
      patternType: 'SCHOLARSHIP_RSAT',
      createdAt: new Date().toISOString()
    });

    // Clone base RSAT questions to new paper so candidates can immediately attempt it
    const baseQuestions = collections.questions.find({ testId: 'test-rsat-scholarship' });
    if (baseQuestions && baseQuestions.length > 0) {
      baseQuestions.forEach((q, idx) => {
        collections.questions.create({
          ...q,
          id: `q-rsat-${paperId}-${idx + 1}`,
          testId: paperId,
          examType: 'RSAT'
        });
      });
    }

    return successResponse(res, 'New RSAT Exam Paper created successfully', newPaper, 201);
  } catch (err) {
    next(err);
  }
}

/**
 * Set Active RSAT Paper for Students (Admin)
 * Endpoint: PUT /api/rsat/set-active-paper/:id
 */
async function setActiveRSATPaper(req, res, next) {
  try {
    const { id } = req.params;
    const targetPaper = collections.exams.findById(id);

    if (!targetPaper) {
      return errorResponse(res, 'RSAT paper not found', 404);
    }

    // Deactivate all other RSAT papers
    const allExams = collections.exams.find({ category: 'RSAT' });
    allExams.forEach(e => {
      collections.exams.findByIdAndUpdate(e.id, { active: e.id === id });
    });

    const updated = collections.exams.findByIdAndUpdate(id, { active: true });
    return successResponse(res, `RSAT Paper "${updated.title}" is now active for all student tests!`, updated);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  registerRSAT,
  getMyRSAT,
  checkRsatFeeStatus,
  scheduleRsatSlot,
  getRsatNotifications,
  getRSATCommandCenterData,
  createRSATPaper,
  setActiveRSATPaper
};

