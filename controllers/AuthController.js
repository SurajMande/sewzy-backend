const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../models/db'); // Assuming db is configured here

const signup = async (req, res) => {
    try {
        const {
            accountType,
            fullName,
            email,
            password,
            phoneNumber,
            businessName,
            location,
            specialization,
            experience,
        } = req.body;

        // Validate required fields
        if (!accountType || !fullName || !email || !password || !phoneNumber) {
            return res.status(400).json({
                success: false,
                message: 'All required fields must be filled.',
            });
        }

        // Check if user already exists in either table
        const table = accountType === "Tailor" ? "Tailor" : "Customer";
        db.get(`SELECT * FROM ${table} WHERE email = ?`, [email], async (err, user) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ success: false, message: 'Internal server error' });
            }

            if (user) {
                return res.status(409).json({
                    success: false,
                    message: 'User already exists. Please log in.',
                });
            }

            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Insert new user into the respective table
            const insertQuery =
                accountType === "Tailor"
                    ? `
                    INSERT INTO Tailor (
                        accountType,fullName, email, password, phoneNumber, businessName, location, specialization, experience, termsAccepted
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?,?)`
                    : `
                    INSERT INTO Customer (
                        accountType,fullName, email, password, phoneNumber, termsAccepted
                    ) VALUES (?, ?, ?, ?, ?, ?)`;

            const insertData =
                accountType === "Tailor"
                    ? [
                          accountType,
                          fullName,
                          email,
                          hashedPassword,
                          phoneNumber,
                          businessName || null,
                          location || null,
                          specialization || null,
                          experience || null,
                          true, // termsAccepted
                      ]
                    : [accountType,fullName, email, hashedPassword, phoneNumber, true];

            db.run(insertQuery, insertData, function (err) {
                if (err) {
                    console.error('Error inserting user:', err);
                    return res.status(500).json({
                        success: false,
                        message: 'Failed to register user',
                    });
                }

                // Successfully registered
                return res.status(201).json({
                    success: true,
                    message: 'User registered successfully',
                    userId: this.lastID,
                });
            });
        });
    } catch (err) {
        console.error('Signup error:', err);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required.',
            });
        }

        // Search for user in both tables
        const findUser = (table) =>
            new Promise((resolve, reject) => {
                db.get(`SELECT * FROM ${table} WHERE email = ?`, [email], (err, user) => {
                    if (err) reject(err);
                    else resolve(user);
                });
            });

        const customer = await findUser("Customer");
        const tailor = await findUser("Tailor");
        const user = customer || tailor;

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found. Please register first.',
            });
        }

        const isPasswordEqual = await bcrypt.compare(password, user.password);

        if (!isPasswordEqual) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password.',
            });
        }

        const jwtToken = jwt.sign(
            { email: user.email, id: customer ? user.customerId : user.tailorId , accountType: customer ? "Customer" : "Tailor" },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(200).json({
            success: true,
            message: 'Login successful.',
            jwtToken,
            email: user.email,
            name: user.fullName,
            id: customer ? user.customerId : user.tailorId, 
            accountType: customer ? "Customer" : "Tailor",
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

module.exports = {
    signup,
    login,
};
