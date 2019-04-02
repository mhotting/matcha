const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.signup = ((req, res, next) => {
    const user = new User(
        req.body.mail,
        req.body.uname,
        req.body.fname,
        req.body.lname,
        req.body.pwd,
        req.body.pwdConfirm
    );
    user.validation();
    bcrypt.hash(req.body.pwd, 10)
    .then(hash => {
        return user.create(hash);
    })
    .then(([rows, field]) => {
        res.status(201).json({
            message: 'User created'
        });
    })
    .catch(err => next(err));
});

exports.login = ((req, res, next) => {
    User.findByUsername(req.body.uname)
    .then(([rows, fields]) => {
        if (rows.length === 0)
        {
            const error = new Error('Utilisateur inexistant');
            error.statusCode = 422;
            throw error;
        }
        const user = rows[0];
        return bcrypt.compare(req.body.pwd, rows[0].usr_pwd);
    })
    .then(match => {
        if (!match)
        {
            const error = new Error('Mauvais mot de passe');
            error.statusCode = 422;
            throw error;
        }
        const token = jwt.sign({userId: user.usr_id},
            ';R)LK4nh=]POwYtcJy=u5aEEI',
            {expiresIn: '1h'});
        res.status(200).json({
            token: token
        });
    })
    .catch(err => next(err));
});