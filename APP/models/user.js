// Model of the users

const db = require('../util/database');
const throwError = require('../util/error');
const cryptoRS = require('crypto-random-string');

class User {
    // User constructor
    constructor(mail, uname, fname, lname, pwd) {
        this.mail = mail;
        this.uname = uname;
        this.fname = fname;
        this.lname = lname;
        this.pwd = pwd;
        this.activationToken = cryptoRS(64);
        this.resetToken = cryptoRS(64);
    }

    // Insert an user into the DB
    create() {
        return db.execute(
            'INSERT INTO t_user ' +
            '(usr_email, usr_uname, usr_fname, usr_lname, usr_pwd, usr_activationToken, usr_resetToken) ' +
            'VALUES(?, ?, ?, ?, ?, ?, ?)',
            [this.mail, this.uname, this.fname, this.lname, this.pwd, this.activationToken, this.resetToken]);
    }

    // Register the information of an user, according to its ID (not saved in the DB)
    populate(userId) {
        return User.findById(userId)
            .then((user) => {
                this.id = userId;
                this.uname = user.usr_uname;
                this.fname = user.usr_fname;
                this.lname = user.usr_lname;
                this.mail = user.usr_email;
                this.age = user.usr_age;
                this.gender = user.usr_gender;
                this.bio = user.usr_bio;
                this.orientation = user.usr_orientation;
            });
    }

    // UPDATE the DB when information have been added to an user's profile
    // Need to populate the class before updating
    update() {
        return db.execute(
            'UPDATE t_user ' +
            'SET usr_uname=?, usr_fname=?, usr_lname=?, usr_email=?, ' +
            'usr_age=?, usr_gender=?, usr_bio=?, usr_orientation=? ' +
            'WHERE usr_id=?',
            [this.uname, this.fname, this.lname, this.mail, this.age,
            this.gender, this.bio, this.orientation, this.id]
        );
    }

    static updateDateLogout(userId) {
        return db.execute('UPDATE t_user SET usr_connectionDate=NOW() WHERE usr_id=?', [userId]);
    }

    // Find an user according to its id
    static findById(userId) {
        return db.execute('SELECT * FROM t_user WHERE usr_id=?',
            [userId]).then(([rows, fields]) => rows[0]);
    }

    // Find an user according to its username
    static findByUsername(username) {
        return db.execute('SELECT * FROM t_user WHERE usr_uname=?',
            [username]).then(([rows, fields]) => rows[0]);
    }

    // Find an user according to its email address
    static findByMail(mail) {
        return db.execute('SELECT * FROM t_user WHERE usr_email=?',
            [mail]).then(([rows, fields]) => rows[0]);
    }

    // Find all the compatible users
    // Only based on gender and orientation comparisons
    static findCompatibleUsers(loggedUser) {
        const gender = loggedUser.gender;
        const genderInverse = gender === 'male' ? 'female' : 'male';
        const query1 = 'SELECT *, DATE_FORMAT(usr_connectionDate, "%d/%c %H:%i") AS date FROM t_user ' +
            'WHERE usr_gender = ? AND (usr_orientation = ? OR usr_orientation = \'bi\' )';
        const query2 = 'SELECT *, DATE_FORMAT(usr_connectionDate, "%d/%c %H:%i") AS date FROM t_user ' +
            'WHERE ' +
            'usr_gender = ? AND (usr_orientation = ? OR usr_orientation = \'bi\') OR ' +
            'usr_gender = ? AND (usr_orientation = ? OR usr_orientation = \'bi\')';
        let params;
        const ori = loggedUser.orientation;
        switch (ori) {
            case 'hetero':
                params = [genderInverse, 'hetero'];
                break;
            case 'homo':
                params = [gender, 'homo'];
                break;
            case 'bi':
                params = [genderInverse, 'hetero', gender, 'homo'];
                break;
        }
        return db.execute(ori === 'bi' ? query2 : query1, params);
    }

    // Update an user into the DB - only for signup data
    static updateSignup(userId, uname, fname, lname, mail, pwd) {
        if (pwd === '') {
            return db.execute(
                'UPDATE t_user ' +
                'SET usr_uname = ?, usr_fname = ?, usr_lname = ?, usr_email = ? ' +
                'WHERE usr_id = ?;',
                [uname, fname, lname, mail, userId]
            );
        } else {
            return db.execute(
                'UPDATE t_user ' +
                'SET usr_uname = ?, usr_fname = ?, usr_lname = ?, usr_email = ?, usr_pwd = ? ' +
                'WHERE usr_id = ?;',
                [uname, fname, lname, mail, pwd, userId]
            );
        }

    }

    // Activate the account of a given user
    static activate(uname, activateToken) {
        return(User.findByUsername(uname)
            .then(user => {
                if (!user) {
                    throwError('L\'utilisateur n\'existe pas', 422);
                }
                if (user.usr_active === 1) {
                    throwError('Compte déjà activé', 422);
                }
                if (user.usr_activationToken !== activateToken) {
                    throwError('Erreur d\'authentification', 422);
                }
                return (db.execute('UPDATE t_user SET usr_active = 1 WHERE usr_uname = ?;', [uname]));
            }
        ));
    }

    // Update the password of a given user
    static updatePwd(uname, pwd) {
        return(db.execute(
            'UPDATE t_user ' +
            'SET usr_pwd = ? ' +
            'WHERE usr_uname = ?;',
            [pwd, uname]
        ));
    }
}

module.exports = User;
