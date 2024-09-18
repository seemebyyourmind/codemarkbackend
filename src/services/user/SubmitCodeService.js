const db = require("../../config/connectDb");

const insertSubmitResult = (submitData) => {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO submit (
        user_id, problem_id, source, status, 
        numberTestcasePass, numberTestcase, points, 
        error, language_id, timeExecute, memoryUsage
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      submitData.user_id,
      submitData.problem_id,
      submitData.source,
      submitData.status,
      submitData.numberTestcasePass,
      submitData.numberTestcase,
      submitData.points,
      submitData.error,
      submitData.language_id,
      submitData.timeExecute,
      submitData.memoryUsage
    ];

    db.query(query, values, (err, result) => {
      if (err) {
        console.error("Lỗi khi chèn kết quả submit:", err);
        reject("Không thể chèn kết quả submit");
      } else {
        resolve({
          status: "success",
          message: "Đã chèn kết quả submit thành công",
          submit_id: result.insertId
        });
      }
    });
  });
};

module.exports = { insertSubmitResult };
