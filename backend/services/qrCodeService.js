const QRCode = require('qrcode');

/**
 * Generate Base64 Data URL for a digital admit card QR code
 */
async function generateAdmitCardQR(payload) {
  try {
    const dataString = typeof payload === 'object' ? JSON.stringify(payload) : String(payload);
    const qrDataUrl = await QRCode.toDataURL(dataString, {
      errorCorrectionLevel: 'H',
      margin: 2,
      width: 256,
      color: {
        dark: '#0B1B3D', // Match brand navy
        light: '#FFFFFF'
      }
    });
    return qrDataUrl;
  } catch (err) {
    console.error('Error generating QR code:', err.message);
    return null;
  }
}

module.exports = {
  generateAdmitCardQR
};
