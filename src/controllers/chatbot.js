const axios = require('axios');

const OPENAI_API_URL = 'https://api.openai.com/v1/engines/davinci/completions';
const OPENAI_API_KEY = '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';

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