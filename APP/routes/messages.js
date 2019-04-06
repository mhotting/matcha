const express = require('express');
const msg = require('../controllers/messages');

const isAuth = require('../middlewares/is-auth');

const router = express.Router();

router.get('/chat', isAuth, msg.getConvs);

router.get('/chat/:uname', isAuth, msg.getMessagesUser);

router.post('/chat/:uname', isAuth, msg.postMessage);

module.exports = router;
