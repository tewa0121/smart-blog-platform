const { query } = require('../config/database');

const createPost = async (title, content, author_id, summary = null, tags = null) => {
    const sql = 'INSERT INTO posts (title, content, summary, tags, author_id) VALUES (?, ?, ?, ?, ?)';
    const [result] = await query(sql, [title, content, summary, tags, author_id]);
    return result.insertId;
};

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

const updatePost = async (id, title, content, summary, tags) => {
    const sql = 'UPDATE posts SET title = ?, content = ?, summary = ?, tags = ? WHERE id = ?';
    const [result] = await query(sql, [title, content, summary, tags, id]);
    return result.affectedRows;
};

const deletePost = async (id) => {
    const sql = 'DELETE FROM posts WHERE id = ?';
    const [result] = await query(sql, [id]);
    return result.affectedRows;
};

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