const { errorResponse } = require('../utils/apiResponse');

function errorHandler(err, req, res, next) {
  console.error('Unhandled Application Error:', err.stack || err.message);

  if (res.headersSent) {
    return next(err);
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  return errorResponse(res, message, statusCode, process.env.NODE_ENV === 'development' ? err.stack : null);
}

module.exports = errorHandler;
