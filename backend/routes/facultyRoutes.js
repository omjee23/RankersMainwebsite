const express = require('express');
const router = express.Router();
const {
  getAllFaculty,
  getFacultyById,
  createFaculty,
  updateFaculty,
  deleteFaculty
} = require('../controllers/facultyController');

// Public endpoints (Main Website & Student Portal)
router.get('/', getAllFaculty);
router.get('/:id', getFacultyById);

// Admin Management endpoints (Add, Edit, Delete)
router.post('/', createFaculty);
router.put('/:id', updateFaculty);
router.delete('/:id', deleteFaculty);

module.exports = router;
