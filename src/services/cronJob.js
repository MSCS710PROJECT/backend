const cron = require("node-cron");
const tzlookup = require("tz-lookup");
const User = require("../models/user");
const { default: axios } = require("axios");
const emailService = require("./email");
const phoneService = require("./phone");

const getAlerts = async (lat, lng, metric) => {
  const { data } = await axios.get(
    `https://api.openweathermap.org/data/3.0/onecall?timezone=${tzlookup(
      lat,
      lng
    )}&lat=${lat}&lon=${lng}&appid=57abda810f8046a4832802deeaa527b5&units=${
      metric ? "metric" : "imperial"
    }&exclude=current,daily,minutely,hourly`
  );
  return data.alerts;
};

const getWeatherData = async (lat, lng, metric) => {
  const now = new Date();
  now.setMinutes(now.getMinutes() + 30);
  const unixTimestamp = Math.floor(now.getTime() / 1000);

  try {
    const url = `https://api.openweathermap.org/data/3.0/onecall/timemachine?timezone=${tzlookup(
      lat,
      lng
    )}&lat=${lat}&lon=${lng}&appid=57abda810f8046a4832802deeaa527b5&units=${
      metric ? "metric" : "imperial"
    }&dt=${unixTimestamp}`;

    console.log(url);
    const { data } = await axios.get(url);
    return data;
  } catch (error) {
    // console.log(error);
    return null;
  }
};

function getOpenWeatherMapAlert(weatherCode) {
  switch (weatherCode) {
    // Thunderstorm
    case 200:
      return "Thunderstorm with light rain. Stay safe!";
    case 201:
      return "Thunderstorm with rain. Better stay indoors!";
    case 202:
      return "Thunderstorm with heavy rain. Avoid going out!";
    case 210:
      return "Light thunderstorm. Be cautious!";
    case 211:
      return "Thunderstorm occurring. Stay indoors!";
    case 212:
      return "Heavy thunderstorm. It's best to stay inside!";
    case 221:
      return "Ragged thunderstorm. Unpredictable weather ahead!";
    case 230:
      return "Thunderstorm with light drizzle. Keep an umbrella handy!";
    case 231:
      return "Thunderstorm with drizzle. Be prepared!";
    case 232:
      return "Thunderstorm with heavy drizzle. Avoid outdoor activities!";

    // Drizzle
    case 300:
      return "Light intensity drizzle. A bit damp outside!";
    case 301:
      return "Drizzle. You might need an umbrella!";
    case 302:
      return "Heavy intensity drizzle. Expect wet conditions!";
    case 310:
      return "Light intensity drizzle rain. A gentle rain is falling!";
    case 311:
      return "Drizzle rain. It's a bit wet outside!";
    case 312:
      return "Heavy intensity drizzle rain. It's quite wet outside!";
    case 313:
      return "Shower rain and drizzle. Expect varying intensities!";
    case 314:
      return "Heavy shower rain and drizzle. Prepare for heavy rain!";
    case 321:
      return "Shower drizzle. Intermittent rain expected!";

    // Rain
    case 500:
      return "Light rain. A pleasant rain is falling!";
    case 501:
      return "Moderate rain. Don't forget your umbrella!";
    case 502:
      return "Heavy intensity rain. It's pouring outside!";
    case 503:
      return "Very heavy rain. Be cautious of flooding!";
    case 504:
      return "Extreme rain. Avoid unnecessary travel!";
    case 511:
      return "Freezing rain. Beware of icy conditions!";
    case 520:
      return "Light intensity shower rain. Intermittent rain ahead!";
    case 521:
      return "Shower rain. Expect sudden bursts of rain!";
    case 522:
      return "Heavy intensity shower rain. Heavy and sudden rain!";
    case 531:
      return "Ragged shower rain. Unpredictable rain patterns!";

    // Snow
    case 600:
      return "Light snow. A light snowfall is occurring!";
    case 601:
      return "Snow. The snow is coming down!";
    case 602:
      return "Heavy snow. Heavy snowfall alert!";
    case 611:
      return "Sleet. Mixed rain and snow!";
    case 612:
      return "Light shower sleet. Sleet showers occurring!";
    case 613:
      return "Shower sleet. Sleet showers might be heavy!";
    case 615:
      return "Light rain and snow. Mixed precipitation!";
    case 616:
      return "Rain and snow. Mixed rain and snowfall!";
    case 620:
      return "Light shower snow. Light snow showers!";
    case 621:
      return "Shower snow. Snow showers occurring!";
    case 622:
      return "Heavy shower snow. Heavy snow showers!";

    // Atmosphere
    case 701:
      return "Mist. Visibility might be reduced!";
    case 711:
      return "Smoke. Reduced visibility due to smoke!";
    case 721:
      return "Haze. Hazy conditions, be careful!";
    case 731:
      return "Sand/ dust whirls. Watch out for reduced visibility!";
    case 741:
      return "Fog. Dense fog, drive carefully!";
    case 751:
      return "Sand. Sand in the air, protect your eyes!";
    case 761:
      return "Dust. Dusty conditions, be cautious!";
    case 762:
      return "Volcanic ash. Ash in the air, stay indoors if possible!";
    case 771:
      return "Squalls. Sudden and intense wind!";
    case 781:
      return "Tornado. Extremely dangerous weather, seek shelter immediately!";

    // // Clear
    // case 800:
    //   return "Clear sky. It's a beautiful day!";

    // // Clouds
    // case 801:
    //   return "Few clouds. A bit cloudy but mostly clear!";
    // case 802:
    //   return "Scattered clouds. Partly cloudy skies!";
    // case 803:
    //   return "Broken clouds. Mostly cloudy!";
    // case 804:
    //   return "Overcast clouds. The sky is grey and cloudy!";

    default:
      return null;
  }
}

// Schedule a task to run every minute
cron.schedule("/30 * * * *", async () => {
  const users = await User.find({ alerts: true });

  users.forEach(async (user) => {
    const { phoneNumber, email, locations, metric } = user;

    if (!email) {
      return;
    }

    locations.forEach(async (location) => {
      const { alerts, latitude, longitude } = location;

      console.log("USER", alerts, latitude, longitude);

      if (!alerts) {
        return;
      }

      const resp = await getWeatherData(latitude, longitude, metric);
      if (resp) {
        const weather = resp?.data[0]?.weather[0];

        if (getOpenWeatherMapAlert(weather?.id)) {
          if (email) {
            emailService.sendEmail(email, weather?.main, weather?.description);
          }
          if (phoneNumber) {
            phoneService.sendText(phoneNumber, weather?.description);
          }
        }
      }
    });
  });
});

cron.schedule("0 * * * *", async () => {
  console.log("HOURLY CRON STARTED", new Date());

  const now = new Date();
  now.setMinutes(now.getMinutes() + 30);
  const unixTimestamp = Math.floor(now.getTime() / 1000);

  const users = await User.find({ alerts: true });

  users.forEach(async (user) => {
    const { phoneNumber, email, locations, metric } = user;

    if (!email) {
      return;
    }

    locations.forEach(async (location) => {
      const { alerts, latitude, longitude } = location;

      if (!alerts) {
        return;
      }

      const alrts = await getAlerts(latitude, longitude, metric);

      if (!alrts) {
        return;
      }

      alrts.forEach(async (alert) => {
        const { event, description } = alert;
        if (email) {
          emailService.sendEmail(email, event, description);
        }
        
        if (phoneNumber) {
          phoneService.sendText(phoneNumber, description);
        }
      });
    });
  });

  console.log("HOURLY CRON ENDED", new Date());
});
