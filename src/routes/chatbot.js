const express = require('express');
const auth = require('../middlewares/auth');
const chatBotController = require('../controllers/chatbot');

const router = express.Router();

router.post('/query', auth.isAuthenticated, chatBotController.getResponse);

module.exports = router;
