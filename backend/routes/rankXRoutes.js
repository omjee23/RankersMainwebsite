const express = require('express');
const router = express.Router();
const { getCentres, registerRankX, getMyRankX } = require('../controllers/rankXController');
const { uploadOfflineMarksCSV, getRankXResult } = require('../controllers/offlineMarksController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { roleMiddleware } = require('../middlewares/roleMiddleware');
const upload = require('../middlewares/uploadMiddleware');

// Public
router.get('/centres', getCentres);
router.get('/result/:query', getRankXResult);

// Student
router.post('/register', authMiddleware, registerRankX);
router.get('/my-registration', authMiddleware, getMyRankX);

// Admin / Teacher: Upload marksheet CSV
router.post(
  '/upload-marks',
  authMiddleware,
  roleMiddleware(['admin', 'superadmin', 'teacher']),
  upload.single('marksheet'),
  uploadOfflineMarksCSV
);

module.exports = router;
