const express = require('express');
const router = express.Router();
const { collections } = require('../config/db');

// Helper to extract clean 11-character YouTube video ID from any valid YouTube URL
function extractYouTubeVideoId(input) {
  if (!input) return '';
  const trimmed = input.trim();

  // If already an 11-char ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  // Common YouTube URL regex patterns
  const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/;
  const match = trimmed.match(regExp);
  return match && match[1] ? match[1] : trimmed;
}

// GET /api/recorded-lectures - List recorded lectures with subject/stream filters
router.get('/', (req, res) => {
  try {
    const { subject, stream, chapter, search } = req.query;
    let lectures = collections.recordedLectures.find();

    if (subject && subject !== 'ALL') {
      lectures = lectures.filter(l => l.subject.toLowerCase() === subject.toLowerCase());
    }

    if (stream && stream !== 'ALL') {
      const s = stream.toUpperCase();
      if (s === 'JEE' || s === 'IIT_JEE' || s === 'ENGINEERING') {
        lectures = lectures.filter(l => l.stream === 'ALL' || l.stream === 'JEE' || l.stream === 'JEE_MAIN' || l.stream === 'JEE_ADVANCED' || l.stream === 'IIT_JEE');
      } else if (s === 'NEET' || s === 'PRE_MEDICAL' || s === 'MEDICAL') {
        lectures = lectures.filter(l => l.stream === 'ALL' || l.stream === 'NEET' || l.stream === 'PRE_MEDICAL');
      } else if (s === 'FOUNDATION' || s === 'PNCF' || s === 'CLASS_9' || s === 'CLASS_10') {
        lectures = lectures.filter(l => l.stream === 'ALL' || l.stream === 'FOUNDATION' || l.stream === 'PNCF');
      } else {
        lectures = lectures.filter(l => l.stream === 'ALL' || l.stream === s);
      }
    }

    if (chapter && chapter !== 'ALL') {
      lectures = lectures.filter(l => l.chapter.toLowerCase() === chapter.toLowerCase());
    }

    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      lectures = lectures.filter(l =>
        (l.title && l.title.toLowerCase().includes(q)) ||
        (l.chapter && l.chapter.toLowerCase().includes(q)) ||
        (l.facultyName && l.facultyName.toLowerCase().includes(q)) ||
        (l.description && l.description.toLowerCase().includes(q))
      );
    }

    // Sort by Subject, Chapter, and LectureNo
    lectures.sort((a, b) => {
      if (a.subject !== b.subject) return a.subject.localeCompare(b.subject);
      if (a.chapter !== b.chapter) return a.chapter.localeCompare(b.chapter);
      return (a.lectureNo || 0) - (b.lectureNo || 0);
    });

    res.json({
      success: true,
      count: lectures.length,
      data: lectures
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/recorded-lectures/:id - Get single lecture
router.get('/:id', (req, res) => {
  try {
    const item = collections.recordedLectures.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Recorded lecture not found' });
    }
    res.json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/recorded-lectures - Create new recorded lecture (Admin)
router.post('/', (req, res) => {
  try {
    const {
      title,
      subject,
      chapter,
      lectureNo,
      part,
      partTitle,
      stream,
      videoUrl,
      videoId,
      duration,
      facultyName,
      notesUrl,
      dppUrl,
      description
    } = req.body;

    if (!title || !subject || (!videoUrl && !videoId)) {
      return res.status(400).json({
        success: false,
        message: 'Title, subject, and a valid YouTube video URL or ID are required.'
      });
    }

    const finalVideoId = extractYouTubeVideoId(videoId || videoUrl);
    const canonicalUrl = `https://www.youtube.com/watch?v=${finalVideoId}`;

    const newLecture = collections.recordedLectures.create({
      title: title.trim(),
      subject: subject.trim(),
      chapter: chapter ? chapter.trim() : 'General Topic',
      lectureNo: Number(lectureNo) || 1,
      part: part ? part.trim() : `Part ${Number(lectureNo) || 1}`,
      partTitle: partTitle ? partTitle.trim() : '',
      stream: (stream || 'ALL').toUpperCase(),
      videoId: finalVideoId,
      videoUrl: canonicalUrl,
      duration: duration || '45 Mins',
      facultyName: facultyName || 'Rankers Faculty Team',
      notesUrl: notesUrl || '',
      dppUrl: dppUrl || '',
      description: description || ''
    });

    res.status(201).json({
      success: true,
      message: 'Recorded lecture published successfully',
      data: newLecture
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/recorded-lectures/:id - Update recorded lecture (Admin)
router.put('/:id', (req, res) => {
  try {
    const updates = { ...req.body };
    if (updates.videoUrl || updates.videoId) {
      const extracted = extractYouTubeVideoId(updates.videoId || updates.videoUrl);
      updates.videoId = extracted;
      updates.videoUrl = `https://www.youtube.com/watch?v=${extracted}`;
    }

    const updated = collections.recordedLectures.findByIdAndUpdate(req.params.id, updates);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Recorded lecture not found' });
    }

    res.json({
      success: true,
      message: 'Recorded lecture updated successfully',
      data: updated
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/recorded-lectures/:id - Delete recorded lecture (Admin)
router.delete('/:id', (req, res) => {
  try {
    const success = collections.recordedLectures.deleteById(req.params.id);
    if (!success) {
      return res.status(404).json({ success: false, message: 'Recorded lecture not found' });
    }
    res.json({ success: true, message: 'Recorded lecture removed successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
