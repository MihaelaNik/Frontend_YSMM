
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');

// Зареждаме .env от главната директория
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const {
  DB_HOST,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
} = process.env;

// 🧩 Основна функция, която проверява и създава базата
async function initializeDatabase() {
  try {
    // 1️⃣ Свързваме се без база
    const connection = await mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
    });

    console.log('✅ Connected to MySQL server');

    // 2️⃣ Проверяваме дали базата съществува
    const [rows] = await connection.query('SHOW DATABASES LIKE ?', [DB_NAME]);

    if (rows.length === 0) {
      // ❗ Базата не съществува → създаваме я
      await connection.query(`CREATE DATABASE \`${DB_NAME}\``);
      console.log(`✅ Database '${DB_NAME}' created`);
    } else {
      console.log(`ℹ️ Database '${DB_NAME}' already exists`);
    }

    // 3️⃣ Променяме потребителя да използва базата
    await connection.changeUser({ database: DB_NAME });
    console.log(`✅ Using database '${DB_NAME}'`);

    return connection;
  } catch (err) {
    console.error('❌ Database initialization error:', err.message);
    process.exit(1);
  }
}

module.exports = initializeDatabase();
