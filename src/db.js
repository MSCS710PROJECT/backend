const mongoose = require('mongoose');
const functions = require('firebase-functions');
const URI = functions.config().mongo.uri || process.env.MONGO_URI;

let instance = null;

class Database {
  constructor() {
    if (!instance) {
      instance = this;
      this.connect();
    }
    return instance;
  }

  async connect() {
    try {
      await mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true });
      console.log('Connected to MongoDB');
    } catch (error) {
      console.error('Database connection failed:', error);
    }
  }
}

module.exports = new Database();
