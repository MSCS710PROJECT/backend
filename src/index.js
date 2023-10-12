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
    const apiPath = req.path.replace('/tomorrow', '');
    const queryParams = { ...req.query, apikey: functions.config().tomorrowio?.key || process.env.TOMORROW_IO_API_KEY };
    const apiUrl = `${TOMORROW_API_BASE_URL}${apiPath}`;
    const axiosConfig = {
      method: req.method,
      url: apiUrl,
      params: queryParams,
    };

    if (['post', 'put', 'patch'].includes(req.method.toLowerCase())) {
      axiosConfig.data = req.body;
    }

    const apiResponse = await axios(axiosConfig);

    if (apiUrl.includes("forecast") && queryParams["fields"]) {
      for (let snapshot of apiResponse.data.timelines.hourly || apiResponse.data.timelines.daily) {
        let newValues = {};
        for (let attr of queryParams["fields"].split(',')) {
          newValues[attr] = snapshot.values[attr];
        }
        snapshot.values = newValues;
      }
    }

    res.json(apiResponse.data);
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal Server Error');
  }
});

app.use('/', routes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

exports.api = functions.https.onRequest(app)