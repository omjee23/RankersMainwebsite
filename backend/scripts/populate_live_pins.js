const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data/live_classes.json');

if (!fs.existsSync(filePath)) {
  console.error('File not found:', filePath);
  process.exit(1);
}

const raw = fs.readFileSync(filePath, 'utf-8');
const classes = JSON.parse(raw);

console.log(`Loaded ${classes.length} live class sessions.`);

let updatedCount = 0;
const usedPins = new Set();

// First collect any already assigned pins
classes.forEach(c => {
  if (c.boardQuickPin) {
    usedPins.add(String(c.boardQuickPin));
  }
});

// Ensure 4821 is reserved for our main live session
let pinCounter = 1001;

classes.forEach((c, idx) => {
  let needsSave = false;

  // If this is an active LIVE class and doesn't have 4821, assign 4821 or 5174
  if (!c.boardQuickPin) {
    if (c.status === 'LIVE' && !usedPins.has('4821')) {
      c.boardQuickPin = '4821';
      usedPins.add('4821');
    } else {
      while (usedPins.has(String(pinCounter))) {
        pinCounter++;
      }
      c.boardQuickPin = String(pinCounter);
      usedPins.add(String(pinCounter));
      pinCounter++;
    }
    needsSave = true;
  }

  if (!c.classroomStudio) {
    c.classroomStudio = 'Epson 75" 4K Smart Board - Studio Hall 1, Vijay Nagar';
    needsSave = true;
  }

  if (c.isDigitalBoardLive === undefined) {
    c.isDigitalBoardLive = true;
    needsSave = true;
  }

  if (!c.streamQuality) {
    c.streamQuality = '1080p_60fps';
    needsSave = true;
  }

  if (needsSave) updatedCount++;
});

fs.writeFileSync(filePath, JSON.stringify(classes, null, 2), 'utf-8');
console.log(`✅ Successfully updated ${updatedCount} classes with 4-digit PINs and Epson 75" Smart Board Studio metadata.`);

// Print summary of LIVE and first few scheduled
const live = classes.filter(c => c.status === 'LIVE');
console.log('\nLIVE Classes:');
live.forEach(l => console.log(` - [PIN: ${l.boardQuickPin}] ${l.title} (${l.subject}) -> Studio: ${l.classroomStudio}`));

const scheduled = classes.filter(c => c.status === 'SCHEDULED').slice(0, 3);
console.log('\nSample Scheduled Classes:');
scheduled.forEach(s => console.log(` - [PIN: ${s.boardQuickPin}] ${s.title} (${s.subject}) -> Studio: ${s.classroomStudio}`));
