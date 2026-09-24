const { errorResponse } = require('../utils/apiResponse');

/**
 * Enforce one or more allowed user roles
 * e.g. roleMiddleware(['admin', 'superadmin'])
 */
function roleMiddleware(allowedRoles = []) {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return errorResponse(res, 'Access denied. Role not authenticated.', 403);
    }

    if (!allowedRoles.includes(req.user.role)) {
      return errorResponse(
        res,
        `Access denied. Requires one of [${allowedRoles.join(', ')}] permissions.`,
        403
      );
    }

    next();
  };
}

module.exports = {
  roleMiddleware
};
