// backend/src/routes/teamInfo.js
const express = require('express');
const router = express.Router();
const db = require('../../db');
const teamAuth = require('../../middlewares/teamAuth');

router.get('/info', teamAuth, async (req, res) => {
  const teamId = req.session.cookie.teamId;
  if (!teamId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  try {
    const result = await db.query(
      'SELECT team_id, team_name, start_time FROM teams WHERE team_id = $1',
      [teamId]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Team not found.' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching team info:", err);
    res.status(500).json({ error: 'Server error while fetching team info.' });
  }
});

module.exports = router;
