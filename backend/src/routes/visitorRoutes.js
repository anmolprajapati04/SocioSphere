const express = require('express');
const { authMiddleware } = require('../middlewares/authMiddleware');
const db = require('../models');

const router = express.Router();

router.get('/', authMiddleware, async (req, res, next) => {
  try {
    const visitors = await db.Visitor.findAll({
      where: { society_id: req.user.society_id },
    });
    res.json(visitors);
  } catch (err) {
    next(err);
  }
});

router.post('/', authMiddleware, async (req, res, next) => {
  try {
    const visitor = await db.Visitor.create({
      society_id: req.user.society_id,
      resident_id: req.user.sub,
      name: req.body.name,
      phone: req.body.phone,
      purpose: req.body.purpose,
    });
    res.status(201).json(visitor);
  } catch (err) {
    next(err);
  }
});

module.exports = router;

