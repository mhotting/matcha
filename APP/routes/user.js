// Management of the users routes

const express = require('express');
const userController = require('../controllers/user.js');
const router = express.Router();
const isAuth = require('../middlewares/is-auth');

// GET - '/user'
router.get('/user', isAuth, userController.getInfos);

// GET - '/user'
router.get('/userCompatible', isAuth, userController.getInfosCompatible);
/*
// GET - '/userMatch'
router.get('/userMatch', isAuth, userController.getInfosMatch);
*/

module.exports = router;
