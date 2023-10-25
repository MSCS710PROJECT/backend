const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  name: String,
  latitude: String,
  longitude: String
});

const userSchema = new mongoose.Schema({
  // login credentials
  email: String,
  password: String,
  token: String,

  // account details
  firstName: String,
  lastName: String,
  phoneNumber: String,
  alerts: {
    type: Boolean,
    default: false
  },
  metric: {
    type: Boolean,
    default: false
  },

  // saved locations
  locations: [locationSchema]
});

module.exports = mongoose.model('User', userSchema);
