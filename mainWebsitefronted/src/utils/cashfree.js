/**
 * Cashfree Payments PG v3 SDK Web Helper
 * Official SDK: https://sdk.cashfree.com/js/v3/cashfree.js
 */

export const loadCashfreeScript = () => {
  return new Promise((resolve) => {
    if (window.Cashfree) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      console.warn('Cashfree SDK script failed to load from CDN. Using local checkout handler.');
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

/**
 * Open Cashfree Checkout Modal
 * @param {Object} params
 * @param {string} params.paymentSessionId - Required session ID returned from backend
 * @param {string} [params.returnUrl] - Fallback redirect URL
 * @param {Function} [params.onSuccess] - Callback when payment succeeds
 * @param {Function} [params.onFailure] - Callback when payment fails
 * @param {Function} [params.onDismiss] - Callback when user closes without paying
 */
export const openCashfreeCheckout = async ({
  paymentSessionId,
  environment = 'TEST',
  returnUrl,
  onSuccess,
  onFailure,
  onDismiss
}) => {
  if (!paymentSessionId) {
    throw new Error('paymentSessionId is required to launch Cashfree checkout');
  }

  const isLoaded = await loadCashfreeScript();
  const envMode = (environment || import.meta.env.VITE_CASHFREE_ENV || 'TEST').toUpperCase();
  const sdkMode = envMode === 'PROD' || envMode === 'PRODUCTION' ? 'production' : 'sandbox';

  if (!isLoaded || typeof window.Cashfree !== 'function') {
    const err = new Error('Cashfree Web SDK could not be loaded from CDN. Please verify internet connection.');
    if (onFailure) onFailure(err);
    throw err;
  }

  try {
    const cashfree = window.Cashfree({ mode: sdkMode });
    const checkoutOptions = {
      paymentSessionId: paymentSessionId,
      redirectTarget: '_modal' // Opens official Cashfree checkout modal popup
    };

    if (returnUrl) {
      checkoutOptions.returnUrl = returnUrl;
    }

    const result = await cashfree.checkout(checkoutOptions);

    if (result && result.error) {
      console.warn('Cashfree checkout modal notice:', result.error);
      if (onFailure) onFailure(result.error);
      return { success: false, error: result.error };
    }

    if (result && result.paymentDetails) {
      if (onSuccess) onSuccess(result.paymentDetails);
      return { success: true, paymentDetails: result.paymentDetails };
    }

    // If user dismissed modal
    if (onDismiss) onDismiss();
    return { success: false, cancelled: true };
  } catch (sdkErr) {
    console.error('Cashfree checkout execution error:', sdkErr);
    if (onFailure) onFailure(sdkErr);
    return { success: false, error: sdkErr };
  }
};
