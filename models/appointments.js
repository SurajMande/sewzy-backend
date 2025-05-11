const db = require('./db');

// Create the "Appointments" table if it does not exist
const createAppointmentTable = () => {
    db.run(
        `CREATE TABLE IF NOT EXISTS Appointments (
            appId INTEGER PRIMARY KEY AUTOINCREMENT,
            tailorId INTEGER NOT NULL,
            customerId INTEGER NOT NULL,
            date DATE NOT NULL,
            time TEXT NOT NULL,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (tailorId) REFERENCES Tailor (tailorId) ON DELETE CASCADE,
            FOREIGN KEY (customerId) REFERENCES Customer (customerId) ON DELETE CASCADE
        )`,
        (err) => {
            if (err) {
                console.error('Error creating "Appointments" table:', err);
            } else {
                console.log('Table "Appointments" created');
            }
        }
    );
};

module.exports = { createAppointmentTable };
