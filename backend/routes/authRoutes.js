const express = require('express');
const router = express.Router();
const {
  requestOtp,
  verifyOtpAndLogin,
  studentIdLogin,
  staffLogin,
  getCurrentUser,
  studentEmailSignup,
  studentEmailLogin
} = require('../controllers/authController');
const { authMiddleware } = require('../middlewares/authMiddleware');

router.post('/request-otp', requestOtp);
router.post('/verify-otp', verifyOtpAndLogin);
router.post('/student-id-login', studentIdLogin);
router.post('/staff-login', staffLogin);
router.post('/student-email-signup', studentEmailSignup);
router.post('/student-email-login', studentEmailLogin);
router.get('/me', authMiddleware, getCurrentUser);

module.exports = router;
