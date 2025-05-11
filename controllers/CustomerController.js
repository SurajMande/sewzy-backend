const bcrypt = require('bcrypt');
const db = require('../models/db'); // Assuming db is configured here

// Controller to get Customer by ID
const getCustomerById = async (req, res) => {
    try {
        const { id } = req.params;
        db.get('SELECT * FROM Customer WHERE customerId = ?', [id], (err, row) => {
            if (err) {
                res.status(500).json({ error: 'Internal Server Error', details: err.message });
            } else if (!row) {
                res.status(404).json({ error: 'Customer not found' });
            } else {
                res.status(200).json(row);
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
};

const updateProfile = (req, res) => {
    const { id } = req.params;
    const { fullName, email, phone } = req.body;

    const sql = `
      UPDATE Customer
      SET fullName = ?, email = ?, phoneNumber = ?
      WHERE customerId = ?
    `;

    const params = [fullName, email, phone, id];

    db.run(sql, params, function (err) {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: 'Server error, please try again later' });
        }

        if (this.changes === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        return res.status(200).json({ message: 'Profile updated successfully' });
    });
};

const verifyPassword = (req, res) => {
    const { password, userId } = req.body;

    // Query the database to get the hashed password for the given userId
    const query = `SELECT password FROM Customer WHERE customerId = ?`;
    db.get(query, [userId], async (err, row) => {
        if (err) {
            console.error("Error querying database:", err);
            return res.status(500).json({ success: false, message: "Server error" });
        }

        if (!row) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        try {
            // Compare the entered password with the hashed password
            const isMatch = await bcrypt.compare(password, row.password);
            if (isMatch) {
                res.status(200).json({ success: true, message: "Password verified" });
            } else {
                res.status(401).json({ success: false, message: "Incorrect password" });
            }
        } catch (error) {
            console.error("Error comparing passwords:", error);
            res.status(500).json({ success: false, message: "Server error" });
        }
    });
}

const changePassword = async (req, res) => {
    const { id } = req.params;
    const { newPassword } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(newPassword, 10);


    const sql =
        `UPDATE Customer
         SET password=?
         WHERE customerId = ?
    `;

    const params = [hashedPassword, id];

    db.run(sql, params, function (err) {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: 'Server error, please try again later' });
        }

        if (this.changes === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        return res.status(200).json({ message: 'Password updated successfully' });
    });

}

module.exports = { getCustomerById, updateProfile, verifyPassword, changePassword };
