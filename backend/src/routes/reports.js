// backend/src/routes/reports.js
const express = require('express');
const router = express.Router();
const db = require('../db'); // Đảm bảo db đã được cấu hình (ví dụ sử dụng pg Pool)

//
// GET /api/admin/reports/team-time
// Trả về báo cáo thời gian hoàn thành của các team.
// Mỗi record có: team_id, team_name, mảng stages (gồm: stage_id, stage_number, stage_name, duration_sec)
// và tổng thời gian hoàn thành (total_duration_sec)
//
router.get('/team-time', async (req, res) => {
  try {
    const query = `
      SELECT
        t.team_id,
        t.team_name,
        JSON_AGG(
          JSON_BUILD_OBJECT(
            'stage_id', tr.stage_id,
            'stage_number', s.stage_number,
            'stage_name', s.stage_name,
            'duration_sec', EXTRACT(EPOCH FROM (tr.completed_at - t.start_time))
          )
          ORDER BY tr.route_order
        ) AS stages,
        EXTRACT(EPOCH FROM (MAX(tr.completed_at) - MIN(t.start_time))) AS total_duration_sec
      FROM teams t
      JOIN team_routes tr ON t.team_id = tr.team_id AND tr.completed = true
      JOIN stages s ON tr.stage_id = s.stage_id
      GROUP BY t.team_id, t.team_name
      ORDER BY t.team_id;
    `;
    const result = await db.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching team time report:", err);
    res.status(500).json({ error: 'Error fetching team time report' });
  }
});

module.exports = router;
