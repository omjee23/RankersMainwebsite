const { collections } = require('../config/db');
const { generateAdmitCardQR } = require('../services/qrCodeService');
const { successResponse, errorResponse } = require('../utils/apiResponse');

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
    const studentId = req.user.id;
    const {
      studentName,
      fatherName,
      mobile,
      targetClass,
      stream,
      schoolName,
      centreId,
      city
    } = req.body;

    if (!centreId || !targetClass || !stream) {
      return errorResponse(res, 'Please provide all mandatory details (Class, Stream, Exam Centre)', 400);
    }

    // Check centre capacity
    const centre = collections.centres.findById(centreId);
    if (!centre) {
      return errorResponse(res, 'Selected examination centre does not exist', 404);
    }

    if (centre.registeredCount >= centre.capacity) {
      return errorResponse(res, 'This centre is at full capacity. Please choose another centre.', 400);
    }

    // Check if already registered
    const existing = collections.rankXRegistrations.findOne({ studentId });
    if (existing) {
      return successResponse(res, 'You are already registered for RankX', existing);
    }

    // Generate Unique Roll Number: RPX-2026-0001
    const totalRegs = collections.rankXRegistrations.countDocuments() + 1;
    const rollNumber = `RPX-2026-${String(totalRegs).padStart(4, '0')}`;

    // Generate QR Code data for Admit Card
    const qrPayload = {
      rollNumber,
      studentName: studentName || req.user.fullName,
      stream,
      centreName: centre.name,
      verified: true
    };
    const qrCodeDataUrl = await generateAdmitCardQR(qrPayload);

    // Create registration
    const registration = collections.rankXRegistrations.create({
      studentId,
      rollNumber,
      studentName: studentName || req.user.fullName,
      fatherName: fatherName || '',
      mobile: mobile || req.user.mobile,
      targetClass,
      stream,
      schoolName: schoolName || '',
      centreId: centre.id,
      centreName: centre.name,
      centreAddress: centre.address,
      city: city || centre.city,
      examDate: 'Sunday, 18 October 2026',
      examTiming: '10:00 AM – 11:30 AM',
      reportingTime: '09:15 AM',
      qrCodeDataUrl,
      paymentStatus: 'PAID_OR_WAIVED',
      attendanceStatus: 'PENDING', // PENDING or PRESENT
      score: null,
      rank: null,
      scholarshipPercent: null
    });

    // Update centre registration count
    collections.centres.findByIdAndUpdate(centre.id, {
      registeredCount: (centre.registeredCount || 0) + 1
    });

    return successResponse(res, 'RankX registration completed successfully!', registration, 201);
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
    const registration = collections.rankXRegistrations.findOne({ studentId });

    if (!registration) {
      return successResponse(res, 'No RankX registration found for this account', null);
    }

    return successResponse(res, 'RankX registration details retrieved', registration);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getCentres,
  registerRankX,
  getMyRankX
};
