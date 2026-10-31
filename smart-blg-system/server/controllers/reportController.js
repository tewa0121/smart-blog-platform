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

  // Recent activity feed (new users, post changes, comments)
  const [newUsers] = await pool.query(
    `SELECT u.full_name AS actor, r.role_name, u.created_at AS at
     FROM users u JOIN roles r ON u.role_id = r.role_id ORDER BY u.created_at DESC LIMIT 10`
  );
  const [recentPosts] = await pool.query(
    `SELECT p.post_id, p.title, p.status, u.full_name AS actor, p.updated_at AS at
     FROM posts p JOIN users u ON p.user_id = u.user_id ORDER BY p.updated_at DESC LIMIT 10`
  );
  const [recentComments] = await pool.query(
    `SELECT c.post_id, p.title, u.full_name AS actor, c.created_at AS at
     FROM comments c JOIN users u ON c.user_id = u.user_id JOIN posts p ON c.post_id = p.post_id
     ORDER BY c.created_at DESC LIMIT 10`
  );

  const recent = [
    ...newUsers.map((x) => ({ type: 'user', actor: x.actor, text: `joined as ${x.role_name}`, at: x.at })),
    ...recentPosts.map((x) => ({
      type: 'post', actor: x.actor, post_id: x.post_id,
      text: `${x.status === 'Published' ? 'published' : 'saved'} "${x.title}" (${x.status})`, at: x.at,
    })),
    ...recentComments.map((x) => ({
      type: 'comment', actor: x.actor, post_id: x.post_id, text: `commented on "${x.title}"`, at: x.at,
    })),
  ]
    .sort((a, b) => new Date(b.at) - new Date(a.at))
    .slice(0, 10);

  res.json({
    totals: { users: users.total, posts: posts.total, comments: comments.total },
    usersByRole,
    postsByStatus,
    postsByCategory,
    topPosts,
    recent,
  });
});