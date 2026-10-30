const router = require('express').Router();
const c = require('../controllers/postController');
const { protect, optionalAuth } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const upload = require('../middleware/uploadMiddleware');

const writers = ['Admin', 'Editor', 'Author', 'Contributor'];

router.get('/', c.getPublished);
router.get('/mine', protect, authorize(...writers), c.getMyPosts);
router.get('/manage/all', protect, authorize('Admin', 'Editor'), c.getAllForManagement);
router.get('/:id', optionalAuth, c.getPost);

router.post('/', protect, authorize(...writers), upload.single('image'), c.createPost);
router.put('/:id', protect, authorize(...writers), upload.single('image'), c.updatePost);
router.patch('/:id/review', protect, authorize('Admin', 'Editor'), c.reviewPost);
router.delete('/:id', protect, authorize(...writers), c.deletePost);

module.exports = router;