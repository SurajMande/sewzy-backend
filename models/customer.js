const db = require('./db'); // Assuming db.js provides the database connection

// Create the 'Customer' table
const createCustomerTable = () => {
  const query = `
    CREATE TABLE IF NOT EXISTS Customer (
      customerId INTEGER PRIMARY KEY AUTOINCREMENT,
      fullName TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      phoneNumber TEXT UNIQUE NOT NULL,
      accountType TEXT CHECK(accountType = 'Customer') NOT NULL,
      termsAccepted BOOLEAN NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  db.run(query, (err) => {
    if (err) {
      console.error('Error creating "Customer" table:', err.message);
    } else {
      console.log('Table "Customer" created or already exists.');
    }
  });
};

// Function to insert a new customer
const insertCustomer = (customerData) => {
  const {
    fullName,
    email,
    password,
    phoneNumber,
    accountType = 'Customer',
    termsAccepted,
  } = customerData;

  const query = `
    INSERT INTO Customer (
      fullName, email, password, phoneNumber, accountType, termsAccepted
    )
    VALUES (?, ?, ?, ?, ?, ?);
  `;

  db.run(
    query,
    [
      fullName,
      email,
      password,
      phoneNumber,
      accountType,
      termsAccepted ? 1 : 0,
    ],
    function (err) {
      if (err) {
        console.error('Error inserting customer:', err.message);
      } else {
        console.log(`Customer '${fullName}' inserted with ID: ${this.lastID}`);
      }
    }
  );
};

// Function to retrieve all customers
const getCustomers = (callback) => {
  const query = `
    SELECT *
    FROM Customer;
  `;

  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Error fetching customers:', err.message);
      callback(err, null);
    } else {
      callback(null, rows);
    }
  });
};

module.exports = {
  createCustomerTable,
  insertCustomer,
  getCustomers,
};
