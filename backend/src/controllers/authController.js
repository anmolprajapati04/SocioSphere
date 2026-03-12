const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../models');

const JWT_SECRET = process.env.JWT_SECRET || 'sociosphere_secret_key';

async function register(req, res, next) {
  try {
    const { name, email, phone, password, role, society_name, society_address, city, flat_number } = req.body;

    // Validate inputs
    if (!name || !email || !phone || !password || !role) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const existing = await db.User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Assign society
    let societyId = req.user?.society_id || req.body.society_id || null;
    
    if (!societyId && society_name) {
      const [society] = await db.Society.findOrCreate({
        where: { name: society_name },
        defaults: { name: society_name, address: society_address || 'Pending Address', city: city || 'Pending City' }
      });
      societyId = society.id;
    }

    const hash = await bcrypt.hash(password, 10);
    const user = await db.User.create({
      name,
      email,
      phone,
      password: hash,
      role, // 'Admin', 'Resident', 'Security'
      society_id: societyId,
      flat_number
    });

    if (role === 'Resident') {
      await db.Resident.create({
        user_id: user.id,
        society_id: societyId,
        flat_number: flat_number || 'N/A',
        wing: req.body.wing || 'A',
        is_owner: req.body.is_owner !== false
      });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, society_id: user.society_id },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    return res.status(201).json({
      user: { id: user.id, name: user.name, email: user.email, role: user.role, society_id: user.society_id },
      token
    });
  } catch (err) {
    return next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await db.User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, society_id: user.society_id },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    return res.json({
      message: 'Login successful',
      user: { id: user.id, name: user.name, email: user.email, role: user.role, society_id: user.society_id },
      token
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = { register, login };

