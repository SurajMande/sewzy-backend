const db = require('./db'); 

// Create the 'offlineOrders' table
const createOfflineOrdersTable = () => {
  const query = `
    CREATE TABLE IF NOT EXISTS offlineOrders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customerName TEXT NOT NULL,
      phone TEXT NOT NULL,
      tailorId INTEGER NOT NULL,
      item TEXT NOT NULL,
      measurements TEXT DEFAULT '{"chest":"","handSize":"","waist":"","length":""}',
      deliveryDate DATE NOT NULL,
      status TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (tailorId) REFERENCES Tailor(tailorId) ON DELETE CASCADE
    );
  `;

  db.run(query, (err) => {
    if (err) {
      console.error('Error creating offlineOrders table:', err.message);
    } else {
      console.log('Offline Orders table created successfully');
    }
  });
};

module.exports = {
  createOfflineOrdersTable,
};
