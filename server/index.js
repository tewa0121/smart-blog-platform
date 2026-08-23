// server/index.js
// ⭐ MAIN SERVER FILE - Updated with Authentication + Post Routes ⭐

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { initializeDatabase } = require('./config/database');

// Import routes
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes'); // <-- NEW: Post routes

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// --- Public Test Route ---
app.get('/api/test', (req, res) => {
    res.send({ message: '✅ Server is running!' });
});

// --- Authentication Routes ---
app.use('/api/auth', authRoutes);

// --- Blog Post Routes ---
app.use('/api/posts', postRoutes); // <-- NEW: All post endpoints

// --- Protected Route Example (to test JWT) ---
app.get('/api/protected', require('./middleware/auth'), (req, res) => {
    res.json({ 
        message: 'You have accessed a protected route!',
        userId: req.userId,
        email: req.userEmail
    });
});

// --- Start Server ---
const startServer = async () => {
    console.log('🔄 Connecting to MAMP and creating tables...');
    await initializeDatabase();

    app.listen(PORT, () => {
        console.log(`🚀 Server is running at: http://localhost:${PORT}`);
        console.log(`📦 Database name: ${process.env.DB_NAME}`);
        console.log(`🔐 Auth: /api/auth/register and /api/auth/login`);
        console.log(`📝 Posts: /api/posts (GET, POST, PUT, DELETE)`);
    });
};

startServer();