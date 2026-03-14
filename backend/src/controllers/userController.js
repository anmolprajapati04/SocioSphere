const db = require('../models');

async function me(req, res, next) {
  try {
    const user = await db.User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
    });
  } catch (err) {
    return next(err);
  }
}

async function listResidents(req, res, next) {
  try {
    const residents = await db.User.findAll({
      where: { society_id: req.user.society_id },
    });
    return res.json({
      success: true,
      data: residents.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
      }))
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = { me, listResidents };

