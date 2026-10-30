const { pool } = require('../config/db');
const asyncHandler = require('../utils/asyncHandler');

exports.getRoles = asyncHandler(async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM roles ORDER BY role_id');
  res.json(rows);
});