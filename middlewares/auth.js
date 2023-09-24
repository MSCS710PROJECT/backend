const { verifyToken } = require('../auth');

exports.isAuthenticated = (req, res, next) => {
  const token = req.headers.authorization;
  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).send('Unauthorized');
  }
};
