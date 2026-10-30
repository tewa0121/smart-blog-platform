const bcrypt = require('bcryptjs');
const { pool } = require('../config/db');
const asyncHandler = require('../utils/asyncHandler');
const generateToken = require('../utils/generateToken');

const publicUser = (u) => ({
  user_id: u.user_id,
  full_name: u.full_name,
  username: u.username,
  email: u.email,
  role: u.role,
});

// POST /api/auth/register  (public registration always creates a Subscriber)
exports.register = asyncHandler(async (req, res) => {
  const { full_name, username, email, password } = req.body;
  if (!full_name || !username || !email || !password)
    return res.status(400).json({ message: 'All fields are required' });
  if (password.length < 6)
    return res.status(400).json({ message: 'Password must be at least 6 characters' });

  const [dup] = await pool.query('SELECT user_id FROM users WHERE email = ? OR username = ?', [email, username]);
  if (dup.length) return res.status(409).json({ message: 'Email or username already exists' });

  const [[role]] = await pool.query("SELECT role_id FROM roles WHERE role_name = 'Subscriber'");
  const hash = await bcrypt.hash(password, 10);
  const [result] = await pool.query(
    'INSERT INTO users (full_name, username, email, password, role_id) VALUES (?,?,?,?,?)',
    [full_name, username, email, hash, role.role_id]
  );
  const user = { user_id: result.insertId, full_name, username, email, role: 'Subscriber' };
  res.status(201).json({ token: generateToken(user.user_id), user });
});

// POST /api/auth/login  (username OR email)
exports.login = asyncHandler(async (req, res) => {
  const identifier = req.body.identifier || req.body.username || req.body.email;
  const { password } = req.body;
  if (!identifier || !password)
    return res.status(400).json({ message: 'Username and password are required' });

  const [rows] = await pool.query(
    `SELECT u.*, r.role_name AS role FROM users u JOIN roles r ON u.role_id = r.role_id
     WHERE u.username = ? OR u.email = ?`,
    [identifier, identifier]
  );
  const user = rows[0];
  if (!user || !(await bcrypt.compare(password, user.password)))
    return res.status(401).json({ message: 'Invalid username or password' });
  if (user.is_blocked) return res.status(403).json({ message: 'Your account is blocked' });

  res.json({ token: generateToken(user.user_id), user: publicUser(user) });
});

// GET /api/auth/me
exports.me = asyncHandler(async (req, res) => res.json(publicUser(req.user)));