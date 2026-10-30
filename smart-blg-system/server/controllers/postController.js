const { pool } = require('../config/db');
const asyncHandler = require('../utils/asyncHandler');
const { createNotification, notifyRoles } = require('./notificationController');

const ALL = ['Draft', 'Pending', 'Approved', 'Rejected', 'Published'];
// Which statuses each role may set
const allowed = {
  Admin: ALL,
  Editor: ALL,
  Author: ['Draft', 'Pending', 'Published'],
  Contributor: ['Draft', 'Pending'], // cannot publish directly
};

const BASE = `SELECT p.post_id, p.user_id, p.category_id, p.title, p.content, p.image, p.status,
  p.reviewer_note, p.created_at, p.updated_at, u.full_name AS author, c.category_name,
  (SELECT COUNT(*) FROM comments cm WHERE cm.post_id = p.post_id) AS comment_count
  FROM posts p JOIN users u ON p.user_id = u.user_id
  LEFT JOIN categories c ON p.category_id = c.category_id`;

const excerpt = (rows) => rows.map((r) => ({ ...r, content: r.content.slice(0, 300) }));

// Called whenever a post becomes Pending or Published
async function notifyStatusChange(post, status, actor) {
  if (status === 'Pending')
    await notifyRoles(['Editor', 'Admin'], `New post waiting for review: "${post.title}"`, actor.user_id);
  if (status === 'Published')
    await notifyRoles(['Subscriber'], `New post published: "${post.title}"`, actor.user_id);
}

// GET /api/posts?search=&category=&page=&limit=   (public, Published only)
exports.getPublished = asyncHandler(async (req, res) => {
  const { search = '', category, page = 1, limit = 9 } = req.query;
  const where = ["p.status = 'Published'"];
  const params = [];
  if (search) {
    where.push('(p.title LIKE ? OR p.content LIKE ?)');
    params.push(`%${search}%`, `%${search}%`);
  }
  if (category) {
    where.push('p.category_id = ?');
    params.push(category);
  }
  const lim = Math.min(Number(limit) || 9, 50);
  const pg = Math.max(Number(page) || 1, 1);
  const [rows] = await pool.query(
    `${BASE} WHERE ${where.join(' AND ')} ORDER BY p.created_at DESC LIMIT ? OFFSET ?`,
    [...params, lim, (pg - 1) * lim]
  );
  const [[{ total }]] = await pool.query(
    `SELECT COUNT(*) AS total FROM posts p WHERE ${where.join(' AND ')}`,
    params
  );
  res.json({ posts: excerpt(rows), total, page: pg, pages: Math.ceil(total / lim) });
});

// GET /api/posts/mine?status=
exports.getMyPosts = asyncHandler(async (req, res) => {
  const params = [req.user.user_id];
  let sql = `${BASE} WHERE p.user_id = ?`;
  if (req.query.status) {
    sql += ' AND p.status = ?';
    params.push(req.query.status);
  }
  const [rows] = await pool.query(sql + ' ORDER BY p.updated_at DESC', params);
  res.json(excerpt(rows));
});

// GET /api/posts/manage/all?status=&search=   (Admin, Editor)
exports.getAllForManagement = asyncHandler(async (req, res) => {
  const where = ['1=1'];
  const params = [];
  if (req.query.status) {
    where.push('p.status = ?');
    params.push(req.query.status);
  }
  if (req.query.search) {
    where.push('(p.title LIKE ? OR u.full_name LIKE ?)');
    params.push(`%${req.query.search}%`, `%${req.query.search}%`);
  }
  const [rows] = await pool.query(
    `${BASE} WHERE ${where.join(' AND ')} ORDER BY p.updated_at DESC`,
    params
  );
  res.json(excerpt(rows));
});

// GET /api/posts/:id
exports.getPost = asyncHandler(async (req, res) => {
  const [rows] = await pool.query(`${BASE} WHERE p.post_id = ?`, [req.params.id]);
  if (!rows.length) return res.status(404).json({ message: 'Post not found' });
  const post = rows[0];
  if (post.status !== 'Published') {
    const u = req.user;
    const ok = u && (u.user_id === post.user_id || ['Admin', 'Editor'].includes(u.role));
    if (!ok) return res.status(403).json({ message: 'This post is not published' });
  }
  res.json(post);
});

// POST /api/posts  (multipart/form-data: title, content, category_id, status, image)
exports.createPost = asyncHandler(async (req, res) => {
  const { title, content, category_id } = req.body;
  const status = req.body.status || 'Draft';
  if (!title || !content) return res.status(400).json({ message: 'Title and content are required' });
  if (!allowed[req.user.role].includes(status))
    return res.status(403).json({ message: `${req.user.role} cannot set status "${status}"` });

  const image = req.file ? `/uploads/${req.file.filename}` : null;
  const [r] = await pool.query(
    'INSERT INTO posts (user_id, category_id, title, content, image, status) VALUES (?,?,?,?,?,?)',
    [req.user.user_id, category_id || null, title, content, image, status]
  );
  await notifyStatusChange({ title }, status, req.user);
  res.status(201).json({ post_id: r.insertId, status, message: 'Post created' });
});

// PUT /api/posts/:id
exports.updatePost = asyncHandler(async (req, res) => {
  const [[post]] = await pool.query('SELECT * FROM posts WHERE post_id = ?', [req.params.id]);
  if (!post) return res.status(404).json({ message: 'Post not found' });

  const isOwner = post.user_id === req.user.user_id;
  const isStaff = ['Admin', 'Editor'].includes(req.user.role);
  if (!isOwner && !isStaff) return res.status(403).json({ message: 'You can only edit your own posts' });
  if (req.user.role === 'Contributor' && !['Draft', 'Pending', 'Rejected'].includes(post.status))
    return res.status(403).json({ message: 'This post is locked. Ask an editor to change it.' });

  const status = req.body.status || post.status;
  if (status !== post.status && !allowed[req.user.role].includes(status))
    return res.status(403).json({ message: `${req.user.role} cannot set status "${status}"` });

  const image = req.file ? `/uploads/${req.file.filename}` : post.image;
  const category =
    req.body.category_id !== undefined ? req.body.category_id || null : post.category_id;
  const title = req.body.title || post.title;

  await pool.query(
    'UPDATE posts SET title = ?, content = ?, category_id = ?, image = ?, status = ? WHERE post_id = ?',
    [title, req.body.content || post.content, category, image, status, post.post_id]
  );

  if (status !== post.status) await notifyStatusChange({ title }, status, req.user);
  if (!isOwner) await createNotification(post.user_id, `Your post "${title}" was edited by ${req.user.full_name}`);
  res.json({ message: 'Post updated', status });
});

// PATCH /api/posts/:id/review  { action: 'approve' | 'reject' | 'publish', note }
exports.reviewPost = asyncHandler(async (req, res) => {
  const { action, note } = req.body;
  const map = { approve: 'Approved', reject: 'Rejected', publish: 'Published' };
  if (!map[action]) return res.status(400).json({ message: 'Action must be approve, reject or publish' });
  if (action === 'reject' && !note) return res.status(400).json({ message: 'Please give a reason for rejection' });

  const [[post]] = await pool.query('SELECT * FROM posts WHERE post_id = ?', [req.params.id]);
  if (!post) return res.status(404).json({ message: 'Post not found' });
  if (post.status === 'Draft') return res.status(400).json({ message: 'Draft posts have not been submitted' });

  await pool.query('UPDATE posts SET status = ?, reviewer_note = ? WHERE post_id = ?', [
    map[action],
    note || null,
    post.post_id,
  ]);

  const msg = {
    approve: `Your post "${post.title}" was approved`,
    reject: `Your post "${post.title}" was rejected: ${note}`,
    publish: `Your post "${post.title}" is now published`,
  }[action];
  await createNotification(post.user_id, msg);
  if (action === 'publish') await notifyStatusChange(post, 'Published', req.user);

  res.json({ message: `Post ${map[action].toLowerCase()}`, status: map[action] });
});

// DELETE /api/posts/:id  (owner or Admin)
exports.deletePost = asyncHandler(async (req, res) => {
  const [[post]] = await pool.query('SELECT user_id FROM posts WHERE post_id = ?', [req.params.id]);
  if (!post) return res.status(404).json({ message: 'Post not found' });
  if (post.user_id !== req.user.user_id && req.user.role !== 'Admin')
    return res.status(403).json({ message: 'You cannot delete this post' });
  await pool.query('DELETE FROM posts WHERE post_id = ?', [req.params.id]);
  res.json({ message: 'Post deleted' });
});