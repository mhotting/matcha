// Model of the messages

const db = require('../util/database');
const Notification = require('./notifications');
const User = require('./user');

class Message {
    // Constructor of a message
    constructor(content, idSender, idReceiver) {
        this.content = content;
        this.idSender = idSender;
        this.idReceiver = idReceiver;
    }

    // Insert a message into the database
    create() {
        return (
            db.execute(
                'INSERT INTO t_message (msg_content, msg_idSender, msg_idReceiver) VALUES(?, ?, ?)',
                [this.content, this.idSender, this.idReceiver]
            )
                .then(result => {
                    return (Notification.addNotification(this.idReceiver, 'Message'));
                })
        );
    }

    // Retrieve the conversations available for a given user according to its id
    // A conversation between two users is available when they match
    static getConvs(userId) {
        return db.execute(
            'SELECT match_id ' + 
            'FROM t_match ' +
            'WHERE match_id1=? OR match_id2=?',
            [userId, userId]
        )
        .then(([rows, fields]) => {
            const matchs = [];
            for (let match of rows) {
                let otherUserId = match.match_id1 === userId ? match.match_id2 : match.match_id1;
                matchs.push({
                    userId: otherUserId
                });
            }
            return matchs;
        })
        .then(matchs => {
            const promises = [];
            for (let match of matchs) {
                let promise = User.findById(match.userId)
                .then(user => {
                    match.uname = user.usr_name;
                });
                promises.push(promise);
            }
            return Promise.all(promises)
            .then(() => matchs);
        })
        .then(matchs => {
            const promises = [];
            for (let match of matchs) {
                let promise = Message.getAll(match.userId, userId)
                .then(messages => {
                    match.nbMsgs = messages.length;
                });
                promises.push(promise);
            }
            return Promise.all(promises)
            .then(() => matchs);
        });
    }

    // Retrive all the messages from a conversation between two users according to their IDs
    static getAll(userId, scdUserId) {
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
