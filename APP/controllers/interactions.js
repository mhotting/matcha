// Controller of the interactions

const Interaction = require('./../models/interaction');
const throwError = require('./../util/error');

// PUT '/interact/block'
exports.putBlock = (req, res, next) => {
    const userId = req.body.userId;
    const otherId = req.body.otherId;

    Interaction.addBlock(userId, otherId)
        .then(result => {
            res.status(201).json({
                message: "Block added"
            });
        })
        .catch(err => next(err));
};

// DELETE '/interact/block'
exports.deleteBlock = (req, res, next) => {
    const userId = req.body.userId;
    const otherId = req.body.otherId;

    Interaction.deleteBlock(userId, otherId)
        .then(result => {
            res.status(202).json({
                message: "Block removed"
            });
        })
        .catch(err => next(err));
};

// PUT '/interact/like'
exports.putLike = (req, res, next) => {
    const userId = req.body.userId;
    const otherId = req.body.otherId;

    Interaction.addLike(userId, otherId)
        .then(result => {
            res.status(202).json({
                message: "Like added"
            });
        })
        .catch(err => next(err));
};

// DELETE '/interact/like'
exports.deleteLike = (req, res, next) => {
    const userId = req.body.userId;
    const otherId = req.body.otherId;

    Interaction.deleteLike(userId, otherId)
        .then(result => {
            res.status(202).json({
                message: "Like removed"
            });
        })
        .catch(err => next(err));
};

// PUT '/interact/visit'
exports.putVisit = (req, res, next) => {

};

// PUT '/interact/report'
exports.putReport = (req, res, next) => {
    const userId = req.body.userId;
    const otherId = req.body.otherId;

    Interaction.addReport(userId, otherId)
        .then(result => {
            res.status(201).json({
                message: "Report added"
            });
        })
        .catch(err => next(err));
};

// DELETE '/interact/report'
exports.deleteReport = (req, res, next) => {
    const userId = req.body.userId;
    const otherId = req.body.otherId;

    Interaction.deleteReport(userId, otherId)
        .then(result => {
            res.status(202).json({
                message: "Report removed"
            });
        })
        .catch(err => next(err));
};
