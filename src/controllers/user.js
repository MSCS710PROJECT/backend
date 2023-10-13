const bcrypt = require('bcryptjs')
const User = require('../models/user');
const jwt = require('../auth')
const emailService = require('../services/email')

exports.createUser = async (req, res) => {
    try {
      // Get user input
      const { email, password, firstName, lastName, phoneNumber, alerts} = req.body;
  
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
        alerts
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
      console.log(err);
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
    console.log(err);
  }
}

exports.welcome = async (req, res) => {
  res.status(200).send('Welcome!')
}

exports.getDetails = async (req, res) => {
  try {
    // Get user input
    const { email } = req.body;

    // Validate user input
    if (!email) {
      return res.status(400).send("Email required");
    }

    // Validate if user exist in our database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(409).send("User does not exist");
    }

    // remove the password part before sending data back
    user.password = undefined;

    // Return user data
    res.status(200).json(user);

  } catch (err) {
    console.log(err);
  }
}

exports.changeDetails = async (req, res) => {
  try {
    // Get user input
    const { email } = req.body;

    // Validate user input
    if (!email) {
      return res.status(400).send("Email required");
    }

    // Update user with data in body if exists
    const user = await User.findOneAndUpdate({ email }, req.body, { returnDocument: "after" });
    if (!user) {
      return res.status(409).send("User does not exist");
    }

    // remove the password part before sending data back
    user.password = undefined;

    // Return user data
    res.status(200).json(user);

  } catch (err) {
    console.log(err);
  }
}

exports.deleteUser = async (req, res) => {
  try {
    // Get user input
    const { email } = req.body;

    // Validate user input
    if (!email) {
      return res.status(400).send("Email required");
    }

    // Validate if user exist in our database
    const user = await User.findOneAndDelete({ email });
    if (!user) {
      return res.status(409).send("User does not exist");
    }

    res.status(200).send("Successfully deleted user");

  } catch (err) {
    console.log(err);
  }
}

exports.changePassword = async (req, res) => {
  try {
    // Get user input
    const { email, password } = req.body;

    // Validate user input
    if (!(email && password)) {
      res.status(400).send("Email and new password required");
    }

    // Validate if user exist in our database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(409).send("User does not exist");
    }

    //Encrypt user password
    encryptedPassword = await bcrypt.hash(password, 10);
  
    // Update the database
    await User.updateOne({ email }, {$set:{ password:encryptedPassword }});

    res.status(200).send("Successfully changed password")

  } catch (err) {
    console.log(err)
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
    console.log(err)
  }
}