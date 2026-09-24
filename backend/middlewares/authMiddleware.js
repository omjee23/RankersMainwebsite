const jwt = require('jsonwebtoken');
const { errorResponse } = require('../utils/apiResponse');

const JWT_SECRET = process.env.JWT_SECRET || 'rankerspath-super-secure-key-2026';

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return errorResponse(res, 'Authentication token missing or invalid', 401);
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return errorResponse(res, 'Invalid or expired session token. Please log in again.', 401);
  }
}

module.exports = {
  authMiddleware,
  JWT_SECRET
};
