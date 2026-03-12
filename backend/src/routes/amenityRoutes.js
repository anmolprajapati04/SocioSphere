const express = require('express');
const { authMiddleware } = require('../middlewares/authMiddleware');
const amenityController = require('../controllers/amenityController');

const router = express.Router();

router.get('/', authMiddleware, amenityController.getAllAmenities);
router.get('/bookings', authMiddleware, amenityController.getBookings);
router.post('/bookings', authMiddleware, amenityController.bookAmenity);

module.exports = router;

