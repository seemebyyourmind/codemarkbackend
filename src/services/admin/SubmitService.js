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
    const query = `
      SELECT s.*, u.username, p.title, l.name AS language_name
      FROM submit s
      JOIN user u ON s.user_id = u.user_id
      JOIN problems p ON s.problem_id = p.problem_id
      JOIN languages l ON s.language_id = l.language_id
      WHERE s.submit_id = ?;
    `;
    
    db.query(query, [submit_id], (err, results) => {
      if (err) {
        console.error("Lỗi khi lấy thông tin submit:", err);
        reject("Không thể lấy thông tin submit");
      } else {
        resolve(results[0]);
      }
    });
  });
};

// Lấy danh sách submit theo user_id và problem_id
const getSubmitsByUserAndProblem = (user_id, problem_id, page = 1, limit = 10) => {
  return new Promise((resolve, reject) => {
    const offset = Math.max((page - 1) * limit, 0);

    const query = `
      SELECT s.*, p.title, l.name AS language_name
      FROM submit s
      JOIN problems p ON s.problem_id = p.problem_id
      JOIN languages l ON s.language_id = l.language_id
      WHERE s.user_id = ? AND s.problem_id = ?
      ORDER BY s.submit_id DESC
      LIMIT ? OFFSET ?
    `;
    
    db.query(query, [user_id, problem_id, limit, offset], (err, results) => {
      if (err) {
        console.error("Lỗi khi lấy danh sách submit:", err);
        reject("Không thể lấy danh sách submit");
      } else {
        const countQuery = `
          SELECT COUNT(*) AS total_count
          FROM submit
          WHERE user_id = ? AND problem_id = ?
        `;
        db.query(countQuery, [user_id, problem_id], (countErr, countResults) => {
          if (countErr) {
            console.error("Lỗi khi đếm tổng số submit:", countErr);
            reject("Không thể đếm tổng số submit");
          } else {
            const totalSubmits = countResults[0].total_count;
            const totalPages = Math.ceil(totalSubmits / limit);
            resolve({
              submits: results,
              currentPage: page,
              totalPages: totalPages,
              totalSubmits: totalSubmits
            });
          }
        });
      }
    });
  });
};

// Lấy danh sách submit theo user_id
const getSubmitsByUserId = (user_id, page = 1, limit = 15) => {
  return new Promise((resolve, reject) => {
    const offset = Math.max((page - 1) * limit, 0);

    const query = `
      SELECT s.*, p.title, l.name AS language_name
      FROM submit s
      JOIN problems p ON s.problem_id = p.problem_id
      JOIN languages l ON s.language_id = l.language_id
      WHERE s.user_id = ?
      ORDER BY s.submit_id DESC
      LIMIT ? OFFSET ?
    `;
    
    db.query(query, [user_id, limit, offset], (err, results) => {
      if (err) {
        console.error("Lỗi khi lấy danh sách submit theo user_id:", err);
        reject("Không thể lấy danh sách submit");
      } else {
        const countQuery = `
          SELECT COUNT(*) AS total_count
          FROM submit
          WHERE user_id = ?
        `;
        db.query(countQuery, [user_id], (countErr, countResults) => {
          if (countErr) {
            console.error("Lỗi khi đếm tổng số submit:", countErr);
            reject("Không thể đếm tổng số submit");
          } else {
            const totalSubmits = countResults[0].total_count;
            const totalPages = Math.ceil(totalSubmits / limit);
            resolve({
              submits: results,
              currentPage: page,
              totalPages: totalPages,
              totalSubmits: totalSubmits
            });
          }
        });
      }
    });
  });
};

// Lấy danh sách submit theo problem_id
const getSubmitsByProblemId = (problem_id, page = 1, limit = 15) => {
  return new Promise((resolve, reject) => {
    const offset = Math.max((page - 1) * limit, 0);

    const query = `
      SELECT s.*, u.username
      FROM submit s
      JOIN user u ON s.user_id = u.user_id
      WHERE s.problem_id = ?
      ORDER BY s.submit_id DESC
      LIMIT ? OFFSET ?
    `;
    
    db.query(query, [problem_id, limit, offset], (err, results) => {
      if (err) {
        console.error("Lỗi khi lấy danh sách submit theo problem_id:", err);
        reject("Không thể lấy danh sách submit");
      } else {
        const countQuery = `
          SELECT COUNT(*) AS total_count
          FROM submit
          WHERE problem_id = ?
        `;
        db.query(countQuery, [problem_id], (countErr, countResults) => {
          if (countErr) {
            console.error("Lỗi khi đếm tổng số submit:", countErr);
            reject("Không thể đếm tổng số submit");
          } else {
            const totalSubmits = countResults[0].total_count;
            const totalPages = Math.ceil(totalSubmits / limit);
            resolve({
              submits: results,
              currentPage: page,
              totalPages: totalPages,
              totalSubmits: totalSubmits
            });
          }
        });
      }
    });
  });
};

// Lấy thông tin submit có phân trang
const getSubmitsWithPagination = (page = 1, limit = 15, sortBy = 'submit_id') => {
  return new Promise((resolve, reject) => {
    const offset = Math.max((page - 1) * limit, 0);

    let orderBy = 's.submit_id DESC';
    
    if (sortBy === 'problem_id') {
      orderBy = 's.problem_id ASC, s.submit_id DESC';
    } else if (sortBy === 'user_id') {
      orderBy = 's.user_id ASC, s.submit_id DESC';
    }
    
    const query = `
      SELECT 
        s.user_id, s.problem_id, s.source, s.status, 
        s.numberTestcasePass, s.numberTestcase, s.points, 
        s.error, s.language_id, s.timeExecute, s.memoryUsage, 
        s.submit_id, u.username, p.title,s.submit_date
      FROM submit s
      JOIN user u ON s.user_id = u.user_id
      JOIN problems p ON s.problem_id = p.problem_id
      ORDER BY ${orderBy}
      LIMIT ? OFFSET ?
    `;
    
    db.query(query, [limit, offset], (err, results) => {
      if (err) {
        console.error("Lỗi khi lấy danh sách submit:", err);
        reject("Không thể lấy danh sách submit");
      } else {
        const countQuery = `
          SELECT COUNT(*) AS total_count
          FROM submit
        `;
        db.query(countQuery, (countErr, countResults) => {
          if (countErr) {
            console.error("Lỗi khi đếm tổng số submit:", countErr);
            reject("Không thể đếm tổng số submit");
          } else {
            const totalSubmits = countResults[0].total_count;
            const totalPages = Math.ceil(totalSubmits / limit);
            resolve({
              submits: results,
              currentPage: page,
              totalPages: totalPages,
              totalSubmits: totalSubmits
            });
          }
        });
      }
    });
  });
};



module.exports = {getSubmitsWithPagination,getSubmitsByUserId,getSubmitsByProblemId,
  createSubmit,
  updateSubmitResult,
  deleteSubmit,
  getSubmitById,
  getSubmitsByUserAndProblem
};