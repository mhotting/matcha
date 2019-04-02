const User = require('../models/user');
const throwError = require('../util/error');

class Validation {
    constructor(mail, uname, fname, lname, pwd, pwdConfirm) {
        this.mail = mail;
        this.uname = uname;
        this.fname = fname;
        this.lname = lname;
        this.pwd = pwd;
        this.pwdConfirm = pwdConfirm;
    }

    /*                  SIGNUP                  */

    fMail() {
        const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/gm;
        if (regex.test(this.mail) === false)
            throwError('L\'email entré n\'est pas correct');
        return User.findByMail(this.mail).then(([rows, fields]) => rows[0]);
    }

    fUsername() {
        if (this.uname.length < 3)
            throwError('Le nom d\'utilisateur doit posséder au moins 3 caractères');
        return User.findByUsername(this.uname).then(([rows, fields]) => rows[0]);
    }

    fPassword() {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/;
        return regex.test(this.pwd);
    }

    fPasswordConfirm() {
        return (this.pwd === this.pwdConfirm);
    }

    signUp() {
        if (!this.mail || !this.uname || !this.fname || !this.lname || !this.pwd || !this.pwdConfirm)
            throwError('Champ manquant', 422);    
        if (this.fPassword() === false)
            throwError('Votre mot de passe doit contenir au moins 8 caractères dont une lettre minuscule, une lettre majuscule et un chiffre', 422);
        if (this.fPasswordConfirm() === false)
            throwError('Les deux mots de passe entrés sont différents', 422);    
        return this.fUsername()
        .then(user => {
            if (user)
                throwError('Ce nom d\'utilisateur est déjà utilisé', 422);
            return this.fMail();
        })
        .then(user => {
            if (user)
                throwError('Cet email est déjà utilisé', 422);
        });
    }

    /*                  FILLUP                  */

    setVars(gender, orientation, bio, age, interests) {
        this.gender = gender;
        this.orientation = orientation;
        this.bio = bio;
        this.age = age;
        this.interests = interests;
    }

    fGender() {
        if (!this.gender)
            return true;
        return this.gender == 'male' || this.gender == 'female';
    }

    fOrientation() {
        if (!this.orientation)
            return true; 
        return this.orientation == 'hetero' || this.orientation == 'homo'
        || this.orientation == 'bi' ;
    }

    fInterests() {
        if (!this.interests)
            return true;
        return Array.isArray(this.interests);
    }

    fAge() {
        return this.age > 13 && this.age < 100;
    }

    fillUp() {
        if (this.fGender() == false)
            throwError('Mauvais genre (êtes vous un robot ?)', 422);
        if (this.fOrientation() == false)
            throwError('Mauvaise orientation (êtes vous robotphile ?)', 422);
        if (this.fInterests() === false)
            throwError('Intérêts mal formatés');
        if (this.fAge() === false)
            throwError('Mauvais âge', 422);
    }
}

module.exports = Validation;
