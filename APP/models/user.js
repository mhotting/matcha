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
    
    static findById(userId) {
        return db.execute('SELECT * FROM t_user WHERE usr_id=?', 
        [userId]);
    }

    static findByUsername(username) {
        return db.execute('SELECT * FROM t_user WHERE usr_uname=?', 
        [username]);
    }

    static findByMail(mail) {
        return db.execute('SELECT * FROM t_user WHERE usr_email=?', 
        [mail]);
    }
}

module.exports = User;
