const db = require("../config/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.getEmployees = async (req, res) => {
  try {
    const dbConnection = await db;
    const [rowsEmployees] = await dbConnection.query(
      "SELECT * FROM employee WHERE active = 1 ORDER BY name"
    );
    res.json(rowsEmployees);
  } catch (err) {
    res.status(500).json({ error: "Database error, can't get Employee." });
  }
};

exports.addEmployees = async (req, res) => {
    try{
        const dbConnection = await db;
        const {name, email, role_id, password} = req.body;
        const [resultUser] = await dbConnection.query(
            "INSERT INTO users(username, email, password, user_type) VALUES (?, ?, ?, 'employee')",
            [name, email, password]
        );
        const [result] = await dbConnection.query(
            "INSERT INTO employee(user_id, name, email, role_id) VALUES (?, ?, ?, ?)",
            [resultUser.insertId, name, email, role_id]
        );
        res.json({id: result.insertId});
    } catch(err) {
        res.status(500).json({error: "Database error, can't add Employee."});
    }
}

exports.updateEmployees = async (req, res) => {
    try{
        const dbConnection = await db;
        const{name, email, role_id, id} = req.body;
        const [result] = await dbConnection.query(
            "UPDATE employee SET name = ?, email = ?, role_id = ? WHERE id = ?", [name, email, role_id, id]
        );
        res.json({status: "Employee updated."});
    }catch(err) {
        res.status(500).json({error: "Database error, can't update Employee."});
    }
}

exports.deleteEmployees = async (req, res) => {
    try{
        const dbConnection = await db;
        const{id} = req.body;
        const [result] = await dbConnection.query(
            "UPDATE employee SET active = 0 WHERE id = ?", [id]
        );
        res.json({status: "Employee deleted."});
    }catch(err) {
        res.status(500).json({error: "Database error, can't delete Employee."});
    }
}

// List all employees (for compatibility)
exports.listEmployees = async (req, res) => {
  try {
    const dbConnection = await db;
    const [rows] = await dbConnection.query(
      "SELECT id, username, first_name, last_name, email, phone, user_type FROM users WHERE user_type = 'employee' ORDER BY first_name"
    );
    res.json(rows);
  } catch (err) {
    console.error("Error fetching employees:", err);
    res.status(500).json({ error: "Cannot fetch employees." });
  }
};
