const User = require('../models/user');
const Interest = require('../models/interest');

exports.getInfos = (req, res, next) => {
    User.findById(req.userId)
    .then(user => {
        const userInfos = {
            id: user.usr_id,
            uname: user.usr_uname,
            fname: user.usr_fname,
            lname: user.usr_lname,
            email: user.usr_email,
            age: user.usr_age,
            gender: user.usr_gender,
            bio: user.usr_bio,
            location: user.usr_location,
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
