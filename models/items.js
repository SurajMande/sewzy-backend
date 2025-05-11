const db = require('./db'); 

// Create the 'Items' table
const createItemsTable = () => {
  const query = `
    CREATE TABLE IF NOT EXISTS Items (
      itemId INTEGER PRIMARY KEY AUTOINCREMENT,
      itemName TEXT NOT NULL UNIQUE,
      description TEXT,
      price REAL NOT NULL,
      category TEXT NOT NULL
    );
  `;

  db.run(query, (err) => {
    if (err) {
      console.error('Error creating Items table:', err.message);
    } else {
      console.log('Items table created or already exists.');
    }
  });
};

// Function to insert a new item
const insertItem = (itemData) => {
  const { itemName, description, price, category } = itemData;

  const query = `
    INSERT INTO Items (itemName, description, price, category)
    VALUES (?, ?, ?, ?);
  `;

  db.run(query, [itemName, description, price, category], function (err) {
    if (err) {
      console.error('Error inserting item:', err.message);
    } else {
      console.log(`Item '${itemName}' inserted with ID: ${this.lastID}`);
    }
  });
};

// Function to retrieve all items
const getItems = (callback) => {
  const query = `
    SELECT * FROM Items;
  `;

  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Error fetching items:', err.message);
      callback(err, null);
    } else {
      callback(null, rows);
    }
  });
};

// Export the functions for use in other modules
module.exports = {
  createItemsTable,
  insertItem,
  getItems,
};
