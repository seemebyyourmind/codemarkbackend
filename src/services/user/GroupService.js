const db = require("../../config/connectDb");

const getUserGroups = (userId) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT g.group_id, g.name, g.description
      FROM user_group ug
      JOIN groups g ON ug.group_id = g.group_id
      WHERE ug.user_id = ?
    `;

    db.query(query, [userId], (error, results) => {
      if (error) {
        console.error('Lỗi khi lấy thông tin nhóm của người dùng:', error);
        reject('Không thể lấy thông tin nhóm của người dùng');
      } else {
        resolve(results);
      }
    });
  });
};


module.exports = {
  getUserGroups
};
