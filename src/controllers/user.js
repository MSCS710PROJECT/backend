const bcrypt = require('bcryptjs')
const User = require('../models/user');
const jwt = require('../auth')
const emailService = require('../services/email');
const phoneService = require('../services/phone');
const {ObjectId} = require('mongodb');

exports.createUser = async (req, res) => {
    try {
      // Get user input
      const { email, password, firstName, lastName, phoneNumber, alerts, insights} = req.body;
  
      // Validate user input
      if (!(email, password, firstName, lastName, phoneNumber)) {
        res.status(400).send("Email, password, name, and phone number required");
      }
  
      // Check if user already exists
      const oldUser = await User.findOne({ email });
  
      if (oldUser) {
        return res.status(409).send("User Already Exist. Please Login");
      }
  
      //Encrypt user password
      encryptedPassword = await bcrypt.hash(password, 10);
  
      // Create user in our database
      const user = await User.create({
        email,
        password: encryptedPassword,
        firstName,
        lastName,
        phoneNumber,
        alerts,
        insights,
        alertPreference
      });
  
      // Create token
      const token = jwt.generateToken(user)
      // save user token
      user.token = token;
      // remove the password part before sending data back
      user.password = undefined
  
      // return new user
      res.status(201).json(user);
    } catch (err) {
      res.status(500).send(JSON.stringify({
        message: 'Internal Server Error',
        error: err
      }));
    }
};

exports.login = async (req, res) => {
  try {
    // Get user input
    const { email, password } = req.body;

    // Validate user input
    if (!(email && password)) {
      res.status(400).send("Email and password required");
    }

    // Validate if user exist in our database
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token
      const token = jwt.generateToken(user)

      // save user token
      user.token = token;
      // remove the password part before sending data back
      user.password = undefined

      // user
      res.status(200).json(user);
      return
    }

    res.status(400).send("Invalid Credentials");
  } catch (err) {
    res.status(500).send(JSON.stringify({
      message: 'Internal Server Error',
      error: err
    }));
  }
}

exports.welcome = async (req, res) => {
  res.status(200).send('Welcome!')
}

exports.getDetails = async (req, res) => {
  try {
    const user = await User.findOne({ _id: new ObjectId(req.user.id) });
    if (!user) {
      return res.status(409).send("User does not exist");
    }

    // remove the password part before sending data back
    user.password = undefined;

    // Return user data
    res.status(200).json(user);

  } catch (err) {
    res.status(500).send(JSON.stringify({
      message: 'Internal Server Error',
      error: err
    }));
  }
}

exports.changeDetails = async (req, res) => {
  try {
    // Update user with data in body if exists
    console.log('test')
    const user = await User.findOneAndUpdate({ _id: new ObjectId(req.user.id) }, req.body, { returnDocument: "after" });
    if (!user) {
      return res.status(409).send("User does not exist");
    }

    // remove the password part before sending data back
    user.password = undefined;

    // Return user data
    res.status(200).json(user);

  } catch (err) {
    res.status(500).send(JSON.stringify({
      message: 'Internal Server Error',
      error: err
    }));
  }
}

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findOneAndDelete({ _id: new ObjectId(req.user.id) });
    if (!user) {
      return res.status(409).send("User does not exist");
    }

    res.status(200).send("Successfully deleted user");

  } catch (err) {
    res.status(500).send(JSON.stringify({
      message: 'Internal Server Error',
      error: err
    }));
  }
}

exports.changePassword = async (req, res) => {
  try {
    // Get user input
    const { password } = req.body;

    // Validate user input
    if (!password) {
      res.status(400).send("Password required");
    }

    // Validate if user exist in our database
    const user = await User.findOne({ _id: new ObjectId(req.user.id) });
    if (!user) {
      return res.status(409).send("User does not exist");
    }

    //Encrypt user password
    encryptedPassword = await bcrypt.hash(password, 10);
  
    // Update the database
    await User.updateOne({ _id: new ObjectId(req.user.id) }, {$set:{ password:encryptedPassword }});

    res.status(200).send("Successfully changed password")

  } catch (err) {
    res.status(500).send(JSON.stringify({
      message: 'Internal Server Error',
      error: err
    }))
  }
}

exports.sendEmailToken = async (req, res) => {
  try {
    // Get user input
    const { email } = req.body;

    // Validate user input
    if (!email) {
      res.status(400).send("Email required");
    }

    // Validate if user exist in our database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(409).send("User does not exist");
    }

    // Get a new token
    const token = jwt.generateToken(user)

    // Create a link to the front end
    const link = `https://marist-weather-dashboard.vercel.app/reset-password/?email=${email}&access-token=${token}`

    // Send an email
    emailService.sendEmail(email, "Password Change Link", `Click this link to reset password: ${link}`)

    res.status(200).send("Sent password change email")

  } catch (err) {
    res.status(500).send(JSON.stringify({
      message: 'Internal Server Error',
      error: err
    }))
  }
}

exports.sendEmailAlert = async (req, res) => {
  try {
    // Get user input
    const { message } = req.body;

    // Validate user input
    if (!message) {
      res.status(400).send("Message required");
    }

    // Validate if user exist in our database
    const user = await User.findOne({ _id: new ObjectId(req.user.id) });
    if (!user) {
      return res.status(409).send("User does not exist");
    }

    // Send an email only if alerts are enabled for this user
    if (user.alerts) {
      emailService.sendEmail(user.email, "Weather Dashboard Alert", message)
    }

    res.status(200).send("Sent weather alert to email")

  } catch (err) {
    res.status(500).send(JSON.stringify({
      message: 'Internal Server Error',
      error: err
    }))
  }
}

exports.sendTextAlert = async (req, res) => {
  try {
    // Get user input
    const { message } = req.body;

    // Validate user input
    if (!message) {
      res.status(400).send("Message required");
    }

    // Validate if user exist in our database
    const user = await User.findOne({ _id: new ObjectId(req.user.id) });
    if (!user) {
      return res.status(409).send("User does not exist");
    }

    if (!user.phoneNumber) {
      return res.status(200).send("User does not have a phone number");
    }

    // Send an email only if alerts are enabled for this user
    if (user.alerts) {
      const resp = await phoneService.sendText(user.phoneNumber, message)

      console.log(resp)
    }

    res.status(200).send("Sent weather alert to email")

  } catch (err) {
    res.status(500).send(JSON.stringify({
      message: 'Internal Server Error',
      error: err
    }))
  }
}

exports.saveLocation = async (req, res) => {
  try {
    const { location } = req.body;

    if (!(location && location.name && location.latitude && location.longitude)) {
      return res.status(400).send("location details are required");
    }

    const user = await User.findOneAndUpdate(
      { _id: new ObjectId(req.user.id) },
      { $addToSet: { locations: location } },
      { returnDocument: "after" }
    );

    if (!user) {
      return res.status(409).send("User does not exist");
    }

    user.password = undefined;

    res.status(200).json(user);

  } catch (err) {
    res.status(500).send(JSON.stringify({
      message: 'Internal Server Error',
      error: err
    }));
  }
}

exports.deleteLocation = async (req, res) => {
  try {
    const { _id, update, alerts } = req.body;

    if (!_id) {
      return res.status(400).send("location id is required");
    }

    let user;

    if (update) {
      user = await User.findOneAndUpdate(
        { _id: new ObjectId(req.user.id) },
        { alerts },
        { returnDocument: "after" }
      );
    } else {
      user = await User.findOneAndUpdate(
        { _id: new ObjectId(req.user.id) },
        { $pull: { locations: { _id: new ObjectId(_id) } } },
        { returnDocument: "after" }
      );
    }

    if (!user) {
      return res.status(409).send("User does not exist");
    }

    user.password = undefined;

    res.status(200).json(user);

  } catch (err) {
    res.status(500).send(JSON.stringify({
      message: 'Internal Server Error',
      error: err
    }));
  }
}

const precision = 8;
function locationEquals (loc1, loc2) {
  if (!(loc1 && loc1.name && loc1.latitude && loc1.longitude) ||
      !(loc2 && loc2.name && loc2.latitude && loc2.longitude)) {
    return false;
  }

  return (loc1.name == loc2.name &&
    loc1.latitude.substring(0, precision) == loc2.latitude.substring(0, precision) &&
    loc1.longitude.substring(0, precision) == loc2.longitude.substring(0, precision));
}

exports.saveHistory = async (req, res) => {
  try {
    const { location } = req.body;

    if (!(location && location.name && location.latitude && location.longitude)) {
      return res.status(400).send("location details are required");
    }

    // first find if the user exists
    var user = await User.findOne(
      { _id: new ObjectId(req.user.id) }
    );

    if (!user) {
      return res.status(409).send("User does not exist");
    }

    // next find if the location has already been searched
    const locationHistory = user.searchHistory.find(search => locationEquals(search.location, location))

    if (locationHistory) {
      // if searched before, find and add one to the history
      user = await User.findOneAndUpdate(
        { _id: new ObjectId(req.user.id), "searchHistory.location":locationHistory.location},
        { $set: {"searchHistory.$.searches":locationHistory.searches+1} },
        { returnDocument: "after" }
      )
    } else {
      // otherwise, add a new entry to the search history
      user = await User.findOneAndUpdate(
        { _id: new ObjectId(req.user.id) },
        { $addToSet: { searchHistory: {location:location, searches:1} } },
        { returnDocument: "after" }
      )
    }

    user.password = undefined;

    res.status(200).json(user);

  } catch (err) {
    res.status(500).send(JSON.stringify({
      message: 'Internal Server Error',
      error: err
    }));
  }
}

exports.deleteHistory = async (req, res) => {
  try {
    const { _id } = req.body;

    // make sure there is a provided id
    if (!_id) {
      return res.status(400).send("search history id is required");
    }

    // remove the given id from the searchHistory array (if user exists)
    const user = await User.findOneAndUpdate(
      { _id: new ObjectId(req.user.id) },
      { $pull: { searchHistory: { _id: new ObjectId(_id) } } },
      { returnDocument: "after" }
    );

    if (!user) {
      return res.status(409).send("User does not exist");
    }

    // remove the password before sending info back
    user.password = undefined;

    res.status(200).json(user);

  } catch (err) {
    res.status(500).send(JSON.stringify({
      message: 'Internal Server Error',
      error: err
    }));
  }
}

exports.saveRoute = async (req, res) => {
  try {
    const { route } = req.body;

    // Check if all of the route information is there
    if (!(route && route.mode &&
        route.start.name && route.start.latitude && route.start.longitude &&
        route.end.name && route.end.latitude && route.end.longitude)) {
      return res.status(400).send("route details are required (start location, end location, and mode)");
    }

    // Add route to routes array
    const user = await User.findOneAndUpdate(
      { _id: new ObjectId(req.user.id) },
      { $addToSet: { routes: route } },
      { returnDocument: "after" }
    );

    if (!user) {
      return res.status(409).send("User does not exist");
    }

    // Remove password before sending info back
    user.password = undefined;

    res.status(200).json(user);

  } catch (err) {
    res.status(500).send(JSON.stringify({
      message: 'Internal Server Error',
      error: err
    }));
  }
}

exports.deleteRoute = async (req, res) => {
  try {
    const { _id } = req.body;

    // Check that there is an ID
    if (!_id) {
      return res.status(400).send("route id is required");
    }

    // Remove associated ID from the routes array
    const user = await User.findOneAndUpdate(
      { _id: new ObjectId(req.user.id) },
      { $pull: { routes: { _id: new ObjectId(_id) } } },
      { returnDocument: "after" }
    );

    if (!user) {
      return res.status(409).send("User does not exist");
    }

    // Remove password before sending info back
    user.password = undefined;

    res.status(200).json(user);

  } catch (err) {
    res.status(500).send(JSON.stringify({
      message: 'Internal Server Error',
      error: err
    }));
  }
}