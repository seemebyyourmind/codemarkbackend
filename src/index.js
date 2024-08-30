const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");
app.use(cors());
require("dotenv").config();
const routes = require("./routers");
// const mysql = require("mysql2");
const bodyParser = require("body-parser");
const db = require("./config/connectDb");
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

routes(app);

app.listen(process.env.PORT || 3000, () => {
  console.log(`Example app listening on port ${process.env.PORT || port}`);
});
