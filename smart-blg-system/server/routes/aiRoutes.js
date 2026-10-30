const router = require('express').Router();
const { checkGrammar, suggest } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect, authorize('Admin', 'Editor', 'Author', 'Contributor'));
router.post('/grammar', checkGrammar);
router.post('/suggest', suggest);

module.exports = router;