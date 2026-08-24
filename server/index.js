const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { initializeDatabase } = require('./config/database');

const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/api/test', (req, res) => {
    res.send({ message: '✅ Server is running!' });
});

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

const startServer = async () => {
    console.log('🔄 Connecting to MAMP and creating tables...');
    await initializeDatabase();

    app.listen(PORT, () => {
        console.log(`🚀 Server is running at: http://localhost:${PORT}`);
        console.log(`📦 Database name: ${process.env.DB_NAME}`);
        console.log(`🔐 Auth: /api/auth/register and /api/auth/login`);
        console.log(`📝 Posts: /api/posts (GET, POST, PUT, DELETE)`);
        console.log(`🤖 AI: /api/posts/:id/summarize and /api/posts/:id/tags`);
        console.log(`🧪 Fake AI: /api/posts/:id/fake-summarize (for testing)`);
    });
};

startServer();