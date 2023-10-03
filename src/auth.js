const jwt = require('jsonwebtoken');
const functions = require('firebase-functions');

const SECRET_KEY = functions.config().appsecret.key || process.env.SECRET_KEY;

exports.generateToken = (user) => {
  return jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: '1h' });
};

exports.verifyToken = (token) => {
  return jwt.verify(token, SECRET_KEY);
};

exports.refreshToken = (user) => {
  // Implement refresh token logic here
};
