const express = require('express');
const auth = require('./controllers/auth'); 
const msg = require('./controllers/messages');

const isAuth = require('./middlewares/is-auth'); 
const validation = require('./middlewares/validation');

const router = express.Router();

router.post('/signup', validation.signup, auth.signup);

router.post('/login', auth.login);

router.get('/chat', isAuth, msg.getConvs);

router.get('/chat/:uname', isAuth, msg.getMessagesUser);

router.post('/chat/:uname', isAuth, msg.postMessage);

router.put('/fillup', isAuth, validation.fillup, auth.fillup);



module.exports = router;
