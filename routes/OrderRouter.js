const { addOrder, updateStatus, getOrders } = require('../controllers/OrderController');

const router = require('express').Router();

router.get('/get/:id', getOrders);

router.post('/add/:id', addOrder);

router.put('/update/:id', updateStatus);

module.exports = router;