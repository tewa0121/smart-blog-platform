// // server/middleware/auth.js
// // ⭐ Verifies JWT tokens for protected routes ⭐

// const jwt = require('jsonwebtoken');

// const authenticate = (req, res, next) => {
//     // Get the token from the Authorization header
//     const authHeader = req.headers.authorization;
//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//         return res.status(401).json({ error: 'Access denied. No token provided.' });
//     }

//     const token = authHeader.split(' ')[1];

//     try {
//         // Verify the token
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         req.userId = decoded.userId; // Attach user ID to the request
//         req.userEmail = decoded.email; // Attach email to the request
//         next(); // Continue to the next function
//     } catch (error) {
//         return res.status(403).json({ error: 'Invalid or expired token' });
//     }
// };

// module.exports = authenticate;