const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getAllStudents,
  saveCentre,
  scanQRAttendance,
  getSmsLogs,
  getExamSubmissions
} = require('../controllers/adminController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { roleMiddleware } = require('../middlewares/roleMiddleware');

// Admin only routes
router.use(authMiddleware);
router.use(roleMiddleware(['admin', 'superadmin', 'teacher']));

router.get('/stats', getDashboardStats);
router.get('/students', getAllStudents);
router.get('/submissions', getExamSubmissions);
router.post('/centres', saveCentre);
router.post('/scan-attendance', scanQRAttendance);
router.get('/sms-logs', getSmsLogs);

module.exports = router;
