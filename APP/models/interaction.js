// Model of the interactions

const db = require('../util/database');
const throwError = require('./../util/error');

class Interaction {
    // Add a "block" when an user wants to block another one - Throws an error if the user to block is already blocked
    static addBlock(idBlocker, idBlocked) {
        return (db.execute('SELECT block_id FROM t_block WHERE block_idBlocker = ? AND block_idBlocked = ?;', [idBlocker, idBlocked])
            .then(([rows, fields]) => rows[0])
            .then(result => {
                if (result) {
                    throwError('Already Blocked', 422);
                }
                return (db.execute('INSERT INTO t_block(block_idBlocker, block_idBlocked) VALUES (?, ?);', [idBlocker, idBlocked]));
            })
        );
    }

    // Delete a "block" when an user wants to unblock another one - Throws an error if the user to unblock isn't blocked
    static deleteBlock(idBlocker, idBlocked) {
        return (db.execute('SELECT block_id FROM t_block WHERE block_idBlocker = ? AND block_idBlocked = ?;', [idBlocker, idBlocked])
            .then(([rows, fields]) => rows[0])
            .then(result => {
                if (!result) {
                    throwError('Already Unblocked', 422);
                }
                return (db.execute('DELETE FROM t_block WHERE block_idBlocker = ? AND block_idBlocked = ?;', [idBlocker, idBlocked]));
            })
        );
    }

    // Add a "like" when an user wants to like another one - Throws an error if the user is already liked
    // If the liker is already liked by the other person, a match is added
    static addLike(idLiker, idLiked) {
        return (db.execute('SELECT like_id FROM t_like WHERE like_idLiker = ? AND like_idLiked = ?;', [idLiker, idLiked])
            .then(([rows, fields]) => rows[0])
            .then(result => {
                if (result) {
                    throwError('Already Liked', 422);
                }
                return (db.execute('INSERT INTO t_like(like_idLiker, like_idLiked) VALUES (?, ?);', [idLiker, idLiked]));
            })
            .then(result => {
                return (db.execute('SELECT match_id FROM t_match WHERE (match_id1 = ? AND match_id2 = ?) OR (match_id1 = ? AND match_id2 = ?);', [idLiker, idLiked, idLiked, idLiker]));
            })
            .then(([rows, fields]) => rows[0])
            .then(result => {
                if (result) {
                    return (Promise.resolve('Already Matched'));
                }
                return (db.execute('SELECT like_id FROM t_like WHERE like_idLiker = ? AND like_idLiked = ?;', [idLiked, idLiker])
                    .then(([rows, fields]) => rows[0])
                    .then(result => {
                        if (!result) {
                            return (Promise.resolve('No Match Yet'));
                        }
                        return (db.execute('INSERT INTO t_match(match_id1, match_id2) VALUES (?, ?);', [idLiker, idLiked]));
                    })
                );
            })
        );
    }

    // Delete a "like" when an user wants to unlike another one - Throws an error if the user to like is not liked
    // If there was a match between the users, the match is removed
    static deleteLike(idLiker, idLiked) {
        return (db.execute('SELECT like_id FROM t_like WHERE like_idLiker = ? AND like_idLiked = ?;', [idLiker, idLiked])
            .then(([rows, fields]) => rows[0])
            .then(result => {
                if (!result) {
                    throwError('Already Unliked', 422);
                }
                return (db.execute('DELETE FROM t_like WHERE like_idLiker = ? AND like_idLiked = ?;', [idLiker, idLiked]));
            })
            .then(result => {
                return (db.execute('SELECT match_id FROM t_match WHERE (match_id1 = ? AND match_id2 = ?) OR (match_id1 = ? AND match_id2 = ?);', [idLiker, idLiked, idLiked, idLiker]));
            })
            .then(([rows, fields]) => rows[0])
            .then(result => {
                if (!result) {
                    return (Promise.resolve('No Match'));
                }
                return (db.execute('DELETE FROM t_match WHERE (match_id1 = ? AND match_id2 = ?) OR (match_id1 = ? AND match_id2 = ?);', [idLiker, idLiked, idLiked, idLiker]));
            })
        );
    }

    // Add a "report" when an user wants to report another one's account - Throws an error if the user to report is already reported
    static addReport(idReporter, idReported) {
        return (db.execute('SELECT report_id FROM t_report WHERE report_idReporter = ? AND report_idReported = ?;', [idReporter, idReported])
            .then(([rows, fields]) => rows[0])
            .then(result => {
                if (result) {
                    throwError('Already Reported', 422);
                }
                return (db.execute('INSERT INTO t_report(report_idReporter, report_idReported) VALUES (?, ?);', [idReporter, idReported]));
            })
        );
    }

    // Delete a "report" when an user wants to unreport another one's account - Throws an error if the user to unreport isn't reported
    static deleteReport(idReporter, idReported) {
        return (db.execute('SELECT report_id FROM t_report WHERE report_idReporter = ? AND report_idReported = ?;', [idReporter, idReported])
            .then(([rows, fields]) => rows[0])
            .then(result => {
                if (!result) {
                    throwError('Already Unreported', 422);
                }
                return (db.execute('DELETE FROM t_report WHERE report_idReporter = ? AND report_idReported = ?;', [idReporter, idReported]));
            })
        );
    }

    // Add a visit to a user in the DB - Creates if first visit else increases the counter
    static addVisit(idVisited) {
        return (db.execute('SELECT visit_id FROM t_visit WHERE visit_idVisited = ?;', [idVisited])
            .then(([rows, fields]) => rows[0])
            .then(result => {
                if (result) {
                    return (db.execute('UPDATE t_visit SET visit_cpt = visit_cpt + 1 WHERE visit_idVisited = ?;', [idVisited]));
                }
                return (db.execute('INSERT INTO t_visit(visit_idVisited, visit_cpt) VALUES (?, 1);', [idVisited]));
            })
        );
    }
}


module.exports = Interaction;