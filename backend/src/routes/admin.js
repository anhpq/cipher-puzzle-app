// backend/src/routes/admin.js
const express = require('express');
const router = express.Router();
const pool = require('../db');
const adminAuth = require('../middlewares/adminAuth');

/* ---------------------- ASSIGNMENTS ENDPOINT ---------------------- */

// GET: Lấy danh sách team question assignments (chỉ đọc)
router.get('/assignments', adminAuth, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM team_question_assignments ORDER BY team_id, stage_id');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error while fetching assignments' });
  }
});

module.exports = router;
