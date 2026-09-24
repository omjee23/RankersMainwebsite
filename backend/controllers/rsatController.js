const { collections } = require('../config/db');
const { successResponse, errorResponse } = require('../utils/apiResponse');

/**
 * Register for RSAT Online Scholarship Exam
 */
async function registerRSAT(req, res, next) {
  try {
    const studentId = req.user.id;
    const { targetClass, stream, schoolName } = req.body;

    const existing = collections.rsatRegistrations.findOne({ studentId });
    if (existing) {
      return successResponse(res, 'Already registered for RSAT', existing);
    }

    const regCount = collections.rsatRegistrations.countDocuments() + 1;
    const rollNumber = `RSAT-2026-${String(regCount).padStart(4, '0')}`;

    const registration = collections.rsatRegistrations.create({
      studentId,
      rollNumber,
      studentName: req.user.fullName,
      mobile: req.user.mobile,
      targetClass: targetClass || req.user.targetClass || 'Class 11',
      stream: stream || req.user.targetStream || 'NEET',
      schoolName: schoolName || '',
      status: 'ACTIVE',
      feePaid: 100, // Proposed RSAT fee
      examDurationMinutes: 60,
      registeredAt: new Date().toISOString()
    });

    return successResponse(res, 'RSAT Online Exam registration completed!', registration, 201);
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

module.exports = {
  registerRSAT,
  getMyRSAT
};
