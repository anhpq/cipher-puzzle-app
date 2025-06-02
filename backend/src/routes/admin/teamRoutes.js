// backend/src/routes/teamRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../../db'); // Giả sử bạn có db.query để tương tác với PostgreSQL
const adminAuth = require('../../middlewares/adminAuth');

// Endpoint cập nhật aggregated team route với stage name
router.put('/aggregate/:team_id', adminAuth, async (req, res) => {
  const { team_id } = req.params;
  const { routes } = req.body; // routes: mảng các stage_id, ví dụ [1,2,3,4]

  if (!Array.isArray(routes)) {
    return res.status(400).json({ error: 'Routes must be an array.' });
  }

  try {
    await db.query('BEGIN');

    // Xoá tất cả các team_route của team_id này
    await db.query('DELETE FROM team_routes WHERE team_id = $1', [team_id]);

    // Chèn lại từng record mới với thứ tự route_order = index + 1
    for (let i = 0; i < routes.length; i++) {
      const stage_id = routes[i];
      await db.query(
        'INSERT INTO team_routes (team_id, stage_id, route_order) VALUES ($1, $2, $3)',
        [team_id, stage_id, i + 1]
      );
    }

    await db.query('COMMIT');

    // Truy vấn dữ liệu mới với thông tin stage name
    const result = await db.query(
      `SELECT tr.*, s.stage_name
       FROM team_routes tr
       JOIN stages s ON tr.stage_id = s.stage_id
       WHERE tr.team_id = $1
       ORDER BY tr.route_order`,
      [team_id]
    );

    res.json({ team_id, routes: result.rows });
  } catch (err) {
    await db.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'Error updating aggregated team routes.' });
  }
});

// Endpoint xoá aggregated team route theo team_id
router.delete('/aggregate/:team_id', adminAuth, async (req, res) => {
  const { team_id } = req.params;
  try {
    await db.query('DELETE FROM team_routes WHERE team_id = $1', [team_id]);
    res.json({ message: `Aggregated team routes for team ${team_id} have been deleted.` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error deleting aggregated team routes.' });
  }
});

// Optional: Endpoint GET all aggregated team routes với stage name để hiển thị cho phần Admin Dashboard
router.get('/aggregate', adminAuth, async (req, res) => {
  try {
    // Truy vấn tất cả các bản ghi và join với stages để lấy stage_name
    const result = await db.query(
      `SELECT tr.*, s.stage_name, t.team_name
       FROM team_routes tr
       JOIN stages s ON tr.stage_id = s.stage_id
       JOIN TEAMS T ON TR.TEAM_ID = T.TEAM_ID
       ORDER BY tr.team_id, tr.route_order`
    );

    // Nhóm các bản ghi theo team_id để gửi về dạng aggregated
    const groups = {};
    result.rows.forEach((row) => {
      if (!groups[row.team_id]) groups[row.team_id] = [];
      groups[row.team_id].push(row);
    });

    const aggregated = Object.keys(groups).map((teamId) => ({
      team_id: teamId,
      routes: groups[teamId].sort((a, b) => a.route_order - b.route_order)
    }));

    res.json(aggregated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching aggregated team routes.' });
  }
});

module.exports = router;
