// Model of the users' interests
//(connection between an user and its interests)

const db = require('../util/database');

class UserInterest {
    // Checks is a given user is linked to a given interest (both given by IDs)
    static exist(userId, interestId) {
        return db.execute(
            'SELECT * FROM t_userInterest ' +
            'WHERE userInterest_idUser=? AND userInterest_idInterest=?',
            [userId, interestId]
        )
            .then(([rows, field]) => !!rows[0]);
    }

    // Register an user's interest (according to IDs)
    static add(userId, interestId) {
        return UserInterest.exist(userId, interestId)
            .then(test => {
                if (test === false) {
                    return db.execute(
                        'INSERT INTO t_userInterest ' +
                        '(userInterest_idUser, userInterest_idInterest) ' +
                        'VALUES (?, ?)',
                        [userId, interestId]
                    );
                }
            });
    }
}

module.exports = UserInterest;
