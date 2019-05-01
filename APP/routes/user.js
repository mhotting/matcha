// Management of the users routes

const express = require('express');
const userController = require('../controllers/user.js');
const router = express.Router();
const isAuth = require('../middlewares/is-auth');

// GET - '/user'
router.get('/user', isAuth, userController.getInfos);

// GET - '/otherInfo'
router.get('/otherInfo', isAuth, userController.getOtherInfo);

// GET - '/userCompatible'
router.get('/userCompatible', isAuth, userController.getInfosCompatible);

// GET - '/userMatch'
router.get('/userMatch', isAuth, userController.getInfosMatch);


module.exports = router;
