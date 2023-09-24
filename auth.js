const jwt = require('jsonwebtoken');

const SECRET_KEY = 'WEATHER_API_KEY';

exports.generateToken = (user) => {
  return jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: '1h' });
};

exports.verifyToken = (token) => {
  return jwt.verify(token, SECRET_KEY);
};

exports.refreshToken = (user) => {
  // Implement refresh token logic here
};
