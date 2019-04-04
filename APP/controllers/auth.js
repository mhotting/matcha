const User = require('../models/user');
const UserInterest = require('../models/userInterest');
const Interest = require('../models/interest');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Validation = require('../util/validation');
const throwError = require('../util/error');

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
        return (bcrypt.hash(pwd, 12));
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

exports.fillup = ((req, res, next) => {
    const gender = req.body.gender;
    const orientation = req.body.orientation;
    const bio = req.body.bio;
    const age = req.body.age;
    const interests = req.body.interests;
    const validation = new Validation();
    validation.setVars(gender, orientation, bio, age, interests);

    validation.fillUp();
    const user = new User();
    user.populate(req.userId)
    .then(() => {
        if (gender)
            user.gender = gender;
        //if (orientation)
        //    user.orientation = orientation;
        if (bio)
            user.bio = bio;
        if (age)
            user.age = age;
    })
    .then(() => {
        return user.update();
    })
    .then(() => {
        if (!interests)
            return ;
        const promises = [];
        for (let interest of interests) {
            if (interest && typeof interest === 'string')
            {
                let promise =  
                Interest.add(interest)
                .then(interestId => {
                    return UserInterest.add(req.userId, interestId);
                });
                promises.push(promise);
            }
        }
        return Promise.all(promises);
    })
    .then(() => {
        res.status(201).json({
            message: 'Informations mises à jour'
        });
    })
    .catch(err => next(err));
});

exports.login = ((req, res, next) => {
    if (!req.body.uname || !req.body.pwd)
        throwError('Champ(s) manquant(s)', 422);
    let user;
    User.findByUsername(req.body.uname)
    .then((userDb) => {
        user = userDb;
        if (!user)
            throwError('Utilisateur inexistant', 422);
        return bcrypt.compare(req.body.pwd, user.usr_pwd);
    })
    .then(match => {
        if (!match)
            throwError('Mauvais mot de passe', 422);
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