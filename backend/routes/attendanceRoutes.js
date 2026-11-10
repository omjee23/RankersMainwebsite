const express = require('express');
const router = express.Router();
const { collections } = require('../config/db');
const { successResponse, errorResponse } = require('../utils/apiResponse');
const { optionalAuthMiddleware } = require('../middlewares/authMiddleware');

/**
 * Biometric Machine Push / Webhook Receiver
 * Compatible with eSSL, Realtime, ZKTeco, Mantra, Matrix & Hikvision cloud devices
 * POST /api/attendance/biometric-punch
 */
router.post('/biometric-punch', (req, res) => {
  try {
    const {
      deviceId = 'RP-BIO-VIJAY-NAGAR-01',
      enrollId,
      userId,
      cardNo,
      punchTime,
      punchType = 'IN', // 'IN' or 'OUT'
      machineIp,
      location = 'Vijay Nagar Main Campus, Indore'
    } = req.body;

    const studentIdentifier = String(enrollId || userId || cardNo || '').trim();

    if (!studentIdentifier) {
      return errorResponse(res, 'enrollId or userId is required from biometric device', 400);
    }

    const now = new Date();
    const punchDateStr = (punchTime ? new Date(punchTime) : now).toISOString().split('T')[0];
    const timeFormatted = (punchTime ? new Date(punchTime) : now).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    // 1. Find matching student across users, rankXRegistrations or admissions
    const users = collections.users.find();
    let matchedStudent = users.find(u => 
      u.id === studentIdentifier ||
      (u.mobile && u.mobile.includes(studentIdentifier)) ||
      (u.rollNumber && u.rollNumber.toLowerCase() === studentIdentifier.toLowerCase())
    );

    if (!matchedStudent) {
      const rankx = collections.rankXRegistrations.find();
      const matchedRankx = rankx.find(r => 
        (r.rollNumber && r.rollNumber.toLowerCase() === studentIdentifier.toLowerCase()) ||
        (r.mobile && r.mobile.includes(studentIdentifier)) ||
        r.id === studentIdentifier
      );
      if (matchedRankx) {
        matchedStudent = {
          id: matchedRankx.id,
          fullName: matchedRankx.studentName,
          mobile: matchedRankx.mobile,
          targetClass: matchedRankx.targetClass,
          targetStream: matchedRankx.stream
        };
      }
    }

    const studentName = matchedStudent ? matchedStudent.fullName : `Student (${studentIdentifier})`;
    const studentMobile = matchedStudent ? matchedStudent.mobile : '';
    const studentBatch = matchedStudent ? `${matchedStudent.targetClass || 'Class 11'} ${matchedStudent.targetStream || 'JEE'}` : 'Indore Classroom Batch';
    const finalStudentId = matchedStudent ? matchedStudent.id : studentIdentifier;

    // 2. Check if attendance already exists for today
    const existing = collections.attendance.findOne({
      studentId: finalStudentId,
      date: punchDateStr
    });

    let record;
    if (existing) {
      // Update outTime
      record = collections.attendance.findByIdAndUpdate(existing.id, {
        outTime: timeFormatted,
        lastPunchTime: punchTime || now.toISOString(),
        punchType: 'OUT',
        status: 'PRESENT',
        deviceLocation: location
      });
    } else {
      // First punch of the day: InTime
      record = collections.attendance.create({
        studentId: finalStudentId,
        studentName,
        mobile: studentMobile,
        batchTier: studentBatch,
        date: punchDateStr,
        inTime: timeFormatted,
        outTime: null,
        status: 'PRESENT',
        punchSource: 'BIOMETRIC_FINGERPRINT',
        deviceId,
        deviceLocation: location,
        lastPunchTime: punchTime || now.toISOString(),
        parentAlertSent: false
      });
    }

    // Generate WhatsApp Parent notification format
    const whatsappParentAlert = `https://wa.me/91${studentMobile}?text=${encodeURIComponent(
      `Dear Parent, your ward ${studentName} has punched IN at Rankers Path (Vijay Nagar Centre) at ${timeFormatted} on ${punchDateStr}. Have a great learning session!`
    )}`;

    return successResponse(res, `Biometric attendance recorded for ${studentName}`, {
      record,
      studentName,
      inTime: record.inTime,
      outTime: record.outTime,
      status: record.status,
      whatsappParentAlert: studentMobile ? whatsappParentAlert : null
    });
  } catch (err) {
    return errorResponse(res, `Biometric sync error: ${err.message}`, 500);
  }
});

/**
 * Get Today's Classroom Attendance Overview
 * GET /api/attendance/today
 */
router.get('/today', (req, res) => {
  try {
    const todayStr = new Date().toISOString().split('T')[0];
    const users = collections.users.find({ role: 'student' });
    const allTodayRecords = collections.attendance.find({ date: todayStr });

    const presentMap = new Map();
    allTodayRecords.forEach(r => presentMap.set(r.studentId, r));

    const totalEnrolled = users.length > 0 ? users.length : 15;
    const presentList = [];
    const absentList = [];

    users.forEach(student => {
      const record = presentMap.get(student.id);
      if (record) {
        presentList.push(record);
      } else {
        absentList.push({
          studentId: student.id,
          studentName: student.fullName,
          mobile: student.mobile,
          targetClass: student.targetClass || 'Class 11',
          targetStream: student.targetStream || 'JEE',
          status: 'ABSENT',
          date: todayStr,
          whatsappAbsentAlert: student.mobile
            ? `https://wa.me/91${student.mobile}?text=${encodeURIComponent(
                `🚨 Rankers Path Centre Alert: Dear Parent, your ward ${student.fullName} has NOT punched in for today's classroom lectures at Vijay Nagar Centre (${todayStr}). Please contact 9131435511 for queries.`
              )}`
            : null
        });
      }
    });

    const totalPresent = presentList.length;
    const totalAbsent = absentList.length;
    const attendancePercentage = totalEnrolled > 0 ? Math.round((totalPresent / totalEnrolled) * 100) : 0;

    return successResponse(res, "Today's attendance retrieved", {
      date: todayStr,
      totalEnrolled,
      totalPresent,
      totalAbsent,
      attendancePercentage,
      presentList,
      absentList,
      biometricStatus: {
        deviceOnline: true,
        deviceName: 'eSSL SilkBio-101 / Realtime 4K Biometric Hub',
        location: '9HQ City Walk, Block A, 129, Vijay Nagar, Indore',
        lastSync: new Date().toLocaleTimeString('en-IN')
      }
    });
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
});

/**
 * Get Filtered Attendance Logs
 * GET /api/attendance/logs
 */
router.get('/logs', (req, res) => {
  try {
    const { date, batch, status, search } = req.query;
    let records = collections.attendance.find();

    if (date) {
      records = records.filter(r => r.date === date);
    }
    if (batch && batch !== 'ALL') {
      records = records.filter(r => r.batchTier && r.batchTier.toLowerCase().includes(batch.toLowerCase()));
    }
    if (status && status !== 'ALL') {
      records = records.filter(r => r.status === status);
    }
    if (search) {
      const q = search.toLowerCase();
      records = records.filter(r => 
        (r.studentName && r.studentName.toLowerCase().includes(q)) ||
        (r.mobile && r.mobile.includes(q)) ||
        (r.studentId && r.studentId.toLowerCase().includes(q))
      );
    }

    return successResponse(res, 'Attendance logs retrieved', records.reverse());
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
});

/**
 * Manual Attendance Mark / Correction by Faculty / Admin
 * POST /api/attendance/manual-mark
 */
router.post('/manual-mark', (req, res) => {
  try {
    const { studentId, studentName, mobile, batchTier, status = 'PRESENT', date, remark } = req.body;
    const targetDate = date || new Date().toISOString().split('T')[0];
    const timeFormatted = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

    const existing = collections.attendance.findOne({ studentId, date: targetDate });
    let record;
    if (existing) {
      record = collections.attendance.findByIdAndUpdate(existing.id, {
        status,
        remark: remark || 'Manual update by Admin',
        updatedAt: new Date().toISOString()
      });
    } else {
      record = collections.attendance.create({
        studentId,
        studentName: studentName || 'Classroom Student',
        mobile: mobile || '',
        batchTier: batchTier || 'Class 11 JEE',
        date: targetDate,
        inTime: status === 'PRESENT' ? timeFormatted : null,
        outTime: null,
        status,
        punchSource: 'MANUAL_ADMIN_ENTRY',
        remark: remark || 'Marked by Faculty / Admin'
      });
    }

    return successResponse(res, `Attendance marked as ${status}`, record);
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
});

/**
 * Student's Personal Attendance Dashboard Stats
 * GET /api/attendance/student/:studentId
 */
router.get('/student/:studentId', (req, res) => {
  try {
    const { studentId } = req.params;
    const logs = collections.attendance.find({ studentId });

    const totalDaysHeld = Math.max(logs.length, 24); // default working days baseline
    const presentDays = logs.filter(l => l.status === 'PRESENT').length;
    const absentDays = logs.filter(l => l.status === 'ABSENT').length;
    const attendancePct = totalDaysHeld > 0 ? Math.round((presentDays / totalDaysHeld) * 100) : 95;

    return successResponse(res, 'Student attendance summary retrieved', {
      studentId,
      attendancePercentage: attendancePct,
      totalDaysHeld,
      presentDays,
      absentDays,
      recentLogs: logs.slice(-10).reverse()
    });
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
});

/**
 * Director Monthly Attendance Sheet CSV Export
 * GET /api/attendance/export-csv
 */
router.get('/export-csv', (req, res) => {
  try {
    const logs = collections.attendance.find();
    let csv = 'Date,Student_ID,Student_Name,Mobile,Batch_Tier,In_Time,Out_Time,Status,Punch_Source,Location\n';

    logs.forEach(l => {
      csv += `"${l.date || ''}","${l.studentId || ''}","${(l.studentName || '').replace(/"/g, '""')}","${l.mobile || ''}","${l.batchTier || ''}","${l.inTime || ''}","${l.outTime || ''}","${l.status || ''}","${l.punchSource || ''}","${l.deviceLocation || ''}"\n`;
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="rankers_path_biometric_attendance_ledger.csv"');
    return res.status(200).send(csv);
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
});

module.exports = router;
