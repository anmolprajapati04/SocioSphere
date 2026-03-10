const express = require('express');
const { authMiddleware } = require('../middlewares/authMiddleware');
const db = require('../models');

const router = express.Router();

router.get('/', authMiddleware, async (req, res, next) => {
  try {
    const amenities = await db.Amenity.findAll({
      where: { society_id: req.user.society_id },
    });
    res.json(amenities);
  } catch (err) {
    next(err);
  }
});

router.get('/bookings', authMiddleware, async (req, res, next) => {
  try {
    const where =
      req.user.role === 'RESIDENT'
        ? { society_id: req.user.society_id, user_id: req.user.sub }
        : { society_id: req.user.society_id };
    const bookings = await db.AmenityBooking.findAll({ where });
    res.json(bookings);
  } catch (err) {
    next(err);
  }
});

module.exports = router;

