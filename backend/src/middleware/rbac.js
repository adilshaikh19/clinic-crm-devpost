const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    console.log("requireRole: Checking permissions for user:", req.user?.role);
    console.log("requireRole: Allowed roles:", allowedRoles);

    if (!req.user) {
      console.log("requireRole: No user found in request.");
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
        statusCode: 401
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      console.log("requireRole: Insufficient permissions. User role not in allowed roles.");
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions',
        statusCode: 403
      });
    }

    console.log("requireRole: Permissions granted.");
    next();
  };
};

module.exports = {
  requireRole
};