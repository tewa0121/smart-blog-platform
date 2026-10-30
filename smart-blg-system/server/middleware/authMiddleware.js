const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');

const SQL = `SELECT u.user_id, u.full_name, u.username, u.email, u.is_blocked, r.role_name AS role
             FROM users u JOIN roles r ON u.role_id = r.role_id WHERE u.user_id = ?`;

async function getUser(req) {
  const h = req.headers.authorization;
  if (!h || !h.startsWith('Bearer ')) return null;
  const decoded = jwt.verify(h.split(' ')[1], process.env.JWT_SECRET);
  const [rows] = await pool.query(SQL, [decoded.id]);
  return rows[0] || null;
}

// Login required
exports.protect = async (req, res, next) => {
  try {
    const user = await getUser(req);
    if (!user) return res.status(401).json({ message: 'Not authorized, please login' });
    if (user.is_blocked) return res.status(403).json({ message: 'Your account is blocked' });
    req.user = user;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// Login optional (req.user is set if a valid token exists)
exports.optionalAuth = async (req, res, next) => {
  try {
    const user = await getUser(req);
    if (user && !user.is_blocked) req.user = user;
  } catch { /* ignore */ }
  next();
};