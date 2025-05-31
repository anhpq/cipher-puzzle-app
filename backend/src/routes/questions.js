// backend/src/routes/questions.js
const express = require('express');
const router = express.Router();
const db = require('../db'); // Giả sử db.query được cấu hình dùng PostgreSQL
const adminAuth = require('../middlewares/adminAuth');

// GET tất cả câu hỏi với thông tin stage_name
router.get('/', adminAuth, async (req, res) => {
    try {
        const result = await db.query(
            `SELECT q.*, s.stage_name
       FROM questions q
       JOIN stages s ON q.stage_id = s.stage_id
       ORDER BY q.question_id`
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error fetching questions.' });
    }
});



/* ---------------------- QUESTIONS ENDPOINTS ---------------------- */

// POST: Tạo question mới cho một stage
router.post('/', adminAuth, async (req, res) => {
    const { stage_id, question_text, answer, hint1, hint2 } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO questions(stage_id, question_text, answer, hint1, hint2)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [stage_id, question_text, answer, hint1, hint2]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error while creating question' });
    }
});

// PUT: Cập nhật question theo id
router.put('/:id', adminAuth, async (req, res) => {
    const { id } = req.params;
    const { stage_id, question_text, answer, hint1, hint2 } = req.body;
    try {
        const result = await pool.query(
            `UPDATE questions SET stage_id=$1, question_text=$2, answer=$3, hint1=$4, hint2=$5
       WHERE question_id=$6 RETURNING *`,
            [stage_id, question_text, answer, hint1, hint2, id]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Question not found' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error while updating question' });
    }
});

// DELETE: Xoá question theo id
router.delete('/:id', adminAuth, async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM questions WHERE question_id=$1', [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Question not found' });
        }
        res.json({ message: 'Question deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error while deleting question' });
    }
});

module.exports = router;
