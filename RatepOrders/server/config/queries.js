module.exports = {
  // Запрос авторизации пользователя
  auth: (login, password, key) =>
    `CALL Auth ('${login}', '${password}', '${key}')`,
  checkToken: (token, login, key) =>
    `SELECT CheckToken('${token}', '${login}', '${key}') AS access`,
  // Запрос на получение всех пользователей
  getUsers: () => "SELECT * from User",
  // Запрос на получение ID должности по логину
  getPostId: (login) =>
    `SELECT E.PostId FROM RatepOrders.User U
    INNER JOIN
Staff E ON U.UserId = E.UserId
    WHERE UserLogin = "${login}"`,
  // Запрос на получение списка договоров
  getContracts: () => "SELECT * FROM Contracts",
  // Запрос на получение спецификации договора
  getSpecification: (clientId, contractId) => `CALL GetSpecification(${clientId}, ${contractId})`,
  // Запрос на получение списка заказов
  getOrders: (clientId, contractId) => `CALL GetOrders (${clientId}, ${contractId})`,
  getOrderComposition: (clientId, contractId, orderId) => `CALL GetOrderComposition(${clientId}, ${contractId}, ${orderId})`,
  // Запрос на получение позиций заказа по ID заказа
  getPositions: (orderId) => `
    SELECT
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
    O.OrderId = ${orderId}
        AND Pr.ChangeDate = (SELECT
            MAX(ChangeDate)
        FROM
            Price
        WHERE
            ProductId = P.ProductId
                AND ChangeDate <= O.OrderDate)
        AND Pr.OrdinalNubmer = (SELECT
            MAX(OrdinalNubmer)
        FROM
            Price
        WHERE
            ProductId = P.ProductId
                AND ChangeDate <= O.OrderDate)`,
  // Запрос на получение всех изделий
  getProducts: () => `SELECT
                P.ProductId, P.ProductName, Pr.PriceValue, Pr.ChangeDate
            FROM
                Product P
                    INNER JOIN
                Price Pr ON P.ProductId = Pr.ProductId
            WHERE
                Pr.ChangeDate = (SELECT
                        MAX(ChangeDate)
                    FROM
                        Price
                    WHERE
                        ProductId = P.ProductId
                            AND ChangeDate <= SYSDATE())
                    AND Pr.OrdinalNubmer = (SELECT
                        MAX(OrdinalNubmer)
                    FROM
                        Price
                    WHERE
                        ProductId = P.ProductId
                            AND ChangeDate <= SYSDATE())`,
  // Запрос на получение всех клиентов
  getClients: () => `SELECT
  ClientId,
  INN as INN,
  (SELECT
          Fullname
      FROM
          PhysicalPerson
      WHERE
          ClientId = C.ClientId) as Fullname,
  (SELECT
          Name
      FROM
          JuridicalPerson
      WHERE
          ClientId = C.ClientId) as Name,
  (SELECT
          KPP
      FROM
          JuridicalPerson
      WHERE
          ClientId = C.ClientId) as KPP,
          (SELECT
          OGRN
      FROM
          JuridicalPerson
      WHERE
          ClientId = C.ClientId) as OGRN
FROM
  Client C`,
};
