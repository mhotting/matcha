/********************************************************************************
 *  DATABASE fake data creation - JS version
 *  Matcha Project
 *  krambono - mhotting
 *  2019
********************************************************************************/

function cleanUsername(username) {
    const regex = /^[a-zA-Z0-9]$/;
    let newUsername = '';
    for (let char of username){
        if (regex.test(char))
            newUsername += char;
    }
    return newUsername; 
}


const db = require('./../util/database');
const bcrypt = require('bcrypt');
const faker = require('faker');
const crypto = require('crypto');
faker.locale = 'fr';

const userTab = [];
const promiseArray = [];
const userObj = {};
const password = bcrypt.hashSync('Qwerty123', 12);
let rdmNbr;

for (let i = 0; i < 500; i++) {
    userObj.usr_uname = cleanUsername(faker.internet.userName());
    userObj.usr_fname = faker.name.firstName();
    userObj.usr_lname = faker.name.lastName();
    userObj.usr_email = faker.internet.email();
    //userObj.usr_pwd = faker.internet.password();
    userObj.usr_pwd = password;
    age = 0;
    while (age < 18 || age > 65) {
        age = faker.random.number();
    }
    userObj.usr_age = age;
    rdmNbr = Math.random();
    userObj.usr_gender = (rdmNbr < 0.5 ? 'Male' : 'Female');
    userObj.usr_bio = faker.lorem.paragraph();
    userObj.usr_status = "OK";
    userObj.usr_location = '0';
    userObj.usr_activationToken = crypto.createHash('md5').update(Math.random().toString()).digest('hex');
    userObj.usr_pwdToken = crypto.createHash('md5').update(Math.random().toString()).digest('hex');
    rdmNbr = Math.random();
    userObj.usr_orientation = (rdmNbr < 0.66 ? (rdmNbr < 0.5 ? 'bi' : 'homo')  : 'hetero');
    userObj.usr_avatar = faker.internet.avatar();

    userTab.push({...userObj});
}

for (let user of userTab) {
    promiseArray.push(db.execute(
        'INSERT INTO `db_matcha`.`t_user` (`usr_uname`, `usr_fname`, `usr_lname`, `usr_email`, `usr_pwd`, `usr_age`, `usr_gender`, `usr_bio`, `usr_activationToken`, `usr_pwdToken`, `usr_orientation`) ' +
        'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);',
        [
            user.usr_uname, user.usr_fname, user.usr_lname,
            user.usr_email, user.usr_pwd, user.usr_age,
            user.usr_gender, user.usr_bio, user.usr_activationToken,
            user.usr_pwdToken, user.usr_orientation
        ]
    ));
}

Promise.all(promiseArray)
    .then(result => {
        console.log('SUCCESS - Fake data have been generated.');
    })
    .catch(error => {
        console.log(error);
    })
    .finally(result => {
        process.exit();
    })
