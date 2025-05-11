const bcrypt = require('bcrypt');
const db = require('../models/db'); // Assuming db is configured here

// Controller to get tailor by ID
const getTailorById = async (req, res) => {
    try {
        const { id } = req.params;
        db.get('SELECT * FROM Tailor WHERE tailorId = ?', [id], (err, row) => {
            if (err) {
                res.status(500).json({ error: 'Internal Server Error', details: err.message });
            } else if (!row) {
                res.status(404).json({ error: 'Tailor not found' });
            } else {
                res.status(200).json(row);
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
};

const updateTailor = (req, res) => {
    const { id } = req.params; // Tailor ID
    const { 
        profileImage,fullName, email, phone, specialization, experience, 
        creations, services, socialLinks, description 
    } = req.body;

    // Initialize arrays for SQL updates and parameters
    let updateFields = [];
    let params = [];

    // Profile fields
    if (profileImage) {
        updateFields.push("profileImage = ?");
        params.push(profileImage);
    }
    if (fullName) {
        updateFields.push("fullName = ?");
        params.push(fullName);
    }
    if (email) {
        updateFields.push("email = ?");
        params.push(email);
    }
    if (phone) {
        updateFields.push("phoneNumber = ?");
        params.push(phone);
    }
    if (specialization) {
        updateFields.push("specialization = ?");
        params.push(specialization);
    }
    if (experience) {
        updateFields.push("experience = ?");
        params.push(experience);
    }

    if(profileImage !== undefined){
        updateFields.push("profileImage = ?");
        params.push(typeof profileImage === "string" ? profileImage : JSON.stringify(profileImage));
    }
    // Additional details fields
    if (creations !== undefined) {
        updateFields.push("creations = ?");
        params.push(typeof creations === "string" ? creations : JSON.stringify(creations));
    }
    if (services !== undefined) {
        updateFields.push("services = ?");
        params.push(typeof services === "string" ? services : JSON.stringify(services));
    }
    if (socialLinks !== undefined) {
        updateFields.push("socialLinks = ?");
        params.push(typeof socialLinks === "string" ? socialLinks : JSON.stringify(socialLinks));
    }
    if (description !== undefined) {
        updateFields.push("description = ?");
        params.push(description || null);
    }

    // Add the `updatedAt` field for additional details
    if (creations || services || socialLinks || description || profileImage) {
        updateFields.push("updatedAt = CURRENT_TIMESTAMP");
    }

    // If no fields to update, return a bad request response
    if (updateFields.length === 0) {
        return res.status(400).json({ error: "No fields provided for update" });
    }

    // Generate the SQL query dynamically
    const sql = `
        UPDATE Tailor
        SET ${updateFields.join(", ")}
        WHERE tailorId = ?
    `;

    // Add the tailor ID as the last parameter
    params.push(id);

    // Execute the query
    db.run(sql, params, function (err) {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: "Server error, please try again later" });
        }

        if (this.changes === 0) {
            return res.status(404).json({ error: "Tailor not found" });
        }

        return res.status(200).json({ message: "Tailor details updated successfully" });
    });
};

const verifyPassword = (req, res) => {
    const { password, userId } = req.body;

    // Query the database to get the hashed password for the given userId
    const query = `SELECT password FROM Tailor WHERE tailorId = ?`;
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
        `UPDATE Tailor
         SET password=?
         WHERE tailorId = ?
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

const getTailorsBySearch = (req, res) =>{
    const { name, location, service } = req.query;

    let query = "SELECT * FROM Tailor WHERE 1=1";
    const params = [];

    if (name) {
        query += " AND fullName LIKE ?";
        params.push(`%${name}%`);
    }
    if (location) {
        query += " AND location LIKE ?";
        params.push(`%${location}%`);
    }
    if (service) {
        query += " AND specialization LIKE ?";
        params.push(`%${service}%`);
    }

    db.all(query, params, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows);
        }
    });
}



const getBusinessInfo = (req, res) => {
    const { id } = req.params; // Tailor ID

    // SQL query to join Tailor and TailorDetails and retrieve limited data
    const sql = `
        SELECT 
            fullName AS name, 
            email, 
            phoneNumber AS phone, 
            services AS services, 
            socialLinks AS socialLinks
        FROM Tailor 
        WHERE tailorId = ?
    `;

    const params = [id];

    db.get(sql, params, (err, row) => {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: 'Server error, please try again later' });
        }

        if (!row) {
            return res.status(404).json({ error: 'Tailor not found' });
        }

        // Parse JSON fields
        const services = JSON.parse(row.services ).slice(0, 3);
        const socialLinks = JSON.parse(row.socialLinks );

        // Format response
        const response = {
            name: row.name,
            email: row.email,
            phone: row.phone,
            services: services,
            socialLinks: Object.entries(socialLinks).slice(0, 4).reduce((acc, [key, value]) => {
                acc[key] = value;
                return acc;
            }, {}),
        };

        return res.status(200).json(response);
    });
};


module.exports = { getTailorById, updateTailor, verifyPassword, changePassword, getTailorsBySearch, getBusinessInfo};
