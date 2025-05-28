// backend/src/routes/adminStages.js
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
 * CREATE a new stage.
 * Expects: { stage_name, description, open_code, location_image }
 */
router.post('/', isAdmin, async (req, res) => {
  const { stage_name, description, open_code, location_image } = req.body;
  try {
    const imageBuffer = location_image ? Buffer.from(location_image, 'base64') : null;
    const result = await pool.query(
      `INSERT INTO stages (stage_name, description, open_code, location_image)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [stage_name, description, open_code, imageBuffer]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error creating stage:", err);
    res.status(500).json({ message: "Error creating stage." });
  }
});

/**
 * READ all stages.
 */
router.get('/', isAdmin, async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM stages ORDER BY stage_id`);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching stages:", err);
    res.status(500).json({ message: "Error fetching stages." });
  }
});

/**
 * READ a single stage by ID.
 */
router.get('/:id', isAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(`SELECT * FROM stages WHERE stage_id = $1`, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Stage not found." });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching stage:", err);
    res.status(500).json({ message: "Error fetching stage." });
  }
});

/**
 * UPDATE a stage.
 * Accepts updated fields: stage_name, description, open_code, location_image.
 */
router.put('/:id', isAdmin, async (req, res) => {
  const { id } = req.params;
  const { stage_name, description, open_code, location_image } = req.body;
  try {
    const imageBuffer = location_image ? Buffer.from(location_image, 'base64') : null;
    const result = await pool.query(
      `UPDATE stages
       SET stage_name = $1,
           description = $2,
           open_code = $3,
           location_image = $4
       WHERE stage_id = $5 RETURNING *`,
      [stage_name, description, open_code, imageBuffer, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Stage not found." });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error updating stage:", err);
    res.status(500).json({ message: "Error updating stage." });
  }
});

/**
 * DELETE a stage.
 */
router.delete('/:id', isAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `DELETE FROM stages WHERE stage_id = $1 RETURNING *`,
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Stage not found." });
    }
    res.json({ message: "Stage deleted successfully.", stage: result.rows[0] });
  } catch (err) {
    console.error("Error deleting stage:", err);
    res.status(500).json({ message: "Error deleting stage." });
  }
});

module.exports = router;
