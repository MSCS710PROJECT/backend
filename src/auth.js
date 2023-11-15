const jwt = require('jsonwebtoken');
const functions = require('firebase-functions');

const SECRET_KEY = functions.config().appsecret?.key || process.env.SECRET_KEY;
const REFRESH_KEY = 'MARIST_WEATHER_DASHBOARD_REFRESH'

exports.generateToken = (user) => {
  return jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: '1h' });
};

exports.generateRefreshToken = (user) => {
  return jwt.sign({ id: user._id }, REFRESH_KEY, { expiresIn: '7d' });
}

exports.verifyToken = (token) => {
  return jwt.verify(token, SECRET_KEY);
};

exports.verifyRefreshToken = (token) => {
  return jwt.verify(token, REFRESH_KEY);
}
