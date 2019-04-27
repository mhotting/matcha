// Controller of the interactions

const Block = require('./../models/interactions/block');
const Report = require('./../models/interactions/report');
const Like = require('./../models/interactions/like');
const Visit = require('./../models/interactions/visit');

// PUT '/interact/block'
// Record a block in the DB
exports.putBlock = (req, res, next) => {
    const userId = req.userId;
    const otherId = req.body.otherId;

    Block.addBlock(userId, otherId)
        .then(result => {
            res.status(201).json({
                message: "Block added"
            });
        })
        .catch(err => next(err));
};

// DELETE '/interact/block'
// Delete a block from the DB
exports.deleteBlock = (req, res, next) => {
    const userId = req.userId;
    const otherId = req.body.otherId;

    Block.deleteBlock(userId, otherId)
        .then(result => {
            res.status(202).json({
                message: "Block removed"
            });
        })
        .catch(err => next(err));
};

// PUT '/interact/like'
// Record a like in the DB and a match if necessary
exports.putLike = (req, res, next) => {
    const userId = req.userId.toString();
    const otherId = req.body.otherId;

    Like.addLike(userId, otherId)
        .then(result => {
            res.status(202).json({
                message: "Like added"
            });
        })
        .catch(err => next(err));
};

// DELETE '/interact/like'
// Remove a like from DB and the corresponding match if necessary
exports.deleteLike = (req, res, next) => {
    const userId = req.userId;
    const otherId = req.body.otherId;

    Like.deleteLike(userId, otherId)
        .then(result => {
            res.status(202).json({
                message: "Like removed"
            });
        })
        .catch(err => next(err));
};

// PUT '/interact/report'
// Record a report in the DB
exports.putReport = (req, res, next) => {
    const userId = req.userId;
    const otherId = req.body.otherId;

    Report.addReport(userId, otherId)
        .then(result => {
            res.status(201).json({
                message: "Report added"
            });
        })
        .catch(err => next(err));
};

// DELETE '/interact/report'
// Remove a report from the DB
exports.deleteReport = (req, res, next) => {
    const userId = req.userId;
    const otherId = req.body.otherId;

    Report.deleteReport(userId, otherId)
        .then(result => {
            res.status(202).json({
                message: "Report removed"
            });
        })
        .catch(err => next(err));
};

// PUT '/interact/visit'
// Record a visit in the DB - if first visit the user is created else the user counter is increased
// If id of visitor is the same than id of visited, nothing happens
exports.putVisit = (req, res, next) => {
    const userId = req.userId;
    const otherId = req.body.otherId;

    if (userId === otherId) {
        return (res.status(202).json({
            message: "No visit"
        }));
    }

    Visit.addVisit(userId, otherId)
        .then(result => {
            res.status(202).json({
                message: "Visit Added"
            });
        })
        .catch(err => next(err));
};
