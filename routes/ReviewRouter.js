const { getReview, writeReview } = require('../controllers/ReviewController');

const router = require('express').Router();

router.get('/get/:id',getReview);

router.post('/write/:id',writeReview);

module.exports = router;