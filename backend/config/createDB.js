const dbPromise = require("./db");

(async () => {
  try {
    const db = await dbPromise;

    // Show which database we're using
    const [dbInfo] = await db.query("SELECT DATABASE() AS current_db");
    console.log(`📊 Using database: ${dbInfo[0].current_db || 'NONE'}`);
    console.log("Creating tables...");

    const tableQueries = [
      `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(20) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        user_type ENUM('client', 'employee') DEFAULT 'client',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
      `,
      `
      CREATE TABLE IF NOT EXISTS clients(
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT DEFAULT 0,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) DEFAULT NULL,
        phone VARCHAR(20) NOT NULL UNIQUE,
        country VARCHAR(255) DEFAULT NULL,
        city VARCHAR(255) DEFAULT NULL,
        address VARCHAR(255) DEFAULT NULL
      )
      `,
      `
      CREATE TABLE IF NOT EXISTS packages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        date_pack_start DATE NOT NULL,
        sender_id INT NOT NULL,
        receiver_id INT NOT NULL,
        sender_office_id INT NOT NULL,
        receiver_office_id INT DEFAULT 0,
        description VARCHAR(255) DEFAULT NULL,
        weight DECIMAL(5,3) NOT NULL,
        homeSender INT NOT NULL,
        homeReceiver INT NOT NULL,
        status ENUM('pending','in_transit','delivered','return') DEFAULT 'pending',
        date_delivered DATE DEFAULT NULL,
        cash_delivery INT DEFAULT 0
      )
      `,
      `
      CREATE TABLE IF NOT EXISTS memo (
        id INT AUTO_INCREMENT PRIMARY KEY,
        company_name VARCHAR(255) NOT NULL,
        dds_tax DOUBLE(5,2) DEFAULT 0.0,
        pricePerKg DOUBLE(8,2) DEFAULT 0.0,
        tax_home DOUBLE(8,2) DEFAULT 0.0
      )
      `,
      `
      CREATE TABLE IF NOT EXISTS employee (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) DEFAULT NULL,
        role_id int NOT NULL,
        description VARCHAR(255) DEFAULT NULL,
        active tinyint DEFAULT 1
      )
      `,
    ];

    for (const query of tableQueries) {
      await db.query(query);
      console.log("Table created or already exists");
    }

    // Setup offices table
    console.log("Setting up offices table...");
    await db.query("SET FOREIGN_KEY_CHECKS = 0");
    await db.query("DROP TABLE IF EXISTS offices");
    await db.query(`
      CREATE TABLE offices (
        id INT AUTO_INCREMENT PRIMARY KEY,
        office_name VARCHAR(255) NOT NULL,
        country VARCHAR(255),
        city VARCHAR(255),
        address VARCHAR(255)
      )
    `);
    
    await db.query(
      `INSERT INTO offices (office_name, country, city, address) VALUES
      (?, ?, ?, ?), (?, ?, ?, ?), (?, ?, ?, ?), (?, ?, ?, ?), (?, ?, ?, ?),
      (?, ?, ?, ?), (?, ?, ?, ?), (?, ?, ?, ?), (?, ?, ?, ?), (?, ?, ?, ?),
      (?, ?, ?, ?), (?, ?, ?, ?), (?, ?, ?, ?), (?, ?, ?, ?), (?, ?, ?, ?)`,
      [
        "Sofia - Central Office", "Bulgaria", "Sofia", "bul. Vitosha 1",
        "Plovdiv - Central Office", "Bulgaria", "Plovdiv", "ul. Centralna 5",
        "Varna - Central Office", "Bulgaria", "Varna", "ul. More 10",
        "Burgas - Central Office", "Bulgaria", "Burgas", "ul. Morska 3",
        "Ruse - Central Office", "Bulgaria", "Ruse", "ul. Dunav 7",
        "Stara Zagora - Central Office", "Bulgaria", "Stara Zagora", "bul. Tsar Simeon 15",
        "Pleven - Central Office", "Bulgaria", "Pleven", "ul. Svoboda 2",
        "Sliven - Central Office", "Bulgaria", "Sliven", "ul. Sinite kamani 4",
        "Dobrich - Central Office", "Bulgaria", "Dobrich", "ul. Dobrotitsa 9",
        "Shumen - Central Office", "Bulgaria", "Shumen", "ul. Preslav 11",
        "Pernik - Central Office", "Bulgaria", "Pernik", "ul. Krakra 6",
        "Haskovo - Central Office", "Bulgaria", "Haskovo", "ul. Bulgarska 8",
        "Yambol - Central Office", "Bulgaria", "Yambol", "ul. Tundzha 12",
        "Blagoevgrad - Central Office", "Bulgaria", "Blagoevgrad", "ul. Mladost 14",
        "Veliko Tarnovo - Central Office", "Bulgaria", "Veliko Tarnovo", "ul. Tsarevets 3",
      ]
    );
    
    await db.query("SET FOREIGN_KEY_CHECKS = 1");
    console.log(" Offices table created and seeded.");

    // 3️⃣ Индекси
    console.log("Creating indexes (if missing)...");

    const indexes = [
      { table: "users", name: "idx_users_email", column: "email" },
      { table: "users", name: "idx_users_username", column: "username" },
      { table: "users", name: "idx_users_phone", column: "phone" },
      { table: "clients", name: "idx_clients_email", column: "email" },
      { table: "clients", name: "idx_clients_user_id", column: "user_id" },
      { table: "clients", name: "idx_clients_city", column: "city" },
      { table: "packages", name: "idx_packages_user_id", column: "user_id" },
      {
        table: "packages",
        name: "idx_packages_sender_id",
        column: "sender_id",
      },
      {
        table: "packages",
        name: "idx_packages_receiver_id",
        column: "receiver_id",
      },
      {
        table: "packages",
        name: "idx_packages_sender_office_id",
        column: "sender_office_id",
      },
      {
        table: "packages",
        name: "idx_packages_receiver_office_id",
        column: "receiver_office_id",
      },
    ];

    for (const idx of indexes) {
      try {
        const [rows] = await db.query(
          `SHOW INDEX FROM ${idx.table} WHERE Key_name = ?`,
          [idx.name]
        );
        if (rows.length === 0) {
          await db.query(
            `CREATE INDEX ${idx.name} ON ${idx.table} (${idx.column})`
          );
          console.log(`Created index ${idx.name} on ${idx.table}(${idx.column})`);
        } else {
          console.log(`Index ${idx.name} already exists`);
        }
      } catch (idxErr) {
        console.log(`⚠️  Skipping index ${idx.name} on ${idx.table}(${idx.column}): ${idxErr.message}`);
      }
    }

    console.log("All tables and indexes are ready!");
    await db.end();
    console.log("Connection closed");
  } catch (err) {
    console.error("❌ Error:", err.message);
  }
})();

// All registrations default to 'client'
// Employees are created by admins/back-end
// Simple and secure

// Add shipping address (creates record in clients table)
//After logging in, you go to "My Profile" or "Add Shipping Address" and enter:


// Later — user adds addresses (optional)
// After logging in, user can go to "My Addresses" and add:
// Address 1: "123 Home St, New York" → Creates record in clients table
// Address 2: "456 Work St, Boston" → Creates another record in clients table

//Creating a package
// When creating a package, user selects:
// Sender: Choose from saved addresses (from clients table)
// Receiver: Choose from saved addresses OR enter new one