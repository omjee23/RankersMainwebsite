const express = require('express');
const router = express.Router();
const { initiatePayment, confirmPayment, getMyPayments } = require('../controllers/paymentController');
const { authMiddleware } = require('../middlewares/authMiddleware');

router.post('/initiate', authMiddleware, initiatePayment);
router.post('/confirm', authMiddleware, confirmPayment);
router.get('/my-history', authMiddleware, getMyPayments);

module.exports = router;
