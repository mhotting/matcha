const express = require('express');
const auth = require('./controllers/auth'); 
const isAuth = require('./util/is-auth'); 
const router = express.Router();



router.post('/signup', auth.signup);

router.post('/login', auth.login);

router.put('/fillup', isAuth, auth.fillup);

module.exports = router;
