// const ProductService = require("../services/ProductService");
const UserService=require("../../services/admin/UserService")
const getUserByRole = async (req, res) => {
  try {
   
    const page = parseInt(req.query.page, 10) || 1;
    const role = req.query.role || 'all';
    const search = req.query.search || '';
  
    

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



module.exports = {
 getUserByGroup,getUserByRole,getGroup,getRole,searchUser,getUsersInfo,getUserInfo,getUserGroup,getUserSubmit
};
