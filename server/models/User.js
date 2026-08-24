const { query } = require('../config/database');
const bcrypt = require('bcrypt');

const createUser = async (name, email, password) => {
    const password_hash = await bcrypt.hash(password, 10);
    const sql = 'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)';
    const [result] = await query(sql, [name, email, password_hash]);
    return result.insertId;
};

const findUserByEmail = async (email) => {
    const sql = 'SELECT * FROM users WHERE email = ?';
    const [rows] = await query(sql, [email]);
    return rows[0];
};

const findUserById = async (id) => {
    const sql = 'SELECT id, name, email, created_at FROM users WHERE id = ?';
    const [rows] = await query(sql, [id]);
    return rows[0];
};

module.exports = { createUser, findUserByEmail, findUserById };