const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  token: String
  // other fields
});

module.exports = mongoose.model('User', userSchema);
