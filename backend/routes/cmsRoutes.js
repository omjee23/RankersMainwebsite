const express = require('express');
const router = express.Router();
const { getCMSContent, updateCMSContent } = require('../controllers/cmsController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { roleMiddleware } = require('../middlewares/roleMiddleware');

// Public read
router.get('/', getCMSContent);

// Admin update
router.put('/', authMiddleware, roleMiddleware(['admin', 'superadmin']), updateCMSContent);

module.exports = router;
