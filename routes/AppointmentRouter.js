const { checkAvailability, bookAppointment, getAppointmentsForTailor, getAppointmentsForCustomer } = require('../controllers/AppointmentController');

const router = require('express').Router();

router.post('/available',checkAvailability);

router.post('/book',bookAppointment);

router.get('/get/tailor/:id', getAppointmentsForTailor);

router.get('/get/customer/:id', getAppointmentsForCustomer);

module.exports = router;