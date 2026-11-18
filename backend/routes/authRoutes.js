const express = require('express');
const router = express.Router();
const {
  requestOtp,
  verifyOtpAndLogin,
  studentIdLogin,
  staffLogin,
  getCurrentUser,
  studentEmailSignup,
  studentEmailLogin,
  requestAdminPasswordResetOtp,
  resetAdminPassword
} = require('../controllers/authController');
const { authMiddleware } = require('../middlewares/authMiddleware');

router.post('/request-otp', requestOtp);
router.post('/verify-otp', verifyOtpAndLogin);
router.post('/student-id-login', studentIdLogin);
router.post('/staff-login', staffLogin);
router.post('/student-email-signup', studentEmailSignup);
router.post('/student-email-login', studentEmailLogin);
router.post('/admin-forgot-password/request-otp', requestAdminPasswordResetOtp);
router.post('/admin-forgot-password/reset-password', resetAdminPassword);
router.get('/me', authMiddleware, getCurrentUser);

module.exports = router;
