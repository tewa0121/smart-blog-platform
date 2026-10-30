const bcrypt = require('bcryptjs');
const { pool } = require('../config/db');
const asyncHandler = require('../utils/asyncHandler');

// Admin: list users
exports.getUsers = asyncHandler(async (req, res) => {
  const search = `%${req.query.search || ''}%`;
  const [rows] = await pool.query(
    `SELECT u.user_id, u.full_name, u.username, u.email, u.is_blocked, u.created_at,
            u.role_id, r.role_name AS role
     FROM users u JOIN roles r ON u.role_id = r.role_id
     WHERE u.full_name LIKE ? OR u.username LIKE ? OR u.email LIKE ?
     ORDER BY u.created_at DESC`,
    [search, search, search]
  );
  res.json(rows);
});

// Admin: register a user with any role
exports.createUser = asyncHandler(async (req, res) => {
  const { full_name, username, email, password, role_id } = req.body;
  if (!full_name || !username || !email || !password || !role_id)
    return res.status(400).json({ message: 'All fields are required' });
  const [dup] = await pool.query('SELECT user_id FROM users WHERE email = ? OR username = ?', [email, username]);
  if (dup.length) return res.status(409).json({ message: 'Email or username already exists' });
  const hash = await bcrypt.hash(password, 10);
  const [r] = await pool.query(
    'INSERT INTO users (full_name, username, email, password, role_id) VALUES (?,?,?,?,?)',
    [full_name, username, email, hash, role_id]
  );
  res.status(201).json({ user_id: r.insertId, message: 'User created' });
});

// Admin: assign role
exports.updateRole = asyncHandler(async (req, res) => {
  if (Number(req.params.id) === req.user.user_id)
    return res.status(400).json({ message: 'You cannot change your own role' });
  await pool.query('UPDATE users SET role_id = ? WHERE user_id = ?', [req.body.role_id, req.params.id]);
  res.json({ message: 'Role updated' });
});

// Admin: block / unblock
exports.toggleBlock = asyncHandler(async (req, res) => {
  if (Number(req.params.id) === req.user.user_id)
    return res.status(400).json({ message: 'You cannot block yourself' });
  await pool.query('UPDATE users SET is_blocked = NOT is_blocked WHERE user_id = ?', [req.params.id]);
  res.json({ message: 'User status updated' });
});

// Admin: delete
exports.deleteUser = asyncHandler(async (req, res) => {
  if (Number(req.params.id) === req.user.user_id)
    return res.status(400).json({ message: 'You cannot delete yourself' });
  await pool.query('DELETE FROM users WHERE user_id = ?', [req.params.id]);
  res.json({ message: 'User deleted' });
});

// Any user: update own profile
exports.updateProfile = asyncHandler(async (req, res) => {
  const { full_name, username, email } = req.body;
  const id = req.user.user_id;
  const [dup] = await pool.query(
    'SELECT user_id FROM users WHERE (email = ? OR username = ?) AND user_id <> ?',
    [email, username, id]
  );
  if (dup.length) return res.status(409).json({ message: 'Email or username already used' });
  await pool.query('UPDATE users SET full_name = ?, username = ?, email = ? WHERE user_id = ?', [
    full_name || req.user.full_name,
    username || req.user.username,
    email || req.user.email,
    id,
  ]);
  res.json({ message: 'Profile updated' });
});

// Any user: change own password
exports.changePassword = asyncHandler(async (req, res) => {
  const { current_password, new_password } = req.body;
  if (!new_password || new_password.length < 6)
    return res.status(400).json({ message: 'New password must be at least 6 characters' });
  const [[u]] = await pool.query('SELECT password FROM users WHERE user_id = ?', [req.user.user_id]);
  if (!(await bcrypt.compare(current_password || '', u.password)))
    return res.status(400).json({ message: 'Current password is incorrect' });
  await pool.query('UPDATE users SET password = ? WHERE user_id = ?', [
    await bcrypt.hash(new_password, 10),
    req.user.user_id,
  ]);
  res.json({ message: 'Password changed' });
});