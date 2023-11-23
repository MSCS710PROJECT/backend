const express = require('express');
const auth = require('../middlewares/auth');
const chatBotController = require('../controllers/chatbot_v2');

const router = express.Router();

router.post('/query', auth.isAuthenticated, chatBotController.getResponse);
router.post('/attractions', auth.isAuthenticated, chatBotController.getTouristAttractions)

module.exports = router;
