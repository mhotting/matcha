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

}

module.exports = Validation;
