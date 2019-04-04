const db = require('../util/database');

class Message {
    constructor(content, idSender, idReceiver)
    {
        this.content = content;
        this.idSender = idSender;
        this.idReceiver = idReceiver;
    }
    create(){
        return db.execute(
            'INSERT INTO t_message ' + 
            '(msg_content, msg_idSender, msg_idReceiver) ' +
            'VALUES(?, ?, ?)',
            [this.content, this.idSender, this.idReceiver]
        );
    }

    static getConvs(userId) {

    }

    static getAll(userId, scdUserId){
        return db.execute(
            'SELECT msg_content AS content, msg_creationDate AS date, usr_uname AS author ' +
            'FROM t_message ' +
            'JOIN t_user ' +
            'ON msg_idSender=usr_id ' +
            'WHERE (msg_idSender=? AND msg_idReceiver=?) OR (msg_idSender=? AND msg_idReceiver=?) ' +
            'ORDER BY msg_creationDate DESC',
            [userId, scdUserId, scdUserId, userId]
        ).then(([rows, field]) => rows);
    }
}

module.exports = Message;
