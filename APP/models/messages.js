// Model of the messages

const db = require('../util/database');
const Notification = require('./notifications');
const User = require('./user');
const Match = require('./interactions/match');
const throwError = require('../util/error');

class Message {
    // Constructor of a message
    constructor(content, idSender, idReceiver) {
        this.content = content;
        this.idSender = idSender;
        this.idReceiver = idReceiver;
    }

    // Insert a message into the database
    create() {
        return Match.findById(this.idSender, this.idReceiver)
        .then(match => {
            if (!match)
                throwError('Vous n\'avez pas de match avec cette personne !', 400);
            return true;
        })
        .then(() => {
            return db.execute(
                'INSERT INTO t_message (msg_content, msg_idSender, msg_idReceiver) VALUES(?, ?, ?)',
                [this.content, this.idSender, this.idReceiver]
            );      
        })
        .then(result => {
            return (Notification.addNotification(this.idReceiver, this.idSender, 'Message'));
        });
    }

    // Retrieve the conversations available for a given user according to its id
    // A conversation between two users is available when they match
    static getConvs(userId) {
        return db.execute(
            'SELECT match_id1, match_id2, ' +
            'DATE_FORMAT(match_date, "%M %d, %Y %H:%i:%s") AS date2, ' +
            'DATE_FORMAT(match_date, "%d %M %Y - %H:%i") AS date ' +
            'FROM t_match ' +
            'WHERE match_id1=? OR match_id2=?',
            [userId, userId]
        )
        .then(([rows, fields]) => {
            const matchs = [];
            for (let match of rows) {
                let otherUserId = match.match_id1 === userId ? match.match_id2 : match.match_id1;
                matchs.push({
                    userId: otherUserId,
                    date: match.date,
                    date2: match.date2
                });
            }
            return matchs;
        })
        .then(matchs => {
            const promises = [];
            for (let match of matchs) {
                let promise = User.findById(match.userId)
                .then(user => {
                    match.uname = user.usr_uname;
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
        })
        .then(matchs => {
            const promises = [];
            for (let match of matchs) {
                if (match.nbMsgs > 0) {
                    let promise = db.execute(
                        'SELECT DATE_FORMAT(MAX(msg_creationDate), "%M %d, %Y %H:%i:%s") AS date2, ' +
                        'DATE_FORMAT(MAX(msg_creationDate), "%d %M %Y - %H:%i") AS date ' + 
                        'FROM t_message ' +
                        'WHERE (msg_idSender=? AND msg_idReceiver=?) OR (msg_idSender=? AND msg_idReceiver=?)',
                        [match.userId, userId, userId, match.userId]
                    )
                    .then(([rows, fields]) => rows[0])
                    .then(res => {
                        match.date = res.date;
                        match.date2 = res.date2;
                    });
                    promises.push(promise);
                }
            }
            return Promise.all(promises)
            .then(() => matchs);
        })
        .then(matchs => {
            matchs.sort((el1, el2) => {
                const timestamp1 = el1.date2 ? new Date(el1.date2).getTime() : 0;
                const timestamp2 = el2.date2 ? new Date(el2.date2).getTime() : 0;
                if (timestamp1 > timestamp2)
                    return -1;
                if (timestamp1 === timestamp2)
                    return 0;
                if (timestamp1 < timestamp2)
                    return 1;
            });
            return matchs;
        });
    }

    // Retrive all the messages from a conversation between two users according to their IDs
    static getAll(userId, scdUserId) {
        return Match.findById(userId, scdUserId)
        .then(match => {
            if (!match)
                throwError('Vous n\'avez pas de match avec cette personne !', 400);
            return true;
        })
        .then(() => {
            return db.execute(
                'SELECT msg_content AS content, DATE_FORMAT(msg_creationDate, "%d/%c/%y %H:%i") AS date, usr_uname AS uname ' +
                'FROM t_message ' +
                'JOIN t_user ' +
                'ON msg_idSender=usr_id ' +
                'WHERE (msg_idSender=? AND msg_idReceiver=?) OR (msg_idSender=? AND msg_idReceiver=?) ' +
                'ORDER BY msg_creationDate',
                [userId, scdUserId, scdUserId, userId]
            );
        })
        .then(([rows, field]) => rows);
    }
}

module.exports = Message;
