const db = require("../config/db");
const bcrypt = require("bcryptjs");

exports.getRegister = (req, res) => {
  res.status(200).json({ message: "Register page" });
};

exports.getLogin = (req, res) => {
  res.status(200).json({ message: "Login page" });
};

exports.register = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      username,
      email,
      phone,
      password,
      passwordConfirm,
    } = req.body;

    // Validate required fields
    if (!first_name || !last_name || !username || !email || !phone || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    let hashedPassword = await bcrypt.hash(password, 10);
    const dbConnection = await db;

    // Check if email or phone already exists
    const [existingUsers] = await dbConnection.query(
      "SELECT id FROM users WHERE email = ? OR phone = ?",
      [email, phone]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ message: "Email or phone number already registered" });
    }

    //Insert into USERS table
    const [userResults] = await dbConnection.query(
      "INSERT INTO users (username, first_name, last_name, email, phone, password) VALUES (?, ?, ?, ?, ?, ?)",
      [username, first_name, last_name, email, phone, hashedPassword]
    );

    const userId = userResults.insertId;
    
    if (!userId) {
      throw new Error("Failed to get user ID after insertion");
    }
    
    // Create full name for clients display
    const fullName = `${first_name} ${last_name}`;
    
    // Insert into clients table
    await dbConnection.query(
      "INSERT INTO clients (user_id, name, email, phone, address, city, country) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [userId, fullName, email, phone, null, null, null]
    );

    return res.status(201).json({ message: "User registered successfully", userId: userId });
  } catch (err) {
    console.error("Registration error:", err);
    
    // Check for specific MySQL errors
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: "Email or phone number already exists" });
    }
    
    return res.status(500).json({ message: "Database error: " + err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const dbConnection = await db;

    const [results] = await dbConnection.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (results.length === 0) {
      return res.status(400).json({ message: "User not found" });
    }

    const user = results[0];
    const matches = await bcrypt.compare(password, user.password);
    if (!matches) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    // Store user information in session
    req.session.userId = user.id;
    req.session.username = user.username;
    req.session.first_name = user.first_name;
    req.session.last_name = user.last_name;
    req.session.phone = user.phone;
    req.session.email = user.email;
    req.session.user_type = user.user_type;
    req.session.isAuthenticated = true;

    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        user_type: user.user_type,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Database error: " + err.message });
  }
};

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Error logging out" });
    }
    res.clearCookie("connect.sid");
    return res.status(200).json({ message: "Logout successful" });
  });
};

//check if user is logged in
exports.getSession = (req, res) => {
  if (req.session && req.session.isAuthenticated) {
    return res.status(200).json({
      isAuthenticated: true,
      user: {
        id: req.session.userId,
        username: req.session.username,
        email: req.session.email,
        user_type: req.session.user_type,
      },
    });
  }
  return res.status(200).json({
    isAuthenticated: false,
    user: null,
  });
};
