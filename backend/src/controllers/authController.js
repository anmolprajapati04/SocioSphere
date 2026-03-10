const bcrypt = require('bcryptjs');
const { z } = require('zod');
const { generateTokens } = require('../utils/token');
const db = require('../models');

const registerSchema = z.object({
  society_id: z.number(),
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['SUPER_ADMIN', 'SOCIETY_ADMIN', 'RESIDENT', 'SECURITY_GUARD', 'ACCOUNTANT']),
});

async function register(req, res, next) {
  try {
    const parsed = registerSchema.parse({
      ...req.body,
      society_id: Number(req.body.society_id),
    });

    const existing = await db.User.findOne({ where: { email: parsed.email } });
    if (existing) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const role = await db.Role.findOne({ where: { name: parsed.role } });
    if (!role) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const hash = await bcrypt.hash(parsed.password, 10);
    const user = await db.User.create({
      society_id: parsed.society_id,
      role_id: role.id,
      name: parsed.name,
      email: parsed.email,
      password: hash,
    });

    const payload = { sub: user.id, role: role.name, society_id: user.society_id };
    const { accessToken, refreshToken } = generateTokens(payload);
    user.refresh_token = refreshToken;
    await user.save();

    return res.status(201).json({
      user: { id: user.id, name: user.name, email: user.email, role: role.name },
      accessToken,
      refreshToken,
    });
  } catch (err) {
    return next(err);
  }
}

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

async function login(req, res, next) {
  try {
    const parsed = loginSchema.parse(req.body);
    const user = await db.User.findOne({ where: { email: parsed.email }, include: db.Role });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const ok = await bcrypt.compare(parsed.password, user.password);
    if (!ok) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const roleName = user.Role.name;
    const payload = { sub: user.id, role: roleName, society_id: user.society_id };
    const { accessToken, refreshToken } = generateTokens(payload);
    user.refresh_token = refreshToken;
    await user.save();

    return res.json({
      user: { id: user.id, name: user.name, email: user.email, role: roleName },
      accessToken,
      refreshToken,
    });
  } catch (err) {
    return next(err);
  }
}

async function refresh(req, res, next) {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ message: 'refreshToken required' });
    }
    const user = await db.User.findOne({ where: { refresh_token: refreshToken }, include: db.Role });
    if (!user) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }
    const payload = { sub: user.id, role: user.Role.name, society_id: user.society_id };
    const tokens = generateTokens(payload);
    user.refresh_token = tokens.refreshToken;
    await user.save();
    return res.json(tokens);
  } catch (err) {
    return next(err);
  }
}

module.exports = { register, login, refresh };

