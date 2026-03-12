const db = require('../models');

/**
 * Get messages for a specific group (Community Chat)
 */
exports.getGroupMessages = async (req, res, next) => {
  try {
    const { group_id } = req.query;
    const where = { society_id: req.user.society_id };
    if (group_id) where.group_id = group_id;

    const messages = await db.Message.findAll({
      where,
      include: [
        { model: db.User, as: 'Sender', attributes: ['name', 'flat_number'] }
      ],
      order: [['createdAt', 'ASC']]
    });
    res.json(messages);
  } catch (err) {
    next(err);
  }
};

/**
 * Send a message to a group
 */
exports.sendMessage = async (req, res, next) => {
  try {
    const { group_id, body } = req.body;
    
    const message = await db.Message.create({
      society_id: req.user.society_id,
      group_id,
      sender_id: req.user.id,
      body 
    });

    const fullMessage = await db.Message.findByPk(message.id, {
      include: [{ model: db.User, as: 'Sender', attributes: ['name', 'flat_number'] }]
    });

    // Broadcast message to the group
    if (req.io) {
      req.io.emit('chat_message', fullMessage);
    }

    res.status(201).json(fullMessage);
  } catch (err) {
    next(err);
  }
};

/**
 * Get all groups (Societies, etc.)
 */
exports.getGroups = async (req, res, next) => {
  try {
    const groups = await db.Group.findAll({
      where: { society_id: req.user.society_id }
    });
    res.json(groups);
  } catch (err) {
    next(err);
  }
};
