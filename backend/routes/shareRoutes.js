const router = require("express").Router();
const userController = require("../controllers/userController");
const shareController = require('../controllers/shareController');
const { authGuard } = require('../middleware/authGuard');

// Route to share a bluebook with a user
router.post('/shareBluebook/:userId', authGuard, shareController.shareBluebook);

// Route to get shared bluebooks for a user
router.get('/shared/:userId', authGuard, shareController.getSharedBluebooks);

module.exports = router;
