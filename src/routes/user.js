const express = require('express');
const userController = require('../controllers/user');
const auth = require('../middlewares/auth')

const router = express.Router();

router.post('/create', userController.createUser);
router.post('/login', userController.login);
router.get('/testWelcome', auth.isAuthenticated, userController.welcome);
router.post('/resetPassword', auth.isAuthenticated, userController.changePassword)
router.post('/forgotPassword', userController.sendEmailToken)

module.exports = router;
