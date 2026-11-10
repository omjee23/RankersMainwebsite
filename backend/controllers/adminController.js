const { collections } = require('../config/db');
const { successResponse, errorResponse } = require('../utils/apiResponse');

/**
 * Super Admin & Management Overview Statistics
 */
async function getDashboardStats(req, res, next) {
  try {
    const totalStudents = collections.users.countDocuments({ role: 'student' });
    const totalRankX = collections.rankXRegistrations.countDocuments();
    const totalRSAT = collections.rsatRegistrations.countDocuments();
    const totalSubmissions = collections.examSubmissions.countDocuments({ status: 'SUBMITTED' });

    // Admissions Pipeline
    const allAdmissions = collections.admissions ? collections.admissions.find() : [];
    const totalAdmissions = allAdmissions.length;
    const admissionsApproved = allAdmissions.filter(a => a.status === 'APPROVED' || a.feeStatus === 'PAID').length;
    const admissionsPending = allAdmissions.filter(a => a.status === 'PENDING').length;

    // Confirmed Classroom Students
    const enrolledUsers = collections.users.find({ role: 'student' }).filter(u => u.isEnrolled || (u.studentId && u.studentId.startsWith('Rankers@')));
    const totalEnrolled = enrolledUsers.length;

    // RSAT & RANKEX Cohort Conversion counts
    const rankXConverted = allAdmissions.filter(a => (a.admitCardRoll && a.admitCardRoll.includes('RPX')) || a.source === 'RANKEX' || a.scholarshipTest === 'RANKEX').length;
    const rsatConverted = allAdmissions.filter(a => (a.admitCardRoll && a.admitCardRoll.includes('RSAT')) || a.source === 'RSAT' || a.scholarshipTest === 'RSAT').length;

    // Revenue calculation
    const allPayments = collections.payments.find({ status: 'SUCCESS' });
    const totalRevenue = allPayments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
    const cashfreePayments = allPayments.filter(p => p.gateway === 'CASHFREE' || p.paymentMode === 'CASHFREE');
    const cashfreeRevenue = cashfreePayments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
    const cashfreeCount = cashfreePayments.length;

    // Centre capacities
    const centres = collections.centres.find();

    // Recent registrations
    const recentStudents = collections.users.find({ role: 'student' }).slice(-5).reverse();

    return successResponse(res, 'Dashboard statistics loaded', {
      totalStudents,
      totalRankX,
      totalRSAT,
      totalSubmissions,
      totalAdmissions,
      admissionsApproved,
      admissionsPending,
      totalEnrolled,
      rankXConverted,
      rsatConverted,
      totalRevenue,
      cashfreeRevenue,
      cashfreeCount,
      centres,
      recentStudents
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Get all students list with filtering
 */
async function getAllStudents(req, res, next) {
  try {
    const { search, targetStream, targetClass } = req.query;
    let students = collections.users.find({ role: 'student' });

    if (search) {
      const q = search.toLowerCase();
      students = students.filter(s =>
        (s.fullName && s.fullName.toLowerCase().includes(q)) ||
        (s.mobile && s.mobile.includes(q)) ||
        (s.email && s.email.toLowerCase().includes(q))
      );
    }

    if (targetStream) {
      students = students.filter(s => s.targetStream === targetStream);
    }

    if (targetClass) {
      students = students.filter(s => s.targetClass === targetClass);
    }

    return successResponse(res, 'Students retrieved', students.reverse());
  } catch (err) {
    next(err);
  }
}

/**
 * Add or update examination centre
 */
async function saveCentre(req, res, next) {
  try {
    const { id, name, address, city, state, capacity, active } = req.body;

    if (!name || !capacity) {
      return errorResponse(res, 'Centre name and capacity are required', 400);
    }

    let centre;
    if (id) {
      centre = collections.centres.findByIdAndUpdate(id, {
        name,
        address,
        city,
        state,
        capacity: Number(capacity),
        active: active !== undefined ? active : true
      });
    } else {
      centre = collections.centres.create({
        name,
        address: address || '',
        city: city || 'Indore',
        state: state || 'Madhya Pradesh',
        capacity: Number(capacity),
        registeredCount: 0,
        active: true
      });
    }

    return successResponse(res, 'Centre saved successfully', centre);
  } catch (err) {
    next(err);
  }
}

/**
 * Invigilator / Staff scans QR code to mark attendance at offline exam centre
 */
async function scanQRAttendance(req, res, next) {
  try {
    const { rollNumber } = req.body;

    if (!rollNumber) {
      return errorResponse(res, 'Roll number is required', 400);
    }

    const registration = collections.rankXRegistrations.findOne({ rollNumber: rollNumber.trim() });
    if (!registration) {
      return errorResponse(res, `No candidate found with roll number: ${rollNumber}`, 404);
    }

    if (registration.attendanceStatus === 'PRESENT') {
      return successResponse(res, `Candidate ${registration.studentName} is ALREADY marked present.`, {
        alreadyMarked: true,
        candidate: registration
      });
    }

    const updated = collections.rankXRegistrations.findByIdAndUpdate(registration.id, {
      attendanceStatus: 'PRESENT',
      attendanceMarkedAt: new Date().toISOString()
    });

    return successResponse(res, `Candidate ${registration.studentName} verified & marked PRESENT!`, {
      alreadyMarked: false,
      candidate: updated
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Get SMS logs
 */
async function getSmsLogs(req, res, next) {
  try {
    const logs = collections.smsLogs.find();
    return successResponse(res, 'SMS logs retrieved', logs.reverse());
  } catch (err) {
    next(err);
  }
}

/**
 * Get all Online CBT Exam Submissions & Results for Admin
 */
async function getExamSubmissions(req, res, next) {
  try {
    const { category, search, publishStatus, testId, examTitle } = req.query;
    let submissions = collections.examSubmissions.find();

    if (testId && testId !== 'ALL') {
      submissions = submissions.filter(s => s.testId === testId || s.examType === testId);
    }

    if (examTitle && examTitle !== 'ALL') {
      submissions = submissions.filter(s => s.examTitle && s.examTitle.toLowerCase() === examTitle.toLowerCase());
    }

    if (category && category !== 'ALL') {
      submissions = submissions.filter(s => {
        const subCat = s.category || (s.examType === 'RSAT' || (s.examTitle && s.examTitle.includes('RSAT')) ? 'RSAT' : (s.examType === 'RANKEX' || (s.examTitle && s.examTitle.includes('RANKEX')) ? 'RANKEX' : 'STUDENT_TEST_SERIES'));
        return subCat.toUpperCase() === category.toUpperCase();
      });
    }

    if (publishStatus && publishStatus !== 'ALL') {
      const wantPublished = publishStatus === 'PUBLISHED';
      submissions = submissions.filter(s => {
        const isPub = s.isPublished !== undefined ? s.isPublished : (s.category === 'RSAT');
        return isPub === wantPublished;
      });
    }

    if (search) {
      const q = search.toLowerCase();
      submissions = submissions.filter(s => 
        (s.studentName && s.studentName.toLowerCase().includes(q)) ||
        (s.mobile && s.mobile.includes(q)) ||
        (s.examTitle && s.examTitle.toLowerCase().includes(q)) ||
        (s.studentId && s.studentId.toLowerCase().includes(q))
      );
    }

    return successResponse(res, 'Exam submissions retrieved', submissions.reverse());
  } catch (err) {
    next(err);
  }
}

/**
 * Update Exam Submission (Edit marks, remarks, scholarship, or publish status)
 */
async function updateExamSubmission(req, res, next) {
  try {
    const { id } = req.params;
    const { score, maxMarks, percentage, percentile, scholarshipPercent, remarks, subjectBreakdown, isPublished } = req.body;
    const existing = collections.examSubmissions.findById(id);
    if (!existing) {
      return errorResponse(res, 'Submission not found', 404);
    }

    const updates = {};
    if (score !== undefined) updates.score = Number(score);
    if (maxMarks !== undefined) updates.maxMarks = Number(maxMarks);
    if (percentage !== undefined) updates.percentage = Number(percentage);
    if (percentile !== undefined) updates.percentile = Number(percentile);
    if (scholarshipPercent !== undefined) updates.scholarshipPercent = Number(scholarshipPercent);
    if (remarks !== undefined) updates.remarks = remarks;
    if (subjectBreakdown !== undefined) updates.subjectBreakdown = subjectBreakdown;
    if (isPublished !== undefined) updates.isPublished = Boolean(isPublished);

    const updated = collections.examSubmissions.findByIdAndUpdate(id, updates);
    return successResponse(res, 'Submission marks updated successfully', updated);
  } catch (err) {
    next(err);
  }
}

/**
 * Delete Exam Submission (Permanently remove invalid or duplicate test attempts)
 */
async function deleteExamSubmission(req, res, next) {
  try {
    const { id } = req.params;
    const existing = collections.examSubmissions.findById(id);
    if (!existing) {
      return errorResponse(res, 'Submission not found', 404);
    }
    collections.examSubmissions.deleteById(id);
    return successResponse(res, 'Submission deleted successfully', { id });
  } catch (err) {
    next(err);
  }
}

/**
 * Toggle Publish status of Submission ("Send to Student Panel")
 */
async function togglePublishSubmission(req, res, next) {
  try {
    const { id } = req.params;
    const existing = collections.examSubmissions.findById(id);
    if (!existing) {
      return errorResponse(res, 'Submission not found', 404);
    }
    const currentPub = existing.isPublished !== undefined ? existing.isPublished : (existing.category === 'RSAT');
    const newStatus = !currentPub;
    const updated = collections.examSubmissions.findByIdAndUpdate(id, {
      isPublished: newStatus,
      publishedAt: newStatus ? new Date().toISOString() : null
    });
    return successResponse(res, `Result ${newStatus ? 'Published to Student Panel' : 'Hidden from Student Panel'}`, updated);
  } catch (err) {
    next(err);
  }
}

/**
 * Bulk Publish Submissions to Student Panel
 */
async function bulkPublishSubmissions(req, res, next) {
  try {
    const { submissionIds, publish = true } = req.body;
    const ids = Array.isArray(submissionIds) && submissionIds.length > 0
      ? submissionIds
      : collections.examSubmissions.find().map(s => s.id);

    let count = 0;
    ids.forEach(id => {
      const item = collections.examSubmissions.findById(id);
      if (item) {
        collections.examSubmissions.findByIdAndUpdate(id, {
          isPublished: Boolean(publish),
          publishedAt: publish ? new Date().toISOString() : null
        });
        count++;
      }
    });
    return successResponse(res, `${count} results updated to ${publish ? 'Published to Student Panel' : 'Draft / Unpublished'}`);
  } catch (err) {
    next(err);
  }
}

async function getAllExamTests(req, res, next) {
  try {
    const { category, stream, batchTier, subject } = req.query;
    let tests = collections.exams.find();

    if (category && category !== 'ALL') {
      tests = tests.filter(t => (t.category || 'STUDENT_TEST_SERIES').toUpperCase() === category.toUpperCase());
    }
    if (stream && stream !== 'ALL') {
      tests = tests.filter(t => t.stream === 'ALL' || t.stream.toUpperCase() === stream.toUpperCase());
    }
    if (batchTier && batchTier !== 'ALL') {
      tests = tests.filter(t => t.batchTier === 'ALL' || (t.batchTier && t.batchTier.toUpperCase() === batchTier.toUpperCase()));
    }
    if (subject && subject !== 'ALL') {
      tests = tests.filter(t => t.subject === 'ALL' || (t.subject && t.subject.toUpperCase() === subject.toUpperCase()));
    }

    return successResponse(res, 'All tests retrieved', tests);
  } catch (err) {
    next(err);
  }
}

async function createExamTest(req, res, next) {
  try {
    const {
      title,
      category = 'STUDENT_TEST_SERIES',
      examType = 'JEE_MAIN',
      patternType,
      stream = 'JEE',
      subject = 'FULL_MOCK',
      batchTier = 'ALL',
      targetBatch = 'ALL',
      classLevel = 'Class 12',
      durationMinutes,
      totalMarks,
      totalQuestions: inputQuestions,
      subjects: inputSubjects,
      sectionsConfig,
      description,
      isPublishedToStudents = false,
      sendDirectlyToDirector = false,
      directorMobile = '9131435511',
      directorEmail = 'director@rankerspath.in'
    } = req.body;

    if (!title) {
      return errorResponse(res, 'Test title is required', 400);
    }

    let resolvedPattern = patternType;
    if (!resolvedPattern) {
      if (examType === 'JEE_ADVANCED') resolvedPattern = 'JEE_ADVANCED';
      else if (examType === 'NEET' || stream === 'NEET') resolvedPattern = 'NEET_UG';
      else if (examType === 'FOUNDATION' || stream === 'FOUNDATION') resolvedPattern = 'FOUNDATION_PNCF';
      else resolvedPattern = 'JEE_MAIN';
    }

    let defaultMarks = 300;
    let defaultMins = 180;
    let defaultQuestions = 90;
    let defaultSubjects = ['Physics', 'Chemistry', 'Mathematics'];
    let defaultSectionsConfig = sectionsConfig || null;

    if (resolvedPattern === 'JEE_ADVANCED') {
      defaultMarks = 180;
      defaultMins = 180;
      defaultQuestions = 48;
      defaultSubjects = ['Mathematics', 'Physics', 'Chemistry'];
      if (!defaultSectionsConfig) {
        defaultSectionsConfig = {
          'Section 1': { name: 'Single Correct MCQ', type: 'MCQ', questionsPerSub: 4, marksPerCorrect: 3, negativeMarks: -1 },
          'Section 2': { name: 'One or More Than One Correct', type: 'MULTI_CORRECT', questionsPerSub: 3, marksPerCorrect: 4, partial: true, negativeMarks: -2 },
          'Section 3': { name: 'Numerical Value / Range', type: 'NUMERICAL', questionsPerSub: 6, marksPerCorrect: 4, negativeMarks: 0, supportsRange: true },
          'Section 4': { name: 'Matching List Sets (Matrix Match)', type: 'MATCHING_LIST', questionsPerSub: 3, marksPerCorrect: 4, negativeMarks: -1 }
        };
      }
    } else if (resolvedPattern === 'NEET_UG' || examType === 'NEET') {
      defaultMarks = 720;
      defaultMins = 200;
      defaultQuestions = 200;
      defaultSubjects = ['Physics', 'Chemistry', 'Botany', 'Zoology'];
      if (!defaultSectionsConfig) {
        defaultSectionsConfig = {
          'Section A': { name: 'Mandatory MCQs', type: 'MCQ', questionsPerSub: 35, mandatory: true, marksPerCorrect: 4, negativeMarks: -1 },
          'Section B': { name: 'Optional MCQs (Attempt Any 10)', type: 'MCQ', questionsPerSub: 15, maxAttempts: 10, mandatory: false, marksPerCorrect: 4, negativeMarks: -1 }
        };
      }
    } else if (resolvedPattern === 'JEE_MAIN') {
      defaultMarks = 300;
      defaultMins = 180;
      defaultQuestions = 90;
      defaultSubjects = ['Mathematics', 'Physics', 'Chemistry'];
      if (!defaultSectionsConfig) {
        defaultSectionsConfig = {
          'Section A': { name: 'MCQ Single Correct', type: 'MCQ', questionsPerSub: 20, mandatory: true, marksPerCorrect: 4, negativeMarks: -1 },
          'Section B': { name: 'Numerical Answer Type (Attempt Any 5)', type: 'NUMERICAL', questionsPerSub: 10, maxAttempts: 5, mandatory: false, marksPerCorrect: 4, negativeMarks: -1, supportsRange: true }
        };
      }
    } else if (resolvedPattern === 'FOUNDATION_PNCF') {
      defaultMarks = 160;
      defaultMins = 90;
      defaultQuestions = 40;
      defaultSubjects = ['Physics', 'Chemistry', 'Biology', 'Mathematics', 'Mental Ability'];
    }

    if (subject !== 'FULL_MOCK' && subject !== 'ALL') {
      defaultSubjects = [subject];
      defaultMarks = defaultMarks > 200 ? 180 : defaultMarks;
      defaultMins = 60;
      defaultQuestions = 45;
    }

    const shareToken = `dir-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
    const initialApprovalStatus = isPublishedToStudents ? 'APPROVED' : 'PENDING';

    const newTest = collections.exams.create({
      id: `test-${category.toLowerCase().replace(/_/g, '-')}-${Date.now()}`,
      title,
      category,
      examType: resolvedPattern === 'JEE_ADVANCED' ? 'JEE_ADVANCED' : (resolvedPattern === 'NEET_UG' ? 'NEET' : (resolvedPattern === 'FOUNDATION_PNCF' ? 'FOUNDATION' : 'JEE_MAIN')),
      patternType: resolvedPattern,
      stream: category === 'RSAT' || category === 'RANKEX' ? 'ALL' : stream,
      subject,
      batchTier,
      targetBatch: targetBatch || `${batchTier} Batch`,
      classLevel: classLevel || 'Class 12',
      durationMinutes: Number(durationMinutes) || defaultMins,
      totalMarks: Number(totalMarks) || defaultMarks,
      totalQuestions: Number(inputQuestions) || defaultQuestions,
      subjects: Array.isArray(inputSubjects) && inputSubjects.length > 0 ? inputSubjects : defaultSubjects,
      sectionsConfig: defaultSectionsConfig,
      description: description || `${category} CBT Exam designed for ${stream} ${batchTier}`,
      active: true,
      isPublishedToStudents: Boolean(isPublishedToStudents),
      resultPublishedToStudents: false,
      directorApproval: {
        status: initialApprovalStatus,
        approvedAt: initialApprovalStatus === 'APPROVED' ? new Date().toISOString() : null,
        approvedBy: initialApprovalStatus === 'APPROVED' ? 'Admin Super-Override' : null,
        feedback: initialApprovalStatus === 'APPROVED' ? 'Approved upon creation' : 'Awaiting Director Review',
        shareToken,
        directorMobile,
        directorEmail
      },
      scheduledDate: 'Available Now'
    });

    return successResponse(res, 'Exam test created successfully', newTest, 201);
  } catch (err) {
    next(err);
  }
}

async function updateExamTest(req, res, next) {
  try {
    const { id } = req.params;
    const existing = collections.exams.findById(id);
    if (!existing) {
      return errorResponse(res, 'Test not found', 404);
    }
    const updated = collections.exams.findByIdAndUpdate(id, req.body);
    return successResponse(res, 'Test updated successfully', updated);
  } catch (err) {
    next(err);
  }
}

async function deleteExamTest(req, res, next) {
  try {
    const { id } = req.params;
    const existing = collections.exams.findById(id);
    if (!existing) {
      return errorResponse(res, 'Test not found', 404);
    }
    collections.exams.deleteById(id);
    return successResponse(res, 'Test deleted successfully', { id });
  } catch (err) {
    next(err);
  }
}

/**
 * Get all payment records for administrative fee & gateway reconciliation audit
 */
async function getAllPayments(req, res, next) {
  try {
    const { gateway, purpose } = req.query;
    let list = collections.payments.find();

    if (gateway && gateway !== 'ALL') {
      list = list.filter(p => (p.gateway || p.paymentMode || '').toUpperCase().includes(gateway.toUpperCase()));
    }

    if (purpose && purpose !== 'ALL') {
      list = list.filter(p => (p.purpose || '').toUpperCase().includes(purpose.toUpperCase()));
    }

    list = list.slice().reverse();

    return successResponse(res, 'Payments loaded successfully', {
      count: list.length,
      payments: list
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Generate Director WhatsApp and Email Dispatch links for paper approval
 */
async function sendExamToDirector(req, res, next) {
  try {
    const { id } = req.params;
    const { directorMobile = '9131435511', directorEmail = 'director@rankerspath.in', note = '' } = req.body;

    const test = collections.exams.findById(id);
    if (!test) {
      return errorResponse(res, 'Test not found', 404);
    }

    const shareToken = test.directorApproval?.shareToken || `dir-${Date.now().toString(36)}`;
    const updated = collections.exams.findByIdAndUpdate(id, {
      directorApproval: {
        ...(test.directorApproval || {}),
        status: test.directorApproval?.status === 'APPROVED' ? 'APPROVED' : 'PENDING',
        requestedAt: new Date().toISOString(),
        directorMobile,
        directorEmail,
        shareToken,
        note
      }
    });

    const portalUrl = `http://localhost:5174?directorToken=${shareToken}&testId=${test.id}`;

    const textMessage =
`*RANKERS PATH INDORE - TEST PAPER APPROVAL REQUEST*
Respected Director Sir,
A new Computer Based Test (CBT) has been scheduled by Academic Faculty for your review and authorization:

📝 *Test Title:* ${test.title}
🎯 *Exam Pattern:* ${test.patternType || test.examType}
⏱️ *Duration:* ${test.durationMinutes} Minutes
📊 *Total Marks:* ${test.totalMarks} Marks
📚 *Subjects:* ${(test.subjects || []).join(', ')}
👥 *Target Batch:* ${test.targetBatch || test.batchTier} (${test.classLevel || 'Class 12'})
📑 *Sections Breakdown:* ${test.sectionsConfig ? Object.keys(test.sectionsConfig).join(', ') : 'Standard Sections'}
${note ? `📌 *Faculty Note:* ${note}\n` : ''}
Please click below to review and 1-Click Approve this paper for student release:
👉 *Authorize on Admin Panel:* ${portalUrl}

--
Academic Head, Rankers Path Indore`;

    const cleanPhone = String(directorMobile).replace(/[^0-9]/g, '');
    const finalPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    const whatsappUrl = `https://wa.me/${finalPhone}?text=${encodeURIComponent(textMessage)}`;
    const mailtoUrl = `mailto:${directorEmail}?subject=${encodeURIComponent(`[APPROVAL REQUIRED] CBT Test: ${test.title}`)}&body=${encodeURIComponent(textMessage)}`;

    return successResponse(res, 'Director notification prepared successfully', {
      test: updated,
      whatsappUrl,
      mailtoUrl,
      textMessage,
      shareToken,
      portalUrl
    });
  } catch (err) {
    next(err);
  }
}

/**
 * 1-Click Approve Test Paper by Director
 */
async function approveExamTestByDirector(req, res, next) {
  try {
    const { id } = req.params;
    const { approvedBy = 'Academic Director', feedback = 'Approved for Student Portal CBT Session', publishToStudents = true } = req.body;

    const test = collections.exams.findById(id);
    if (!test) {
      return errorResponse(res, 'Test not found', 404);
    }

    const updated = collections.exams.findByIdAndUpdate(id, {
      directorApproval: {
        ...(test.directorApproval || {}),
        status: 'APPROVED',
        approvedAt: new Date().toISOString(),
        approvedBy,
        feedback
      },
      isPublishedToStudents: Boolean(publishToStudents)
    });

    return successResponse(res, `Test "${test.title}" approved by Director and published to Student Portal!`, updated);
  } catch (err) {
    next(err);
  }
}

/**
 * Toggle Live Result announcement for a specific exam
 */
async function togglePublishExamResults(req, res, next) {
  try {
    const { id } = req.params;
    const { live } = req.body;

    const test = collections.exams.findById(id);
    if (!test) {
      return errorResponse(res, 'Test not found', 404);
    }

    const currentLive = test.resultPublishedToStudents !== undefined ? test.resultPublishedToStudents : true;
    const newLive = live !== undefined ? Boolean(live) : !currentLive;

    const updatedTest = collections.exams.findByIdAndUpdate(id, {
      resultPublishedToStudents: newLive
    });

    // Update all matching student submissions
    const allSubs = collections.examSubmissions.find();
    let updatedSubCount = 0;
    allSubs.forEach(sub => {
      if (sub.testId === id || (test.title && sub.examTitle === test.title)) {
        collections.examSubmissions.findByIdAndUpdate(sub.id, {
          isPublished: newLive,
          publishedAt: newLive ? new Date().toISOString() : null
        });
        updatedSubCount++;
      }
    });

    return successResponse(res, `Results for "${test.title}" are now ${newLive ? 'LIVE on Student Portal' : 'HIDDEN from Student Portal'} (${updatedSubCount} student scorecards updated)`, {
      test: updatedTest,
      resultPublishedToStudents: newLive,
      updatedSubCount
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Detailed Student Participation & Attendance Ledger for a specific exam
 */
async function getExamParticipationReport(req, res, next) {
  try {
    const { id } = req.params;
    const test = collections.exams.findById(id);
    if (!test) {
      return errorResponse(res, 'Test not found', 404);
    }

    // 1. All student submissions for this test
    const allSubs = collections.examSubmissions.find();
    const attempted = allSubs
      .filter(s => s.testId === id || (test.title && s.examTitle === test.title))
      .sort((a, b) => (b.score || 0) - (a.score || 0));

    // Calculate rank for each attempted student
    attempted.forEach((sub, idx) => {
      sub.computedRank = idx + 1;
    });

    // 2. All enrolled students in database
    const allUsers = collections.users.find({ role: 'student' });
    
    // Filter matching target stream / batch if applicable
    let targetEnrolled = allUsers;
    if (test.stream && test.stream !== 'ALL') {
      targetEnrolled = allUsers.filter(u => !u.targetStream || u.targetStream === 'ALL' || u.targetStream.toUpperCase() === test.stream.toUpperCase());
    }

    const attemptedMobiles = new Set(attempted.map(s => s.mobile).filter(Boolean));
    const attemptedUserIds = new Set(attempted.map(s => s.studentId).filter(Boolean));

    const absentStudents = targetEnrolled.filter(u => {
      if (attemptedUserIds.has(u.id)) return false;
      if (u.mobile && attemptedMobiles.has(u.mobile)) return false;
      return true;
    }).map(u => ({
      id: u.id,
      fullName: u.fullName || 'Enrolled Student',
      mobile: u.mobile,
      email: u.email,
      targetStream: u.targetStream || test.stream,
      targetBatch: u.targetBatch || test.targetBatch,
      status: 'ABSENT'
    }));

    const totalEnrolled = attempted.length + absentStudents.length;
    const attendancePercentage = totalEnrolled > 0 ? Math.round((attempted.length / totalEnrolled) * 100) : 100;

    const scores = attempted.map(s => s.score || 0);
    const highestScore = scores.length > 0 ? Math.max(...scores) : 0;
    const lowestScore = scores.length > 0 ? Math.min(...scores) : 0;
    const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

    return successResponse(res, 'Exam participation report generated', {
      test,
      stats: {
        totalEnrolled,
        totalAttempted: attempted.length,
        totalAbsent: absentStudents.length,
        attendancePercentage,
        highestScore,
        lowestScore,
        avgScore,
        maxMarks: test.totalMarks,
        resultPublishedToStudents: test.resultPublishedToStudents !== false
      },
      attemptedStudents: attempted,
      absentStudents
    });
  } catch (err) {
    next(err);
  }
}

/**
 * 1-Click Director CSV/Excel Merit Sheet Exporter for a specific exam
 */
async function exportDirectorExamSheet(req, res, next) {
  try {
    const { id } = req.params;
    const test = collections.exams.findById(id);
    if (!test) {
      return errorResponse(res, 'Test not found', 404);
    }

    const allSubs = collections.examSubmissions.find();
    const attempted = allSubs
      .filter(s => s.testId === id || (test.title && s.examTitle === test.title))
      .sort((a, b) => (b.score || 0) - (a.score || 0));

    const csvRows = [];
    csvRows.push([
      'Rank',
      'Roll_Number',
      'Student_Name',
      'Mobile_Number',
      'Email',
      'Exam_Title',
      'Exam_Pattern',
      'Score_Obtained',
      'Maximum_Marks',
      'Percentage',
      'Percentile',
      'Correct_Questions',
      'Incorrect_Questions',
      'Unattempted',
      'Anti_Cheat_Switches',
      'Scholarship_Offered',
      'Submission_Time'
    ].join(','));

    attempted.forEach((sub, idx) => {
      csvRows.push([
        idx + 1,
        `"${sub.rollNumber || `RPX-${sub.id ? sub.id.slice(0, 6) : idx + 1}`}"`,
        `"${(sub.studentName || 'Student').replace(/"/g, '""')}"`,
        `"${sub.mobile || ''}"`,
        `"${sub.email || ''}"`,
        `"${(test.title || '').replace(/"/g, '""')}"`,
        `"${test.patternType || test.examType || 'CBT'}"`,
        sub.score || 0,
        sub.maxMarks || test.totalMarks || 300,
        `"${sub.percentage || 0}%"`,
        sub.percentile || 0,
        sub.correctCount || 0,
        sub.incorrectCount || 0,
        sub.unattemptedCount || 0,
        sub.tabSwitchCount || 0,
        `"${sub.scholarshipPercent || 0}%"`,
        `"${sub.submittedAt || new Date().toISOString()}"`
      ].join(','));
    });

    const bom = '\uFEFF';
    const csvContent = bom + csvRows.join('\r\n');
    const slug = (test.title || 'Exam').replace(/[^a-zA-Z0-9]/g, '_');
    const filename = `Director_Report_${slug}_${new Date().toISOString().split('T')[0]}.csv`;

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    return res.status(200).send(csvContent);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getDashboardStats,
  getAllStudents,
  getAllPayments,
  saveCentre,
  scanQRAttendance,
  getSmsLogs,
  getExamSubmissions,
  updateExamSubmission,
  deleteExamSubmission,
  togglePublishSubmission,
  bulkPublishSubmissions,
  getAllExamTests,
  createExamTest,
  updateExamTest,
  deleteExamTest,
  sendExamToDirector,
  approveExamTestByDirector,
  togglePublishExamResults,
  getExamParticipationReport,
  exportDirectorExamSheet
};
