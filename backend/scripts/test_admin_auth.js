const assert = require('assert');
const {
  staffLogin,
  requestAdminPasswordResetOtp,
  resetAdminPassword
} = require('../controllers/authController');
const { collections } = require('../config/db');
const bcrypt = require('bcryptjs');

function mockRes() {
  return {
    statusCode: 200,
    data: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.data = payload;
      return this;
    }
  };
}

async function runTests() {
  console.log('--- Starting Authentication & OTP In-Process Tests ---');

  // 1. Test Admin 1 Login
  console.log('\nTest 1: Admin 1 (rankerspath.edu@gmail.com) login...');
  const res1 = mockRes();
  await staffLogin({ body: { email: 'rankerspath.edu@gmail.com', password: 'Rankerspath@321' } }, res1, console.error);
  console.log('Status:', res1.statusCode, 'Body:', res1.data);
  assert.strictEqual(res1.statusCode, 200);
  assert.strictEqual(res1.data.success, true);
  assert.ok(res1.data.data.token);
  assert.strictEqual(res1.data.data.user.email, 'rankerspath.edu@gmail.com');
  console.log('✅ Admin 1 login verified!');

  // 2. Test Admin 2 Login
  console.log('\nTest 2: Admin 2 (omjeejob@gmail.com) login...');
  const res2 = mockRes();
  await staffLogin({ body: { email: 'omjeejob@gmail.com', password: 'Rankerspath@Om321' } }, res2, console.error);
  console.log('Status:', res2.statusCode, 'Body:', res2.data);
  assert.strictEqual(res2.statusCode, 200);
  assert.strictEqual(res2.data.success, true);
  assert.ok(res2.data.data.token);
  assert.strictEqual(res2.data.data.user.email, 'omjeejob@gmail.com');
  console.log('✅ Admin 2 login verified!');

  // 3. Test Old Admin Login Rejected
  console.log('\nTest 3: Old Admin (admin@rankerspath.in) login rejected...');
  const res3 = mockRes();
  await staffLogin({ body: { email: 'admin@rankerspath.in', password: 'Admin@123' } }, res3, console.error);
  console.log('Status:', res3.statusCode, 'Body:', res3.data);
  assert.strictEqual(res3.statusCode, 401);
  assert.strictEqual(res3.data.success, false);
  console.log('✅ Old admin rejection verified!');

  // 4. Test Request 5-Digit OTP for Forgot Password
  console.log('\nTest 4: Request 5-Digit OTP for rankerspath.edu@gmail.com...');
  const res4 = mockRes();
  await requestAdminPasswordResetOtp({ body: { email: 'rankerspath.edu@gmail.com' } }, res4, console.error);
  console.log('Status:', res4.statusCode, 'Body:', res4.data);
  assert.strictEqual(res4.statusCode, 200);
  assert.strictEqual(res4.data.success, true);
  const otp = res4.data.data.devOtp;
  console.log('Received OTP:', otp);
  assert.ok(otp);
  assert.strictEqual(otp.length, 5);
  assert.ok(/^\d{5}$/.test(otp), 'OTP must be exactly 5 digits');
  console.log('✅ 5-digit OTP generation verified!');

  // 5. Test Invalid OTP Rejected
  console.log('\nTest 5: Wrong OTP rejection...');
  const res5 = mockRes();
  await resetAdminPassword({
    body: {
      email: 'rankerspath.edu@gmail.com',
      otp: '99999',
      newPassword: 'NewPassword@321',
      confirmPassword: 'NewPassword@321'
    }
  }, res5, console.error);
  console.log('Status:', res5.statusCode, 'Body:', res5.data);
  assert.strictEqual(res5.statusCode, 400);
  assert.strictEqual(res5.data.success, false);
  console.log('✅ Wrong OTP rejection verified!');

  // 6. Test Mismatched Password Rejected
  console.log('\nTest 6: Password mismatch rejection...');
  const res6 = mockRes();
  await resetAdminPassword({
    body: {
      email: 'rankerspath.edu@gmail.com',
      otp,
      newPassword: 'Password1@123',
      confirmPassword: 'Password2@123'
    }
  }, res6, console.error);
  console.log('Status:', res6.statusCode, 'Body:', res6.data);
  assert.strictEqual(res6.statusCode, 400);
  console.log('✅ Password mismatch rejection verified!');

  // 7. Test Successful Password Reset
  console.log('\nTest 7: Valid Reset Password with 5-digit OTP...');
  const res7 = mockRes();
  await resetAdminPassword({
    body: {
      email: 'rankerspath.edu@gmail.com',
      otp,
      newPassword: 'UpdatedPassword@321',
      confirmPassword: 'UpdatedPassword@321'
    }
  }, res7, console.error);
  console.log('Status:', res7.statusCode, 'Body:', res7.data);
  assert.strictEqual(res7.statusCode, 200);
  assert.strictEqual(res7.data.success, true);
  console.log('✅ Password reset successful!');

  // 8. Test Login with New Password
  console.log('\nTest 8: Login with Updated Password...');
  const res8 = mockRes();
  await staffLogin({ body: { email: 'rankerspath.edu@gmail.com', password: 'UpdatedPassword@321' } }, res8, console.error);
  assert.strictEqual(res8.statusCode, 200);
  assert.strictEqual(res8.data.success, true);
  console.log('✅ Login with updated password successful!');

  // 9. Reset back to requested production password
  const user = collections.users.findOne({ email: 'rankerspath.edu@gmail.com' });
  collections.users.findByIdAndUpdate(user.id, {
    password: bcrypt.hashSync('Rankerspath@321', 10),
    updatedAt: new Date().toISOString()
  });
  console.log('\n✅ Restored Admin 1 password back to specified production password (Rankerspath@321)');

  console.log('\n=========================================');
  console.log('🎉 ALL 9 AUTHENTICATION TESTS PASSED 100%!');
  console.log('=========================================');
}

runTests().catch(err => {
  console.error('Test Failed:', err);
  process.exit(1);
});
