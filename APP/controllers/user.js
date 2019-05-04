// Controller of all the users stuff

const User = require('../models/user');
const Interest = require('../models/interest');
const Images = require('../models/images');
const evalDistance = require('./../util/distance');
const Like = require('./../models/interactions/like');
const Visit = require('./../models/interactions/visit');
const Block = require('./../models/interactions/block');
const throwError = require('../util/error');
const geoloc = require('./../util/getLocation');

// Get all the infos from an user
exports.getInfos = (req, res, next) => {
    let userInfos;
    User.findById(req.userId)
        .then(user => {
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
            return Interest.getInterestsFromUserId(req.userId)
        })
        .then(interests => {
            userInfos.interests = interests.map(interest => interest.interest_name);
            return (Images.getAll(userInfos.id));
        })
        .then(userImages => {
            let imagesArray = [];
            for (let image of userImages) {
                imagesArray.push('http://localhost:8080/images/' + image.image_path);
            }
            userInfos.photos = imagesArray;
            return (userInfos);
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
                    let imagesSave;
                    let promise = Interest.getInterestsFromUserId(row.usr_id)
                        .then(interests => {
                            interestsSave = interests;
                            return (Images.getAll(row.usr_id));
                        })
                        .then(images => {
                            let imagesArray = [];
                            for (let image of images) {
                                imagesArray.push('http://localhost:8080/images/' + image.image_path);
                            }
                            imagesSave = imagesArray;
                            return (Like.findById(loggedUserInfo.id, row.usr_id));
                        })
                        .then(likeStatus => {
                            pointB = { longitude: Number(Math.round(row.usr_longitude + 'e4') + 'e-4'), latitude: Number(Math.round(row.usr_latitude + 'e4') + 'e-4') };
                            const distance = evalDistance({ ...pointA }, pointB);
                            tempUser = {
                                id: row.usr_id,
                                uname: row.usr_uname,
                                bio: row.usr_bio,
                                like: likeStatus ? 'liked' : '',
                                age: row.usr_age,
                                score: row.usr_score,
                                distance: distance ? Math.round(distance * 100) / 100 : '',
                                connection: row.date,
                                photos: imagesSave
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

// Get all the infos of the matching users
exports.getInfosMatch = (req, res, next) => {
    let matchingArray = [];
    let promiseArray = [];
    let tempUser = {};
    let imagesSave;
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
                            return (Images.getAll(row.usr_id));
                        })
                        .then(images => {
                            let imagesArray = [];
                            for (let image of images) {
                                imagesArray.push('http://localhost:8080/images/' + image.image_path);
                            }
                            imagesSave = imagesArray;
                            return (Like.findById(loggedUserInfo.id, row.usr_id));
                        })
                        .then(likeStatus => {
                            pointB = { longitude: Number(Math.round(row.usr_longitude + 'e4') + 'e-4'), latitude: Number(Math.round(row.usr_latitude + 'e4') + 'e-4') };
                            const distance = evalDistance({ ...pointA }, pointB);
                            tempUser = {
                                id: row.usr_id,
                                uname: row.usr_uname,
                                bio: row.usr_bio,
                                like: likeStatus ? 'liked' : '',
                                age: row.usr_age,
                                score: row.usr_score,
                                distance: distance ? Math.round(distance * 100) / 100 : '',
                                connection: row.date,
                                photos: imagesSave
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
    const uname = req.params.uname;
    let userInfos;
    let userSave;

    if (!uname) {
        throwError('Le nom de l\'utilisateur doit être envoyé', 422);
    }

    User.findByUsername(uname)
        .then(user => {
            if (!user) {
                throwError('Utilisateur inexistant', 422);
            }
            userSave = user;
            userInfos = {
                id: user.usr_id,
                uname: user.usr_uname,
                fname: user.usr_fname,
                lname: user.usr_lname,
                age: user.usr_age,
                bio: user.usr_bio,
                score: user.usr_score,
                distance: 5, // en km
                connection: user.usr_connectionDate,
                reported: true,
                didLikeMe: true,
                gender: user.usr_gender,
                orientation: user.usr_orientation
            };
            return (Interest.getInterestsFromUserId(user.usr_id));
        })
        .then(interests => {
            userInfos.interests = interests.map(interest => interest.interest_name);
            return (geoloc(userSave.usr_latitude, userSave.usr_longitude));
        })
        .then(location => {
            userInfos.location = location;
            return (Like.findById(req.userId, userInfos.id));
        })
        .then(like => {
            userInfos.like = (like ? 'liked' : '');
            return (Visit.countVisit(userInfos.id));
        })
        .then(visit => {
            userInfos.visit = visit.nb;
            return (Block.findById(req.userId, userInfos.id));
        })
        .then(block => {
            userInfos.blocked = (block ? true : false);
            return (Images.getAll(userInfos.id));
        })
        .then(images => {
            let imagesArray = [];
            for (let image of images) {
                imagesArray.push('http://localhost:8080/images/' + image.image_path);
            }
            userInfos.photos = imagesArray;
            return (userInfos);
        })
        .then(userInfos => {
            res.status(200).json({
                user: userInfos
            });
        })
        .catch(err => next(err));
    // la derniere date de connection
    // la distance et la localisation
    // si il a ete signale par l'utilsateur connecte
    // si cet user a like l'utiliatseur connecte
    // Au boulot flemmard !!!
};
