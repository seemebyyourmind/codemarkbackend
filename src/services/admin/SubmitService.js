const db = require("../../config/connectDb");

// Tạo submit mới
const createSubmit = (user_id, problem_id, source, language_id) => {
  return new Promise((resolve, reject) => {
    db.query(
      `INSERT INTO submit (user_id, problem_id, source, status, language_id) 
       VALUES (?, ?, ?, 'pending', ?);`,
      [user_id, problem_id, source, language_id],
      (err, results) => {
        if (err) {
          reject("Không thể tạo submit");
        } else {
          resolve(results.insertId);
        }
      }
    );
  });
};

// Cập nhật kết quả submit
const updateSubmitResult = (submit_id, status, numberTestcasePass, numberTestcase, points, error, timeExecute, memoryUsage) => {
  return new Promise((resolve, reject) => {
    db.query(
      `UPDATE submit SET 
       status = ?, 
       numberTestcasePass = ?, 
       numberTestcase = ?, 
       points = ?, 
       error = ?, 
       timeExecute = ?, 
       memoryUsage = ? 
       WHERE submit_id = ?;`,
      [status, numberTestcasePass, numberTestcase, points, error, timeExecute, memoryUsage, submit_id],
      (err, results) => {
        if (err) {
          reject("Không thể cập nhật kết quả submit");
        } else {
          resolve(results);
        }
      }
    );
  });
};

// Xóa submit
const deleteSubmit = (submit_id) => {
  return new Promise((resolve, reject) => {
    db.query(
      `DELETE FROM submit WHERE submit_id = ?;`,
      [submit_id],
      (err, results) => {
        if (err) {
          reject("Không thể xóa submit");
        } else {
          resolve(results);
        }
      }
    );
  });
};

// Lấy thông tin submit theo ID
const getSubmitById = (submit_id) => {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT * FROM submit WHERE submit_id = ?;`,
      [submit_id],
      (err, results) => {
        if (err) {
          reject("Không thể lấy thông tin submit");
        } else {
          resolve(results[0]);
        }
      }
    );
  });
};

// Lấy danh sách submit theo user_id và problem_id
const getSubmitsByUserAndProblem = (user_id, problem_id, page = 1, limit = 10) => {
  return new Promise((resolve, reject) => {
    const offset = (page - 1) * limit;
    db.query(
      `SELECT SQL_CALC_FOUND_ROWS * 
       FROM submit 
       WHERE user_id = ? AND problem_id = ? 
       ORDER BY submit_id DESC 
       LIMIT ? OFFSET ?;`,
      [user_id, problem_id, limit, offset],
      (err, results) => {
        if (err) {
          reject("Không thể lấy danh sách submit");
        } else {
          db.query('SELECT FOUND_ROWS() AS total_count', (err, countResults) => {
            if (err) {
              reject("Không thể lấy tổng số submit");
            } else {
              resolve({
                submits: results,
                total_count: countResults[0].total_count
              });
            }
          });
        }
      }
    );
  });
};

module.exports = {
  createSubmit,
  updateSubmitResult,
  deleteSubmit,
  getSubmitById,
  getSubmitsByUserAndProblem
};