const express = require('express');
const router = express.Router();
const {
  createOrder,
  verifyPayment,
  handleWebhook,
  getOrderStatus
} = require('../controllers/cashfreeController');
const { optionalAuthMiddleware } = require('../middlewares/authMiddleware');

// Cashfree PG Routes
router.post('/create-order', optionalAuthMiddleware, createOrder);
router.post('/verify', optionalAuthMiddleware, verifyPayment);
router.post('/webhook', handleWebhook);
router.get('/status/:orderId', getOrderStatus);

module.exports = router;
