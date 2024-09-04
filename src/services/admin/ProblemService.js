//get problem by search, diffical,

const db = require("../../config/connectDb");


const getSearchProblem = (page, difficulty, search) => {
  return new Promise((resolve, reject) => {
    const limit = 15;
    const offset = (page - 1) * limit;

    let query = `
      SELECT 
      SQL_CALC_FOUND_ROWS
      p.problem_id, 
      p.title, 
      p.description,
      p.difficulty,
      DATE(p.created) as day,
      GROUP_CONCAT(DISTINCT g.name SEPARATOR ', ') AS groups
    FROM 
     problems p
    LEFT JOIN 
      problem_group pg ON p.problem_id = pg.problem_id
    LEFT JOIN 
      groups g ON pg.group_id = g.group_id
    WHERE 
      1 = 1
    `;

    let queryParams = [];
    if (difficulty !== 'all') {
      query += ` AND p.difficulty = ?`;
      queryParams.push(difficulty);
    } 

    if (search) {
      query += ` AND (p.title LIKE ? OR p.description LIKE ?)`;
      queryParams.push(`%${search}%`, `%${search}%`);
    }

    query += ` GROUP BY p.problem_id, p.title, p.description, p.difficulty, p.created LIMIT ? OFFSET ?`;
    queryParams.push(limit, offset);
    console.log(query);
    console.log(queryParams)
    db.query(query, queryParams, (err, results) => {
      if (err) {
        reject("Không thể truy xuất bài toán");
        return;
      }

      // Lấy tổng số bản ghi
      db.query('SELECT FOUND_ROWS() AS total_count', (err, countResults) => {
        if (err) {
          reject("Không thể lấy tổng số bản ghi");
        } else {
          resolve({
            problems: results,
            total_count: countResults[0].total_count
          });
        }
      });
    });
  });
};

//lay thong tin problem  bảng problem, bảng problem,bảng problem detail, bảng testcase
const getProblemInfo=(id)=>{
  return new Promise((resolve, reject) => {
   
    db.query(`SELECT p.problem_id,p.title,p.description,p.difficulty,p.created  
      FROM problems p
      WHERE p.problem_id=? `, [id],(err, results) => {
      if (err) {
        reject("fail get resource");
      } else {
        resolve(results);
      }
    });
  });
}


const getProblemDetail=(id)=>{
  return new Promise((resolve, reject) => {
   
    db.query(`SELECT  pd.source_code, pd.time_ex, pd.memory,pd.language_id,l.name AS language_name FROM  problem_detail pd LEFT 
     JOIN languages l on pd.language_id=l.language_id  WHERE pd.problem_id=? ;`,[id], (err, results) => {
      if (err) {
        reject("fail get resource");
      } else {
        resolve(results);
      }
    });
  });
}

const getProblemTestCase=(id)=>{
  return new Promise((resolve, reject) => {
   
    db.query("SELECT *  FROM  testcase WHERE problem_id=? ;",[id], (err, results) => {
      if (err) {
        reject("fail get resource");
      } else {
        resolve(results);
      }
    });
  });
}


//tạo problem 

const CreateProblem=(title,description,difficulty)=>{
  return new Promise((resolve, reject) => {
   
    db.query(`INSERT INTO problems (title, description, difficulty)
VALUES (?, ?, ? );`, [title,description,difficulty],(err, results) => {
      if (err) {
        reject("fail get resource");
      } else {
        resolve(results);
      }
    });
  });
}
const CreateTestCase=(id,input,output)=>{
  return new Promise((resolve, reject) => {
   
    db.query(`INSERT INTO testcase (problem_id, input, output)
    VALUES (?, ?, ?);`,[id,input,output], (err, results) => {
      if (err) {
        reject("fail get resource");
      } else {
        resolve(results.insertId);
      }
    });
  });

}

const CreateProblemDetail=(id,language_id,source_code,time_ex,memmory)=>{
  return new Promise((resolve, reject) => {
   
    db.query(`INSERT INTO problem_detail ( language_id, source_code, time_ex, memory)
VALUES (?,?,?,?) WHERE problem_id=?`,[language_id,source_code,time_ex,memmory,id], (err, results) => {
      if (err) {
        reject("fail get resource");
      } else {
        resolve(results);
      }
    });
  });
}

const UpdateTestCase = (testcase_id, input, output) => {
  return new Promise((resolve, reject) => {
    db.query(
      `UPDATE testcase SET input = ?, output = ? WHERE testcase_id = ?;`,
      [input, output, testcase_id],
      (err, results) => {
        if (err) {
          reject("fail to update testcase");
        } else {
          resolve(results);
        }
      }
    );
  });
};

const DeleteTestCase = (testcase_id) => {
  return new Promise((resolve, reject) => {
    db.query(
      `DELETE FROM testcase WHERE testcase_id = ?;`,
      [testcase_id],
      (err, results) => {
        if (err) {
          reject("fail to delete testcase");
        } else {
          resolve(results);
        }
      }
    );
  });
};

  const deleteProblem = (problem_id) => {
    return new Promise((resolve, reject) => {
      db.query(
        `DELETE FROM problems WHERE problem_id = ?;`,
        [problem_id],
        (err, results) => {
          if (err) {
            reject("Xóa bài toán thất bại");
          } else {
            if (results.affectedRows === 0) {
              reject("Không tìm thấy bài toán để xóa");
            } else {
              resolve("Xóa bài toán thành công");
            }
          }
        }
      );
    });
  };

  const updateProblemInfo = (problem_id, title, description, difficulty) => {
    return new Promise((resolve, reject) => {
      const query = `
        UPDATE problems 
        SET title = ?, description = ?, difficulty = ? 
        WHERE problem_id = ?
      `;
      
      db.query(query, [title, description, difficulty, problem_id], (err, results) => {
        if (err) {
          reject("Cập nhật thông tin bài toán thất bại");
        } else {
          if (results.affectedRows === 0) {
            reject("Không tìm thấy bài toán để cập nhật");
          } else {
            resolve("Cập nhật thông tin bài toán thành công");
          }
        }
      });
    });
  };
  const updateProblemDetail = (problem_id, language_id, source_code, time_ex, memory) => {
    return new Promise((resolve, reject) => {
      const query = `
        UPDATE problem_detail 
        SET source_code = ?, time_ex = ?, memory = ?
        WHERE problem_id = ? AND language_id = ?
      `;
      
      db.query(query, [source_code, time_ex, memory, problem_id, language_id], (err, results) => {
        if (err) {
          reject("Cập nhật chi tiết bài toán thất bại");
        } else {
          if (results.affectedRows === 0) {
            reject("Không tìm thấy chi tiết bài toán để cập nhật");
          } else {
            resolve("Cập nhật chi tiết bài toán thành công");
          }
        }
      });
    });
  };
  const getSubmitsByProblemId = (problem_id, page) => {
    return new Promise((resolve, reject) => {
      const itemsPerPage = 15;
      const offset = (page - 1) * itemsPerPage;
      
      const query = `
        SELECT SQL_CALC_FOUND_ROWS s.submit_id, s.user_id, s.problem_id, s.language_id, s.source, 
               s.status, s.numberTestcasePass, s.numberTestcase, s.points, s.error, 
               s.timeExecute, s.memoryUsage, u.username
        FROM submit s
        JOIN user u ON s.user_id = u.user_id
        WHERE s.problem_id = ?
        ORDER BY s.points DESC
        LIMIT ? OFFSET ?
      `;
      
      db.query(query, [problem_id, itemsPerPage, offset], (err, results) => {
        if (err) {
          reject("Lấy danh sách submit thất bại");
        } else {
          db.query('SELECT FOUND_ROWS() as total', (err, countResult) => {
            if (err) {
              reject("Lấy tổng số bản ghi thất bại");
            } else {
              const totalRecords = countResult[0].total;
              const totalPages = Math.ceil(totalRecords / itemsPerPage);
              resolve({
                submits: results,
                totalPages: totalPages,
                totalRecords: totalRecords
              });
            }
          });
        }
      });
    });
  };




  module.exports={getSubmitsByProblemId,updateProblemDetail,updateProblemInfo, deleteProblem,
    getProblemDetail, getSearchProblem,getProblemInfo,getProblemTestCase,CreateTestCase,CreateProblem,CreateProblemDetail,UpdateTestCase,DeleteTestCase
  }