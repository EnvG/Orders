module.exports = {
  // Запрос авторизации пользователя
  auth: (login, password) => `CALL Auth ('${login}', '${password}')`,
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
  getContract: (clieintId, contractId) =>
    `CALL GetContract(${clieintId}, ${contractId})`,
  // Запрос на получение спецификации договора
  getSpecification: (clientId, contractId) =>
    `CALL GetSpecification(${clientId}, ${contractId})`,
  getFullSpecifiction: (clientId, contractId) =>
    `CALL GetFullSpecification(${clientId}, ${contractId})`,
  // Запрос на получение списка заказов
  getOrders: (clientId, contractId) =>
    `CALL GetOrders (${clientId}, ${contractId})`,
  getOrderComposition: (clientId, contractId, orderId) =>
    `CALL GetOrderComposition(${clientId}, ${contractId}, ${orderId})`,
  addContract: (login, clientId, startDate, endDate) =>
    `CALL AddContract ('${login}', ${clientId}, '${startDate}', '${endDate}')`,
  getPriceList: () => "SELECT * FROM PriceList",
  addSpecification: (clientId, productId, amount) =>
    `CALL AddSpecification(${clientId}, ${productId}, ${amount})`,
  setOrderStatus: (clientId, contractId, orderId, statusId) =>
    `CALL SetOrderStatus (${clientId}, ${contractId}, ${orderId}, ${statusId})`,
  setContractStatus: (clientId, contractId, statusId) =>
    `CALL SetContractStatus (${clientId}, ${contractId}, ${statusId})`,
  addPhysicalPersonClient: (INN, fullname, phone, address) =>
    `CALL addPhysicalPersonClient('${INN}', '${fullname}', '${phone}', '${address}')`,
  addJuridicalPersonClient: (INN, fullname, phone, address) =>
    `CALL addJuridicalPersonClient('${INN}', '${fullname}', '${phone}', '${address}')`,
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
  addOrder: (clientId, contractId) =>
    `CALL AddOrder('${clientId}', '${contractId}')`,
  addOrderComposition: (clientId, contractId, productId, amount) =>
    `CALL AddOrderComposition(${clientId}, ${contractId}, ${productId}, ${amount})`,
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
  getClients: () => `SELECT * FROM Clients`,
};
