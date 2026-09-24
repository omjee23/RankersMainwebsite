const express = require('express');
const router = express.Router();
const { createQuestion, getQuestions, bulkUploadCSV } = require('../controllers/questionController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { roleMiddleware } = require('../middlewares/roleMiddleware');
const upload = require('../middlewares/uploadMiddleware');

router.get('/', authMiddleware, getQuestions);
router.post(
  '/',
  authMiddleware,
  roleMiddleware(['admin', 'superadmin', 'teacher']),
  createQuestion
);
router.post(
  '/bulk-upload',
  authMiddleware,
  roleMiddleware(['admin', 'superadmin', 'teacher']),
  upload.single('csvFile'),
  bulkUploadCSV
);

module.exports = router;
