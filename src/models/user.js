const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  name: String,
  latitude: String,
  longitude: String
});

const routeSchema = new mongoose.Schema({
  start: locationSchema,
  end: locationSchema,
  mode: String
})

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
  locations: [locationSchema],

  searchHistory: [{
    location: locationSchema,
    searches: Number
  }],

  routes: [routeSchema],

  insights: {
    type: Boolean,
    default: false
  },

  alertPreference: [
    {
      type: String
    }
  ],
  settings: {
    temperature: {
      min: {
        type: Number,
        default: 32
      },
      max: {
        type: Number,
        default: 86
      }
    },
    uvIndex: {
      min: {
        type: Number,
        default: 3
      },
      max: {
        type: Number,
        default: 7
      }
    },
    windSpeed: {
      min: {
        type: Number,
        default: 10
      },
      max: {
        type: Number,
        default: 25
      }
    },
    precipitation: {
      min: {
        type: Number,
        default: 20
      },
      max: {
        type: Number,
        default: 50
      }
    }
  }
});

module.exports = mongoose.model('User', userSchema);
