// Authentication middleware to check if user is logged in
exports.isAuthenticated = (req, res, next) => {
  if (req.session && req.session.isAuthenticated) {
    return next();
  }
  else {
    return res.status(401).json({ message: "Unauthorized - Please login" });
  }
 
};

// Middleware to check if user is employee
exports.isEmployee = (req, res, next) => {
  if (
    req.session &&
    req.session.isAuthenticated &&
    req.session.user_type === "employee"
  ) {
    return next();
  }
  return res
    .status(403)
    .json({ message: "Forbidden - Employee access required" });
};

// Middleware to check if user is client/customer
exports.isClient = (req, res, next) => {
  if (
    req.session &&
    req.session.isAuthenticated &&
    req.session.user_type === "client"
  ) {
    return next();
  }
  return res
    .status(403)
    .json({ message: "Forbidden - Client access required" });
};

// Middleware to get current user info (doesn't block, just adds to request)
exports.getCurrentUser = (req, res, next) => {
  if (req.session && req.session.isAuthenticated) {
    req.currentUser = {
      id: req.session.userId,
      username: req.session.username,
      email: req.session.email,
      user_type: req.session.user_type,
    };
  }
  return next();
};
