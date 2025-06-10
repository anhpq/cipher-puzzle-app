// backend/src/middleware/adminAuth.js
const TokenUtils = require("../utils/tokenUtils"); // Adjust path as needed

function adminAuth(req, res, next) {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ 
        error: 'Unauthorized: Access token is required',
        code: 'NO_TOKEN'
      });
    }

    // Verify and decode token
    const decoded = TokenUtils.verifyToken(token);
    
    // Check if user has admin role
    if (!decoded || decoded.role !== 'admin') {
      return res.status(403).json({ 
        error: 'Unauthorized: Admin access required',
        code: 'INSUFFICIENT_PERMISSIONS'
      });
    }

    // Attach user info to request object
    req.user = decoded;
    req.token = token;
    
    return next();
  } catch (error) {
    let errorResponse = { 
      error: 'Unauthorized: Please log in as admin',
      code: 'INVALID_TOKEN'
    };
    
    if (error.name === 'TokenExpiredError') {
      errorResponse.error = 'Unauthorized: Token has expired, please log in again';
      errorResponse.code = 'TOKEN_EXPIRED';
    } else if (error.name === 'JsonWebTokenError') {
      errorResponse.error = 'Unauthorized: Invalid token format';
      errorResponse.code = 'INVALID_TOKEN_FORMAT';
    }
    
    return res.status(401).json(errorResponse);
  }
}

module.exports = adminAuth;