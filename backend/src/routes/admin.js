// backend/src/routes/admin.js
const express = require('express');
const router = express.Router();
const pool = require('../db');
const adminAuth = require('../middlewares/adminAuth');

/* ---------------------- STAGES ENDPOINTS ---------------------- */

// GET: Lấy danh sách tất cả stages
router.get('/stages', adminAuth, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM stages ORDER BY stage_number');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error while fetching stages' });
  }
});

// POST: Tạo một stage mới
router.post('/stages', adminAuth, async (req, res) => {
  const { stage_number, stage_name, description, open_code, location_image } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO stages(stage_number, stage_name, description, open_code, location_image)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [stage_number, stage_name, description, open_code, location_image]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error while creating stage' });
  }
});

// PUT: Cập nhật stage theo id
router.put('/stages/:id', adminAuth, async (req, res) => {
  const { id } = req.params;
  const { stage_number, stage_name, description, open_code, location_image } = req.body;
  try {
    const result = await pool.query(
      `UPDATE stages SET stage_number=$1, stage_name=$2, description=$3, open_code=$4, location_image=$5 
       WHERE stage_id=$6 RETURNING *`,
      [stage_number, stage_name, description, open_code, location_image, id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Stage not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error while updating stage' });
  }
});

// DELETE: Xoá stage theo id
router.delete('/stages/:id', adminAuth, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM stages WHERE stage_id=$1', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Stage not found' });
    }
    res.json({ message: 'Stage deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error while deleting stage' });
  }
});

/* ---------------------- ASSIGNMENTS ENDPOINT ---------------------- */

// GET: Lấy danh sách team question assignments (chỉ đọc)
router.get('/assignments', adminAuth, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM team_question_assignments ORDER BY team_id, stage_id');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error while fetching assignments' });
  }
});

module.exports = router;
