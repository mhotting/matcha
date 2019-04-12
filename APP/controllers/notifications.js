// Controller of the notifications

const throwError = require('../util/error');
const Notifications = require('../models/notifications');

// Retrieve all the notifications of an user
exports.getNotifications = (req, res, next) => {
    const userId = req.userId;
    Notifications.getAll(userId)
        .then(([rows, fields]) => rows)
        .then(rows => {
            res.status(200).json({
                notifications: rows
            });
        })
        .catch(error => next(error));
};

// Retrieve the last five notifications of the connected user
exports.getLastNotifications = (req, res, next) => {
    const userId = req.userId;
    Notifications.getLast(userId)
        .then(([rows, fields]) => rows)
        .then(rows => {
            res.status(200).json({
                notifications: rows
            });
        })
        .catch(error => next(error));
};