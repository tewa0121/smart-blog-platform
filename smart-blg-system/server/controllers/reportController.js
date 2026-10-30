const { pool } = require('../config/db');
const asyncHandler = require('../utils/asyncHandler');

exports.getReport = asyncHandler(async (req, res) => {
  const [[users]] = await pool.query('SELECT COUNT(*) AS total FROM users');
  const [[posts]] = await pool.query('SELECT COUNT(*) AS total FROM posts');
  const [[comments]] = await pool.query('SELECT COUNT(*) AS total FROM comments');

  const [usersByRole] = await pool.query(
    `SELECT r.role_name, COUNT(u.user_id) AS count
     FROM roles r LEFT JOIN users u ON u.role_id = r.role_id GROUP BY r.role_id, r.role_name`
  );
  const [postsByStatus] = await pool.query('SELECT status, COUNT(*) AS count FROM posts GROUP BY status');
  const [postsByCategory] = await pool.query(
    `SELECT c.category_name, COUNT(p.post_id) AS count
     FROM categories c LEFT JOIN posts p ON p.category_id = c.category_id
     GROUP BY c.category_id, c.category_name`
  );
  const [topPosts] = await pool.query(
    `SELECT p.post_id, p.title, COUNT(cm.comment_id) AS comments
     FROM posts p LEFT JOIN comments cm ON cm.post_id = p.post_id
     WHERE p.status = 'Published' GROUP BY p.post_id, p.title ORDER BY comments DESC LIMIT 5`
  );

  res.json({
    totals: { users: users.total, posts: posts.total, comments: comments.total },
    usersByRole,
    postsByStatus,
    postsByCategory,
    topPosts,
  });
});