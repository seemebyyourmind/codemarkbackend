const mysql = require("mysql2");

// kết nối tới database
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "appchamcode",
});

// Thử kết nối
connection.connect((err) => {
  if (err) {
    console.error("Lỗi kết nối:", err);
    return;
  }
  console.log("Kết nối thành công!");

  // Đóng kết nối sau khi kiểm tra thành công
});
module.exports = connection;
