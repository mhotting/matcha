// Managing DB connections

const mysql = require('mysql2');

const pool = mysql.createPool({
    user: "root",
    password: "",
    database: "db_matcha",
    host: "0.0.0.0"
});

module.exports = pool.promise();

// .then(() => {
//     let promise = Promise.resolve();
    
//     for (let interest of interests) {
//         console.log('interest', interest);
//         promise = promise.then(() => {
//             Interest.add(interest)
//             .then(interestId => {
//                 console.log('interestId', interestId);
//                 return UserInterest.add(req.userId, interestId);
//             });
//         });
//     }
//     //throw new Error('stop');
//     return promise;
// })