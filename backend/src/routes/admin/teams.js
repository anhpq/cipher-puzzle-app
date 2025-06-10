// backend/src/routes/teams.js

const express = require('express');
const router = express.Router();
const db = require('../../db');  // Đảm bảo module db đã được cấu hình kết nối PostgreSQL
const adminAuth = require('../../middleware/adminAuth');

/**
 * GET /api/admin/teams/status
 * Trả về trạng thái cơ bản của các team, bao gồm team_id, team_name, current_stage_id và stage_name.
 */
router.get('/status', async (req, res) => {
    try {
        const result = await db.query(
            `SELECT 
                t.team_id,
                t.team_name,
                t.current_stage_id,
                tr.route_order,
                s.stage_name
            FROM teams t
            LEFT JOIN team_routes tr 
                ON t.team_id = tr.team_id 
                AND t.current_stage_id = tr.stage_id
            LEFT JOIN stages s 
                ON t.current_stage_id = s.stage_id
            ORDER BY t.team_name;`
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching team status:', error);
        res.status(500).json({ error: 'Error fetching team status.' });
    }
});

/**
 * GET /api/admin/teams
 * Lấy danh sách tất cả các team.
 */
router.get('/', async (req, res) => {
    try {
        const result = await db.query(`SELECT * FROM teams ORDER BY team_id`);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching teams:', error);
        res.status(500).json({ error: 'Error fetching teams.' });
    }
});

/**
 * POST /api/admin/teams
 * Tạo mới một team.
 * Expected body: { team_name, password }
 * current_stage_id có thể để null và được set sau khi phân công lộ trình cho team.
 */
router.post('/', async (req, res) => {
    const { team_name, password } = req.body;
    try {
        const result = await db.query(
            `INSERT INTO teams (team_name, password, current_stage_id)
             VALUES ($1, $2, null)
             RETURNING *`,
            [team_name, password]
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error creating team:', error);
        res.status(500).json({ error: 'Error creating team.' });
    }
});

/**
 * PUT /api/admin/teams/:team_id
 * Cập nhật thông tin của một team.
 * Expected body: { team_name, password, current_stage_id }
 */
router.put('/:team_id', adminAuth, async (req, res) => {
    const { team_id } = req.params;
    const { team_name, password, current_stage_id } = req.body;
    try {
        const result = await db.query(
            `UPDATE teams
             SET team_name = COALESCE($1, team_name),
                 password = COALESCE($2, password),
                 current_stage_id = COALESCE($3, current_stage_id)
             WHERE team_id = $4
             RETURNING *`,
            [team_name, password, current_stage_id, team_id]
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating team:', error);
        res.status(500).json({ error: 'Error updating team.' });
    }
});

/**
 * DELETE /api/admin/teams/:team_id
 * Xoá một team theo team_id.
 */
router.delete('/:team_id', adminAuth, async (req, res) => {
    const { team_id } = req.params;
    try {
        await db.query(`DELETE FROM teams WHERE team_id = $1`, [team_id]);
        res.json({ message: 'Team deleted successfully.' });
    } catch (error) {
        console.error('Error deleting team:', error);
        res.status(500).json({ error: 'Error deleting team.' });
    }
});

module.exports = router;
