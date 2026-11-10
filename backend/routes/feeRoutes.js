const express = require('express');
const router = express.Router();
const { getFeeConfig, updateFeeConfig } = require('../controllers/feeController');
const { authMiddleware, optionalAuthMiddleware } = require('../middlewares/authMiddleware');
const { roleMiddleware } = require('../middlewares/roleMiddleware');

// Public route: get active fee configuration
router.get('/config', optionalAuthMiddleware, getFeeConfig);

// Admin-protected route: update fee configuration
router.put(
  '/config',
  authMiddleware,
  roleMiddleware(['admin', 'superadmin', 'director']),
  updateFeeConfig
);

module.exports = router;
