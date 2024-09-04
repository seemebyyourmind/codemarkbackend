const db = require("../../config/connectDb");

// Lấy danh sách group
const getGroups = (page = 1, limit = 10) => {
  return new Promise((resolve, reject) => {
    const offset = (page - 1) * limit;
    const query = "SELECT * FROM groups LIMIT ? OFFSET ?";
    db.query(query, [limit, offset], (err, results) => {
      if (err) {
        reject("Không thể lấy danh sách nhóm");
      } else {
        db.query("SELECT COUNT(*) as total FROM groups", (countErr, countResults) => {
          if (countErr) {
            reject("Không thể đếm tổng số nhóm");
          } else {
            const totalGroups = countResults[0].total;
            const totalPages = Math.ceil(totalGroups / limit);
            resolve({
              groups: results,
              currentPage: page,
              totalPages: totalPages,
              totalGroups: totalGroups
            });
          }
        });
      }
    });
  });
};

// Lấy thông tin user trong group
const getUsersInGroup = (groupId, page = 1, limit = 10) => {
  return new Promise((resolve, reject) => {
    const offset = (page - 1) * limit;
    const query = `
      SELECT u.user_id, u.username 
      FROM user_group ug 
      LEFT JOIN user u ON ug.user_id = u.user_id 
      WHERE ug.group_id = ?
      LIMIT ? OFFSET ?
    `;
    db.query(query, [groupId, limit, offset], (err, results) => {
      if (err) {
        reject("Không thể lấy danh sách người dùng trong nhóm");
      } else {
        db.query(
          "SELECT COUNT(*) as total FROM user_group WHERE group_id = ?",
          [groupId],
          (countErr, countResults) => {
            if (countErr) {
              reject("Không thể đếm tổng số người dùng trong nhóm");
            } else {
              const totalUsers = countResults[0].total;
              const totalPages = Math.ceil(totalUsers / limit);
              resolve({
                users: results,
                currentPage: page,
                totalPages: totalPages,
                totalUsers: totalUsers
              });
            }
          }
        );
      }
    });
  });
};

// Lấy danh sách problem trong group
const getProblemsInGroup = (groupId) => {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT p.problem_id, p.title 
       FROM problem_group pg 
       LEFT JOIN problems p ON pg.problem_id = p.problem_id 
       WHERE pg.group_id = ?`,
      [groupId],
      (err, results) => {
        if (err) {
          reject("Failed to retrieve problems in group");
        } else {
          resolve(results);
        }
      }
    );
  });
};

// Thêm group
const createGroup = (name, description) => {
  return new Promise((resolve, reject) => {
    db.query(
      `INSERT INTO groups (name, description) VALUES (?, ?)`,
      [name, description],
      (err, results) => {
        if (err) {
          reject("Failed to create group");
        } else {
          resolve(results.insertId);
        }
      }
    );
  });
};

// Sửa group
const updateGroup = (groupId, name, description) => {
  return new Promise((resolve, reject) => {
    db.query(
      `UPDATE groups SET name = ?, description = ? WHERE group_id = ?`,
      [name, description, groupId],
      (err, results) => {
        if (err) {
          reject("Failed to update group");
        } else {
          resolve(results);
        }
      }
    );
  });
};

// Xóa group
const deleteGroup = (groupId) => {
  return new Promise((resolve, reject) => {
    db.query(
      `DELETE FROM groups WHERE group_id = ?`,
      [groupId],
      (err, results) => {
        if (err) {
          reject("Failed to delete group");
        } else {
          resolve(results);
        }
      }
    );
  });
};

// Thêm user vào group
const addUserToGroup = (userId, groupId) => {
  return new Promise((resolve, reject) => {
    db.query(
      `INSERT INTO user_group (user_id, group_id) VALUES (?, ?)`,
      [userId, groupId],
      (err, results) => {
        if (err) {
          reject("Failed to add user to group");
        } else {
          resolve(results);
        }
      }
    );
  });
};

// Xóa user khỏi group
const removeUserFromGroup = (userId, groupId) => {
  return new Promise((resolve, reject) => {
    db.query(
      `DELETE FROM user_group WHERE user_id = ? AND group_id = ?`,
      [userId, groupId],
      (err, results) => {
        if (err) {
          reject("Failed to remove user from group");
        } else {
          resolve(results);
        }
      }
    );
  });
};

// Thêm problem vào group
const addProblemToGroup = (problemId, groupId) => {
  return new Promise((resolve, reject) => {
    db.query(
      `INSERT INTO problem_group (problem_id, group_id) VALUES (?, ?)`,
      [problemId, groupId],
      (err, results) => {
        if (err) {
          reject("Failed to add problem to group");
        } else {
          resolve(results);
        }
      }
    );
  });
};

// Xóa problem khỏi group
const removeProblemFromGroup = (problemId, groupId) => {
  return new Promise((resolve, reject) => {
    db.query(
      `DELETE FROM problem_group WHERE problem_id = ? AND group_id = ?`,
      [problemId, groupId],
      (err, results) => {
        if (err) {
          reject("Failed to remove problem from group");
        } else {
          resolve(results);
        }
      }
    );
  });
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