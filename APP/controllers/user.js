// Controller of all the users stuff

const User = require('../models/user');
const Interest = require('../models/interest');
const evalDistance = require('./../util/distance');
const Like = require('./../models/interactions/like');
const Visit = require('./../models/interactions/visit');
const Block = require('./../models/interactions/block');
const throwError = require('../util/error');

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
                    let interestsSave;
                    let promise = Interest.getInterestsFromUserId(row.usr_id)
                        .then(interests => {
                            interestsSave = interests;
                            return (Like.findById(loggedUserInfo.id, row.usr_id));
                        })
                        .then(likeStatus => {
                            pointB = { longitude: Number(Math.round(row.usr_longitude + 'e4') + 'e-4'), latitude: Number(Math.round(row.usr_latitude + 'e4') + 'e-4') };
                            const distance = evalDistance({ ...pointA }, pointB); 
                            tempUser = {
                                id: row.usr_id,
                                photo: 'https://resize-elle.ladmedia.fr/r/625,,forcex/crop/625,437,center-middle,forcex,ffffff/img/var/plain_site/storage/images/loisirs/cinema/news/les-minions-devient-le-deuxieme-film-d-animation-le-plus-rentable-2984957/56222971-1-fre-FR/Les-Minions-devient-le-deuxieme-film-d-animation-le-plus-rentable.jpg',
                                uname: row.usr_uname,
                                bio: row.usr_bio,
                                like: likeStatus ? 'liked' : '',
                                age: row.usr_age,
                                score: row.usr_score,
                                distance: distance ? Math.round(distance * 100) / 100 : '',
                                connection: row.date
                            };
                            tempUser.interests = interestsSave.map(interest => interest.interest_name);

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

// Get all the infos of the compatible users
exports.getInfosMatch = (req, res, next) => {
    let matchingArray = [];
    let promiseArray = [];
    let tempUser = {};
    let loggedUserInfo;

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
                    let interestsSave;
                    let promise = Interest.getInterestsFromUserId(row.usr_id)
                        .then(interests => {
                            interestsSave = interests;
                            return (Like.findById(loggedUserInfo.id, row.usr_id));
                        })
                        .then(likeStatus => {
                            pointB = { longitude: Number(Math.round(row.usr_longitude + 'e4') + 'e-4'), latitude: Number(Math.round(row.usr_latitude + 'e4') + 'e-4') };
                            const distance = evalDistance({ ...pointA }, pointB); 
                            tempUser = {
                                id: row.usr_id,
                                photo: 'https://resize-elle.ladmedia.fr/r/625,,forcex/crop/625,437,center-middle,forcex,ffffff/img/var/plain_site/storage/images/loisirs/cinema/news/les-minions-devient-le-deuxieme-film-d-animation-le-plus-rentable-2984957/56222971-1-fre-FR/Les-Minions-devient-le-deuxieme-film-d-animation-le-plus-rentable.jpg',
                                uname: row.usr_uname,
                                bio: row.usr_bio,
                                like: likeStatus ? 'liked' : '',
                                age: row.usr_age,
                                score: row.usr_score,
                                distance: distance ? Math.round(distance * 100) / 100 : '',
                                connection: row.date
                                // disabled: row.usr_status
                            };
                            if (
                                tempUser.distance >= 300 ||
                                tempUser.score < loggedUserInfo.score - 20 ||
                                tempUser.score > loggedUserInfo.score + 20 ||
                                tempUser.age < loggedUserInfo.age - 10 ||
                                tempUser.age > loggedUserInfo.age + 10
                            ) {
                                return;
                            } else {
                                tempUser.interests = interestsSave.map(interest => interest.interest_name);
                                matchingArray.push(({ ...tempUser }));
                            }
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

// Get all the info about a given user
// user's uname should be pass as argument uname
exports.getOtherInfo = (req, res, next) => {
    const uname = req.query.uname;
    let userInfos;

    if (!uname) {
        throwError('Le nom de l\'utilisateur doit être envoyé', 422);
    }

    User.findByUsername(uname)
        .then(user => {
            if (!user) {
                throwError('Utilisateur inexistant', 422);
            }
            userInfos = {
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
            return (Interest.getInterestsFromUserId(user.usr_id));
        })
        .then(interests => {
            userInfos.interests = interests.map(interest => interest.interest_name);
            return (Like.findById(req.userId, userInfos.id));
        })
        .then(like => {
            userInfos.like = (like ? 1 : 0);
            return (Visit.countVisit(userInfos.id));
        })
        .then(visit => {
            userInfos.visit = visit.nb;
            return (Block.findById(req.userId, userInfos.id));
        })
        .then(block => {
            userInfos.block = (block ? 1 : 0);
            return userInfos;
        })
        .then(userInfos => {
            res.status(200).json({
                user: userInfos
            });
        })
        .catch(err => next(err));
};