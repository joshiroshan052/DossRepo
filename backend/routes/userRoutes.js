const router = require("express").Router();
const userController = require("../controllers/userController");
const { authGuard } = require("../middleware/authGuard");

router.post("/register", userController.createUser);
router.post("/login", userController.loginUser);
router.get("/verify/:id", userController.verifyMail);

router.post("/forgot/password", userController.forgotPassword);
router.put("/password/reset/:token", userController.resetPassword);

router.post("/search", userController.searchUserByPhoneNo);
router.get("/follow/:id", authGuard, userController.followUser);

router.get("/followedUsers/:userId", authGuard, userController.getFollowedUsers);
router.get("/followingUsers/:userId", authGuard, userController.getFollowingUsers);

router.put("/update/:id", userController.updateUserProfile); 

module.exports = router;
