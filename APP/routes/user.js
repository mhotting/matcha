const express = require('express');
const userController = require('../controllers/user.js');
const router = express.Router();
const isAuth = require('../middlewares/is-auth');

router.get('/user', isAuth, userController.getInfos);
module.exports = router;
