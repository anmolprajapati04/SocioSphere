const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';
const JWT_EXPIRES_IN = '1h';
const REFRESH_EXPIRES_IN = '7d';

function generateTokens(payload) {
  const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  const refreshToken = jwt.sign({ sub: payload.sub }, JWT_SECRET, { expiresIn: REFRESH_EXPIRES_IN });
  return { accessToken, refreshToken };
}

module.exports = { generateTokens };

