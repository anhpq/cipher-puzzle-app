// server/routes/auth.js

require("dotenv").config(); // Load các biến môi trường từ file .env
const express = require("express");
const router = express.Router();
const pool = require("../db"); // Kết nối đến PostgreSQL

// POST /api/login
router.post("/login", async (req, res) => {
  console.log("Received login request:", req.body);
  const { username, password } = req.body;
  console.log("Login attempt:", { username, password });

  // Kiểm tra dữ liệu đầu vào
  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required." });
  }

  // Nếu đăng nhập của admin
  if (username.toLowerCase() === "admin") {
    if (password === process.env.ADMIN_PASSWORD) {
      req.session.admin = true;
      console.log("Admin login successful", req.session.admin);
      return res.json({ message: "Admin login successful.", role: "admin" });
    } else {
      return res.status(401).json({ error: "Invalid admin credentials." });
    }
  }

  // Xử lý đăng nhập của team
  try {
    // Truy vấn bảng teams theo team_name
    const result = await pool.query(
      "SELECT * FROM teams WHERE team_name = $1",
      [username]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Team not found." });
    }
    const team = result.rows[0];

    // Giả sử ở đây password đang lưu plain text (chỉ để phát triển)
    if (password === team.password) {
      req.session.team = true;
      req.session.teamId = team.team_id;
      console.log("Admin login successful", req.session.admin, team.team_id);
      return res.json({ message: "Team login successful.", role: "team" });
    } else {
      return res.status(401).json({ error: "Invalid team credentials." });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error during team login." });
  }
});

// POST /api/logout – Logout route, destroys the session
router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Logout failed." });
    }
    // Optionally clear the cookie (default name is "connect.sid")
    res.clearCookie("connect.sid");
    return res.json({ message: "Logged out successfully." });
  });
});

router.get("/verify", (req, res) => {
  console.log("Verify session ID:", req.sessionID);
  console.log("Verify session content:", req.session);
  console.log("req.session.user:", req.session.user);
  console.log("req.session.admin:", req.session.admin);
  console.log("req.session.team:", req.session.team);
  if (req.session && req.session.admin) {
    return res.json({ isAuthenticated: true, role: "admin" });
  } else if (req.session && req.session.team) {
    return res.json({ isAuthenticated: true, role: "team" });
  }
  return res.json({ isAuthenticated: false });
});

module.exports = router;
