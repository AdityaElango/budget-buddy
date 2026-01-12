/**
 * Authorization Middleware
 * Checks user roles and permissions
 */

const checkRole = (requiredRole) => {
  return (req, res, next) => {
    try {
      const user = req.user; // Set by authentication middleware

      if (!user) {
        return res.status(401).json({
          status: 401,
          message: "User not authenticated",
        });
      }

      if (user.role !== requiredRole && requiredRole !== "any") {
        return res.status(403).json({
          status: 403,
          message: `Access denied. Required role: ${requiredRole}`,
        });
      }

      next();
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: "Authorization check failed",
        error: error.message,
      });
    }
  };
};

const checkPermission = (requiredRoles = []) => {
  return (req, res, next) => {
    try {
      const user = req.user; // Set by authentication middleware

      if (!user) {
        return res.status(401).json({
          status: 401,
          message: "User not authenticated",
        });
      }

      if (!requiredRoles.includes(user.role)) {
        return res.status(403).json({
          status: 403,
          message: `Access denied. Required roles: ${requiredRoles.join(", ")}`,
        });
      }

      next();
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: "Permission check failed",
        error: error.message,
      });
    }
  };
};

module.exports = {
  checkRole,
  checkPermission,
};
