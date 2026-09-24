const express = require('express');
const router = express.Router();
const { exportReportCSV } = require('../controllers/reportController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { roleMiddleware } = require('../middlewares/roleMiddleware');

router.get(
  '/export/:reportType',
  authMiddleware,
  roleMiddleware(['admin', 'superadmin']),
  exportReportCSV
);

module.exports = router;
