const express = require('express');
const router = express.Router();
const {
  getCentres,
  registerRankX,
  getMyRankX,
  studentRankXLogin,
  studentRankXSignup,
  scheduleRankXSlot,
  checkRankXFeeStatus,
  getRankXNotifications,
  getRankXCommandCenterData,
  createRankXPaper,
  setActiveRankXPaper
} = require('../controllers/rankXController');
const { uploadOfflineMarksCSV, getRankXResult } = require('../controllers/offlineMarksController');
const { authMiddleware, optionalAuthMiddleware } = require('../middlewares/authMiddleware');
const { roleMiddleware } = require('../middlewares/roleMiddleware');
const upload = require('../middlewares/uploadMiddleware');

// Public & Student Auth
router.get('/centres', getCentres);
router.get('/result/:query', getRankXResult);
router.post('/student-login', studentRankXLogin);
router.post('/student-signup', studentRankXSignup);

// Student registration & slot scheduling
router.post('/register', optionalAuthMiddleware, registerRankX);
router.get('/my-registration', authMiddleware, getMyRankX);
router.post('/schedule-slot', optionalAuthMiddleware, scheduleRankXSlot);
router.get('/fee-status/:mobile', checkRankXFeeStatus);
router.get('/notifications/:mobile', getRankXNotifications);

// Unified Admin RANKEX Command Centre
router.get('/command-center', getRankXCommandCenterData);
router.post('/create-paper', createRankXPaper);
router.put('/set-active-paper/:id', setActiveRankXPaper);

// Admin / Teacher: Upload marksheet CSV
router.post(
  '/upload-marks',
  authMiddleware,
  roleMiddleware(['admin', 'superadmin', 'teacher']),
  upload.single('marksheet'),
  uploadOfflineMarksCSV
);

module.exports = router;

