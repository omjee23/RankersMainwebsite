const { collections } = require('../config/db');
const { jsonToCsv } = require('../utils/excelParser');

/**
 * Generate next formatted Application Number: RP-ADM-2026-XXXX
 */
function generateApplicationNumber() {
  const all = collections.admissions.find();
  const nextSeq = all.length + 101;
  const padded = String(nextSeq).padStart(4, '0');
  return `RP-ADM-2026-${padded}`;
}

/**
 * Public: Submit Admission Application Form
 */
async function submitAdmission(req, res, next) {
  try {
    const payload = req.body;
    let firstName = payload.firstName;
    let lastName = payload.lastName;

    if (!firstName && (payload.studentName || payload.fullName)) {
      const parts = (payload.studentName || payload.fullName).trim().split(/\s+/);
      firstName = parts[0];
      lastName = parts.slice(1).join(' ') || lastName || '';
    }

    const effectiveMobile = payload.studentMobile || payload.parentMobile || payload.mobile;

    if (!firstName || !effectiveMobile) {
      return res.status(400).json({
        success: false,
        message: 'First Name (or Full Name) and at least one Mobile number are mandatory.'
      });
    }

    const applicationNo = generateApplicationNumber();
    const today = new Date().toISOString().split('T')[0];

    const admissionRecord = {
      applicationNo,
      registrationNo: payload.registrationNo || '',
      receiptNo: payload.receiptNo || '',
      date: payload.date || today,
      photoUrl: payload.photoUrl || '',
      stream: payload.stream || 'NEET',
      targetClass: payload.targetClass || 'XI studying',
      
      // Personal Details
      firstName: (firstName || '').trim(),
      lastName: (lastName || '').trim(),
      studentName: `${(firstName || '').trim()} ${(lastName || '').trim()}`.trim(),
      fatherName: (payload.fatherName || '').trim(),
      motherName: (payload.motherName || '').trim(),
      fatherOccupation: (payload.fatherOccupation || '').trim(),
      motherOccupation: (payload.motherOccupation || '').trim(),
      dob: payload.dob || '',
      gender: payload.gender || 'Male',
      bloodGroup: payload.bloodGroup || '',
      category: payload.category || 'GEN',
      nationality: payload.nationality || 'Indian',
      aadharNo: (payload.aadharNo || '').replace(/\s+/g, ''),

      // Correspondence Address
      address: (payload.address || '').trim(),
      city: (payload.city || 'Indore').trim(),
      state: (payload.state || 'Madhya Pradesh').trim(),
      pin: (payload.pin || '').trim(),
      phoneResidence: payload.phoneResidence || '',
      phoneOffice: payload.phoneOffice || '',
      parentMobile: (payload.parentMobile || '').trim(),
      studentMobile: (payload.studentMobile || effectiveMobile || '').trim(),
      smsMobile: (payload.smsMobile || payload.studentMobile || effectiveMobile || '').trim(),
      email: (payload.email || '').trim().toLowerCase(),
      facebookId: payload.facebookId || '',
      twitterId: payload.twitterId || '',

      // Education Details
      studentClassCategory: payload.studentClassCategory || 'X passed / XI studying',
      schoolName: (payload.schoolName || '').trim(),
      marksX: payload.marksX || '',
      marksXII: payload.marksXII || '',
      gradeScience: payload.gradeScience || '',
      gradeMaths: payload.gradeMaths || '',
      examBoard: payload.examBoard || 'CBSE',
      scholarshipEligibility: payload.scholarshipEligibility || '0%',

      // Information Source
      source: payload.source || 'Website',

      // Sign-off & Consent
      place: (payload.place || 'Indore').trim(),
      studentSignatureName: payload.studentSignatureName || `${payload.firstName} ${payload.lastName}`.trim(),
      parentSignatureName: payload.parentSignatureName || payload.fatherName || 'Parent / Guardian',
      declarationAccepted: Boolean(payload.declarationAccepted),

      // Office Administration Fields
      status: 'PENDING', // PENDING, VERIFIED, APPROVED, FEE_PAID, REJECTED
      demandDraftNo: '',
      amount: '',
      drawnOn: '',
      centre: payload.centre || 'Vijay Nagar Main Campus',
      counsellorName: 'Admissions Desk',
      promotionsExecutive: '',
      feePaymentMode: 'Instalment',
      instalment1Paid: '',
      instalment2Paid: '',
      instalment3Paid: '',
      officeRemarks: 'Application submitted via Website Admission Portal.'
    };

    const savedDoc = collections.admissions.create(admissionRecord);

    return res.status(201).json({
      success: true,
      message: 'Admission form successfully submitted! Our counsellor will connect with you.',
      data: savedDoc
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Admin: Get all admission applications with filtering & search
 */
async function getAllAdmissions(req, res, next) {
  try {
    const { stream, status, search } = req.query;
    let list = collections.admissions.find();

    if (stream && stream !== 'ALL') {
      list = list.filter(item => item.stream === stream);
    }

    if (status && status !== 'ALL') {
      list = list.filter(item => item.status === status);
    }

    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(item => {
        const full = `${item.firstName || ''} ${item.lastName || ''} ${item.applicationNo || ''} ${item.studentMobile || ''} ${item.parentMobile || ''} ${item.city || ''} ${item.registrationNo || ''}`.toLowerCase();
        return full.includes(q);
      });
    }

    // Sort descending by creation date
    list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return res.json({
      success: true,
      count: list.length,
      data: list
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Admin: Get single admission by ID
 */
async function getAdmissionById(req, res, next) {
  try {
    const { id } = req.params;
    const doc = collections.admissions.findById(id);
    if (!doc) {
      return res.status(404).json({ success: false, message: 'Admission application not found' });
    }
    return res.json({ success: true, data: doc });
  } catch (err) {
    next(err);
  }
}

/**
 * Admin: Update admission status & office administration details
 */
async function updateAdmission(req, res, next) {
  try {
    const { id } = req.params;
    const updates = req.body;

    const existing = collections.admissions.findById(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Admission application not found' });
    }

    const updated = collections.admissions.findByIdAndUpdate(id, updates);
    return res.json({
      success: true,
      message: 'Admission details updated successfully',
      data: updated
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Admin: Delete admission application
 */
async function deleteAdmission(req, res, next) {
  try {
    const { id } = req.params;
    const success = collections.admissions.deleteById(id);
    if (!success) {
      return res.status(404).json({ success: false, message: 'Admission application not found' });
    }
    return res.json({ success: true, message: 'Admission record deleted successfully' });
  } catch (err) {
    next(err);
  }
}

/**
 * Admin: Export All Admissions to Excel (CSV with UTF-8 BOM)
 */
async function exportAdmissionsCsv(req, res, next) {
  try {
    const { stream, status } = req.query;
    let list = collections.admissions.find();

    if (stream && stream !== 'ALL') {
      list = list.filter(item => item.stream === stream);
    }
    if (status && status !== 'ALL') {
      list = list.filter(item => item.status === status);
    }

    list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Flatten / map records to friendly Excel columns
    const exportRows = list.map(item => ({
      'Application No': item.applicationNo || '',
      'Date of Submission': (item.createdAt || '').slice(0, 10),
      'Status': item.status || 'PENDING',
      'Target Stream': item.stream || '',
      'Target Class': item.targetClass || '',
      'Student Name': `${item.firstName || ''} ${item.lastName || ''}`.trim(),
      'Gender': item.gender || '',
      'Date of Birth': item.dob || '',
      'Category': item.category || '',
      'Blood Group': item.bloodGroup || '',
      'Aadhar No': item.aadharNo || '',
      'Father Name': item.fatherName || '',
      'Mother Name': item.motherName || '',
      'Father Occupation': item.fatherOccupation || '',
      'Mother Occupation': item.motherOccupation || '',
      'Student Mobile': item.studentMobile || '',
      'Parent Mobile': item.parentMobile || '',
      'Email ID': item.email || '',
      'Address': item.address || '',
      'City': item.city || '',
      'State': item.state || '',
      'PIN Code': item.pin || '',
      'School / College': item.schoolName || '',
      '10th Board Marks (%)': item.marksX || '',
      '12th Board Marks (%)': item.marksXII || '',
      '10th Grade Science': item.gradeScience || '',
      '10th Grade Maths': item.gradeMaths || '',
      'Board of Exam': item.examBoard || '',
      'Scholarship Eligibility': item.scholarshipEligibility || '',
      'How they knew RP': item.source || '',
      'Office Reg No': item.registrationNo || '',
      'Office Receipt No': item.receiptNo || '',
      'Centre': item.centre || '',
      'Fee Mode': item.feePaymentMode || '',
      'Instalment 1': item.instalment1Paid || '',
      'Instalment 2': item.instalment2Paid || '',
      'Counsellor': item.counsellorName || '',
      'Promotions Exec': item.promotionsExecutive || '',
      'Office Remarks': item.officeRemarks || ''
    }));

    const csvBody = jsonToCsv(exportRows);
    // Add UTF-8 BOM (\uFEFF) so Excel on Windows/Mac opens without mojibake/encoding issues
    const csvWithBom = '\uFEFF' + csvBody;

    const filename = `RankersPath_Admissions_${Date.now()}.csv`;
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    return res.status(200).send(csvWithBom);
  } catch (err) {
    next(err);
  }
}

/**
 * Admin: Generate Student ID (Rankers@XXXX) and Password & Enrol Student
 * Endpoint: POST /api/admissions/:id/generate-credentials
 */
async function generateStudentCredentials(req, res, next) {
  try {
    const { id } = req.params;
    const admission = collections.admissions.findById(id);

    if (!admission) {
      return res.status(404).json({ success: false, message: 'Admission application not found' });
    }

    // Determine next sequential Student ID: Rankers@XXXX
    let studentId = (req.body.studentId || '').trim();

    if (!studentId) {
      // Find highest existing sequence
      let maxSeq = 1000;
      const allAdmissions = collections.admissions.find();
      const allUsers = collections.users.find();

      const checkItem = (item) => {
        if (!item) return;
        const sId = item.studentId || item.rollNumber;
        if (sId) {
          const match = String(sId).match(/Rankers@(\d+)/i);
          if (match && match[1]) {
            const num = parseInt(match[1], 10);
            if (!isNaN(num) && num > maxSeq) maxSeq = num;
          }
        }
      };

      allAdmissions.forEach(checkItem);
      allUsers.forEach(checkItem);

      studentId = `Rankers@${maxSeq + 1}`;
    }

    const seqNum = studentId.replace(/\D/g, '') || '2026';
    const password = (req.body.password || `Rankers#${seqNum}`).trim();
    const studentName = `${admission.firstName || ''} ${admission.lastName || ''}`.trim() || 'Admitted Student';
    const studentMobile = admission.studentMobile || admission.parentMobile || '';

    // Update Admission Record
    const updatedAdm = collections.admissions.findByIdAndUpdate(id, {
      status: 'APPROVED',
      isEnrolled: true,
      studentId,
      studentPassword: password,
      enrolledAt: new Date().toISOString()
    });

    // Create or Update User in users collection
    let user = collections.users.findOne({ studentId });
    if (!user && studentMobile) {
      user = collections.users.findOne({ mobile: studentMobile });
    }

    if (user) {
      user = collections.users.findByIdAndUpdate(user.id, {
        fullName: studentName,
        mobile: studentMobile,
        email: admission.email || user.email,
        role: 'student',
        isEnrolled: true,
        studentId,
        password: password,
        targetClass: admission.targetClass || user.targetClass,
        targetStream: admission.stream || user.targetStream,
        centreName: admission.centre || user.centreName || 'Vijay Nagar Main Campus',
        admissionNo: admission.applicationNo,
        batchName: `${admission.stream || 'NEET'} Achiever Batch 2026-27`
      });
    } else {
      user = collections.users.create({
        fullName: studentName,
        mobile: studentMobile,
        email: admission.email || '',
        role: 'student',
        isEnrolled: true,
        studentId,
        password: password,
        targetClass: admission.targetClass || 'Class 11',
        targetStream: admission.stream || 'NEET',
        centreName: admission.centre || 'Vijay Nagar Main Campus',
        admissionNo: admission.applicationNo,
        batchName: `${admission.stream || 'NEET'} Achiever Batch 2026-27`,
        verifiedAt: new Date().toISOString()
      });
    }

    return res.json({
      success: true,
      message: `Student credentials generated successfully! Student ID: ${studentId}`,
      data: {
        admissionId: admission.id,
        applicationNo: admission.applicationNo,
        studentId,
        password,
        studentName,
        mobile: studentMobile,
        stream: admission.stream,
        targetClass: admission.targetClass,
        centre: admission.centre
      }
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  submitAdmission,
  getAllAdmissions,
  getAdmissionById,
  updateAdmission,
  deleteAdmission,
  exportAdmissionsCsv,
  generateStudentCredentials
};
