const GroupService = require('../../services/user/GroupService');

const getUserGroups = async (req, res) => {
  try {
    const userId = req.query.id; // Lấy userId từ query parameter
    const groups = await GroupService.getUserGroups(userId);
    return res.status(200).json({ groups });
  } catch (error) {
    console.error('Lỗi khi lấy thông tin nhóm của người dùng:', error);
    return res.status(500).json({ message: 'Đã xảy ra lỗi khi lấy thông tin nhóm' });
  }
};

module.exports = {
  getUserGroups
};
