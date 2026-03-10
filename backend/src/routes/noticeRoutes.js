const express = require('express');
const { authMiddleware } = require('../middlewares/authMiddleware');
const db = require('../models');

const router = express.Router();

router.get('/', authMiddleware, async (req, res, next) => {
  try {
    const notices = await db.Notice.findAll({
      where: { society_id: req.user.society_id },
      order: [['createdAt', 'DESC']],
    });
    res.json(notices);
  } catch (err) {
    next(err);
  }
});

router.post('/', authMiddleware, async (req, res, next) => {
  try {
    const notice = await db.Notice.create({
      society_id: req.user.society_id,
      title: req.body.title,
      content: req.body.content,
      valid_from: req.body.valid_from || null,
      valid_to: req.body.valid_to || null,
    });
    res.status(201).json(notice);
  } catch (err) {
    next(err);
  }
});

module.exports = router;

