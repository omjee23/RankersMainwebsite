const express = require('express');
const router = express.Router();
const {
  startExam,
  saveAnswer,
  reportViolation,
  submitExam,
  getSubmissionResult
} = require('../controllers/examEngineController');
const { authMiddleware } = require('../middlewares/authMiddleware');

router.post('/start', authMiddleware, startExam);
router.post('/save-answer', authMiddleware, saveAnswer);
router.post('/report-violation', authMiddleware, reportViolation);
router.post('/submit', authMiddleware, submitExam);
router.get('/submission/:id', authMiddleware, getSubmissionResult);

module.exports = router;
