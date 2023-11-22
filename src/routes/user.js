const express = require('express');
const userController = require('../controllers/user');
const auth = require('../middlewares/auth')

const router = express.Router();

// account creation and login
router.post('/create', userController.createUser);
router.post('/login', userController.login);
router.get('/testWelcome', auth.isAuthenticated, userController.welcome);

// password reset
router.post('/resetPassword', auth.isAuthenticated, userController.changePassword)
router.post('/forgotPassword', userController.sendEmailToken)

// user data
router.get('/user', auth.isAuthenticated, userController.getDetails)
router.patch('/user', auth.isAuthenticated, userController.changeDetails)
router.delete('/user', auth.isAuthenticated, userController.deleteUser)

// user location data
router.post('/userLocation', auth.isAuthenticated, userController.saveLocation)
router.patch('/userLocation', auth.isAuthenticated, userController.deleteLocation)

router.post('/userHistory', auth.isAuthenticated, userController.saveHistory)
router.patch('/userHistory', auth.isAuthenticated, userController.deleteHistory)

router.post('/userRoute', auth.isAuthenticated, userController.saveRoute)
router.patch('/userRoute', auth.isAuthenticated, userController.deleteRoute)

// alerts
router.post('/emailAlert', auth.isAuthenticated, userController.sendEmailAlert)

module.exports = router;
