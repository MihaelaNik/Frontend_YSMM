
// const dbPromise = require('../config/db');
// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcryptjs');
// const moment = require("moment");

// exports.createPackages = async (req, res) => {
//     const db = await db;
//     const userId = req.session.userId;
//     const userType = req.session.user_type;
//     const username = req.session.username;
//     const [dataMemo] = await db.query("SELECT * FROM memo");
//     const [dataOffices] = await db.query("SELECT * FROM offices ORDER by office_name");
//     const [dataClients] = await db.query("SELECT * FROM clients ORDER by name");
//     const dataResponse = {'userId': userId , 'userType': userType, 'username': username, 'dataMemo': dataMemo, 'dataOffices': dataOffices, 'dataClients': dataClients};
//     res.json(dataResponse);
// }

// exports.addPackages = async (req, res) => {
//     const db = await dbPromise;
//     // const userId = req.session.userId;
//     // const userType = req.session.user_type;
//     // const username = req.session.username;
//     // Get the current date
//     const currentDate = new Date();

//     // Format the date and time
//     const year = currentDate.getFullYear();
//     const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed, so add 1
//     const day = String(currentDate.getDate()).padStart(2, '0');
//     const hours = String(currentDate.getHours()).padStart(2, '0');
//     const minutes = String(currentDate.getMinutes()).padStart(2, '0');
//     const seconds = String(currentDate.getSeconds()).padStart(2, '0');

//     // Combine into the desired format
//     const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    
//     const {date_pack_start, sender_id, receiver_id, sender_office_id, receiver_office_id, description, weight, homeSender, homeReceiver, cash_delivery} = req.body;
//     try{
//         const [addedPackages] = await db.query(
//                     "INSERT INTO packages(created_at, updated_at, date_pack_start, sender_id, receiver_id, sender_office_id, receiver_office_id, description, weight, homeSender, homeReceiver, status, cash_delivery) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?)",
//                     [formattedDate, formattedDate, date_pack_start, sender_id, receiver_id, sender_office_id, receiver_office_id, description, weight, homeSender, homeReceiver, cash_delivery]
//                 );
//         res.json({id: addedPackages.insertId});
//     } catch(err) {
//         res.status(500).json({error: "Database error, can't add Package."});
//     }      
// }

// exports.listPackages = async (req,res) => {
//     const db = await dbPromise;
//     const userId = req.session.userId;
//     const userType = req.session.user_type;
//     // const username = req.session.username;
//     let page = 1;
//     let rowNumber = 0;
//     let dtStart = new Date();
//     let dtEnd = new Date();
//     let strWhere = " 1=0 ";
//     const dateConditions = [];
//     const queryParams = [];

//     if(userType=='client'){
//         strWhere=" (packages.sender_id= " + userId + " OR packages.receiver_id = " + userId + ") ";
//     }
//     if (req.body.page) {
//         page = req.body.page;
//         rowNumber = page * 20 - 20;
//     }
//     if (req.body.dtStart) {
//         const date = new Date(req.body.dtStart);
//             if (!isNaN(date.getTime())) {
//                 dtStart = date;
//                 strWhere = strWhere + " AND packages.date_pack_start>= " + dtStart;
//             }else {
//                 return res.status(400).json({
//                 error: "Incorrect From Date."
//             });
//         }
//     }
//     if (req.body.dtEnd) {
//         const date = new Date(req.body.dtEnd);
//         if (!isNaN(date.getTime())) {
//             dtEnd = date;
//             strWhere=strWhere + " AND packages.date_pack_start<= " + dtEnd;
//         } else {
//             return res.status(400).json({
//                 error: "Incorrect To Date"
//             });
//         }
//     } 

//     let queryCout = "SELECT  COUNT(*) AS total " +
//                     "FROM packages WHERE " + strWhere +
//                     "ORDER BY packages.date_pack_start DESC  "; 
//     const [countRow] = await db.query(queryCout); 
//     const totalCount = countRow[0].total;
//     const totalPages = Math.ceil(totalCount / 20);

//     let queryTMP = "SELECT packages.id, packages.date_pack_start, " +
//                         "packages.sender_id, c_sender.username AS senderName, " +
//                         "c_sender.phone AS senderPhone, c_sender.country AS senderCountry, " +
//                         "c_sender.city AS senderCity, c_sender.address AS senderAddress, " + //till here sender address
//                         "packages.receiver_id, c_receiver.username AS receiverName, " +
//                         "c_receiver.phone AS receiverPhone, c_receiver.country AS receiverCountry, " +
//                         "c_receiver.city AS receiverCity, c_receiver.address AS receiverAddress, " + // till here receiver address 
//                         "packages.sender_office_id, o_sender.office_name AS senderOffice," +
//                         "packages.receiver_office_id, o_receiver.office_name AS receiverOffice, " +
//                         "packages.description, packages.weight, " +
//                         "packages.homeSender, packages.homeReceiver, packages.status " +
//                     "FROM packages LEFT JOIN clients AS c_sender ON packages.sender_id = c_sender.id " + 
//                     "LEFT JOIN clients AS c_receiver ON packages.receiver_id = c_receiver.id " +
//                     "LEFT JOIN offices AS o_sender ON packages.sender_office_id = o_sender.id " +
//                     "LEFT JOIN offices AS o_receiver ON packages.receiver_office_id = o_receiver.id " +
//                     "WHERE " + strWhere +
//                     "ORDER BY date_pack_start DESC LIMIT 20 OFFSET ? "; 

//     const [listPackages] = await db.query(queryTMP, [rowNumber]); 

//     res.json({userId: userId, dtStart: dtStart, dtEnd: dtEnd, page: page, totalPages: totalPages, listPackages: listPackages});
// }

// exports.listPackagesEmployees = async (req,res) => {
//     const db = await dbPromise;
//     const userId = req.session.userId;
//     // const userType = req.session.user_type;
//     // const username = req.session.username;
//     let page = 1;
//     let rowNumber = 0;
//     let dtStart = new Date();
//     let dtEnd = new Date();
//     let strWhere = " 1=0 ";
//     let employeesId=0;
//     const [rowsEmployees] = await db.query("SELECT * FROM users WHERE user_type = 'employee' ORDER BY name");

//     if (req.body.employeesId) {
//         employeesId=req.body.employeesId;
//         strWhere=" packages.user_id=" + req.body.employeesId + " ";
//     }

    
//     if (req.body.page) {
//         page = req.body.page;
//         rowNumber = page * 20 - 20;
//     }
//     if (req.body.dtStart) {
//         const date = new Date(req.body.dtStart);
//         if (!isNaN(date.getTime())) {
//             dtStart = date;
//             strWhere = strWhere + " AND packages.date_pack_start >= " + dtStart;
//         } else {
//             return res.status(400).json({
//                 error: "Incorrect From Date."
//             });
//         }
//     }
//     if (req.body.dtEnd) {
//         const date = new Date(req.body.dtEnd);
//         if (!isNaN(date.getTime())) {
//             dtEnd = date;
//             strWhere = strWhere + " AND packages.date_pack_start<= " + dtEnd  + " ";
//         } else {
//             return res.status(400).json({
//                 error: "Incorrect To Date"
//             });
//         }
//     } 

//     let queryCout = "SELECT  COUNT(*) AS total " +
//                     "FROM packages WHERE " + strWhere +
//                     "ORDER BY packages.date_pack_start DESC  "; 
//     const [countRow] = await db.query(queryCout); 
//     const totalCount = countRow[0].total;
//     const totalPages = Math.ceil(totalCount / 20);

//     let queryTMP = "SELECT packages.id, packages.date_pack_start, " +
//                         "packages.sender_id, c_sender.username AS senderName," +
//                         "packages.receiver_id, c_receiver.username AS receiverName, " + 
//                         "packages.sender_office_id, o_sender.office_name AS senderOffice," +
//                         "packages.receiver_office_id, o_receiver.office_name AS receiverOffice, " +
//                         "packages.description, packages.weight, " +
//                         "packages.homeSender, packages.homeReceiver, packages.status " +
//                     "FROM packages LEFT JOIN clients AS c_sender ON packages.sender_id = c_sender.id " + 
//                     "LEFT JOIN clients AS c_receiver ON packages.receiver_id = c_receiver.id " +
//                     "LEFT JOIN offices AS o_sender ON packages.sender_office_id = o_sender.id " +
//                     "LEFT JOIN offices AS o_receiver ON packages.receiver_office_id = o_receiver.id " +
//                     "WHERE " + strWhere +
//                     "ORDER BY date_pack_start DESC LIMIT 20 OFFSET ? "; 

//     const [listPackages] = await db.query(queryTMP, [rowNumber]); 

//     res.json({rowsEmployees: rowsEmployees, employeesId: employeesId, userId: userId, dtStart: dtStart, dtEnd: dtEnd, page: page, totalPages: totalPages, listPackages: listPackages});
// }
// exports.packageStatus = async (req,res) => {
//     const db = await dbPromise;
//     // const userId = req.session.userId;
//     // const userType = req.session.user_type;
//     // const username = req.session.username; 
    
//     if (!req.body.packageId) {
//         return res.status(400).json({error: "Missing Package ID!"});
//     }
//     if (!req.body.status) {
//         return res.status(400).json({error: "Missing Status!"});
//     }
//     try{
//         const [result] = await db.query(
//             "UPDATE packages SET status = ? WHERE id = ?", [req.body.status, req.body.packageId]);
//             return res.status(200).json({massege: "Status was updated!"});
//     }catch(err) {
//         res.status(500).json({error: "Database error, Status was not updated!"});
//     }
// }

// exports.listPackagesTransit = async (req,res) => {
//     const db = await dbPromise;
//     const userId = req.session.userId;
//     // const userType = req.session.user_type;
//     // const username = req.session.username;
//     let page = 1;
//     let rowNumber = 0;
//     let dtStart = new Date();
//     let dtEnd = new Date();
//     strWhere=" packages.status = 'in_transit' ";
        
//     if (req.body.page) {
//         page = req.body.page;
//         rowNumber = page * 20 - 20;
//     }
//     if (req.body.dtStart) {
//         const date = new Date(req.body.dtStart);
//         if (!isNaN(date.getTime())) {
//             dtStart = date;
//             strWhere = strWhere + " AND packages.date_pack_start >= " + dtStart;
//         } else {
//             return res.status(400).json({
//                 error: "Incorrect From Date."
//             });
//         }
//     }
//     if (req.body.dtEnd) {
//         const date = new Date(req.body.dtEnd);
//         if (!isNaN(date.getTime())) {
//             dtEnd = date;
//             strWhere=strWhere + " AND packages.date_pack_start<= " + dtEnd  + " ";
//         } else {
//             return res.status(400).json({
//                 error: "Incorrect To Date"
//             });
//         }
//     } 

//     let queryCout = "SELECT  COUNT(*) AS total " +
//                     "FROM packages WHERE " + strWhere +
//                     "ORDER BY packages.date_pack_start DESC  "; 
//     const [countRow] = await db.query(queryCout); 
//     const totalCount = countRow[0].total;
//     const totalPages = Math.ceil(totalCount / 20);

//     let queryTMP = "SELECT packages.id, packages.date_pack_start, " +
//                        "packages.sender_id, c_sender.username AS senderName, " +
//                         "c_sender.phone AS senderPhone, c_sender.country AS senderCountry, " +
//                         "c_sender.city AS senderCity, c_sender.address AS senderAddress, " + //till here sender address
//                         "packages.receiver_id, c_receiver.username AS receiverName, " +
//                         "c_receiver.phone AS receiverPhone, c_receiver.country AS receiverCountry, " +
//                         "c_receiver.city AS receiverCity, c_receiver.address AS receiverAddress, " + // till here receiver address 
//                         "packages.sender_office_id, o_sender.office_name AS senderOffice," +
//                         "packages.receiver_office_id, o_receiver.office_name AS receiverOffice, " +
//                         "packages.description, packages.weight, " +
//                         "packages.homeSender, packages.homeReceiver, packages.status " +
//                     "FROM packages LEFT JOIN clients AS c_sender ON packages.sender_id = c_sender.id " + 
//                     "LEFT JOIN clients AS c_receiver ON packages.receiver_id = c_receiver.id " +
//                     "LEFT JOIN offices AS o_sender ON packages.sender_office_id = o_sender.id " +
//                     "LEFT JOIN offices AS o_receiver ON packages.receiver_office_id = o_receiver.id " +
//                     "WHERE " + strWhere +
//                     "ORDER BY date_pack_start DESC LIMIT 20 OFFSET ? "; 

//     const [listPackages] = await db.query(queryTMP, [rowNumber]); 

//     res.json({userId: userId, dtStart: dtStart, dtEnd: dtEnd, page: page, totalPages: totalPages, listPackages: listPackages});
// }

// exports.listSentPackages = async (req,res) => {
//     const db = await dbPromise;
//     const userId = req.session.userId;
//     // const userType = req.session.user_type;
//     // const username = req.session.username;
//     let page = 1;
//     let rowNumber = 0;
//     let dtStart = new Date();
//     let dtEnd = new Date();
//     let strWhere = " 1=0 ";
//     let clientId = 0;

//     const [dataClients] = await db.query("SELECT * FROM clients ORDER BY name");
//     if (req.body.clientId) {
//         clientId=req.body.clientId;
//         strWhere=" packages.sender_id= " + clientId + " ";
//     }
//     if (req.body.page) {
//         page = req.body.page;
//         rowNumber = page * 20 - 20;
//     }
//     if (req.body.dtStart) {
//         const date = new Date(req.body.dtStart);
//         if (!isNaN(date.getTime())) {
//             dtStart = date;
//             strWhere=strWhere + " AND packages.date_pack_start>= " + dtStart ;
//         } else {
//             return res.status(400).json({
//                 error: "Incorrect From Date."
//             });
//         }
//     }
//     if (req.body.dtEnd) {
//         const date = new Date(req.body.dtEnd);
//         if (!isNaN(date.getTime())) {
//             dtEnd = date;
//             strWhere=strWhere + " AND packages.date_pack_start<= " + dtEnd ;
//         } else {
//             return res.status(400).json({
//                 error: "Incorrect To Date"
//             });
//         }
//     } 

//     let queryCout = "SELECT  COUNT(*) AS total " +
//                     "FROM packages WHERE " + strWhere +
//                     "ORDER BY packages.date_pack_start DESC  "; 
//     const [countRow] = await db.query(queryCout); 
//     const totalCount = countRow[0].total;
//     const totalPages = Math.ceil(totalCount / 20);

//     let queryTMP = "SELECT packages.id, packages.date_pack_start, " +
//                         "packages.sender_id, c_sender.username AS senderName, " +
//                         "c_sender.phone AS senderPhone, c_sender.country AS senderCountry, " +
//                         "c_sender.city AS senderCity, c_sender.address AS senderAddress, " + //till here sender address
//                         "packages.receiver_id, c_receiver.username AS receiverName, " +
//                         "c_receiver.phone AS receiverPhone, c_receiver.country AS receiverCountry, " +
//                         "c_receiver.city AS receiverCity, c_receiver.address AS receiverAddress, " + // till here receiver address 
//                         "packages.sender_office_id, o_sender.office_name AS senderOffice," +
//                         "packages.receiver_office_id, o_receiver.office_name AS receiverOffice, " +
//                         "packages.description, packages.weight, " +
//                         "packages.homeSender, packages.homeReceiver, packages.status " +
//                     "FROM packages LEFT JOIN clients AS c_sender ON packages.sender_id = c_sender.id " + 
//                     "LEFT JOIN clients AS c_receiver ON packages.receiver_id = c_receiver.id " +
//                     "LEFT JOIN offices AS o_sender ON packages.sender_office_id = o_sender.id " +
//                     "LEFT JOIN offices AS o_receiver ON packages.receiver_office_id = o_receiver.id " +
//                     "WHERE " + strWhere +
//                     "ORDER BY date_pack_start DESC LIMIT 20 OFFSET ? "; 

//     const [listPackages] = await db.query(queryTMP, [rowNumber]); 

//     res.json({dataClients: dataClients, clientId: clientId, userId: userId, dtStart: dtStart, dtEnd: dtEnd, page: page, totalPages: totalPages, listPackages: listPackages});
// }

// exports.listReceiverPackages = async (req,res) => {
//     const db = await dbPromise;
//     const userId = req.session.userId;
//     // const userType = req.session.user_type;
//     // const username = req.session.username;
//     let page = 1;
//     let rowNumber = 0;
//     let dtStart = new Date();
//     let dtEnd = new Date();
//     let strWhere = " 1=0 ";
//     let clientId = 0;

//     const [dataClients] = await db.query("SELECT * FROM clients ORDER BY name");
//     if (req.body.clientId) {
//         clientId=req.body.clientId;
//         strWhere = " packages.receiver_id= " + clientId;
//     }
//     if (req.body.page) {
//         page = req.body.page;
//         rowNumber = page * 20 - 20;
//     }
//     if (req.body.dtStart) {
//         const date = new Date(req.body.dtStart);
//         if (!isNaN(date.getTime())) {
//             dtStart = date;
//             strWhere=strWhere + " AND packages.date_pack_start>= " + dtStart;
//         } else {
//             return res.status(400).json({
//                 error: "Incorrect From Date."
//             });
//         }
//     }
//     if (req.body.dtEnd) {
//         const date = new Date(req.body.dtEnd);
//         if (!isNaN(date.getTime())) {
//             dtEnd = date;
//             strWhere=strWhere + " AND packages.date_pack_start<= " + dtEnd ;
//         } else {
//             return res.status(400).json({
//                 error: "Incorrect To Date"
//             });
//         }
//     } 

//     let queryCout = "SELECT  COUNT(*) AS total " +
//                     "FROM packages WHERE " + strWhere +
//                     "ORDER BY packages.date_pack_start DESC  "; 
//     const [countRow] = await db.query(queryCout); 
//     const totalCount = countRow[0].total;
//     const totalPages = Math.ceil(totalCount / 20);

//     let queryTMP = "SELECT packages.id, packages.date_pack_start, " +
//                         "packages.sender_id, c_sender.username AS senderName, " +
//                         "c_sender.phone AS senderPhone, c_sender.country AS senderCountry, " +
//                         "c_sender.city AS senderCity, c_sender.address AS senderAddress, " + //till here sender address
//                         "packages.receiver_id, c_receiver.username AS receiverName, " +
//                         "c_receiver.phone AS receiverPhone, c_receiver.country AS receiverCountry, " +
//                         "c_receiver.city AS receiverCity, c_receiver.address AS receiverAddress, " + // till here receiver address
//                         "packages.sender_office_id, o_sender.office_name AS senderOffice," +
//                         "packages.receiver_office_id, o_receiver.office_name AS receiverOffice, " +
//                         "packages.description, packages.weight, " +
//                         "packages.homeSender, packages.homeReceiver, packages.status " +
//                     "FROM packages LEFT JOIN clients AS c_sender ON packages.sender_id = c_sender.id " + 
//                     "LEFT JOIN clients AS c_receiver ON packages.receiver_id = c_receiver.id " +
//                     "LEFT JOIN offices AS o_sender ON packages.sender_office_id = o_sender.id " +
//                     "LEFT JOIN offices AS o_receiver ON packages.receiver_office_id = o_receiver.id " +
//                     "WHERE " + strWhere +
//                     "ORDER BY date_pack_start DESC LIMIT 20 OFFSET ? ";

//     const [listPackages] = await db.query(queryTMP, [rowNumber]); 

//     res.json({dataClients: dataClients, clientId: clientId, userId: userId, dtStart: dtStart, dtEnd: dtEnd, page: page, totalPages: totalPages, listPackages: listPackages});
// }

// exports.totalMoney = async (req,res) => {
//     const db = await dbPromise;
//     const userId = req.session.userId;
//     // const userType = req.session.user_type;
//     // const username = req.session.username;
//     let dtStart = new Date();
//     let dtEnd = new Date();
//     let strWhere = "";
//     let sumMoney = 0;

//     if (req.body.dtStart) {
//         const date = new Date(req.body.dtStart);
//         if (!isNaN(date.getTime())) {
//             dtStart = date;
//             strWhere=strWhere + " AND packages.date_pack_start>= " + dtStart;
//         } else {
//             return res.status(400).json({
//                 error: "Incorrect From Date."
//             });
//         }
//     }
//     if (req.body.dtEnd) {
//         const date = new Date(req.body.dtEnd);
//         if (!isNaN(date.getTime())) {
//             dtEnd = date;
//             strWhere=strWhere + " AND packages.date_pack_start<= " + dtEnd;
//         } else {
//             return res.status(400).json({
//                 error: "Incorrect To Date"
//             });
//         }
//     } 

//     let queryTMP = "SELECT SUM(packages.weight * memo.pricePerKg ) AS amountPriceKG, " +
//                     "SUM(CASE WHEN packages.homeSender = 1 THEN 1 * memo.tax_home ELSE 0) AS sumHomeSender, " +
//                     "SUM(CASE WHEN packages.homeReceiver = 1 THEN 1 * memo.tax_home ELSE 0) AS sumHomeReceiver " +
//                     "FROM packages INNER JOIN memo WHERE packages.status = 'delivered' " + strWhere;

//     const [dataTotal] = await db.query(queryTMP);
//     if (dataTotal.length > 0) {
//     sumMoney = dataTotal[0].amountPriceKG + dataTotal[0]. sumHomeSender + dataTotal[0].sumHomeReceiver;
//     }
//     res.json({ userId: userId, dtStart: dtStart, dtEnd: dtEnd, sumMoney: sumMoney});
// }

// exports.singlePackageMoney = async (req,res) => {
//     const db = await dbPromise;
//     const userId = req.session.userId;
//     const id_pack = req.body.id;
//     let sumMoney = 0;
//     let packageStatus = "";

//     let queryTMP = "SELECT SUM(packages.weight * memo.pricePerKg ) AS amountPriceKG, " +
//                     "SUM(CASE WHEN packages.homeSender = 1 THEN 1 * memo.tax_home ELSE 0) AS sumHomeSender, " +
//                     "SUM(CASE WHEN packages.homeReceiver = 1 THEN 1 * memo.tax_home ELSE 0) AS sumHomeReceiver, packages.status " +
//                     "FROM packages INNER JOIN memo WHERE packages.id = ? ";

//     const [dataTotal] = await db.query(queryTMP, [id_pack]);
//     if (dataTotal.length > 0) {
//     sumMoney = dataTotal[0].amountPriceKG + dataTotal[0]. sumHomeSender + dataTotal[0].sumHomeReceiver;
//     packageStatus = dataTotal[0].status; 
//     }
//     res.json({ userId: userId, sumMoney: sumMoney, packageStatus:packageStatus});
//   }
















const dbPromise = require("../config/db");

function toDateOnly(value) {
  // expects "YYYY-MM-DD" from frontend inputs
  // MySQL DATE works well with this format
  return value;
}

exports.createPackages = async (req, res) => {
  try {
    const db = await dbPromise;

    const userId = req.session.userId;
    const userType = req.session.user_type;
    const username = req.session.username;

    const [dataMemo] = await db.query("SELECT * FROM memo");
    const [dataOffices] = await db.query("SELECT * FROM offices ORDER BY office_name");
    const [dataCustomer] = await db.query("SELECT * FROM clients ORDER BY name");

    res.json({
      userId,
      userType,
      username,
      dataMemo,
      dataOffices,
      dataCustomer,
    });
  } catch (err) {
    console.error("createPackages error:", err);
    res.status(500).json({ error: err.message || "Server error" });
  }
};

exports.addPackages = async (req, res) => {
  try {
    const db = await dbPromise;

    const userId = req.session.userId; // employee who creates the package

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
      cash_delivery,
    } = req.body;

    if (!userId) return res.status(401).json({ error: "Not logged in." });

    // basic validation
    if (!date_pack_start || !sender_id || !receiver_id || !sender_office_id) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    const [result] = await db.query(
      `
      INSERT INTO packages
        (user_id, date_pack_start, sender_id, receiver_id, sender_office_id, receiver_office_id,
         description, weight, homeSender, homeReceiver, status, cash_delivery)
      VALUES
        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?)
      `,
      [
        userId,
        toDateOnly(date_pack_start),
        sender_id,
        receiver_id,
        sender_office_id,
        receiver_office_id || 0,
        description || null,
        weight,
        homeSender ? 1 : 0,
        homeReceiver ? 1 : 0,
        cash_delivery ? 1 : 0,
      ]
    );

    res.json({ id: result.insertId });
  } catch (err) {
    console.error("addPackages error:", err);
    res.status(500).json({ error: err.message || "Database error, can't add Package." });
  }
};

exports.listPackages = async (req, res) => {
  try {
    const db = await dbPromise;

    const userId = req.session.userId;
    const userType = req.session.user_type;

    let page = Number(req.body.page || 1);
    if (!page || page < 1) page = 1;

    const limit = 20;
    const offset = (page - 1) * limit;

    const where = [];
    const params = [];

    // clients see only packages where they are sender or receiver
    if (userType === "client") {
      where.push("(packages.sender_id = ? OR packages.receiver_id = ?)");
      params.push(userId, userId);
    } else {
      where.push("1=1");
    }

    if (req.body.dtStart) {
      where.push("packages.date_pack_start >= ?");
      params.push(toDateOnly(req.body.dtStart));
    }

    if (req.body.dtEnd) {
      where.push("packages.date_pack_start <= ?");
      params.push(toDateOnly(req.body.dtEnd));
    }

    const whereSql = where.join(" AND ");

    const [[countRow]] = await db.query(
      `SELECT COUNT(*) AS total FROM packages WHERE ${whereSql}`,
      params
    );

    const totalCount = countRow.total;
    const totalPages = Math.ceil(totalCount / limit);

    const [listPackages] = await db.query(
      `
      SELECT
        packages.id,
        packages.date_pack_start,
        packages.sender_id,
        c_sender.name AS senderName,
        c_sender.phone AS senderPhone,
        c_sender.country AS senderCountry,
        c_sender.city AS senderCity,
        c_sender.address AS senderAddress,

        packages.receiver_id,
        c_receiver.name AS receiverName,
        c_receiver.phone AS receiverPhone,
        c_receiver.country AS receiverCountry,
        c_receiver.city AS receiverCity,
        c_receiver.address AS receiverAddress,

        packages.sender_office_id,
        o_sender.office_name AS senderOffice,

        packages.receiver_office_id,
        o_receiver.office_name AS receiverOffice,

        packages.description,
        packages.weight,
        packages.homeSender,
        packages.homeReceiver,
        packages.status
      FROM packages
      LEFT JOIN clients AS c_sender ON packages.sender_id = c_sender.id
      LEFT JOIN clients AS c_receiver ON packages.receiver_id = c_receiver.id
      LEFT JOIN offices AS o_sender ON packages.sender_office_id = o_sender.id
      LEFT JOIN offices AS o_receiver ON packages.receiver_office_id = o_receiver.id
      WHERE ${whereSql}
      ORDER BY packages.date_pack_start DESC
      LIMIT ? OFFSET ?
      `,
      [...params, limit, offset]
    );

    res.json({
      userId,
      page,
      totalPages,
      listPackages,
    });
  } catch (err) {
    console.error("listPackages error:", err);
    res.status(500).json({ error: err.message || "Server error" });
  }
};

exports.listPackagesEmployees = async (req, res) => {
  try {
    const db = await dbPromise;

    let page = Number(req.body.page || 1);
    if (!page || page < 1) page = 1;

    const limit = 20;
    const offset = (page - 1) * limit;

    const employeesId = Number(req.body.employeesId || 0);

    const where = [];
    const params = [];

    if (employeesId > 0) {
      where.push("packages.user_id = ?");
      params.push(employeesId);
    } else {
      // if no employee selected, return empty list (same logic you had with 1=0)
      where.push("1=0");
    }

    if (req.body.dtStart) {
      where.push("packages.date_pack_start >= ?");
      params.push(toDateOnly(req.body.dtStart));
    }

    if (req.body.dtEnd) {
      where.push("packages.date_pack_start <= ?");
      params.push(toDateOnly(req.body.dtEnd));
    }

    const whereSql = where.join(" AND ");

    const [rowsEmployees] = await db.query(
      "SELECT id, username, first_name, last_name, email FROM users WHERE user_type='employee' ORDER BY first_name"
    );

    const [[countRow]] = await db.query(
      `SELECT COUNT(*) AS total FROM packages WHERE ${whereSql}`,
      params
    );

    const totalPages = Math.ceil(countRow.total / limit);

    const [listPackages] = await db.query(
      `
      SELECT
        packages.id,
        packages.date_pack_start,
        packages.sender_id,
        c_sender.name AS senderName,
        packages.receiver_id,
        c_receiver.name AS receiverName,
        packages.sender_office_id,
        o_sender.office_name AS senderOffice,
        packages.receiver_office_id,
        o_receiver.office_name AS receiverOffice,
        packages.description,
        packages.weight,
        packages.homeSender,
        packages.homeReceiver,
        packages.status
      FROM packages
      LEFT JOIN clients AS c_sender ON packages.sender_id = c_sender.id
      LEFT JOIN clients AS c_receiver ON packages.receiver_id = c_receiver.id
      LEFT JOIN offices AS o_sender ON packages.sender_office_id = o_sender.id
      LEFT JOIN offices AS o_receiver ON packages.receiver_office_id = o_receiver.id
      WHERE ${whereSql}
      ORDER BY packages.date_pack_start DESC
      LIMIT ? OFFSET ?
      `,
      [...params, limit, offset]
    );

    res.json({
      rowsEmployees,
      employeesId,
      page,
      totalPages,
      listPackages,
    });
  } catch (err) {
    console.error("listPackagesEmployees error:", err);
    res.status(500).json({ error: err.message || "Server error" });
  }
};

exports.packageStatus = async (req, res) => {
  try {
    const db = await dbPromise;

    const { packageId, status } = req.body;
    if (!packageId) return res.status(400).json({ error: "Missing Package ID!" });
    if (!status) return res.status(400).json({ error: "Missing Status!" });

    await db.query("UPDATE packages SET status = ? WHERE id = ?", [status, packageId]);

    res.status(200).json({ message: "Status was updated!" });
  } catch (err) {
    console.error("packageStatus error:", err);
    res.status(500).json({ error: err.message || "Database error, Status was not updated!" });
  }
};

exports.listPackagesTransit = async (req, res) => {
  try {
    const db = await dbPromise;

    let page = Number(req.body.page || 1);
    if (!page || page < 1) page = 1;

    const limit = 20;
    const offset = (page - 1) * limit;

    const where = ["packages.status = 'in_transit'"];
    const params = [];

    if (req.body.dtStart) {
      where.push("packages.date_pack_start >= ?");
      params.push(toDateOnly(req.body.dtStart));
    }

    if (req.body.dtEnd) {
      where.push("packages.date_pack_start <= ?");
      params.push(toDateOnly(req.body.dtEnd));
    }

    const whereSql = where.join(" AND ");

    const [[countRow]] = await db.query(
      `SELECT COUNT(*) AS total FROM packages WHERE ${whereSql}`,
      params
    );

    const totalPages = Math.ceil(countRow.total / limit);

    const [listPackages] = await db.query(
      `
      SELECT
        packages.id,
        packages.date_pack_start,
        packages.sender_id,
        c_sender.name AS senderName,
        c_sender.phone AS senderPhone,
        c_sender.country AS senderCountry,
        c_sender.city AS senderCity,
        c_sender.address AS senderAddress,

        packages.receiver_id,
        c_receiver.name AS receiverName,
        c_receiver.phone AS receiverPhone,
        c_receiver.country AS receiverCountry,
        c_receiver.city AS receiverCity,
        c_receiver.address AS receiverAddress,

        packages.sender_office_id,
        o_sender.office_name AS senderOffice,

        packages.receiver_office_id,
        o_receiver.office_name AS receiverOffice,

        packages.description,
        packages.weight,
        packages.homeSender,
        packages.homeReceiver,
        packages.status
      FROM packages
      LEFT JOIN clients AS c_sender ON packages.sender_id = c_sender.id
      LEFT JOIN clients AS c_receiver ON packages.receiver_id = c_receiver.id
      LEFT JOIN offices AS o_sender ON packages.sender_office_id = o_sender.id
      LEFT JOIN offices AS o_receiver ON packages.receiver_office_id = o_receiver.id
      WHERE ${whereSql}
      ORDER BY packages.date_pack_start DESC
      LIMIT ? OFFSET ?
      `,
      [...params, limit, offset]
    );

    res.json({ page, totalPages, listPackages });
  } catch (err) {
    console.error("listPackagesTransit error:", err);
    res.status(500).json({ error: err.message || "Server error" });
  }
};

exports.totalMoney = async (req, res) => {
  try {
    const db = await dbPromise;

    const where = ["packages.status = 'delivered'"];
    const params = [];

    if (req.body.dtStart) {
      where.push("packages.date_pack_start >= ?");
      params.push(toDateOnly(req.body.dtStart));
    }

    if (req.body.dtEnd) {
      where.push("packages.date_pack_start <= ?");
      params.push(toDateOnly(req.body.dtEnd));
    }

    const whereSql = where.join(" AND ");

    const [rows] = await db.query(
      `
      SELECT
        SUM(packages.weight * memo.pricePerKg) AS amountPriceKG,
        SUM(CASE WHEN packages.homeSender = 1 THEN memo.tax_home ELSE 0 END) AS sumHomeSender,
        SUM(CASE WHEN packages.homeReceiver = 1 THEN memo.tax_home ELSE 0 END) AS sumHomeReceiver
      FROM packages
      JOIN memo
      WHERE ${whereSql}
      `,
      params
    );

    const r = rows[0] || {};
    const sumMoney =
      Number(r.amountPriceKG || 0) + Number(r.sumHomeSender || 0) + Number(r.sumHomeReceiver || 0);

    res.json({ sumMoney });
  } catch (err) {
    console.error("totalMoney error:", err);
    res.status(500).json({ error: err.message || "Server error" });
  }
};

exports.singlePackageMoney = async (req, res) => {
  try {
    const db = await dbPromise;

    const id_pack = req.body.id;
    if (!id_pack) return res.status(400).json({ error: "Missing id" });

    const [rows] = await db.query(
      `
      SELECT
        (packages.weight * memo.pricePerKg) AS amountPriceKG,
        (CASE WHEN packages.homeSender = 1 THEN memo.tax_home ELSE 0 END) AS sumHomeSender,
        (CASE WHEN packages.homeReceiver = 1 THEN memo.tax_home ELSE 0 END) AS sumHomeReceiver,
        packages.status
      FROM packages
      JOIN memo
      WHERE packages.id = ?
      `,
      [id_pack]
    );

    const r = rows[0];
    if (!r) return res.status(404).json({ error: "Package not found" });

    const sumMoney =
      Number(r.amountPriceKG || 0) + Number(r.sumHomeSender || 0) + Number(r.sumHomeReceiver || 0);

    res.json({ sumMoney, packageStatus: r.status });
  } catch (err) {
    console.error("singlePackageMoney error:", err);
    res.status(500).json({ error: err.message || "Server error" });
  }
};