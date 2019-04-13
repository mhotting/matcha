// Controller of all the users stuff (Authentication, retrieving data, etc.)

const User = require('../models/user');
const UserInterest = require('../models/userInterest');
const Interest = require('../models/interest');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const throwError = require('../util/error');

// Register an user in the DB
exports.signup = ((req, res, next) => {
    const mail = req.body.mail;
    const uname = req.body.uname;
    const fname = req.body.fname;
    const lname = req.body.lname;
    const pwd = req.body.pwd;

    bcrypt.hash(pwd, 12)
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

// Feed user's profile with given information - deals with undefined fields - image not managed for the moment
// The interests are received as an array - We create a promise for each array and deal with them one by one
exports.fillup = ((req, res, next) => {
    const gender = req.body.gender;
    const orientation = req.body.orientation;
    const bio = req.body.bio;
    const age = req.body.age;
    const interests = req.body.interests;
    const user = new User();

    user.populate(req.userId)
    .then(() => {
        if (gender)
            user.gender = gender;
        if (orientation)
           user.orientation = orientation;
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
            let promise =  
            Interest.add(interest)
            .then(interestId => {
                if (!interestId)
                    throwError('Intérêt mal formaté', 422);
                return UserInterest.add(req.userId, interestId);
            });
            promises.push(promise);
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

// Management of the login
// Check if user information are correct and the generating a unique token available for one hour
// We send back the token (NEED TO SEE IF WE CAN "AUTOREFRESH" THE TOKEN)
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
            {userId: user.usr_id, username: user.usr_uname},
            ';R)LK4nh=]POwYtcJy=u5aEEI',
            {expiresIn: '1h'}
        );
        res.status(200).json({
            token: token
        });
    })
    .catch(err => next(err));
});