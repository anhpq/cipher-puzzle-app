// backend/src/routes/teamProgress.js
const express = require('express');
const router = express.Router();
const db = require('../../db');
const teamAuth = require('../../middlewares/teamAuth');

// 1. Verify open code
router.post('/verify-open-code', teamAuth, async (req, res) => {
    const { stage_id, open_code } = req.body;
    try {
        // Retrieve the expected open code for the stage
        const stageResult = await db.query(
            'SELECT open_code FROM stages WHERE stage_id = $1',
            [stage_id]
        );
        if (stageResult.rowCount === 0) {
            return res.status(404).json({ error: 'Stage not found.' });
        }
        const expectedOpenCode = stageResult.rows[0].open_code;
        if (open_code === expectedOpenCode) {
            // Update the team_routes record to mark this stage as open-code verified
            const result = await db.query(
                'UPDATE team_routes SET open_code_verified = TRUE, start_at = NOW() WHERE stage_id = $1 AND team_id = $2 RETURNING *',
                [stage_id, req.session.teamId]
            );
            if (result.rowCount === 0) {
                return res.status(400).json({ success: false, message: 'Invalid code.' });
            }
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
    const team_id = req.session.teamId;
    try {
        // Update the team record with the current time as start_time.
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
    const { stage_id } = req.body;
    const team_id = req.session.teamId;
    try {
        // Mark the current stage as completed.
        const updateResult = await db.query(
            'UPDATE team_routes SET completed = true, completed_at = NOW() WHERE team_id = $1 AND stage_id = $2 RETURNING *',
            [team_id, stage_id]
        );
        if (updateResult.rowCount === 0) {
            return res.status(404).json({ error: 'Stage not found or already completed.' });
        }
        // Select the next pending stage: the one with the lowest route_order.
        const nextStage = await db.query(
            `SELECT stage_id 
       FROM team_routes 
       WHERE team_id = $1 AND completed = false
       ORDER BY route_order
       LIMIT 1`,
            [team_id]
        );
        if (nextStage.rowCount === 0) {
            // If none left, all stages are completed.
            return res.json({ success: true, message: 'All stages completed.' });
        }
        const newStageId = nextStage.rows[0].stage_id;
        // Update the team's current_stage_id.
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

// 4. Refresh stage (reset attempts)
router.put('/refresh-stage', teamAuth, async (req, res) => {
    const { stage_id } = req.body;
    const team_id = req.session.teamId;
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

// 5. Submit answer endpoint (without hint logic)
router.post('/submit-answer', teamAuth, async (req, res) => {
    const { stage_id, question_id, answer } = req.body;
    const team_id = req.session.teamId;
    try {
        // Retrieve the active assignment record (i.e. not completed yet)
        const assignmentResult = await db.query(
            `SELECT * FROM team_question_assignments 
       WHERE team_id = $1 
         AND stage_id = $2 
         AND question_id = $3 
         AND completed_at IS NULL 
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
        const waitingTime = Math.min((attempts + 1) * 5, 15);
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
        // Get the correct answer for the question.
        const questionResult = await db.query(
            'SELECT answer as correct_answer FROM questions WHERE question_id = $1',
            [question_id]
        );
        if (questionResult.rowCount === 0) {
            return res.status(404).json({ error: 'Question not found.' });
        }
        const correctAnswer = questionResult.rows[0].correct_answer;
        if (answer !== correctAnswer) {
            // Increase attempts and update last attempt time.
            await db.query(
                `UPDATE team_question_assignments 
         SET attempts = attempts + 1, last_attempt_at = NOW() 
         WHERE assignment_id = $1`,
                [assignment.assignment_id]
            );
            const remaining = waitingTime;
            return res.status(400).json({
                success: false,
                message: `Wrong answer. Please wait ${remaining} more seconds before trying again.`
            });
        }
        // Mark assignment as completed.
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

// 6. Get hint endpoint (separate API)
// GET /api/team-progress/get-hint
router.get('/get-hint', async (req, res) => {
    const teamId = req.session.teamId;
    const { stage_id, question_id } = req.query;

    if (!teamId || !stage_id || !question_id) {
        return res.status(400).json({ error: 'Missing parameters or not authenticated' });
    }

    try {
        // Lấy start_at của team tại stage này
        const routeResult = await db.query(
            `SELECT start_at FROM team_routes
       WHERE team_id = $1 AND stage_id = $2`,
            [teamId, stage_id]
        );

        if (routeResult.rows.length === 0 || !routeResult.rows[0].start_at) {
            return res.status(404).json({ error: 'Route not started yet.' });
        }

        const startAt = new Date(routeResult.rows[0].start_at);
        const now = new Date();
        const elapsedSeconds = Math.floor((now - startAt) / 1000);

        // Lấy dữ liệu hint từ bảng questions
        const questionResult = await db.query(
            `SELECT hint1, hint2 FROM questions WHERE question_id = $1`,
            [question_id]
        );

        if (questionResult.rows.length === 0) {
            return res.status(404).json({ error: 'Question not found' });
        }

        const { hint1, hint2 } = questionResult.rows[0];
        const hints = {};
        hints.elapsedSeconds = elapsedSeconds;

        if (elapsedSeconds >= 360 && hint1) {
            hints.hint1 = hint1.toString('base64');
        }

        if (elapsedSeconds >= 720 && hint2) {
            hints.hint2 = hint2.toString('base64');
        }

        return res.json({ success: true, hint: hints });
    } catch (err) {
        console.error('Error fetching hint:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

// 7. Get current stages endpoint
router.get('/current-stages', teamAuth, async (req, res) => {
    const teamId = req.session.teamId;
    if (!teamId) {
        return res.status(401).json({ error: "You are not authenticated" });
    }
    try {
        const queryText = `
      SELECT 
        s.stage_id AS "stageId",
        tr.route_order AS "stageNumber",
        s.stage_name AS "stageName",
        s.description,
        s.open_code AS "expectedOpenCode",
        q.question_text AS question,
        q.question_id AS "questionId",
        tr.open_code_verified
      FROM team_routes tr
      JOIN stages s ON tr.stage_id = s.stage_id
      JOIN questions q ON q.stage_id = s.stage_id
      JOIN team_question_assignments tqa 
          ON tqa.team_id = tr.team_id 
         AND tqa.stage_id = s.stage_id 
         AND tqa.question_id = q.question_id
      WHERE tr.team_id = $1 
         AND tr.completed = false
      ORDER BY tr.route_order;
    `;
        const { rows } = await db.query(queryText, [teamId]);
        return res.json(rows);
    } catch (error) {
        console.error("Error fetching current stages:", error);
        return res.status(500).json({ error: "Error fetching current stages" });
    }
});

// GET /api/team-progress/total-time
router.get('/total-time', async (req, res) => {
    try {
        const teamId = req.session.teamId;
        if (!teamId) return res.status(401).json({ error: 'Not authenticated as team.' });

        const query = `
      SELECT
        EXTRACT(EPOCH FROM (
          MAX(tr.completed_at) - MIN(tp.start_time)
        )) AS total_seconds
      FROM team_routes tr
      JOIN team_progress tp ON tr.team_id = tp.team_id
      WHERE tr.team_id = $1 AND tr.completed = true
    `;
        const result = await db.query(query, [teamId]);

        if (!result.rows[0] || result.rows[0].total_seconds == null) {
            return res.status(400).json({ error: 'Completion data not available.' });
        }

        res.json({ total_seconds: Math.floor(result.rows[0].total_seconds) });
    } catch (err) {
        console.error('Error calculating total time:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
