// server/models/Post.js
// ⭐ Handles all database operations related to blog posts ⭐

const { query } = require('../config/database');

// Create a new post
const createPost = async (title, content, author_id, summary = null, tags = null) => {
    const sql = 'INSERT INTO posts (title, content, summary, tags, author_id) VALUES (?, ?, ?, ?, ?)';
    const [result] = await query(sql, [title, content, summary, tags, author_id]);
    return result.insertId;
};

// Get all posts (for the homepage) - includes author name
const getAllPosts = async () => {
    const sql = `
        SELECT posts.*, users.name as author_name 
        FROM posts 
        JOIN users ON posts.author_id = users.id 
        ORDER BY posts.created_at DESC
    `;
    const [rows] = await query(sql);
    return rows;
};

// Get a single post by ID (with author name and comments count)
const getPostById = async (id) => {
    const sql = `
        SELECT posts.*, users.name as author_name 
        FROM posts 
        JOIN users ON posts.author_id = users.id 
        WHERE posts.id = ?
    `;
    const [rows] = await query(sql, [id]);
    return rows[0];
};

// Update a post (only if the user is the author)
const updatePost = async (id, title, content, summary, tags) => {
    const sql = 'UPDATE posts SET title = ?, content = ?, summary = ?, tags = ? WHERE id = ?';
    const [result] = await query(sql, [title, content, summary, tags, id]);
    return result.affectedRows; // Returns 1 if successful, 0 if no rows updated
};

// Delete a post (only if the user is the author)
const deletePost = async (id) => {
    const sql = 'DELETE FROM posts WHERE id = ?';
    const [result] = await query(sql, [id]);
    return result.affectedRows; // Returns 1 if successful, 0 if no rows deleted
};

// Get posts by a specific user (for dashboard)
const getPostsByAuthor = async (author_id) => {
    const sql = 'SELECT * FROM posts WHERE author_id = ? ORDER BY created_at DESC';
    const [rows] = await query(sql, [author_id]);
    return rows;
};

module.exports = { 
    createPost, 
    getAllPosts, 
    getPostById, 
    updatePost, 
    deletePost,
    getPostsByAuthor 
};