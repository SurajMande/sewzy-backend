const db = require('../models/db'); // Assuming db is configured here

const getReview = (req, res) => {

    try {
        const { id } = req.params;
        const query = `SELECT Reviews.reviewId, Customer.fullName AS customerName, Reviews.review, Reviews.rating 
                 FROM Reviews
                 INNER JOIN Customer ON Reviews.customerId = Customer.customerId
                 WHERE Reviews.tailorId = ?`;

        db.all(query,[id] ,(err, rows) => {
            if (err) {
                console.error('Error fetching reviews:', err);
                res.status(500).json({ error: 'Failed to fetch reviews' });
            } else {
                res.json(rows);
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
}

const writeReview = (req, res) => {
    try {
        const { id } = req.params; // id of the customer
        const { name, review, rating } = req.body;

        // Validate inputs
        if (!name || !review || !rating || isNaN(rating) || rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: 'Invalid input data. Please provide valid name, review, and rating (1-5).',
            });
        }

        const getTailorQuery = `SELECT tailorId FROM Tailor WHERE fullName = ?`;
        db.get(getTailorQuery, [name], (err, row) => {
            if (err) {
                return res.status(500).json({
                    error: 'Internal Server Error',
                    details: err.message,
                });
            }

            if (!row) {
                return res.status(404).json({
                    error: 'No tailor found with this name',
                });
            }

            const tailorId = row.tailorId;

            const insertQuery = `
                INSERT INTO Reviews (
                    customerId, tailorId, review, rating
                )
                VALUES (?, ?, ?, ?)
            `;
            const insertData = [id, tailorId, review, rating];

            db.run(insertQuery, insertData, function (err) {
                if (err) {
                    console.error('Error inserting review:', err);
                    return res.status(500).json({
                        success: false,
                        message: 'Failed to register review',
                    });
                }

                // Successfully registered
                return res.status(201).json({
                    success: true,
                    message: 'Review registered successfully',
                    reviewId: this.lastID,
                });
            });
        });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};


module.exports = { getReview, writeReview };