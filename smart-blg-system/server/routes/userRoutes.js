const router = require('express').Router();
const c = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.put('/profile', protect, c.updateProfile);
router.put('/password', protect, c.changePassword);

router.get('/', protect, authorize('Admin'), c.getUsers);
router.post('/', protect, authorize('Admin'), c.createUser);
router.put('/:id/role', protect, authorize('Admin'), c.updateRole);
router.put('/:id/block', protect, authorize('Admin'), c.toggleBlock);
router.delete('/:id', protect, authorize('Admin'), c.deleteUser);

module.exports = router;