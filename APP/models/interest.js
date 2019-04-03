const db = require('../util/database');
const cleanString = require('../util/accent');

class Interest {
    static getId(interestName) {
        return db.execute(
            'SELECT interest_id FROM t_interest ' + 
            'WHERE interest_name=? ',
            [interestName]
        )
        .then(([rows, fields]) => rows[0] ? rows[0].interest_id : false);
    }

    static getName(interestId) {
        return db.execute(
            'SELECT interest_name FROM t_interest ' + 
            'WHERE interest_id=? ',
            [interestId]
        )
        .then(([rows, fields]) => rows[0] ? rows[0].interest_name : false);
    }

    static neww(interestName) {
        return db.execute(
            'INSERT INTO t_interest ' + 
            '(interest_name) ' +
            'VALUES (?)',
            [interestName]
        );
    }

    static add(interestName) {
        interestName = cleanString(interestName);
        return Interest.getId(interestName)
        .then(interestId => {
            if (interestId !== false)
                return interestId;
            else
            {
                return Interest.neww(interestName)
                .then(() => {
                    return Interest.getId(interestName);
                });
            }
        });
    }
}

module.exports = Interest;
