// Model of the interactions

const db = require('./../../util/database');
const throwError = require('./../../util/error');

class Visit {
    // Retrieve a visit ID using the id of the user visited
    static findById(idVisited) {
        return (
            db.execute('SELECT visit_id FROM t_visit WHERE visit_idVisited = ?;', [idVisited])
            .then(([rows, fields]) => rows[0])
        );
    }

    // Add a visit to a user in the DB - Creates if first visit else increases the counter
    static addVisit(idVisited) {
        return (Visit.findById(idVisited)
            .then(result => {
                if (result) {
                    return (db.execute('UPDATE t_visit SET visit_cpt = visit_cpt + 1 WHERE visit_idVisited = ?;', [idVisited]));
                }
                return (db.execute('INSERT INTO t_visit(visit_idVisited, visit_cpt) VALUES (?, 1);', [idVisited]));
            })
        );
    }
}


module.exports = Visit;