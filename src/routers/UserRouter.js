const express = require("express");
const router = express.Router();
const GroupController = require("../controllers/UserControler/Group");
const AuthController = require("../controllers/UserControler/Auth");

router.post("/register", AuthController.registerUser); //username,phone,email,password(body)
router.post("/login", AuthController.loginUser);//username,password (body)


router.get("/groups", GroupController.getUserGroups); //id query

router.put("/updateinfo", AuthController.updateUserInfo); // userId, phone, email (body)
router.put("/changepassword", AuthController.changePassword); // userId, currentPassword, newPassword (body)


//update userinfo
//change password
//get group user
//get problem user by group and user_id  and search and phân trang 
//getsubmitionuser
//getsubmitionall



module.exports = router;