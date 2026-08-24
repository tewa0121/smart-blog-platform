const express = require('express');
const authenticate = require('../middleware/auth');
const {
    createPost,
    getAllPosts,
    getPostById,
    updatePost,
    deletePost,
    getMyPosts,
    generateSummaryForPost,
    generateTagsForPost,
    fakeSummary
} = require('../controllers/postController');

const router = express.Router();

// Public Routes
router.get('/', getAllPosts);
router.get('/:id', getPostById);

// Protected Routes
router.post('/', authenticate, createPost);
router.get('/me/posts', authenticate, getMyPosts);
router.put('/:id', authenticate, updatePost);
router.delete('/:id', authenticate, deletePost);

// AI Routes
router.post('/:id/summarize', authenticate, generateSummaryForPost);
router.post('/:id/tags', authenticate, generateTagsForPost);

// TEST Route - Bypasses AI
router.post('/:id/fake-summarize', authenticate, fakeSummary);

module.exports = router;