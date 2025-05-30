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

/* ---------------------- QUESTIONS ENDPOINTS ---------------------- */

// GET: Lấy danh sách questions, có thể lọc theo stage_id thông qua query string
router.get('/questions', adminAuth, async (req, res) => {
  try {
    const { stage_id } = req.query;
    let query = 'SELECT * FROM questions';
    const params = [];
    if (stage_id) {
      query += ' WHERE stage_id = $1';
      params.push(stage_id);
    }
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error while fetching questions' });
  }
});

// POST: Tạo question mới cho một stage
router.post('/questions', adminAuth, async (req, res) => {
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
router.put('/questions/:id', adminAuth, async (req, res) => {
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
router.delete('/questions/:id', adminAuth, async (req, res) => {
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

/* ---------------------- TEAM ROUTES ENDPOINTS ---------------------- */

// GET: Lấy danh sách team routes
router.get('/team-routes', adminAuth, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM team_routes ORDER BY team_id, route_order');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error while fetching team routes' });
  }
});

// POST: Tạo team route mới
router.post('/team-routes', adminAuth, async (req, res) => {
  const { team_id, stage_id, route_order } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO team_routes(team_id, stage_id, route_order)
       VALUES ($1, $2, $3) RETURNING *`,
      [team_id, stage_id, route_order]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error while creating team route' });
  }
});

// PUT: Cập nhật team route theo id
router.put('/team-routes/:id', adminAuth, async (req, res) => {
  const { id } = req.params;
  const { team_id, stage_id, route_order } = req.body;
  try {
    const result = await pool.query(
      `UPDATE team_routes SET team_id=$1, stage_id=$2, route_order=$3
       WHERE team_route_id=$4 RETURNING *`,
      [team_id, stage_id, route_order, id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Team route not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error while updating team route' });
  }
});

// DELETE: Xoá team route theo id
router.delete('/team-routes/:id', adminAuth, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM team_routes WHERE team_route_id=$1', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Team route not found' });
    }
    res.json({ message: 'Team route deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error while deleting team route' });
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
