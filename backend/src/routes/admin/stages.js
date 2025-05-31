// backend/src/routes/stages.js
const express = require('express');
const router = express.Router();
const db = require('../../db'); // Giả sử db.query để tương tác với PostgreSQL
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const adminAuth = require('../../middlewares/adminAuth');

// POST: Thêm mới một stage với upload file location_image
router.post('/', adminAuth, upload.single('location_image'), async (req, res) => {
    const { stage_number, stage_name, description, open_code } = req.body;
    // Lấy buffer file nếu upload, nếu không thì để null
    const locationImageBuffer = req.file ? req.file.buffer : null;

    try {
        // Chèn dữ liệu mới vào bảng stages
        const result = await db.query(
            `INSERT INTO stages (stage_number, stage_name, description, open_code, location_image, created_at)
       VALUES ($1, $2, $3, $4, $5, NOW())
       RETURNING *`,
            [stage_number, stage_name, description, open_code, locationImageBuffer]
        );
        let stage = result.rows[0];
        // Nếu có location_image, convert buffer sang Base64 để trả về cho giao diện
        if (stage.location_image) {
            stage.location_image = stage.location_image.toString('base64');
        }
        res.json(stage);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error inserting stage.' });
    }
});

// GET: Lấy danh sách stages, convert location_image thành Base64
router.get('/', adminAuth, async (req, res) => {
    try {
        const result = await db.query(
            `SELECT * FROM stages ORDER BY stage_number`
        );
        // Convert mỗi cột location_image (nếu tồn tại) thành chuỗi Base64
        result.rows.forEach(row => {
            if (row.location_image) {
                row.location_image = row.location_image.toString('base64');
            }
        });
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error fetching stages.' });
    }
});

// PUT: Cập nhật stage theo id
router.put('/:id', adminAuth, upload.single('location_image'), async (req, res) => {
  const { id } = req.params;
  const { stage_number, stage_name, description, open_code } = req.body;
  // Nếu có file upload, lấy buffer file; nếu không thì giữ nguyên giá trị cũ (hoặc để null)
  const locationImageBuffer = req.file ? req.file.buffer : null;
  
  try {
    // Nếu bạn muốn cập nhật trường location_image chỉ khi có file mới upload, bạn có thể điều chỉnh câu query theo điều kiện
    // Ở đây, mình cập nhật luôn trường location_image với buffer (hoặc null nếu không có file)
    const result = await db.query(
      `UPDATE stages 
       SET stage_number = $1, stage_name = $2, description = $3, open_code = $4, location_image = $5 
       WHERE stage_id = $6 RETURNING *`,
      [stage_number, stage_name, description, open_code, locationImageBuffer, id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Stage not found' });
    }
    let stage = result.rows[0];
    // Nếu có file image mới được lưu, chuyển buffer sang Base64 để gửi về
    if (stage.location_image) {
      stage.location_image = stage.location_image.toString('base64');
    }
    res.json(stage);
  } catch (error) {
    console.error("Error updating stage:", error);
    res.status(500).json({ error: 'Server error while updating stage' });
  }
});

// DELETE: Xoá stage theo id
router.delete('/:id', adminAuth, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('DELETE FROM stages WHERE stage_id=$1', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Stage not found' });
    }
    res.json({ message: 'Stage deleted successfully' });
  } catch (error) {
    console.error("Error deleting stage:", error);
    res.status(500).json({ error: 'Server error while deleting stage' });
  }
});

module.exports = router;
