
const db = require("../../config/connectDb");
const createCategory = (name, description) => {
  return new Promise((resolve, reject) => {
    db.query(
      `INSERT INTO categorys (name, description) VALUES (?, ?)`,
      [name, description],
      (err, results) => {
        if (err) {
          reject("Không thể tạo danh mục mới");
        } else {
          resolve(results.insertId);
        }
      }
    );
  });
};

const updateCategory = (categoryId, name, description) => {
  return new Promise((resolve, reject) => {
    db.query(
      `UPDATE categorys SET name = ?, description = ? WHERE category_id = ?`,
      [name, description, categoryId],
      (err, results) => {
        if (err) {
          reject("Không thể cập nhật thông tin danh mục");
        } else {
          resolve(results);
        }
      }
    );
  });
};

const deleteCategory = (categoryId) => {
  return new Promise((resolve, reject) => {
    db.query(
      `DELETE FROM categorys WHERE category_id = ?`,
      [categoryId],
      (err, results) => {
        if (err) {
          reject("Không thể xóa danh mục");
        } else {
          resolve(results);
        }
      }
    );
  });
};

  const addCategoryToProblem = (problemId, categoryId) => {
    return new Promise((resolve, reject) => {
      db.query(
        `INSERT INTO problem_category (problem_id, category_id) VALUES (?, ?)`,
        [problemId, categoryId],
        (err, results) => {
          if (err) {
            reject("Không thể thêm danh mục vào bài toán");
          } else {
            resolve(results.insertId);
          }
        }
      );
    });
  };

  const removeCategoryFromProblem = (problemId, categoryId) => {
    return new Promise((resolve, reject) => {
      db.query(
        `DELETE FROM problem_category WHERE problem_id = ? AND category_id = ?`,
        [problemId, categoryId],
        (err, results) => {
          if (err) {
            reject("Không thể xóa danh mục khỏi bài toán");
          } else {
            resolve(results);
          }
        }
      );
    });
  };

  const getAllCategories = (page = 1) => {
    return new Promise((resolve, reject) => {
      const limit = 15;
      const offset = Math.max((page - 1) * limit, 0);

      const query = `
        SELECT 
          c.category_id, 
          c.name, 
          c.description,
          COUNT(DISTINCT pc.problem_id) AS total_problems
        FROM categorys c
        LEFT JOIN problem_category pc ON c.category_id = pc.category_id
        GROUP BY c.category_id
        LIMIT ? OFFSET ?
      `;
      
      db.query(query, [limit, offset], (err, results) => {
        if (err) {
          console.error("Lỗi khi lấy danh sách danh mục:", err);
          reject({ error: "Không thể lấy danh sách danh mục" });
        } else {
          db.query("SELECT COUNT(*) as total FROM categorys", (countErr, countResults) => {
            if (countErr) {
              console.error("Lỗi khi đếm tổng số danh mục:", countErr);
              reject({ error: "Không thể đếm tổng số danh mục" });
            } else {
              const totalCategories = countResults[0].total;
              const totalPages = Math.ceil(totalCategories / limit);
              resolve({
                categories: results,
                currentPage: page,
                totalPages: totalPages,
                totalCategories: totalCategories
              });
            }
          });
        }
      });
    });
  };
  const getCategoryInfo = (categoryId) => {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT category_id, name, description
        FROM categorys
        WHERE category_id = ?
      `;
      
      db.query(query, [categoryId], (err, results) => {
        if (err) {
          console.error("Lỗi khi lấy thông tin danh mục:", err);
          reject("Không thể lấy thông tin danh mục");
        } else {
          if (results.length === 0) {
            reject("Không tìm thấy danh mục với ID đã cho");
          } else {
            resolve(results[0]);
          }
        }
      });
    });
  };
  const getProblemsInCategoryStatus = (categoryId, page = 1, limit = 10, searchKeyword = '') => {
    return new Promise((resolve, reject) => {
     
      const offset = Math.max((page - 1) * limit, 0);
      const query = `
    SELECT 
        p.problem_id, 
        p.title, 
        p.difficulty,
        CASE WHEN pg.category_id IS NOT NULL THEN TRUE ELSE FALSE END AS InCategory
      FROM problems p
      LEFT JOIN problem_category pg ON p.problem_id = pg.problem_id AND pg.category_id = ?
      WHERE p.problem_id LIKE ? OR p.title LIKE ?
      LIMIT ? OFFSET ?
      `;
      
      const searchPattern = `%${searchKeyword}%`;
      db.query(query, [categoryId, searchPattern, searchPattern, limit, offset], (err, results) => {
        if (err) {
          console.error("Lỗi khi lấy danh sách bài toán trong danh mục:", err);
          reject("Không thể lấy danh sách bài toán trong danh mục");
        } else {
          const countQuery = "SELECT COUNT(*) as total FROM problems WHERE problem_id LIKE ? OR title LIKE ?";
          db.query(countQuery, [searchPattern, searchPattern], (countErr, countResults) => {
            if (countErr) {
              console.error("Lỗi khi đếm tổng số bài toán trong danh mục:", countErr);
              reject("Không thể đếm tổng số bài toán trong danh mục");
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

  const getProblemsInCategory = (category_id, page = 1, limit = 15) => {
    return new Promise((resolve, reject) => {
      const offset = Math.max((page - 1) * limit, 0);

      const query = `
        SELECT p.problem_id, p.title, p.difficulty, DATE_FORMAT(p.created, '%d-%m-%Y') as created
        FROM problem_category pc
        LEFT JOIN problems p ON pc.problem_id = p.problem_id 
        WHERE pc.category_id = ?
        LIMIT ? OFFSET ?
      `;
      db.query(query, [category_id, limit, offset], (err, results) => {
        if (err) {
          reject("Không thể lấy danh sách bài toán trong nhóm");
        } else {
          db.query(
            "SELECT COUNT(*) as total FROM problem_category WHERE category_id = ?",
            [category_id],
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



  module.exports = {getProblemsInCategory,getProblemsInCategoryStatus,getCategoryInfo,getAllCategories,
    createCategory,updateCategory,deleteCategory,
    addCategoryToProblem, removeCategoryFromProblem
  };