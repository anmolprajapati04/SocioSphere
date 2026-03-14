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
    res.json({
      success: true,
      data: notices
    });
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

    // Broadcast via socket.io
    const io = req.app.get('io');
    if (io) {
      console.log(`Emitting new_notice to society_${req.user.society_id}`);
      io.to(`society_${req.user.society_id}`).emit('new_notice', notice);
    }

    res.status(201).json({
      success: true,
      data: notice
    });
  } catch (err) {
    next(err);
  }
};
