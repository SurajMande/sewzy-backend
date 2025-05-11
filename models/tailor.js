const db = require('./db'); // Assuming db.js provides the database connection

// Create the 'Tailor' table
const createTailorTable = () => {
  const query = `
    CREATE TABLE IF NOT EXISTS Tailor (
      tailorId INTEGER PRIMARY KEY AUTOINCREMENT,
      profileImage TEXT DEFAULT NULL,
      fullName TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      phoneNumber TEXT UNIQUE NOT NULL,
      accountType TEXT CHECK(accountType = 'Tailor') NOT NULL,
      businessName TEXT,
      location TEXT,
      specialization TEXT CHECK(specialization IN ('Men''s Wear', 'Women''s Wear', 'Both')),
      experience TEXT CHECK(experience IN ('1 Year', '2 Years', '3 Years', '4 Years', '5 Years', '5+ Years')),
      termsAccepted BOOLEAN NOT NULL,

      description TEXT DEFAULT NULL,
      creations TEXT DEFAULT '[]', -- Store as JSON string
      services TEXT DEFAULT '[]', -- Store as JSON string
      socialLinks TEXT DEFAULT '[]', -- Store as JSON string
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  db.run(query, (err) => {
    if (err) {
      console.error('Error creating "Tailor" table:', err.message);
    } else {
      console.log('Table "Tailor" created or already exists.');
    }
  });
};

// Function to insert a new tailor
const insertTailor = (tailorData) => {
  const {
    fullName,
    email,
    password,
    phoneNumber,
    accountType = 'Tailor',
    businessName,
    location,
    specialization,
    experience,
    termsAccepted,
  } = tailorData;

  const query = `
    INSERT INTO Tailor (
      fullName, email, password, phoneNumber, accountType,
      businessName, location, specialization, experience, termsAccepted
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
  `;

  db.run(
    query,
    [
      fullName,
      email,
      password,
      phoneNumber,
      accountType,
      businessName || null,
      location || null,
      specialization || null,
      experience || null,
      termsAccepted ? 1 : 0,
    ],
    function (err) {
      if (err) {
        console.error('Error inserting tailor:', err.message);
      } else {
        console.log(`Tailor '${fullName}' inserted with ID: ${this.lastID}`);
      }
    }
  );
};

// Function to retrieve all tailors
const getTailors = (callback) => {
  const query = `
    SELECT *
    FROM Tailor;
  `;

  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Error fetching tailors:', err.message);
      callback(err, null);
    } else {
      callback(null, rows);
    }
  });
};

module.exports = {
  createTailorTable,
  insertTailor,
  getTailors,
};
