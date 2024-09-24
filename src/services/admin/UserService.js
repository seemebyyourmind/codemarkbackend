const db = require("../../config/connectDb");
const bcrypt = require('bcrypt');

const getNumberUsersByRole = (role) => {
  return new Promise((resolve, reject) => {
   let query='SELECT COUNT(*) AS total FROM  user where 1=1'
   let queryParams = [];
   if (role !== 'all') {
     query += ` AND user.role_id = ?`;
     queryParams.push(role);
   } 
    db.query(query, queryParams, (err, results) => {
      if (err) {
        reject("fail get resource");
      } else {
        resolve(results);
      }
    });
  });
};
const getNumberUserByGroup=(group)=>{
  return new Promise((resolve, reject) => {
   
    db.query("SELECT COUNT(*) AS total FROM  user u JOIN groups g ON u.group_id = g.group_id WHERE g.name = ?; ", [group], (err, results) => {
      if (err) {
        reject("fail get resource");
      } else {
        resolve(results);
      }
    });
  });
}

const getUsersByGroup = (page,group) => {
  return new Promise((resolve, reject) => {
    const limit = 15;
    const offset = Math.max((page - 1) * limit, 0);

    db.query("SELECT u.user_id,u.username,u.email, u.phone,r.name AS role_name,g.name AS group_name FROM user u JOIN roles r ON u.role_id = r.role_id JOIN groups g ON u.group_id = g.group_id WHERE  g.name=? LIMIT ? OFFSET ? ;", [group,limit, offset], (err, results) => {
      if (err) {
        reject("fail get resource");
      } else {
        resolve(results);
      }
    });
  });
};

const getUsersByRole = (page, role, search) => {
  return new Promise((resolve, reject) => {
    const limit = 15;
    const offset = Math.max((page - 1) * limit, 0);


    let query = `
      SELECT 
        u.user_id, 
        u.username, 
        u.email, 
        u.phone, 
        u.role_id,
        r.name AS role_name,
        GROUP_CONCAT(g.name SEPARATOR ', ') AS groups
      FROM 
        user u
      JOIN 
        roles r ON u.role_id = r.role_id
      LEFT JOIN 
        user_group ug ON u.user_id = ug.user_id
      LEFT JOIN 
        groups g ON ug.group_id = g.group_id
      WHERE 
        1 = 1
    `;

    let countQuery = `
      SELECT COUNT(DISTINCT u.user_id) AS total_count
      FROM user u
      JOIN roles r ON u.role_id = r.role_id
      LEFT JOIN user_group ug ON u.user_id = ug.user_id
      LEFT JOIN groups g ON ug.group_id = g.group_id
      WHERE 1 = 1
    `;

    let queryParams = [];
    if (role && role !== 'all') {
      query += ` AND u.role_id = ?`;
      countQuery += ` AND u.role_id = ?`;
      queryParams.push(role);
    }

    if (search && search.trim() !== "") {
      query += ` AND (u.username LIKE ? OR u.phone LIKE ? OR u.email LIKE ?)`;
      countQuery += ` AND (u.username LIKE ? OR u.phone LIKE ? OR u.email LIKE ?)`;
      queryParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    query += ` GROUP BY u.user_id
      LIMIT ? OFFSET ?`;
    queryParams.push(limit, offset);

    db.query(query, queryParams, (err, results) => {
      if (err) {
        console.error("Lỗi khi truy vấn cơ sở dữ liệu:", err);
        reject("Không thể lấy danh sách người dùng");
      } else {
        db.query(countQuery, queryParams.slice(0, -2), (countErr, countResults) => {
          if (countErr) {
            console.error("Lỗi khi đếm tổng số người dùng:", countErr);
            reject("Không thể đếm tổng số người dùng");
          } else {
            const totalUsers = countResults[0].total_count;
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

const getUsersByRole2 = (page, role, search) => {
  return new Promise((resolve, reject) => {
    const limit = 15;
    const offset = Math.max((page - 1) * limit, 0);


    let query = `
      SELECT 
        SQL_CALC_FOUND_ROWS
        u.user_id, 
        u.username, 
        u.email, 
        u.phone, 
        u.role_id,
        r.name AS role_name,
        GROUP_CONCAT(g.name SEPARATOR ', ') AS groups
      FROM 
        user u
      JOIN 
        roles r ON u.role_id = r.role_id
      LEFT JOIN 
        user_group ug ON u.user_id = ug.user_id
      LEFT JOIN 
        groups g ON ug.group_id = g.group_id
      WHERE 
        1 = 1
    `;

    let queryParams = [];
    if (role && role !== 'all') {
      query += ` AND u.role_id = ?`;
      queryParams.push(role);
    } 

    if (search && search!=="") {
      query += ` AND (u.username LIKE ? OR u.phone LIKE ? OR u.email LIKE ?)`;
      queryParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    query += ` GROUP BY 
        u.user_id, u.username, u.email, u.phone, r.name
      LIMIT ? OFFSET ?`;
    queryParams.push(limit, offset);

   

    db.query(query, queryParams, (err, results) => {
      if (err) {
        
        reject("Không thể lấy danh sách người dùng");
      } else {
        const countQuery = 'SELECT FOUND_ROWS() AS total_count';
      

        db.query(countQuery, (countErr, countResults) => {
          if (countErr) {
            console.error("Lỗi khi đếm tổng số người dùng:", countErr);
            reject("Không thể đếm tổng số người dùng");
          } else {
            const totalUsers = countResults[0].total_count;
            const totalPages = Math.ceil(totalUsers / limit);
            console.log('resule',page,totalPages,totalUsers);
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


  const getNumberUser=()=>{
    return new Promise((resolve, reject) => {
     
      db.query("SELECT COUNT(*) as users FROM  user; ", (err, results) => {
        if (err) {
          reject("fail get resource");
        } else {
          resolve(results);
        }
      });
    });
  }
  const getNumberGroup=()=>{
    return new Promise((resolve, reject) => {
     
      db.query("SELECT COUNT(*)as groups FROM  groups; ", (err, results) => {
        if (err) {
          reject("fail get resource");
        } else {
          resolve(results);
        }
      });
    });
  }


  //get user by group
  const getAllGroup = () => {
    return new Promise((resolve, reject) => {
     
      db.query("SELECT * FROM groups ", (err, results) => {
        if (err) {
          reject("fail get resource");
        } else {
          resolve(results);
        }
      });
    });
  };
  const getAllRole = () => {
    return new Promise((resolve, reject) => {
     
      db.query("SELECT * FROM roles ", (err, results) => {
        if (err) {
          reject("fail get resource");
        } else {
          resolve(results);
        }
      });
    });
  };

  
  //get user by name 

  const getUserInfo = (id) => {
    return new Promise((resolve, reject) => {
     
      db.query("SELECT * FROM user WHERE user_id=? ",[id], (err, results) => {
        if (err) {
          reject("fail get resource");
        } else {
          resolve(results);
        }
      });
    });
  };
  const getUserGroup = (id) => {
    return new Promise((resolve, reject) => {
     
      db.query("SELECT g.* FROM groups g INNER JOIN user_group ug ON g.group_id = ug.group_id WHERE ug.user_id = ? ",[id] ,(err, results) => {
        if (err) {
          reject("fail get resource");
        } else {
          resolve(results);
        }
      });
    });
  };

  // const getUserSubmit = () => {
  //   return new Promise((resolve, reject) => {
     
  //     db.query("SELECT * FROM roles ", (err, results) => {
  //       if (err) {
  //         reject("fail get resource");
  //       } else {
  //         resolve(results);
  //       }
  //     });
  //   });
  // };
  const deleteUser = (userId) => {
    return new Promise((resolve, reject) => {
      db.query("DELETE FROM user WHERE user_id = ?", [userId], (err, result) => {
        if (err) {
          reject("Xóa người dùng thất bại");
        } else {
          if (result.affectedRows === 0) {
            reject("Không tìm thấy người dùng để xóa");
          } else {
            resolve("Xóa người dùng thành công");
          }
        }
      });
    });
  };
  const setUserPassword = (userId, newPassword) => {
    const bcrypt = require('bcrypt');
    return new Promise((resolve, reject) => {
      // Kiểm tra userId và newPassword
      if (!userId || !newPassword) {
        reject("UserId hoặc mật khẩu mới không hợp lệ");
        return;
      }

      // Mã hóa mật khẩu trước khi lưu vào cơ sở dữ liệu
      const saltRounds = 10;
      console.log("UserId:", userId, "NewPassword:", newPassword);
      
      bcrypt.hash(newPassword.toString(), saltRounds, (err, hashedPassword) => {
        if (err) {
          console.error("Lỗi khi mã hóa mật khẩu:", err);
          reject("Lỗi khi mã hóa mật khẩu");
          return;
        }
        
        // Cập nhật mật khẩu trong cơ sở dữ liệu
        db.query(
          "UPDATE user SET password = ? WHERE user_id = ?",
          [hashedPassword, userId],
          (err, result) => {
            if (err) {
              console.error("Lỗi khi cập nhật mật khẩu:", err);
              reject("Đặt mật khẩu thất bại");
            } else {
              if (result.affectedRows === 0) {
                reject("Không tìm thấy người dùng để cập nhật mật khẩu");
              } else {
                resolve("Đặt mật khẩu thành công");
              }
            }
          }
        );
      });
    });
  };
  const deleteUserFromGroup = (userId, groupId) => {
    return new Promise((resolve, reject) => {
      db.query(
        "DELETE FROM user_group WHERE user_id = ? AND group_id = ?",
        [userId, groupId],
        (err, result) => {
          if (err) {
            reject("Xóa người dùng khỏi nhóm thất bại");
          } else {
            if (result.affectedRows === 0) {
              reject("Không tìm thấy bản ghi để xóa");
            } else {
              resolve("Xóa người dùng khỏi nhóm thành công");
            }
          }
        }
      );
    });
  };
  const getUserSubmits = (userId, page) => {
    return new Promise((resolve, reject) => {
      const limit = 15;
      const offset = Math.max((page - 1) * limit, 0);

      
      const query = `
        SELECT user_id, problem_id, source, status, numberTestcasePass, numberTestcase, 
               points, error, language_id, timeExecute, memoryUsage, submit_id,submit_date
        FROM submit
        WHERE user_id = ?
        ORDER BY problem_id
        LIMIT ? OFFSET ?
      `;
      
      const countQuery = `
        SELECT COUNT(*) AS total
        FROM submit
        WHERE user_id = ?
      `;
      
      db.query(query, [userId, limit, offset], (err, results) => {
        if (err) {
          reject("Lấy danh sách submit thất bại");
        } else {
          db.query(countQuery, [userId], (countErr, countResults) => {
            if (countErr) {
              reject("Lấy tổng số bản ghi thất bại");
            } else {
              resolve({
                submits: results,
                total: countResults[0].total
              });
            }
          });
        }
      });
    });
  };
  const updateRole = (userId, roleId) => {
    return new Promise((resolve, reject) => {
      const query = "UPDATE user SET role_id = ? WHERE user_id = ?";
      db.query(query, [roleId, userId], (err, result) => {
        if (err) {
          console.error("Lỗi khi cập nhật vai trò:", err);
          reject("Cập nhật vai trò thất bại");
        } else {
          if (result.affectedRows === 0) {
            reject("Không tìm thấy người dùng để cập nhật vai trò");
          } else {
            resolve("Cập nhật vai trò thành công");
          }
        }
      });
    });
  };




  module.exports ={updateRole,getUserSubmits,deleteUserFromGroup,setUserPassword,deleteUser,getUserInfo,getUserGroup,getUsersByGroup,getUsersByRole,getAllGroup,getAllRole,getNumberUserByGroup,getNumberUsersByRole,getNumberUser,getNumberGroup}