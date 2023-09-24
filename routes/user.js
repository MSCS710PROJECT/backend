const express = require('express');
const userController = require('../controllers/user');

const router = express.Router();

router.post('/create', userController.createUser);
// Add other routes as needed

module.exports = router;
