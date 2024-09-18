const express = require("express");
const router = express.Router();
const User = require("../controllers/AdminControler/User");
const Problem = require("../controllers/AdminControler/Problem");

const Submit = require("../controllers/AdminControler/Submit");
const Group = require("../controllers/AdminControler/Group");


router.get("/user/getuserbyrole", User.getUserByRole);// role, page,search (query)-done 
router.get("/user/group",User.getGroup);
router.get("/user/role",User.getRole);
router.get("/user/usersinfo",User.getUsersInfo);
router.get('/user/userinfo',User.getUserInfo);
router.get('/user/usergroup',User.getUserGroup);

router.delete('/user/delete',User.deleteUser)//xóa user theo id query(id) -done
router.put('/user/setpassword', User.setUserPassword); // đặt mật khẩu user_id, new_password trong body -done
router.delete('/user/deletefromgroup', User.deleteUserFromGroup); //  xóa nhóm user user_id, group_id trong body -done
router.get('/user/submits', User.getUserSubmits); // lấy danh sách submit theo page và user_id (query) theo thứ tự problem tăng dần-done
router.put('/user/updaterole', User.updateRole); // cập nhật vai trò của người dùng, user_id và role_id trong body

//tạo user 
//update thông tin cá nhân user===>làm cùng trang user
//xem thông tin submit =>trang submit -submitdetail***



//problemrouter
router.get('/problem/getproblemsearch', Problem.getSearchProblem); //done
router.get("/problem/getprobleminfo",Problem.getProblemInfo); //done
router.post("/problem/createtestCase", Problem.CreateTestCase);// problem_id, input ,output -done
router.put("/problem/updatetestCase", Problem.UpdateTestCase);//  testcase_id , input , output -done
router.delete("/problem/deletetestCase", Problem.DeleteTestCase);// testcase_id -done
//cần testapi
router.delete("/problem/delete", Problem.deleteProblem); // xóa problem id trong query  -done
router.put("/problem/update", Problem.updateProblemInfo); // cập nhật thông tin bài toán, problem_id, title, description, difficulty trong body -done
router.put("/problem/updatedetail", Problem.updateProblemDetail); // cập nhật chi tiết bài toán, problem_id, language_id, source_code, time_ex, memory trong body
router.get("/problem/submits", Problem.getSubmitsByProblemId); // lấy danh sách submit theo problem_id và page (query)
router.post("/problem/create", Problem.CreateProblem); // Tạo bài toán mới, title, description, difficulty trong body

router.get("/problem/languages", Problem.getLanguages); // Lấy danh sách ngôn ngữ lập trình


//xóa submit 
// xem thông tin submit =>trang submitdetail-submitdetail+++++



// Submit routes
router.delete("/submit/delete", Submit.deleteSubmit); // id (body)
router.get("/submit/getbyid", Submit.getSubmitById); // id(query)
router.post("/submit/create", Submit.createSubmit); // user_id, problem_id, source, language_id
router.put("/submit/updateresult", Submit.updateSubmitResult); // submit_id, status, numberTestcasePass, numberTestcase, points, error, timeExecute, memoryUsage
router.get("/submit/getbyuserandproblem", Submit.getSubmitsByUserAndProblem); // user_id, problem_id, page, limit
router.get("/submit/getbyuserid", Submit.getSubmitsByUserId); // id, page,  (query)
router.get("/submit/getbyproblemid", Submit.getSubmitsByProblemId); // id, page, (query)
router.get("/submit/getall", Submit.getSubmitsWithPagination); // page, limit,sort (query)


// Group routes
//test api
router.get("/group/getgroups", Group.getGroups); // page (query)------done
router.get("/group/getusersingroup", Group.getUsersInGroup); // group_id,page (query)------done
router.get("/group/getproblemsingroup", Group.getProblemsInGroup); // group_id  page query-------done  -----dùng cả ở user
router.post("/group/creategroup", Group.createGroup); // name, description (body)----done
router.put("/group/updategroup", Group.updateGroup); // group_id, name, description (body)--------done
router.delete("/group/deletegroup", Group.deleteGroup); // group_id (body)--------done
router.post("/group/addusertogroup", Group.addUserToGroup); // user_id, group_id (body)---------done
router.delete("/group/removeuserfromgroup", Group.removeUserFromGroup); // user_id, group_id--------done
router.post("/group/addproblemtogroup", Group.addProblemToGroup); // problem_id, group_id
router.delete("/group/removeproblemfromgroup", Group.removeProblemFromGroup); // problem_id, group_id
router.get("/group/getgroupinfo", Group.getGroupInfo); // id (query)
router.get("/group/getuserswithgroupstatus", Group.getUsersWithGroupStatus); // id, page, search (query)
router.get("/group/getproblemswithgroupstatus", Group.getProblemsWithGroupStatus); // id, page, search (query)


//thêm router groupdetail
//router listuser
//router listprolem

// router.post("/placeorder", CartController.placeOrder);
module.exports = router;






