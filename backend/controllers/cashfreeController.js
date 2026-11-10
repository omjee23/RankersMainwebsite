const {
  createCashfreeOrder,
  verifyCashfreeOrder,
  verifyCashfreeWebhookSignature,
  getCashfreeConfig
} = require('../services/cashfreeService');
const { collections } = require('../config/db');
const { successResponse, errorResponse } = require('../utils/apiResponse');

/**
 * Create a new Cashfree PG Order
 * POST /api/payments/cashfree/create-order
 */
async function createOrder(req, res, next) {
  try {
    const {
      amount,
      currency = 'INR',
      purpose = 'COURSE_ADMISSION_FEE',
      customerDetails = {},
      orderNote,
      studentId
    } = req.body;

    if (!amount || Number(amount) < 1) {
      return errorResponse(res, 'Payment amount must be at least ₹1.00', 400);
    }

    const effectiveStudentId = req.user ? req.user.id : (studentId || null);
    const effectiveName = customerDetails.name || (req.user ? req.user.fullName : 'Student Aspirant');
    const effectivePhone = customerDetails.phone || customerDetails.mobile || (req.user ? req.user.mobile : '9876543210');
    const effectiveEmail = customerDetails.email || (req.user ? req.user.email : 'admissions@rankerspath.in');

    const result = await createCashfreeOrder({
      amount,
      currency,
      purpose,
      orderNote: orderNote || `Rankers Path: ${purpose}`,
      studentId: effectiveStudentId,
      customerDetails: {
        id: effectiveStudentId,
        name: effectiveName,
        phone: effectivePhone,
        email: effectiveEmail
      }
    });

    return successResponse(res, 'Cashfree order created successfully', {
      order_id: result.order_id,
      payment_session_id: result.payment_session_id,
      order_status: result.order_status,
      order_amount: result.order_amount,
      order_currency: result.order_currency,
      receipt_number: result.receipt_number,
      app_id: getCashfreeConfig().appId,
      environment: getCashfreeConfig().env
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Verify and confirm Cashfree Payment
 * POST /api/payments/cashfree/verify
 */
async function verifyPayment(req, res, next) {
  try {
    const { order_id, orderId } = req.body;
    const finalOrderId = order_id || orderId;

    if (!finalOrderId) {
      return errorResponse(res, 'order_id is required', 400);
    }

    const verification = await verifyCashfreeOrder(finalOrderId);

    if (!verification.success) {
      return errorResponse(res, verification.message, 400);
    }

    return successResponse(res, verification.message, {
      order_id: verification.order_id,
      cf_payment_id: verification.cf_payment_id,
      payment_method: verification.payment_method,
      receipt_number: verification.receipt_number,
      payment: verification.payment
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Cashfree Webhook Listener
 * POST /api/payments/cashfree/webhook
 */
async function handleWebhook(req, res, next) {
  try {
    const signature = req.headers['x-webhook-signature'];
    const timestamp = req.headers['x-webhook-timestamp'];
    const rawBody = JSON.stringify(req.body);

    const isValid = verifyCashfreeWebhookSignature(rawBody, timestamp, signature);
    if (!isValid && process.env.NODE_ENV === 'production') {
      console.warn('Invalid Cashfree webhook signature received');
      return res.status(400).json({ status: 'INVALID_SIGNATURE' });
    }

    const event = req.body;
    console.log('Cashfree Webhook Event received:', event?.type || 'UNKNOWN');

    if (event?.data?.order?.order_id) {
      await verifyCashfreeOrder(event.data.order.order_id);
    }

    return res.status(200).json({ status: 'SUCCESS' });
  } catch (err) {
    console.error('Webhook processing error:', err.message);
    return res.status(500).json({ status: 'ERROR', message: err.message });
  }
}

/**
 * Get Cashfree Order Status and Fee Receipt
 * GET /api/payments/cashfree/status/:orderId
 */
async function getOrderStatus(req, res, next) {
  try {
    const { orderId } = req.params;
    const payment = collections.payments.findOne({ transactionId: orderId }) ||
                    collections.payments.findOne({ orderId: orderId });

    if (!payment) {
      return errorResponse(res, 'Payment transaction not found', 404);
    }

    return successResponse(res, 'Payment details retrieved', payment);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createOrder,
  verifyPayment,
  handleWebhook,
  getOrderStatus
};
