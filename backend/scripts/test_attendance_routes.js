const { collections, initializeDatabase } = require('../config/db');

async function testAttendance() {
  await initializeDatabase();
  const todayStr = new Date().toISOString().split('T')[0];
  const todayLogs = collections.attendance.find({ date: todayStr });
  console.log(`✅ Found ${todayLogs.length} attendance logs for today (${todayStr}):`);
  todayLogs.forEach(l => {
    console.log(`   - ${l.studentName} | In: ${l.inTime || 'N/A'} | Out: ${l.outTime || 'In Class'} | Status: ${l.status} | Source: ${l.punchSource}`);
  });
}

testAttendance().catch(console.error);
