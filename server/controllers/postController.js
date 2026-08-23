// server/controllers/postController.js
// ⭐ Handles the logic for blog posts ⭐

const Post = require('../models/Post');

// CREATE a new post (Protected)
const createPost = async (req, res) => {
    try {
        const { title, content, summary, tags } = req.body;
        const author_id = req.userId; // From the JWT middleware

        if (!title || !content) {
            return res.status(400).json({ error: 'Title and content are required' });
        }

        const postId = await Post.createPost(title, content, author_id, summary, tags);
        
        // Fetch the newly created post to return it
        const newPost = await Post.getPostById(postId);
        
        res.status(201).json({ 
            message: 'Post created successfully!', 
            post: newPost 
        });

    } catch (error) {
        console.error('Create post error:', error);
        res.status(500).json({ error: 'Server error while creating post' });
    }
};

// GET all posts (Public)
const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.getAllPosts();
        res.json({ posts });
    } catch (error) {
        console.error('Get all posts error:', error);
        res.status(500).json({ error: 'Server error while fetching posts' });
    }
};

// GET a single post by ID (Public)
const getPostById = async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await Post.getPostById(postId);

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        res.json({ post });
    } catch (error) {
        console.error('Get post by id error:', error);
        res.status(500).json({ error: 'Server error while fetching the post' });
    }
};

// UPDATE a post (Protected - only the author)
const updatePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const { title, content, summary, tags } = req.body;
        const userId = req.userId;

        // First, check if the post exists and belongs to the user
        const existingPost = await Post.getPostById(postId);
        if (!existingPost) {
            return res.status(404).json({ error: 'Post not found' });
        }
        if (existingPost.author_id !== userId) {
            return res.status(403).json({ error: 'You are not the author of this post' });
        }

        const updated = await Post.updatePost(postId, title, content, summary, tags);
        if (updated === 0) {
            return res.status(400).json({ error: 'No changes made to the post' });
        }

        const updatedPost = await Post.getPostById(postId);
        res.json({ message: 'Post updated successfully!', post: updatedPost });

    } catch (error) {
        console.error('Update post error:', error);
        res.status(500).json({ error: 'Server error while updating post' });
    }
};

// DELETE a post (Protected - only the author)
const deletePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.userId;

        // First, check if the post exists and belongs to the user
        const existingPost = await Post.getPostById(postId);
        if (!existingPost) {
            return res.status(404).json({ error: 'Post not found' });
        }
        if (existingPost.author_id !== userId) {
            return res.status(403).json({ error: 'You are not the author of this post' });
        }

        const deleted = await Post.deletePost(postId);
        if (deleted === 0) {
            return res.status(400).json({ error: 'Failed to delete the post' });
        }

        res.json({ message: 'Post deleted successfully!' });

    } catch (error) {
        console.error('Delete post error:', error);
        res.status(500).json({ error: 'Server error while deleting post' });
    }
};

// GET posts by the logged-in user (for Dashboard) - Protected
const getMyPosts = async (req, res) => {
    try {
        const userId = req.userId;
        const posts = await Post.getPostsByAuthor(userId);
        res.json({ posts });
    } catch (error) {
        console.error('Get my posts error:', error);
        res.status(500).json({ error: 'Server error while fetching your posts' });
    }
};

module.exports = {
    createPost,
    getAllPosts,
    getPostById,
    updatePost,
    deletePost,
    getMyPosts
};