const assert = require('assert');
const {
  createCashfreeOrder,
  verifyCashfreeOrder,
  verifyCashfreeWebhookSignature
} = require('../services/cashfreeService');
const { collections } = require('../config/db');

async function runTests() {
  console.log('--- Running Cashfree Integration Tests ---');

  // Test 1: Create Cashfree Order
  const orderRes = await createCashfreeOrder({
    amount: 200,
    currency: 'INR',
    purpose: 'RSAT_SCHOLARSHIP_REGISTRATION',
    orderNote: 'RSAT 2026 Test Fee',
    customerDetails: {
      name: 'Aarav Patel',
      phone: '9876543210',
      email: 'aarav.patel@gmail.com'
    }
  });

  console.log('Created Cashfree Order:', {
    order_id: orderRes.order_id,
    session: orderRes.payment_session_id.slice(0, 20) + '...',
    amount: orderRes.order_amount,
    receipt: orderRes.receipt_number
  });

  assert.ok(orderRes.order_id.startsWith('order_cf_'), 'Order ID should start with order_cf_');
  assert.ok(orderRes.payment_session_id, 'payment_session_id must be present');
  assert.strictEqual(orderRes.order_amount, 200);
  assert.ok(orderRes.receipt_number.startsWith('RPX-REC-'), 'Receipt number must start with RPX-REC-');
  console.log('✅ Test 1 Passed: Order created successfully with valid session and receipt number');

  // Test 2: Verify in DB
  const pendingInDb = collections.payments.findOne({ transactionId: orderRes.order_id });
  assert.ok(pendingInDb, 'Payment must be saved in database');
  assert.strictEqual(pendingInDb.gateway, 'Cashfree');
  assert.strictEqual(pendingInDb.status, 'INITIATED');
  console.log('✅ Test 2 Passed: Order successfully stored in payments collection with INITIATED status');

  // Test 3: Verify Payment
  const verifyRes = await verifyCashfreeOrder(orderRes.order_id);
  assert.strictEqual(verifyRes.success, true);
  assert.ok(verifyRes.cf_payment_id, 'cf_payment_id should be present');
  assert.strictEqual(verifyRes.receipt_number, orderRes.receipt_number);

  const completedInDb = collections.payments.findOne({ transactionId: orderRes.order_id });
  assert.strictEqual(completedInDb.status, 'SUCCESS');
  assert.ok(completedInDb.completedAt, 'completedAt timestamp must be recorded');
  console.log('✅ Test 3 Passed: Payment verification confirmed and marked SUCCESS in DB');

  // Test 4: Webhook Signature Verification
  const rawBody = JSON.stringify({ type: 'ORDER_PAID', data: { order: { order_id: orderRes.order_id } } });
  const timestamp = String(Date.now());
  const crypto = require('crypto');
  const secret = process.env.CASHFREE_SECRET_KEY || 'cfsk_ma_test_c9be9557b6f6345091c6bf4890fc2512_8293910c';
  const validSignature = crypto.createHmac('sha256', secret).update(timestamp + rawBody).digest('base64');

  const isSigValid = verifyCashfreeWebhookSignature(rawBody, timestamp, validSignature);
  assert.strictEqual(isSigValid, true, 'Webhook signature should match');
  console.log('✅ Test 4 Passed: Webhook HMAC-SHA256 signature verified successfully');

  console.log('\n🎉 ALL CASHFREE BACKEND TESTS PASSED PERFECTLY!');
}

runTests().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
