const express = require('express');
const router = express.Router();
const {
  getAllFaculty,
  getFacultyById,
  createFaculty,
  updateFaculty,
  deleteFaculty,
  uploadFacultyPhoto
} = require('../controllers/facultyController');
const upload = require('../middlewares/uploadMiddleware');

// Public endpoints (Main Website & Student Portal)
router.get('/', getAllFaculty);
router.get('/:id', getFacultyById);

// Admin Management endpoints (Add, Edit, Delete, Photo Upload)
router.post('/upload', upload.single('photo'), uploadFacultyPhoto);
router.post('/', createFaculty);
router.put('/:id', updateFaculty);
router.delete('/:id', deleteFaculty);

module.exports = router;

