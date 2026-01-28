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
    console.error("Error fetching employees:", err);
    res.status(500).json({ error: "Database error, can't get Employee." });
  }
};

exports.addEmployees = async (req, res) => {
  try {
    const dbConnection = await db;
    const { name, email, role_id, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "name, email and password are required." });
    }

    // Check if email already exists
    const [existingEmail] = await dbConnection.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );
    if (existingEmail.length > 0) {
      return res.status(400).json({ error: "Email already exists." });
    }

    // Simple name split: first word = first_name, rest = last_name
    const nameParts = name.trim().split(" ");
    const first_name = nameParts[0] || name;
    const last_name = nameParts.slice(1).join(" ") || name;
    const username = email.split("@")[0];
    
    // Generate unique phone: try up to 5 times to avoid collisions
    let phone;
    let attempts = 0;
    while (attempts < 5) {
      phone = `0888${Math.floor(100000 + Math.random() * 900000)}`;
      const [existingPhone] = await dbConnection.query(
        "SELECT id FROM users WHERE phone = ?",
        [phone]
      );
      if (existingPhone.length === 0) break; // Phone is unique
      attempts++;
    }
    
    if (attempts >= 5) {
      // Fallback: use timestamp-based phone
      phone = `0888${Date.now().toString().slice(-6)}`;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert into users table
    const [resultUser] = await dbConnection.query(
      "INSERT INTO users(username, first_name, last_name, email, phone, password, user_type) VALUES (?, ?, ?, ?, ?, ?, 'employee')",
      [username, first_name, last_name, email, phone, hashedPassword]
    );

    // Insert into employee table
    const [result] = await dbConnection.query(
      "INSERT INTO employee(user_id, name, email, role_id) VALUES (?, ?, ?, ?)",
      [resultUser.insertId, name, email, role_id || 1]
    );

    res.status(201).json({ id: result.insertId });
  } catch (err) {
    console.error("Error adding employee:", err.message);
    
    // Better error messages
    if (err.code === 'ER_DUP_ENTRY') {
      if (err.message.includes('email')) {
        return res.status(400).json({ error: "Email already exists." });
      }
      if (err.message.includes('phone')) {
        return res.status(400).json({ error: "Phone number collision. Please try again." });
      }
    }
    
    res.status(500).json({ error: err.message || "Database error, can't add Employee." });
  }
};

exports.updateEmployees = async (req, res) => {
  try {
    const dbConnection = await db;
    const { name, email, role_id, id } = req.body;

    if (!name || !email || !id) {
      return res.status(400).json({ error: "name, email and id are required." });
    }

    await dbConnection.query(
      "UPDATE employee SET name = ?, email = ?, role_id = ? WHERE id = ?",
      [name, email, role_id, id]
    );

    // Also update the users table if needed
    await dbConnection.query(
      "UPDATE users SET username = ?, email = ? WHERE id = (SELECT user_id FROM employee WHERE id = ?)",
      [name, email, id]
    );

    res.json({ message: "Employee updated successfully." });
  } catch (err) {
    console.error("Error updating employee:", err);
    res.status(500).json({ error: "Database error, can't update Employee." });
  }
};

exports.deleteEmployees = async (req, res) => {
  try {
    const dbConnection = await db;
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ error: "id is required." });
    }

    await dbConnection.query("UPDATE employee SET active = 0 WHERE id = ?", [id]);

    res.json({ message: "Employee deleted successfully." });
  } catch (err) {
    console.error("Error deleting employee:", err);
    res.status(500).json({ error: "Database error, can't delete Employee." });
  }
};

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