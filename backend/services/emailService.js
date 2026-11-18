const nodemailer = require('nodemailer');

// In-memory active Admin OTP cache: email -> { otp, expiresAt, attempts }
const activeAdminOtps = new Map();

/**
 * Generate a cryptographically sound random 5-digit OTP (10000 - 99999)
 */
function generateFiveDigitOtp() {
  return Math.floor(10000 + Math.random() * 90000).toString();
}

/**
 * Create a nodemailer transporter if environment variables are provided
 */
function getTransporter() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER || process.env.EMAIL_USER;
  const pass = process.env.SMTP_PASS || process.env.EMAIL_PASS;

  if (host && user && pass) {
    return nodemailer.createTransport({
      host,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true' || process.env.SMTP_PORT === '465',
      auth: { user, pass }
    });
  }

  if (user && pass) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: { user, pass }
    });
  }

  return null;
}

/**
 * Send 5-digit OTP to Admin Email for Password Reset
 */
async function sendAdminPasswordOtp(email, adminName = 'Administrator') {
  const cleanEmail = String(email).trim().toLowerCase();
  if (!cleanEmail || !cleanEmail.includes('@')) {
    throw new Error('Please enter a valid administrator email address');
  }

  // Rate limiting: check recent OTP
  const existing = activeAdminOtps.get(cleanEmail);
  if (existing && existing.attempts >= 5 && existing.expiresAt > Date.now()) {
    throw new Error('Too many OTP attempts. Please wait 10 minutes before requesting again.');
  }

  const otp = generateFiveDigitOtp();
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes validity

  activeAdminOtps.set(cleanEmail, {
    otp,
    expiresAt,
    attempts: 0,
    createdAt: Date.now()
  });

  // Always log visibly in server terminal / PM2 logs
  console.log(`\n======================================================`);
  console.log(`📧 [ADMIN PASSWORD RESET] 5-DIGIT OTP`);
  console.log(`📨 Sent To: ${cleanEmail}`);
  console.log(`🔑 5-Digit OTP: ${otp} (Valid for 10 minutes)`);
  console.log(`⏰ Time: ${new Date().toISOString()}`);
  console.log(`======================================================\n`);

  const transporter = getTransporter();
  let emailSent = false;

  if (transporter) {
    try {
      const fromSender = process.env.EMAIL_FROM || process.env.SMTP_USER || process.env.EMAIL_USER || 'no-reply@rankerspath.co.in';
      await transporter.sendMail({
        from: `"Rankers Path Security" <${fromSender}>`,
        to: cleanEmail,
        subject: `${otp} is your Rankers Path Admin Password Reset OTP`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 560px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.06);">
            <div style="background: linear-gradient(135deg, #071126 0%, #0B1B3D 100%); padding: 28px 24px; text-align: center; border-bottom: 3px solid #F59E0B;">
              <h2 style="margin: 0; font-size: 22px; color: #ffffff; letter-spacing: 0.5px;">RANKERS PATH</h2>
              <p style="margin: 6px 0 0; font-size: 13px; color: #FBBF24; font-weight: 600;">Safalta Ka Sankalp &bull; Institutional ERP Security</p>
            </div>
            <div style="padding: 32px 28px; color: #1e293b;">
              <p style="font-size: 15px; margin-top: 0; color: #334155;">Hello <strong>${adminName}</strong>,</p>
              <p style="font-size: 14px; color: #475569; line-height: 1.6;">
                A password reset request was initiated for your administrator account on the Rankers Path Management Portal.
              </p>
              <div style="margin: 28px 0; text-align: center;">
                <div style="display: inline-block; background: #FEF3C7; border: 2px dashed #F59E0B; border-radius: 12px; padding: 14px 32px;">
                  <span style="font-size: 34px; font-weight: 800; letter-spacing: 8px; color: #071126; font-family: monospace;">
                    ${otp}
                  </span>
                </div>
                <p style="margin: 10px 0 0; font-size: 12px; color: #b45309; font-weight: 600;">
                  Valid for 10 minutes &bull; 5-Digit Verification Code
                </p>
              </div>
              <p style="font-size: 13px; color: #64748b; line-height: 1.5;">
                Enter this 5-digit OTP along with your new password on the admin reset screen to complete the update. Do NOT share this code with anyone.
              </p>
              <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 24px 0;" />
              <p style="font-size: 12px; color: #94a3b8; margin-bottom: 0;">
                If you did not request this password reset, please contact the IT administration immediately.
              </p>
            </div>
          </div>
        `
      });
      emailSent = true;
      console.log(`✅ Reset email successfully delivered via SMTP to ${cleanEmail}`);
    } catch (sendErr) {
      console.warn(`⚠️ SMTP delivery failed to ${cleanEmail}: ${sendErr.message}. OTP logged to console.`);
    }
  } else {
    console.log(`ℹ️ SMTP credentials not configured in backend/.env. OTP logged to console.`);
  }

  return {
    success: true,
    message: `5-digit OTP sent successfully to ${cleanEmail}. Check your inbox or spam folder.`,
    emailSent,
    devOtp: (!transporter || process.env.NODE_ENV !== 'production') ? otp : undefined
  };
}

/**
 * Verify 5-digit OTP
 */
function verifyAdminEmailOtp(email, enteredOtp) {
  const cleanEmail = String(email).trim().toLowerCase();
  const cleanOtp = String(enteredOtp).trim();
  const record = activeAdminOtps.get(cleanEmail);

  if (!record) {
    return { verified: false, message: 'No OTP requested for this email or it has expired.' };
  }

  if (Date.now() > record.expiresAt) {
    activeAdminOtps.delete(cleanEmail);
    return { verified: false, message: '5-digit OTP has expired. Please request a new OTP.' };
  }

  if (record.attempts >= 5) {
    activeAdminOtps.delete(cleanEmail);
    return { verified: false, message: 'Too many incorrect attempts. Please request a new OTP.' };
  }

  if (record.otp !== cleanOtp) {
    record.attempts += 1;
    return { verified: false, message: 'Invalid 5-digit OTP. Please enter the correct code.' };
  }

  return { verified: true };
}

/**
 * Clear OTP on successful password change
 */
function clearAdminEmailOtp(email) {
  const cleanEmail = String(email).trim().toLowerCase();
  activeAdminOtps.delete(cleanEmail);
}

module.exports = {
  generateFiveDigitOtp,
  sendAdminPasswordOtp,
  verifyAdminEmailOtp,
  clearAdminEmailOtp
};
