const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

// Pool used by all controllers (connects lazily, after initDB creates the database)
const pool = mysql.createPool({
  host: DB_HOST,
  port: Number(DB_PORT),
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  charset: 'utf8mb4',
});

const tables = [
  `CREATE TABLE IF NOT EXISTS roles (
    role_id INT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255)
  )`,

  `CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(120) NOT NULL,
    username VARCHAR(60) NOT NULL UNIQUE,
    email VARCHAR(120) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role_id INT NOT NULL,
    is_blocked TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(role_id)
  )`,

  `CREATE TABLE IF NOT EXISTS categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(80) NOT NULL UNIQUE
  )`,

  `CREATE TABLE IF NOT EXISTS posts (
    post_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    category_id INT,
    title VARCHAR(255) NOT NULL,
    content LONGTEXT NOT NULL,
    image VARCHAR(255),
    status ENUM('Draft','Pending','Approved','Rejected','Published') DEFAULT 'Draft',
    reviewer_note VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE SET NULL
  )`,

  `CREATE TABLE IF NOT EXISTS comments (
    comment_id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT NOT NULL,
    user_id INT NOT NULL,
    comment_text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
  )`,

  `CREATE TABLE IF NOT EXISTS notifications (
    notification_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    message VARCHAR(500) NOT NULL,
    is_read TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
  )`,
];

const roles = [
  ['Admin', 'Full control of the whole system'],
  ['Editor', 'Reviews, edits, approves and publishes posts'],
  ['Author', 'Writes and publishes own posts'],
  ['Contributor', 'Writes posts and submits them for review'],
  ['Subscriber', 'Reads posts and comments'],
];

const categories = ['Education', 'Technology', 'Health', 'News', 'Business'];

async function initDB() {
  // 1. Create the database if it does not exist
  const conn = await mysql.createConnection({
    host: DB_HOST,
    port: Number(DB_PORT),
    user: DB_USER,
    password: DB_PASSWORD,
  });
  await conn.query(
    `CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
  );
  await conn.end();

  // 2. Create all tables
  for (const sql of tables) await pool.query(sql);

  // 3. Seed roles
  for (const [name, desc] of roles) {
    await pool.query(
      'INSERT IGNORE INTO roles (role_name, description) VALUES (?, ?)',
      [name, desc]
    );
  }

  // 4. Seed categories
  for (const c of categories) {
    await pool.query('INSERT IGNORE INTO categories (category_name) VALUES (?)', [c]);
  }

  // 5. Seed default admin
  const [existing] = await pool.query('SELECT user_id FROM users WHERE email = ?', [
    process.env.ADMIN_EMAIL,
  ]);
  if (existing.length === 0) {
    const [[adminRole]] = await pool.query(
      "SELECT role_id FROM roles WHERE role_name = 'Admin'"
    );
    const hash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
    await pool.query(
      'INSERT INTO users (full_name, username, email, password, role_id) VALUES (?,?,?,?,?)',
      [
        process.env.ADMIN_NAME,
        process.env.ADMIN_USERNAME,
        process.env.ADMIN_EMAIL,
        hash,
        adminRole.role_id,
      ]
    );
    console.log('Default admin created:', process.env.ADMIN_EMAIL);
  }

  console.log(`Database "${DB_NAME}" and all tables are ready`);
}

module.exports = { pool, initDB };