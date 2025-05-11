const db = require('./db');

const createReviewTable = () => {
    db.run(
        `CREATE TABLE IF NOT EXISTS Reviews (
      reviewId INTEGER PRIMARY KEY AUTOINCREMENT,
      customerId INTEGER NOT NULL,
      tailorId INTEGER NOT NULL,
      review TEXT NOT NULL,
      rating INTEGER CHECK(rating BETWEEN 1 AND 5),
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (customerId) REFERENCES Customer (customerId) ON DELETE CASCADE,
      FOREIGN KEY (tailorId) REFERENCES Tailor (tailorId) ON DELETE CASCADE
)`,
        (err) => {
            if (err) {
                console.error('Error creating "Tailor" table:', err);
            } else {
                console.log('Table "Tailor" created');
            }
        }
    );
}
module.exports = {createReviewTable}; // Export an empty object if you’re not exposing any functions
