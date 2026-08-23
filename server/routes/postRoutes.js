// server/routes/postRoutes.js
// ⭐ Defines the API endpoints for blog posts ⭐

const express = require('express');
const authenticate = require('../middleware/auth');
const {
    createPost,
    getAllPosts,
    getPostById,
    updatePost,
    deletePost,
    getMyPosts
} = require('../controllers/postController');

const router = express.Router();

// --- Public Routes (No token required) ---
router.get('/', getAllPosts);                // GET /api/posts
router.get('/:id', getPostById);             // GET /api/posts/5

// --- Protected Routes (Token required) ---
router.post('/', authenticate, createPost);  // POST /api/posts
router.get('/me/posts', authenticate, getMyPosts); // GET /api/posts/me/posts
router.put('/:id', authenticate, updatePost); // PUT /api/posts/5
router.delete('/:id', authenticate, deletePost); // DELETE /api/posts/5

module.exports = router;