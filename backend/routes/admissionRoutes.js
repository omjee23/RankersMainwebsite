const express = require('express');
const router = express.Router();
const {
  submitAdmission,
  getAllAdmissions,
  getAdmissionById,
  updateAdmission,
  deleteAdmission,
  exportAdmissionsCsv,
  generateStudentCredentials
} = require('../controllers/admissionController');

// Public route to submit an admission form
router.post('/submit', submitAdmission);

// Admin route to export CSV/Excel
router.get('/export/csv', exportAdmissionsCsv);

// Admin route to generate student credentials (Rankers@XXXX) & enrol
router.post('/:id/generate-credentials', generateStudentCredentials);

// Admin routes to list, inspect, update, and delete
router.get('/', getAllAdmissions);
router.get('/:id', getAdmissionById);
router.put('/:id', updateAdmission);
router.delete('/:id', deleteAdmission);

module.exports = router;
