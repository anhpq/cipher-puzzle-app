// backend/src/middlewares/teamAuth.js
function teamAuth(req, res, next) {
  if (req.session && req.session.teamId) {
    return next();
  }
  return res.status(401).json({ error: 'Unauthorized: Please log in as team.' });
}

module.exports = teamAuth;
