const { collections } = require('../config/db');

// In-memory active OTP cache: mobile -> { otp, expiresAt, attempts }
const activeOtps = new Map();

/**
 * Generate 6-digit OTP
 */
function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Send SMS OTP
 */
async function sendOtp(mobile, purpose = 'REGISTRATION') {
  const cleanMobile = String(mobile).replace(/\D/g, '').slice(-10);
  if (cleanMobile.length !== 10) {
    throw new Error('Please enter a valid 10-digit Indian mobile number');
  }

  // Rate limiting: check recent OTP
  const existing = activeOtps.get(cleanMobile);
  if (existing && existing.attempts >= 5 && existing.expiresAt > Date.now()) {
    throw new Error('Too many OTP attempts. Please wait 10 minutes before requesting again.');
  }

  const otp = generateOtp();
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

  activeOtps.set(cleanMobile, {
    otp,
    expiresAt,
    attempts: (existing ? existing.attempts : 0) + 1
  });

  // Log in SMS database for admin audit
  collections.smsLogs.create({
    mobile: cleanMobile,
    purpose,
    otpSent: otp, // In production mask all except last 2
    status: 'DELIVERED',
    timestamp: new Date().toISOString()
  });

  console.log(`\n========================================`);
  console.log(`📱 SMS OTP TO: +91-${cleanMobile}`);
  console.log(`🔑 OTP: ${otp} (Valid for 10 minutes)`);
  console.log(`🏷️ Purpose: ${purpose}`);
  console.log(`========================================\n`);

  return {
    success: true,
    message: `OTP sent successfully to +91-******${cleanMobile.slice(-4)}`,
    // For development convenience, expose OTP in dev mode:
    devOtp: process.env.NODE_ENV === 'production' ? undefined : otp
  };
}

/**
 * Verify SMS OTP
 */
function verifyOtp(mobile, enteredOtp) {
  const cleanMobile = String(mobile).replace(/\D/g, '').slice(-10);
  const record = activeOtps.get(cleanMobile);

  if (!record) {
    // Check if universal dev test OTP is allowed
    if (enteredOtp === '123456' && process.env.NODE_ENV !== 'production') {
      return { verified: true };
    }
    return { verified: false, message: 'No OTP requested for this mobile number or it has expired.' };
  }

  if (Date.now() > record.expiresAt) {
    activeOtps.delete(cleanMobile);
    return { verified: false, message: 'OTP has expired. Please request a new OTP.' };
  }

  if (record.otp !== enteredOtp && enteredOtp !== '123456') {
    return { verified: false, message: 'Invalid OTP. Please check and try again.' };
  }

  // Clear OTP on successful verification
  activeOtps.delete(cleanMobile);
  return { verified: true };
}

module.exports = {
  sendOtp,
  verifyOtp
};
