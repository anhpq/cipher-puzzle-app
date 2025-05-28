// backend/src/routes/adminGameControl.js
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
 * GET /api/admin/game-control/game-state
 * This endpoint retrieves the current game state from the DB.
 */
router.get('/game-state', isAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT game_state FROM game_settings ORDER BY updated_at DESC LIMIT 1"
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Game state not found." });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error retrieving game state:", err);
    res.status(500).json({ message: "Internal server error." });
  }
});

/**
 * POST /api/admin/game-control/start-game
 * This endpoint starts the game by setting the game_state to 'started'
 * and updating the timestamp.
 */
router.post('/start-game', isAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      `UPDATE game_settings
       SET game_state = 'started', updated_at = NOW()
       RETURNING *`
    );
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Error starting game:", err);
    res.status(500).json({ message: "Failed to start game." });
  }
});

/**
 * POST /api/admin/game-control/reset-game
 * This endpoint resets the game by setting the game_state to 'not_started'
 * and clearing the teams' completion times (and resetting current stage).
 */
router.post('/reset-game', isAdmin, async (req, res) => {
  const { resetPassword } = req.body;
  
  // Use an environment variable to store the reset password.
  if (resetPassword !== process.env.RESET_PASSWORD) {
    return res.status(401).json({ message: "Invalid reset password." });
  }
  
  try {
    // Reset the game state.
    await pool.query(
      `UPDATE game_settings
       SET game_state = 'not_started', updated_at = NOW()
       RETURNING *`
    );
    
    // Reset team data: clear completion times and set current stage to 0.
    await pool.query(`
      UPDATE teams
      SET currentstage = 0,
          completiontimes = '{}'
    `);
    
    res.status(200).json({ message: "Game has been reset successfully." });
  } catch (err) {
    console.error("Error resetting game:", err);
    res.status(500).json({ message: "Failed to reset game." });
  }
});

/**
 * POST /api/admin/game-control/teams/:teamId/reset-stage
 * This endpoint resets a team's current stage to 0.
 */
router.post('/teams/:teamId/reset-stage', isAdmin, async (req, res) => {
  const { teamId } = req.params;
  try {
    const result = await pool.query(
      `UPDATE teams 
       SET currentstage = 0 
       WHERE teamid = $1
       RETURNING *`,
      [teamId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Team not found." });
    }
    res.json({ message: "Team stage has been reset.", team: result.rows[0] });
  } catch (err) {
    console.error("Error resetting team's stage:", err);
    res.status(500).json({ message: "Error resetting team stage.", error: err.message });
  }
});

/**
 * POST /api/admin/game-control/teams/:teamId/next-stage
 * This endpoint advances a team's current stage by 1.
 */
router.post('/teams/:teamId/next-stage', isAdmin, async (req, res) => {
  const { teamId } = req.params;
  try {
    const result = await pool.query(
      `UPDATE teams 
       SET currentstage = currentstage + 1 
       WHERE teamid = $1
       RETURNING *`,
      [teamId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Team not found." });
    }
    res.json({ message: "Team advanced to next stage.", team: result.rows[0] });
  } catch (err) {
    console.error("Error advancing team's stage:", err);
    res.status(500).json({ message: "Error advancing team stage.", error: err.message });
  }
});

module.exports = router;
