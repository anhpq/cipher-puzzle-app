// backend/src/routes/assignments.js
const express = require('express');
const router = express.Router();
const db = require('../../db');
const adminAuth = require('../../middleware/adminAuth');

// GET assignments (đã có)
router.get('/', adminAuth, async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM team_question_assignments ORDER BY team_id, stage_id');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error while fetching assignments' });
  }
});

// PUT: Update assignment by assignment_id
router.put('/:assignment_id', adminAuth, async (req, res) => {
  const { assignment_id } = req.params;
  const { team_id, stage_id, question_id, attempts } = req.body;
  try {
    const result = await db.query(
      `UPDATE team_question_assignments
       SET team_id = $1,
           stage_id = $2,
           question_id = $3,
           attempts = $4,
           last_attempt_at = NOW()
       WHERE assignment_id = $5
       RETURNING *`,
      [team_id, stage_id, question_id, attempts, assignment_id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Assignment not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating assignment:", error);
    res.status(500).json({ error: 'Server error while updating assignment' });
  }
});

// DELETE: Delete assignment by assignment_id
router.delete('/:assignment_id', adminAuth, async (req, res) => {
  const { assignment_id } = req.params;
  try {
    const result = await db.query(
      `DELETE FROM team_question_assignments WHERE assignment_id = $1`,
      [assignment_id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Assignment not found' });
    }
    res.json({ message: 'Assignment deleted successfully' });
  } catch (error) {
    console.error("Error deleting assignment:", error);
    res.status(500).json({ error: 'Server error while deleting assignment' });
  }
});

module.exports = router;
