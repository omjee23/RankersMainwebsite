const bcrypt = require('bcryptjs');
const { collections } = require('../config/db');

async function seedThreeAccounts() {
  console.log('Seeding 3 pristine demo accounts...');
  const passwordHash = await bcrypt.hash('Student@123', 10);

  // ==========================================
  // 1. RSAT DEMO STUDENT
  // ==========================================
  const rsatEmail = 'rsat.student@rankerspath.in';
  const rsatMobile = '9826111111';
  let rsatUser = collections.users.findOne({ email: rsatEmail }) || collections.users.findOne({ mobile: rsatMobile });

  if (rsatUser) {
    collections.users.findByIdAndUpdate(rsatUser.id, {
      fullName: 'Aarav Sharma (RSAT)',
      email: rsatEmail,
      mobile: rsatMobile,
      password: passwordHash,
      role: 'student',
      targetStream: 'NEET',
      targetClass: 'Class 11',
      originExam: 'RSAT'
    });
    rsatUser = collections.users.findById(rsatUser.id);
  } else {
    rsatUser = collections.users.create({
      fullName: 'Aarav Sharma (RSAT)',
      email: rsatEmail,
      mobile: rsatMobile,
      password: passwordHash,
      role: 'student',
      targetStream: 'NEET',
      targetClass: 'Class 11',
      originExam: 'RSAT'
    });
  }

  // RSAT Registration Record
  let rsatReg = collections.rsatRegistrations.findOne({ studentId: rsatUser.id }) ||
                collections.rsatRegistrations.findOne({ mobile: rsatMobile });
  const rsatPayload = {
    studentId: rsatUser.id,
    rollNumber: 'RSAT-2026-1001',
    studentName: 'Aarav Sharma',
    mobile: rsatMobile,
    email: rsatEmail,
    targetClass: 'Class 11',
    stream: 'NEET',
    schoolName: 'Delhi Public School, Indore',
    preferredCentre: 'Vijay Nagar Main Campus',
    funnelStatus: '2_FEE_PAID_SLOT_CONFIRMED',
    status: 'ACTIVE',
    paymentStatus: 'PAID',
    feePaid: 100,
    transactionId: 'TXN-RSAT-DEMO-01',
    orderId: 'ORDER-RSAT-1001',
    scheduledDate: '2026-11-15',
    scheduledTimeSlot: '10:00 AM - 11:00 AM',
    examMode: 'ONLINE'
  };

  if (rsatReg) {
    collections.rsatRegistrations.findByIdAndUpdate(rsatReg.id, rsatPayload);
  } else {
    collections.rsatRegistrations.create(rsatPayload);
  }

  // ==========================================
  // 2. RANKEX DEMO STUDENT
  // ==========================================
  const rankxEmail = 'rankex.student@rankerspath.in';
  const rankxMobile = '9826222222';
  let rankxUser = collections.users.findOne({ email: rankxEmail }) || collections.users.findOne({ mobile: rankxMobile });

  if (rankxUser) {
    collections.users.findByIdAndUpdate(rankxUser.id, {
      fullName: 'Rohan Verma (RANKEX)',
      email: rankxEmail,
      mobile: rankxMobile,
      password: passwordHash,
      role: 'student',
      targetStream: 'JEE',
      targetClass: 'Class 12',
      originExam: 'RANKEX'
    });
    rankxUser = collections.users.findById(rankxUser.id);
  } else {
    rankxUser = collections.users.create({
      fullName: 'Rohan Verma (RANKEX)',
      email: rankxEmail,
      mobile: rankxMobile,
      password: passwordHash,
      role: 'student',
      targetStream: 'JEE',
      targetClass: 'Class 12',
      originExam: 'RANKEX'
    });
  }

  // RANKEX Registration Record
  let rankxReg = collections.rankXRegistrations.findOne({ studentId: rankxUser.id }) ||
                 collections.rankXRegistrations.findOne({ mobile: rankxMobile });
  const rankxPayload = {
    studentId: rankxUser.id,
    rollNumber: 'RPX-2027-2001',
    studentName: 'Rohan Verma',
    mobile: rankxMobile,
    email: rankxEmail,
    targetClass: 'Class 12',
    stream: 'JEE',
    schoolName: 'Choithram International School, Indore',
    funnelStatus: '2_FEE_PAID_SLOT_CONFIRMED',
    paymentStatus: 'PAID',
    attendanceStatus: 'REGISTERED',
    feePaid: 100,
    examMode: 'ONLINE',
    centreName: 'Vijay Nagar Main Campus, Indore',
    orderId: 'ORDER-RANKEX-2001',
    transactionId: 'TXN-RANKEX-DEMO-02'
  };

  if (rankxReg) {
    collections.rankXRegistrations.findByIdAndUpdate(rankxReg.id, rankxPayload);
  } else {
    collections.rankXRegistrations.create(rankxPayload);
  }

  // ==========================================
  // 3. ADMISSION ENROLLED STUDENT
  // ==========================================
  const admEmail = 'admission.student@rankerspath.in';
  const admMobile = '9826333333';
  const studentId = 'Rankers@1001';
  let admUser = collections.users.findOne({ studentId }) || collections.users.findOne({ email: admEmail });

  const admUserData = {
    fullName: 'Priya Patel (Enrolled)',
    email: admEmail,
    mobile: admMobile,
    studentId: studentId,
    password: passwordHash,
    role: 'student',
    isEnrolled: true,
    targetStream: 'NEET',
    targetClass: 'Class 11',
    centreName: 'Vijay Nagar Main Campus',
    batchName: 'NEET Achiever Batch 2026-27',
    admissionNo: 'ADM-2026-1001'
  };

  if (admUser) {
    collections.users.findByIdAndUpdate(admUser.id, admUserData);
    admUser = collections.users.findById(admUser.id);
  } else {
    admUser = collections.users.create(admUserData);
  }

  // Admission Collection Record
  let admRecord = collections.admissions.findOne({ studentId: studentId }) ||
                  collections.admissions.findOne({ applicationNo: 'ADM-2026-1001' });
  const admPayload = {
    applicationNo: 'ADM-2026-1001',
    studentId: studentId,
    studentPassword: 'Student@123',
    firstName: 'Priya',
    lastName: 'Patel',
    studentName: 'Priya Patel',
    fatherName: 'Rajesh Patel',
    motherName: 'Sunita Patel',
    studentMobile: admMobile,
    parentMobile: '9826333334',
    email: admEmail,
    stream: 'NEET',
    targetClass: 'XI studying',
    centre: 'Vijay Nagar Main Campus',
    status: 'APPROVED',
    approvalStatus: 'APPROVED',
    scholarshipPercent: 50,
    tuitionFeeDiscount: 55000,
    finalTuitionFee: 55000,
    receiptNo: 'RPX-REC-2026-001',
    registrationNo: 'ADM-2026-1001',
    admittedAt: new Date().toISOString()
  };

  if (admRecord) {
    collections.admissions.findByIdAndUpdate(admRecord.id, admPayload);
  } else {
    collections.admissions.create(admPayload);
  }

  console.log('✅ Successfully seeded 3 demo accounts!');
  console.log('1. RSAT Student:', rsatEmail, '| Password: Student@123 | Roll:', 'RSAT-2026-1001');
  console.log('2. RANKEX Student:', rankxEmail, '| Password: Student@123 | Roll:', 'RPX-2027-2001');
  console.log('3. Enrolled Student:', studentId, '| Password: Student@123 | Name: Priya Patel');
}

seedThreeAccounts().catch(console.error);
