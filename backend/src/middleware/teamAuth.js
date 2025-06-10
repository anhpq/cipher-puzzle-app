// backend/src/middleware/teamAuth.js
const TokenUtils = require("../utils/tokenUtils");

function teamAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ error: "Unauthorized: Please log in as team." });
  }

  try {
    const decoded = TokenUtils.verifyToken(token);

    if (decoded.role !== "team") {
      return res
        .status(401)
        .json({ error: "Unauthorized: Please log in as team." });
    }

    req.user = decoded;
    req.teamId = decoded.teamId;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ error: "Unauthorized: Please log in as team." });
  }
}

module.exports = teamAuth;
