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

// Настройка CORS
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, PATCH, PUT, POST, DELETE, OPTIONS"
  );
  next();
});

// Endpoints
app.get("/users", (req, res) => {
  connection.query("SELECT * from User", function (err, rows, fields) {
    if (err) return;
    // res.header("Access-Control-Allow-Origin", "*");
    // res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
    // res.header(
    //   "Access-Control-Allow-Headers",
    //   "Origin, X-Requested-With, Content-Type, Accept"
    // );
    res.status(200).json({
      result: rows,
    });
  });
});

app.get("/orders", (req, res) => {
  connection.query(
    "SELECT O.OrderId, O.Number, O.OrderDate, O.ReadyDate, O.EmployeeId, C.Tin FROM RatepOrders.Order O INNER JOIN RatepOrders.Client C on O.ClientId = C.ClientId",
    function (err, rows, fields) {
      if (err) return;
      res.status(200).json({
        result: rows,
      });
    }
  );
});

app.get("/positions", (req, res) => {
  connection.query(
    `SELECT OP.OrderId, OP.OrdinalNumber, P.ProductName, OP.Amount FROM OrderPosition OP INNER JOIN Product P ON OP.ProductId = P.ProductId WHERE OrderId = ${req.query["orderId"]}`,
    function (err, rows, fields) {
      if (err) return;
      res.status(200).json({
        result: rows,
      });
    }
  );
});

app.get("/products", (req, res) => {
  connection.query(
    `SELECT P.ProductId, P.ProductName, Pr.PriceValue FROM Product P INNER JOIN Price Pr on P.ProductId = Pr.ProductId
    WHERE Pr.ChangeDate = (SELECT max(ChangeDate) from Price WHERE ProductId = P.ProductId)`,
    function (err, rows, fields) {
      if (err) return;
      res.status(200).json({
        result: rows,
      });
    }
  );
});

app.get("/clients", (req, res) => {
  connection.query(
    `SELECT ClientId, Tin FROM Client`,
    function (err, rows, fields) {
      if (err) return;
      res.status(200).json({
        result: rows,
      });
    }
  );
});

app.post("/new-order", express.json(), (req, res) => {
  connection.query(
    `SELECT MAX(OrderId) + 1 as orderId from RatepOrders.Order WHERE ClientId=${req.query["clientId"]}`,
    function (err, rows, fields) {
      if (err) return;

      const orderId = rows[0].orderId || 1;
      const clientId = req.query["clientId"];
      const number = `RTP-${clientId}-` + `${orderId}`.padStart(3, "0");
      const positions = req.body;
      const date = new Date();
      const orderDate = `${date.getFullYear()}-${
        date.getMonth() + 1
      }-${date.getDate()}`;

      console.log(orderDate);
      positions.forEach((position) => {
        // connection.query(`INSERT INTO RatepOrders.Order VALUES (${orderId}, "${number}", "${orderDate}"`);
      });

      res.status(200).json({
        in: req.body,
      });
    }
  );
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
