// Management of the notifications routes

const express = require('express');

const isAuth = require('../middlewares/is-auth');

const notifController = require('./../controllers/notifications.js');

const router = express.Router();

// GET - '/notifications'
router.get('/notifications', isAuth, notifController.getNotifications);

// GET - '/notifications/last'
router.get('/notifications/last', isAuth, notifController.getLastNotifications);


module.exports = router;
