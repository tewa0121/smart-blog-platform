const { pool } = require('../config/db');
const asyncHandler = require('../utils/asyncHandler');

exports.getCategories = asyncHandler(async (req, res) => {
  const [rows] = await pool.query(
    `SELECT c.category_id, c.category_name,
            (SELECT COUNT(*) FROM posts p WHERE p.category_id = c.category_id AND p.status = 'Published') AS post_count
     FROM categories c ORDER BY c.category_name`
  );
  res.json(rows);
});

exports.createCategory = asyncHandler(async (req, res) => {
  const name = (req.body.category_name || '').trim();
  if (!name) return res.status(400).json({ message: 'Category name is required' });
  const [dup] = await pool.query('SELECT category_id FROM categories WHERE category_name = ?', [name]);
  if (dup.length) return res.status(409).json({ message: 'Category already exists' });
  const [r] = await pool.query('INSERT INTO categories (category_name) VALUES (?)', [name]);
  res.status(201).json({ category_id: r.insertId, category_name: name });
});

exports.updateCategory = asyncHandler(async (req, res) => {
  await pool.query('UPDATE categories SET category_name = ? WHERE category_id = ?', [
    req.body.category_name,
    req.params.id,
  ]);
  res.json({ message: 'Category updated' });
});

exports.deleteCategory = asyncHandler(async (req, res) => {
  await pool.query('DELETE FROM categories WHERE category_id = ?', [req.params.id]);
  res.json({ message: 'Category deleted' });
});