const express = require('express');
const auth = require('../middlewares/auth');
const chatBotController = require('../controllers/chatbot_v2');

const router = express.Router();

router.post('/query', chatBotController.getResponse);
router.post('/attractions', chatBotController.getTouristAttractions)

module.exports = router;
