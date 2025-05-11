const { getTailorById, updateProfile, verifyPassword, changePassword, getTailorsBySearch, updateDetails, getBusinessInfo, updateTailor } = require('../controllers/TailorController');
const ensureAuthenticated = require('../middlewares/Auth');

const router = require('express').Router();

router.get('/profile/:id',getTailorById);

router.put('/update-profile/:id',updateTailor);

router.post('/verify-password',verifyPassword);

router.put('/change-password/:id',changePassword);

router.get('/search',getTailorsBySearch);

router.get('/business-card/:id', getBusinessInfo);

module.exports = router;