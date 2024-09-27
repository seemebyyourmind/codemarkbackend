const GroupService = require("../../services/admin/GroupService");

// Lấy danh sách group
const getGroups = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    
    const result = await GroupService.getGroups(page);
    return res.status(200).json({
      groups: result.groups,
      currentPage: result.currentPage,
      totalPages: result.totalPages,
      totalGroups: result.totalGroups
    });
  } catch (e) {
    return res.status(404).json({ error: "Không thể lấy danh sách nhóm" });
  }
};

// Lấy thông tin user trong group
const getUsersInGroup = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 15;
    const result = await GroupService.getUsersInGroup(req.query.group_id, page, limit);
    return res.status(200).json({
      users: result.users,
      currentPage: result.currentPage,
      totalPages: result.totalPages,
      totalUsers: result.totalUsers
    });
  } catch (e) {
    return res.status(404).json({ error: e.message });
  }
};

// Lấy danh sách problem trong group
const getProblemsInGroup = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 15;
    const category = parseInt(req.query.category, 10) || 0;
    const result = await GroupService.getProblemsInGroup(req.query.group_id,category, page, limit);
    return res.status(200).json({
      problems: result.problems,
      currentPage: result.currentPage,
      totalPages: result.totalPages,
      totalProblems: result.totalProblems
    });
  } catch (e) {
    return res.status(404).json({ error: e.message });
  }
};

// Thêm group
const createGroup = async (req, res) => {
  try {
    const group_id = await GroupService.createGroup(req.body.name, req.body.description);
    return res.status(200).json({ group_id });
  } catch (e) {
    return res.status(404).json({ e });
  }
};

// Sửa group
const updateGroup = async (req, res) => {
  try {
    const result = await GroupService.updateGroup(req.body.group_id, req.body.name, req.body.description);
    return res.status(200).json({ result });
  } catch (e) {
    return res.status(404).json({ e });
  }
};

// Xóa group
const deleteGroup = async (req, res) => {
  try {
    const result = await GroupService.deleteGroup(req.body.group_id);
    return res.status(200).json({ result });
  } catch (e) {
    return res.status(404).json({ e });
  }
};

// Thêm user vào group
const addUserToGroup = async (req, res) => {
  try {
    const result = await GroupService.addUserToGroup(req.body.user_id, req.body.group_id);
    return res.status(200).json({ result });
  } catch (e) {
    return res.status(404).json({ e });
  }
};

// Xóa user khỏi group
const removeUserFromGroup = async (req, res) => {
  try {
    const result = await GroupService.removeUserFromGroup(req.body.user_id, req.body.group_id);
    return res.status(200).json({ result });
  } catch (e) {
    return res.status(404).json({ e });
  }
};

// Thêm problem vào group
const addProblemToGroup = async (req, res) => {
  try {
    const result = await GroupService.addProblemToGroup(req.body.problem_id, req.body.group_id);
    return res.status(200).json({ result });
  } catch (e) {
    return res.status(404).json({ e });
  }
};

// Xóa problem khỏi group
const removeProblemFromGroup = async (req, res) => {
  try {
    const result = await GroupService.removeProblemFromGroup(req.body.problem_id, req.body.group_id);
    return res.status(200).json({ result });
  } catch (e) {
    return res.status(404).json({ e });
  }
};
// Lấy thông tin chi tiết của một nhóm
const getGroupInfo = async (req, res) => {
  try {
    const groupId = req.query.id;
    const result = await GroupService.getGroupInfo(groupId);
    return res.status(200).json(result);
  } catch (e) {
    return res.status(404).json({ error: e });
  }
};

// Lấy danh sách người dùng và kiểm tra xem họ có trong nhóm hay không
const getUsersWithGroupStatus = async (req, res) => {
  try {
    const { id, page = 1, limit = 10, search = '' } = req.query;
    const result = await GroupService.getUsersWithGroupStatus(id, page, limit, search);
    return res.status(200).json(result);
  } catch (e) {
    return res.status(404).json({ error: e });
  }
};

// Lấy danh sách bài toán và kiểm tra xem chúng có trong nhóm hay không
const getProblemsWithGroupStatus = async (req, res) => {
  try {
    const { id, page = 1, limit = 10, search = '' } = req.query;
    const result = await GroupService.getProblemsWithGroupStatus(id, page, limit, search);
    return res.status(200).json(result);
  } catch (e) {
    return res.status(500).json({ error: 'Đã xảy ra lỗi khi lấy danh sách bài toán: ' + e.message });
  }
};


module.exports = {
  getGroupInfo,getUsersWithGroupStatus,getProblemsWithGroupStatus,
  getGroups,
  getUsersInGroup,
  getProblemsInGroup,
  createGroup,
  updateGroup,
  deleteGroup,
  addUserToGroup,
  removeUserFromGroup,
  addProblemToGroup,
  removeProblemFromGroup,
};