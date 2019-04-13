// Class used for validation of inputs

const User = require('../models/user');
const throwError = require('../util/error');

class Validation {
    // Validation constructor
    constructor(mail, uname, fname, lname, pwd, pwdConfirm) {
        this.mail = mail;
        this.uname = uname;
        this.fname = fname;
        this.lname = lname;
        this.pwd = pwd;
        this.pwdConfirm = pwdConfirm;
    }

    /****************************************** */
    /*                  SIGNUP                  */
    /****************************************** */

    // Mail validation (format, etc.)
    fMail() {
        const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/gm;
        if (regex.test(this.mail) === false)
            throwError('L\'email entré n\'est pas correct');
        return User.findByMail(this.mail);
    }

    // Username validation
    fUsername() {
        if (this.uname.length < 3)
            throwError('Le nom d\'utilisateur doit posséder au moins 3 caractères');
        return User.findByUsername(this.uname);
    }

    // Password validation (at least: -8 chars; -one upper; -one digit)
    fPassword() {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/;
        return regex.test(this.pwd);
    }

    // Password and password confirmation validation
    fPasswordConfirm() {
        return (this.pwd === this.pwdConfirm);
    }

    // Signup global validation using the above tools
    signUp() {
        if (!this.mail || !this.uname || !this.fname || !this.lname || !this.pwd || !this.pwdConfirm)
            throwError('Champ manquant', 422);
        if (this.mail.length >= 254 || this.uname.length >= 254 || this.fname.length >= 254 || this.lname.length >= 254 || this.pwd.length >= 254)
            throwError('Longueur de champ excessive', 422);
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

    /****************************************** */
    /*                  FILLUP                  */
    /****************************************** */

    // Adding new attributes when users send information
    setVars(gender, orientation, bio, age, interests) {
        this.gender = gender;
        this.orientation = orientation;
        this.bio = bio;
        this.age = age;
        this.interests = interests;
    }

    // Gender validation
    fGender() {
        if (!this.gender)
            return true;
        return this.gender == 'male' || this.gender == 'female';
    }

    // Orientation validation
    fOrientation() {
        if (!this.orientation)
            return true;
        return this.orientation == 'hetero' || this.orientation == 'homo'
            || this.orientation == 'bi';
    }

    // Interests validation
    fInterests() {
        if (!this.interests)
            return true;
        for (let interest of this.interests) {
            if (interest && typeof interest !== 'string')
                return false;
        }
        return Array.isArray(this.interests);
    }

    // Age validation
    fAge() {
        if (!this.age)
            return true;
        return +this.age > 13 && +this.age < 100;
    }

    // FillUp global validation, using the above tools
    fillUp() {
        if (this.fGender() == false)
            throwError('Mauvais genre (êtes vous un robot ?)', 422);
        if (this.fOrientation() == false)
            throwError('Mauvaise orientation (êtes vous robotphile ?)', 422);
        if (this.fInterests() === false)
            throwError('Intérêts mal formatés');
        if (this.fAge() === false)
            throwError('Mauvais âge', 422);
        
        // Normalement ca on peut virer, gender c'est soit male soit female sinon on throw une erreur, pareil pour l'orientation
        // Pour l'age je le converti en int, et je regarde qui soit bient compris entre 13 et 100 donc pas besoin de regarder la taille normalement des trois

        if ((this.gender && this.gender.length >= 24) || (this.orientation && this.orientation.length >= 44) || (this.age && this.gender.l >= 24))
            throwError('Longueur de champ excessive', 422);
        
        //---------------------------------------------------
        
        for (let interest of this.interests) {
            if (interest.length >= 254)
                throwError('Longueur de champ excessive', 422);
        }
    }
}

module.exports = Validation;
