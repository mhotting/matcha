// Model of the interactions

const db = require('./../../util/database');
const throwError = require('./../../util/error');

class Match {
    // Retrieve a match ID using the users IDs
    // No matter the order of the users (matched === matcher)
    static findById(id1, id2) {
        return (
            db.execute('SELECT match_id FROM t_match WHERE (match_id1 = ? AND match_id2 = ?) OR (match_id1 = ? AND match_id2 = ?);', [id1, id2, id2, id1])
            .then(([rows, fields]) => rows[0])
        );
    }

    // Add a "match" when two users are liking each other
    static addMatch(id1, id2) {
        return (db.execute('INSERT INTO t_match(match_id1, match_id2) VALUES (?, ?);', [id1, id2]));
    }

    // Delete a "match" when two users are not liking each other
    static deleteMatch(id1, id2) {
        return (db.execute('DELETE FROM t_match WHERE (match_id1 = ? AND match_id2 = ?) OR (match_id1 = ? AND match_id2 = ?);', [id1, id2, id2, id1]));
    }
}


module.exports = Match;