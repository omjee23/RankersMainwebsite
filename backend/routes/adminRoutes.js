const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getAllStudents,
  getAllPayments,
  saveCentre,
  scanQRAttendance,
  getSmsLogs,
  getExamSubmissions,
  updateExamSubmission,
  deleteExamSubmission,
  togglePublishSubmission,
  bulkPublishSubmissions,
  getAllExamTests,
  createExamTest,
  updateExamTest,
  deleteExamTest,
  sendExamToDirector,
  approveExamTestByDirector,
  togglePublishExamResults,
  getExamParticipationReport,
  exportDirectorExamSheet
} = require('../controllers/adminController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { roleMiddleware } = require('../middlewares/roleMiddleware');

// Admin only routes
router.use(authMiddleware);
router.use(roleMiddleware(['admin', 'superadmin', 'teacher']));

router.get('/stats', getDashboardStats);
router.get('/students', getAllStudents);
router.get('/payments', getAllPayments);
router.get('/submissions', getExamSubmissions);
router.put('/submissions/:id', updateExamSubmission);
router.delete('/submissions/:id', deleteExamSubmission);
router.post('/submissions/:id/toggle-publish', togglePublishSubmission);
router.post('/submissions/bulk-publish', bulkPublishSubmissions);
router.get('/tests', getAllExamTests);
router.post('/tests', createExamTest);
router.put('/tests/:id', updateExamTest);
router.delete('/tests/:id', deleteExamTest);
router.post('/tests/:id/send-to-director', sendExamToDirector);
router.post('/tests/:id/director-approve', approveExamTestByDirector);
router.post('/tests/:id/toggle-live-result', togglePublishExamResults);
router.get('/tests/:id/participation', getExamParticipationReport);
router.get('/tests/:id/export-director-sheet', exportDirectorExamSheet);
router.post('/centres', saveCentre);
router.post('/scan-attendance', scanQRAttendance);
router.get('/sms-logs', getSmsLogs);

module.exports = router;
