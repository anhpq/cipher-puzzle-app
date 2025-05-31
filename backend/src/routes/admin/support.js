// backend/src/routes/support.js
const express = require('express');
const router = express.Router();
const db = require('../../db');
const adminAuth = require('../../middlewares/adminAuth');

// GET: Lấy danh sách thông tin hỗ trợ (bạn tự định nghĩa logic dựa theo bảng team_question_assignments hoặc team_routes)
router.get('/', adminAuth, async (req, res) => {
  try {
    // Ví dụ giả sử query trả về các trường: team_id, stage_id, stage_number, stage_name
    const result = await db.query(`
      SELECT t.team_id, tr.stage_id, s.stage_number, s.stage_name
      FROM team_routes tr
      JOIN teams t ON tr.team_id = t.team_id
      JOIN stages s ON tr.stage_id = s.stage_id
      ORDER BY t.team_id, tr.route_order
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching support data.' });
  }
});

// PUT: Refresh stage của một team
router.put('/refresh', adminAuth, async (req, res) => {
  const { team_id, stage_id } = req.body;
  try {
    await db.query('BEGIN');
    // Giả sử refresh có nghĩa là reset số lần (attempts) cho stage hiện tại
    await db.query(
      'UPDATE team_question_assignments SET attempts = 0 WHERE team_id = $1 AND stage_id = $2',
      [team_id, stage_id]
    );
    // Nếu cần thiết, cũng có thể cập nhật lại thông tin trong bảng team_routes (nếu có cột liên quan đến trạng thái khác)

    await db.query('COMMIT');
    res.json({ message: 'Stage refreshed successfully.' });
  } catch (err) {
    await db.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'Error refreshing stage.' });
  }
});

// PUT: Advance đến stage tiếp theo cho một team
// Endpoint PUT để advance stage cho team
router.put('/advance', adminAuth, async (req, res) => {
  const { team_id } = req.body;
  try {
    // Sử dụng transaction để đảm bảo tính nguyên tử
    await db.query('BEGIN');

    // Lấy current_stage_id hiện tại của team
    const teamResult = await db.query(
      'SELECT current_stage_id FROM teams WHERE team_id = $1',
      [team_id]
    );
    if (teamResult.rowCount === 0) {
      throw new Error("Team not found");
    }
    const currentStage = teamResult.rows[0].current_stage_id;

    // Đánh dấu stage hiện tại là đã hoàn thành
    await db.query(
      'UPDATE team_routes SET completed = TRUE, completed_at = NOW() WHERE team_id = $1 AND stage_id = $2',
      [team_id, currentStage]
    );

    // Tìm stage tiếp theo: lấy record có completed = false với route_order nhỏ nhất
    const nextStageResult = await db.query(
      `SELECT stage_id 
       FROM team_routes 
       WHERE team_id = $1 AND completed = FALSE 
       ORDER BY route_order
       LIMIT 1`,
      [team_id]
    );

    if (nextStageResult.rowCount === 0) {
      // Không có stage tiếp theo, nghĩa là team đã hoàn thành toàn bộ lộ trình
      await db.query('COMMIT');
      return res.json({ message: 'Team has finished all stages.' });
    }

    const nextStage = nextStageResult.rows[0].stage_id;

    // Cập nhật cột current_stage_id trong bảng teams
    await db.query(
      'UPDATE teams SET current_stage_id = $1 WHERE team_id = $2',
      [nextStage, team_id]
    );

    await db.query('COMMIT');
    res.json({ message: 'Team advanced to next stage successfully.', current_stage_id: nextStage });
  } catch (err) {
    await db.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'Error advancing team stage.' });
  }
});

module.exports = router;
