// Several validation middlewares

const Validation = require('../util/validation');
const User = require('./../models/user');
const throwError = require('./../util/error');
const bcrypt = require('bcrypt');


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
    const userId = req.userId;
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
    const userId = req.userId;
    const otherId = req.body.otherId;

    if (userId == otherId) {
        throwError('Ids identiques', 400);
    }
    next();
}

// Update sinup validator: checks inputs, prevent undefined problems
exports.updateSingup = (req, res, next) => {
    let uname = req.body.uname;
    let fname = req.body.fname;
    let lname = req.body.lname;
    let mail = req.body.mail;
    let currentUser;
    const userId = req.userId;

    User.findById(userId)
        .then(user => {
            currentUser = user;
            // Dealing with undefined input
            if (!currentUser) {
                throwError('Utilisateur inexistant', 422);
            }
            if (uname === undefined) {
                uname = currentUser.usr_uname;
            }
            if (fname === undefined) {
                fname = currentUser.usr_fname;
            }
            if (lname === undefined) {
                lname = currentUser.usr_lname;
            }
            if (mail === undefined) {
                mail = currentUser.usr_email;
            }
        })
        .then(() => {
            // Length validation + check of the username
            if (mail.length >= 254 || uname.length >= 254 || fname.length >= 254 || lname.length >= 254)
                throwError('Longueur de champ excessive', 400);
            if (uname !== currentUser.usr_uname) {
                return (Validation.fUsername(uname));
            }
        })
        .then(user => {
            // Check of the email
            if (user) {
                throwError('Le nom d\'utilisateur est déjà pris', 400);
            }
            if (mail !== currentUser.usr_email) {
                return (Validation.fMail(mail));
            }
        })
        .then(user => {
            if (user) {
                throwError('Le nom d\'utilisateur est déjà pris', 400);
            }
            // Saving the results in the request and reaching next middleware
            req.uname = uname;
            req.fname = fname;
            req.lname = lname;
            req.mail = mail;
            next();
        })
        .catch(err => next(err));
};

// Update sinup validator: checks inputs, prevent undefined problems
exports.updatePassword = (req, res, next) => {
    const userId = req.userId;
    let currentUser;
    const oldPwd = req.body.oldPwd;
    const pwd = req.body.pwd;
    const pwdConfirm = req.body.pwdConfirm;

    if(oldPwd === undefined) {
        return (next());
    }

    User.findById(userId)
        .then(user => {
            // Checking if user exists
            currentUser = user;
            if (!currentUser)
                throwError('Utilisateur inexistant', 422);
            return bcrypt.compare(oldPwd, user.usr_pwd);
        })
        .then(match => {
            // Checking if old password is correct
            if (!match) {
                throwError('Ancien mot de passe erroné', 422);
            }
            
            // Checking if pwd and pwdConfirm are defined and matching
            if (!pwd || !pwdConfirm) {
                throwError('Le mot de passe et la confirmation doivent être remplis', 422);
            }
            if (pwd !== pwdConfirm) {
                throwError('Les mots de passes ne correspondent pas', 422);
            }

            // Checking the content of the password
            if (!Validation.fPassword(pwd)) {
                throwError('Votre mot de passe doit contenir au moins 8 caractères dont une lettre minuscule, une lettre majuscule et un chiffre', 422);
            }

            req.pwd = pwd;
            next();
        })
        .catch(err => next(err));
};

// putResetPwd checker
exports.putResetPwd = (req, res, next) => {
    const mail = req.body.mail;

    if (!mail) {
        throwError('Champ mail manquant', 422);
    }
    Validation.fMail(mail)
        .then(user => {
            if (!user) {
                throwError('L\'utilisateur n\'existe pas', 422);
            }
            req.mail = req.body.mail;
            next();
        })
        .catch(err => next(err));
}

// postResetPwd checker
exports.postResetPwd = (req, res, next) => {
    const uname = req.body.uname;
    const resetToken = req.body.resetToken;
    const pwd = req.body.pwd;
    const pwdConfirm = req.body.pwdConfirm;

    if (!uname || !resetToken || !pwd || !pwdConfirm) {
        throwError('Champs uname, resetToken, pwd et pwdConfirm requis', 422);
    }
    if (pwd !== pwdConfirm) {
        throwError('Les mots de passe ne correspondent pas', 422);
    }
    User.findByUsername(uname)
        .then(user => {
            if (!user) {
                throwError('Utilisateur inexistant', 422);
            }
            if (user.usr_resetToken !== resetToken) {
                throwError('Échec d\'authentification', 422);
            }
            return (Validation.fPassword(pwd));
        })
        .then(result => {
            if (!result) {
                throwError('Votre mot de passe doit contenir au moins 8 caractères dont une lettre minuscule, une lettre majuscule et un chiffre', 422);
            }
            next();
        })
        .catch(err => next(err));
}