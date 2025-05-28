// backend/src/routes/adminTeams.js
const express = require('express');
const router = express.Router();
const { pool } = require('../db');

// Simple admin-check middleware
function isAdmin(req, res, next) {
  if (req.session && req.session.user && req.session.user.role === 'admin') {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
}

/**
 * CREATE a new team.
 * Expects: { teamname, password }
 */
router.post('/', isAdmin, async (req, res) => {
  const { teamname, password } = req.body;
  if (!teamname || !password) {
    return res.status(400).json({ message: "Team name and password are required." });
  }
  try {
    const result = await pool.query(
      `INSERT INTO teams (teamname, password)
       VALUES ($1, $2)
       RETURNING *`,
      [teamname, password]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating team." });
  }
});

/**
 * READ all teams.
 */
router.get('/', isAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM teams ORDER BY teamid`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching teams." });
  }
});

/* PUT /api/teams/:teamId 
   Updates an existing team.
   Expects { teamname, password, routestages } in the body.
   Before updating, check that the game has not started.
*/
router.put('/:teamId', isAdmin, async (req, res) => {
  const { teamId } = req.params;
  const { teamname, password, routestages } = req.body;

  if (!teamname || !password || !routestages) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  try {
    // Check the current game state
    const gameResult = await pool.query(
      `SELECT game_state FROM game_settings ORDER BY updated_at DESC LIMIT 1`
    );
    if (gameResult.rows.length > 0 && gameResult.rows[0].game_state === 'started') {
      return res
        .status(403)
        .json({ message: "Game started; cannot edit team data." });
    }

    const query = `
      UPDATE teams 
      SET teamname = $1, password = $2, routestages = $3
      WHERE teamid = $4
      RETURNING *
    `;
    const values = [teamname, password, routestages, teamId];
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Team not found.' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error updating team:", err);
    res.status(500).json({ message: "Server error updating team." });
  }
});

/* DELETE /api/teams/:teamId 
   Deletes a team record.
*/
router.delete('/:teamId', isAdmin, async (req, res) => {
  const { teamId } = req.params;
  try {
    const result = await pool.query(
      'DELETE FROM teams WHERE teamid = $1 RETURNING *',
      [teamId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Team not found.' });
    }
    res.json({ message: 'Team deleted successfully.', team: result.rows[0] });
  } catch (err) {
    console.error("Error deleting team:", err);
    res.status(500).json({ message: "Server error deleting team." });
  }
});

/**
 * POST /api/teams/:teamId/stages/:stageId/start
 * Starts a stage for a team if the provided stage password is correct.
 * Expects JSON body: { password: "..." }
 */
router.post('/:teamId/stages/:stageId/start', isAdmin, async (req, res) => {
  const { teamId, stageId } = req.params;
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ message: "Password is required." });
  }

  try {
    // Retrieve the stage record from the stages table.
    const stageResult = await pool.query(
      "SELECT stage_password FROM stages WHERE stage_id = $1",
      [stageId]
    );

    if (stageResult.rows.length === 0) {
      return res.status(404).json({ message: "Stage not found." });
    }

    const storedPassword = stageResult.rows[0].stage_password;

    // Verify the password.
    if (storedPassword !== password) {
      return res.status(401).json({ message: "Invalid password for this stage." });
    }

    // Update the team's current stage and record the start time.
    const updateResult = await pool.query(
      `UPDATE teams
       SET currentstage = $1,
           stage_started_at = NOW()
       WHERE teamid = $2
       RETURNING *`,
      [stageId, teamId]
    );

    if (updateResult.rows.length === 0) {
      return res.status(404).json({ message: "Team not found." });
    }

    res.json({
      message: "Stage started successfully for team.",
      team: updateResult.rows[0]
    });
  } catch (error) {
    console.error("Error starting team's stage:", error);
    res.status(500).json({ message: "Error starting team stage.", error: error.message });
  }
});

module.exports = router;
