const { pool } = require('../config/db');
const asyncHandler = require('../utils/asyncHandler');
const { createNotification } = require('./notificationController');
const { commentsEnabled } = require('./settingsController');

exports.getComments = asyncHandler(async (req, res) => {
  const [rows] = await pool.query(
    `SELECT c.comment_id, c.comment_text, c.created_at, c.user_id, u.full_name
     FROM comments c JOIN users u ON c.user_id = u.user_id
     WHERE c.post_id = ? ORDER BY c.created_at DESC`,
    [req.params.postId]
  );
  res.json(rows);
});

exports.getMyComments = asyncHandler(async (req, res) => {
  const [rows] = await pool.query(
    `SELECT c.comment_id, c.comment_text, c.created_at, c.post_id, p.title AS post_title
     FROM comments c JOIN posts p ON c.post_id = p.post_id
     WHERE c.user_id = ? ORDER BY c.created_at DESC`,
    [req.user.user_id]
  );
  res.json(rows);
});

exports.addComment = asyncHandler(async (req, res) => {
  if (!(await commentsEnabled()))
    return res.status(403).json({ message: 'Comments are turned off by the administrator' });

  const text = (req.body.comment_text || '').trim();
  if (!text) return res.status(400).json({ message: 'Comment cannot be empty' });

  const [[post]] = await pool.query(
    "SELECT post_id, user_id, title FROM posts WHERE post_id = ? AND status = 'Published'",
    [req.params.postId]
  );
  if (!post) return res.status(404).json({ message: 'Published post not found' });

  const [r] = await pool.query('INSERT INTO comments (post_id, user_id, comment_text) VALUES (?,?,?)', [
    post.post_id,
    req.user.user_id,
    text,
  ]);
  if (post.user_id !== req.user.user_id)
    await createNotification(post.user_id, `${req.user.full_name} commented on "${post.title}"`);
  res.status(201).json({ comment_id: r.insertId, message: 'Comment added' });
});

exports.deleteComment = asyncHandler(async (req, res) => {
  const [[c]] = await pool.query('SELECT user_id FROM comments WHERE comment_id = ?', [req.params.id]);
  if (!c) return res.status(404).json({ message: 'Comment not found' });
  if (c.user_id !== req.user.user_id && !['Admin', 'Editor'].includes(req.user.role))
    return res.status(403).json({ message: 'You cannot delete this comment' });
  await pool.query('DELETE FROM comments WHERE comment_id = ?', [req.params.id]);
  res.json({ message: 'Comment deleted' });
});