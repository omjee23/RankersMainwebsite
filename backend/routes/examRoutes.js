const express = require('express');
const router = express.Router();
const {
  getAvailableExams,
  getMySubmissions,
  startExam,
  saveAnswer,
  reportViolation,
  submitExam,
  getSubmissionResult
} = require('../controllers/examEngineController');
const { authMiddleware, optionalAuthMiddleware } = require('../middlewares/authMiddleware');

router.get('/tests', optionalAuthMiddleware, getAvailableExams);
router.get('/my-submissions', authMiddleware, getMySubmissions);
router.post('/start', authMiddleware, startExam);
router.post('/save-answer', authMiddleware, saveAnswer);
router.post('/report-violation', authMiddleware, reportViolation);
router.post('/submit', authMiddleware, submitExam);
router.get('/submission/:id', authMiddleware, getSubmissionResult);

module.exports = router;
