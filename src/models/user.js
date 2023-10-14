const mongoose = require('mongoose');

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
  locations: [String]
});

module.exports = mongoose.model('User', userSchema);
