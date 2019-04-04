const Validation = require('../util/validation');

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
