const db = require('../util/database');
const validationFcts = require('../util/validation');

class User {
    constructor (mail, uname, fname, lname, pwd, pwdConfirm) {
        this.mail = mail;
        this.uname = uname;
        this.fname = fname;
        this.lname = lname;
        this.pwd = pwd;
        this.pwdConfirm = pwdConfirm;
    }

    create(pwd) {
        return db.execute('INSERT INTO t_user ' +
        '(usr_email, usr_uname, usr_fname, usr_lname, usr_pwd) ' +
        'VALUES(?, ?, ?, ?, ?)', 
        [this.mail, this.uname, this.fname, this.lname, pwd]);
    }

    validation() {
        const error = new Error('none');
        error.statusCode = 422;
        if (!this.mail || !this.uname || !this.fname || !this.lname || !this.pwd || !this.pwdConfirm)
            error.message = 'Champ manquant';
        if (validationFcts.mail(this.mail) === false)
            error.message = 'L\'email entré n\'est pas correct';
        if (validationFcts.username(this.uname) === false)
            error.message = 'Ce nom d\'utilisateur est déjà utilisé';
        if (validationFcts.passwordConfirm(this.pwd, this.pwdConfirm) === false)
            error.message = 'Les deux mots de passe entrés sont différents';
        if (validationFcts.password(this.pwd) === false)
            error.message = 'Votre mot de passe doit contenir au moins 8 caractères dont une lettre minuscule, une lettre majuscule et un chiffre';
        if (error.message !== 'none')
            throw error;
    }

    static findById(userId) {
        return db.execute('SELECT * FROM t_user WHERE usr_id=?', 
        [userId]);
    }

    static findByUsername(username) {
        return db.execute('SELECT * FROM t_user WHERE usr_uname=?', 
        [username]);
    }
}

module.exports = User;
