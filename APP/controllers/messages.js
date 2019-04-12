// Controller of the messages

const throwError = require('../util/error');
const User = require('../models/user');
const Message = require('../models/messages');

// Retrieve all the conversations for a given user
// Conversations are available only for matching people
exports.getConvs = (req, res, next) => {
    res.status(400).json({
        message: 'en cours de maintenance'
    });
}

// Retrieve the conversaiton between two users
exports.getMessagesUser = (req, res, next) => {
    const username = req.params.uname;
    
    User.findByUsername(username)
        .then(sndUser=> {
            if (!sndUser)
                throwError('Utilisateur inexistant', 400);
            return Message.getAll(req.userId, sndUser.usr_id);
        })
        .then(messages => {
            res.status(200).json({
                messages: messages
            });
        })
        .catch(err => next(err));
};


// Store a message in the DB
exports.postMessage = (req, res, next) => {
    const username = req.params.uname;
    const content = req.body.content;
    
    if (!content || typeof content !== 'string')
        throwError('Message invalide', 422);
    User.findByUsername(username)
        .then(sndUser => {
            if (!sndUser)
                throwError('Utilisateur inexistant', 400);
            const message = new Message(content, req.userId, sndUser.usr_id);
            return message.create();
        })
        .then(() => {
            res.status(201).json({
                message: 'Le message a bien été créé'
            });
        })
        .catch(err => next(err));
};
