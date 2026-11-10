const { collections, initializeDatabase } = require('../config/db');

async function testPinCheck() {
  await initializeDatabase();
  const classes = collections.liveClasses.find();
  const target = classes.find(c => String(c.boardQuickPin) === '4821');
  console.log('Target class for PIN 4821:', target ? `${target.title} (Status: ${target.status}, Studio: ${target.classroomStudio})` : 'NOT FOUND');

  const unassigned = classes.filter(c => !c.boardQuickPin);
  console.log('Unassigned PINs count:', unassigned.length);
}

testPinCheck().catch(console.error);
