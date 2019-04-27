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
        .then(rows => {
            res.status(200).json({
                notifications: rows
            });
        })
        .catch(error => next(error));
};

// Count the notifications from a given user
exports.getCountNotifications = (req, res, next) => {
    const userId = req.userId;
    Notifications.countByUser(userId)
        .then(row => {
            res.status(200).json({
                count: row['nb']
            });
        })
        .catch(error => next(error));
}

// Set a given notification as read/unread, according to its id
// Id is checked in notification model
// Need to receive a state property (0 or 1) to set as read (1) or unread (0)
exports.putReadOne = (req, res, next) => {
    const userId = req.userId;
    const idNotif = req.body.idNotif;
    const state = req.body.state;

    Notifications.setReadNotification(userId, idNotif, state)
        .then(row => {
            res.status(200).json({
                message: 'Notification mise à jour'
            });
        })
        .catch(error => next(error));
}

// Set all the notifications from an user as read
exports.putReadAll = (req, res, next) => {
    const userId = req.userId;

    Notifications.setAllReadNotification(userId)
        .then(row => {
            res.status(200).json({
                message: 'Notifications lues'
            });
        })
        .catch(error => next(error));
}
