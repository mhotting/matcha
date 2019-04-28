// Controller of all the users stuff

const User = require('../models/user');
const Interest = require('../models/interest');
const evalDistance = require('./../util/distance');

// Get all the infos from an user
exports.getInfos = (req, res, next) => {
    User.findById(req.userId)
        .then(user => {
            const userInfos = {
                id: user.usr_id,
                uname: user.usr_uname,
                fname: user.usr_fname,
                lname: user.usr_lname,
                mail: user.usr_email,
                age: user.usr_age,
                gender: user.usr_gender,
                bio: user.usr_bio,
                longitude: user.usr_longitude,
                latitude: user.usr_latitude,
                orientation: user.usr_orientation
            };
            return Interest.getInterestsFromUserId(req.userId)
                .then(interests => {
                    userInfos.interests = interests.map(interest => interest.interest_name);
                    return userInfos;
                });
        })
        .then(userInfos => {
            res.status(200).json({
                user: userInfos
            });
        })
        .catch(err => next(err));
};

// Get all the infos of the compatible users
exports.getInfosCompatible = (req, res, next) => {
    let matchingArray = [];
    let promiseArray = [];
    let tempUser = {};
    let loggedUserInfo;

    User.findById(req.userId)
        .then(user => {
            loggedUserInfo = {
                id: user.usr_id,
                gender: user.usr_gender,
                orientation: user.usr_orientation,
                longitude: user.usr_longitude,
                latitude: user.usr_latitude
            };
            return (User.findCompatibleUsers(loggedUserInfo));
        })
        .then(([rows, fields]) => {
            let pointA = { longitude: Number(Math.round(loggedUserInfo.longitude + 'e4') + 'e-4'), latitude: Number(Math.round(loggedUserInfo.latitude + 'e4') + 'e-4') };
            let pointB;
            for (let row of rows) {
                if (row.usr_id !== loggedUserInfo.id) {
                    let promise = Interest.getInterestsFromUserId(row.usr_id).then(interests => {
                        pointB = { longitude: Number(Math.round(row.usr_longitude + 'e4') + 'e-4'), latitude: Number(Math.round(row.usr_latitude + 'e4') + 'e-4') };
                        const distance = evalDistance({ ...pointA }, pointB); 
                        tempUser = {
                            photo: 'https://resize-elle.ladmedia.fr/r/625,,forcex/crop/625,437,center-middle,forcex,ffffff/img/var/plain_site/storage/images/loisirs/cinema/news/les-minions-devient-le-deuxieme-film-d-animation-le-plus-rentable-2984957/56222971-1-fre-FR/Les-Minions-devient-le-deuxieme-film-d-animation-le-plus-rentable.jpg',
                            uname: row.usr_uname,
                            bio: row.usr_bio,
                            age: row.usr_age,
                            score: row.usr_score,
                            distance: distance ? Math.round(distance * 100) / 100 : '',
                            connection: row.date
                            // disabled: row.usr_status
                        };
                        tempUser.interests = interests.map(interest => interest.interest_name);
                        matchingArray.push(({ ...tempUser }));
                    });
                    promiseArray.push(promise);
                }
            }
            return Promise.all(promiseArray).then(_ => matchingArray);
        })
        .then(array => {
            res.status(200).json({
                profils: array
            });
        })
        .catch(err => next(err));
};

// Get all the infos of the matching users
// We get all the compatible users and we check if they are matching with the logged one
exports.getInfosMatch = (req, res, next) => {
    let matchingArray = [];
    let promiseArray = [];
    let tempUser = {};
    let loggedUserInfo;
    let i = 0;

    User.findById(req.userId)
        .then(user => {
            loggedUserInfo = {
                id: user.usr_id,
                gender: user.usr_gender,
                age: user.usr_age,
                score: user.usr_score,
                orientation: user.usr_orientation,
                longitude: user.usr_longitude,
                latitude: user.usr_latitude
            };
            return (User.findCompatibleUsers(loggedUserInfo));
        })
        .then(([rows, fields]) => {
            let pointA = { longitude: Number(Math.round(loggedUserInfo.longitude + 'e4') + 'e-4'), latitude: Number(Math.round(loggedUserInfo.latitude + 'e4') + 'e-4') };
            let pointB;
            for (let row of rows) {
                if (row.usr_id !== loggedUserInfo.id) {
                    pointB = { longitude: Number(Math.round(row.usr_longitude + 'e4') + 'e-4'), latitude: Number(Math.round(row.usr_latitude + 'e4') + 'e-4') };
                    const distance = evalDistance({ ...pointA }, pointB);
                    tempUser = {
                        photo: 'https://resize-elle.ladmedia.fr/r/625,,forcex/crop/625,437,center-middle,forcex,ffffff/img/var/plain_site/storage/images/loisirs/cinema/news/les-minions-devient-le-deuxieme-film-d-animation-le-plus-rentable-2984957/56222971-1-fre-FR/Les-Minions-devient-le-deuxieme-film-d-animation-le-plus-rentable.jpg',
                        uname: row.usr_uname,
                        bio: row.usr_bio,
                        age: row.usr_age,
                        score: row.usr_score,
                        distance: distance ? Math.round(distance * 100) / 100 : '',
                        connection: row.date,
                        disabled: row.usr_status
                    };
                    if (
                        tempUser.distance >= 300 ||
                        tempUser.score < loggedUserInfo.score - 20 ||
                        tempUser.score > loggedUserInfo.score + 20 ||
                        tempUser.age < loggedUserInfo.age - 10 ||
                        tempUser.age > loggedUserInfo.age + 10
                    ) {
                        continue;
                    }
                    matchingArray.push({ ...tempUser });
                    promiseArray.push(Interest.getInterestsFromUserIdLoop(row.usr_id, i)
                        .then(interests => {
                            let interestsArray = [];
                            for (let interest of interests.rows) {
                                interestsArray.push(interest.interest_name);
                            }
                            matchingArray[interests.index].interests = interestsArray;
                            return (interestsArray);
                        })
                        .catch(error => next(error))
                    );
                    i++;
                }
            }
            Promise.all(promiseArray)
                .then(result => {
                    res.status(200).json({
                        profils: matchingArray
                    });
                })
                .catch(error => next(error));
        })
        .catch(err => next(err));
};