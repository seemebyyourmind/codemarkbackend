const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");
// const https=require("https")
// const fs = require("fs"); 
app.use(cors());
require("dotenv").config();
const routes = require("./routers");
// const mysql = require("mysql2");
const bodyParser = require("body-parser");
const db = require("./config/connectDb");
app.use(bodyParser.json());
console.log(process.env.ALLOWED_ORIGIN);
const allowedOrigins = [
  process.env.ALLOWED_ORIGIN || "*", // miền từ biến môi trường
  "http://luyende.hoclaptrinh.pro",
  "https://luyende.hoclaptrinh.pro"
];

// Tạo một hàm kiểm tra miền cho phép
const corsOptions = {
  origin: function (origin, callback) {
    // Kiểm tra xem miền có trong danh sách cho phép không
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true); // Miền hợp lệ
    } else {
      callback(new Error("Not allowed by CORS")); // Miền không hợp lệ
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"], // Chỉ cho phép các phương thức cụ thể
  allowedHeaders: ["Content-Type", "Authorization"], // Chỉ cho phép các tiêu đề cụ thể
  credentials: true, // Cho phép gửi cookie nếu cần
};

app.use(cors(corsOptions));
app.get("/", (req, res) => {
  res.send("Hello World!");
});

routes(app);

// const sslOptions = {
//   key: fs.readFileSync("/etc/letsencrypt/live/luyende.hoclaptrinh.pro/privkey.pem"), // Đường dẫn đến tệp privkey
//   cert: fs.readFileSync("/etc/letsencrypt/live/luyende.hoclaptrinh.pro/fullchain.pem") // Đường dẫn đến tệp fullchain
// };

// Tạo máy chủ HTTPS
// https.createServer(sslOptions, app).listen(process.env.PORT || 3000, () => {
//   console.log(`HTTPS server listening on port ${process.env.PORT || port}`);
 
app.listen(process.env.PORT || 3000, () => {
  console.log(`Example app listening on port ${process.env.PORT || port}`);
});
