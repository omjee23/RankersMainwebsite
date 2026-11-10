const { collections, initializeDatabase } = require('../config/db');

async function seedAttendance() {
  await initializeDatabase();

  const todayStr = new Date().toISOString().split('T')[0];
  const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  const sampleLogs = [
    {
      studentId: 'student-aarav-sharma',
      studentName: 'Aarav Sharma',
      mobile: '9826012345',
      batchTier: 'Super-30 Class 12th JEE',
      date: todayStr,
      inTime: '08:05 AM',
      outTime: '01:30 PM',
      status: 'PRESENT',
      punchSource: 'BIOMETRIC_FINGERPRINT',
      deviceId: 'RP-BIO-VIJAY-NAGAR-01',
      deviceLocation: 'Vijay Nagar Main Campus, Indore'
    },
    {
      studentId: 'student-ananya-verma',
      studentName: 'Ananya Verma',
      mobile: '9826023456',
      batchTier: 'Leader NEET-UG 2026',
      date: todayStr,
      inTime: '08:12 AM',
      outTime: '01:25 PM',
      status: 'PRESENT',
      punchSource: 'BIOMETRIC_FINGERPRINT',
      deviceId: 'RP-BIO-VIJAY-NAGAR-01',
      deviceLocation: 'Vijay Nagar Main Campus, Indore'
    },
    {
      studentId: 'student-rohan-gupta',
      studentName: 'Rohan Gupta',
      mobile: '9826034567',
      batchTier: 'Class 11th Moving JEE',
      date: todayStr,
      inTime: '08:18 AM',
      outTime: null,
      status: 'PRESENT',
      punchSource: 'BIOMETRIC_FINGERPRINT',
      deviceId: 'RP-BIO-VIJAY-NAGAR-01',
      deviceLocation: 'Vijay Nagar Main Campus, Indore'
    },
    {
      studentId: 'student-priya-patel',
      studentName: 'Priya Patel',
      mobile: '9826045678',
      batchTier: 'Dropper Achiever NEET',
      date: todayStr,
      inTime: '08:22 AM',
      outTime: null,
      status: 'PRESENT',
      punchSource: 'BIOMETRIC_FINGERPRINT',
      deviceId: 'RP-BIO-VIJAY-NAGAR-01',
      deviceLocation: 'Vijay Nagar Main Campus, Indore'
    },
    {
      studentId: 'student-dev-1',
      studentName: 'Rankers Student',
      mobile: '9131435511',
      batchTier: 'Class 11 NEET Leader',
      date: todayStr,
      inTime: '08:02 AM',
      outTime: null,
      status: 'PRESENT',
      punchSource: 'BIOMETRIC_FINGERPRINT',
      deviceId: 'RP-BIO-VIJAY-NAGAR-01',
      deviceLocation: 'Vijay Nagar Main Campus, Indore'
    },
    // Yesterday logs
    {
      studentId: 'student-aarav-sharma',
      studentName: 'Aarav Sharma',
      mobile: '9826012345',
      batchTier: 'Super-30 Class 12th JEE',
      date: yesterdayStr,
      inTime: '08:00 AM',
      outTime: '01:45 PM',
      status: 'PRESENT',
      punchSource: 'BIOMETRIC_FINGERPRINT',
      deviceId: 'RP-BIO-VIJAY-NAGAR-01',
      deviceLocation: 'Vijay Nagar Main Campus, Indore'
    },
    {
      studentId: 'student-dev-1',
      studentName: 'Rankers Student',
      mobile: '9131435511',
      batchTier: 'Class 11 NEET Leader',
      date: yesterdayStr,
      inTime: '08:06 AM',
      outTime: '01:30 PM',
      status: 'PRESENT',
      punchSource: 'BIOMETRIC_FINGERPRINT',
      deviceId: 'RP-BIO-VIJAY-NAGAR-01',
      deviceLocation: 'Vijay Nagar Main Campus, Indore'
    }
  ];

  sampleLogs.forEach(log => {
    const existing = collections.attendance.findOne({ studentId: log.studentId, date: log.date });
    if (!existing) {
      collections.attendance.create(log);
    }
  });

  console.log(`✅ Seeded ${sampleLogs.length} attendance punch logs.`);
}

seedAttendance().catch(console.error);
