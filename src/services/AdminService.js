
const db = require("../config/connectDb");
const mysql = require("mysql2/promise")
;
require("dotenv").config();
const  getTotalOrder = () => {
    return new Promise((resolve, reject) => {
        // Intl.DateTimeFormat().resolvedOptions().timeZone = 'Asia/Ho_Chi_Minh';

        // // Lấy tháng hiện tại
        // var currentDate = new Date();
        // var currentMonth = currentDate.getMonth() + 1; // Tháng bắt đầu từ 0
        // var currentYear = currentDate.getFullYear();
      db.query(
        "SELECT COUNT(id) as totalorder FROM orders WHERE MONTH(date) = MONTH(CURDATE()) AND YEAR(date) = YEAR(CURDATE())",
        (err, results) => {
          if (err) {
            reject("Fail to get resource");
            console.log(err);
          } else {
            // Kiểm tra xem có kết quả trả về không
  
            resolve(results[0]); // Trả về thông tin của pet đầu tiên (nếu có)
          }
        }
      );
    });
  };
  const  getTotalPetOrder = () => {
    return new Promise((resolve, reject) => {
      db.query(
        "SELECT COUNT(pet_id) as totalpet FROM pet_order INNER JOIN orders ON orders.id=pet_order.order_id WHERE MONTH(orders.date) = MONTH(CURDATE()) AND YEAR(orders.date) =YEAR(CURDATE())",
        (err, results) => {
          if (err) {
            reject("Fail to get resource");
            console.log(err);
          } else {
            // Kiểm tra xem có kết quả trả về không
  
            resolve(results[0]); // Trả về thông tin của pet đầu tiên (nếu có)
          }
        }
      );
    });
  };
  const  getTotalStuffOrder = () => {
    return new Promise((resolve, reject) => {
      db.query(
        "SELECT SUM(number) as totalstuff FROM stuff_order INNER JOIN orders ON orders.id=stuff_order.order_id WHERE MONTH(orders.date) = MONTH(CURDATE()) AND YEAR(orders.date) =YEAR(CURDATE())",
        (err, results) => {
          if (err) {
            reject("Fail to get resource");
            console.log(err);
          } else {
            // Kiểm tra xem có kết quả trả về không
  
            resolve(results[0]); // Trả về thông tin của pet đầu tiên (nếu có)
          }
        }
      );
    });
  };
  const  getTotalCustomer = () => {
    return new Promise((resolve, reject) => {
      db.query(
        "SELECT COUNT(*) as totalcustomer FROM user",
        (err, results) => {
          if (err) {
            reject("Fail to get resource");
            console.log(err);
          } else {
            // Kiểm tra xem có kết quả trả về không
  
            resolve(results[0]); // Trả về thông tin của pet đầu tiên (nếu có)
          }
        }
      );
    });
  };
  const getTotalMonney = () => {
    return new Promise((resolve, reject) => {
      db.query(
        "SELECT SUM(price) as totalmoney FROM `orders` WHERE MONTH(date) = MONTH(CURDATE()) AND YEAR(date) = YEAR(CURDATE())",
        (err, results) => {
          if (err) {
            reject("Fail to get resource");
            console.log(err);
          } else {
            // Kiểm tra xem có kết quả trả về không
             resolve(results[0]);}
           
           // Trả về thông tin của pet đầu tiên (nếu có)
          }
        
      );
    });
  };
  const getTestCase = (id) => {
    return new Promise((resolve, reject) => {
      db.query(
        "SELECT * FROM testcase WHERE problem_id=?;",[id],
        (err, results) => {
          if (err) {
            reject("Fail to get resource");
            console.log(err);
          } else {
            // Kiểm tra xem có kết quả trả về không
             resolve(results);}
           
           // Trả về thông tin của pet đầu tiên (nếu có)
          }
        
      );
    });
  };


 module.exports={getTotalPetOrder,getTotalMonney,getTotalStuffOrder,
    getTotalCustomer,getTestCase,
    getTotalOrder}
