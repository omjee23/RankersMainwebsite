const express = require('express');
const router = express.Router();
const { collections } = require('../config/db');

// Helper to generate clean Jitsi room name
function sanitizeRoomName(text) {
  const clean = (text || 'Class')
    .replace(/[^a-zA-Z0-9]/g, '_')
    .replace(/_+/g, '_')
    .substring(0, 40);
  return `RankersPath_${clean}_${Math.floor(1000 + Math.random() * 9000)}`;
}

// GET /api/live-classes - List classes with rich calendar, stream & month filters
router.get('/', (req, res) => {
  try {
    const { stream, status, isOpenToAll, month, date, targetBatch, hasTest } = req.query;
    let classes = collections.liveClasses.find();

    // 1. Open to All Filter
    if (isOpenToAll === 'true') {
      classes = classes.filter(c => c.isOpenToAll === true);
    } 
    // 2. Stream Filter (NEET vs JEE aliases)
    else if (stream && stream !== 'ALL') {
      const s = stream.toUpperCase();
      if (s === 'JEE' || s === 'IIT_JEE' || s === 'ENGINEERING') {
        classes = classes.filter(c =>
          c.isOpenToAll === true ||
          c.stream === 'ALL' ||
          c.stream === 'JEE' ||
          c.stream === 'JEE_MAIN' ||
          c.stream === 'JEE_ADVANCED' ||
          c.stream === 'IIT_JEE'
        );
      } else if (s === 'NEET' || s === 'PRE_MEDICAL' || s === 'MEDICAL') {
        classes = classes.filter(c =>
          c.isOpenToAll === true ||
          c.stream === 'ALL' ||
          c.stream === 'NEET' ||
          c.stream === 'PRE_MEDICAL'
        );
      } else {
        classes = classes.filter(c => c.isOpenToAll === true || c.stream === 'ALL' || c.stream === s);
      }
    }

    // 3. Month Filter (e.g., '2026-10')
    if (month && month.trim()) {
      const mPrefix = month.trim();
      classes = classes.filter(c => c.date && c.date.startsWith(mPrefix));
    }

    // 4. Exact Date Filter (e.g., '2026-10-15')
    if (date && date.trim()) {
      classes = classes.filter(c => c.date === date.trim());
    }

    // 5. Target Batch Filter
    if (targetBatch && targetBatch !== 'ALL') {
      classes = classes.filter(c =>
        !c.targetBatch ||
        c.targetBatch.toLowerCase().includes(targetBatch.toLowerCase()) ||
        c.targetBatch.toLowerCase().includes('all')
      );
    }

    // 6. Test Day Filter
    if (hasTest === 'true') {
      classes = classes.filter(c => c.hasTest === true);
    }

    // 7. Status Filter
    if (status && status !== 'ALL') {
      classes = classes.filter(c => c.status === status.toUpperCase());
    }

    // Sort order: Chronological by date and startTime
    classes.sort((a, b) => {
      const dateA = a.date || '';
      const dateB = b.date || '';
      if (dateA !== dateB) return dateA.localeCompare(dateB);
      return (a.startTime || '').localeCompare(b.startTime || '');
    });

    res.json({
      success: true,
      count: classes.length,
      data: classes
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/live-classes/open-to-all - Public endpoint for open masterclasses
router.get('/open-to-all', (req, res) => {
  try {
    const openClasses = collections.liveClasses.find({ isOpenToAll: true })
      .filter(c => c.status === 'LIVE' || c.status === 'SCHEDULED');

    res.json({
      success: true,
      count: openClasses.length,
      data: openClasses
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/live-classes/timetable - Weekly Timetable view
router.get('/timetable', (req, res) => {
  try {
    const { stream } = req.query;
    let classes = collections.liveClasses.find();

    if (stream && stream !== 'ALL') {
      const s = stream.toUpperCase();
      if (s === 'JEE' || s === 'IIT_JEE') {
        classes = classes.filter(c => c.isOpenToAll === true || c.stream === 'ALL' || c.stream === 'JEE' || c.stream === 'JEE_MAIN' || c.stream === 'JEE_ADVANCED');
      } else if (s === 'NEET') {
        classes = classes.filter(c => c.isOpenToAll === true || c.stream === 'ALL' || c.stream === 'NEET' || c.stream === 'PRE_MEDICAL');
      } else {
        classes = classes.filter(c => c.isOpenToAll === true || c.stream === 'ALL' || c.stream === s);
      }
    }

    const daysOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const timetable = {};

    daysOrder.forEach(day => {
      timetable[day] = classes.filter(c => c.dayOfWeek === day);
    });

    res.json({
      success: true,
      data: timetable
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/live-classes/:id - Get single class
router.get('/:id', (req, res) => {
  try {
    const item = collections.liveClasses.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Class schedule not found' });
    }
    res.json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/live-classes - Schedule a new class / test slot (Admin)
router.post('/', (req, res) => {
  try {
    const {
      title,
      subject,
      stream,
      targetBatch,
      facultyName,
      date,
      startTime,
      endTime,
      dayOfWeek,
      roomName,
      isOpenToAll,
      googleDriveRecordingUrl,
      recordingEmail,
      description,
      chapter,
      syllabus,
      classMode,
      gcUrl,
      teacherMessage,
      hasTest,
      testDetails
    } = req.body;

    if (!title || !subject || !date || !startTime) {
      return res.status(400).json({ success: false, message: 'Title, subject, date, and start time are required.' });
    }

    // Determine day of week from date if not provided
    let calculatedDayOfWeek = dayOfWeek;
    if (!calculatedDayOfWeek && date) {
      const d = new Date(date + 'T00:00:00Z');
      calculatedDayOfWeek = d.toLocaleDateString('en-US', { weekday: 'long', timeZone: 'UTC' });
    }

    const finalRoomName = roomName && roomName.trim() ? roomName.trim() : sanitizeRoomName(`${stream || 'Class'}_${subject}_${title}`);
    const jitsiUrl = `https://meet.jit.si/${finalRoomName}`;

    const newClass = collections.liveClasses.create({
      title: title.trim(),
      subject: subject.trim(),
      stream: (stream || 'ALL').toUpperCase(),
      targetBatch: targetBatch || 'All Enrolled Batches',
      facultyName: facultyName || 'Rankers Faculty Team',
      date,
      startTime,
      endTime: endTime || '',
      dayOfWeek: calculatedDayOfWeek || 'Monday',
      roomName: finalRoomName,
      jitsiUrl,
      status: 'SCHEDULED',
      isOpenToAll: Boolean(isOpenToAll),
      googleDriveRecordingUrl: googleDriveRecordingUrl || '',
      recordingEmail: recordingEmail || 'recordings@rankerspath.in',
      description: description || '',
      chapter: chapter || '',
      syllabus: syllabus || '',
      classMode: classMode || 'HYBRID',
      gcUrl: gcUrl || '',
      teacherMessage: teacherMessage || '',
      isDigitalBoardLive: req.body.isDigitalBoardLive !== undefined ? Boolean(req.body.isDigitalBoardLive) : true,
      classroomStudio: req.body.classroomStudio || 'Epson 75" 4K Smart Board (Studio Hall 1 - Vijay Nagar)',
      boardQuickPin: req.body.boardQuickPin || String(Math.floor(1000 + Math.random() * 9000)),
      streamQuality: req.body.streamQuality || '4K_1080P_60FPS',
      hasTest: Boolean(hasTest),
      testDetails: hasTest && testDetails ? {
        testTitle: testDetails.testTitle || 'Weekly Assessment Test',
        testType: testDetails.testType || 'Unit Test',
        testTiming: testDetails.testTiming || '02:00 PM - 05:20 PM',
        totalMarks: Number(testDetails.totalMarks) || 720,
        syllabus: testDetails.syllabus || '',
        questionPaperUrl: testDetails.questionPaperUrl || '',
        instructions: testDetails.instructions || ''
      } : null
    });

    res.status(201).json({
      success: true,
      message: 'Class/Test schedule created successfully',
      data: newClass
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/live-classes/bulk-plan - Bulk plan 1-month or 2-months schedule (Admin)
router.post('/bulk-plan', (req, res) => {
  try {
    const {
      stream = 'NEET',
      targetBatch = 'Class 11 Leader',
      year = 2026,
      startMonth = 10, // 10 = October
      durationMonths = 1, // 1 or 2
      weeklyTemplate = [],
      classMode = 'HYBRID',
      gcUrl = 'https://meet.google.com/rp-live-class'
    } = req.body;

    if (!Array.isArray(weeklyTemplate) || weeklyTemplate.length === 0) {
      return res.status(400).json({ success: false, message: 'weeklyTemplate array is required' });
    }

    const createdItems = [];
    const dayMap = {
      'Sunday': 0, 'Monday': 1, 'Tuesday': 2, 'Wednesday': 3,
      'Thursday': 4, 'Friday': 5, 'Saturday': 6
    };

    // Loop through the months
    for (let mOffset = 0; mOffset < durationMonths; mOffset++) {
      let currentMonthIdx = (startMonth - 1 + mOffset) % 12;
      let currentYear = year + Math.floor((startMonth - 1 + mOffset) / 12);
      
      const daysInMonth = new Date(currentYear, currentMonthIdx + 1, 0).getDate();

      for (let day = 1; day <= daysInMonth; day++) {
        const dateObj = new Date(Date.UTC(currentYear, currentMonthIdx, day));
        const dayOfWeekStr = dateObj.toLocaleDateString('en-US', { weekday: 'long', timeZone: 'UTC' });
        const dateString = `${currentYear}-${String(currentMonthIdx + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

        // Find template matching this day of week
        const templateMatches = weeklyTemplate.filter(t => t.dayOfWeek.toLowerCase() === dayOfWeekStr.toLowerCase());

        for (const t of templateMatches) {
          const finalTitle = t.title || `${t.subject}: ${t.chapter || 'Classroom Lecture'}`;
          const finalRoom = sanitizeRoomName(`${stream}_${t.subject}_${dateString}`);

          const item = collections.liveClasses.create({
            title: finalTitle,
            subject: t.subject || 'Physics',
            stream: stream.toUpperCase(),
            targetBatch: targetBatch,
            facultyName: t.facultyName || 'Rankers Faculty Team',
            date: dateString,
            startTime: t.startTime || '09:00 AM',
            endTime: t.endTime || '10:30 AM',
            dayOfWeek: dayOfWeekStr,
            roomName: finalRoom,
            jitsiUrl: `https://meet.jit.si/${finalRoom}`,
            status: 'SCHEDULED',
            isOpenToAll: false,
            googleDriveRecordingUrl: '',
            recordingEmail: 'recordings@rankerspath.in',
            description: t.description || `Lecture on ${t.chapter || t.subject}`,
            chapter: t.chapter || `${t.subject} Chapter`,
            syllabus: t.syllabus || '',
            classMode: t.classMode || classMode,
            gcUrl: t.gcUrl || gcUrl,
            teacherMessage: t.teacherMessage || '',
            hasTest: Boolean(t.hasTest),
            testDetails: t.hasTest ? {
              testTitle: t.testDetails?.testTitle || `${stream} Weekly Test`,
              testType: t.testDetails?.testType || 'Unit Test',
              testTiming: t.testDetails?.testTiming || '02:00 PM - 05:20 PM',
              totalMarks: Number(t.testDetails?.totalMarks) || (stream === 'NEET' ? 720 : 300),
              syllabus: t.testDetails?.syllabus || 'Weekly Syllabus',
              questionPaperUrl: t.testDetails?.questionPaperUrl || '',
              instructions: t.testDetails?.instructions || 'Negative marking applicable. Submit OMR before end time.'
            } : null
          });

          createdItems.push(item);
        }
      }
    }

    res.status(201).json({
      success: true,
      message: `Successfully generated ${createdItems.length} class slots for ${durationMonths} month(s)`,
      count: createdItems.length,
      data: createdItems
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/live-classes/:id - Update class / on-the-fly daily edit (Admin)
router.put('/:id', (req, res) => {
  try {
    const updates = { ...req.body };
    if (updates.roomName) {
      updates.jitsiUrl = `https://meet.jit.si/${updates.roomName.trim()}`;
    }

    const updated = collections.liveClasses.findByIdAndUpdate(req.params.id, updates);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Class schedule not found' });
    }

    res.json({
      success: true,
      message: 'Class schedule updated successfully',
      data: updated
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/live-classes/pin/:pin - Fast Digital Board Touch Screen Launcher
router.get('/pin/:pin', (req, res) => {
  try {
    const { pin } = req.params;
    const cleanPin = (pin || '').trim();
    const item = collections.liveClasses.find({ boardQuickPin: cleanPin })[0] ||
      collections.liveClasses.find({ status: 'LIVE' })[0] ||
      collections.liveClasses.find({ status: 'SCHEDULED' })[0];

    if (!item) {
      return res.status(404).json({ success: false, message: 'No live class found matching this Board PIN.' });
    }

    const hostJitsiUrl = `https://meet.jit.si/${item.roomName}#userInfo.displayName=${encodeURIComponent(item.facultyName + ' (Digital Board Host)')}&config.prejoinPageEnabled=false&config.disableDeepLinking=true&config.resolution=1080&config.constraints.video.height.ideal=1080&config.startWithAudioMuted=false&config.startWithVideoMuted=false`;

    res.json({
      success: true,
      message: 'Digital board class session resolved',
      data: {
        ...item,
        hostJitsiUrl,
        studioProfile: 'Epson 75" 4K Smart Board (EI-P7501 PowerBoardPRO - Vijay Nagar Studio Hall 1)'
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/live-classes/:id/start-board-broadcast - 1-Click Launch from Digital Board with WhatsApp alert
router.post('/:id/start-board-broadcast', (req, res) => {
  try {
    const { id } = req.params;
    const item = collections.liveClasses.findById(id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Class schedule not found' });
    }

    const updated = collections.liveClasses.findByIdAndUpdate(id, {
      status: 'LIVE',
      isDigitalBoardLive: true,
      broadcastStartedAt: new Date().toISOString()
    });

    const hostJitsiUrl = `https://meet.jit.si/${updated.roomName}#userInfo.displayName=${encodeURIComponent(updated.facultyName + ' (Digital Board Host)')}&config.prejoinPageEnabled=false&config.disableDeepLinking=true&config.resolution=1080&config.constraints.video.height.ideal=1080&config.startWithAudioMuted=false&config.startWithVideoMuted=false`;

    // WhatsApp batch alert message
    const msg = `🔴 *LIVE CLASS ALERT - RANKERS PATH*\n\n` +
      `📚 *${updated.title}*\n` +
      `👨‍🏫 Faculty: *${updated.facultyName}*\n` +
      `🎯 Stream: *${updated.stream} (${updated.targetBatch})*\n` +
      `📺 Studio: *Epson 75" 4K Smart Board (Vijay Nagar Hall 1)*\n\n` +
      `👉 Join Live Class on Student Portal:\n` +
      `https://rankerspath.in/dashboard/live\n\n` +
      `Class has commenced on the digital smart board. Please join immediately with your notebook!`;

    const whatsappShareUrl = `https://wa.me/?text=${encodeURIComponent(msg)}`;

    res.json({
      success: true,
      message: 'Digital board broadcast started! Class is now LIVE on Student Dashboard.',
      data: {
        ...updated,
        hostJitsiUrl,
        whatsappShareUrl,
        alertMessage: msg
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
