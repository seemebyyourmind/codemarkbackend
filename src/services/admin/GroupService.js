const db = require("../../config/connectDb");

// Lấy danh sách group với thông tin chi tiết
const getGroups = (page = 1) => {
  return new Promise((resolve, reject) => {
    const limit = 15;
    const offset = Math.max((page - 1) * limit, 0);

    const query = `
      SELECT 
        g.group_id, 
        g.name, 
        g.description,
        COUNT(DISTINCT ug.user_id) AS total_users,
        COUNT(DISTINCT pg.problem_id) AS total_problems,
        COUNT(DISTINCT s.submit_id) AS total_submits
      FROM groups g
      LEFT JOIN user_group ug ON g.group_id = ug.group_id
      LEFT JOIN problem_group pg ON g.group_id = pg.group_id
      LEFT JOIN problems p ON pg.problem_id = p.problem_id
      LEFT JOIN submit s ON p.problem_id = s.problem_id AND ug.user_id = s.user_id
      GROUP BY g.group_id
      LIMIT ? OFFSET ?
    `;
    
    db.query(query, [limit, offset], (err, results) => {
      if (err) {
        console.error("Lỗi khi lấy danh sách nhóm:", err);
        reject({ error: "Không thể lấy danh sách nhóm" });
      } else {
        db.query("SELECT COUNT(*) as total FROM groups", (countErr, countResults) => {
          if (countErr) {
            console.error("Lỗi khi đếm tổng số nhóm:", countErr);
            reject({ error: "Không thể đếm tổng số nhóm" });
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
const getUsersInGroup = (groupId, page = 1, limit = 15) => {
  return new Promise((resolve, reject) => {
    const offset = Math.max((page - 1) * limit, 0);

    const query = `
      SELECT u.user_id, u.username, u.phone, u.email, u.date, u.role_id
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
const getProblemsInGroup = (groupId, page = 1, limit = 15) => {
  return new Promise((resolve, reject) => {
    const offset = Math.max((page - 1) * limit, 0);

    const query = `
      SELECT p.problem_id, p.title, p.difficulty, DATE_FORMAT(p.created, '%d-%m-%Y') as created
      FROM problem_group pg 
      LEFT JOIN problems p ON pg.problem_id = p.problem_id 
      WHERE pg.group_id = ?
      LIMIT ? OFFSET ?
    `;
    db.query(query, [groupId, limit, offset], (err, results) => {
      if (err) {
        reject("Không thể lấy danh sách bài toán trong nhóm");
      } else {
        db.query(
          "SELECT COUNT(*) as total FROM problem_group WHERE group_id = ?",
          [groupId],
          (countErr, countResults) => {
            if (countErr) {
              reject("Không thể đếm tổng số bài toán trong nhóm");
            } else {
              const totalProblems = countResults[0].total;
              const totalPages = Math.ceil(totalProblems / limit);
              resolve({
                problems: results,
                currentPage: page,
                totalPages: totalPages,
                totalProblems: totalProblems
              });
            }
          }
        );
      }
    });
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
          reject("Không thể tạo nhóm mới");
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
          reject("Không thể cập nhật thông tin nhóm");
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
          reject("Không thể xóa nhóm");
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
          reject("Không thể thêm người dùng vào nhóm");
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
          reject("Không thể xóa người dùng khỏi nhóm");
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
          reject("Không thể thêm bài toán vào nhóm");
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
          reject("Không thể xóa bài toán khỏi nhóm");
        } else {
          resolve(results);
        }
      }
    );
  });
};
// Lấy thông tin chi tiết của một nhóm
const getGroupInfo = (groupId) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT group_id, name, description
      FROM groups
      WHERE group_id = ?
    `;
    
    db.query(query, [groupId], (err, results) => {
      if (err) {
        console.error("Lỗi khi lấy thông tin nhóm:", err);
        reject("Không thể lấy thông tin nhóm");
      } else {
        if (results.length === 0) {
          reject("Không tìm thấy nhóm với ID đã cho");
        } else {
          resolve(results[0]);
        }
      }
    });
  });
};

// Lấy danh sách người dùng và kiểm tra xem họ có trong nhóm hay không
const getUsersWithGroupStatus = (groupId, page = 1, limit = 10, searchKeyword = '') => {
  return new Promise((resolve, reject) => {
    const offset = Math.max((page - 1) * limit, 0);

    const query = `
      SELECT 
        u.user_id, 
        u.username, 
        u.phone, 
        u.email,
        CASE WHEN ug.group_id IS NOT NULL THEN TRUE ELSE FALSE END AS InGroup
      FROM user u
      LEFT JOIN user_group ug ON u.user_id = ug.user_id AND ug.group_id = ?
      WHERE u.user_id LIKE ? OR u.username LIKE ? OR u.phone LIKE ? OR u.email LIKE ?
      LIMIT ? OFFSET ?
    `;
    
    const searchPattern = `%${searchKeyword}%`;
    db.query(query, [groupId, searchPattern, searchPattern, searchPattern, searchPattern, limit, offset], (err, results) => {
      if (err) {
        console.error("Lỗi khi lấy danh sách người dùng:", err);
        reject("Không thể lấy danh sách người dùng");
      } else {
        const countQuery = "SELECT COUNT(*) as total FROM user WHERE user_id LIKE ? OR username LIKE ? OR phone LIKE ? OR email LIKE ?";
        db.query(countQuery, [searchPattern, searchPattern, searchPattern, searchPattern], (countErr, countResults) => {
          if (countErr) {
            console.error("Lỗi khi đếm tổng số người dùng:", countErr);
            reject("Không thể đếm tổng số người dùng");
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
        });
      }
    });
  });
};

// Lấy danh sách bài toán và kiểm tra xem chúng có trong nhóm hay không
const getProblemsWithGroupStatus = (groupId, page = 1, limit = 10, searchKeyword = '') => {
  return new Promise((resolve, reject) => {
    const offset = Math.max((page - 1) * limit, 0);

    const query = `
      SELECT 
        p.problem_id, 
        p.title, 
        p.difficulty,
        CASE WHEN pg.group_id IS NOT NULL THEN TRUE ELSE FALSE END AS InGroup
      FROM problems p
      LEFT JOIN problem_group pg ON p.problem_id = pg.problem_id AND pg.group_id = ?
      WHERE p.problem_id LIKE ? OR p.title LIKE ?
      LIMIT ? OFFSET ?
    `;
    
    const searchPattern = `%${searchKeyword}%`;
    db.query(query, [groupId, searchPattern, searchPattern, limit, offset], (err, results) => {
      if (err) {
        console.error("Lỗi khi lấy danh sách bài toán:", err);
        reject("Không thể lấy danh sách bài toán");
      } else {
        const countQuery = "SELECT COUNT(*) as total FROM problems WHERE problem_id LIKE ? OR title LIKE ?";
        db.query(countQuery, [searchPattern, searchPattern], (countErr, countResults) => {
          if (countErr) {
            console.error("Lỗi khi đếm tổng số bài toán:", countErr);
            reject("Không thể đếm tổng số bài toán");
          } else {
            const totalProblems = countResults[0].total;
            const totalPages = Math.ceil(totalProblems / limit);
            resolve({
              problems: results,
              currentPage: page,
              totalPages: totalPages,
              totalProblems: totalProblems
            });
          }
        });
      }
    });
  });
};


module.exports = {
  getGroupInfo,getProblemsWithGroupStatus,getUsersWithGroupStatus,
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