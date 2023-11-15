const express = require('express');
const router = express.Router();

const userRoutes = require('./user');
const weatherRoutes = require('./weather')

// Mount the individual routers
router.use('/', userRoutes);
router.use('/weather', weatherRoutes)
router.use('/bot', require('./chatbot'));

module.exports = router;
