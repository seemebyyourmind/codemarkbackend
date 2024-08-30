const db = require("../../config/connectDb");

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
    const offset = (page - 1) * limit;
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
    const offset = (page - 1) * limit;

    let query = `
      SELECT 
        SQL_CALC_FOUND_ROWS
        u.user_id, 
        u.username, 
        u.email, 
        u.phone, 
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
    if (role !== 'all') {
      query += ` AND u.role_id = ?`;
      queryParams.push(role);
    } 

    if (search) {
      query += ` AND (u.username LIKE ? OR u.phone LIKE ? OR u.email LIKE ?)`;
      queryParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    query += ` GROUP BY 
        u.user_id, u.username, u.email, u.phone, r.name
      LIMIT ? OFFSET ?`;
    queryParams.push(limit, offset);
    console.log(query);
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
            users: results,
            total_count: countResults[0].total_count
          });
        }
      });
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




  module.exports ={getUserInfo,getUserGroup,getUsersByGroup,getUsersByRole,getAllGroup,getAllRole,getNumberUserByGroup,getNumberUsersByRole,getNumberUser,getNumberGroup}