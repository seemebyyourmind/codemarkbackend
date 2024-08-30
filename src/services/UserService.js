const db = require("../config/connectDb");

const createUser = (phone, password) => {
  return new Promise((resolve, reject) => {
    try {
      db.query(
        "INSERT INTO user SET phone=?, password=?",
        [phone, password],
        (err, results) => {
          if (err) {
            console.error("Error registering user:", err);
            reject({ status: "fail" });
          }
          console.log("User registered successfully:", results);
          resolve({
            status: "success",
            phone: phone,
          });
        }
      );
    } catch (e) {
      reject(e);
    }
  });
};

const checkPhoneUser = (phone) => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM user WHERE phone = ?", [phone], (err, results) => {
      if (err) {
        reject("fail get resouce");
      } else {
        resolve(results[0]);
      }
    });
  });
};

const loginUser = (phone) => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM user WHERE phone = ?", [phone], (err, results) => {
      if (err) {
        reject("fail get resouce");
      } else {
        resolve(results[0]);
      }
    });
  });
};

const updateUser = (user, id) => {
  return new Promise((resolve, reject) => {
    db.query(
      "UPDATE user SET username = ?,full_name=?,email=?,address=?,phone=? WHERE id=?",
      [user.username, user.full_name, user.email, user.address, user.phone, id],
      (err, results) => {
        if (err) {
          reject("fail get resouce");
          console.log(err);
        } else {
          resolve(results);
        }
      }
    );
  });
};

module.exports = { createUser, checkPhoneUser, loginUser, updateUser };
