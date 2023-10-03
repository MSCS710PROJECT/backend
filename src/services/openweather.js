const axios = require('axios');

exports.getWeatherData = async (location) => {
  const API_KEY = process.env.OPENWEATHERMAP_API_KEY;
  const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${API_KEY}`);
  return response.data;
};
