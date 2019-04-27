// Model of the interactions

const db = require('./../../util/database');
const throwError = require('./../../util/error');
const Notification = require('./../notifications');

class Visit {
    // Retrieve a visit ID using the id of the user visited
    static findById(idVisited) {
        return (
            db.execute('SELECT visit_id FROM t_visit WHERE visit_idVisited = ?;', [idVisited])
                .then(([rows, fields]) => rows[0])
        );
    }

    // Add a visit to a user in the DB
    // User visited is notified
    static addVisit(idVisitor, idVisited) {
        return (
            db.execute('INSERT INTO t_visit(visit_idVisitor, visit_idVisited) VALUES (?, ?);', [idVisitor, idVisited])
                .then(result => {
                    return (Notification.addNotification(idVisited, idVisitor, 'Visit'));
                })
        );
    }
}


module.exports = Visit;