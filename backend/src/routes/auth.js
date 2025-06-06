// server/routes/auth.js - Fixed version

require("dotenv").config();
const express = require("express");
const router = express.Router();
const pool = require("../db");

// POST /api/login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required." });
  }

  // Admin login
  if (username.toLowerCase() === "admin") {
    if (password === process.env.ADMIN_PASSWORD) {
      // Regenerate session để tạo session ID mới
      req.session.regenerate((err) => {
        if (err) {
          console.error("Session regeneration error:", err);
          return res.status(500).json({ error: "Session error." });
        }

        req.session.admin = true;
        req.session.save((err) => {
          if (err) {
            console.error("Session save error:", err);
            return res.status(500).json({ error: "Session save error." });
          }
          return res.json({
            message: "Admin login successful.",
            role: "admin",
          });
        });
      });
    } else {
      return res.status(401).json({ error: "Invalid admin credentials." });
    }
    return; // Important: prevent further execution
  }

  // Team login
  try {
    const result = await pool.query(
      "SELECT * FROM teams WHERE team_name = $1",
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Team not found." });
    }

    const team = result.rows[0];

    if (password === team.password) {
      // Regenerate session cho team login
      req.session.regenerate((err) => {
        if (err) {
          console.error("Session regeneration error:", err);
          return res.status(500).json({ error: "Session error." });
        }

        req.session.team = true;
        req.session.teamId = team.team_id;

        req.session.save((err) => {
          if (err) {
            console.error("Session save error:", err);
            return res.status(500).json({ error: "Session save error." });
          }
          return res.json({ message: "Team login successful.", role: "team" });
        });
      });
    } else {
      return res.status(401).json({ error: "Invalid team credentials." });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error during team login." });
  }
});

// POST /api/logout
router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Logout failed." });
    }
    res.clearCookie("connect.sid");
    return res.json({ message: "Logged out successfully." });
  });
});

// GET /api/verify
router.get("/verify", (req, res) => {
  if (req.session && req.session.admin) {
    return res.json({ isAuthenticated: true, role: "admin" });
  } else if (req.session && req.session.team) {
    return res.json({ isAuthenticated: true, role: "team" });
  }
  return res.json({ isAuthenticated: false });
});

module.exports = router;
