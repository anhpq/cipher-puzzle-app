// server/routes/auth.js - Fixed version with proper session handling

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
      // Use promisified session regeneration
      try {
        await new Promise((resolve, reject) => {
          req.session.regenerate((err) => {
            if (err) reject(err);
            else resolve();
          });
        });

        // Set session data
        req.session.admin = true;
        req.session.user_id = 'admin';
        req.session.role = 'admin';

        // Save session with promise
        await new Promise((resolve, reject) => {
          req.session.save((err) => {
            if (err) reject(err);
            else resolve();
          });
        });

        return res.json({
          message: "Admin login successful.",
          role: "admin",
        });
      } catch (err) {
        console.error("Session error:", err);
        return res.status(500).json({ error: "Session error." });
      }
    } else {
      return res.status(401).json({ error: "Invalid admin credentials." });
    }
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
      // Use promisified session regeneration for team login
      try {
        await new Promise((resolve, reject) => {
          req.session.regenerate((err) => {
            if (err) reject(err);
            else resolve();
          });
        });

        // Set session data
        req.session.team = true;
        req.session.teamId = team.team_id;
        req.session.user_id = team.team_id;
        req.session.role = 'team';

        // Save session with promise
        await new Promise((resolve, reject) => {
          req.session.save((err) => {
            if (err) reject(err);
            else resolve();
          });
        });

        return res.json({ 
          message: "Team login successful.", 
          role: "team",
          teamId: team.team_id 
        });
      } catch (err) {
        console.error("Session error:", err);
        return res.status(500).json({ error: "Session error." });
      }
    } else {
      return res.status(401).json({ error: "Invalid team credentials." });
    }
  } catch (err) {
    console.error("Database error:", err);
    return res.status(500).json({ error: "Server error during team login." });
  }
});

// POST /api/logout
router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Logout error:", err);
      return res.status(500).json({ error: "Logout failed." });
    }
    res.clearCookie("connect.sid");
    return res.json({ message: "Logged out successfully." });
  });
});

// GET /api/verify
router.get("/verify", async (req, res) => {
  console.log("Session verification:", {
    sessionId: req.sessionID,
    session: req.session,
    admin: req.session?.admin,
    team: req.session?.team
  });

  if (req.session && req.session.admin === true) {
    return res.json({ 
      isAuthenticated: true, 
      role: "admin",
      userId: req.session.user_id 
    });
  } else if (req.session && req.session.team === true) {
    return res.json({ 
      isAuthenticated: true, 
      role: "team",
      teamId: req.session.teamId,
      userId: req.session.user_id
    });
  }
  
  return res.json({ isAuthenticated: false });
});

module.exports = router;