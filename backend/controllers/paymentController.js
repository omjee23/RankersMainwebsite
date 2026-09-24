const { createPaymentIntent, verifyAndConfirmPayment } = require('../services/paymentService');
const { collections } = require('../config/db');
const { successResponse, errorResponse } = require('../utils/apiResponse');

/**
 * Initialize payment transaction
 */
async function initiatePayment(req, res, next) {
  try {
    const studentId = req.user.id;
    const { amount, purpose, metadata } = req.body;

    if (!amount || Number(amount) <= 0) {
      return errorResponse(res, 'Valid payment amount is required', 400);
    }

    const intent = await createPaymentIntent({
      studentId,
      studentName: req.user.fullName,
      mobile: req.user.mobile,
      amount,
      purpose: purpose || 'GENERAL_FEE',
      metadata
    });

    return successResponse(res, 'Payment intent created', intent);
  } catch (err) {
    next(err);
  }
}

/**
 * Confirm / callback payment
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
  initiatePayment,
  confirmPayment,
  getMyPayments
};
