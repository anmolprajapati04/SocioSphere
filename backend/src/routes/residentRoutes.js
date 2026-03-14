const express = require('express');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { roleMiddleware } = require('../middlewares/roleMiddleware');
const db = require('../models');

const router = express.Router();

router.get(
  '/',
  authMiddleware,
  roleMiddleware(['Admin']),
  async (req, res, next) => {
    try {
      const residents = await db.Resident.findAll({
        where: { society_id: req.user.society_id },
        include: [{ model: db.User, attributes: ['id', 'name', 'email', 'phone'] }],
        order: [['createdAt', 'DESC']],
      });
      res.json({ success: true, data: residents });
    } catch (e) {
      next(e);
    }
  }
);

router.post(
  '/',
  authMiddleware,
  roleMiddleware(['Admin']),
  async (req, res, next) => {
    try {
      const { user_id, flat_number, wing, is_owner } = req.body;
      const user = await db.User.findByPk(user_id);
      if (!user) return res.status(404).json({ message: 'User not found' });
      if (user.society_id !== req.user.society_id) {
        return res.status(403).json({ message: 'Cross-society not allowed' });
      }
      const resident = await db.Resident.create({
        society_id: req.user.society_id,
        user_id,
        flat_number,
        wing,
        is_owner: Boolean(is_owner),
      });
      res.status(201).json({ success: true, data: resident });
    } catch (e) {
      next(e);
    }
  }
);

router.put('/:id', authMiddleware, roleMiddleware(['Admin']), async (req, res, next) => {
  try {
    const resident = await db.Resident.findOne({ where: { id: req.params.id, society_id: req.user.society_id } });
    if (!resident) return res.status(404).json({ message: 'Resident not found' });
    await resident.update(req.body);
    res.json({ success: true, data: resident });
  } catch (e) {
    next(e);
  }
});

router.delete('/:id', authMiddleware, roleMiddleware(['Admin']), async (req, res, next) => {
  try {
    const resident = await db.Resident.findOne({ where: { id: req.params.id, society_id: req.user.society_id } });
    if (!resident) return res.status(404).json({ message: 'Resident not found' });
    await resident.destroy();
    res.json({ success: true, message: 'Resident removed' });
  } catch (e) {
    next(e);
  }
});

module.exports = router;

