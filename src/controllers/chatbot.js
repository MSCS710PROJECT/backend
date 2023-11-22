const axios = require('axios');
const functions = require('firebase-functions');

const OPENAI_API_URL = 'https://api.openai.com/v1/engines/text-curie-001/completions';
const OPENAI_API_KEY = functions.config().openapi?.key || process.env.OPENAI_API_KEY;

exports.getResponse = async (req, res) => {
    const userMessage = req.body.message;

    // Check if the message is related to weather
    // if (!userMessage.toLowerCase().includes('weather')) {
    //     return res.json({ message: "I can only provide weather information." });
    // }

    try {
        const response = await axios.post(OPENAI_API_URL, {
            prompt: userMessage,
            max_tokens: 150
        }, {
            headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        const chatGPTResponse = response.data.choices[0].text.trim();
        res.json({ message: chatGPTResponse });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Sorry, I couldn't fetch the weather information." });
    }
}

exports.getTouristAttractions = async (req, res) => {
    const { start, end } = req.body;

    // Check if the message is related to weather
    // if (!userMessage.toLowerCase().includes('weather')) {
    //     return res.json({ message: "I can only provide weather information." });
    // }

    const message = `What are 10 tourist attractions on the route between ${start} and ${end}? Format the answer in a numbered list.`

    try {
        const response = await axios.post(OPENAI_API_URL, {
            prompt: message,
            max_tokens: 150
        }, {
            headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        const chatGPTResponse = response.data.choices[0].text.trim();
        const attractionArray = chatGPTResponse.split(/\s*\d+\.\s*/);
        attractionArray.shift();

        //console.log(attractionArray);

        res.json({ locations: attractionArray });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Sorry, I couldn't fetch route attractions." });
    }
}