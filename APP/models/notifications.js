// Model of the interests

const db = require('./../util/database');
const throwError = require('./../util/error');

class Notification {
    // Retrieve a notif according to its id
    static findById(idNotif) {
        return (
            db.execute('SELECT * FROM t_notification WHERE notif_id = ?;', [idNotif])
                .then(([rows, fields]) => rows[0])
        );
    }

    // Add a notification to DB according to the id of the user it belongs and the category of the notification
    static addNotification(idUser, category) {
        return (db.execute('INSERT INTO t_notification(notif_idUser, notif_consulted, notif_category) VALUES (?, 0, ?);', [idUser, category]));
    }

    // Set a notification as read or unread depending on the state arg (0: set as unread / 1: set as read)
    // If the notification does not exist, an error is thrown
    static setReadNotification(idNotif, state) {
        this.findById(idNotif)
            .then(result => {
                if (!result ) {
                    throwError('Unexisting notification', 422);
                }
                if (state === 0) {
                    return (db.execute('UPDATE t_notification SET notif_consulted = 0 WHERE notif_id = ?;', [idNotif]));
                } else {
                    return (db.execute('UPDATE t_notification SET notif_consulted = 1 WHERE notif_id = ?;', [idNotif]));
                }
            })
    }
}


module.exports = Notification;