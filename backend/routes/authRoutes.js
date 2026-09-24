const express = require('express');
const router = express.Router();
const { requestOtp, verifyOtpAndLogin, staffLogin, getCurrentUser } = require('../controllers/authController');
const { authMiddleware } = require('../middlewares/authMiddleware');

router.post('/request-otp', requestOtp);
router.post('/verify-otp', verifyOtpAndLogin);
router.post('/staff-login', staffLogin);
router.get('/me', authMiddleware, getCurrentUser);

module.exports = router;
