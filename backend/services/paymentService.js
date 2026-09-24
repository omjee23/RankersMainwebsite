const { v4: uuidv4 } = require('uuid');
const { collections } = require('../config/db');
const { PAYMENT_STATUS } = require('../config/constants');

/**
 * Create a new payment order / transaction intent
 */
async function createPaymentIntent({ studentId, studentName, mobile, amount, purpose, metadata = {} }) {
  const transactionId = 'RP-' + Date.now() + '-' + Math.floor(1000 + Math.random() * 9000);

  const paymentRecord = collections.payments.create({
    transactionId,
    studentId,
    studentName,
    mobile,
    amount: Number(amount),
    currency: 'INR',
    purpose, // e.g. 'RANKX_REGISTRATION', 'RSAT_REGISTRATION', 'TEST_SERIES'
    status: PAYMENT_STATUS.INITIATED,
    gateway: 'Razorpay/PayU Gateway Simulation',
    metadata,
    initiatedAt: new Date().toISOString()
  });

  return {
    orderId: transactionId,
    amount,
    currency: 'INR',
    studentName,
    mobile,
    purpose,
    status: PAYMENT_STATUS.INITIATED
  };
}

/**
 * Verify and confirm payment
 */
async function verifyAndConfirmPayment({ orderId, status = PAYMENT_STATUS.SUCCESS, gatewayRef = '' }) {
  const payment = collections.payments.findOne({ transactionId: orderId });
  if (!payment) {
    throw new Error('Payment record not found for transaction: ' + orderId);
  }

  // Prevent duplicate processing
  if (payment.status === PAYMENT_STATUS.SUCCESS) {
    return payment;
  }

  const updated = collections.payments.findByIdAndUpdate(payment.id, {
    status: status === PAYMENT_STATUS.SUCCESS ? PAYMENT_STATUS.SUCCESS : PAYMENT_STATUS.FAILED,
    gatewayReference: gatewayRef || 'TXN-' + uuidv4().slice(0, 8),
    completedAt: new Date().toISOString()
  });

  return updated;
}

module.exports = {
  createPaymentIntent,
  verifyAndConfirmPayment
};
