// ==================== server/middleware/auth.js ====================
const TokenUtils = require("../utils/tokenUtils");

// Main authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ 
      error: "Access token is required",
      code: "NO_TOKEN"
    });
  }

  try {
    const decoded = TokenUtils.verifyToken(token);
    req.user = decoded;
    req.token = token;
    next();
  } catch (error) {
    let errorResponse = { error: "Invalid or expired token" };
    
    if (error.name === 'TokenExpiredError') {
      errorResponse.code = "TOKEN_EXPIRED";
      errorResponse.error = "Token has expired";
    } else if (error.name === 'JsonWebTokenError') {
      errorResponse.code = "INVALID_TOKEN";
      errorResponse.error = "Invalid token format";
    }
    
    return res.status(403).json(errorResponse);
  }
};

// Middleware chỉ cho phép admin
const requireAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ 
      error: "Admin access required",
      code: "INSUFFICIENT_PERMISSIONS"
    });
  }
  next();
};

// Middleware chỉ cho phép team
const requireTeam = (req, res, next) => {
  if (req.user.role !== "team") {
    return res.status(403).json({ 
      error: "Team access required",
      code: "INSUFFICIENT_PERMISSIONS"
    });
  }
  next();
};

// Middleware cho phép cả admin và team
const requireAuth = (req, res, next) => {
  if (!req.user || !req.user.role) {
    return res.status(403).json({ 
      error: "Authentication required",
      code: "NO_AUTH"
    });
  }
  next();
};

// Middleware để check ownership (team chỉ có thể access data của mình)
const checkTeamOwnership = (req, res, next) => {
  if (req.user.role === "admin") {
    // Admin có thể access tất cả
    next();
  } else if (req.user.role === "team") {
    // Team chỉ có thể access data của mình
    const requestedTeamId = req.params.teamId || req.body.teamId || req.query.teamId;
    
    if (requestedTeamId && parseInt(requestedTeamId) !== req.user.teamId) {
      return res.status(403).json({ 
        error: "Access denied: You can only access your own team data",
        code: "TEAM_ACCESS_DENIED"
      });
    }
    next();
  } else {
    return res.status(403).json({ 
      error: "Invalid role",
      code: "INVALID_ROLE"
    });
  }
};

module.exports = {
  authenticateToken,
  requireAdmin,
  requireTeam,
  requireAuth,
  checkTeamOwnership,
};