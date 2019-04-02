const db = require('../util/database');

class Interest {
    static getId(interestName) {
        return db.require(
            'SELECT interest_id FROM t_interest ' + 
            'WHERE interest_name=? ',
            [interestName]
        )
        .then(([rows, fields]) => rows[0] ? rows[0] : false);
    }

    static getName(interestId) {
        return db.require(
            'SELECT interest_name FROM t_interest ' + 
            'WHERE interest_id=? ',
            [interestId]
        )
        .then(([rows, fields]) => rows[0] ? rows[0] : false);
    }

    static add(interestName) {
        return db.require(
            'INSERT INTO t_interest ' + 
            '(interest_name) ' +
            'VALUES (?)',
            [interestName]
        );
    }
}

module.exports = Interest;