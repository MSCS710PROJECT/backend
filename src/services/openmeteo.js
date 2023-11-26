import tzlookup from "tz-lookup";
import { DateTime } from "luxon";



const prettyPrintWeatherCode = (code) => {
    const weatherCodes = {
      0: "Clear",
      1000: "Clear",
      1001: "Cloudy",
      1100: "Mostly Clear",
      1101: "Partly Cloudy",
      1102: "Mostly Cloudy",
      2000: "Fog",
      2100: "Light Fog",
      3000: "Light Wind",
      3001: "Wind",
      3002: "Strong Wind",
      4000: "Drizzle",
      4001: "Rain",
      4200: "Light Rain",
      4201: "Heavy Rain",
      5000: "Snow",
      5001: "Flurries",
      5100: "Light Snow",
      5101: "Heavy Snow",
      6000: "Freezing Drizzle",
      6001: "Freezing Rain",
      6200: "Light Freezing Rain",
      6201: "Heavy Freezing Rain",
      7000: "Ice Pellets",
      7101: "Heavy Ice Pellets",
      7102: "Light Ice Pellets",
      8000: "Thunderstorm",
      // Additional descriptions with same values
      1: "Clear",
      2: "Cloudy",
      3: "Mostly Clear",
      45: "Fog",
      48: "Light Fog",
      51: "Drizzle",
      53: "Rain",
      55: "Light Rain",
      56: "Freezing Drizzle",
      57: "Freezing Rain",
      61: "Light Freezing Rain",
      63: "Heavy Freezing Rain",
      65: "Snow",
      66: "Flurries",
      67: "Light Snow",
      71: "Heavy Snow",
      73: "Freezing Drizzle",
      75: "Freezing Rain",
      77: "Light Freezing Rain",
      80: "Heavy Freezing Rain",
      81: "Ice Pellets",
      82: "Heavy Ice Pellets",
      85: "Light Ice Pellets",
      86: "Thunderstorm",
      95: "Clear", // Placeholder, adjust as needed
      96: "Cloudy", // Placeholder, adjust as needed
      99: "Mostly Clear", // Placeholder, adjust as needed
    };
    return weatherCodes[code];
  };

export const getTimeZone = (lat, lng) => {
  return tzlookup(lat, lng);
};

const getUVIndexLabel = (uvIndex) => {
  if (uvIndex <= 3) {
    return "L";
  } else if (uvIndex <= 6) {
    return "M";
  } else if (uvIndex <= 9) {
    return "H";
  } else {
    return "E";
  }
};
const getWeatherApiURL = (
  lat,
  lng,
  durationInDays,
  timezone = getTimeZone()
) => {
  return `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&hourly=visibility,uv_index,windspeed_10m,temperature_2m,apparent_temperature,precipitation_probability,precipitation,rain,snowfall,snow_depth,weathercode&daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,uv_index_max,uv_index_clear_sky_max,precipitation_sum&temperature_unit=${getMetricData()}&timezone=${timezone}&windspeed_unit=mph&current_weather=true&forecast_days=${durationInDays}`;
};
// export const getWeatherInsightsHTML = async (location) => {
//   const timeZone = tzlookup(location.latitude, location.longitude);
//   const locationWeatherAPIUrl = getWeatherApiURL(
//     location.latitude,
//     location.longitude,
//     1,
//     timeZone
//   );
//   const locationWeatherresponse = await fetch(locationWeatherAPIUrl);
//   const currentTime = DateTime.now()
//     .setZone(timeZone)
//     .plus({ minutes: 30 })
//     .toFormat("yyyy-MM-dd HH:mm");

//   const currentTimeIndex = DateTime.now()
//     .setZone(timeZone)
//     .plus({ hours: 1 })
//     .startOf("hour")
//     .toFormat("yyyy-MM-dd,HH:mm")
//     .split(",")
//     .join("T");
//   const locationWeatherData = await locationWeatherresponse.json();
//   const locWeatherDataText = getWeatherDataHtml(
//     locationWeatherData,
//     currentTime,
//     currentTimeIndex
//   );
//   return locWeatherDataText;
// };

export const getWeatherAlertsHTML = async (location) => {
  const timeZone = tzlookup(location.latitude, location.longitude);
  const locationWeatherAPIUrl = getWeatherApiURL(
    location.latitude,
    location.longitude,
    1,
    timeZone
  );
  const locationWeatherresponse = await fetch(locationWeatherAPIUrl);
  const currentTime = DateTime.now()
    .setZone(timeZone)
    .toFormat("yyyy-MM-dd HH:mm");

  const currentTimeIndex = DateTime.now()
    .setZone(timeZone)
    .startOf("hour")
    .toFormat("yyyy-MM-dd,HH:mm")
    .split(",")
    .join("T");
  const locationWeatherData = await locationWeatherresponse.json();
  const locWeatherDataText = getSimpleWeatherDataHtml(
    locationWeatherData,
    currentTime,
    currentTimeIndex
  );
  return locWeatherDataText;
};
export const getSimpleWeatherDataHtml = (
  apiResponse,
  time,
  timeIndex,
  city
) => {
  const hourly = apiResponse.hourly;
  const index = hourly.time.indexOf(timeIndex);
  const weatherCode = hourly.weathercode[index];

  return `
    <div class="weather-data">
      <div class="weather-data-weather mb-2r">${getWeatherQuote(weatherCode)}</div>
    </div>
  `;
};
// export const getWeatherDataHtml = (apiResponse, time, timeIndex, city) => {
//   const hourly = apiResponse.hourly;
//   // const current = apiResponse.current_weather;
//   const index = hourly.time.indexOf(timeIndex);
//   const current = hourly.temperature_2m[index];
//   const apparentTemp = hourly.apparent_temperature[index];
//   const uvIndex = hourly.uv_index[index];
//   const precipitationSum = hourly.precipitation[index];
//   const weatherCode = hourly.weathercode[index];
//   const windSpeed = hourly.windspeed_10m[index];
//   const isDay = apiResponse.current_weather.is_day;

//   console.log(
//     `city: ${city} :::: timeIndex: ${timeIndex} ::::: index: ${index} :::: ${current}`
//   );

//   return `
//     <div class="weather-data">
//       <h5>${getWeatherAdvice(Math.round(uvIndex), precipitationSum, windSpeed, current, weatherCode, isDay)}</h5>
//       <div class="weather-data-time mb-2"><i class="fas fa-clock"></i> ${time}</div>
//       <div class="weather-data-temperature mb-2"><i class="fas fa-thermometer-half"></i> ${Math.round(
//         current
//       )} ${getMetricData() == "fahrenheit" ? "°F" : "°C"}</div>
//       <div class="weather-data-feels-like mb-2"><i class="fas fa-thermometer-empty"></i> Feels Like: ${Math.round(
//         apparentTemp
//       )} ${getMetricData() == "fahrenheit" ? "°F" : "°C"}</div>
//       <div class="weather-data-uv-index mb-2"><i class="fas fa-sun"></i> UV Index: ${Math.round(
//         uvIndex
//       )} - ${getUVIndexLabel(Math.round(uvIndex))}</div>
//       <div class="weather-data-precipitation mb-2"><i class="fas fa-cloud-rain"></i> Precipitation: ${precipitationSum}</div>
//       <div class="weather-data-weather mb-2r"><i class="${getWeatherIcon(
//         weatherCode
//       )}"></i> Weather: ${prettyPrintWeatherCode(weatherCode)}</div>
//     </div>
//   `;
// };
// const getWeatherIcon = (weatherCode) => {
//   const weatherIcons = {
//     0: "fas fa-sun", // clear_day
//     1: "fas fa-cloud-sun", // mostly_clear_day
//     2: "fas fa-cloud-sun", // partly_cloudy_day
//     3: "fas fa-cloud", // cloudy
//     45: "fas fa-smog", // fog
//     48: "fas fa-smog", // fog_light
//     51: "fas fa-cloud-drizzle", // drizzle
//     53: "fas fa-cloud-drizzle", // drizzle
//     55: "fas fa-cloud-showers-heavy", // rain_heavy
//     56: "fas fa-cloud-meatball", // freezing_drizzle
//     57: "fas fa-cloud-meatball", // freezing_rain_heavy
//     61: "fas fa-cloud-rain", // rain_light
//     63: "fas fa-cloud-rain", // rain
//     65: "fas fa-cloud-showers-heavy", // rain_heavy
//     66: "fas fa-cloud-meatball", // freezing_rain_light
//     67: "fas fa-cloud-meatball", // freezing_rain_heavy
//     71: "fas fa-snowflake", // snow_light
//     73: "fas fa-snowflake", // snow
//     75: "fas fa-snowflake", // snow_heavy
//     77: "fas fa-icicles", // ice_pellets
//     80: "fas fa-cloud-rain", // rain_light
//     81: "fas fa-cloud-rain", // rain
//     82: "fas fa-cloud-showers-heavy", // rain_heavy
//     85: "fas fa-snowflake", // snow_light
//     86: "fas fa-snowflake", // snow_heavy
//     95: "fas fa-bolt", // tstorm
//     96: "fas fa-bolt", // tstorm
//     99: "fas fa-bolt", // tstorm
//   };
//   return weatherIcons[weatherCode] || "fas fa-question";
// };

function getWeatherQuote(weatherCode) {
  switch (weatherCode) {
    case 0:
    case 1:
    case 3:
      return "Don't forget your sunglasses! It's going to be a bright day.";

    case 1001:
    case 2:
    case 96:
      return "You might need a light jacket today, it's going to be cloudy.";

    case 2000:
    case 45:
    case 48:
      return "Be careful while driving, there's foggy weather ahead.";

    case 3000:
    case 3001:
    case 3002:
      return "Hold onto your hat, it's going to be windy today.";

    case 4000:
    case 51:
    case 56:
    case 73:
      return "You might need an umbrella, there's a chance of drizzle.";

    case 4001:
    case 53:
    case 55:
    case 57:
    case 61:
    case 75:
    case 77:
      return "Don't forget your raincoat, it's going to rain today.";

    case 5000:
    case 65:
    case 67:
      return "Bundle up, it's going to snow today.";

    case 5001:
    case 66:
      return "Expect some flurries today, stay warm.";

    case 6000:
    case 6001:
    case 82:
    case 80:
      return "Watch your step, there might be some icy patches.";

    case 7000:
    case 81:
    case 85:
      return "Be cautious, there's a chance of ice pellets.";

    case 8000:
    case 86:
      return "Stay indoors, there's a thunderstorm expected.";

    default:
      return "Enjoy your day!";
  }
}

function getWeatherAdvice(uvIndex, precipitation, windSpeed, temperature, weatherCode, isDay ) {
  const metric = store.getState()?.user?.user?.metric;
  const settings = store.getState()?.user?.user?.settings;
  let messages = [];

  if (metric) {
    // Temperature advice in Celsius
    if (temperature < settings.temperature.minC) {
      messages.push(
        `<i class="fa-solid fa-temperature-low"></i> It's freezing (below ${settings.temperature.minC}°C). Dress in layers and stay warm.`
      );
    } else if (temperature < (settings.temperature.minC + settings.temperature.maxC) / 2) {
      messages.push(`<i class="fa-solid fa-temperature-arrow-down"></i> It's cool (below ${(settings.temperature.minC + settings.temperature.maxC) / 2}°C). Consider wearing a jacket.`);
    } else if (temperature > settings.temperature.maxC) {
      messages.push(
        `<i class="fa-solid fa-temperature-high"></i> It's hot (above ${settings.temperature.maxC}°C). Stay hydrated and avoid strenuous activities in the heat.`
      );
    }
  } else {
    // Temperature advice in Fahrenheit
    if (temperature < settings.temperature.min) {
      messages.push(`<i class="fa-solid fa-temperature-low"></i> It's freezing (below ${settings.temperature.min}°F). Dress in layers and stay warm.`);
    } else if (temperature < (settings.temperature.min + settings.temperature.max) / 2) {
      messages.push(`<i class="fa-solid fa-temperature-arrow-down"></i> It's cool (below ${(settings.temperature.min + settings.temperature.max) / 2}°F). Consider wearing a jacket.`);
    } else if (temperature > settings.temperature.max) {
      messages.push(
        `<i class="fa-solid fa-temperature-high"></i> It's hot (above ${settings.temperature.max}°F). Stay hydrated and avoid strenuous activities in the heat.`
      );
    }
  }

  // UV Index advice
  if (isDay) {
    if (uvIndex > settings.uvIndex.max) {
      messages.push("It's very sunny. Wear sunscreen and a hat.");
    } else if (uvIndex > settings.uvIndex.min) {
      messages.push("The sun is moderate. Seek shade during midday hours.");
    } else {
      messages.push("UV levels are low. Enjoy your day, but stay protected.");
    }
  }

  // Precipitation advice
  if (precipitation > settings.precipitation.max) {
    messages.push(
      "Heavy rain expected. Don't forget an umbrella and waterproof clothing."
    );
  } else if (precipitation > settings.precipitation.min) {
    messages.push("Light rain is coming. A raincoat might be a good idea.");
  } else if (precipitation > 0) {
    messages.push(
      "There's a chance of drizzle. Consider carrying a light umbrella."
    );
  }

  // Wind advice
  if (windSpeed > settings.windSpeed.max) {
    messages.push(
      "It's very windy. Secure loose items and be careful if driving."
    );
  } else if (windSpeed > settings.windSpeed.min) {
    messages.push("It's a bit breezy. A windbreaker might be necessary.");
  }

  return messages.join(" ");
}
