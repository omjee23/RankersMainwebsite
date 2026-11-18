const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const dataDir = path.join(__dirname, '../data');

// Clean demo transaction collections
const cleanTargets = [
  'rsat_registrations.json',
  'rankx_registrations.json',
  'payments.json',
  'admissions.json',
  'exam_submissions.json',
  'sms_logs.json',
  'attendance.json',
  'student_profiles.json'
];

cleanTargets.forEach(f => {
  const filePath = path.join(dataDir, f);
  fs.writeFileSync(filePath, JSON.stringify([], null, 2), 'utf8');
  console.log('Cleaned demo records from:', f);
});

// Configure 2 Production Super-Admin accounts
const adminUsers = [
  {
    id: 'admin-rankerspath-edu',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    email: 'rankerspath.edu@gmail.com',
    fullName: 'Rankers Path Admin',
    role: 'admin',
    mobile: '9131435511',
    password: bcrypt.hashSync('Rankerspath@321', 10)
  },
  {
    id: 'admin-omjee-pal',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    email: 'omjeejob@gmail.com',
    fullName: 'Om Jee Pal (Super Admin)',
    role: 'admin',
    mobile: '8707258045',
    password: bcrypt.hashSync('Rankerspath@Om321', 10)
  }
];

fs.writeFileSync(path.join(dataDir, 'users.json'), JSON.stringify(adminUsers, null, 2), 'utf8');
console.log('✅ Updated users.json with 2 Production Super-Admin accounts.');
console.log('✅ All demo student & previous admin accounts purged successfully!');
