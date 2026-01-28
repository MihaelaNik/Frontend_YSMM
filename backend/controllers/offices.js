const db = require('../config/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

//List Offices
exports.listOffices = async (req, res) => {
    try {
      const dbConnection = await db;
  
      const [rows] = await dbConnection.query(
        "SELECT id, office_name, country, city, address FROM offices ORDER BY city, office_name"
      );
  
      res.json(rows);
    } catch (err) {
      console.error("Error fetching offices:", err);
      res.status(500).json({ error: " error cannot fetch offices." });
    }
};

//Search Offices by City
exports.searchOfficesByCity = async (req, res) => {
  try {
    const dbConnection = await db;
    const city = req.query.city;

    if (!city) {
      return res.status(400).json({ error: "City parameter is required." });
    }

    const [rows] = await dbConnection.query(
      "SELECT id, office_name, country, city, address FROM offices WHERE city = ? ORDER BY office_name",
      [city]
    );

    res.json(rows);
  } catch (err) {
    console.error("Error searching offices:", err);
    res.status(500).json({ error: "Cannot search offices." });
  }
};

//Create Office
exports.createOffices = async (req, res) => {
  try {
    const dbConnection = await db;

    const officeName = req.body.office_name;
    const country = req.body.country || "Bulgaria";
    const city = req.body.city;
    const address = req.body.address;

    
    if (!officeName || !city || !address) {
      return res.status(400).json({ error: "office_name, city and address are required." });
    }

    const sql = 
    "INSERT INTO offices (office_name, country, city, address) VALUES (?, ?, ?, ?)";
    const params = [officeName, country, city, address];

    const [result] = await dbConnection.query(sql, params);

    res.status(201).json({ id: result.insertId });
  } catch (error) {
    console.error("Error creating office:", error);
    res.status(500).json({ error: "Cannot create office." });
  }
};

//Update Office
exports.updateOffices = async (req, res) => {
  try {
    const dbConnection = await db;
    const id = req.params.id;
    const { office_name, country, city, address } = req.body;

    if (!office_name || !city || !address) {
      return res.status(400).json({ error: "office_name, city and address are required." });
    }

    await dbConnection.query(
      "UPDATE offices SET office_name = ?, country = ?, city = ?, address = ? WHERE id = ?",
      [office_name, country || "Bulgaria", city, address, id]
    );

    res.json({ message: "Office updated successfully." });
  } catch (error) {
    console.error("Error updating office:", error);
    res.status(500).json({ error: "Cannot update office." });
  }
};

//Delete Office
exports.deleteOffices = async (req, res) => {
  try {
    const dbConnection = await db;
    const id = req.params.id;

    await dbConnection.query("DELETE FROM offices WHERE id = ?", [id]);

    res.json({ message: "Office deleted successfully." });
  } catch (error) {
    console.error("Error deleting office:", error);
    res.status(500).json({ error: "Cannot delete office." });
  }
};





