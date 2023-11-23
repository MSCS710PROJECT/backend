const OpenAI = require("openai");
const { LRUCache } = require('lru-cache')

const cache = new LRUCache({
  max: 100, // The maximum number of items to store in the cache
  maxAge: 1000 * 60 * 60 * 24, // The maximum age of an item in the cache, in milliseconds
});

const OPENAI_API_KEY = process.env.OPENAI_API_KEY; // Set your API key as an environment variable

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
  baseApiUrl: "https://api.openai.com/v1", // The API base URL
});

exports.getResponse = async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-1106",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant designed to output Weather Information in Text under 150.",
        },
        { role: "user", content: userMessage },
      ],
      response_format: { type: "text" },
    });

    res.json({ message: response.choices[0].message.content });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Sorry, I couldn't fetch the response." });
  }
};

exports.getTouristAttractions = async (req, res) => {
  const { start, end, waypoints, query = "tourist attractions" } = req.body;

  const cacheKey = `${query}_${start}_${end}`;

  if (cache.has(cacheKey)) {
    return res.json({ attractions: cache.get(cacheKey) });
  }

  const message = `What are 10 priority ${query} along the driving route between ${start} and ${end} starting 200 miles from ${start}, with ${waypoints} waypoints on the route. locations should be evenly spread and spaced across all the states along the driving route and should be within 30 miles range (deviuation) of the route. Include approximate driving duration from Poughkeepsie and the distance from the origin for each location. Order the array in ascending order of distance or next state from the origin.`;

  try {
    const response = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            `You are a helpful assistant designed to output consistent priority ${query} along the route. The response should be a JSON array named attractions with fields name (string), state (string), duration (number in hours, minutes should be rounded to the nearest decimal of hours), distance (number in miles) and coordinates (lat and lng object).`,
        },
        { role: "user", content: message },
      ],
      model: "gpt-3.5-turbo-1106",
      response_format: { type: "json_object" },
    });

    const chatGPTResponse = response.choices[0].message;
    const attractions = JSON.parse(chatGPTResponse.content)?.attractions;
    cache.set(cacheKey, attractions);
    res.json({ attractions });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: [] });
  }
};
