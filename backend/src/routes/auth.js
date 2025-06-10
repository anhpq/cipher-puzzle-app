// ==================== server/routes/auth.js ====================
require("dotenv").config();
const express = require("express");
const router = express.Router();
const pool = require("../db");
const TokenUtils = require("../utils/tokenUtils");
const { authenticateToken } = require("../middleware/auth");

// POST /api/login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      error: "Username and password are required",
      code: "MISSING_CREDENTIALS",
    });
  }

  try {
    // Admin login
    if (username.toLowerCase() === "admin") {
      if (password === process.env.ADMIN_PASSWORD) {
        const tokenPayload = {
          role: "admin",
          username: "admin",
          loginTime: Math.floor(Date.now() / 1000),
        };

        const token = TokenUtils.generateAccessToken(tokenPayload);

        return res.json({
          message: "Admin login successful",
          role: "admin",
          token,
          expiresIn: "1d",
          user: {
            username: "admin",
            role: "admin",
          },
        });
      } else {
        return res.status(401).json({
          error: "Invalid admin credentials",
          code: "INVALID_CREDENTIALS",
        });
      }
    }

    // Team login
    const result = await pool.query(
      "SELECT * FROM teams WHERE team_name = $1",
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Team not found",
        code: "TEAM_NOT_FOUND",
      });
    }

    const team = result.rows[0];

    if (password === team.password) {
      const tokenPayload = {
        role: "team",
        teamId: team.team_id,
        teamName: team.team_name,
        loginTime: Math.floor(Date.now() / 1000),
      };

      const token = TokenUtils.generateAccessToken(tokenPayload);

      return res.json({
        message: "Team login successful",
        role: "team",
        token,
        expiresIn: "1d",
        user: {
          teamId: team.team_id,
          teamName: team.team_name,
          role: "team",
        },
      });
    } else {
      return res.status(401).json({
        error: "Invalid team credentials",
        code: "INVALID_CREDENTIALS",
      });
    }
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({
      error: "Server error during login",
      code: "SERVER_ERROR",
    });
  }
});

// POST /api/logout
router.post("/logout", authenticateToken, (req, res) => {
  // Với JWT, logout chỉ cần client xóa token
  // Có thể implement token blacklist nếu cần
  return res.json({
    message: "Logged out successfully",
    timestamp: new Date().toISOString(),
  });
});

// GET /api/verify
router.get("/verify", authenticateToken, (req, res) => {
  console.log(113, req.user);
  const { role, teamId, teamName, username } = req.user;
  console.log(115, req.user);
  return res.json({
    isAuthenticated: true,
    role,
    user: {
      role,
      ...(role === "team" && { teamId, teamName }),
      ...(role === "admin" && { username }),
    },
    tokenInfo: {
      isExpiringSoon: TokenUtils.isTokenExpiringSoon(req.token),
      expiresIn: "1d",
    },
  });
});

// POST /api/refresh - Refresh token endpoint
router.post("/refresh", authenticateToken, (req, res) => {
  try {
    const { role, teamId, teamName, username } = req.user;

    const newTokenPayload = {
      role,
      loginTime: Math.floor(Date.now() / 1000),
      ...(role === "team" && { teamId, teamName }),
      ...(role === "admin" && { username }),
    };

    const newToken = TokenUtils.generateAccessToken(newTokenPayload);

    return res.json({
      token: newToken,
      expiresIn: "1d",
      message: "Token refreshed successfully",
    });
  } catch (error) {
    console.error("Token refresh error:", error);
    return res.status(500).json({
      error: "Failed to refresh token",
      code: "REFRESH_ERROR",
    });
  }
});

module.exports = router;
