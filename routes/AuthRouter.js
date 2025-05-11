const { signup, login } = require('../controllers/AuthController');
const { signupTailorValidation, signupCustomerValidation, loginValidation } = require('../middlewares/AuthValidation');

const router = require('express').Router();

// Login route for both Tailor and Customer
router.post('/login', loginValidation, login);

// Signup route for Tailor
router.post('/signup/tailor', signupTailorValidation, signup);

// Signup route for Customer
router.post('/signup/customer', signupCustomerValidation, signup);

module.exports = router;
