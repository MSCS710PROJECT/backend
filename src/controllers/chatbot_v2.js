const OpenAI = require('openai');

const OPENAI_API_KEY = process.env.OPENAI_API_KEY; // Set your API key as an environment variable

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
  baseApiUrl: 'https://api.openai.com/v1', // The API base URL
});

exports.getResponse = async (req, res) => {
    const userMessage = req.body.message;

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo-1106",
            messages: [
                {
                    role: "system",
                    content: "You are a helpful assistant designed to output Weather Information in Text under 150.",
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
}

exports.getTouristAttractions = async (req, res) => {
    const { start, end } = req.body;

    const message = `Generate a JSON list of up to 10 priority tourist attractions along the route between ${start} and ${end}, which should be within 50 miles of the route, evenly spaced across all the states. Include approximate driving duration from Poughkeepsie and the distance from the origin for each attraction.`;

    try {
        const response = await openai.chat.completions.create({
            messages: [
                {
                  role: "system",
                  content: "You are a helpful assistant designed to output JSON array named attractions with fields name (string), state (string), duration (number in hours, minutes should be rounded to the nearest decimal of hours), distance (number in miles) and coordinates (lat and lng object).",
                },
                { role: "user", content: message },
              ],
              model: "gpt-3.5-turbo-1106",
              response_format: { type: "json_object" },
        });

        const chatGPTResponse = response.choices[0].message;
        const attractions = JSON.parse(chatGPTResponse.content)?.attractions;
        res.json({ attractions });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Sorry, I couldn't fetch route attractions." });
    }
}
