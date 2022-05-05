const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const mysql = require("mysql");

const config = require("./config/keys");
const { ppid } = require("process");

const app = express();

const connection = mysql.createConnection({
  host: config.DATABASE.MYSQL_URL,
  database: config.DATABASE.MYSQL_DATABASE,
  user: config.DATABASE.MYSQL_USER,
  password: config.DATABASE.MYSQL_PASSWORD,
});

connection.connect((err) => {
  if (err) {
    console.log("server -----x----- database");
    console.log("Database connection failed");
  } else {
    console.log("server --------> database");
    console.log("Successful database connection");
  }
});

// Endpoints
app.get("/users", (req, res) => {
  connection.query("SELECT * from User", function (err, rows, fields) {
    if (err) return;
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.status(200).json({
      result: rows,
    });
  });
});

app.use(function (req, res, next) {
  next();
});

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.listen(config.SERVER.PORT || 5000, config.SERVER.HOST || "localhost", () =>
  console.log("Server is started")
);
