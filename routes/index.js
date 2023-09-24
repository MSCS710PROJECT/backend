const express = require('express');
const router = express.Router();

const userRoutes = require('./user');

// Mount the individual routers
router.use('/users', userRoutes);

module.exports = router;
