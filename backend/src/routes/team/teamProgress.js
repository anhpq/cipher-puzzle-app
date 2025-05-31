// backend/src/routes/teamProgress.js
const express = require('express');
const router = express.Router();
const db = require('../../db');
const adminAuth = require('../../middlewares/adminAuth');
const teamAuth = require('../../middlewares/teamAuth');

// 1. Verify open code
router.post('/verify-open-code', teamAuth, async (req, res) => {
    const { team_id, stage_id, open_code } = req.body;
    try {
        const stageResult = await db.query(
            'SELECT open_code FROM stages WHERE stage_id = $1',
            [stage_id]
        );
        if (stageResult.rowCount === 0) {
            return res.status(404).json({ error: 'Stage not found.' });
        }
        const expectedOpenCode = stageResult.rows[0].open_code;
        if (open_code === expectedOpenCode) {
            return res.json({ success: true, message: 'Open code is valid.' });
        } else {
            return res.status(400).json({ success: false, message: 'Invalid open code.' });
        }
    } catch (err) {
        console.error("Error verifying open code:", err);
        res.status(500).json({ error: 'Server error verifying open code.' });
    }
});

// 2. Record start time (for Stage 1)
router.put('/start-time', teamAuth, async (req, res) => {
    const { team_id } = req.body;
    try {
        const result = await db.query(
            'UPDATE teams SET start_time = NOW() WHERE team_id = $1 RETURNING *',
            [team_id]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Team not found.' });
        }
        res.json({ success: true, team: result.rows[0] });
    } catch (err) {
        console.error("Error recording start time:", err);
        res.status(500).json({ error: 'Server error recording start time.' });
    }
});

// 3. Advance stage
router.put('/advance-stage', teamAuth, async (req, res) => {
    const { team_id, stage_id } = req.body;
    try {
        // Đánh dấu stage hiện tại đã hoàn thành
        await db.query(
            'UPDATE team_routes SET completed = true, completion_time = NOW() WHERE team_id = $1 AND stage_id = $2',
            [team_id, stage_id]
        );
        // Tìm stage tiếp theo trong lộ trình chưa hoàn thành, theo thứ tự
        const nextStage = await db.query(
            `SELECT stage_id 
       FROM team_routes 
       WHERE team_id = $1 AND completed = FALSE
       ORDER BY route_order
       LIMIT 1`,
            [team_id]
        );
        if (nextStage.rowCount === 0) {
            return res.json({ success: true, message: 'All stages completed.' });
        }
        const newStageId = nextStage.rows[0].stage_id;
        await db.query(
            'UPDATE teams SET current_stage_id = $1 WHERE team_id = $2',
            [newStageId, team_id]
        );
        res.json({ success: true, new_stage_id: newStageId });
    } catch (err) {
        console.error("Error advancing stage:", err);
        res.status(500).json({ error: 'Server error advancing stage.' });
    }
});

// 4. Refresh stage (ví dụ reset attempts)
router.put('/refresh-stage', async (req, res) => {
    const { team_id, stage_id } = req.body;
    try {
        await db.query(
            'UPDATE team_question_assignments SET attempts = 0 WHERE team_id = $1 AND stage_id = $2',
            [team_id, stage_id]
        );
        res.json({ success: true, message: 'Stage refreshed successfully.' });
    } catch (err) {
        console.error("Error refreshing stage:", err);
        res.status(500).json({ error: 'Server error refreshing stage.' });
    }
});

router.post('/submit-answer', teamAuth, async (req, res) => {
    const { team_id, stage_id, question_id, answer } = req.body;
    try {
        // Lấy record assignment đang hoạt động
        const assignmentResult = await db.query(
            `SELECT * FROM team_question_assignments 
       WHERE team_id = $1 AND stage_id = $2 AND question_id = $3 AND completed_at IS NULL 
       LIMIT 1`,
            [team_id, stage_id, question_id]
        );
        if (assignmentResult.rowCount === 0) {
            return res.status(404).json({ error: 'Assignment not found or already completed.' });
        }

        const assignment = assignmentResult.rows[0];
        const attempts = assignment.attempts || 0;
        const lastAttemptAt = assignment.last_attempt_at ? new Date(assignment.last_attempt_at) : null;
        const now = new Date();
        // Tính thời gian chờ cần thiết (seconds): +5s cho mỗi lần thử, tối đa 15s.
        const waitingTime = Math.min((attempts + 1) * 5, 15);

        // Nếu đã có lần thử, kiểm tra thời gian đã trôi qua
        if (lastAttemptAt) {
            const elapsedSeconds = (now - lastAttemptAt) / 1000;
            if (elapsedSeconds < waitingTime) {
                const remaining = Math.ceil(waitingTime - elapsedSeconds);
                return res.status(429).json({
                    success: false,
                    message: `Wrong answer. Please wait ${remaining} more seconds before trying again.`
                });
            }
        }

        // Lấy đáp án đúng và hint từ bảng questions
        const questionResult = await db.query(
            'SELECT answer as correct_answer, hint1 FROM questions WHERE question_id = $1',
            [question_id]
        );
        if (questionResult.rowCount === 0) {
            return res.status(404).json({ error: 'Question not found.' });
        }
        const correctAnswer = questionResult.rows[0].correct_answer;
        const hint = questionResult.rows[0].hint1;

        // Nếu đáp án sai, cập nhật số lần thử và trả về thông báo kèm hint (nếu đủ 6 phút từ assigned_at)
        if (answer !== correctAnswer) {
            // Cập nhật attempts và last_attempt_at
            await db.query(
                `UPDATE team_question_assignments 
         SET attempts = attempts + 1, last_attempt_at = NOW() 
         WHERE assignment_id = $1`,
                [assignment.assignment_id]
            );
            // Tính thời gian kể từ assigned_at
            const assignedAt = new Date(assignment.assigned_at);
            const secondsSinceAssigned = (now - assignedAt) / 1000;
            const sixMinutes = 6 * 60;

            if (secondsSinceAssigned >= sixMinutes) {
                // Nếu đã vượt quá 6 phút, trả về hint luôn.
                return res.status(400).json({
                    success: false,
                    message: "Wrong answer. Please try again after waiting.",
                    hint: hint  // Hint được trả về sau 6 phút
                });
            } else {
                // Nếu chưa đủ 6 phút, trả về countdown để hint hiển thị
                const remainingToHint = Math.ceil(sixMinutes - secondsSinceAssigned);
                return res.status(400).json({
                    success: false,
                    message: "Wrong answer. Please try again after waiting.",
                    hintCountdown: remainingToHint  // Số giây còn lại tới khi auto hiển thị hint
                });
            }
        }

        // Nếu đáp án đúng, cập nhật assignment thành công (completed_at) và trả về kết quả thành công
        await db.query(
            `UPDATE team_question_assignments
       SET completed_at = NOW() 
       WHERE assignment_id = $1`,
            [assignment.assignment_id]
        );
        return res.json({ success: true, message: "Correct answer! Stage completed." });
    } catch (err) {
        console.error("Error in submit-answer:", err);
        res.status(500).json({ error: 'Server error while processing your answer.' });
    }
});

// Endpoint GET /api/team/current-stages
// Lấy danh sách các stage hiện hành của team bằng cách sử dụng teamId từ session
router.get('/current-stages', teamAuth, async (req, res) => {
    // Lấy teamId từ session
    console.log("Session:", req.session); // Add this line for debugging
    console.log("Team ID from session:", req.session.teamId); // Add this line for debugging
    const teamId = req.session.teamId;
    if (!teamId) {
        return res.status(401).json({ error: "You are not authenticated" });
    }
    try {
        // Giả sử bạn có bảng team_routes được cập nhật cột open_code_verified
        // Truy vấn các stage chưa hoàn thành cho team, bao gồm thông tin của stage và câu hỏi (nếu có)
        const queryText = `
      SELECT 
        s.stage_id AS "stageId",
        s.stage_number AS "stageNumber",
        s.stage_name AS "stageName",
        s.description,
        s.open_code AS "expectedOpenCode",
        q.question_text AS question,
        q.question_id AS "questionId",
        tr.open_code_verified
      FROM team_routes tr
      JOIN stages s ON tr.stage_id = s.stage_id
      LEFT JOIN questions q ON q.stage_id = s.stage_id
      WHERE tr.team_id = $1 AND tr.completed = false
      ORDER BY tr.route_order
    `;
        const { rows } = await db.query(queryText, [teamId]);

        // Trả về mảng các stage. Mỗi đối tượng có trường open_code_verified đã được backend cập nhật
        return res.json(rows);
    } catch (error) {
        console.error("Error fetching current stages:", error);
        return res.status(500).json({ error: "Error fetching current stages" });
    }
});

module.exports = router;
