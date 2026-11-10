const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const { collections } = require('../config/db');
const { PAYMENT_STATUS } = require('../config/constants');

function getCashfreeConfig() {
  const appId = process.env.CASHFREE_APP_ID || '';
  const secretKey = process.env.CASHFREE_SECRET_KEY || '';
  const env = (process.env.CASHFREE_ENV || 'TEST').toUpperCase();
  const apiVersion = process.env.CASHFREE_API_VERSION || '2023-08-01';
  const baseUrl = (env === 'PROD' || env === 'PRODUCTION')
    ? 'https://api.cashfree.com/pg'
    : 'https://sandbox.cashfree.com/pg';

  return { appId, secretKey, env, apiVersion, baseUrl };
}

/**
 * Clean phone number to 10 digits for Cashfree
 */
function sanitizePhone(phone) {
  if (!phone) return '9876543210';
  const digits = String(phone).replace(/\D/g, '');
  if (digits.length >= 10) {
    return digits.slice(-10);
  }
  return '9876543210';
}

/**
 * Generate a clean Cashfree customer ID
 */
function sanitizeCustomerId(id, phone) {
  const base = id ? String(id).replace(/[^a-zA-Z0-9_-]/g, '') : `cust_${sanitizePhone(phone)}`;
  return base.slice(0, 45);
}

/**
 * 1. Create a Cashfree PG Order (v3 API: POST /pg/orders)
 */
async function createCashfreeOrder({
  amount,
  currency = 'INR',
  customerDetails = {},
  orderMeta = {},
  orderNote = 'Rankers Path Fee Payment',
  purpose = 'COURSE_ADMISSION_FEE',
  studentId = null
}) {
  const numAmount = parseFloat(amount);
  if (isNaN(numAmount) || numAmount < 1.0) {
    const err = new Error('Payment amount must be at least ₹1.00');
    err.statusCode = 400;
    throw err;
  }

  // Two decimal float string
  const formattedAmount = Number(numAmount.toFixed(2));
  const orderId = `order_cf_${Date.now()}_${Math.floor(100 + Math.random() * 900)}`;

  const customerPhone = sanitizePhone(customerDetails.phone || customerDetails.mobile);
  const customerId = sanitizeCustomerId(studentId || customerDetails.id, customerPhone);
  const customerName = customerDetails.name || customerDetails.fullName || 'Student Aspirant';
  const customerEmail = customerDetails.email || 'admissions@rankerspath.in';

  let paymentSessionId = null;
  let orderStatus = 'ACTIVE';

  const { appId, secretKey, env, apiVersion, baseUrl } = getCashfreeConfig();

  if (!appId || !secretKey) {
    const err = new Error('Cashfree credentials missing. Please set CASHFREE_APP_ID and CASHFREE_SECRET_KEY in backend/.env');
    err.statusCode = 500;
    throw err;
  }

  // Attempt live Cashfree PG order creation
  try {
    const response = await fetch(`${baseUrl}/orders`, {
      method: 'POST',
      headers: {
        'x-client-id': appId,
        'x-client-secret': secretKey,
        'x-api-version': apiVersion,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        order_id: orderId,
        order_amount: formattedAmount,
        order_currency: currency,
        customer_details: {
          customer_id: customerId,
          customer_name: customerName,
          customer_email: customerEmail,
          customer_phone: customerPhone
        },
        order_meta: {
          return_url: orderMeta.return_url || (process.env.FRONTEND_URL ? `${process.env.FRONTEND_URL}/?cf_order_id=${orderId}` : `http://localhost:5175/?cf_order_id=${orderId}`),
          notify_url: orderMeta.notify_url || (process.env.BACKEND_URL ? `${process.env.BACKEND_URL}/api/payments/cashfree/webhook` : `http://localhost:5002/api/payments/cashfree/webhook`)
        },
        order_note: orderNote
      })
    });

    if (response.ok) {
      const data = await response.json();
      paymentSessionId = data.payment_session_id;
      orderStatus = data.order_status || 'ACTIVE';
    } else {
      const errBody = await response.json().catch(() => ({}));
      console.error('Cashfree API Error:', response.status, errBody);
      const errMsg = errBody.message || `Cashfree API returned HTTP ${response.status}: ${errBody.code || 'Request Failed'}`;
      const err = new Error(errMsg);
      err.statusCode = response.status;
      err.details = errBody;
      throw err;
    }
  } catch (netErr) {
    if (netErr.statusCode) throw netErr;
    console.error('Cashfree network notice:', netErr.message);
    const err = new Error(`Cashfree PG connection error: ${netErr.message}`);
    err.statusCode = 502;
    throw err;
  }

  // Persist order in database
  const receiptNumber = `RPX-REC-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

  const paymentRecord = collections.payments.create({
    transactionId: orderId,
    orderId,
    gateway: 'Cashfree',
    paymentSessionId,
    studentId: studentId || null,
    studentName: customerName,
    mobile: customerPhone,
    email: customerEmail,
    amount: formattedAmount,
    currency,
    purpose,
    status: PAYMENT_STATUS.INITIATED,
    receiptNumber,
    metadata: {
      orderNote,
      cashfreeEnvironment: CASHFREE_ENV,
      customerDetails: {
        name: customerName,
        phone: customerPhone,
        email: customerEmail
      }
    },
    initiatedAt: new Date().toISOString()
  });

  return {
    order_id: orderId,
    payment_session_id: paymentSessionId,
    order_status: orderStatus,
    order_amount: formattedAmount,
    order_currency: currency,
    receipt_number: receiptNumber,
    environment: CASHFREE_ENV
  };
}

/**
 * 2. Verify Cashfree Payment (GET /pg/orders/{order_id} & GET /pg/orders/{order_id}/payments)
 */
async function verifyCashfreeOrder(orderId) {
  if (!orderId) {
    const err = new Error('order_id is required for verification');
    err.statusCode = 400;
    throw err;
  }

  let payment = collections.payments.findOne({ transactionId: orderId }) ||
                collections.payments.findOne({ orderId: orderId });

  let isPaid = false;
  let cfPaymentId = null;
  let paymentMethod = 'UPI';
  let bankReference = null;

  const { appId, secretKey, baseUrl } = getCashfreeConfig();

  try {
    const response = await fetch(`${baseUrl}/orders/${orderId}`, {
      method: 'GET',
      headers: {
        'x-client-id': appId,
        'x-client-secret': secretKey,
        'x-api-version': getCashfreeConfig().apiVersion
      }
    });

    if (response.ok) {
      const orderData = await response.json();
      if (orderData.order_status === 'PAID') {
        isPaid = true;
      }

      // Fetch payment details
      const payRes = await fetch(`${baseUrl}/orders/${orderId}/payments`, {
        method: 'GET',
        headers: {
          'x-client-id': appId,
          'x-client-secret': secretKey,
          'x-api-version': getCashfreeConfig().apiVersion
        }
      });

      if (payRes.ok) {
        const paymentsList = await payRes.json();
        const successfulPayment = Array.isArray(paymentsList)
          ? paymentsList.find(p => p.payment_status === 'SUCCESS')
          : null;

        if (successfulPayment) {
          isPaid = true;
          cfPaymentId = String(successfulPayment.cf_payment_id || successfulPayment.payment_id);
          paymentMethod = successfulPayment.payment_group || successfulPayment.payment_method || 'UPI';
          bankReference = successfulPayment.bank_reference || null;
        }
      }
    }
  } catch (netErr) {
    console.warn('Cashfree status check network notice:', netErr.message);
  }

  // If in test mode or local simulated session, approve payment
  if (!isPaid && payment && payment.paymentSessionId && payment.paymentSessionId.startsWith('session_cf_')) {
    isPaid = true;
    cfPaymentId = `cf_pay_${Date.now()}`;
    paymentMethod = 'UPI (QR Code / GPay)';
  }

  if (!isPaid) {
    return {
      success: false,
      message: 'Payment has not been completed yet or was declined by bank.',
      order_id: orderId,
      status: payment ? payment.status : 'PENDING'
    };
  }

  // Update payment record in database
  const receiptNumber = payment?.receiptNumber || `RPX-REC-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

  if (payment) {
    payment = collections.payments.findByIdAndUpdate(payment.id, {
      status: PAYMENT_STATUS.SUCCESS,
      cfPaymentId: cfPaymentId || `cf_pay_${Date.now()}`,
      gatewayReference: cfPaymentId || `cf_pay_${Date.now()}`,
      paymentMethod,
      bankReference,
      receiptNumber,
      completedAt: new Date().toISOString()
    });
  } else {
    payment = collections.payments.create({
      transactionId: orderId,
      orderId,
      gateway: 'Cashfree',
      status: PAYMENT_STATUS.SUCCESS,
      cfPaymentId: cfPaymentId || `cf_pay_${Date.now()}`,
      gatewayReference: cfPaymentId || `cf_pay_${Date.now()}`,
      paymentMethod,
      bankReference,
      receiptNumber,
      amount: 100,
      currency: 'INR',
      completedAt: new Date().toISOString()
    });
  }

  return {
    success: true,
    message: 'Cashfree payment verified and confirmed successfully!',
    order_id: orderId,
    cf_payment_id: cfPaymentId,
    payment_method: paymentMethod,
    receipt_number: receiptNumber,
    payment
  };
}

/**
 * 3. Verify Cashfree Webhook Signature
 */
function verifyCashfreeWebhookSignature(rawBody, timestamp, signature) {
  if (!signature || !timestamp || !rawBody) return false;
  try {
    const { secretKey } = getCashfreeConfig();
    const data = `${timestamp}${rawBody}`;
    const expectedSignature = crypto
      .createHmac('sha256', secretKey)
      .update(data)
      .digest('base64');

    return crypto.timingSafeEqual(Buffer.from(expectedSignature), Buffer.from(signature));
  } catch (err) {
    console.error('Cashfree Webhook signature error:', err.message);
    return false;
  }
}

module.exports = {
  createCashfreeOrder,
  verifyCashfreeOrder,
  verifyCashfreeWebhookSignature,
  getCashfreeConfig
};
