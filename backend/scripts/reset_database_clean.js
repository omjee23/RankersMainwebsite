const fs = require('fs');
const path = require('path');
const dataDir = path.join(__dirname, '../data');

// Clean collections
const cleanTargets = [
  'rsat_registrations.json',
  'rankx_registrations.json',
  'payments.json',
  'admissions.json',
  'exam_submissions.json',
  'sms_logs.json',
  'attendance.json'
];

cleanTargets.forEach(f => {
  fs.writeFileSync(path.join(dataDir, f), JSON.stringify([], null, 2), 'utf8');
  console.log('Cleaned:', f);
});

// Reset users to Admin only
const adminUser = [
  {
    id: 'b457373e-18ad-47c5-b12b-b90b3b058f09',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    email: 'admin@rankerspath.in',
    fullName: 'Super Administrator',
    role: 'admin',
    mobile: '9131435511',
    password: '$2b$10$dNMdcrMl3o8bGfn7d/ZYguxIu36ljRFUJF26PnE.97nhKes8G2gjm'
  }
];
fs.writeFileSync(path.join(dataDir, 'users.json'), JSON.stringify(adminUser, null, 2), 'utf8');
console.log('Cleaned users.json (Kept Super Administrator only)');
console.log('Database successfully reset for fresh testing!');
