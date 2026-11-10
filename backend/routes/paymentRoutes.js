const express = require('express');
const router = express.Router();
const {
  createOrder,
  verifyPayment,
  initiatePayment,
  confirmPayment,
  getMyPayments
} = require('../controllers/paymentController');
const { authMiddleware, optionalAuthMiddleware } = require('../middlewares/authMiddleware');

// Razorpay Standard Checkout Endpoints
router.post('/create-order', optionalAuthMiddleware, createOrder);
router.post('/verify-payment', optionalAuthMiddleware, verifyPayment);

// Legacy/Compatibility routes
router.post('/initiate', optionalAuthMiddleware, initiatePayment);
router.post('/confirm', optionalAuthMiddleware, confirmPayment);
router.get('/my-history', authMiddleware, getMyPayments);

module.exports = router;
