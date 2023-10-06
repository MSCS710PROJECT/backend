const express = require('express');
require('dotenv').config();
const functions = require('firebase-functions');
const cors = require('cors');
const axios = require('axios');
const routes = require('./routes/index');
const helmet = require('helmet');
const db = require('./db');
const port = 3000;
const TOMORROW_API_BASE_URL = 'https://api.tomorrow.io/v4';

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());

app.all('/tomorrow/*', async (req, res) => {
  try {
    // Extract the path and query parameters from the original request
    const apiPath = req.path.replace('/tomorrow', '');
    const queryParams = { ...req.query, apikey: functions.config().tomorrowio?.key || process.env.TOMORROW_IO_API_KEY };
    
    // Construct the URL for the Tomorrow API
    const apiUrl = `${TOMORROW_API_BASE_URL}${apiPath}`;
    
    // Make a request to the Tomorrow API
    const apiResponse = await axios({
      method: req.method,
      url: apiUrl,
      params: queryParams,
      data: req.body,
    });
    
    // Send the API response back to the client
    res.json(apiResponse.data);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.use('/', routes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

exports.api = functions.https.onRequest(app)