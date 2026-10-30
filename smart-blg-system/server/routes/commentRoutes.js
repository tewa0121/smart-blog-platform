const router = require('express').Router();
const c = require('../controllers/commentController');
const { protect } = require('../middleware/authMiddleware');

router.get('/mine', protect, c.getMyComments);
router.get('/post/:postId', c.getComments);
router.post('/post/:postId', protect, c.addComment);
router.delete('/:id', protect, c.deleteComment);

module.exports = router;