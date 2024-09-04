const GroupService = require("../../services/admin/GroupService");

// Lấy danh sách group
const getGroups = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const result = await GroupService.getGroups(page, limit);
      return res.status(200).json({
        groups: result.groups,
        currentPage: result.currentPage,
        totalPages: result.totalPages,
        totalGroups: result.totalGroups
      });
    } catch (e) {
      return res.status(404).json({ error: e.message });
    }
  };

// Lấy thông tin user trong group
const getUsersInGroup = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
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
    const problems = await GroupService.getProblemsInGroup(req.query.group_id);
    return res.status(200).json({ problems });
  } catch (e) {
    return res.status(404).json({ e });
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
    const result = await GroupService.addUserToGroup(req.body.userId, req.body.group_id);
    return res.status(200).json({ result });
  } catch (e) {
    return res.status(404).json({ e });
  }
};

// Xóa user khỏi group
const removeUserFromGroup = async (req, res) => {
  try {
    const result = await GroupService.removeUserFromGroup(req.body.userId, req.body.group_id);
    return res.status(200).json({ result });
  } catch (e) {
    return res.status(404).json({ e });
  }
};

// Thêm problem vào group
const addProblemToGroup = async (req, res) => {
  try {
    const result = await GroupService.addProblemToGroup(req.body.problemId, req.body.group_id);
    return res.status(200).json({ result });
  } catch (e) {
    return res.status(404).json({ e });
  }
};

// Xóa problem khỏi group
const removeProblemFromGroup = async (req, res) => {
  try {
    const result = await GroupService.removeProblemFromGroup(req.body.problemId, req.body.group_id);
    return res.status(200).json({ result });
  } catch (e) {
    return res.status(404).json({ e });
  }
};

module.exports = {
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