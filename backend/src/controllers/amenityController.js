const db = require('../models');
const { Op } = require('sequelize');

/**
 * Get all amenities in the society
 */
exports.getAllAmenities = async (req, res, next) => {
  try {
    const amenities = await db.Amenity.findAll({
      where: { society_id: req.user.society_id }
    });
    res.json(amenities);
  } catch (err) {
    next(err);
  }
};

/**
 * Book an amenity (Resident)
 */
exports.bookAmenity = async (req, res, next) => {
  try {
    const { amenity_id, start_time, end_time } = req.body;

    const amenity = await db.Amenity.findByPk(amenity_id);
    if (!amenity) return res.status(404).json({ message: 'Amenity not found.' });
    if (!amenity.is_active) return res.status(400).json({ message: 'This amenity is currently unavailable.' });
    
    // Check for overlapping bookings
    const overlap = await db.AmenityBooking.findOne({
      where: {
        amenity_id,
        status: 'CONFIRMED',
        [Op.or]: [
          {
            start_time: { [Op.lt]: end_time },
            end_time: { [Op.gt]: start_time }
          }
        ]
      }
    });

    if (overlap) {
      return res.status(400).json({ message: 'The selected time slot is already booked.' });
    }

    const booking = await db.AmenityBooking.create({
      society_id: req.user.society_id,
      amenity_id,
      user_id: req.user.id,
      start_time,
      end_time,
      status: 'CONFIRMED'
    });

    // Broadcast new booking to all users (to update live schedules)
    if (req.io) {
      req.io.emit('new_amenity_booking', booking);
    }

    res.status(201).json(booking);
  } catch (err) {
    next(err);
  }
};

/**
 * Get bookings (Filtered by role)
 */
exports.getBookings = async (req, res, next) => {
  try {
    const where = { society_id: req.user.society_id };
    
    if (req.user.role === 'Resident') {
      where.user_id = req.user.id;
    }

    const bookings = await db.AmenityBooking.findAll({
      where,
      include: [
        { model: db.Amenity, as: 'Amenity', attributes: ['name'] },
        { model: db.User, as: 'User', attributes: ['name', 'flat_number'] }
      ],
      order: [['start_time', 'DESC']]
    });

    res.json(bookings);
  } catch (err) {
    next(err);
  }
};
