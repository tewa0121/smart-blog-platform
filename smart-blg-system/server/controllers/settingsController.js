const { pool } = require('../config/db');
const asyncHandler = require('../utils/asyncHandler');

async function commentsEnabled() {
  const [rows] = await pool.query(
    "SELECT setting_value FROM settings WHERE setting_key = 'comments_enabled'"
  );
  return !rows.length || rows[0].setting_value !== 'false';
}

// GET /api/settings (public)
exports.getSettings = asyncHandler(async (req, res) => {
  res.json({ comments_enabled: await commentsEnabled() });
});

// PUT /api/settings (Admin)
exports.updateSettings = asyncHandler(async (req, res) => {
  const value = String(Boolean(req.body.comments_enabled));
  await pool.query(
    `INSERT INTO settings (setting_key, setting_value) VALUES ('comments_enabled', ?)
     ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)`,
    [value]
  );
  res.json({ message: 'Settings updated', comments_enabled: value === 'true' });
});

exports.commentsEnabled = commentsEnabled;