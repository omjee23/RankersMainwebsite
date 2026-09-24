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

    // Revenue calculation
    const allPayments = collections.payments.find({ status: 'SUCCESS' });
    const totalRevenue = allPayments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

    // Centre capacities
    const centres = collections.centres.find();

    // Recent registrations
    const recentStudents = collections.users.find({ role: 'student' }).slice(-5).reverse();

    return successResponse(res, 'Dashboard statistics loaded', {
      totalStudents,
      totalRankX,
      totalRSAT,
      totalSubmissions,
      totalRevenue,
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
    const submissions = collections.examSubmissions.find();
    return successResponse(res, 'Exam submissions retrieved', submissions.reverse());
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getDashboardStats,
  getAllStudents,
  saveCentre,
  scanQRAttendance,
  getSmsLogs,
  getExamSubmissions
};
