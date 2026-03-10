const express = require('express');
const { authMiddleware } = require('../middlewares/authMiddleware');
const db = require('../models');

const router = express.Router();

router.get('/', authMiddleware, async (req, res, next) => {
  try {
    const complaints = await db.Complaint.findAll({
      where: { society_id: req.user.society_id },
    });
    res.json(complaints);
  } catch (err) {
    next(err);
  }
});

router.post('/', authMiddleware, async (req, res, next) => {
  try {
    const complaint = await db.Complaint.create({
      society_id: req.user.society_id,
      user_id: req.user.sub,
      title: req.body.title,
      description: req.body.description,
    });
    res.status(201).json(complaint);
  } catch (err) {
    next(err);
  }
});

module.exports = router;

