const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const mysql = require("mysql");

const config = require("./config/keys");
const { ppid } = require("process");

const fs = require("fs");
const pdf = require("html-pdf");
const html = fs.readFileSync("./document/template.html", "utf-8");

var options = {
  width: "210mm",
  height: "290mm",
};

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
    res.status(200).json({
      result: rows,
    });
  });
});

app.get("/orders", (req, res) => {
  connection.query(
    `SELECT
    O.OrderId,
    O.Number,
    O.OrderDate,
    O.ReadyDate,
    O.EmployeeId,
    C.Tin,
    (SELECT
            Fullname
        FROM
            PhysicalPerson
        WHERE
            ClientId = C.ClientId) AS Fullname,
    (SELECT
            OrganizationName
        FROM
            LegalPerson
        WHERE
            ClientId = C.ClientId) AS OrganizationName
FROM
    RatepOrders.Order O
        INNER JOIN
    RatepOrders.Client C ON O.ClientId = C.ClientId`,
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
    `SELECT
    OP.OrderId,
    OP.OrdinalNumber,
    P.ProductName,
    OP.Amount,
    Pr.PriceValue
FROM
    OrderPosition OP
        INNER JOIN
    Product P ON OP.ProductId = P.ProductId
        INNER JOIN
    Price Pr ON P.ProductId = Pr.ProductId
        INNER JOIN
    RatepOrders.Order O ON OP.OrderId = O.OrderId
WHERE
    O.OrderId = ${req.query["orderId"]}
        AND Pr.ChangeDate = (SELECT
            MAX(ChangeDate)
        FROM
            Price
        WHERE
            ProductId = P.ProductId
                AND ChangeDate <= O.OrderDate)`,
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

app.post("/new-order", express.json(), (req, res) => {
  connection.query(
    `SELECT MAX(OrderId) + 1 as orderId from RatepOrders.Order`,
    function (err, rows, fields) {
      if (err) return;

      const orderId = rows[0].orderId || 1;
      const clientId = req.query["clientId"];
      const employeeId = req.query["employeeId"];
      const number = `RTP-${clientId}-` + `${orderId}`.padStart(3, "0");
      const positions = req.body.positions;
      const date = new Date();
      const orderDate = `${date.getFullYear()}-${
        date.getMonth() + 1
      }-${date.getDate()}`;
      const readyDate = req.body.readyDate;
      connection.query(
        `INSERT INTO RatepOrders.Order VALUES (${orderId}, "${number}", "${orderDate}", "${readyDate}", ${employeeId}, ${clientId})`
      );

      var i = 1;
      positions.forEach((position) => {
        console.log(
          `INSERT INTO OrderPosition VALUES (${i}, ${orderId}, ${position.ProductId}, ${position.Amount})`
        );
        connection.query(
          `INSERT INTO OrderPosition VALUES (${i}, ${orderId}, ${position.ProductId}, ${position.Amount})`
        );
        i++;
      });

      res.status(200).json({
        in: req.body,
      });
    }
  );
});

app.get("/getClientName", (req, res) => {
  let clietnId = req.query["clientId"];
});

app.get("/clients", (req, res) => {
  connection.query(
    `SELECT
    ClientId,
    Tin as INN,
    (SELECT
            Fullname
        FROM
            PhysicalPerson
        WHERE
            ClientId = C.ClientId) as Fullname,
    (SELECT
            OrganizationName
        FROM
            LegalPerson
        WHERE
            ClientId = C.ClientId) as OrganizationName,
    (SELECT
            Trrc
        FROM
            LegalPerson
        WHERE
            ClientId = C.ClientId) as KPP,
            (SELECT
            Psrn
        FROM
            LegalPerson
        WHERE
            ClientId = C.ClientId) as OGRN
FROM
    Client C`,
    function (err, rows, fields) {
      if (err) return;
      res.status(200).json({
        result: rows,
      });
    }
  );
});

// app.get("/contract", (req, res) => {
//   pdf.create(html, options).toBuffer((err, buffer) => {
//     if (err) {
//       console.log(err);
//     } else {
//       res.send(buffer);
//     }
//   });
// });

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
