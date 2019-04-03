const db = require('../util/database');

class UserInterest {
    static exist(userId, interestId) {
        return db.execute(
            'SELECT * FROM t_userInterest ' +
            'WHERE userInterest_idUser=? AND userInterest_idInterest=?',
            [userId, interestId]
        )
        .then(([rows, field]) => !!rows[0]);
    }

    static add(userId, interestId) {
        return UserInterest.exist(userId, interestId)
        .then(test => {
            if (test === false)
            {
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
