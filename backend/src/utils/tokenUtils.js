// ==================== server/utils/tokenUtils.js ====================
const jwt = require("jsonwebtoken");
const JWT_CONFIG = require("../config/jwt");

class TokenUtils {
  // Tạo access token
  static generateAccessToken(payload) {
    return jwt.sign(payload, JWT_CONFIG.secret, {
      expiresIn: JWT_CONFIG.expiresIn,
      algorithm: JWT_CONFIG.algorithm
    });
  }

  // Verify token
  static verifyToken(token) {
    try {
      return jwt.verify(token, JWT_CONFIG.secret);
    } catch (error) {
      throw error;
    }
  }

  // Decode token không verify (để check expiration)
  static decodeToken(token) {
    try {
      return jwt.decode(token);
    } catch (error) {
      return null;
    }
  }

  // Check if token is expired
  static isTokenExpired(token) {
    try {
      const decoded = this.decodeToken(token);
      if (!decoded || !decoded.exp) return true;
      
      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp < currentTime;
    } catch (error) {
      return true;
    }
  }

  // Check if token expires soon (within 30 minutes)
  static isTokenExpiringSoon(token, minutesThreshold = 30) {
    try {
      const decoded = this.decodeToken(token);
      if (!decoded || !decoded.exp) return true;
      
      const currentTime = Math.floor(Date.now() / 1000);
      const thresholdTime = minutesThreshold * 60; // Convert to seconds
      
      return (decoded.exp - currentTime) < thresholdTime;
    } catch (error) {
      return true;
    }
  }
}

module.exports = TokenUtils;