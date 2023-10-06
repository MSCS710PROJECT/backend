const express = require('express');
const weatherController = require('../controllers/weather');

const router = express.Router();

router.get('/:location/hourly', weatherController.getHourlyWeather);
router.get('/:location/daily', weatherController.getDailyWeather);

module.exports = router;