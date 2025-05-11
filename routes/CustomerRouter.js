const { getCustomerById, updateProfile, verifyPassword, changePassword } = require('../controllers/CustomerController');
const ensureAuthenticated = require('../middlewares/Auth');

const router = require('express').Router();

router.get('/profile/:id',getCustomerById);

router.put('/update-profile/:id',updateProfile);

router.post('/verify-password',verifyPassword);

router.put('/change-password/:id',changePassword);

module.exports = router;