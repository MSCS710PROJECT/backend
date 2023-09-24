const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  // other fields
});

module.exports = mongoose.model('User', userSchema);
