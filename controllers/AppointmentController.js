const db = require('../models/db');

// Check availability for an appointment
const checkAvailability = async (req, res) => {
    const { tailorId, date } = req.body;

    try {

        const query = `SELECT * FROM Appointments WHERE tailorId = ? AND date = ? `;
        db.all(query, [tailorId, date], (err, row) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ success: false, message: 'Error checking availability' });
            }
            if(!row){
                return res.status(200).json({});
            }


            return res.status(200).json(row);
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Book an appointment
const bookAppointment = async (req, res) => {
    const { tailorId, customerId, date, time } = req.body;

    try {
        // Check if the time slot is available first
        const checkQuery = `SELECT * FROM Appointments WHERE tailorId = ? AND date = ? AND time = ?`;
        db.get(checkQuery, [tailorId, date, time], (err, row) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ success: false, message: 'Error checking availability' });
            }
            if (row) {
                return res.status(400).json({ success: false, message: 'Time slot is already booked' });
            }

            // If available, book the appointment by inserting a new record
            const insertQuery = `INSERT INTO Appointments (tailorId, customerId, date, time) VALUES (?, ?, ?, ?)`;
            db.run(insertQuery, [tailorId, customerId, date, time], function (err) {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ success: false, message: 'Error booking appointment' });
                }
                // Return the newly created appointment id
                res.status(200).json({ success: true, message: 'Appointment booked successfully', appointmentId: this.lastID });
            });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

const getAppointmentsForTailor = async (req, res) => {
    const { id } = req.params;

    const query = `
      SELECT 
        Customer.fullName AS name, 
        Appointments.date, 
        Appointments.time
      FROM 
        Appointments
      INNER JOIN 
        Customer
      ON 
        Appointments.customerId = Customer.customerId
      WHERE 
        Appointments.tailorId = ?;
    `;

    try {
        db.all(query, [id], (err, rows) => {
            if (err) {
                console.error("Error fetching appointments:", err);
                return res.status(500).json({ error: "Internal server error" });
            }

            res.json(rows);
        });
    } catch (error) {
        console.error("Unexpected error:", error);
        res.status(500).json({ error: "Unexpected server error" });
    }
};

const getAppointmentsForCustomer = async (req, res) => {
    const { id } = req.params;

    const query = `
      SELECT 
        Tailor.fullName AS name, 
        Appointments.date, 
        Appointments.time
      FROM 
        Appointments
      INNER JOIN 
        Tailor
      ON 
        Appointments.tailorId = Tailor.tailorId
      WHERE 
        Appointments.customerId = ?;
    `;

    try {
        db.all(query, [id], (err, rows) => {
            if (err) {
                console.error("Error fetching appointments:", err);
                return res.status(500).json({ error: "Internal server error" });
            }

            res.json(rows);
        });
    } catch (error) {
        console.error("Unexpected error:", error);
        res.status(500).json({ error: "Unexpected server error" });
    }
};

module.exports = { checkAvailability, bookAppointment, getAppointmentsForTailor, getAppointmentsForCustomer };
