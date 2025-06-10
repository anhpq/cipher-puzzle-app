// backend/src/routes/questions.js
const express = require('express');
const router = express.Router();
const db = require('../../db'); // Giả sử db.query được cấu hình truy vấn PostgreSQL
const multer = require('multer');
const storage = multer.memoryStorage(); // Lưu file vào bộ nhớ
const upload = multer({ storage: storage });
const adminAuth = require('../../middleware/adminAuth');

// POST: Thêm mới câu hỏi với file upload cho hint1 và hint2
router.post('/', adminAuth, upload.fields([{ name: 'hint1' }, { name: 'hint2' }]), async (req, res) => {
    const { stage_id, question_text, answer } = req.body;
    // Lấy file upload cho hint1 và hint2 nếu có
    const hint1Buffer = req.files.hint1 ? req.files.hint1[0].buffer : null;
    const hint2Buffer = req.files.hint2 ? req.files.hint2[0].buffer : null;

    try {
        const result = await db.query(
            `INSERT INTO questions (stage_id, question_text, answer, hint1, hint2, created_at)
         VALUES ($1, $2, $3, $4, $5, NOW())
         RETURNING *`,
            [stage_id, question_text, answer, hint1Buffer, hint2Buffer]
        );
        const newQuestion = result.rows[0];
        // Nếu có dữ liệu binary cho hint1/hint2, chuyển về base64
        if (newQuestion.hint1)
            newQuestion.hint1 = newQuestion.hint1.toString('base64');
        if (newQuestion.hint2)
            newQuestion.hint2 = newQuestion.hint2.toString('base64');
        res.json(newQuestion);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error adding question.' });
    }
}
);

// GET: Lấy danh sách câu hỏi, thực hiện JOIN với stages để lấy stage_name,
// và chuyển các trường binary của hint1/hint2 sang base64.
router.get('/', adminAuth, async (req, res) => {
    try {
        const result = await db.query(
            `SELECT q.*, s.stage_name
       FROM questions q
       JOIN stages s ON q.stage_id = s.stage_id
       ORDER BY q.question_id`
        );
        result.rows.forEach((row) => {
            if (row.hint1) {
                row.hint1 = row.hint1.toString('base64');
            }
            if (row.hint2) {
                row.hint2 = row.hint2.toString('base64');
            }
        });
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error fetching questions.' });
    }
});

// PUT: Cập nhật câu hỏi theo question_id, hỗ trợ file upload cho hint1 và hint2.
// Nếu có file mới upload, cập nhật lại; nếu không, giữ nguyên dữ liệu cũ.
router.put('/:question_id', adminAuth, upload.fields([{ name: 'hint1' }, { name: 'hint2' }]), async (req, res) => {
    const { question_id } = req.params;
    const { stage_id, question_text, answer } = req.body;
    const hint1Buffer = req.files.hint1 ? req.files.hint1[0].buffer : null;
    const hint2Buffer = req.files.hint2 ? req.files.hint2[0].buffer : null;

    try {
        const result = await db.query(
            `UPDATE questions
         SET stage_id = $1,
             question_text = $2,
             answer = $3,
             hint1 = COALESCE($4, hint1),
             hint2 = COALESCE($5, hint2)
         WHERE question_id = $6
         RETURNING *`,
            [stage_id, question_text, answer, hint1Buffer, hint2Buffer, question_id]
        );
        const updatedQuestion = result.rows[0];
        if (updatedQuestion.hint1)
            updatedQuestion.hint1 = updatedQuestion.hint1.toString('base64');
        if (updatedQuestion.hint2)
            updatedQuestion.hint2 = updatedQuestion.hint2.toString('base64');
        res.json(updatedQuestion);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error updating question.' });
    }
}
);

// DELETE: Xoá câu hỏi theo question_id
router.delete('/:question_id', adminAuth, async (req, res) => {
    const { question_id } = req.params;
    try {
        await db.query('DELETE FROM questions WHERE question_id = $1', [question_id]);
        res.json({ message: 'Question deleted successfully.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error deleting question.' });
    }
});

module.exports = router;
