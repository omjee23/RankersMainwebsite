const { collections } = require('../config/db');
const { generateAdmitCardQR } = require('../services/qrCodeService');
const { successResponse, errorResponse } = require('../utils/apiResponse');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../middlewares/authMiddleware');

/**
 * Get currently active RANKEX Exam ID configured by Admin
 */
function getActiveRankXExamId() {
  const activeExam = collections.exams.findOne({ category: 'RANKEX', active: true }) ||
                     collections.exams.findOne({ category: 'RANKEX' }) ||
                     collections.exams.findById('test-rankex-2027-class11');
  return activeExam ? activeExam.id : 'test-rankex-2027-class11';
}

/**
 * Get available test centres and seat status
 */
async function getCentres(req, res, next) {
  try {
    const centres = collections.centres.find({ active: true });
    return successResponse(res, 'Centres fetched', centres);
  } catch (err) {
    next(err);
  }
}

/**
 * Register for RankX Offline Scholarship Exam
 */
async function registerRankX(req, res, next) {
  try {
    const {
      studentName,
      fatherName,
      mobile,
      targetClass,
      stream,
      schoolName,
      centreId,
      city,
      examMode = 'OFFLINE',
      paymentMode = 'RAZORPAY',
      transactionId = null,
      orderId = null
    } = req.body;

    const studentMobile = mobile || req.user?.mobile;
    if (!studentMobile) {
      return errorResponse(res, 'Please provide valid 10-digit mobile number', 400);
    }

    if (!targetClass || !stream) {
      return errorResponse(res, 'Please provide mandatory details (Class & Stream)', 400);
    }

    // Find or create student user record
    let studentId = req.user ? req.user.id : null;
    let user = studentId ? collections.users.findById(studentId) : collections.users.findOne({ mobile: studentMobile });
    if (!user) {
      user = collections.users.create({
        fullName: studentName || 'RANKEX Aspirant',
        mobile: studentMobile,
        role: 'STUDENT',
        targetStream: stream,
        targetClass: targetClass,
        isEnrolled: false
      });
      studentId = user.id;
    } else {
      studentId = user.id;
    }

    // Default to Vijay Nagar Main Campus if centre not provided or online mode
    const chosenCentreId = centreId || 'centre-vijay-nagar';
    let centre = collections.centres.findById(chosenCentreId) || collections.centres.findOne({ active: true });
    if (!centre) {
      centre = {
        id: 'centre-vijay-nagar',
        name: 'Vijay Nagar Main Campus',
        address: 'HQ City Walk, Block A, 129, Scheme No. 54, Near Satya Sai Square, Vijay Nagar, Indore - 452010',
        city: 'Indore'
      };
    }

    // Check if already registered
    let registration = collections.rankXRegistrations.findOne({
      $or: [
        { studentId },
        { mobile: studentMobile }
      ]
    });

    const isOnline = examMode.toUpperCase() === 'ONLINE';

    // Generate Unique Roll Number: RPX-2027-0001
    const totalRegs = collections.rankXRegistrations.countDocuments() + 1;
    const rollNumber = registration ? registration.rollNumber : `RPX-2027-${String(totalRegs).padStart(4, '0')}`;

    // Generate QR Code data for Admit Card
    const qrPayload = {
      rollNumber,
      studentName: studentName || user.fullName,
      stream,
      examMode: isOnline ? 'ONLINE CBT' : 'OFFLINE CENTRE',
      centreName: isOnline ? 'Online CBT Examination Hall' : centre.name,
      verified: true
    };
    const qrCodeDataUrl = await generateAdmitCardQR(qrPayload);

    const regData = {
      studentId,
      rollNumber,
      studentName: studentName || user.fullName,
      fatherName: fatherName || '',
      mobile: studentMobile,
      email: req.body.email || user.email || '',
      targetClass,
      stream,
      schoolName: schoolName || '',
      examMode: isOnline ? 'ONLINE' : 'OFFLINE',
      centreId: centre.id,
      centreName: isOnline ? 'Rankers Online CBT Examination Hall' : centre.name,
      centreAddress: isOnline ? 'Online Proctored Web Examination Hall' : centre.address,
      city: city || centre.city || 'Indore',
      examDate: 'Sunday, 18 October 2026',
      examTiming: isOnline ? 'Flexible 60-Mins Online CBT Window' : '10:00 AM – 11:30 AM',
      reportingTime: isOnline ? '09:45 AM (System Login)' : '09:15 AM (Campus Gates Open)',
      qrCodeDataUrl,
      funnelStatus: '2_FEE_PAID_ADMIT_CARD_ISSUED',
      paymentStatus: 'PAID',
      feePaid: 100,
      paymentMode,
      transactionId: transactionId || `TXN_RPX_${Date.now()}`,
      orderId: orderId || null,
      attendanceStatus: 'PENDING',
      registeredAt: registration ? registration.registeredAt : new Date().toISOString()
    };

    if (registration) {
      registration = collections.rankXRegistrations.findByIdAndUpdate(registration.id, regData);
    } else {
      registration = collections.rankXRegistrations.create(regData);
    }

    // Log payment in ledger
    collections.payments.create({
      studentId,
      studentName: studentName || user.fullName,
      mobile: studentMobile,
      amount: 100,
      purpose: 'RANKEX_SCHOLARSHIP_EXAM_FEE',
      status: 'SUCCESS',
      paymentMode: paymentMode || 'RAZORPAY',
      transactionId: regData.transactionId,
      metadata: {
        rollNumber,
        stream,
        targetClass,
        examMode: regData.examMode
      },
      paidAt: new Date().toISOString()
    });

    return successResponse(res, 'RANKEX 2027 Registration & Fee Payment Completed Successfully!', registration, 201);
  } catch (err) {
    next(err);
  }
}

/**
 * Get Student's RankX Admit Card & Details
 */
async function getMyRankX(req, res, next) {
  try {
    const studentId = req.user.id;
    let registration = collections.rankXRegistrations.findOne({ studentId });

    if (!registration && req.user.mobile) {
      registration = collections.rankXRegistrations.findOne({ mobile: req.user.mobile });
    }

    if (!registration && req.user.email) {
      registration = collections.rankXRegistrations.findOne({ email: req.user.email });
    }

    if (!registration) {
      return successResponse(res, 'No RankX registration found for this account', null);
    }

    return successResponse(res, 'RankX registration details retrieved', registration);
  } catch (err) {
    next(err);
  }
}

/**
 * Dedicated Student Login for RANKEX
 * Endpoint: POST /api/rankx/student-login
 */
async function studentRankXLogin(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return errorResponse(res, 'Email/Mobile and password are required', 400);
    }

    const cleanInput = email.trim().toLowerCase();
    const cleanMobile = email.trim().replace(/\D/g, '');

    let user = collections.users.findOne({ email: cleanInput });
    if (!user && cleanMobile.length >= 10) {
      user = collections.users.findOne({ mobile: cleanMobile });
    }

    // Demo/testing fallback: if user doesn't exist, create an aspirant record
    if (!user) {
      user = collections.users.create({
        fullName: cleanInput.split('@')[0] || 'RANKEX Aspirant',
        email: cleanInput.includes('@') ? cleanInput : `${cleanMobile || Date.now()}@student.rankerspath.in`,
        mobile: cleanMobile.length >= 10 ? cleanMobile : '9826222222',
        role: 'student',
        originExam: 'RANKEX',
        targetStream: 'IIT-JEE',
        targetClass: 'Class 11'
      });
    }

    // Find RankX registration for this user
    let registration = collections.rankXRegistrations.findOne({
      $or: [
        { studentId: user.id },
        { mobile: user.mobile },
        { email: user.email }
      ]
    });

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        mobile: user.mobile,
        fullName: user.fullName,
        role: 'student',
        originExam: 'RANKEX'
      },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    return successResponse(res, 'RANKEX Login successful', {
      user,
      token,
      registration: registration || null,
      examId: getActiveRankXExamId()
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Dedicated Student Signup for RANKEX
 * Endpoint: POST /api/rankx/student-signup
 */
async function studentRankXSignup(req, res, next) {
  try {
    const { fullName, email, mobile, password, targetClass = '11th', stream = 'IIT_JEE' } = req.body;

    if (!fullName || !mobile || mobile.length < 10) {
      return errorResponse(res, 'Full name and a valid 10-digit mobile number are required', 400);
    }

    const cleanMobile = mobile.replace(/\D/g, '');
    const cleanEmail = (email || `${cleanMobile}@student.rankerspath.in`).trim().toLowerCase();

    let user = collections.users.findOne({ mobile: cleanMobile }) || collections.users.findOne({ email: cleanEmail });
    if (!user) {
      user = collections.users.create({
        fullName: fullName.trim(),
        email: cleanEmail,
        mobile: cleanMobile,
        role: 'student',
        originExam: 'RANKEX',
        targetClass,
        targetStream: stream
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        mobile: user.mobile,
        fullName: user.fullName,
        role: 'student',
        originExam: 'RANKEX'
      },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    return successResponse(res, 'RANKEX Student account created successfully', {
      user,
      token,
      examId: getActiveRankXExamId()
    }, 201);
  } catch (err) {
    next(err);
  }
}

/**
 * Schedule / Reschedule RankX Exam Slot
 * Endpoint: POST /api/rankx/schedule-slot
 */
async function scheduleRankXSlot(req, res, next) {
  try {
    const studentId = req.user ? req.user.id : null;
    const { mobile, scheduledDate, scheduledTimeSlot, examMode = 'ONLINE', centreId } = req.body;

    const queryMobile = mobile || (req.user ? req.user.mobile : null);
    if (!queryMobile && !studentId) {
      return errorResponse(res, 'Mobile number or student authentication required to schedule slot', 400);
    }

    let reg = null;
    if (studentId) {
      reg = collections.rankXRegistrations.findOne({ studentId });
    }
    if (!reg && queryMobile) {
      reg = collections.rankXRegistrations.findOne({ mobile: queryMobile });
    }

    const dateVal = scheduledDate || 'Sunday, 18 October 2026';
    const timeVal = scheduledTimeSlot || (examMode === 'ONLINE' ? 'Flexible 60-Mins Online CBT Window' : '10:00 AM – 11:30 AM');

    if (!reg) {
      // Create provisional registration record for slot
      const totalRegs = collections.rankXRegistrations.countDocuments() + 1;
      const rollNumber = `RPX-2027-${String(totalRegs).padStart(4, '0')}`;
      reg = collections.rankXRegistrations.create({
        studentId: studentId || `stu-rankx-${Date.now()}`,
        studentName: req.body.studentName || req.user?.fullName || 'RANKEX Candidate',
        mobile: queryMobile,
        email: req.body.email || req.user?.email || '',
        rollNumber,
        targetClass: req.body.targetClass || 'Class 11',
        stream: req.body.stream || 'IIT_JEE',
        examMode,
        centreId: centreId || 'centre-vijay-nagar',
        centreName: examMode === 'ONLINE' ? 'Rankers Online CBT Examination Hall' : 'Vijay Nagar Main Campus',
        examDate: dateVal,
        examTiming: timeVal,
        paymentStatus: 'PENDING',
        feePaid: 0,
        rescheduledAt: new Date().toISOString(),
        rescheduleCount: 1,
        createdAt: new Date().toISOString()
      });
    } else {
      const currentCount = reg.rescheduleCount || 0;
      reg = collections.rankXRegistrations.findByIdAndUpdate(reg.id, {
        examDate: dateVal,
        examTiming: timeVal,
        examMode: examMode || reg.examMode,
        centreId: centreId || reg.centreId,
        rescheduledAt: new Date().toISOString(),
        rescheduleCount: currentCount + 1
      });
    }

    return successResponse(res, `RANKEX Exam slot successfully scheduled for ${dateVal} (${timeVal})`, reg);
  } catch (err) {
    next(err);
  }
}

/**
 * Check if mobile number has already paid RankX fee
 * Endpoint: GET /api/rankx/fee-status/:mobile
 */
async function checkRankXFeeStatus(req, res, next) {
  try {
    const { mobile } = req.params;
    if (!mobile) {
      return errorResponse(res, 'Mobile number required', 400);
    }

    const reg = collections.rankXRegistrations.findOne({ mobile });
    const isPaid = Boolean(
      reg && (
        reg.paymentStatus === 'PAID' ||
        reg.paymentStatus === 'PAID_OR_WAIVED' ||
        (reg.feePaid && reg.feePaid >= 100)
      )
    );

    return successResponse(res, 'RankX Fee status checked', {
      isPaid,
      registration: reg || null,
      examId: getActiveRankXExamId()
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Get Student Notifications for RANKEX
 * Endpoint: GET /api/rankx/notifications/:mobile
 */
async function getRankXNotifications(req, res, next) {
  try {
    const { mobile } = req.params;
    const notifications = [
      {
        id: 'notif-rankx-slot',
        title: '🗓️ RANKEX Slot Rescheduling Available',
        message: 'You can reschedule your online/offline examination date and timing window anytime before the test starts.',
        timestamp: new Date().toISOString(),
        type: 'SLOT',
        unread: true
      },
      {
        id: 'notif-rankx-materials',
        title: '📚 RANKEX 2027 Diagnostic Question Papers Ready',
        message: 'Download official RANKEX mock test papers and Kota formula sheets to prepare before launching the CBT exam.',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        type: 'STUDY',
        unread: false
      },
      {
        id: 'notif-rankx-pattern',
        title: '🏆 RANKEX All-India Scholarship Pattern',
        message: 'RANKEX consists of 40 questions across Physics, Chemistry, Maths/Biology & Aptitude (160 Marks, 60 Minutes, +4 / -1).',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        type: 'SCHOLARSHIP',
        unread: false
      }
    ];

    return successResponse(res, 'Notifications retrieved', { notifications });
  } catch (err) {
    next(err);
  }
}

/**
 * Unified RANKEX Command Centre Data (Admin)
 * Endpoint: GET /api/rankx/command-center
 */
async function getRankXCommandCenterData(req, res, next) {
  try {
    const { month = 'ALL' } = req.query; // 'ALL', '2026-10', '2026-09'

    const allRegistrations = collections.rankXRegistrations.find();
    const allExams = collections.exams.find();
    const allSubmissions = collections.examSubmissions.find();
    const allAdmissions = collections.admissions.find();

    // 1. Gather all available months from registrations
    const monthsSet = new Set();
    allRegistrations.forEach(r => {
      const dt = r.registeredAt || r.createdAt || r.examDate;
      if (dt && dt.length >= 7) {
        if (/^\d{4}-\d{2}/.test(dt)) {
          monthsSet.add(dt.slice(0, 7));
        } else if (dt.includes('October 2026') || dt.includes('Oct 2026')) {
          monthsSet.add('2026-10');
        } else if (dt.includes('September 2026') || dt.includes('Sep 2026')) {
          monthsSet.add('2026-09');
        }
      }
    });
    if (monthsSet.size === 0) monthsSet.add('2026-10');
    const availableMonths = Array.from(monthsSet).sort().reverse();

    // 2. Filter registrations by month if specified
    const filteredRegistrations = allRegistrations.filter(r => {
      if (month === 'ALL') return true;
      const dt = r.registeredAt || r.createdAt || '';
      if (dt.startsWith(month)) return true;
      if (month === '2026-10' && (r.examDate?.includes('October 2026') || dt.includes('2026-10'))) return true;
      if (month === '2026-09' && (r.examDate?.includes('September 2026') || dt.includes('2026-09'))) return true;
      return false;
    });

    // 3. Map candidates with submissions & admissions
    let enrolledCount = 0;
    let attemptedCount = 0;
    let passedCount = 0;
    let paidOrScheduledCount = 0;
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
        (a.admissionSource === 'RANKEX' && (a.studentMobile === reg.mobile || (a.officeRemarks && a.officeRemarks.includes(reg.rollNumber))))
      );

      const isPaid = (reg.paymentStatus === 'PAID' || reg.paymentStatus === 'PAID_OR_WAIVED' || (reg.feePaid && reg.feePaid >= 100));
      const hasScheduled = !!(reg.examDate || reg.examTiming);
      const hasAttempted = !!submission;
      const score = submission ? (submission.score !== undefined ? submission.score : 0) : (reg.score !== undefined ? reg.score : null);
      const totalMarks = submission ? (submission.totalMarks || 160) : 160;
      const accuracy = submission ? (submission.accuracyPercentage || 0) : null;
      const scholarship = submission?.scholarshipPercent || reg.scholarshipPercent || 0;
      const hasPassed = (scholarship >= 25) || (submission && submission.scorePercentage >= 40) || (reg.scholarshipPercent && reg.scholarshipPercent >= 25);
      const isEnrolled = !!(admission && admission.status === 'APPROVED');

      if (isPaid || hasScheduled) paidOrScheduledCount++;
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
        currentStage = '3_EXAM_COMPLETED';
      } else if (isPaid) {
        currentStage = '2_FEE_PAID_ADMIT_CARD_ISSUED';
      } else if (hasScheduled) {
        currentStage = '2_SLOT_SCHEDULED_PAYMENT_PENDING';
      }

      return {
        id: reg.id,
        studentId: reg.studentId,
        rollNumber: reg.rollNumber,
        studentName: reg.studentName,
        mobile: reg.mobile,
        email: reg.email || '',
        targetClass: reg.targetClass || 'Class 11',
        stream: reg.stream || 'IIT_JEE',
        schoolName: reg.schoolName || '',
        examMode: reg.examMode || 'ONLINE',
        centreName: reg.centreName || 'Online CBT Examination Hall',
        examDate: reg.examDate || 'Sunday, 18 October 2026',
        examTiming: reg.examTiming || 'Flexible 60-Mins Online CBT Window',
        rescheduleCount: reg.rescheduleCount || 0,
        rescheduledAt: reg.rescheduledAt || null,
        funnelStatus: currentStage,
        feePaid: reg.feePaid !== undefined ? reg.feePaid : (isPaid ? 100 : 0),
        paymentStatus: isPaid ? 'PAID' : (reg.paymentStatus || 'PENDING'),
        transactionId: reg.transactionId || '',
        score,
        totalMarks,
        accuracy,
        scholarshipPercent: scholarship,
        hasAttempted,
        hasPassed,
        isEnrolled,
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

    // 4. RankX Papers (Active and Past)
    const rankxPapers = allExams.filter(e =>
      e.category === 'RANKEX' || (e.id && e.id.toLowerCase().includes('rankex'))
    ).map(p => ({
      id: p.id,
      title: p.title,
      examType: p.examType || 'RANKEX',
      stream: p.stream || 'ALL',
      durationMinutes: p.durationMinutes || 60,
      totalMarks: p.totalMarks || 160,
      totalQuestions: p.totalQuestions || 40,
      subjects: p.subjects || ['Physics', 'Chemistry', 'Mathematics', 'Mental Ability'],
      active: p.active !== false,
      scheduledDate: p.scheduledDate || 'Live 24x7',
      createdAt: p.createdAt || '2026-09-01T00:00:00Z'
    }));

    // 5. Enrolled students attributed to RANKEX
    const enrolledStudents = allAdmissions.filter(a =>
      a.status === 'APPROVED' &&
      (a.admissionSource === 'RANKEX' ||
       (a.officeRemarks && a.officeRemarks.toUpperCase().includes('RANKEX')) ||
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
      scholarshipApplied: a.scholarshipEligibility || '75% (RANKEX)',
      batchName: a.batchName || 'Achiever Leader Batch 2026-27',
      admissionSource: 'RANKEX'
    }));

    return successResponse(res, 'RANKEX Command Center data retrieved', {
      selectedMonth: month,
      availableMonths,
      funnel: {
        signedUp: signedUpCount,
        paidOrScheduled: paidOrScheduledCount,
        attempted: attemptedCount,
        passed: passedCount,
        enrolled: enrolledStudents.length || enrolledCount
      },
      candidates,
      rankxPapers,
      enrolledStudents
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Create a new RANKEX Exam Paper Pattern (Admin)
 * Endpoint: POST /api/rankx/create-paper
 */
async function createRankXPaper(req, res, next) {
  try {
    const {
      title,
      stream = 'ALL',
      targetClass = 'Class 11',
      durationMinutes = 60,
      totalMarks = 160,
      totalQuestions = 40,
      subjects = ['Physics', 'Chemistry', 'Mathematics', 'Mental Ability'],
      makeActive = true
    } = req.body;

    if (!title) {
      return errorResponse(res, 'Paper title is required', 400);
    }

    const paperId = `test-rankex-${Date.now()}`;

    // If making active, deactivate other RankX papers
    if (makeActive) {
      const allExams = collections.exams.find({ category: 'RANKEX' });
      allExams.forEach(e => {
        collections.exams.findByIdAndUpdate(e.id, { active: false });
      });
    }

    const newPaper = collections.exams.create({
      id: paperId,
      category: 'RANKEX',
      title: title.trim(),
      examType: 'RANKEX',
      stream: String(stream).toUpperCase(),
      subject: 'FULL_MOCK',
      targetBatch: targetClass,
      durationMinutes: Number(durationMinutes) || 60,
      totalMarks: Number(totalMarks) || 160,
      totalQuestions: Number(totalQuestions) || 40,
      maxAttemptsAllowed: 30,
      subjects: Array.isArray(subjects) ? subjects : ['Physics', 'Chemistry', 'Mathematics', 'Mental Ability'],
      sectionsConfig: {
        General: {
          mandatory: true,
          marksPerCorrect: 4,
          negativeMarks: -1,
          type: 'MCQ'
        }
      },
      description: `Official RANKEX Talent Search & Scholarship Examination for ${targetClass} students.`,
      active: !!makeActive,
      isPublishedToStudents: true,
      scheduledDate: 'Live 24x7',
      patternType: 'SCHOLARSHIP_RANKEX',
      createdAt: new Date().toISOString()
    });

    return successResponse(res, 'New RANKEX Exam Paper created successfully', newPaper, 201);
  } catch (err) {
    next(err);
  }
}

/**
 * Set Active RANKEX Paper for Students (Admin)
 * Endpoint: PUT /api/rankx/set-active-paper/:id
 */
async function setActiveRankXPaper(req, res, next) {
  try {
    const { id } = req.params;
    const targetPaper = collections.exams.findById(id);

    if (!targetPaper) {
      return errorResponse(res, 'RANKEX paper not found', 404);
    }

    // Deactivate all other RankX papers
    const allExams = collections.exams.find({ category: 'RANKEX' });
    allExams.forEach(e => {
      collections.exams.findByIdAndUpdate(e.id, { active: e.id === id });
    });

    const updated = collections.exams.findByIdAndUpdate(id, { active: true });
    return successResponse(res, `RANKEX Paper "${updated.title}" is now active for all student tests!`, updated);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getCentres,
  registerRankX,
  getMyRankX,
  studentRankXLogin,
  studentRankXSignup,
  scheduleRankXSlot,
  checkRankXFeeStatus,
  getRankXNotifications,
  getRankXCommandCenterData,
  createRankXPaper,
  setActiveRankXPaper
};
