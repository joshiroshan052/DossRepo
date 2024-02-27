const router = require('express').Router();
const adminController=require("../controllers/adminController")
const {authGuardAdmin} = require('../middleware/authGuard');


router.get('/getAllUser', authGuardAdmin,adminController.getAllUsers)
router.post('/adminLogin',authGuardAdmin,adminController.adminLogin)


module.exports=router;