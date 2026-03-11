const express = require('express');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { roleMiddleware } = require('../middlewares/roleMiddleware');
const db = require('../models');

const router = express.Router();

router.get(
  '/plans',
  authMiddleware,
  roleMiddleware(['Admin']),
  async (req, res, next) => {
    try {
      const plans = await db.MaintenancePlan.findAll({
        where: { society_id: req.user.society_id },
      });
      res.json(plans);
    } catch (err) {
      next(err);
    }
  }
);

router.get('/payments', authMiddleware, async (req, res, next) => {
  try {
    const where =
      req.user.role === 'Resident'
        ? { society_id: req.user.society_id, user_id: req.user.id }
        : { society_id: req.user.society_id };
    const payments = await db.MaintenancePayment.findAll({ where });
    res.json(payments);
  } catch (err) {
    next(err);
  }
});

module.exports = router;

