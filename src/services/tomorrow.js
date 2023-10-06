const axios = require('axios');
const functions = require('firebase-functions');

exports.getWeatherData = async (location, timestep, startTime, endTime) => {
  const API_KEY = functions.config().tomorrowio?.key || process.env.TOMORROW_IO_API_KEY;

  const response = await axios({
    method: 'post',
    url: `https://api.tomorrow.io/v4/timelines?apikey=${API_KEY}`,
    data: {
      "location": location,
      "fields": [
        "humidity",
        "precipitationProbability",
        "precipitationIntensity",
        "precipitationType",
        "temperature",
        "temperatureApparent",
        "windDirection",
        "windSpeed",
        "weatherCode"
      ],
      "units": "metric",
      "timesteps": [
        timestep
      ],
      "startTime": startTime,
      "endTime": endTime
    }
  });

  return response.data;
};
