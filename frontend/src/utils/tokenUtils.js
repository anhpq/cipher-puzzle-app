// ==================== src/utils/tokenUtils.js ====================
class TokenUtils {
  static TOKEN_KEY = "auth_token";
  
  // Get token from localStorage
  static getToken() {
    try {
      return localStorage.getItem(this.TOKEN_KEY);
    } catch (error) {
      console.error("Error getting token:", error);
      return null;
    }
  }

  // Set token to localStorage
  static setToken(token) {
    try {
      if (token) {
        localStorage.setItem(this.TOKEN_KEY, token);
      } else {
        localStorage.removeItem(this.TOKEN_KEY);
      }
    } catch (error) {
      console.error("Error setting token:", error);
    }
  }

  // Remove token from localStorage
  static removeToken() {
    try {
      localStorage.removeItem(this.TOKEN_KEY);
    } catch (error) {
      console.error("Error removing token:", error);
    }
  }

  // Decode JWT token (without verification)
  static decodeToken(token) {
    try {
      if (!token) return null;
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch (error) {
      console.error("Error decoding token:", error);
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

  // Check if token expires soon (within specified minutes)
  static isTokenExpiringSoon(token, minutesThreshold = 30) {
    try {
      const decoded = this.decodeToken(token);
      if (!decoded || !decoded.exp) return true;
      
      const currentTime = Math.floor(Date.now() / 1000);
      const thresholdTime = minutesThreshold * 60;
      
      return (decoded.exp - currentTime) < thresholdTime;
    } catch (error) {
      return true;
    }
  }

  // Get token expiration time
  static getTokenExpiration(token) {
    try {
      const decoded = this.decodeToken(token);
      if (!decoded || !decoded.exp) return null;
      
      return new Date(decoded.exp * 1000);
    } catch (error) {
      return null;
    }
  }
}

export default TokenUtils;