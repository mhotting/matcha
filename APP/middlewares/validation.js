// Several validation middlewares

const Validation = require('../util/validation');
const User = require('./../models/user');
const throwError = require('./../util/error');


// Signup validator checking for the expected fields and if they are not already in the DB
exports.signup = (req, res, next) => {
    const mail = req.body.mail;
    const uname = req.body.uname;
    const fname = req.body.fname;
    const lname = req.body.lname;
    const pwd = req.body.pwd;
    const pwdConfirm = req.body.pwdConfirm;
    const validation = new Validation(mail, uname, fname, lname, pwd, pwdConfirm);

    validation.signUp()
        .then(() => {
            next();
        })
        .catch(err => next(err));
};

// Fillup validator: checks inputs, prevent undefined problems
exports.fillup = (req, res, next) => {
    const gender = req.body.gender;
    const orientation = req.body.orientation;
    const bio = req.body.bio;
    const age = req.body.age;
    const interests = req.body.interests;
    const validation = new Validation();

    validation.setVars(gender, orientation, bio, age, interests);
    validation.fillUp();
    next();
};

// Interact validation - checks if the fields 'userId' and 'otherId' are defined and if they exist in the DB
exports.interactExistingId = (req, res, next) => {
    const userId = req.body.userId;
    const otherId = req.body.otherId;

    if (!userId || !otherId) {
        throwError('Données manquantes', 400);
    }
    User.findById(userId)
        .then(user => {
            if (!user) {
                throwError('Utilisateur inexistant', 422);
            }
            return (User.findById(otherId));
        })
        .then(user => {
            if (!user) {
                throwError('Utilisateur inexistant', 422);
            }
            next();
        })
        .catch(err => next(err));
};

// Interact Validation - checks if the fields 'userId' and 'otherId' are different
exports.sameId = (req, res, next) => {
    const userId = req.body.userId;
    const otherId = req.body.otherId;

    if (userId === otherId) {
        throwError('Ids identiques', 400);
    }
    next();
}
