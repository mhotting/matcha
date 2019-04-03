const db = require('../util/database');

class UserInterest {
    static add(userId, interestId) {
        return db.execute(
            'INSERT INTO t_userInterest ' + 
            '(userInterest_idUser, userInterest_idInterest) ' +
            'VALUES (?, ?)',
            [userId, interestId]
        );
    }
}

module.exports = UserInterest;
