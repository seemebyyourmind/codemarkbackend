const db = require("../../config/connectDb");
const bcrypt = require("bcrypt");

// Hàm tạo tài khoản
const createUser = async (username, phone, email, password) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = "INSERT INTO user (username, phone, email, password, role_id) VALUES (?, ?, ?, ?, 2)";
    const values = [username, phone, email, hashedPassword];

    return new Promise((resolve, reject) => {
      db.query(query, values, (err, results) => {
        if (err) {
          console.error("Lỗi khi đăng ký người dùng:", err);
          reject({ status: "thất bại" });
        } else {
          console.log("Đăng ký người dùng thành công:", results);
          resolve({
            status: "thành công",
            username: username,
            phone: phone,
            email: email
          });
        }
      });
    });
  } catch (error) {
    throw error;
  }
};

// Hàm đăng nhập
const loginUser = async (username, password) => {
  try {
    const query = `
      SELECT u.*, r.name AS role_name
      FROM user u
      JOIN roles r ON u.role_id = r.role_id
      WHERE u.username = ?
    `;
    return new Promise((resolve, reject) => {
      db.query(query, [username], async (err, results) => {
        if (err) {
          reject("Lỗi khi truy vấn cơ sở dữ liệu");
        } else if (results.length === 0) {
          reject("Tên người dùng không tồn tại");
        } else {
          const user = results[0];
          const isPasswordValid = await bcrypt.compare(password, user.password);
          if (isPasswordValid) {
            // Lấy thông tin nhóm của người dùng
            const groupQuery = `
              SELECT g.*
              FROM user_group ug
              JOIN groups g ON ug.group_id = g.group_id
              WHERE ug.user_id = ?
            `;
            db.query(groupQuery, [user.user_id], (groupErr, groupResults) => {
              if (groupErr) {
                reject("Lỗi khi lấy thông tin nhóm");
              } else {
                resolve({
                  status: "success",
                  user: {
                    user_id: user.user_id,
                    username: user.username,
                    phone: user.phone,
                    email: user.email,
                    role_id: user.role_id,
                    role_name: user.role_name,
                    groups: groupResults
                  },
                });
              }
            });
          } else {
            reject("Mật khẩu không đúng");
          }
        }
      });
    });
  } catch (error) {
    throw error;
  }
};

// Hàm kiểm tra sự tồn tại của username
const checkUsernameExists = (username) => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM user WHERE username = ?", [username], (err, results) => {
      if (err) {
        reject("Lỗi khi kiểm tra tên người dùng");
      } else {
        resolve(results.length > 0);
      }
    });
  });
};

// Hàm kiểm tra sự tồn tại của số điện thoại
const checkPhoneExists = (phone) => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM user WHERE phone = ?", [phone], (err, results) => {
      if (err) {
        reject("Lỗi khi kiểm tra số điện thoại");
      } else {
        resolve(results.length > 0);
      }
    });
  });
};

// Hàm kiểm tra sự tồn tại của email
const checkEmailExists = (email) => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM user WHERE email = ?", [email], (err, results) => {
      if (err) {
        reject("Lỗi khi kiểm tra email");
      } else {
        resolve(results.length > 0);
      }
    });
  });
};

// Hàm cập nhật thông tin cá nhân
const updateUserInfo = async (userId, phone, email) => {
  try {
    // Kiểm tra xem số điện thoại và email mới có tồn tại chưa (ngoại trừ của chính user hiện tại)
    const currentUser = await getUserById(userId);
    const isPhoneExist = await checkPhoneExists(phone);
    const isEmailExist = await checkEmailExists(email);

    if (isPhoneExist && phone !== currentUser.phone) {
      throw new Error("Số điện thoại đã tồn tại");
    }

    if (isEmailExist && email !== currentUser.email) {
      throw new Error("Email đã tồn tại");
    }

    const query = "UPDATE user SET phone = ?, email = ? WHERE user_id = ?";
    const values = [phone, email, userId];

    return new Promise((resolve, reject) => {
      db.query(query, values, (err, results) => {
        if (err) {
          console.error("Lỗi khi cập nhật thông tin người dùng:", err);
          reject({ status: "thất bại", message: "Lỗi khi cập nhật thông tin" });
        } else {
          console.log("Cập nhật thông tin người dùng thành công:", results);
          resolve({
            status: "thành công",
            message: "Thông tin người dùng đã được cập nhật",
            updatedInfo: { phone, email }
          });
        }
      });
    });
  } catch (error) {
    throw error;
  }
};

// Hàm đổi mật khẩu
const changePassword = async (userId, currentPassword, newPassword) => {
  try {
    // Kiểm tra mật khẩu hiện tại
    const checkPasswordQuery = "SELECT password FROM user WHERE user_id = ?";
    const user = await new Promise((resolve, reject) => {
      db.query(checkPasswordQuery, [userId], (err, results) => {
        if (err) reject(err);
        else resolve(results[0]);
      });
    });

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      throw new Error("Mật khẩu hiện tại không đúng");
    }

    // Mã hóa mật khẩu mới
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Cập nhật mật khẩu mới
    const updatePasswordQuery = "UPDATE user SET password = ? WHERE user_id = ?";
    return new Promise((resolve, reject) => {
      db.query(updatePasswordQuery, [hashedNewPassword, userId], (err, results) => {
        if (err) {
          console.error("Lỗi khi đổi mật khẩu:", err);
          reject({ status: "thất bại", message: "Lỗi khi đổi mật khẩu" });
        } else {
          console.log("Đổi mật khẩu thành công:", results);
          resolve({
            status: "thành công",
            message: "Mật khẩu đã được thay đổi"
          });
        }
      });
    });
  } catch (error) {
    throw error;
  }
};

// Hàm lấy thông tin người dùng theo ID
const getUserById = (userId) => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM user WHERE user_id = ?", [userId], (err, results) => {
      if (err) {
        reject("Lỗi khi lấy thông tin người dùng");
      } else if (results.length === 0) {
        reject("Không tìm thấy người dùng");
      } else {
        resolve(results[0]);
      }
    });
  });
};


module.exports = {updateUserInfo,changePassword,
  createUser,
  loginUser,
  checkUsernameExists,
  checkPhoneExists,
  checkEmailExists
};
