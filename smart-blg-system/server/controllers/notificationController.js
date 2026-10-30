const { pool } = require('../config/db');
const asyncHandler = require('../utils/asyncHandler');

// Helpers used by other controllers
exports.createNotification = (userId, message) =>
  pool.query('INSERT INTO notifications (user_id, message) VALUES (?, ?)', [userId, message]);

exports.notifyRoles = (roleNames, message, excludeId = 0) =>
  pool.query(
    `INSERT INTO notifications (user_id, message)
     SELECT u.user_id, ? FROM users u JOIN roles r ON u.role_id = r.role_id
     WHERE r.role_name IN (?) AND u.user_id <> ? AND u.is_blocked = 0`,
    [message, roleNames, excludeId]
  );

exports.getMyNotifications = asyncHandler(async (req, res) => {
  const [rows] = await pool.query(
    'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 100',
    [req.user.user_id]
  );
  res.json(rows);
});

exports.unreadCount = asyncHandler(async (req, res) => {
  const [[{ count }]] = await pool.query(
    'SELECT COUNT(*) AS count FROM notifications WHERE user_id = ? AND is_read = 0',
    [req.user.user_id]
  );
  res.json({ count });
});

exports.markRead = asyncHandler(async (req, res) => {
  await pool.query('UPDATE notifications SET is_read = 1 WHERE notification_id = ? AND user_id = ?', [
    req.params.id,
    req.user.user_id,
  ]);
  res.json({ message: 'Marked as read' });
});

exports.markAllRead = asyncHandler(async (req, res) => {
  await pool.query('UPDATE notifications SET is_read = 1 WHERE user_id = ?', [req.user.user_id]);
  res.json({ message: 'All notifications marked as read' });
});