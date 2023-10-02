const bcrypt = require('bcryptjs')
const User = require('../models/user');
const jwt = require('../auth')

exports.createUser = async (req, res) => {
    try {
      // Get user input
      const { username, password } = req.body;
  
      // Validate user input
      if (!(username, password)) {
        res.status(400).send("Username and password required");
      }
  
      // Check if user already exists
      const oldUser = await User.findOne({ username });
  
      if (oldUser) {
        return res.status(409).send("User Already Exist. Please Login");
      }
  
      //Encrypt user password
      encryptedPassword = await bcrypt.hash(password, 10);
  
      // Create user in our database
      const user = await User.create({
        username,
        password: encryptedPassword,
      });
  
      // Create token
      const token = jwt.generateToken(user)
      // save user token
      user.token = token;
  
      // return new user
      res.status(201).json(user);
    } catch (err) {
      console.log(err);
    }
};

exports.login = async (req, res) => {
  try {
    // Get user input
    const { username, password } = req.body;

    // Validate user input
    if (!(username && password)) {
      res.status(400).send("Username and password required");
    }

    // Validate if user exist in our database
    const user = await User.findOne({ username });

    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token
      const token = jwt.generateToken(user)

      // save user token
      user.token = token;

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