// Usage: authorize('Admin', 'Editor')
exports.authorize = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ message: `Access denied for role: ${req.user?.role || 'guest'}` });
  }
  next();
};