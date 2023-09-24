const axios = require('axios');

exports.getWeatherData = async (location) => {
  const API_KEY = process.env.TOMORROW_IO_API_KEY;
  const response = await axios.get(`https://api.tomorrow.io/v4/timelines?location=${location}&fields=temperature&timesteps=1h&units=metric&apikey=${API_KEY}`);
  return response.data;
};
