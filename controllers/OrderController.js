const db = require('../models/db');

// Add a new order to the database
const addOrder = (req, res) => {
    try {
        const { customerName,phone, item, measurements, deliveryDate, status } = req.body;
        const { id } = req.params;

        const query = `INSERT INTO offlineOrders (customerName, phone, tailorId, item, measurements, deliveryDate, status) VALUES (?, ?, ?, ?, ?, ?, ?)`;

        const params = [customerName, phone, id, item, JSON.stringify(measurements), deliveryDate, status];
        db.run(query, params, function (err) {
            if (err) {
                console.error('Error inserting order:', err);
                return res.status(500).json({
                    success: false,
                    message: 'Failed to register order details',
                });
            }

            // Successfully registered
            return res.status(201).json({
                success: true,
                message: 'Order registered successfully',
                id: this.lastID,  // Get the ID of the inserted record
            });
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

// Get all orders from the database
const getOrders = (req, res) => {
    try {

        const { id } = req.params;
        const query = `SELECT * FROM offlineOrders WHERE tailorId = ?`;

        db.all(query, [id], (err, rows) => {
            if (err) {
                console.error('Error fetching orders:', err);
                return res.status(500).json({
                    success: false,
                    message: 'Failed to fetch order details',
                });
            }

            // const orders = rows.map(row => ({
            //     ...row,
            //     measurements: JSON.parse(row.measurements)  // Convert JSON string back to object
            //   }));

            return res.status(200).json(rows);
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

// Update order status to "Completed"
const updateStatus = (req, res) => {
    try {

        const {customerName, item} = req.body;
        const { id } = req.params;

        const query = `UPDATE offlineOrders SET status = ? WHERE tailorId = ? AND customerName = ? AND item = ?`;
        const params = ["Completed", id, customerName, item];

        db.run(query, params, function (err) {
            if (err) {
                console.error('Error updating order status:', err);
                return res.status(500).json({
                    success: false,
                    message: 'Failed to update order status',
                });
            }

            if (this.changes === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Order not found',
                });
            }

            return res.status(200).json({
                success: true,
                message: 'Order status updated to completed',
            });
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

module.exports = { addOrder, getOrders, updateStatus };
