const router = require('express').Router();
const c = require('../controllers/categoryController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/', c.getCategories);
router.post('/', protect, authorize('Admin', 'Editor'), c.createCategory);
router.put('/:id', protect, authorize('Admin', 'Editor'), c.updateCategory);
router.delete('/:id', protect, authorize('Admin'), c.deleteCategory);

module.exports = router;