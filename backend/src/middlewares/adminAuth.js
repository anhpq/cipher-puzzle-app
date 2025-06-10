// backend/src/middlewares/adminAuth.js
function adminAuth(req, res, next) {
  if (req.session && req.session.cookie.admin) {
    return next();
  }
  return res.status(401).json({ error: 'Unauthorized: Please log in as admin.' });
}

module.exports = adminAuth;
