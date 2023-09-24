const express = require('express');
require('dotenv').config();
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const db = require('./db');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/users', userRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('Server is running on port 3000');
});
