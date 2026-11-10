const {
  createRazorpayOrder,
  verifyRazorpayPaymentSignature,
  createPaymentIntent,
  verifyAndConfirmPayment
} = require('../services/paymentService');
const { collections } = require('../config/db');
const { successResponse, errorResponse } = require('../utils/apiResponse');

/**
 * Create Razorpay Order
 * Endpoint: POST /api/create-order and POST /api/payments/create-order
 * Request: { amount (paise), currency, receipt }
 * Return: { order_id, amount, currency }
 */
async function createOrder(req, res, next) {
  try {
    const { amount, currency = 'INR', receipt, notes } = req.body;

    if (!amount || Number(amount) < 100) {
      return errorResponse(res, 'Amount must be at least 100 paise (₹1.00)', 400);
    }

    const studentId = req.user ? req.user.id : null;
    const studentName = req.user ? req.user.fullName : req.body.studentName || 'Student';
    const mobile = req.user ? req.user.mobile : req.body.mobile || '';

    const order = await createRazorpayOrder({
      amount,
      currency,
      receipt,
      notes,
      studentId,
      studentName,
      mobile,
      purpose: req.body.purpose || 'RSAT_EXAM_FEE'
    });

    // Return exact requested format: { order_id, amount, currency }
    return res.status(200).json({
      success: true,
      order_id: order.order_id,
      id: order.order_id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      key_id: order.key_id
    });
  } catch (err) {
    if (err.statusCode) {
      return res.status(err.statusCode).json({ success: false, message: err.message });
    }
    return res.status(500).json({ success: false, message: 'Failed to create Razorpay order: ' + err.message });
  }
}

/**
 * Verify Razorpay Payment Signature
 * Endpoint: POST /api/verify-payment and POST /api/payments/verify-payment
 * Algorithm: HMAC-SHA256(order_id + "|" + payment_id, KEY_SECRET)
 */
async function verifyPayment(req, res, next) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      order_id,
      payment_id,
      signature
    } = req.body;

    const finalOrderId = razorpay_order_id || order_id;
    const finalPaymentId = razorpay_payment_id || payment_id;
    const finalSignature = razorpay_signature || signature;

    if (!finalOrderId || !finalPaymentId || !finalSignature) {
      return res.status(400).json({
        success: false,
        message: 'Missing fields: razorpay_order_id, razorpay_payment_id, and razorpay_signature are required'
      });
    }

    const result = await verifyRazorpayPaymentSignature({
      razorpay_order_id: finalOrderId,
      razorpay_payment_id: finalPaymentId,
      razorpay_signature: finalSignature
    });

    return res.status(200).json({
      success: true,
      message: 'Payment signature verified successfully',
      order_id: finalOrderId,
      payment_id: finalPaymentId,
      data: result
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message || 'Payment signature verification failed'
    });
  }
}

/**
 * Initialize payment transaction (backward compatibility)
 */
async function initiatePayment(req, res, next) {
  try {
    const studentId = req.user ? req.user.id : null;
    const { amount, purpose, metadata } = req.body;

    if (!amount || Number(amount) <= 0) {
      return errorResponse(res, 'Valid payment amount is required', 400);
    }

    const intent = await createRazorpayOrder({
      studentId,
      studentName: req.user?.fullName,
      mobile: req.user?.mobile,
      amount: Number(amount) * 100, // converted to paise
      purpose: purpose || 'GENERAL_FEE',
      notes: metadata
    });

    return successResponse(res, 'Payment intent created', intent);
  } catch (err) {
    next(err);
  }
}

/**
 * Confirm / callback payment (backward compatibility)
 */
async function confirmPayment(req, res, next) {
  try {
    const { orderId, status = 'SUCCESS', gatewayRef } = req.body;

    if (!orderId) {
      return errorResponse(res, 'Transaction Order ID is required', 400);
    }

    const verified = await verifyAndConfirmPayment({ orderId, status, gatewayRef });
    return successResponse(res, 'Payment recorded successfully', verified);
  } catch (err) {
    next(err);
  }
}

/**
 * Get student's payment history
 */
async function getMyPayments(req, res, next) {
  try {
    const studentId = req.user.id;
    const records = collections.payments.find({ studentId });
    return successResponse(res, 'Payment history retrieved', records);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createOrder,
  verifyPayment,
  initiatePayment,
  confirmPayment,
  getMyPayments
};
