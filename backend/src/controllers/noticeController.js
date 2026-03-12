const db = require('../models');

/**
 * Get all notices for the society
 */
exports.getAllNotices = async (req, res, next) => {
  try {
    const notices = await db.Notice.findAll({
      where: { society_id: req.user.society_id },
      order: [['createdAt', 'DESC']]
    });
    res.json(notices);
  } catch (err) {
    next(err);
  }
};

/**
 * Create a new notice and broadcast it (Admin)
 */
exports.createNotice = async (req, res, next) => {
  try {
    const notice = await db.Notice.create({
      society_id: req.user.society_id,
      created_by: req.user.id,
      title: req.body.title,
      content: req.body.content || req.body.message,
      valid_from: req.body.valid_from || new Date(),
      valid_to: req.body.valid_to
    });

    // Broadcast via socket.io (if attached to req)
    if (req.io) {
      req.io.emit('new_notice', notice);
    }

    res.status(201).json(notice);
  } catch (err) {
    next(err);
  }
};
