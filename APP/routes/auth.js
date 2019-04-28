// Management of the user routes (authentication, updating data, etc.)

const express = require('express');
const authController = require('../controllers/auth');

const isAuth = require('../middlewares/is-auth'); 
const validation = require('../middlewares/validation');

const router = express.Router();

// POST '/auth/signup'
router.post('/signup', validation.signup, authController.signup);

// POST '/auth/login'
router.post('/login', authController.login);

// PUT '/auth/fillup'
router.put('/fillup', isAuth, validation.fillup, authController.fillup);

// PUT '/auth/updateSignup'
router.put('/updateSignup', isAuth, validation.updateSingup, validation.updatePassword, authController.updateSignup);

// PUT '/auth/activate'
router.put('/activate', authController.activate);


module.exports = router;
