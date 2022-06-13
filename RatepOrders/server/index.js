const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const mysql = require("mysql");
const queries = require("./config/queries");

const config = require("./config/keys");

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
// Авторизация
app.get("/auth/:login/:password", (req, res) => {
  // Получение URL-параметров
  let { login } = req.params;
  let { password } = req.params;

  // Запрос к базе данных
  connection.query(queries.auth(login, password), function (err, rows, fields) {
    try {
      // В случае ошибки
      if (err) {
        // вывести ошибку в консоль и вернуть клиенту ошибку сервера
        console.log("err");
        res.status(500).send(err);
        return;
      }

      // Токен пользователя
      let token = rows[0][0].token;
      let key = rows[0][0].key;

      console.log(rows[0], token, key);

      // В случае успешного выполнения запроса
      // если токен получен [успешная авторизация],
      if (token) {
        // вернуть HTTP-код 200 (OK)
        // с телом, содержащим токен и ключ токена
        res.status(200).json({
          token: token,
          key: key,
        });
      }
      // если токен не получен [неверный логин или пароль],
      else {
        // вернуть HTTP-код 204 (no content)
        res.status(204).send();
      }
    } catch (error) {
      console.log(error);
      res.status(204).send(error);
    }
  });
});

// Проверка токена
app.get("/check-token/:token/:login/:key", (req, res) => {
  let { token } = req.params;
  let { login } = req.params;
  let { key } = req.params;

  console.log(req.cookies);

  connection.query(
    queries.checkToken(token, login, key),
    function (err, rows, fields) {
      // В случае ошибки
      if (err) {
        // вывести ошибку в консоль и вернуть клиенту ошибку сервера
        console.log(err);
        res.status(500);
      }

      // В случае успешного выполнения запроса
      // вернуть список пользователей
      res.status(200).json({
        access: rows[0].access == 1,
      });
    }
  );
});

// Получение списка пользователей
app.get("/users", (req, res) => {
  connection.query(queries.getUsers(), function (err, rows, fields) {
    // В случае ошибки
    if (err) {
      // вывести ошибку в консоль и вернуть клиенту ошибку сервера
      console.log(err);
      res.status(500).json();
    }

    // В случае успешного выполнения запроса
    // вернуть список пользователей
    res.status(200).json({
      users: rows,
    });
  });
});

// Получение списка клиентов
app.get("/clients", (req, res) => {
  connection.query(queries.getClients(), function (err, rows, fields) {
    // В случае ошибки
    if (err) {
      // вывести ошибку в консоль и вернуть клиенту ошибку сервера
      console.log(err);
      res.status(500);
    }

    // В случае успешного выполнения запроса
    // вернуть список клиентов
    res.status(200).json({
      clients: rows,
    });
  });
});

// Получение списка договоров
app.get("/contracts", (req, res) => {
  connection.query(queries.getContracts(), function (err, rows, fields) {
    // В случае ошибки
    if (err) {
      // вывести ошибку в консоль и вернуть клиенту ошибку сервера
      console.log(err);
      res.status(500);
    }

    // В случае успешного выполнения запроса
    // вернуть список договоров
    res.status(200).json({
      contracts: rows,
    });
  });
});
app.get("/contract/:clientId/:contractId", (req, res) => {
  let { clientId } = req.params;
  let { contractId } = req.params;

  connection.query(
    queries.getContract(clientId, contractId),
    function (err, rows, fields) {
      // В случае ошибки
      if (err) {
        // вывести ошибку в консоль и вернуть клиенту ошибку сервера
        console.log(err);
        res.status(500);
      }

      // В случае успешного выполнения запроса
      // вернуть список договоров
      res.status(200).json({
        contract: rows[0],
      });
    }
  );
});

app.get("/specification/:clientId/:contractId", (req, res) => {
  let { clientId } = req.params;
  let { contractId } = req.params;

  try {
    connection.query(
      queries.getSpecification(clientId, contractId),
      function (err, rows, fields) {
        // В случае ошибки
        if (err) {
          // вывести ошибку в консоль и вернуть клиенту ошибку сервера
          res.status(500);
        }

        // В случае успешного выполнения запроса
        // вернуть спецификацию
        res.status(200).json({
          specification: rows[0],
        });
      }
    );
  } catch (error) {
    res.status(500);
  }
});

app.get("/full-specification/:clientId/:contractId", (req, res) => {
  let { clientId } = req.params;
  let { contractId } = req.params;

  try {
    connection.query(
      queries.getFullSpecifiction(clientId, contractId),
      function (err, rows, fields) {
        // В случае ошибки
        if (err) {
          // вывести ошибку в консоль и вернуть клиенту ошибку сервера
          res.status(500);
        }

        // В случае успешного выполнения запроса
        // вернуть спецификацию
        res.status(200).json({
          specification: rows[0],
        });
      }
    );
  } catch (error) {
    res.status(500);
  }
});

app.post("/add-physical-person-client", express.json(), (req, res) => {
  let { INN, fullname, phone, address } = req.body;

  new Promise((resolve, reject) => {
    connection.query(
      queries.addPhysicalPersonClient(INN, fullname, phone, address),
      function (err, rows, fields) {
        if (err) {
          console.log(err.sqlMessage);
          reject(err);
        }

        resolve({ message: "Клиент добавлен" });
      }
    );
  })
    .then((value) => res.status(200).json(value))
    .catch((err) => res.status(400).json(err.sqlMessage));
});

app.post("/add-juridical-person-client", express.json(), (req, res) => {
  let { INN, name, KPP, OGRN } = req.body;

  new Promise((resolve, reject) => {
    connection.query(
      queries.addJuridicalPersonClient(INN, name, KPP, OGRN),
      function (err, rows, fields) {
        if (err) {
          console.log(err.sqlMessage);
          reject(err);
        }

        resolve({ message: "Клиент добавлен" });
      }
    );
  })
    .then((value) => res.status(200).json(value))
    .catch((err) => res.status(400).json(err.sqlMessage));
});

app.get("/orders/:clientId/:contractId", (req, res) => {
  let { clientId } = req.params;
  let { contractId } = req.params;

  connection.query(
    queries.getOrders(clientId, contractId),
    function (err, rows, fields) {
      // В случае ошибки
      if (err) {
        // вывести ошибку в консоль и вернуть клиенту ошибку сервера
        console.log(err);
        res.status(500);
      }

      // В случае успешного выполнения запроса
      // вернуть список заказов
      res.status(200).json({
        orders: rows[0],
      });
    }
  );
});

// Получение состава заказа
app.get("/order-composition/:clientId/:contractId/:orderId", (req, res) => {
  let { clientId } = req.params;
  let { contractId } = req.params;
  let { orderId } = req.params;

  connection.query(
    queries.getOrderComposition(clientId, contractId, orderId),
    function (err, rows, fields) {
      // В случае ошибки
      if (err) {
        // вывести ошибку в консоль и вернуть клиенту ошибку сервера
        console.log(err);
        res.status(500);
      }

      // В случае успешного выполнения запроса
      // вернуть состав заказа
      res.status(200).json({
        orderComposition: rows[0],
      });
    }
  );
});

// Получение списка клиентов
app.get("/clients", (req, res) => {
  connection.query(queries.getClients(), function (err, rows, fields) {
    // В случае ошибки
    if (err) {
      // вывести ошибку в консоль и вернуть клиенту ошибку сервера
      console.log(err);
      res.status(500);
    }

    // В случае успешного выполнения запроса
    // вернуть список договоров
    res.status(200).json({
      clients: rows,
    });
  });
});

app.get("/post-id/:login", (req, res) => {
  let { login } = req.params;

  connection.query(queries.getPostId(login), function (err, rows, fields) {
    if (err) return;

    res.status(200).json({
      postId: rows[0]?.PostId,
    });
  });
});

app.get("/positions", (req, res) => {
  connection.query(
    queries.getPositions(req.query.orderId),
    function (err, rows, fields) {
      if (err) {
        console.log(err);
        return;
      }
      res.status(200).json({
        result: rows,
      });
    }
  );
});

app.get("/products", (req, res) => {
  connection.query(queries.getProducts(), function (err, rows, fields) {
    if (err) return;
    res.status(200).json({
      result: rows,
    });
  });
});

app.post("/add-order", express.json(), (req, res) => {
  let { body } = req;
  let { clientId } = body;
  let { contractId } = body;
  let { composition } = body;

  console.log(clientId, contractId);

  new Promise((resolve, reject) => {
    connection.query(
      queries.addOrder(clientId, contractId),
      function (err, rows, fields) {
        // В случае ошибки
        if (err) {
          // вывести ошибку в консоль и вернуть клиенту ошибку сервера
          console.log(err.sqlMessage);
          reject(err);
          // res.status(500).send(err.sqlMessage);
        }

        composition.forEach((comp) => {
          connection.query(
            queries.addOrderComposition(
              clientId,
              contractId,
              comp.ProductId,
              comp.Amount
            ),
            function (err, rows, fields) {
              console.log(
                queries.addOrderComposition(
                  clientId,
                  contractId,
                  comp.ProductId,
                  comp.Amount
                )
              );
              if (err) {
                reject(err);
                return;
              }
            }
          );
        });

        resolve(res);
      }
    );
  }).then(
    (result) => res.status(200).send(),
    (error) => res.status(500).send(error.sqlMessage)
  );
});

app.post("/add-contract", express.json(), (req, res) => {
  let { login } = req.body;
  let { clientId } = req.body;
  let { startDate } = req.body;
  let { endDate } = req.body;
  let { products } = req.body;

  new Promise((resolve, reject) => {
    connection.query(
      queries.addContract(login, clientId, startDate, endDate),
      function (err, rows, fields) {
        // В случае ошибки
        if (err) {
          // вывести ошибку в консоль и вернуть клиенту ошибку сервера
          console.log(err.sqlMessage);
          reject(err);
          // res.status(500).send(err.sqlMessage);
        }

        products.forEach((product) => {
          connection.query(
            queries.addSpecification(
              clientId,
              product.ProductId,
              product.Amount
            ),
            function (err, rows, fields) {
              console.log(clientId, product.ProductId, product.Amount);
              if (err) {
                reject(err);
                return;
              }
            }
          );
        });

        // В случае успешного выполнения запроса
        // вернуть код 200
        resolve(res);
        // res.status(200).send("Договор оформлен");
      }
    );
  }).then(
    (result) => res.status(200).send(),
    (error) => res.status(500).send(error.sqlMessage)
  );
});

app.get("/price-list", (req, res) => {
  connection.query(queries.getPriceList(), function (err, rows, fields) {
    // В случае ошибки
    if (err) {
      // вывести ошибку в консоль и вернуть клиенту ошибку сервера
      console.log(err);
      res.status(500);
    }

    // В случае успешного выполнения запроса
    // вернуть список изделий
    res.status(200).json({
      products: rows,
    });
  });
});

app.post("/add-specification", express.json(), (req, res) => {
  let body = req.body;

  new Promise((resolve, reject) => {
    body.forEach((specification) => {
      connection.query(
        queries.addSpecification(
          specification.ClientId,
          specification.ContractId,
          specification.ProductId,
          specification.Amount
        ),
        function (err, rows, fields) {
          // В случае ошибки
          if (err) {
            // вывести ошибку в консоль и вернуть клиенту ошибку сервера
            console.log(err.sqlMessage);
            reject(err);
            return;
            // res.status(500).send(err.sqlMessage);
          }
        }
      );
    });
  }).then(
    (result) => res.status(200).send(),
    (error) => res.status(500).send(error.sqlMessage)
  );
});

app.post("/set-order-status", express.json(), (req, res) => {
  let { clientId, contractId, orderId, statusId } = req.body;

  connection.query(
    queries.setOrderStatus(clientId, contractId, orderId, statusId),
    function (err, rows, fields) {
      if (err) {
        res.status(400).json(err);
        return;
      }

      res.status(200).json();
    }
  );
});

app.post("/set-contract-status", express.json(), (req, res) => {
  let { clientId, contractId, statusId } = req.body;

  connection.query(
    queries.setContractStatus(clientId, contractId, statusId),
    function (err, rows, fields) {
      if (err) {
        res.status(400).json(err);
        return;
      }

      res.status(200).json();
    }
  );
});

app.post("/new-physical-person-client", express.json(), (req, res) => {
  connection.query(
    `SELECT MAX(ClientId) + 1 as ClientId FROM Client`,
    function (err, rows, fields) {
      if (err) return;

      let clientId = rows[0].ClientId || 1;
      let body = req.body;
      let tin = body.INN;
      let fullname = body.fullname;
      let phone = body.phone;
      let address = body.address;

      let seria = body.passport.seria;
      let number = body.passport.number;
      let issueDate = body.passport.issueDate;
      let issuedBy = body.passport.issuedBy;

      console.log(clientId, tin, fullname, phone, address);
      console.log(seria, number, issueDate, issuedBy);

      connection.query(`INSERT INTO Client VALUES (${clientId}, "${tin}")`);
      connection.query(
        `INSERT INTO PhysicalPerson VALUES (${clientId}, "${fullname}", "${phone}", "${address}")`
      );
      connection.query(
        `INSERT INTO Passport VALUES (${clientId}, "${seria}", "${number}", "${issueDate}", "${issuedBy}")`
      );

      res.status(200).json({
        result: rows[0].ClientId,
      });
    }
  );
});

app.post("/new-legal-person-client", express.json(), (req, res) => {
  connection.query(
    `SELECT MAX(ClientId) + 1 as ClientId FROM Client`,
    function (err, rows, fields) {
      // if (err) return;

      let clientId = rows[0].ClientId || 1;
      let body = req.body;
      let tin = body.INN;
      let address = body.address;
      let trrc = body.KPP;
      let psrn = body.OGRN;
      let organizationName = body.organizationName;

      let seria = body.passport.seria;
      let number = body.passport.number;
      let issueDate = body.passport.issueDate;
      let issuedBy = body.passport.issuedBy;

      console.log(clientId, tin, organizationName, address, trrc, psrn);
      console.log(seria, number, issueDate, issuedBy);

      connection.query(`INSERT INTO Client VALUES (${clientId}, "${tin}")`);
      connection.query(
        `INSERT INTO LegalPerson VALUES (${clientId}, "${organizationName}", "${trrc}", "${psrn}", "${address}")`
      );
      connection.query(
        `INSERT INTO Passport VALUES (${clientId}, "${seria}", "${number}", "${issueDate}", "${issuedBy}")`
      );

      res.status(200).json({
        result: rows[0].ClientId,
      });
    }
  );
});

app.post("/update-product", express.json(), (req, res) => {
  let body = req.query;
  let productId = body.productId;
  let productName = body.productName;
  let priceValue = body.priceValue;
  let changeDate = body.changeDate;

  connection.query(
    `UPDATE Product SET ProductName = "${productName}" WHERE ProductId = ${productId}`,
    function (err, rows, fields) {
      if (err) {
        console.log(err);
        res.status(400);
        return;
      }
    }
  );

  connection.query(
    `SELECT MAX(OrdinalNubmer) + 1 as ordinalNumber FROM Price WHERE ProductId = ${productId}`,
    function (err, rows, fields) {
      if (err) {
        console.log(err);
        res.status(400);
        return;
      }

      let ordinalNumber = rows[0].ordinalNumber;

      connection.query(
        `INSERT INTO Price VALUES (${ordinalNumber}, ${productId}, ${priceValue}, "${changeDate}")`,
        function (err, rows, fields) {
          if (err) {
            console.log(err);
            res.status(400);
            return;
          }
        }
      );
    }
  );
});

app.post("/new-product", express.json(), (req, res) => {
  connection.query(
    `SELECT MAX(ProductId) + 1 as productId FROM Product`,
    function (err, rows, fields) {
      if (err) {
        console.log(err);
        res.status(400);
        return;
      }

      console.log(req.body);

      let productId = rows[0].productId;
      let productName = req.body.productName;
      let priceValue = req.body.priceValue;
      let changeDate = req.body.changeDate;
      console.log(productId, productName, priceValue, changeDate);

      connection.query(
        `INSERT INTO Product VALUES (${productId}, "${productName}")`,
        function (err, rows, fields) {
          if (err) {
            console.log(err);
            res.status(400);
            return;
          }
        }
      );

      connection.query(
        `SELECT MAX(OrdinalNubmer) + 1 as ordinalNumber FROM Price WHERE ProductId = ${productId}`,
        function (err, rows, fields) {
          if (err) {
            console.log(err);
            res.status(400);
            return;
          }

          let ordinalNumber = rows[0].ordinalNumber || 1;

          connection.query(
            `INSERT INTO Price VALUES (${ordinalNumber}, ${productId}, ${priceValue}, "${changeDate}")`,
            function (err, rows, fields) {
              if (err) {
                console.log(err);
                res.status(400);
                return;
              }
            }
          );
        }
      );
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
