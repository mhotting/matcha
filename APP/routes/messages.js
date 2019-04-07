// Management of the messages routes

const express = require('express');
const msgController = require('../controllers/messages');

const isAuth = require('../middlewares/is-auth');

const router = express.Router();

router.get('/chat', isAuth, msgController.getConvs);

router.get('/chat/:uname', isAuth, msgController.getMessagesUser);

router.post('/chat/:uname', isAuth, msgController.postMessage);

module.exports = router;
