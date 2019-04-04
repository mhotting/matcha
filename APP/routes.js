const express = require('express');
const auth = require('./controllers/auth'); 

const isAuth = require('./middlewares/is-auth'); 
const validation = require('./middlewares/validation');

const router = express.Router();

router.post('/signup', validation.signup, auth.signup);

router.post('/login', auth.login);

router.post('/chat/:scdUserId', );

router.get('/chat/:scdUserId', );

router.put('/fillup', isAuth, validation.fillup, auth.fillup);

module.exports = router;
