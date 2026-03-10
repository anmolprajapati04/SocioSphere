const express = require('express');
const { authMiddleware } = require('../middlewares/authMiddleware');
const db = require('../models');

const router = express.Router();

router.get('/groups', authMiddleware, async (req, res, next) => {
  try {
    const groups = await db.Group.findAll({ where: { society_id: req.user.society_id } });
    res.json(groups);
  } catch (e) {
    next(e);
  }
});

router.post('/groups', authMiddleware, async (req, res, next) => {
  try {
    const group = await db.Group.create({
      society_id: req.user.society_id,
      name: req.body.name,
      type: req.body.type || 'CUSTOM',
    });
    res.status(201).json(group);
  } catch (e) {
    next(e);
  }
});

router.get('/messages', authMiddleware, async (req, res, next) => {
  try {
    const { group_id, recipient_id } = req.query;
    const where = { society_id: req.user.society_id };
    if (group_id) where.group_id = Number(group_id);
    if (recipient_id) {
      where.recipient_id = Number(recipient_id);
      where.sender_id = req.user.sub;
    }
    const messages = await db.Message.findAll({
      where,
      order: [['createdAt', 'ASC']],
      limit: 200,
    });
    res.json(messages);
  } catch (e) {
    next(e);
  }
});

router.post('/messages', authMiddleware, async (req, res, next) => {
  try {
    const msg = await db.Message.create({
      society_id: req.user.society_id,
      group_id: req.body.group_id || null,
      sender_id: req.user.sub,
      recipient_id: req.body.recipient_id || null,
      body: req.body.body,
    });
    res.status(201).json(msg);
  } catch (e) {
    next(e);
  }
});

module.exports = router;

