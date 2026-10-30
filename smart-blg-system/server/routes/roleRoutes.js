const router = require('express').Router();
const { getRoles } = require('../controllers/roleController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/', protect, authorize('Admin'), getRoles);

module.exports = router;