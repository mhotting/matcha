const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Validation = require('../util/validation');

exports.signup = ((req, res, next) => {
    const mail = req.body.mail;
    const uname = req.body.uname;
    const fname = req.body.fname;
    const lname = req.body.lname;
    const pwd = req.body.pwd;
    const pwdConfirm = req.body.pwdConfirm;
    const validation = new Validation(mail, uname, fname, lname, pwd, pwdConfirm); 

    validation.signUp()
    .then(() => {
        return (bcrypt.hash(pwd, 10));
    })
    .then(hash => {
        const user = new User(mail, uname, fname, lname, hash);
        return user.create();
    })
    .then(([rows, field]) => {
        res.status(201).json({
            message: 'User created'
        });
    })
    .catch(err => next(err));
});

exports.login = ((req, res, next) => {
    let user;
    User.findByUsername(req.body.uname)
    .then((userDb) => {
        user = userDb;
        if (!user)
        {
            const error = new Error('Utilisateur inexistant');
            error.statusCode = 422;
            throw error;
        }
        return bcrypt.compare(req.body.pwd, user.usr_pwd);
    })
    .then(match => {
        if (!match)
        {
            const error = new Error('Mauvais mot de passe');
            error.statusCode = 422;
            throw error;
        }
        const token = jwt.sign(
            {userId: user.usr_id},
            ';R)LK4nh=]POwYtcJy=u5aEEI',
            {expiresIn: '1h'}
        );
        res.status(200).json({
            token: token
        });
    })
    .catch(err => next(err));
});