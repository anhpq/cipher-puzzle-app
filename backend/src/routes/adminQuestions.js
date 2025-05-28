// backend/src/routes/adminQuestions.js
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
 * CREATE a new question.
 * Expects: { stage_id, question_text, answer, hint1, hint2 }
 */
router.post('/', isAdmin, async (req, res) => {
  const { stage_id, question_text, answer, hint1, hint2 } = req.body;
  try {
    const bufHint1 = hint1 ? Buffer.from(hint1, 'base64') : null;
    const bufHint2 = hint2 ? Buffer.from(hint2, 'base64') : null;
    const result = await pool.query(
      `INSERT INTO questions (stage_id, question_text, answer, hint1, hint2)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [stage_id, question_text, answer, bufHint1, bufHint2]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error creating question:", err);
    res.status(500).json({ message: "Error creating question." });
  }
});

/**
 * READ all questions.
 */
router.get('/', isAdmin, async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM questions ORDER BY question_id`);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching questions:", err);
    res.status(500).json({ message: "Error fetching questions." });
  }
});

/**
 * READ a single question by ID.
 */
router.get('/:id', isAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(`SELECT * FROM questions WHERE question_id = $1`, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Question not found." });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching question:", err);
    res.status(500).json({ message: "Error fetching question." });
  }
});

/**
 * UPDATE a question.
 * Accepts updated fields: stage_id, question_text, answer, hint1, hint2.
 */
router.put('/:id', isAdmin, async (req, res) => {
  const { id } = req.params;
  const { stage_id, question_text, answer, hint1, hint2 } = req.body;
  try {
    const bufHint1 = hint1 ? Buffer.from(hint1, 'base64') : null;
    const bufHint2 = hint2 ? Buffer.from(hint2, 'base64') : null;
    const result = await pool.query(
      `UPDATE questions
       SET stage_id = $1,
           question_text = $2,
           answer = $3,
           hint1 = $4,
           hint2 = $5
       WHERE question_id = $6 RETURNING *`,
      [stage_id, question_text, answer, bufHint1, bufHint2, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Question not found." });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error updating question:", err);
    res.status(500).json({ message: "Error updating question." });
  }
});

/**
 * DELETE a question.
 */
router.delete('/:id', isAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `DELETE FROM questions WHERE question_id = $1 RETURNING *`,
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Question not found." });
    }
    res.json({ message: "Question deleted successfully.", question: result.rows[0] });
  } catch (err) {
    console.error("Error deleting question:", err);
    res.status(500).json({ message: "Error deleting question." });
  }
});

module.exports = router;
