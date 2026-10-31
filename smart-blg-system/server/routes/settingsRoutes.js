const router = require('express').Router();
const { getSettings, updateSettings } = require('../controllers/settingsController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/', getSettings);
router.put('/', protect, authorize('Admin'), updateSettings);

module.exports = router;