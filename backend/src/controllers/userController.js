const db = require('../models');

async function me(req, res, next) {
  try {
    const user = await db.User.findByPk(req.user.sub, { include: db.Role });
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.Role?.name,
    });
  } catch (err) {
    return next(err);
  }
}

async function listResidents(req, res, next) {
  try {
    const residents = await db.User.findAll({
      include: db.Role,
      where: { society_id: req.user.society_id },
    });
    return res.json(
      residents.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.Role?.name,
      }))
    );
  } catch (err) {
    return next(err);
  }
}

module.exports = { me, listResidents };

