// backend/src/routes/adminDashboard.js
const express = require('express');
const router = express.Router();
const { pool } = require('../db');

router.get('/', async (req, res) => {
  try {
    const teamsCountResult = await pool.query("SELECT COUNT(*) FROM teams");
    const questionsCountResult = await pool.query("SELECT COUNT(*) FROM questions");
    res.json({
      totalTeams: teamsCountResult.rows[0].count,
      totalQuestions: questionsCountResult.rows[0].count
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error retrieving dashboard data" });
  }
});

module.exports = router;
