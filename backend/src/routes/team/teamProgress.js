// backend/src/routes/teamProgress.js
const express = require("express");
const router = express.Router();
const db = require("../../db");
const teamAuth = require("../../middlewares/teamAuth");

// 1. Verify open code cho stage hiện tại (không thay đổi)
router.post("/verify-open-code", teamAuth, async (req, res) => {
  const { stage_id, open_code } = req.body;
  try {
    // Lấy open code của stage hiện tại từ bảng stages
    const stageResult = await db.query(
      "SELECT open_code FROM stages WHERE stage_id = $1",
      [stage_id]
    );
    if (stageResult.rowCount === 0) {
      return res.status(404).json({ error: "Stage not found." });
    }
    const expectedOpenCode = stageResult.rows[0].open_code;
    if (open_code === expectedOpenCode) {
      // Cập nhật team_routes: đánh dấu stage hiện tại đã verify open code và set start_at = NOW()
      const result = await db.query(
        "UPDATE team_routes SET open_code_verified = TRUE, start_at = NOW() WHERE stage_id = $1 AND team_id = $2 RETURNING *",
        [stage_id, req.session.teamId]
      );
      if (result.rowCount === 0) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid code." });
      }
      return res.json({ success: true, message: "Open code is valid." });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Invalid open code." });
    }
  } catch (err) {
    console.error("Error verifying open code:", err);
    res.status(500).json({ error: "Server error verifying open code." });
  }
});

// 2. Record start time (cho Stage 1)
router.put("/start-time", teamAuth, async (req, res) => {
  const team_id = req.session.teamId;
  try {
    const result = await db.query(
      "UPDATE teams SET start_time = NOW() WHERE team_id = $1 RETURNING *",
      [team_id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Team not found." });
    }
    res.json({ success: true, team: result.rows[0] });
  } catch (err) {
    console.error("Error recording start time:", err);
    res.status(500).json({ error: "Server error recording start time." });
  }
});

// 3. Advance stage (không thay đổi)
router.put("/advance-stage", teamAuth, async (req, res) => {
  const { stage_id } = req.body;
  const team_id = req.session.teamId;
  try {
    const updateResult = await db.query(
      "UPDATE team_routes SET completed = true, completed_at = NOW() WHERE team_id = $1 AND stage_id = $2 RETURNING *",
      [team_id, stage_id]
    );
    if (updateResult.rowCount === 0) {
      return res
        .status(404)
        .json({ error: "Stage not found or already completed." });
    }
    const nextStage = await db.query(
      `SELECT stage_id 
       FROM team_routes 
       WHERE team_id = $1 AND completed = false
       ORDER BY route_order
       LIMIT 1`,
      [team_id]
    );
    if (nextStage.rowCount === 0) {
      return res.json({ success: true, message: "All stages completed." });
    }
    const newStageId = nextStage.rows[0].stage_id;
    await db.query(
      "UPDATE teams SET current_stage_id = $1 WHERE team_id = $2",
      [newStageId, team_id]
    );
    res.json({ success: true, new_stage_id: newStageId });
  } catch (err) {
    console.error("Error advancing stage:", err);
    res.status(500).json({ error: "Server error advancing stage." });
  }
});

// 4. Refresh stage (reset attempts) – không thay đổi
router.put("/refresh-stage", teamAuth, async (req, res) => {
  const { stage_id } = req.body;
  const team_id = req.session.teamId;
  try {
    await db.query(
      "UPDATE team_question_assignments SET attempts = 0 WHERE team_id = $1 AND stage_id = $2",
      [team_id, stage_id]
    );
    res.json({ success: true, message: "Stage refreshed successfully." });
  } catch (err) {
    console.error("Error refreshing stage:", err);
    res.status(500).json({ error: "Server error refreshing stage." });
  }
});

// 5. Submit answer endpoint:
//    Khi team submit câu trả lời, đáp án sẽ được so sánh với câu hỏi của stage tiếp theo (stage N+1)
router.post("/submit-answer", teamAuth, async (req, res) => {
  const { answer } = req.body;
  const team_id = req.session.teamId;
  try {
    // Lấy team_routes của stage hiện tại (đã verify open code, chưa hoàn thành)
    const currentRouteRes = await db.query(
      "SELECT * FROM team_routes WHERE team_id = $1 AND open_code_verified = TRUE AND completed = false ORDER BY route_order LIMIT 1",
      [team_id]
    );
    if (currentRouteRes.rowCount === 0) {
      return res.status(400).json({ error: "Current stage not set." });
    }
    const currentRoute = currentRouteRes.rows[0];

    // Lấy stage tiếp theo (stage N+1) theo thứ tự route_order
    const nextRouteRes = await db.query(
      "SELECT * FROM team_routes WHERE team_id = $1 AND route_order > $2 ORDER BY route_order LIMIT 1",
      [team_id, currentRoute.route_order]
    );
    if (nextRouteRes.rowCount === 0) {
      return res.status(400).json({
        error: "No next stage available. Possibly game is completed.",
      });
    }
    const nextRoute = nextRouteRes.rows[0];

    // Lấy bản ghi assignment của stage N+1
    const assignmentRes = await db.query(
      `SELECT * FROM team_question_assignments 
       WHERE team_id = $1 AND stage_id = $2 AND completed_at IS NULL 
       LIMIT 1`,
      [team_id, nextRoute.stage_id]
    );
    if (assignmentRes.rowCount === 0) {
      return res.status(404).json({
        error: "Assignment for next stage not found or already completed.",
      });
    }
    const assignment = assignmentRes.rows[0];

    const attempts = assignment.attempts || 0;
    const lastAttemptAt = assignment.last_attempt_at
      ? new Date(assignment.last_attempt_at)
      : null;
    const now = new Date();
    const waitingTime = Math.min((attempts + 1) * 5, 15);
    if (lastAttemptAt) {
      const elapsedSeconds = (now - lastAttemptAt) / 1000;
      if (elapsedSeconds < waitingTime) {
        const remaining = Math.ceil(waitingTime - elapsedSeconds);
        return res.status(429).json({
          success: false,
          message: `Wrong answer. Please wait ${remaining} more seconds before trying again.`,
        });
      }
    }
    // Lấy đáp án đúng của câu hỏi ở stage N+1
    const questionRes = await db.query(
      "SELECT answer as correct_answer FROM questions WHERE question_id = $1",
      [assignment.question_id]
    );
    if (questionRes.rowCount === 0) {
      return res.status(404).json({ error: "Question not found." });
    }
    const correctAnswer = questionRes.rows[0].correct_answer;
    if (answer.toLowerCase() !== correctAnswer.toLowerCase()) {
      await db.query(
        `UPDATE team_question_assignments 
         SET attempts = attempts + 1, last_attempt_at = NOW() 
         WHERE assignment_id = $1`,
        [assignment.assignment_id]
      );
      return res.status(400).json({
        success: false,
        message: `Wrong answer. Please wait ${waitingTime} seconds before trying again.`,
      });
    }

    // Nếu trả lời đúng:
    // 1. Cập nhật assignment đã hoàn thành
    await db.query(
      `UPDATE team_question_assignments 
       SET completed_at = NOW() 
       WHERE assignment_id = $1`,
      [assignment.assignment_id]
    );

    // 2. Kiểm tra xem đây có phải là stage cuối cùng không
    const maxRouteOrderRes = await db.query(
      "SELECT MAX(route_order) as max_order FROM team_routes WHERE team_id = $1",
      [team_id]
    );
    const maxRouteOrder = maxRouteOrderRes.rows[0].max_order;
    const isFinalStage = nextRoute.route_order === maxRouteOrder;

    if (isFinalStage) {
      // Nếu đây là stage cuối, cập nhật cả current stage và next stage là completed
      await db.query(
        "UPDATE team_routes SET completed = true, completed_at = NOW() WHERE team_id = $1 AND stage_id IN ($2, $3)",
        [team_id, currentRoute.stage_id, nextRoute.stage_id]
      );

      return res.json({
        success: true,
        message: "Correct answer! Game completed!",
        gameCompleted: true,
      });
    } else {
      // Nếu không phải stage cuối, chỉ trả về thành công
      return res.json({
        success: true,
        message: "Correct answer!",
      });
    }
  } catch (err) {
    console.error("Error in submit-answer:", err);
    res
      .status(500)
      .json({ error: "Server error while processing your answer." });
  }
});

// 6. Get hint endpoint cho stage N+1:
//    Trả về thông tin hint cho câu hỏi của stage tiếp theo (bao gồm elapsedSeconds, hint1 và hint2)
router.get("/get-hint", teamAuth, async (req, res) => {
  const teamId = req.session.teamId;
  try {
    // Lấy team_routes của stage hiện tại (đã verify open code)
    const currentRes = await db.query(
      "SELECT * FROM team_routes WHERE team_id = $1 AND open_code_verified = TRUE AND completed = false ORDER BY route_order LIMIT 1",
      [teamId]
    );
    if (currentRes.rowCount === 0) {
      return res.status(400).json({ error: "Current stage not set." });
    }
    const currentRoute = currentRes.rows[0];
    // Lấy stage tiếp theo (stage N+1)
    const nextRes = await db.query(
      "SELECT * FROM team_routes WHERE team_id = $1 AND route_order > $2 AND completed = false ORDER BY route_order LIMIT 1",
      [teamId, currentRoute.route_order]
    );
    if (nextRes.rowCount === 0) {
      return res.status(404).json({ error: "No next stage available." });
    }
    const nextStage = nextRes.rows[0];
    // Nếu nextStage.start_at chưa có (chưa verify), dùng thời gian bắt đầu của stage hiện tại
    const nextStartAt = nextStage.start_at
      ? new Date(nextStage.start_at)
      : new Date(currentRoute.start_at);
    const now = new Date();
    const elapsedSeconds = Math.floor((now - nextStartAt) / 1000);

    // Ví dụ dùng ngưỡng 10 và 20 giây cho hint (bạn có thể cấu hình lại giá trị này)
    const HINT1_THRESHOLD = parseInt(process.env.HINT_THRESHOLD);
    const HINT2_THRESHOLD = HINT1_THRESHOLD * 2;

    const questionRes = await db.query(
      "SELECT hint1, hint2 FROM questions WHERE stage_id = $1 LIMIT 1",
      [nextStage.stage_id]
    );
    if (questionRes.rowCount === 0) {
      return res
        .status(404)
        .json({ error: "Question for next stage not found" });
    }
    const { hint1, hint2 } = questionRes.rows[0];
    const hints = {};
    hints.elapsedSeconds = elapsedSeconds;
    if (elapsedSeconds >= HINT1_THRESHOLD && hint1) {
      hints.hint1 = hint1.toString("base64");
    }
    if (elapsedSeconds >= HINT2_THRESHOLD && hint2) {
      hints.hint2 = hint2.toString("base64");
    }
    return res.json({ success: true, hint: hints });
  } catch (err) {
    console.error("Error fetching hint:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// 7. Get current stages endpoint – hiển thị các stage hiện tại của team (dùng cho giao diện)
router.get("/current-stages", teamAuth, async (req, res) => {
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
        q.question_text AS question,
        q.question_id AS "questionId",
        tr.completed,
        tr.open_code_verified,
        s.location_image
      FROM team_routes tr
      JOIN stages s ON tr.stage_id = s.stage_id
      JOIN questions q ON q.stage_id = s.stage_id
      JOIN team_question_assignments tqa 
          ON tqa.team_id = tr.team_id 
         AND tqa.stage_id = s.stage_id 
         AND tqa.question_id = q.question_id
      WHERE tr.team_id = $1 
      ORDER BY tr.route_order;
    `;
    const { rows } = await db.query(queryText, [teamId]);
    rows.forEach((row) => {
      if (row.location_image) {
        row.location_image = row.location_image.toString("base64");
      }
    });
    return res.json(rows);
  } catch (error) {
    console.error("Error fetching current stages:", error);
    return res.status(500).json({ error: "Error fetching current stages" });
  }
});

// 8. Next-stage endpoint: Return information for the next stage’s question (stage N+1)
router.get("/next-stage", teamAuth, async (req, res) => {
  const teamId = req.session.teamId;
  try {
    // Get current stage (verified and not completed)
    const currentRes = await db.query(
      "SELECT * FROM team_routes WHERE team_id = $1 AND open_code_verified = TRUE AND completed = false ORDER BY route_order LIMIT 1",
      [teamId]
    );
    if (currentRes.rowCount === 0) {
      return res.status(400).json({ error: "Current stage not set." });
    }
    const currentRoute = currentRes.rows[0];

    // Get the next stage regardless of completed status so that even if it's final, we include it.
    const nextRes = await db.query(
      `SELECT tr.*,
              s.stage_number,
              s.stage_name,
              s.description,
              s.location_image
       FROM team_routes tr
       JOIN stages s ON tr.stage_id = s.stage_id
       WHERE tr.team_id = $1
         AND tr.route_order > $2
       ORDER BY tr.route_order
       LIMIT 1`,
      [teamId, currentRoute.route_order]
    );
    if (nextRes.rowCount === 0) {
      // No next stage means all stages have been completed.
      return res.status(404).json({ error: "No next stage available." });
    }
    const nextStage = nextRes.rows[0];

    // Determine if nextStage is final by comparing its route_order with the maximum route_order
    const maxRes = await db.query(
      "SELECT MAX(route_order) AS max_order FROM team_routes WHERE team_id = $1",
      [teamId]
    );
    const maxOrder = maxRes.rows[0].max_order;
    nextStage.isFinal = nextStage.route_order === Number(maxOrder);

    // Query for the question from questions joined with team_question_assignments for stage N+1
    const questionRes = await db.query(
      `SELECT q.question_text, q.question_id
       FROM questions q
       JOIN team_question_assignments tqa 
           ON tqa.stage_id = q.stage_id AND tqa.question_id = q.question_id
       WHERE q.stage_id = $1 AND tqa.team_id = $2
       LIMIT 1`,
      [nextStage.stage_id, teamId]
    );
    if (questionRes.rowCount === 0) {
      return res
        .status(404)
        .json({ error: "Question for next stage not found" });
    }
    nextStage.question = questionRes.rows[0].question_text;
    nextStage.questionId = questionRes.rows[0].question_id;
    if (nextStage.location_image) {
      nextStage.location_image = nextStage.location_image.toString("base64");
    }
    return res.json({ success: true, nextStage });
  } catch (err) {
    console.error("Error fetching next stage:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// 9. Total time endpoint (không thay đổi)
router.get("/total-time", teamAuth, async (req, res) => {
  try {
    const teamId = req.session.teamId;
    if (!teamId)
      return res.status(401).json({ error: "Not authenticated as team." });
    const query = `
      SELECT
        EXTRACT(EPOCH FROM (
          MAX(tr.completed_at) - MIN(t.start_time)
        )) AS total_seconds
      FROM team_routes tr
      JOIN teams t ON tr.team_id = t.team_id
      WHERE tr.team_id = $1 AND tr.completed = true
    `;
    const result = await db.query(query, [teamId]);
    if (!result.rows[0] || result.rows[0].total_seconds == null) {
      return res.status(400).json({ error: "Completion data not available." });
    }
    res.json({ total_seconds: Math.floor(result.rows[0].total_seconds) });
  } catch (err) {
    console.error("Error calculating total time:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
