const db = require('../config/db');

// Get all clients (for dropdowns)
exports.listClients = async (req, res) => {
  try {
    const dbConnection = await db;
    const [rows] = await dbConnection.query(
      "SELECT id, name, email, phone, country, city, address FROM clients ORDER BY name"
    );
    res.json(rows);
  } catch (err) {
    console.error("Error fetching clients:", err);
    res.status(500).json({ error: "Cannot fetch clients." });
  }
};

// Get my client info
exports.getMyClient = async (req, res) => {
  try {
    const dbConnection = await db;
    const userId = req.session.userId;

    if (!userId) {
      return res.status(401).json({ error: "Not authenticated." });
    }

    const [rows] = await dbConnection.query(
      "SELECT id, name, email, phone, country, city, address FROM clients WHERE user_id = ?",
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Client not found." });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("Error fetching client:", err);
    res.status(500).json({ error: "Cannot fetch client." });
  }
};

// Update my address
exports.updateAddress = async (req, res) => {
  try {
    const dbConnection = await db;
    const userId = req.session.userId;
    const { country, city, address } = req.body;

    if (!userId) {
      return res.status(401).json({ error: "Not authenticated." });
    }

    await dbConnection.query(
      "UPDATE clients SET country = ?, city = ?, address = ? WHERE user_id = ?",
      [country, city, address, userId]
    );

    res.json({ message: "Address updated successfully." });
  } catch (err) {
    console.error("Error updating address:", err);
    res.status(500).json({ error: "Cannot update address." });
  }
};
