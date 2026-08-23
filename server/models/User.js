// // server/models/User.js
// // ⭐ Handles all database operations related to users ⭐

// const { query } = require('../config/database');
// const bcrypt = require('bcrypt');

// // Create a new user (hash password first)
// const createUser = async (name, email, password) => {
//     // Hash the password with 10 salt rounds
//     const password_hash = await bcrypt.hash(password, 10);
    
//     const sql = 'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)';
//     const [result] = await query(sql, [name, email, password_hash]);
//     return result.insertId; // Return the new user's ID
// };

// // Find a user by email (for login)
// const findUserByEmail = async (email) => {
//     const sql = 'SELECT * FROM users WHERE email = ?';
//     const [rows] = await query(sql, [email]);
//     return rows[0]; // Return the first user found (or undefined)
// };

// // Find a user by ID (for protected routes)
// const findUserById = async (id) => {
//     const sql = 'SELECT id, name, email, created_at FROM users WHERE id = ?';
//     const [rows] = await query(sql, [id]);
//     return rows[0];
// };

// module.exports = { createUser, findUserByEmail, findUserById };