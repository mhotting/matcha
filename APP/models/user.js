const db = require('../util/database');
const throwError = require('../util/error'); 

class User {
    constructor (mail, uname, fname, lname, pwd) {
        this.mail = mail;
        this.uname = uname;
        this.fname = fname;
        this.lname = lname;
        this.pwd = pwd;
    }

    create() {
        return db.execute('INSERT INTO t_user ' +
        '(usr_email, usr_uname, usr_fname, usr_lname, usr_pwd) ' +
        'VALUES(?, ?, ?, ?, ?)', 
        [this.mail, this.uname, this.fname, this.lname, this.pwd]);
    }
    
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

    static findById(userId) {
        return db.execute('SELECT * FROM t_user WHERE usr_id=?', 
        [userId]).then(([rows, fields]) => rows[0]);
    }

    static findByUsername(username) {
        return db.execute('SELECT * FROM t_user WHERE usr_uname=?', 
        [username]).then(([rows, fields]) => rows[0]);
    }

    static findByMail(mail) {
        return db.execute('SELECT * FROM t_user WHERE usr_email=?', 
        [mail]).then(([rows, fields]) => rows[0]);
    }
}

module.exports = User;
