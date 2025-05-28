// backend/src/routes/auth.js
const express = require('express');
const router = express.Router();
const { pool } = require('../db');

/**
 * POST /api/auth/login
 *
 * Admin Login:
 *   - Username must be "admin".
 *   - Password is compared to process.env.ADMIN_PASSWORD.
 *
 * Team Login:
 *   - Username is looked up in the teams table.
 *   - The provided password is compared with the stored password.
 *
 * On success, the session’s user object is set.
 */
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  // If the username is "admin", check against the environment variable.
  if (username === 'admin') {
    if (password === process.env.ADMIN_PASSWORD) {
      req.session.user = { id: 'admin', username: 'admin', role: 'admin' };
      return res.json({ message: "Admin login successful", user: req.session.user });
    } else {
      return res.status(401).json({ message: "Invalid admin credentials." });
    }
  }

  // Otherwise attempt a team login.
  try {
    const result = await pool.query("SELECT * FROM teams WHERE teamname = $1", [username]);
    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials." });
    }
    const team = result.rows[0];
    // NOTE: In a production application, compare hashed passwords!
    if (team.password !== password) {
      return res.status(401).json({ message: "Invalid credentials." });
    }
    req.session.user = {
      id: team.teamid,
      username: team.teamname,
      role: "team",
    };
    return res.json({ message: "Team login successful", user: req.session.user });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Internal server error." });
  }
});

/**
 * POST /api/auth/logout
 *
 * Clears the user's session.
 */
router.post('/logout', (req, res) => {
  req.session = null;
  res.json({ message: "Logged out successfully." });
});

router.get('/current', (req, res) => {
  // If a session exists, req.session.user should be defined.
  if (req.session && req.session.user) {
    return res.json({ user: req.session.user });
  }
  res.status(401).json({ message: 'Not authenticated' });
});

module.exports = router;
