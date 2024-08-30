const express = require("express");
const router = express.Router();
const User = require("../controllers/AdminControler/User");
const Problem = require("../controllers/AdminControler/Problem");


router.get("/user/getuserbyrole", User.getUserByRole);
router.get("/user/getuserbygroup",User.getUserByGroup);
router.get("/user/group",User.getGroup);
router.get("/user/role",User.getRole);
router.get("/user/search",User.searchUser);
router.get("/user/usersinfo",User.getUsersInfo);
router.get('/user/userinfo',User.getUserInfo);
router.get('/user/usergroup',User.getUserGroup);

//deleteuser
//updateuser


//problemrouter
router.get('/problem/getproblemsearch', Problem.getSearchProblem);//done
router.get("/problem/getprobleminfo",Problem.getProblemInfo); //done
// testcaseproblem
router.post("/problem/createtestCase", Problem.CreateTestCase);// problem_id, input ,output -done
router.put("/problem/updatetestCase", Problem.UpdateTestCase);//  testcase_id , input , output -done
router.delete("/problem/deletetestCase", Problem.DeleteTestCase);// testcase_id -done


//updateproblemdetail 
//deleteproblem

//getgroup





// router.post("/placeorder", CartController.placeOrder);
module.exports = router;
