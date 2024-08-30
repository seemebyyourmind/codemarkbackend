//get problem by search, diffical,

const db = require("../../config/connectDb");


const getSearchProblem = (page, difficulty, search) => {
  // console.log('page:',page,difficulty,search)
    return new Promise((resolve, reject) => {
      const limit = 15;
      const offset = (page - 1) * limit;

      let query = `
        SELECT 
        SQL_CALC_FOUND_ROWS
        p.problem_id, 
        u.username,
        p.title, 
        p.description,
        p.difficulty,
        DATE(p.created) as day,
        GROUP_CONCAT(DISTINCT g.name SEPARATOR ', ') AS groups
      FROM 
       problems p
     LEFT JOIN 
        user u ON p.user_id = u.user_id
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
          reject("Failed to retrieve users with groups");
          return;
        }
  
        // Retrieve the total count of records
        db.query('SELECT FOUND_ROWS() AS total_count', (err, countResults) => {
          if (err) {
            reject("Failed to retrieve total count");
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
   
    db.query(`SELECT p.problem_id,p.title,p.description,p.difficulty,p.created,u.username  
      FROM problems p LEFT JOIN user u ON p.user_id=u.user_id
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
   
    db.query(`SELECT  pd.source_code, pd.time_ex, pd.memory,l.name AS language_name FROM  problem_detail pd LEFT 
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

const CreateProblem=(title,description,user_id,difficulty)=>{
  return new Promise((resolve, reject) => {
   
    db.query(`INSERT INTO problems (title, description, user_id, difficulty)
VALUES (?, ?,?, ? );`, [title,description,user_id,difficulty],(err, results) => {
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


//


  module.exports={
    getProblemDetail, getSearchProblem,getProblemInfo,getProblemTestCase,CreateTestCase,CreateProblem,CreateProblemDetail,UpdateTestCase,DeleteTestCase
  }