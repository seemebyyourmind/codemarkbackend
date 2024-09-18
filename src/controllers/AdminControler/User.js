// const ProductService = require("../services/ProductService");
const UserService=require("../../services/admin/UserService")
const getUserByRole = async (req, res) => {
  try {
   
    const page = parseInt(req.query.page, 10) || 1;
    const role = req.query.role ||'all';
    const search = req.query.search ||'';

  
    const users = await UserService.getUsersByRole(page,role,search);


    //Tạo tài khoản
    return res.status(200).json({users});
  } catch (e) {
    
    return res.status(404).json({});
    }};
  
//getUserByGroup

const getUserByGroup = async (req, res) => {
  try {
   
    const users = await UserService.getUsersByGroup(req.query.page,req.query.group);
    const numberUser = await UserService.getNumberUsersByRole(req.query.group)

    //Tạo tài khoản
    return res.status(200).json({users,numberUser});
  } catch (e) {
    console.log(e);
    return res.status(404).json({});
  }
};
const getGroup = async (req, res) => {
  try {
   
    const groups = await UserService.getAllGroup();
   

    //Tạo tài khoản
    return res.status(200).json({groups});
  } catch (e) {
    
    return res.status(404).json({});
  }
};
const getRole= async (req, res) => {
  try {
   
    const roles = await UserService.getAllRole();


    //Tạo tài khoản
    return res.status(200).json({roles});
  } catch (e) {
   
    return res.status(404).json({});
  }
};
const searchUser= async (req, res) => {
  try {
   
    const roles = await UserService.searchUser();


    //Tạo tài khoản
    return res.status(200).json({roles});
  } catch (e) {
   
    return res.status(404).json({});
  }
};

const getUsersInfo=async (req,res)=>{
  try {
   
    const users = await UserService.getNumberUser();
    const groups= await UserService.getNumberGroup();
  


    //Tạo tài khoản
    return res.status(200).json({users,groups});
  } catch (e) {
    return res.status(404).json({});
  }
};

//thoong tin user
const getUserInfo=async(req,res)=>{
  try {
   const user = await UserService.getUserInfo(req.query.id);

   
    return res.status(200).json({user});
  } catch (e) {
    return res.status(404).json({});
  }

}
const getUserGroup=async(req,res)=>{
  try {
   
    const groups = await UserService.getUserGroup(req.query.id);

    //Tạo tài khoản
    return res.status(200).json({groups});
  } catch (e) {
    return res.status(404).json({});
  }

}
const getUserSubmit=async(req,res)=>{
  try {
   
    const user = await UserService.getUserSubmit(req.query.id);

    //Tạo tài khoản
    return res.status(200).json({user});
  } catch (e) {
    return res.status(404).json({});
  }

}
const deleteUser = async (req, res) => {
  try {
    const userId = req.query.id;
    const result = await UserService.deleteUser(userId);
    return res.status(200).json({ message: result });
  } catch (e) {
    return res.status(400).json({ error: e });
  }
};
const setUserPassword = async (req, res) => {
  try {
    const userId = req.body.user_id;
    const newPassword = req.body.new_password;
    const result = await UserService.setUserPassword(userId, newPassword);
    return res.status(200).json({ message: result });
  } catch (e) {
    return res.status(400).json({ error: e });
  }
};
const deleteUserFromGroup = async (req, res) => {
  try {
    const userId = req.body.user_id;
    const groupId = req.body.group_id;
    const result = await UserService.deleteUserFromGroup(userId, groupId);
    return res.status(200).json({ message: result });
  } catch (e) {
    return res.status(400).json({ error: e });
  }
};
const getUserSubmits = async (req, res) => {
  try {
    const userId = req.query.id;
    const page = parseInt(req.query.page) || 1;
    const submits = await UserService.getUserSubmits(userId, page);
    return res.status(200).json({ submits });
  } catch (e) {
    return res.status(400).json({ error: e });
  }
};

const updateRole = async (req, res) => {
  try {
    const userId = req.body.user_id;
    const roleId = req.body.role_id;
    const result = await UserService.updateRole(userId, roleId);
    return res.status(200).json({ message: result });
  } catch (e) {
    return res.status(400).json({ error: e });
  }
};


module.exports = {updateRole,getUserSubmits,deleteUserFromGroup,setUserPassword,deleteUser,
 getUserByGroup,getUserByRole,getGroup,getRole,searchUser,getUsersInfo,getUserInfo,getUserGroup,getUserSubmit
};
