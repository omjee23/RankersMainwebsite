const express = require('express');
const router = express.Router();
const { collections } = require('../config/db');

// GET /api/study-materials - List with filters & search
router.get('/', (req, res) => {
  try {
    const { category, subject, stream, search } = req.query;
    let materials = collections.studyMaterials.find();

    if (category && category !== 'ALL') {
      materials = materials.filter(m => m.category === category.toUpperCase());
    }

    if (subject && subject !== 'ALL') {
      materials = materials.filter(m => m.subject.toLowerCase() === subject.toLowerCase());
    }

    if (stream && stream !== 'ALL') {
      const s = stream.toUpperCase();
      if (s === 'JEE' || s === 'IIT_JEE' || s === 'ENGINEERING') {
        materials = materials.filter(m => m.stream === 'ALL' || m.stream === 'JEE' || m.stream === 'JEE_MAIN' || m.stream === 'JEE_ADVANCED' || m.stream === 'IIT_JEE');
      } else if (s === 'NEET' || s === 'PRE_MEDICAL' || s === 'MEDICAL') {
        materials = materials.filter(m => m.stream === 'ALL' || m.stream === 'NEET' || m.stream === 'PRE_MEDICAL');
      } else if (s === 'FOUNDATION' || s === 'PNCF' || s === 'CLASS_9' || s === 'CLASS_10') {
        materials = materials.filter(m => m.stream === 'ALL' || m.stream === 'FOUNDATION' || m.stream === 'PNCF');
      } else {
        materials = materials.filter(m => m.stream === 'ALL' || m.stream === s);
      }
    }

    const { chapter } = req.query;
    if (chapter && chapter !== 'ALL') {
      materials = materials.filter(m => m.chapter && m.chapter.toLowerCase() === chapter.toLowerCase());
    }

    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      materials = materials.filter(m =>
        (m.title && m.title.toLowerCase().includes(q)) ||
        (m.description && m.description.toLowerCase().includes(q)) ||
        (m.subject && m.subject.toLowerCase().includes(q))
      );
    }

    // Sort newest first
    materials.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

    res.json({
      success: true,
      count: materials.length,
      data: materials
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/study-materials/:id - Single material
router.get('/:id', (req, res) => {
  try {
    const item = collections.studyMaterials.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Study material not found' });
    }
    res.json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/study-materials - Create new study material (Admin)
router.post('/', (req, res) => {
  try {
    const {
      title,
      category,
      subject,
      chapter,
      part,
      partTitle,
      stream,
      targetClass,
      fileUrl,
      fileSize,
      description
    } = req.body;

    if (!title || !category || !subject) {
      return res.status(400).json({ success: false, message: 'Title, category, and subject are required.' });
    }

    const newMaterial = collections.studyMaterials.create({
      title: title.trim(),
      category: (category || 'PDF').toUpperCase(),
      subject: subject.trim(),
      chapter: chapter ? chapter.trim() : 'General Topic',
      part: part ? part.trim() : 'Part 1',
      partTitle: partTitle ? partTitle.trim() : '',
      stream: (stream || 'ALL').toUpperCase(),
      targetClass: targetClass || 'All Batches',
      fileUrl: fileUrl || '/uploads/materials/sample-document.pdf',
      fileSize: fileSize || '2.5 MB',
      description: description || '',
      downloadCount: 0
    });

    res.status(201).json({
      success: true,
      message: 'Study material published successfully',
      data: newMaterial
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/study-materials/:id - Update material (Admin)
router.put('/:id', (req, res) => {
  try {
    const updated = collections.studyMaterials.findByIdAndUpdate(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Study material not found' });
    }
    res.json({
      success: true,
      message: 'Study material updated successfully',
      data: updated
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/study-materials/:id - Delete material (Admin)
router.delete('/:id', (req, res) => {
  try {
    const success = collections.studyMaterials.deleteById(req.params.id);
    if (!success) {
      return res.status(404).json({ success: false, message: 'Study material not found' });
    }
    res.json({ success: true, message: 'Study material deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/study-materials/:id/download - Track download counter
router.post('/:id/download', (req, res) => {
  try {
    const item = collections.studyMaterials.findById(req.params.id);
    if (item) {
      collections.studyMaterials.findByIdAndUpdate(req.params.id, {
        downloadCount: (item.downloadCount || 0) + 1
      });
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
