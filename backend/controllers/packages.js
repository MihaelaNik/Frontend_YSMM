const db = require("../config/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.createPackages = async (req, res) => {
  const dbConnection = await db;
  const userId = req.session.userId;
  const userType = req.session.user_type;
  const username = req.session.username;
  const [dataMemo] = await dbConnection.query("SELECT * FROM memo");
  const [dataOffices] = await dbConnection.query(
    "SELECT * FROM offices ORDER by office_name"
  );
  const [dataCustomer] = await dbConnection.query(
    "SELECT * FROM clients ORDER by name"
  );
  const dataResponse = {
    userId: userId,
    userType: userType,
    username: username,
    dataMemo: dataMemo,
    dataOffices: dataOffices,
    dataCustomer: dataCustomer,
  };
  res.json(dataResponse);
};

exports.addPackages = async (req, res) => {
  const dbConnection = await db;
  const userId = req.session.userId;
  const userType = req.session.user_type;
  const username = req.session.username;
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const day = String(currentDate.getDate()).padStart(2, "0");
  const hours = String(currentDate.getHours()).padStart(2, "0");
  const minutes = String(currentDate.getMinutes()).padStart(2, "0");
  const seconds = String(currentDate.getSeconds()).padStart(2, "0");
  const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

  const {
    date_pack_start,
    sender_id,
    receiver_id,
    sender_office_id,
    receiver_office_id,
    description,
    weight,
    homeSender,
    homeReceiver,
  } = req.body;
  try {
    const [addedPackages] = await dbConnection.query(
      "INSERT INTO packages(create_at, update_at, date_pack_start, sender_id, receiver_id, sender_office_id, receiver_office_id, description, weight, homeSender, homeReceiver, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')",
      [
        formattedDate,
        formattedDate,
        date_pack_start,
        sender_id,
        receiver_id,
        sender_office_id,
        receiver_office_id,
        description,
        weight,
        homeSender,
        homeReceiver,
      ]
    );
    res.json({ id: addedPackages.insertId });
  } catch (err) {
    res.status(500).json({ error: "Database error, can't add Package." });
  }
};

exports.listPackages = async (req, res) => {
  const dbConnection = await db;
  const userId = req.session.userId;
  const userType = req.session.user_type;
  const username = req.session.username;
  let page = 1;
  let rowNumber = 0;
  let dtStart = new Date();
  let dtEnd = new Date();
  let strWhere = " 1=1 ";

  if (userType == "client") {
    strWhere =
      " (packages.sender_id= " +
      userId +
      " OR packages.receiver_id = " +
      userId +
      ") ";
  }
  if (req.body.page) {
    page = req.body.page;
    rowNumber = page * 20 - 20;
  }
  if (req.body.dtStart) {
    const date = new Date(req.body.dtStart);
    if (!isNaN(date.getTime())) {
      dtStart = date;
      strWhere = strWhere + " AND packages.date_pack_start>= " + dtStart;
    } else {
      return res.status(400).json({
        error: "Incorrect From Date.",
      });
    }
  }
  if (req.body.dtEnd) {
    const date = new Date(req.body.dtEnd);
    if (!isNaN(date.getTime())) {
      dtEnd = date;
      strWhere = strWhere + " AND packages.date_pack_start<= " + dtEnd;
    } else {
      return res.status(400).json({
        error: "Incorrect To Date",
      });
    }
  }

  let queryCout =
    "SELECT  COUNT(*) AS total " +
    "FROM packages WHERE " +
    strWhere +
    "ORDER BY packages.date_pack_start DESC  ";
  const [countRow] = await dbConnection.query(queryCout);
  const totalCount = countRow[0].total;
  const totalPages = Math.ceil(totalCount / 20);

  let queryTMP =
    "SELECT packages.id, packages.date_pack_start, " +
    "packages.sender_id, c_sender.username AS senderName, " +
    "c_sender.phone AS senderPhone, c_sender.country AS senderCountry, " +
    "c_sender.city AS senderCity, c_sender.address AS senderAddress, " +
    "packages.receiver_id, c_receiver.username AS receiverName, " +
    "c_receiver.phone AS receiverPhone, c_receiver.country AS receiverCountry, " +
    "c_receiver.city AS receiverCity, c_receiver.address AS receiverAddress, " +
    "packages.sender_office_id, o_sender.office_name AS senderOffice," +
    "packages.receiver_office_id, o_receiver.office_name AS receiverOffice, " +
    "packages.description, packages.weight, " +
    "packages.homeSender, packages.homeReceiver, packages.status " +
    "FROM packages LEFT JOIN clients AS c_sender ON packages.sender_id = c_sender.id " +
    "LEFT JOIN clients AS c_receiver ON packages.receiver_id = c_receiver.id " +
    "LEFT JOIN offices AS o_sender ON packages.sender_office_id = o_sender.id " +
    "LEFT JOIN offices AS o_receiver ON packages.receiver_office_id = o_receiver.id " +
    "WHERE " +
    strWhere +
    "ORDER BY date_pack_start DESC LIMIT 20 OFFSET ? ";

  const [listPackages] = await dbConnection.query(queryTMP, [rowNumber]);

  res.json({
    userId: userId,
    dtStart: dtStart,
    dtEnd: dtEnd,
    page: page,
    totalPages: totalPages,
    listPackages: listPackages,
  });
};

exports.listPackagesEmployees = async (req, res) => {
  const dbConnection = await db;
  const userId = req.session.userId;
  const userType = req.session.user_type;
  const username = req.session.username;
  let page = 1;
  let rowNumber = 0;
  let dtStart = new Date();
  let dtEnd = new Date();
  let strWhere = " 1=0 ";
  let employeesId = 0;
  const [rowsEmployees] = await dbConnection.query(
    "SELECT * FROM users WHERE user_type = 'employee' ORDER BY name"
  );

  if (req.body.employeesId) {
    employeesId = req.body.employeesId;
    strWhere = " packages.user_id=" + req.body.employeesId + " ";
  }

  if (req.body.page) {
    page = req.body.page;
    rowNumber = page * 20 - 20;
  }
  if (req.body.dtStart) {
    const date = new Date(req.body.dtStart);
    if (!isNaN(date.getTime())) {
      dtStart = date;
      strWhere = strWhere + " AND packages.date_pack_start>= " + dtStart + " ";
    } else {
      return res.status(400).json({
        error: "Incorrect From Date.",
      });
    }
  }
  if (req.body.dtEnd) {
    const date = new Date(req.body.dtEnd);
    if (!isNaN(date.getTime())) {
      dtEnd = date;
      strWhere = strWhere + " AND packages.date_pack_start<= " + dtEnd + " ";
    } else {
      return res.status(400).json({
        error: "Incorrect To Date",
      });
    }
  }

  let queryCout =
    "SELECT  COUNT(*) AS total " +
    "FROM packages WHERE " +
    strWhere +
    "ORDER BY packages.date_pack_start DESC  ";
  const [countRow] = await dbConnection.query(queryCout);
  const totalCount = countRow[0].total;
  const totalPages = Math.ceil(totalCount / 20);

  let queryTMP =
    "SELECT packages.id, packages.date_pack_start, " +
    "packages.sender_id, c_sender.username AS senderName," +
    "packages.receiver_id, c_receiver.username AS receiverName, " +
    "packages.sender_office_id, o_sender.office_name AS senderOffice," +
    "packages.receiver_office_id, o_receiver.office_name AS receiverOffice, " +
    "packages.description, packages.weight, " +
    "packages.homeSender, packages.homeReceiver, packages.status " +
    "FROM packages LEFT JOIN clients AS c_sender ON packages.sender_id = c_sender.id " +
    "LEFT JOIN clients AS c_receiver ON packages.receiver_id = c_receiver.id " +
    "LEFT JOIN offices AS o_sender ON packages.sender_office_id = o_sender.id " +
    "LEFT JOIN offices AS o_receiver ON packages.receiver_office_id = o_receiver.id " +
    "WHERE " +
    strWhere +
    "ORDER BY date_pack_start DESC LIMIT 20 OFFSET ? ";

  const [listPackages] = await dbConnection.query(queryTMP, [rowNumber]);

  res.json({
    rowsEmployees: rowsEmployees,
    employeesId: employeesId,
    userId: userId,
    dtStart: dtStart,
    dtEnd: dtEnd,
    page: page,
    totalPages: totalPages,
    listPackages: listPackages,
  });
};

exports.packageStatus = async (req, res) => {
  const dbConnection = await db;
  const userId = req.session.userId;
  const userType = req.session.user_type;
  const username = req.session.username;

  if (!req.body.packageId) {
    return res.status(400).json({ error: "Missing Package ID!" });
  }
  if (!req.body.status) {
    return res.status(400).json({ error: "Missing Status!" });
  }
  try {
    const [result] = await dbConnection.query(
      "UPDATE packages SET status = ? WHERE id = ?",
      [req.body.status, req.body.packageId]
    );
    return res.status(200).json({ massege: "Status was updated!" });
  } catch (err) {
    res.status(500).json({ error: "Database error, Status was not updated!" });
  }
};

exports.listPackagesTransit = async (req, res) => {
  const dbConnection = await db;
  const userId = req.session.userId;
  const userType = req.session.user_type;
  const username = req.session.username;
  let page = 1;
  let rowNumber = 0;
  let dtStart = new Date();
  let dtEnd = new Date();
  strWhere = " packages.status = 'in_transit' ";

  if (req.body.page) {
    page = req.body.page;
    rowNumber = page * 20 - 20;
  }
  if (req.body.dtStart) {
    const date = new Date(req.body.dtStart);
    if (!isNaN(date.getTime())) {
      dtStart = date;
      strWhere = strWhere + " AND packages.date_pack_start>= " + dtStart + " ";
    } else {
      return res.status(400).json({
        error: "Incorrect From Date.",
      });
    }
  }
  if (req.body.dtEnd) {
    const date = new Date(req.body.dtEnd);
    if (!isNaN(date.getTime())) {
      dtEnd = date;
      strWhere = strWhere + " AND packages.date_pack_start<= " + dtEnd + " ";
    } else {
      return res.status(400).json({
        error: "Incorrect To Date",
      });
    }
  }

  let queryCout =
    "SELECT  COUNT(*) AS total " +
    "FROM packages WHERE " +
    strWhere +
    "ORDER BY packages.date_pack_start DESC  ";
  const [countRow] = await dbConnection.query(queryCout);
  const totalCount = countRow[0].total;
  const totalPages = Math.ceil(totalCount / 20);

  let queryTMP =
    "SELECT packages.id, packages.date_pack_start, " +
    "packages.sender_id, c_sender.username AS senderName, " +
    "c_sender.phone AS senderPhone, c_sender.country AS senderCountry, " +
    "c_sender.city AS senderCity, c_sender.address AS senderAddress, " +
    "packages.receiver_id, c_receiver.username AS receiverName, " +
    "c_receiver.phone AS receiverPhone, c_receiver.country AS receiverCountry, " +
    "c_receiver.city AS receiverCity, c_receiver.address AS receiverAddress, " +
    "packages.sender_office_id, o_sender.office_name AS senderOffice," +
    "packages.receiver_office_id, o_receiver.office_name AS receiverOffice, " +
    "packages.description, packages.weight, " +
    "packages.homeSender, packages.homeReceiver, packages.status " +
    "FROM packages LEFT JOIN clients AS c_sender ON packages.sender_id = c_sender.id " +
    "LEFT JOIN clients AS c_receiver ON packages.receiver_id = c_receiver.id " +
    "LEFT JOIN offices AS o_sender ON packages.sender_office_id = o_sender.id " +
    "LEFT JOIN offices AS o_receiver ON packages.receiver_office_id = o_receiver.id " +
    "WHERE " +
    strWhere +
    "ORDER BY date_pack_start DESC LIMIT 20 OFFSET ? ";

  const [listPackages] = await dbConnection.query(queryTMP, [rowNumber]);

  res.json({
    userId: userId,
    dtStart: dtStart,
    dtEnd: dtEnd,
    page: page,
    totalPages: totalPages,
    listPackages: listPackages,
  });
};

exports.listSentPackages = async (req, res) => {
  const dbConnection = await db;
  const userId = req.session.userId;
  const userType = req.session.user_type;
  const username = req.session.username;
  let page = 1;
  let rowNumber = 0;
  let dtStart = new Date();
  let dtEnd = new Date();
  let strWhere = " 1=0 ";
  let clientId = 0;

  const [dataClients] = await dbConnection.query(
    "SELECT * FROM clients ORDER BY name"
  );
  if (req.body.clientId) {
    clientId = req.body.clientId;
    strWhere = " packages.sender_id= " + clientId + " ";
  }
  if (req.body.page) {
    page = req.body.page;
    rowNumber = page * 20 - 20;
  }
  if (req.body.dtStart) {
    const date = new Date(req.body.dtStart);
    if (!isNaN(date.getTime())) {
      dtStart = date;
      strWhere = strWhere + " AND packages.date_pack_start>= " + dtStart;
    } else {
      return res.status(400).json({
        error: "Incorrect From Date.",
      });
    }
  }
  if (req.body.dtEnd) {
    const date = new Date(req.body.dtEnd);
    if (!isNaN(date.getTime())) {
      dtEnd = date;
      strWhere = strWhere + " AND packages.date_pack_start<= " + dtEnd;
    } else {
      return res.status(400).json({
        error: "Incorrect To Date",
      });
    }
  }

  let queryCout =
    "SELECT  COUNT(*) AS total " +
    "FROM packages WHERE " +
    strWhere +
    "ORDER BY packages.date_pack_start DESC  ";
  const [countRow] = await dbConnection.query(queryCout);
  const totalCount = countRow[0].total;
  const totalPages = Math.ceil(totalCount / 20);

  let queryTMP =
    "SELECT packages.id, packages.date_pack_start, " +
    "packages.sender_id, c_sender.username AS senderName, " +
    "c_sender.phone AS senderPhone, c_sender.country AS senderCountry, " +
    "c_sender.city AS senderCity, c_sender.address AS senderAddress, " +
    "packages.receiver_id, c_receiver.username AS receiverName, " +
    "c_receiver.phone AS receiverPhone, c_receiver.country AS receiverCountry, " +
    "c_receiver.city AS receiverCity, c_receiver.address AS receiverAddress, " +
    "packages.sender_office_id, o_sender.office_name AS senderOffice," +
    "packages.receiver_office_id, o_receiver.office_name AS receiverOffice, " +
    "packages.description, packages.weight, " +
    "packages.homeSender, packages.homeReceiver, packages.status " +
    "FROM packages LEFT JOIN clients AS c_sender ON packages.sender_id = c_sender.id " +
    "LEFT JOIN clients AS c_receiver ON packages.receiver_id = c_receiver.id " +
    "LEFT JOIN offices AS o_sender ON packages.sender_office_id = o_sender.id " +
    "LEFT JOIN offices AS o_receiver ON packages.receiver_office_id = o_receiver.id " +
    "WHERE " +
    strWhere +
    "ORDER BY date_pack_start DESC LIMIT 20 OFFSET ? ";

  const [listPackages] = await dbConnection.query(queryTMP, [rowNumber]);

  res.json({
    dataClients: dataClients,
    clientId: clientId,
    userId: userId,
    dtStart: dtStart,
    dtEnd: dtEnd,
    page: page,
    totalPages: totalPages,
    listPackages: listPackages,
  });
};

exports.listReceiverPackages = async (req, res) => {
  const dbConnection = await db;
  const userId = req.session.userId;
  const userType = req.session.user_type;
  const username = req.session.username;
  let page = 1;
  let rowNumber = 0;
  let dtStart = new Date();
  let dtEnd = new Date();
  let strWhere = " 1=0 ";
  let clientId = 0;

  const [dataClients] = await dbConnection.query(
    "SELECT * FROM clients ORDER BY name"
  );
  if (req.body.clientId) {
    clientId = req.body.clientId;
    strWhere = " packages.receiver_id= " + clientId + " ";
  }
  if (req.body.page) {
    page = req.body.page;
    rowNumber = page * 20 - 20;
  }
  if (req.body.dtStart) {
    const date = new Date(req.body.dtStart);
    if (!isNaN(date.getTime())) {
      dtStart = date;
      strWhere = strWhere + " AND packages.date_pack_start>= " + dtStart;
    } else {
      return res.status(400).json({
        error: "Incorrect From Date.",
      });
    }
  }
  if (req.body.dtEnd) {
    const date = new Date(req.body.dtEnd);
    if (!isNaN(date.getTime())) {
      dtEnd = date;
      strWhere = strWhere + " AND packages.date_pack_start<= " + dtEnd;
    } else {
      return res.status(400).json({
        error: "Incorrect To Date",
      });
    }
  }

  let queryCout =
    "SELECT  COUNT(*) AS total " +
    "FROM packages WHERE " +
    strWhere +
    "ORDER BY packages.date_pack_start DESC  ";
  const [countRow] = await dbConnection.query(queryCout);
  const totalCount = countRow[0].total;
  const totalPages = Math.ceil(totalCount / 20);

  let queryTMP =
    "SELECT packages.id, packages.date_pack_start, " +
    "packages.sender_id, c_sender.username AS senderName, " +
    "c_sender.phone AS senderPhone, c_sender.country AS senderCountry, " +
    "c_sender.city AS senderCity, c_sender.address AS senderAddress, " +
    "packages.receiver_id, c_receiver.username AS receiverName, " +
    "c_receiver.phone AS receiverPhone, c_receiver.country AS receiverCountry, " +
    "c_receiver.city AS receiverCity, c_receiver.address AS receiverAddress, " +
    "packages.sender_office_id, o_sender.office_name AS senderOffice," +
    "packages.receiver_office_id, o_receiver.office_name AS receiverOffice, " +
    "packages.description, packages.weight, " +
    "packages.homeSender, packages.homeReceiver, packages.status " +
    "FROM packages LEFT JOIN clients AS c_sender ON packages.sender_id = c_sender.id " +
    "LEFT JOIN clients AS c_receiver ON packages.receiver_id = c_receiver.id " +
    "LEFT JOIN offices AS o_sender ON packages.sender_office_id = o_sender.id " +
    "LEFT JOIN offices AS o_receiver ON packages.receiver_office_id = o_receiver.id " +
    "WHERE " +
    strWhere +
    "ORDER BY date_pack_start DESC LIMIT 20 OFFSET ? ";

  const [listPackages] = await dbConnection.query(queryTMP, [rowNumber]);

  res.json({
    dataClients: dataClients,
    clientId: clientId,
    userId: userId,
    dtStart: dtStart,
    dtEnd: dtEnd,
    page: page,
    totalPages: totalPages,
    listPackages: listPackages,
  });
};

exports.totalMoney = async (req, res) => {
  const dbConnection = await db;
  const userId = req.session.userId;
  const userType = req.session.user_type;
  const username = req.session.username;
  let dtStart = new Date();
  let dtEnd = new Date();
  let strWhere = "";
  let sumMoney = 0;

  if (req.body.dtStart) {
    const date = new Date(req.body.dtStart);
    if (!isNaN(date.getTime())) {
      dtStart = date;
      strWhere = strWhere + " AND packages.date_pack_start>= " + dtStart;
    } else {
      return res.status(400).json({
        error: "Incorrect From Date.",
      });
    }
  }
  if (req.body.dtEnd) {
    const date = new Date(req.body.dtEnd);
    if (!isNaN(date.getTime())) {
      dtEnd = date;
      strWhere = strWhere + " AND packages.date_pack_start<= " + dtEnd;
    } else {
      return res.status(400).json({
        error: "Incorrect To Date",
      });
    }
  }

  let queryTMP =
    "SELECT SUM(packages.weight * memo.pricePerKg ) AS amountPriceKG, " +
    "SUM(CASE WHEN packages.homeSender = 1 THEN 1 * memo.tax_home ELSE 0) AS sumHomeSender, " +
    "SUM(CASE WHEN packages.homeReceiver = 1 THEN 1 * memo.tax_home ELSE 0) AS sumHomeReceiver " +
    "FROM packages INNER JOIN memo WHERE packages.status = 'delivered' " +
    strWhere;

  const [dataTotal] = await dbConnection.query(queryTMP);
  if (dataTotal.length > 0) {
    sumMoney =
      dataTotal[0].amountPriceKG +
      dataTotal[0].sumHomeSender +
      dataTotal[0].sumHomeReceiver;
  }
  res.json({
    userId: userId,
    dtStart: dtStart,
    dtEnd: dtEnd,
    sumMoney: sumMoney,
  });
};
