const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  firstName: String,
  lastName: String,
  phoneNumber: String,
  alerts: Boolean,
  token: String
});

module.exports = mongoose.model('User', userSchema);
